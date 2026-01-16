"use client";

import { useEffect } from "react";
import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import PropertyFilteringTwo from "@/components/listing/map-style/map-v1/PropertyFilteringTwo";

export default function MapV1() {
  useEffect(() => {
    // ❌ ปิด AOS เฉพาะหน้านี้
    document.documentElement.classList.remove("aos-init", "aos-animate");
  }, []);

  return (
    <>
      <DefaultHeader />
      <MobileMenu />
      <PropertyFilteringTwo />
    </>
  );
}
