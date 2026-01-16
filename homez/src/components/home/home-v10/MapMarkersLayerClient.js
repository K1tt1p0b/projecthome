"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

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

const ZOOM_TO_LEVEL = {
  PROVINCE_MAX: 7,
  DISTRICT_MAX: 10,
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
    let title = "";
    let lat = pt.lat;
    let lng = pt.lng;

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
      const rLat = roundTo(pt.lat, 1);
      const rLng = roundTo(pt.lng, 1);
      key = `c:${rLat},${rLng}`;
      title = "";
      lat = rLat;
      lng = rLng;
    }

    if (!m.has(key)) {
      m.set(key, {
        key,
        title,
        items: [pt.raw],
        _sumLat: pt.lat,
        _sumLng: pt.lng,
        _n: 1,
        _latFixed: lat,
        _lngFixed: lng,
        _useFixed: level === "coords",
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
    const lat = g._useFixed ? g._latFixed : g._sumLat / n;
    const lng = g._useFixed ? g._lngFixed : g._sumLng / n;

    return {
      key: g.key,
      title: g.title,
      lat,
      lng,
      items: g.items,
      count: g.items.length,
    };
  });
}

export default function MapMarkersLayerClient({ points, onSelect, onClear }) {
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

  const groups = useMemo(() => {
    const safe = Array.isArray(points) ? points : [];
    return groupPoints(safe, level);
  }, [points, level]);

  if (!groups.length) return null;

  const buildSelectionPayload = (g) => {
    const p = map.latLngToContainerPoint([g.lat, g.lng]);
    const size = map.getSize();

    // ถ้า marker อยู่ “บนๆ” ให้ panel ออกด้านบนแล้วชี้ลง
    const prefer = p.y < size.y * 0.38 ? "top" : "bottom";

    const title =
      g.title?.trim() || `พื้นที่นี้มีทรัพย์ ${g.count} รายการ`;

    return {
      title,
      items: g.items,
      prefer,
      anchorX: p.x,
      anchorY: p.y,
      mapW: size.x,
      mapH: size.y,
    };
  };

  return (
    <>
      {groups.map((g) => (
        <Marker
          key={g.key}
          position={[g.lat, g.lng]}
          icon={countIcon(g.count)}
          eventHandlers={{
            click: () => onSelect?.(buildSelectionPayload(g)),
          }}
        />
      ))}
    </>
  );
}
