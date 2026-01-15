"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import ListingPopupCard from "@/components/listing/map-style/ListingPopupCard";

const roundTo = (n, digits = 1) => {
  const p = Math.pow(10, digits);
  return Math.round(Number(n) * p) / p;
};

const countIcon = (count) => {
  const size = count >= 20 ? 46 : count >= 10 ? 42 : count >= 5 ? 38 : 34;

  return L.divIcon({
    className: "lx-count-icon",
    html: `<div class="lx-count-badge" style="width:${size}px;height:${size}px">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ✅ จูนระดับ group ตาม zoom ได้ตรงนี้
const ZOOM_TO_LEVEL = {
  PROVINCE_MAX: 7, // <=7 = จังหวัด
  DISTRICT_MAX: 10, // 8-10 = อำเภอ
  // >=11 = กลุ่มพิกัด (เดิม)
};

function getLevel(zoom) {
  if (zoom <= ZOOM_TO_LEVEL.PROVINCE_MAX) return "province";
  if (zoom <= ZOOM_TO_LEVEL.DISTRICT_MAX) return "district";
  return "coords";
}

function groupPoints(points, level) {
  const m = new Map();

  for (const pt of points) {
    let key = "";
    let label = "";
    let lat = pt.lat;
    let lng = pt.lng;

    if (level === "province") {
      const province = pt.province || "ไม่ระบุจังหวัด";
      key = `p:${province}`;
      label = province;
      lat = 0;
      lng = 0;
    } else if (level === "district") {
      const province = pt.province || "ไม่ระบุจังหวัด";
      const district = pt.district || "ไม่ระบุอำเภอ";
      key = `d:${province}:${district}`;
      label = `${district} · ${province}`;
      lat = 0;
      lng = 0;
    } else {
      // coords (เหมือนเดิม)
      const rLat = roundTo(pt.lat, 1);
      const rLng = roundTo(pt.lng, 1);
      key = `c:${rLat},${rLng}`;
      label = "";
      lat = rLat;
      lng = rLng;
    }

    if (!m.has(key)) {
      m.set(key, {
        key,
        label,
        lat,
        lng,
        items: [pt.raw],
        _sumLat: pt.lat,
        _sumLng: pt.lng,
        _n: 1,
      });
    } else {
      const g = m.get(key);
      g.items.push(pt.raw);
      g._sumLat += pt.lat;
      g._sumLng += pt.lng;
      g._n += 1;
    }
  }

  return Array.from(m.values()).map((g) => {
    const n = g._n || 1;
    const lat = g.lat === 0 ? g._sumLat / n : g.lat;
    const lng = g.lng === 0 ? g._sumLng / n : g.lng;

    return {
      key: g.key,
      label: g.label,
      lat,
      lng,
      items: g.items,
      count: g.items.length,
    };
  });
}

export default function MapMarkersLayerClient({ points }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map?.getZoom?.() ?? 6);

  useEffect(() => {
    if (map?.getZoom) setZoom(map.getZoom());
  }, [map]);

  useMapEvents({
    zoomend: (e) => setZoom(e.target.getZoom()),
  });

  const level = getLevel(zoom);

  const groups = useMemo(() => {
    const safe = Array.isArray(points) ? points : [];
    return groupPoints(safe, level);
  }, [points, level]);

  if (!groups.length) return null;

  return (
    <>
      {groups.map((g) => (
        <Marker key={g.key} position={[g.lat, g.lng]} icon={countIcon(g.count)}>
          {/* ✅ แก้ popup ถูกตัด: keepInView + padding เผื่อ header + offset */}
          <Popup
            maxWidth={320}
            minWidth={260}
            autoPan={true}
            keepInView={true}
            autoPanPaddingTopLeft={[16, 120]}
            autoPanPaddingBottomRight={[16, 16]}
            offset={[0, -8]}
          >
            <div className="lx-map-popup">
              <div className="lx-map-popup-title">
                {g.label ? (
                  <>
                    <div style={{ fontWeight: 900, marginBottom: 4 }}>
                      {g.label}
                    </div>
                    <div style={{ opacity: 0.9 }}>
                      มีทรัพย์ {g.count} รายการ
                    </div>
                  </>
                ) : (
                  <>พื้นที่นี้มีทรัพย์ {g.count} รายการ</>
                )}
              </div>

              {/* ✅ แสดง 1–3 ใบ / ถ้ามีเยอะก็ scroll (ไม่มีดูทั้งหมด) */}
              <div className="lx-map-popup-list">
                {g.items.slice(0, 3).map((raw) => (
                  <ListingPopupCard key={raw.id} item={raw} />
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
