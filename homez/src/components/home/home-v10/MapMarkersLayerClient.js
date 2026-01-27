"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

// =====================
// Type / Colors / Labels
// =====================
export const TYPE_META = [
  { key: "house-and-land", label: "บ้านและที่ดิน", color: "#F97316" }, // ส้ม
  { key: "condo", label: "คอนโด", color: "#3B82F6" }, // น้ำเงิน
  { key: "land", label: "ที่ดิน", color: "#22C55E" }, // เขียว
  { key: "room-rent", label: "ห้องเช่า / หอพัก", color: "#A855F7" }, // ม่วง
  { key: "shop", label: "ร้านค้า", color: "#EF4444" }, // แดง
  // { key: "office", label: "ออฟฟิศ", color: "#14B8A6" }, // ❌ เอาออก
  { key: "warehouse", label: "โกดัง", color: "#F59E0B" }, // amber
];

const TYPE_COLOR = TYPE_META.reduce((acc, x) => {
  acc[x.key] = x.color;
  return acc;
}, {});

const TYPE_LABEL = TYPE_META.reduce((acc, x) => {
  acc[x.key] = x.label;
  return acc;
}, {});

const MIXED_COLOR = "#111827"; // ดำเทา (หลายประเภท/ผสม)
const DEFAULT_COLOR = "#111827";

const roundTo = (n, digits = 6) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return num;
  const p = Math.pow(10, digits);
  return Math.round(num * p) / p;
};

// ====== Badge icon (เลข) ======
const countIcon = (count, color) => {
  const size = count >= 20 ? 46 : count >= 10 ? 42 : count >= 5 ? 38 : 34;

  return L.divIcon({
    className: "lx-count-icon",
    html: `<div class="lx-count-badge" style="background:${color};width:${size}px;height:${size}px">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ====== Dot icon (จุดสี) ======
const dotIcon = (propertyType) => {
  const color = TYPE_COLOR[propertyType] || DEFAULT_COLOR;
  const size = 12;

  return L.divIcon({
    className: "lx-dot-icon",
    html: `<span class="lx-dot" style="background:${color};width:${size}px;height:${size}px"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ===== Zoom thresholds =====
const ZOOM_TO_LEVEL = {
  PROVINCE_MAX: 7, // <= 7 : province groups
  DISTRICT_MAX: 10, // <= 10 : district groups
};

function getLevel(zoom) {
  if (zoom <= ZOOM_TO_LEVEL.PROVINCE_MAX) return "province";
  if (zoom <= ZOOM_TO_LEVEL.DISTRICT_MAX) return "district";
  return "dots";
}

// ===== groupPoints (province/district only) =====
function groupByRegion(points, level) {
  const m = new Map();

  for (const pt of points) {
    let key = "";
    let title = "";

    if (level === "province") {
      const province = pt.province || "ไม่ระบุจังหวัด";
      key = `p:${province}`;
      title = province;
    } else if (level === "district") {
      const province = pt.province || "ไม่ระบุจังหวัด";
      const district = pt.district || "ไม่ระบุอำเภอ";
      key = `d:${province}:${district}`;
      title = `${district} · ${province}`;
    } else {
      continue;
    }

    const t = String(pt?.raw?.propertyType || "").trim();

    if (!m.has(key)) {
      m.set(key, {
        key,
        title,
        items: [pt.raw],
        _sumLat: pt.lat,
        _sumLng: pt.lng,
        _n: 1,
        _types: new Set(t ? [t] : []),
      });
    } else {
      const g = m.get(key);
      g.items.push(pt.raw);
      g._sumLat += pt.lat;
      g._sumLng += pt.lng;
      g._n += 1;
      if (t) g._types.add(t);
    }
  }

  return Array.from(m.values()).map((g) => {
    const n = g._n || 1;
    const types = Array.from(g._types || []);
    const isMixed = types.length !== 1;
    const mainType = types.length === 1 ? types[0] : null;

    return {
      key: g.key,
      title: g.title,
      lat: g._sumLat / n,
      lng: g._sumLng / n,
      items: g.items,
      count: g.items.length,
      isMixed,
      mainType,
      color: isMixed ? MIXED_COLOR : (TYPE_COLOR[mainType] || DEFAULT_COLOR),
      typeLabel: isMixed ? "หลายประเภท" : (TYPE_LABEL[mainType] || "ไม่ระบุ"),
    };
  });
}

// ===== dots: "ห้ามทำให้หาย" -> ถ้าพิกัดซ้ำ ให้อยู่จุดเดียวแล้ว items หลายอัน =====
function groupByLatLng(points) {
  const m = new Map();

  for (const p of points) {
    const lat = roundTo(p.lat, 6);
    const lng = roundTo(p.lng, 6);
    const key = `ll:${lat},${lng}`;

    const type = String(p?.raw?.propertyType || "").trim();

    if (!m.has(key)) {
      m.set(key, {
        key,
        lat,
        lng,
        items: [p.raw],
        _types: new Set(type ? [type] : []),
      });
    } else {
      const g = m.get(key);
      g.items.push(p.raw);
      if (type) g._types.add(type);
    }
  }

  return Array.from(m.values()).map((g) => {
    const types = Array.from(g._types || []);
    const isMixed = types.length !== 1;
    const mainType = types.length === 1 ? types[0] : null;

    return {
      key: g.key,
      lat: g.lat,
      lng: g.lng,
      items: g.items,
      count: g.items.length,
      isMixed,
      mainType,
      color: isMixed ? MIXED_COLOR : (TYPE_COLOR[mainType] || DEFAULT_COLOR),
      typeLabel: isMixed ? "หลายประเภท" : (TYPE_LABEL[mainType] || "ไม่ระบุ"),
    };
  });
}

// ===== helper: google maps url =====
const toFixed6 = (v) => (Number.isFinite(Number(v)) ? Number(v).toFixed(6) : "");
const buildGoogleMapsUrl = (lat, lng) => {
  const la = Number(lat);
  const lo = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(
    `${toFixed6(la)},${toFixed6(lo)}`
  )}`;
};

export default function MapMarkersLayerClient({
  points,
  onSelect,
  onClear,
  showLegend = true,
}) {
  const map = useMap();
  const [zoom, setZoom] = useState(map?.getZoom?.() ?? 6);

  useEffect(() => {
    if (map?.getZoom) setZoom(map.getZoom());
  }, [map]);

  useMapEvents({
    zoomend: (e) => setZoom(e.target.getZoom()),
    click: () => onClear?.(),
  });

  const level = getLevel(zoom);

  const groupedRegion = useMemo(() => {
    const safe = Array.isArray(points) ? points : [];
    if (level === "dots") return [];
    return groupByRegion(safe, level);
  }, [points, level]);

  const groupedDots = useMemo(() => {
    const safe = Array.isArray(points) ? points : [];
    if (level !== "dots") return [];
    return groupByLatLng(safe);
  }, [points, level]);

  const buildSelectionPayload = (items, lat, lng, titleFallback, meta = {}) => {
    const p = map.latLngToContainerPoint([lat, lng]);
    const size = map.getSize();
    const prefer = p.y < size.y * 0.38 ? "top" : "bottom";

    const la = Number(lat);
    const lo = Number(lng);
    const googleMapsUrl = buildGoogleMapsUrl(la, lo);

    return {
      title: titleFallback,
      items,
      prefer,
      anchorX: p.x,
      anchorY: p.y,
      mapW: size.x,
      mapH: size.y,
      level,

      // ✅ เพิ่มให้ฝั่ง panel / ฝั่งซ้ายเอาไปใช้
      lat: Number.isFinite(la) ? la : undefined,
      lng: Number.isFinite(lo) ? lo : undefined,
      googleMapsUrl,

      ...meta,
    };
  };

  return (
    <>
      {/* ===== Legend (top-left) ===== */}
      {showLegend && (
        <div className="lx-type-legend" role="note" aria-label="ประเภททรัพย์">
          <div className="lx-type-legend-title">ประเภททรัพย์ (สีจุด)</div>

          {TYPE_META.slice(0, 6).map((t) => (
            <div key={t.key} className="lx-type-legend-item" title={t.label}>
              <span className="lx-type-dot" style={{ background: t.color }} />
              <span className="lx-type-label">{t.label}</span>
            </div>
          ))}

          <div className="lx-type-legend-item" title="หลายประเภท">
            <span className="lx-type-dot" style={{ background: MIXED_COLOR }} />
            <span className="lx-type-label">หลายประเภท</span>
          </div>
        </div>
      )}

      {/* province/district -> badge count */}
      {level !== "dots" &&
        groupedRegion.map((g) => (
          <Marker
            key={g.key}
            position={[g.lat, g.lng]}
            icon={countIcon(g.count, g.color)}
            eventHandlers={{
              click: () => {
                const title = g.title?.trim() || `พื้นที่นี้มีทรัพย์ ${g.count} รายการ`;
                onSelect?.(
                  buildSelectionPayload(g.items, g.lat, g.lng, title, {
                    groupTypeLabel: g.typeLabel,
                    groupIsMixed: g.isMixed,
                    groupCount: g.count,
                  })
                );
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95} sticky>
              <div style={{ fontWeight: 800, marginBottom: 2 }}>{g.title}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>
                {g.count} รายการ · {g.typeLabel}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>(ซูมเข้าเพื่อแยกจุด)</div>
            </Tooltip>
          </Marker>
        ))}

      {/* dots -> ถ้าพิกัดซ้ำ "อยู่จุดเดียว" แล้ว count เป็น badge ถ้า > 1 */}
      {level === "dots" &&
        groupedDots.map((g) => {
          const icon =
            g.count > 1
              ? countIcon(g.count, g.color) // ✅ พิกัดซ้ำ: เป็นเลข
              : dotIcon(g.mainType); // ✅ พิกัดเดี่ยว: เป็นจุดสี

          const title =
            g.count > 1
              ? `ตำแหน่งนี้มี ${g.count} รายการ`
              : (g.items?.[0]?.title || "รายการทรัพย์");

          return (
            <Marker
              key={g.key}
              position={[g.lat, g.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  onSelect?.(
                    buildSelectionPayload(g.items, g.lat, g.lng, title, {
                      groupTypeLabel: g.typeLabel,
                      groupIsMixed: g.isMixed,
                      groupCount: g.count,
                    })
                  );
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95} sticky>
                <div style={{ fontWeight: 800, marginBottom: 2 }}>
                  {g.count > 1
                    ? `จุดนี้มี ${g.count} รายการ`
                    : (g.items?.[0]?.title || "รายการทรัพย์")}
                </div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{g.typeLabel}</div>
              </Tooltip>
            </Marker>
          );
        })}
    </>
  );
}
