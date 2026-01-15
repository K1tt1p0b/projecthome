"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ===== Marker Icon Fix =====
const markerIcon = new L.Icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ===== Thailand bounds (approx) =====
const TH_BOUNDS = L.latLngBounds(
  L.latLng(5.61, 97.34),
  L.latLng(20.47, 105.64)
);

// ✅ เพิ่ม: ขยาย bounds ออกนิดนึงเพื่อให้ autoPan ของ Popup ทำงานได้ (กันโดนตัด)
const SAFE_TH_BOUNDS = TH_BOUNDS.pad(0.12); // ปรับได้: 0.10 - 0.20

function clampToBounds({ lat, lng }, bounds = TH_BOUNDS) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return {
    lat: Math.min(Math.max(lat, sw.lat), ne.lat),
    lng: Math.min(Math.max(lng, sw.lng), ne.lng),
  };
}

function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

function ClickToMove({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      onPick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FixLeafletSize({ containerRef }) {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 0);
    const t2 = setTimeout(() => map.invalidateSize(), 180);

    let ro;
    if (containerRef?.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(containerRef.current);
    }

    const onWinResize = () => map.invalidateSize();
    window.addEventListener("resize", onWinResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", onWinResize);
      if (ro) ro.disconnect();
    };
  }, [map, containerRef]);

  return null;
}

// ✅ Zoom control ล่างขวา
function BottomRightZoomControl() {
  const map = useMap();
  useEffect(() => {
    const ctrl = L.control.zoom({ position: "bottomright" });
    ctrl.addTo(map);
    return () => ctrl.remove();
  }, [map]);
  return null;
}

// ✅ Locate control (ไอคอน) ล่างขวา
function BottomRightLocateControl({
  onClick,
  disabled = false,
  loading = false,
  title = "ใช้ตำแหน่งฉัน",
}) {
  const map = useMap();

  useEffect(() => {
    const LocateControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd() {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar lx-locate-control"
        );
        const btnClass = loading ? "lx-locate-btn is-loading" : "lx-locate-btn";
        const btn = L.DomUtil.create("a", btnClass, container);

        btn.href = "#";
        btn.title = title;
        btn.setAttribute("role", "button");
        btn.setAttribute("aria-label", title);
        btn.setAttribute("aria-disabled", disabled ? "true" : "false");
        btn.setAttribute("aria-busy", loading ? "true" : "false");

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        const clickHandler = (e) => {
          e.preventDefault();
          if (disabled) return;
          onClick?.();
        };

        btn.addEventListener("click", clickHandler);
        container._cleanup = () =>
          btn.removeEventListener("click", clickHandler);

        return container;
      },
      onRemove(control) {
        if (control?._container?._cleanup) control._container._cleanup();
      },
    });

    const ctrl = new LocateControl();
    ctrl.addTo(map);

    return () => ctrl.remove();
  }, [map, onClick, disabled, loading, title]);

  return null;
}

// ✅ Fullscreen control (ล่างขวา)
function BottomRightFullscreenControl({ enabled, isOn, onToggle }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

    const FullscreenControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd() {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar lx-fullscreen-control"
        );
        const btn = L.DomUtil.create("a", "lx-fullscreen-btn", container);

        btn.href = "#";
        btn.title = isOn ? "ออกจากเต็มหน้าจอ" : "เต็มหน้าจอ";
        btn.setAttribute("role", "button");
        btn.setAttribute("aria-label", btn.title);

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        const clickHandler = (e) => {
          e.preventDefault();
          onToggle?.();
        };

        btn.addEventListener("click", clickHandler);
        container._cleanup = () =>
          btn.removeEventListener("click", clickHandler);

        return container;
      },
      onRemove(control) {
        if (control?._container?._cleanup) control._container._cleanup();
      },
    });

    const ctrl = new FullscreenControl();
    ctrl.addTo(map);

    return () => ctrl.remove();
  }, [map, enabled, isOn, onToggle]);

  return null;
}

/**
 * ✅ Universal Zoom Guard (Mouse + Trackpad + Pinch)
 *
 * เป้าหมาย:
 * - Mouse wheel: ต้องกด Ctrl ถึงซูม (กัน browser zoom)
 * - Trackpad pinch: ให้ซูม map ได้ (ถือว่า intent ซูม) + กัน browser zoom
 * - Trackpad scroll ธรรมดา: ไม่ซูม map (ให้เว็บเลื่อนได้) + hint
 *
 * หลักการ:
 * - ปิด scrollWheelZoom ของ Leaflet ไว้เป็น default
 * - จับ event ที่ container ด้วย capture + passive:false เพื่อ preventDefault ได้
 * - ถ้า detect ว่าเป็น "intent zoom" => enable ชั่วคราว + preventDefault
 */
function UniversalZoomGuard({
  enabled,
  requireCtrl = true,
  hintText = "กด Ctrl + Scroll เพื่อซูมแผนที่",
}) {
  const map = useMap();

  useEffect(() => {
    // reset
    map.scrollWheelZoom.disable();

    if (!enabled) return;

    const container = map.getContainer();
    if (!container) return;

    container.setAttribute("data-wheel-hint", hintText);

    // hint UI
    const showHint = () => {
      container.classList.add("lx-wheel-hint");
      window.clearTimeout(container._lxHintTimer);
      container._lxHintTimer = window.setTimeout(() => {
        container.classList.remove("lx-wheel-hint");
      }, 900);
    };

    let disableTimer = null;
    const enableTemporarily = () => {
      map.scrollWheelZoom.enable();
      if (disableTimer) window.clearTimeout(disableTimer);
      disableTimer = window.setTimeout(() => {
        map.scrollWheelZoom.disable();
      }, 220);
    };

    /**
     * ตรวจว่าเป็น "trackpad pinch zoom" หรือไม่
     * - บน Mac/Chrome pinch มักมาเป็น wheel event ที่ ctrlKey=true
     * - deltaY มักเล็กมากและ continuous
     */
    const looksLikePinchZoom = (e) => {
      // ctrlKey true บน Mac pinch เป็น common behavior
      if (!e.ctrlKey) return false;

      // deltaMode 0 = pixels (trackpad) / 1 = lines (mouse wheel)
      // pinch/trackpad มักเป็น pixels และ deltaY เล็กต่อเนื่อง
      const isPixels = e.deltaMode === 0;
      const smallDelta = Math.abs(e.deltaY) < 120; // heuristic
      return isPixels && smallDelta;
    };

    /**
     * จัดการ wheel:
     * - ถ้า requireCtrl:
     *    - ctrlKey => ซูม map + preventDefault (กัน browser zoom)
     *    - ไม่ ctrl => ไม่ซูม map (ปล่อยเว็บเลื่อน) + hint
     * - ถ้าไม่ requireCtrl:
     *    - ให้ซูม map ปกติ แต่ก็กัน browser zoom เฉพาะกรณี ctrlKey (เพื่อไม่ให้ page zoom)
     */
    const onWheelCapture = (e) => {
      const isPinch = looksLikePinchZoom(e);

      // ✅ กรณี "ตั้งใจซูม" (ctrl+wheel หรือ pinch)
      const wantsZoom = requireCtrl ? e.ctrlKey || isPinch : true;

      if (wantsZoom) {
        // กัน browser zoom เมื่อมี ctrlKey (รวม pinch)
        if (e.ctrlKey || isPinch) e.preventDefault();
        enableTemporarily();
        return;
      }

      // ไม่ได้ตั้งใจซูม map -> ปล่อยให้หน้า scroll ได้
      map.scrollWheelZoom.disable();
      showHint();
    };

    // ✅ สำคัญ: passive:false เพื่อ preventDefault ได้
    container.addEventListener("wheel", onWheelCapture, {
      capture: true,
      passive: false,
    });

    /**
     * ✅ กัน "Keyboard Zoom" (Ctrl + / Ctrl - / Ctrl 0) ตอนโฟกัสอยู่บน map
     * วิธีนี้ช่วยลดเคสผู้ใช้กดคีย์ลัดแล้วหน้า zoom
     * (ถ้าไม่ต้องการ เอา block นี้ออกได้)
     */
    const onKeyDownCapture = (e) => {
      if (!container.matches(":hover")) return;
      if (!e.ctrlKey && !e.metaKey) return;

      const k = String(e.key || "").toLowerCase();
      const isZoomKey = k === "+" || k === "=" || k === "-" || k === "0";
      if (isZoomKey) {
        // กัน page zoom เฉพาะตอน hover map
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDownCapture, {
      capture: true,
      passive: false,
    });

    return () => {
      map.scrollWheelZoom.disable();
      container.removeEventListener("wheel", onWheelCapture, { capture: true });
      window.removeEventListener("keydown", onKeyDownCapture, { capture: true });

      if (disableTimer) window.clearTimeout(disableTimer);
      if (container._lxHintTimer) window.clearTimeout(container._lxHintTimer);

      container.removeAttribute("data-wheel-hint");
      container.classList.remove("lx-wheel-hint");
    };
  }, [enabled, requireCtrl, hintText, map]);

  return null;
}

export default function LeafletMapClient({
  lat = 13.9869,
  lng = 100.6184,
  zoom = 14,
  height = 550,
  className = "w-100",

  draggable = true,
  clickToMove = true,

  enableSearch = true,
  enableGPS = true,

  restrictToThailand = true,
  initialPosition,

  onChange,
  onAddressChange,

  mode = "picker", // "picker" | "display"
  children,
  showOverlay,
  showPickerMarker,
  scrollWheelZoom,
  minZoom,
  maxZoom,

  requireCtrlToZoom = true,
  enableFullscreen = true,
  wheelHintText = "กด Ctrl + Scroll เพื่อซูมแผนที่",
}) {
  const mapWrapRef = useRef(null);

  const initialRef = useRef(
    initialPosition?.lat != null && initialPosition?.lng != null
      ? { lat: Number(initialPosition.lat), lng: Number(initialPosition.lng) }
      : { lat: Number(lat), lng: Number(lng) }
  );

  const [pos, setPos] = useState(() => {
    const base = { lat: Number(lat), lng: Number(lng) };
    return restrictToThailand ? clampToBounds(base) : base;
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  const [addrText, setAddrText] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const reverseTimerRef = useRef(null);
  const lastReverseKeyRef = useRef("");

  const center = useMemo(() => [pos.lat, pos.lng], [pos]);

  const isDisplay = mode === "display";

  const _showOverlay = showOverlay ?? !isDisplay;
  const _showPickerMarker = showPickerMarker ?? !isDisplay;

  const _enableSearch = isDisplay ? false : enableSearch;
  const _enableGPS = isDisplay ? false : enableGPS;

  const _draggable = isDisplay ? false : draggable;
  const _clickToMove = isDisplay ? false : clickToMove;

  const _wantWheelZoom = scrollWheelZoom ?? (isDisplay ? true : false);

  const commit = (nextRaw) => {
    const next = restrictToThailand ? clampToBounds(nextRaw) : nextRaw;
    setPos(next);
    onChange?.(next);
  };

  useEffect(() => {
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;
    const next = { lat: Number(lat), lng: Number(lng) };
    const safe = restrictToThailand ? clampToBounds(next) : next;
    setPos(safe);
    onChange?.(safe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, restrictToThailand]);

  const reverseGeocode = async ({ lat, lng }) => {
    if (!_showOverlay) return;
    if (!onAddressChange) return;

    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (lastReverseKeyRef.current === key) return;
    lastReverseKeyRef.current = key;

    setAddrLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lng)}`;

      const res = await fetch(url, { headers: { "Accept-Language": "th" } });
      const data = await res.json();

      const displayName = data?.display_name || "";
      const address = data?.address || {};

      setAddrText(displayName);
      onAddressChange?.({ displayName, address, raw: data });
    } catch {
      // ignore
    } finally {
      setAddrLoading(false);
    }
  };

  useEffect(() => {
    if (!_showOverlay) return;
    if (!onAddressChange) return;

    if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current);
    reverseTimerRef.current = setTimeout(() => {
      reverseGeocode({ lat: pos.lat, lng: pos.lng });
    }, 450);

    return () => {
      if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos.lat, pos.lng]);

  const handleReset = () => commit(initialRef.current);

  const handleLocateMe = () => {
    if (!_enableGPS) return;
    if (typeof window === "undefined") return;

    if (!navigator.geolocation) {
      setGeoError("เบราว์เซอร์นี้ไม่รองรับ GPS");
      return;
    }

    setLocating(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (p) => {
        commit({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setGeoError(
          err.code === 1
            ? "ไม่ได้รับอนุญาตให้ใช้ตำแหน่ง (กรุณากด Allow Location)"
            : "ดึงตำแหน่งไม่สำเร็จ ลองใหม่อีกครั้ง"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearResults = () => setResults([]);

  const searchPlace = async () => {
    if (!_enableSearch) return;
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=th&q=${encodeURIComponent(
        q
      )}`;

      const res = await fetch(url, { headers: { "Accept-Language": "th" } });
      const data = await res.json();

      setResults(
        (data || [])
          .map((x) => ({
            display: x.display_name,
            lat: Number(x.lat),
            lng: Number(x.lon),
          }))
          .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng))
      );
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const toggleFullscreen = () => setIsFullscreen((v) => !v);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  return (
    <div className={className}>
      <div
        ref={mapWrapRef}
        className={`lx-map-wrap ${isFullscreen ? "is-fullscreen" : ""}`}
        style={{ height: isFullscreen ? "100vh" : height }}
      >
        {_showOverlay && (
          <div className="lx-map-overlay">
            <div className="lx-map-overlay-inner">
              {_enableSearch && (
                <div className="lx-map-search">
                  <input
                    className="form-control"
                    value={query}
                    placeholder="ค้นหาที่อยู่/สถานที่ เช่น 'ฟิวเจอร์พาร์ครังสิต'"
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        searchPlace();
                      }
                      if (e.key === "Escape") clearResults();
                    }}
                  />
                  <button
                    type="button"
                    className="ud-btn btn-thm"
                    onClick={searchPlace}
                    disabled={searching}
                  >
                    {searching ? "กำลังค้นหา..." : "ค้นหา"}
                  </button>
                </div>
              )}

              <div className="lx-map-actions">
                <button
                  type="button"
                  className="ud-btn btn-light"
                  onClick={handleReset}
                >
                  รีเซ็ตตำแหน่ง
                </button>
              </div>
            </div>

            {_enableSearch && results.length > 0 && (
              <div className="lx-map-results">
                {results.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="lx-map-result-item"
                    onClick={() => {
                      commit({ lat: r.lat, lng: r.lng });
                      clearResults();
                    }}
                  >
                    {r.display}
                  </button>
                ))}
                <div className="lx-map-results-footer">
                  <button
                    type="button"
                    className="ud-btn btn-light"
                    onClick={clearResults}
                  >
                    ปิดผลลัพธ์
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          // ✅ ปิด wheel zoom ไว้ก่อน แล้วให้ Guard เปิดชั่วคราวเอง
          scrollWheelZoom={false}
          whenCreated={(map) => {
            setTimeout(() => map.invalidateSize(), 0);
            setTimeout(() => map.invalidateSize(), 180);
          }}
          // ✅ แก้: ใช้ SAFE_TH_BOUNDS แทน TH_BOUNDS (กัน autoPan ตันแล้ว popup ถูกตัด)
          maxBounds={restrictToThailand ? SAFE_TH_BOUNDS : undefined}
          maxBoundsViscosity={restrictToThailand ? 1.0 : undefined}
          // ✅ เพิ่ม: เผื่อพื้นที่ด้านบนให้ popup (กันโดน header ทับ/โดนตัด)
          popupOptions={{
            autoPanPaddingTopLeft: [16, 120],
            autoPanPaddingBottomRight: [16, 16],
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FixLeafletSize containerRef={mapWrapRef} />
          <Recenter center={center} zoom={zoom} />

          <UniversalZoomGuard
            enabled={_wantWheelZoom}
            requireCtrl={requireCtrlToZoom}
            hintText={wheelHintText}
          />

          <ClickToMove enabled={_clickToMove && _draggable} onPick={commit} />

          <BottomRightZoomControl />

          {enableFullscreen && (
            <BottomRightFullscreenControl
              enabled={true}
              isOn={isFullscreen}
              onToggle={toggleFullscreen}
            />
          )}

          {_enableGPS && (
            <BottomRightLocateControl
              onClick={handleLocateMe}
              disabled={locating}
              loading={locating}
              title={locating ? "กำลังหา GPS..." : "ใช้ตำแหน่งฉัน"}
            />
          )}

          {children}

          {_showPickerMarker && (
            <Marker
              position={[pos.lat, pos.lng]}
              draggable={_draggable}
              icon={markerIcon}
              eventHandlers={{
                dragend: (e) => {
                  if (!_draggable) return;
                  const latlng = e.target.getLatLng();
                  commit({ lat: latlng.lat, lng: latlng.lng });
                },
              }}
            />
          )}
        </MapContainer>

        {_showOverlay && (onAddressChange || geoError) && (
          <div className="lx-map-infobox">
            {onAddressChange && (
              <div className="lx-map-info-card">
                <div className="lx-map-info-title">
                  {addrLoading ? "กำลังอ่านที่อยู่..." : "ที่อยู่โดยประมาณ"}
                </div>
                <div className="lx-map-info-text">{addrText || "—"}</div>
              </div>
            )}

            {geoError ? (
              <div className="lx-map-info-card" style={{ marginTop: 10 }}>
                <div className="lx-map-info-text">{geoError}</div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
