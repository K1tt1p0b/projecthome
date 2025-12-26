"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMapClient"), {
  ssr: false,
  loading: () => (
    <div
      className="w-100"
      style={{
        height: 550,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
      }}
    >
      กำลังโหลดแผนที่...
    </div>
  ),
});

export default LeafletMap;
