"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { propertyData } from "@/data/propertyData";

const LeafletMapClient = dynamic(
  () => import("@/components/common/LeafletMap/LeafletMapClient"),
  { ssr: false }
);

const MapMarkersLayerClient = dynamic(() => import("./MapMarkersLayerClient"), {
  ssr: false,
});

const HomeMapSelectionPanel = dynamic(
  () => import("./HomeMapSelectionPanel"),
  { ssr: false }
);

export default function HomeV10MapClientOnly() {
  const [selection, setSelection] = useState(null);
  // selection: { title, items, prefer: "top"|"bottom", anchorX, anchorY, mapW, mapH }

  const { center, points } = useMemo(() => {
    const pts = (propertyData || [])
      .map((p) => {
        const lat = p?.location?.latitude;
        const lng = p?.location?.longitude;
        if (lat == null || lng == null) return null;

        return {
          id: p.id,
          lat: Number(lat),
          lng: Number(lng),
          province: (p?.location?.province || "").trim(),
          district: (p?.location?.district || "").trim(),
          raw: p,
        };
      })
      .filter(Boolean);

    const center = pts.length
      ? { lat: pts[0].lat, lng: pts[0].lng }
      : { lat: 13.7563, lng: 100.5018 };

    return { center, points: pts };
  }, []);

  return (
    <LeafletMapClient
      mode="display"
      height={700}
      lat={center.lat}
      lng={center.lng}
      zoom={6}
      scrollWheelZoom={true}
      requireCtrlToZoom={true}
      enableFullscreen={true}
      restrictToThailand={true}
      wheelHintText="กด Ctrl + Scroll เพื่อซูมแผนที่"
    >
      <MapMarkersLayerClient
        points={points}
        onSelect={(payload) => setSelection(payload)}
        onClear={() => setSelection(null)}
      />

      {/* ✅ Panel + ลูกศรชี้ไป marker */}
      <HomeMapSelectionPanel
        selection={selection}
        onClose={() => setSelection(null)}
      />
    </LeafletMapClient>
  );
}
