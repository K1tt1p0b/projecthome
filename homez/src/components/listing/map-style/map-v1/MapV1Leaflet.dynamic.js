"use client";

import dynamic from "next/dynamic";

const MapV1LeafletDynamic = dynamic(() => import("./MapV1Leaflet"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", width: "100%", display: "grid", placeItems: "center" }}>
      Loading map...
    </div>
  ),
});

export default MapV1LeafletDynamic;
