"use client";

import dynamic from "next/dynamic";

// react-select เป็น default export
const ClientSelect = dynamic(() => import("react-select").then(m => m.default), {
  ssr: false,
});

export default ClientSelect;
