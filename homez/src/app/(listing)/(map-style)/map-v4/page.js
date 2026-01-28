import Header from "@/components/home/home-v10/Header";

import MobileMenu from "@/components/common/mobile-menu";

import PropertyFilteringMapFive from "@/components/listing/map-style/map-v4/PropertyFilteringMapFive";

import React from "react";

export const metadata = {
  title: "Map V4 || Homez - Real Estate NextJS Template",
};

const MapV4 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <Header />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}
      <PropertyFilteringMapFive/>

   
      {/* Property Filtering */}
    </>
  );
};

export default MapV4;
