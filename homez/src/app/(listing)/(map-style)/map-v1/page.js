"use client";

import { useEffect } from "react";
import Header from "@/components/home/home-v10/Header";
import MobileMenu from "@/components/common/mobile-menu";
import PropertyFilteringTwo from "@/components/listing/map-style/map-v1/PropertyFilteringTwo";

export default function MapV1Page() {
  useEffect(() => {
    document.body.classList.add("page-map-v1");
    return () => document.body.classList.remove("page-map-v1");
  }, []);

  return (
    <>
      <Header />
      <MobileMenu />
      <PropertyFilteringTwo agentOnly={true} />
    </>
  );
}
