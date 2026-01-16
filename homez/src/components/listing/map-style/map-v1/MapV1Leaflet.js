"use client";

import React, { useMemo, useState } from "react";
import LeafletMapClient from "@/components/common/LeafletMap/LeafletMapClient";

// ✅ แก้ path ให้ตรงของคุณ
import MapMarkersLayerClient from "@/components/home/home-v10/MapMarkersLayerClient";

export default function MapV1Leaflet({ items = [] }) {
  const [selection, setSelection] = useState(null);

  const points = useMemo(() => {
    const safe = Array.isArray(items) ? items : [];
    return safe
      .map((raw) => {
        const lat = Number(raw?.location?.latitude);
        const lng = Number(raw?.location?.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        return {
          lat,
          lng,
          province: raw?.location?.province,
          district: raw?.location?.district,
          raw,
        };
      })
      .filter(Boolean);
  }, [items]);

  const nearMeItems = useMemo(
    () =>
      points.map((p) => ({
        id: p.raw?.id,
        title: p.raw?.title,
        lat: p.lat,
        lng: p.lng,
      })),
    [points]
  );

  return (
    <LeafletMapClient
      mode="display"
      height="100%"
      zoom={6}
      lat={13.75}
      lng={100.5}
      restrictToThailand={true}
      enableSearch={true}
      enableGPS={true}
      enableNearMe={true}
      nearbyItems={nearMeItems}
      scrollWheelZoom={true}
      requireCtrlToZoom={true}
      showOverlay={true}
      showPickerMarker={false}
    >
      <MapMarkersLayerClient
        points={points}
        onSelect={(payload) => setSelection(payload)}
        onClear={() => setSelection(null)}
      />

      {/* ✅ sheet จาก selection */}
      {selection && (
        <div
          className={`lx-map-sheet is-${selection.prefer || "bottom"}`}
          style={{
            left: "50%",
            ["--lx-arrow-x"]: `${Math.max(
              12,
              Math.min(88, (selection.anchorX / selection.mapW) * 100)
            )}%`,
          }}
        >
          <div className="lx-map-sheet-head">
            <div className="lx-map-sheet-title">{selection.title}</div>
            <button
              className="lx-map-sheet-close"
              type="button"
              onClick={() => setSelection(null)}
              aria-label="ปิด"
              title="ปิด"
            >
              ✕
            </button>
          </div>

          <div className="lx-map-sheet-body">
            {(selection.items || []).map((it) => (
              <div key={String(it?.id)} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 900, fontSize: 13 }}>
                  {it?.title || "ไม่มีชื่อ"}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  {it?.location?.fullText || ""}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  ฿ {it?.priceText || it?.price || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </LeafletMapClient>
  );
}
