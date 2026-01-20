"use client";

import React, { useMemo } from "react";
import LeafletMapClient from "@/components/common/LeafletMap/LeafletMapClient";
import MapMarkersLayerClient from "@/components/home/home-v10/MapMarkersLayerClient";

export default function MapV1Leaflet({ items = [], onSelectItems, onClearSelect }) {
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

  return (
    <LeafletMapClient
      mode="display"
      height="100%"
      zoom={6}
      lat={13.75}
      lng={100.5}
      restrictToThailand={true}
      enableSearch={false}
      enableGPS={false}
      enableNearMe={false}
      scrollWheelZoom={true}
      requireCtrlToZoom={true}
      showOverlay={false}
      showPickerMarker={false}
    >
      <MapMarkersLayerClient
        points={points}
        showLegend={true}
        onSelect={(payload) => {
          const picked = Array.isArray(payload?.items) ? payload.items : [];
          onSelectItems?.(picked, payload);
        }}
        onClear={() => onClearSelect?.()}
      />
    </LeafletMapClient>
  );
}
