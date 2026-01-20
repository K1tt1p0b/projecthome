"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

const roundTo = (n, digits = 6) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return num;
  const p = Math.pow(10, digits);
  return Math.round(num * p) / p;
};

// =====================
// Type / Colors / Labels
// =====================
export const TYPE_META = [
  { key: "house-and-land", label: "บ้าน / บ้านพร้อมที่ดิน", color: "#F97316" }, // ส้ม
  { key: "condo", label: "คอนโด", color: "#3B82F6" }, // น้ำเงิน
  { key: "land", label: "ที่ดิน", color: "#22C55E" }, // เขียว
  { key: "room-rent", label: "ห้องเช่า / หอพัก", color: "#A855F7" }, // ม่วง
  { key: "shop", label: "ร้านค้า / พาณิชย์", color: "#EF4444" }, // แดง
  { key: "office", label: "ออฟฟิศ", color: "#14B8A6" }, // teal
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

const MIXED_COLOR = "#111827"; // ดำเทา
const DEFAULT_COLOR = "#111827";

// ===== Badge icon =====
const countIcon = (count, color) => {
  const size = count >= 20 ? 46 : count >= 10 ? 42 : count >= 5 ? 38 : 34;

  return L.divIcon({
    className: "lx-count-icon",
    html: `<div class="lx-count-badge" style="background:${color};width:${size}px;height:${size}px">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ===== Dot icon =====
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
  PROVINCE_MAX: 7,
  DISTRICT_MAX: 10,
};

function getLevel(zoom) {
  if (zoom <= ZOOM_TO_LEVEL.PROVINCE_MAX) return "province";
  if (zoom <= ZOOM_TO_LEVEL.DISTRICT_MAX) return "district";
  return "dots";
}

// ===== groupPoints (province/district) =====
function groupPoints(points, level) {
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
      typeLabel: isMixed ? "หลายประเภท / ไม่ระบุ" : (TYPE_LABEL[mainType] || "ไม่ระบุ"),
    };
  });
}

/**
 * ✅ jitter จุดที่ lat/lng ซ้ำกัน (stable)
 * - group by rounded lat/lng
 * - กระจายออกเป็นวงเล็ก ๆ ตาม index
 */
function spreadDuplicateDots(items) {
  const keyOf = (lat, lng) => `${roundTo(lat, 6)},${roundTo(lng, 6)}`;
  const groups = new Map();

  for (const d of items) {
    const k = keyOf(d.lat, d.lng);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(d);
  }

  const out = [];
  for (const arr of groups.values()) {
    if (arr.length === 1) {
      out.push(arr[0]);
      continue;
    }

    // รัศมีเล็ก ๆ (องศา) — ประมาณไม่กี่เมตร
    const R = 0.00018;

    arr.forEach((d, i) => {
      const angle = (2 * Math.PI * i) / arr.length;
      out.push({
        ...d,
        lat: d.lat + Math.cos(angle) * R,
        lng: d.lng + Math.sin(angle) * R,
        _jittered: true,
      });
    });
  }

  return out;
}

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

  const grouped = useMemo(() => {
    const safe = Array.isArray(points) ? points : [];
    if (level === "dots") return [];
    return groupPoints(safe, level);
  }, [points, level]);

  const dotItems = useMemo(() => {
    const safe = Array.isArray(points) ? points : [];
    if (level !== "dots") return [];

    const rawDots = safe.map((p) => {
      const id = p.raw?.id ?? `${roundTo(p.lat)},${roundTo(p.lng)}`;
      return {
        key: `dot:${id}`,
        lat: p.lat,
        lng: p.lng,
        raw: p.raw,
        propertyType: String(p.raw?.propertyType || "").trim(),
      };
    });

    return spreadDuplicateDots(rawDots);
  }, [points, level]);

  const buildSelectionPayload = (items, lat, lng, titleFallback, meta = {}) => {
    const p = map.latLngToContainerPoint([lat, lng]);
    const size = map.getSize();
    const prefer = p.y < size.y * 0.38 ? "top" : "bottom";

    return {
      title: titleFallback,
      items,
      prefer,
      anchorX: p.x,
      anchorY: p.y,
      mapW: size.x,
      mapH: size.y,
      level,
      ...meta,
    };
  };

  if (level !== "dots" && !grouped.length) return null;
  if (level === "dots" && !dotItems.length) return null;

  return (
    <>
      {/* ===== Legend ===== */}
      {showLegend && (
        <div className="lx-type-legend" role="note" aria-label="ประเภททรัพย์">
          <div className="lx-type-legend-title">ประเภททรัพย์ (สีจุด)</div>

          {TYPE_META.slice(0, 4).map((t) => (
            <div key={t.key} className="lx-type-legend-item" title={t.label}>
              <span className="lx-type-dot" style={{ background: t.color }} />
              <span className="lx-type-label">{t.label}</span>
            </div>
          ))}

          <div className="lx-type-legend-item" title="หลายประเภท / ไม่ระบุ">
            <span className="lx-type-dot" style={{ background: MIXED_COLOR }} />
            <span className="lx-type-label">หลายประเภท / ไม่ระบุ</span>
          </div>
        </div>
      )}

      {/* ===== province/district ===== */}
      {level !== "dots" &&
        grouped.map((g) => (
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
                  })
                );
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95} permanent={false} sticky>
              <div style={{ fontWeight: 800, marginBottom: 2 }}>{g.title}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>
                {g.count} รายการ · {g.typeLabel}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>(ซูมเข้าเพื่อแยกจุด)</div>
            </Tooltip>
          </Marker>
        ))}

      {/* ===== dots ===== */}
      {level === "dots" &&
        dotItems.map((d) => {
          const it = d.raw;
          const typeKey = d.propertyType;
          const typeLabel = TYPE_LABEL[typeKey] || "หลายประเภท / ไม่ระบุ";

          return (
            <Marker
              key={d.key}
              position={[d.lat, d.lng]}
              icon={dotIcon(typeKey)}
              eventHandlers={{
                click: () => {
                  const title = it?.title || "รายการทรัพย์";
                  onSelect?.(buildSelectionPayload([it], d.lat, d.lng, title));
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95} permanent={false} sticky>
                <div style={{ fontWeight: 800, marginBottom: 2 }}>
                  {it?.title || "รายการทรัพย์"}
                </div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{typeLabel}</div>
              </Tooltip>
            </Marker>
          );
        })}
    </>
  );
}
