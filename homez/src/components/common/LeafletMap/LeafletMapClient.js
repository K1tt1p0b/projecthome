"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";

// ✅ ใช้ Popup UI กลาง
import MarkerPopupCard from "@/components/common/map/MarkerPopupCard";

// ===== Marker Icon Fix =====
const markerIcon = new L.Icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ===== Thailand bounds (approx) =====
const TH_BOUNDS = L.latLngBounds(L.latLng(5.61, 97.34), L.latLng(20.47, 105.64));
const SAFE_TH_BOUNDS = TH_BOUNDS.pad(0.12);

function clampToBounds({ lat, lng }, bounds = TH_BOUNDS) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return {
    lat: Math.min(Math.max(lat, sw.lat), ne.lat),
    lng: Math.min(Math.max(lng, sw.lng), ne.lng),
  };
}

// ✅ ปัดทศนิยมไม่เกิน 4 ตำแหน่ง
const roundTo = (n, digits = 4) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return num;
  const p = Math.pow(10, digits);
  return Math.round(num * p) / p;
};

const normalizeLatLng = ({ lat, lng }, digits = 4) => ({
  lat: roundTo(lat, digits),
  lng: roundTo(lng, digits),
});

// ✅ Haversine distance (km)
function haversineKm(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
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
        const container = L.DomUtil.create("div", "leaflet-bar lx-locate-control");
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

// ✅ Fullscreen control (ล่างขวา)
function BottomRightFullscreenControl({ enabled, isOn, onToggle }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

    const FullscreenControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd() {
        const container = L.DomUtil.create("div", "leaflet-bar lx-fullscreen-control");
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
          setTimeout(() => map.invalidateSize(), 60);
          setTimeout(() => map.invalidateSize(), 180);
        };

        btn.addEventListener("click", clickHandler);
        container._cleanup = () => btn.removeEventListener("click", clickHandler);

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

// ✅ Near Me control (ค้นหาทรัพย์สินใกล้ฉัน)
function BottomRightNearMeControl({ enabled, title = "ใกล้ฉัน", onClick, loading }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

    const NearMeControl = L.Control.extend({
      options: { position: "bottomright" },
      onAdd() {
        const container = L.DomUtil.create("div", "leaflet-bar lx-nearme-control");
        const btnClass = loading ? "lx-nearme-btn is-loading" : "lx-nearme-btn";
        const btn = L.DomUtil.create("a", btnClass, container);

        btn.href = "#";
        btn.title = title;
        btn.setAttribute("role", "button");
        btn.setAttribute("aria-label", title);
        btn.setAttribute("aria-busy", loading ? "true" : "false");

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        const clickHandler = (e) => {
          e.preventDefault();
          if (loading) return;
          onClick?.();
          setTimeout(() => map.invalidateSize(), 60);
        };

        btn.addEventListener("click", clickHandler);
        container._cleanup = () => btn.removeEventListener("click", clickHandler);

        return container;
      },
      onRemove(control) {
        if (control?._container?._cleanup) control._container._cleanup();
      },
    });

    const ctrl = new NearMeControl();
    ctrl.addTo(map);

    return () => ctrl.remove();
  }, [map, enabled, title, onClick, loading]);

  return null;
}

/**
 * ✅ Universal Zoom Guard (Ctrl+Scroll)
 */
function UniversalZoomGuard({
  enabled,
  requireCtrl = true,
  hintText = "กด Ctrl + Scroll เพื่อซูมแผนที่",
}) {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.disable();
    if (!enabled) return;

    const container = map.getContainer();
    if (!container) return;

    container.setAttribute("data-wheel-hint", hintText);

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

    const looksLikePinchZoom = (e) => {
      if (!e.ctrlKey) return false;
      const isPixels = e.deltaMode === 0;
      const smallDelta = Math.abs(e.deltaY) < 120;
      return isPixels && smallDelta;
    };

    const onWheelCapture = (e) => {
      const isPinch = looksLikePinchZoom(e);
      const wantsZoom = requireCtrl ? e.ctrlKey || isPinch : true;

      if (wantsZoom) {
        if (e.ctrlKey || isPinch) e.preventDefault();
        enableTemporarily();
        return;
      }

      map.scrollWheelZoom.disable();
      showHint();
    };

    container.addEventListener("wheel", onWheelCapture, {
      capture: true,
      passive: false,
    });

    const onKeyDownCapture = (e) => {
      if (!container.matches(":hover")) return;
      if (!e.ctrlKey && !e.metaKey) return;

      const k = String(e.key || "").toLowerCase();
      const isZoomKey = k === "+" || k === "=" || k === "-" || k === "0";
      if (isZoomKey) e.preventDefault();
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

// ===== Helpers =====
const toFixed6 = (v) => (Number.isFinite(Number(v)) ? Number(v).toFixed(6) : "");

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("คัดลอกพิกัดแล้ว");
  } catch {
    toast.error("คัดลอกไม่สำเร็จ");
  }
};

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
  wheelHintText = "กด Ctrl + Scroll Mouse ขึ้นลงเพื่อซูมแผนที่",

  // ✅ Nearby (ใกล้ฉัน)
  enableNearMe = true,
  nearMeRadiusKm = 5,
  nearMeLimit = 10,
  /**
   * nearbyItems: รายการทรัพย์สินที่ใช้คำนวณใกล้ฉัน
   * รูปแบบขั้นต่ำที่ต้องมี:
   * [{ id, title?, lat, lng, ... }]
   */
  nearbyItems = [],

  // ✅ Agent-only (ใช้เฉพาะหน้าที่ต้องการ)
  agentOnly = false,
  currentAgentId,

  // ✅ callbacks ส่งผล near me ออกไป
  onNearMeResults,
  onNearMeLocation,

  // ✅ ปิด sheet ใกล้ฉันใน map ได้ (ให้ไปโชว์ list ที่ฝั่งซ้ายแทน)
  nearMeShowSheet = true,

  // ✅ (เพิ่มใหม่แบบ opt-in) ใช้กับหน้ารายละเอียดทรัพย์ / หรือหน้าอื่นที่อยากให้เป็น display
  displayOnly = false, // ถ้า true จะล็อคการลากหมุด/คลิกย้าย/drag
  hideAttribution = false, // ซ่อน attribution ล่างขวา
  markerPopupData = null, // { title?, subtitle?, latLabel?, lngLabel?, extraLines?: string[] }
}) {
  const mapWrapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const initialRef = useRef(
    initialPosition?.lat != null && initialPosition?.lng != null
      ? normalizeLatLng(
          { lat: Number(initialPosition.lat), lng: Number(initialPosition.lng) },
          4
        )
      : normalizeLatLng({ lat: Number(lat), lng: Number(lng) }, 4)
  );

  const [pos, setPos] = useState(() => {
    const base = { lat: Number(lat), lng: Number(lng) };
    const bounded = restrictToThailand ? clampToBounds(base) : base;
    return normalizeLatLng(bounded, 4);
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  const [addrText, setAddrText] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ near me states
  const [nearMeLoading, setNearMeLoading] = useState(false);
  const [nearMeList, setNearMeList] = useState([]);
  const [nearMeOpen, setNearMeOpen] = useState(false);

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

  // ✅ commit: clamp + ปัด 4 ตำแหน่ง
  const commit = (nextRaw) => {
    const bounded = restrictToThailand ? clampToBounds(nextRaw) : nextRaw;
    const next = normalizeLatLng(bounded, 4);
    setPos(next);
    onChange?.(next);
  };

  // ✅ sync จาก props lat/lng แล้วปัด 4 ตำแหน่งด้วย
  useEffect(() => {
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;
    const next = { lat: Number(lat), lng: Number(lng) };
    const bounded = restrictToThailand ? clampToBounds(next) : next;
    const normalized = normalizeLatLng(bounded, 4);
    setPos(normalized);
    onChange?.(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, restrictToThailand]);

  // ==========================
  // ✅ Fullscreen API
  // ==========================
  const isActuallyFullscreen = () => {
    if (typeof document === "undefined") return false;
    return !!document.fullscreenElement;
  };

  const syncFullscreenState = () => {
    const on = isActuallyFullscreen();
    setIsFullscreen(on);

    if (typeof document !== "undefined") {
      document.body.style.overflow = on ? "hidden" : "";
    }

    const map = mapInstanceRef.current;
    if (map) {
      setTimeout(() => map.invalidateSize(), 0);
      setTimeout(() => map.invalidateSize(), 160);
    }
  };

  const toggleFullscreen = async () => {
    if (!enableFullscreen) return;
    if (typeof document === "undefined") return;

    const el = mapWrapRef.current;
    if (!el) return;

    try {
      if (!isActuallyFullscreen()) {
        if (el.requestFullscreen) await el.requestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((v) => !v);
      const map = mapInstanceRef.current;
      if (map) {
        setTimeout(() => map.invalidateSize(), 0);
        setTimeout(() => map.invalidateSize(), 160);
      }
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => syncFullscreenState();
    document.addEventListener("fullscreenchange", handler);

    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================
  // Reverse geocode (เดิม)
  // ==========================
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

  // ✅ agent-only filter (ใช้ตอนคำนวณ near me)
  const norm = (v) => String(v ?? "").trim();
  const filterAgentOnly = (items) => {
    if (!agentOnly) return items;
    const aid = norm(currentAgentId);
    if (!aid) return items;

    return (Array.isArray(items) ? items : []).filter((it) => {
      const owner = norm(it?.agentId ?? it?.ownerId ?? it?.userId ?? it?.createdBy);
      return owner && owner === aid;
    });
  };

  // ✅ ใกล้ฉัน: ขอ GPS -> คำนวณ -> เปิดลิสต์ (+ ส่งออก callback)
  const handleNearMe = () => {
    if (typeof window === "undefined") return;

    if (!navigator.geolocation) {
      setGeoError("เบราว์เซอร์นี้ไม่รองรับ GPS");
      return;
    }

    setNearMeLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (p) => {
        const me = {
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        };

        // ซูมไปตำแหน่งฉันก่อน (ภาพรวมชัด)
        const map = mapInstanceRef.current;
        if (map) {
          const target = restrictToThailand ? clampToBounds(me) : me;
          map.setView([target.lat, target.lng], Math.max(15, zoom), { animate: true });
        }

        // คำนวณระยะกับทรัพย์สินทั้งหมด (กรอง agent-only ได้)
        const itemsRaw = Array.isArray(nearbyItems) ? nearbyItems : [];
        const items = filterAgentOnly(itemsRaw);

        const computed = items
          .map((it) => {
            const latN = Number(it?.lat);
            const lngN = Number(it?.lng);
            if (!Number.isFinite(latN) || !Number.isFinite(lngN)) return null;

            const d = haversineKm(me, { lat: latN, lng: lngN });
            return {
              ...it,
              lat: latN,
              lng: lngN,
              distanceKm: d,
            };
          })
          .filter(Boolean)
          .filter((it) => it.distanceKm <= Number(nearMeRadiusKm || 5))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, Number(nearMeLimit || 10));

        setNearMeList(computed);
        setNearMeOpen(true);

        // ✅ ส่งออกไปให้หน้า map-v1 ทำ UI ฝั่งซ้าย/ไฮไลต์
        onNearMeResults?.(computed);
        onNearMeLocation?.(me);

        setNearMeLoading(false);
      },
      (err) => {
        setNearMeLoading(false);
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

  // ===== Popup UI (ใช้ component กลาง) =====
  const popupTitle = markerPopupData?.title ?? "ตำแหน่งทรัพย์สิน";
  const popupSubtitle = markerPopupData?.subtitle ?? "";
  const extraLines = Array.isArray(markerPopupData?.extraLines)
    ? markerPopupData.extraLines
    : [];

  return (
    <div className={className}>
      <div
        ref={mapWrapRef}
        className={`lx-map-wrap ${isFullscreen ? "is-fullscreen" : ""}`}
        style={{
          height: isFullscreen ? "100vh" : height,
        }}
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
                <button type="button" className="ud-btn btn-light" onClick={handleReset}>
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
                  <button type="button" className="ud-btn btn-light" onClick={clearResults}>
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
          scrollWheelZoom={false}
          whenCreated={(map) => {
            mapInstanceRef.current = map;
            setTimeout(() => map.invalidateSize(), 0);
            setTimeout(() => map.invalidateSize(), 180);
          }}
          maxBounds={restrictToThailand ? SAFE_TH_BOUNDS : undefined}
          maxBoundsViscosity={restrictToThailand ? 1.0 : undefined}
          attributionControl={hideAttribution ? false : true}
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

          <ClickToMove
            enabled={_clickToMove && _draggable && !displayOnly}
            onPick={commit}
          />

          <BottomRightZoomControl />

          {enableFullscreen && (
            <BottomRightFullscreenControl
              enabled={true}
              isOn={isFullscreen}
              onToggle={toggleFullscreen}
            />
          )}

          {enableNearMe && (
            <BottomRightNearMeControl
              enabled={true}
              loading={nearMeLoading}
              title={nearMeLoading ? "กำลังค้นหาใกล้ฉัน..." : "ใกล้ฉัน"}
              onClick={handleNearMe}
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
              draggable={_draggable && !displayOnly}
              icon={markerIcon}
              eventHandlers={{
                dragend: (e) => {
                  if (!_draggable || displayOnly) return;
                  const latlng = e.target.getLatLng();
                  commit({ lat: latlng.lat, lng: latlng.lng });
                },
              }}
            >
              {/* ✅ popup (แสดงเฉพาะเมื่อส่ง markerPopupData มา) */}
              {markerPopupData && (
                <Popup>
                  <MarkerPopupCard
                    title={popupTitle}
                    subtitle={popupSubtitle}
                    extraLines={extraLines}
                    lat={pos.lat}
                    lng={pos.lng}
                    buttonText="เปิดใน Google Maps"
                  />
                </Popup>
              )}
            </Marker>
          )}
        </MapContainer>

        {/* ✅ sheet ใกล้ฉัน (ปิดได้ด้วย nearMeShowSheet) */}
        {nearMeShowSheet && nearMeOpen && (
          <div
            className="lx-map-sheet is-bottom"
            style={{
              left: "50%",
              ["--lx-arrow-x"]: "50%",
            }}
          >
            <div className="lx-map-sheet-head">
              <div className="lx-map-sheet-title">
                ทรัพย์สินใกล้ฉัน ({nearMeList.length})
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                  รัศมี {nearMeRadiusKm} km · เรียงใกล้ → ไกล
                </div>
              </div>
              <button
                className="lx-map-sheet-close"
                type="button"
                onClick={() => setNearMeOpen(false)}
                aria-label="ปิด"
                title="ปิด"
              >
                ✕
              </button>
            </div>

            <div className="lx-map-sheet-body">
              {nearMeList.length === 0 ? (
                <div style={{ fontSize: 13, opacity: 0.75 }}>
                  ไม่พบทรัพย์สินในรัศมีนี้
                </div>
              ) : (
                <div className="lx-nearme-list">
                  {nearMeList.map((it) => (
                    <button
                      key={String(it.id ?? `${it.lat},${it.lng}`)}
                      type="button"
                      className="lx-nearme-item"
                      onClick={() => {
                        const map = mapInstanceRef.current;
                        if (map) {
                          map.setView([it.lat, it.lng], Math.max(16, map.getZoom()), {
                            animate: true,
                          });
                        }
                      }}
                    >
                      <div className="lx-nearme-item-title">
                        {it.title ?? `ทรัพย์สิน #${it.id ?? "-"}`}
                      </div>
                      <div className="lx-nearme-item-sub">
                        ระยะประมาณ {it.distanceKm.toFixed(2)} km
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
