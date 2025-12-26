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
const TH_BOUNDS = L.latLngBounds(L.latLng(5.61, 97.34), L.latLng(20.47, 105.64));

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

        // ✅ เพิ่ม class is-loading ตอนกำลังดึงตำแหน่ง
        const btnClass = loading ? "lx-locate-btn is-loading" : "lx-locate-btn";
        const btn = L.DomUtil.create("a", btnClass, container);

        btn.href = "#";
        btn.title = title;
        btn.setAttribute("role", "button");
        btn.setAttribute("aria-label", title);
        btn.setAttribute("aria-disabled", disabled ? "true" : "false");
        btn.setAttribute("aria-busy", loading ? "true" : "false");

        // กัน map drag/zoom ตอนกด
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        const clickHandler = (e) => {
          e.preventDefault();
          if (disabled) return;
          onClick?.();
        };

        btn.addEventListener("click", clickHandler);

        // cleanup
        container._cleanup = () => btn.removeEventListener("click", clickHandler);
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
  initialPosition, // {lat,lng} สำหรับ reset

  onChange,
  onAddressChange, // ({displayName, address, raw})
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

  // toolbar state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // gps
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  // reverse geocode UI
  const [addrText, setAddrText] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);

  // reverse debounce
  const reverseTimerRef = useRef(null);
  const lastReverseKeyRef = useRef("");

  const center = useMemo(() => [pos.lat, pos.lng], [pos]);

  const commit = (nextRaw) => {
    const next = restrictToThailand ? clampToBounds(nextRaw) : nextRaw;
    setPos(next);
    onChange?.(next);
  };

  // sync from parent (input lat/lng)
  useEffect(() => {
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;
    const next = { lat: Number(lat), lng: Number(lng) };
    const safe = restrictToThailand ? clampToBounds(next) : next;
    setPos(safe);
    onChange?.(safe);
  }, [lat, lng, restrictToThailand]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== Reverse Geocode (Nominatim reverse) =====
  const reverseGeocode = async ({ lat, lng }) => {
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
    if (!onAddressChange) return;

    if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current);
    reverseTimerRef.current = setTimeout(() => {
      reverseGeocode({ lat: pos.lat, lng: pos.lng });
    }, 450);

    return () => {
      if (reverseTimerRef.current) clearTimeout(reverseTimerRef.current);
    };
  }, [pos.lat, pos.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== Actions =====
  const handleReset = () => commit(initialRef.current);

  // ✅ กดแล้ว setLoading ให้เห็นว่ากำลังดึงตำแหน่ง
  const handleLocateMe = () => {
    if (!enableGPS) return;
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
    if (!enableSearch) return;
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

  return (
    <div className={className}>
      <div ref={mapWrapRef} className="lx-map-wrap" style={{ height }}>
        {/* ✅ overlay อยู่ใน map 100% */}
        <div className="lx-map-overlay">
          <div className="lx-map-overlay-inner">
            {enableSearch && (
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

            {/* ✅ เหลือแค่รีเซ็ต (ปุ่ม GPS ย้ายไปไอคอนล่างขวาแล้ว) */}
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

          {/* results dropdown */}
          {enableSearch && results.length > 0 && (
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

        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
          zoomControl={false}
          whenCreated={(map) => {
            setTimeout(() => map.invalidateSize(), 0);
            setTimeout(() => map.invalidateSize(), 180);
          }}
          maxBounds={restrictToThailand ? TH_BOUNDS : undefined}
          maxBoundsViscosity={restrictToThailand ? 1.0 : undefined}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FixLeafletSize containerRef={mapWrapRef} />
          <Recenter center={center} zoom={zoom} />
          <ClickToMove enabled={clickToMove && draggable} onPick={commit} />

          {/* ✅ ปุ่มล่างขวา */}
          <BottomRightZoomControl />

          {enableGPS && (
            <BottomRightLocateControl
              onClick={handleLocateMe}
              disabled={locating}
              loading={locating} // ✅ ส่งให้ปุ่มติด class is-loading
              title={locating ? "กำลังหา GPS..." : "ใช้ตำแหน่งฉัน"}
            />
          )}

          <Marker
            position={[pos.lat, pos.lng]}
            draggable={draggable}
            icon={markerIcon}
            eventHandlers={{
              dragend: (e) => {
                if (!draggable) return;
                const latlng = e.target.getLatLng();
                commit({ lat: latlng.lat, lng: latlng.lng });
              },
            }}
          />
        </MapContainer>

        {/* info box ล่างซ้าย */}
        {(onAddressChange || geoError) && (
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
