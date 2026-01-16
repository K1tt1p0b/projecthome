"use client";

import React, { useEffect, useMemo, useState } from "react";

import { propertyData } from "@/data/propertyData"; // ✅ ใช้ข้อมูลใหม่

import TopFilterBar from "./TopFilterBar";
import TopFilterBar2 from "./TopFilterBar2";
import FeaturedListings from "./FeatuerdListings";


import AdvanceFilterModal from "@/components/common/advance-filter-two";
import PaginationTwo from "../../PaginationTwo";

// ✅ ใช้ dynamic กัน SSR พัง
import MapV1LeafletDynamic from "./MapV1Leaflet.dynamic";

export default function PropertyFilteringTwo({ agentOnly = true }) {
  // ✅ agent-only mock: กรองจาก announcerStatus
  const baseData = useMemo(() => {
    const arr = Array.isArray(propertyData) ? propertyData : [];
    if (!agentOnly) return arr;
    return arr.filter((x) => String(x?.announcerStatus) === "agent");
  }, [agentOnly]);

  const [filteredData, setFilteredData] = useState([]);
  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
  const [sortedFilteredData, setSortedFilteredData] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(true);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  useEffect(() => {
    setPageItems(sortedFilteredData.slice((pageNumber - 1) * 4, pageNumber * 4));
    setPageContentTrac([
      (pageNumber - 1) * 4 + 1,
      pageNumber * 4,
      sortedFilteredData.length,
    ]);
  }, [pageNumber, sortedFilteredData]);

  // ===== Filters (ปรับให้เข้ากับ propertyData) =====
  const [listingStatus, setListingStatus] = useState("All"); // Buy/Rent
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]); // ✅ propertyData เป็น number
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Provinces"); // ✅ แทน Cities
  const [yearBuild, setyearBuild] = useState([0, 2050]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const resetFilter = () => {
    setListingStatus("All");
    setPropertyTypes([]);
    setPriceRange([0, 100000000]);
    setBedrooms(0);
    setBathroms(0);
    setLocation("All Provinces");
    setyearBuild([0, 2050]);
    setCategories([]);
    setCurrentSortingOption("Newest");
    setSearchQuery("");

    // กันพัง: บางหน้ามันไม่มี element พวกนี้
    document.querySelectorAll(".filterInput").forEach((el) => (el.value = null));
    document.querySelectorAll(".filterSelect").forEach((el) => (el.value = "All Provinces"));
  };

  const handlelistingStatus = (elm) => setListingStatus((pre) => (pre === elm ? "All" : elm));

  const handlepropertyTypes = (elm) => {
    if (elm === "All") setPropertyTypes([]);
    else
      setPropertyTypes((pre) =>
        pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm]
      );
  };

  const handlepriceRange = (elm) => setPriceRange(elm);
  const handlebedrooms = (elm) => setBedrooms(elm);
  const handlebathroms = (elm) => setBathroms(elm);
  const handlelocation = (elm) => setLocation(elm);
  const handleyearBuild = (elm) => setyearBuild(elm);

  const handlecategories = (elm) => {
    if (elm === "All") setCategories([]);
    else
      setCategories((pre) =>
        pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm]
      );
  };

  const filterFunctions = {
    handlelistingStatus,
    handlepropertyTypes,
    handlepriceRange,
    handlebedrooms,
    handlebathroms,
    handlelocation,
    handleyearBuild,
    handlecategories,

    priceRange,
    listingStatus,
    propertyTypes,
    resetFilter,

    bedrooms,
    bathroms,
    location,
    yearBuild,
    categories,

    setPropertyTypes,
    setSearchQuery,
  };

  // ✅ filter หลัก (ให้เข้ากับ propertyData)
  useEffect(() => {
    const refItems = baseData.filter((elm) => {
      // listingTypes: ["sell"] / ["rent"]
      const types = Array.isArray(elm?.listingTypes) ? elm.listingTypes : [];

      if (listingStatus === "All") return true;
      if (listingStatus === "Buy") return types.includes("sell");
      if (listingStatus === "Rent") return types.includes("rent");
      return true;
    });

    let filteredArrays = [];

    // propertyType
    if (propertyTypes.length > 0) {
      const filtered = refItems.filter((elm) => propertyTypes.includes(elm?.propertyType));
      filteredArrays.push(filtered);
    }

    // bedrooms / bathrooms
    filteredArrays.push(
      refItems.filter((el) => Number(el?.details?.bedrooms ?? 0) >= Number(bedrooms))
    );
    filteredArrays.push(
      refItems.filter((el) => Number(el?.details?.bathrooms ?? 0) >= Number(bathroms))
    );

    // search: title / location.fullText / province / district
    const q = String(searchQuery || "").toLowerCase().trim();
    filteredArrays.push(
      refItems.filter((el) => {
        if (!q) return true;
        const t = String(el?.title || "").toLowerCase();
        const full = String(el?.location?.fullText || "").toLowerCase();
        const prov = String(el?.location?.province || "").toLowerCase();
        const dist = String(el?.location?.district || "").toLowerCase();
        return t.includes(q) || full.includes(q) || prov.includes(q) || dist.includes(q);
      })
    );

    // categories: ใช้ details.amenities แทน features เดิม
    filteredArrays.push(
      !categories.length
        ? [...refItems]
        : refItems.filter((elm) =>
            categories.every((c) => (elm?.details?.amenities || []).includes(c))
          )
    );

    // location filter: ใช้ province
    if (location !== "All Provinces") {
      filteredArrays.push(refItems.filter((el) => String(el?.location?.province) === String(location)));
    }

    // price range: propertyData.price เป็น number
    if (priceRange?.length === 2) {
      filteredArrays.push(
        refItems.filter((elm) => {
          const p = Number(elm?.price ?? 0);
          return p >= Number(priceRange[0]) && p <= Number(priceRange[1]);
        })
      );
    }

    // yearBuild: ไม่มีจริงใน data -> ปล่อยผ่าน (ถ้าจะใช้จริงค่อยเพิ่ม field)
    filteredArrays.push([...refItems]);

    const commonItems = refItems.filter((item) =>
      filteredArrays.every((array) => array.includes(item))
    );

    setFilteredData(commonItems);
  }, [
    baseData,
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathroms,
    location,
    yearBuild,
    categories,
    searchQuery,
  ]);

  // sort
  useEffect(() => {
    setPageNumber(1);

    if (currentSortingOption === "Newest") {
      // ไม่มี createdAt → ใช้ id มาก่อน
      const sorted = [...filteredData].sort((a, b) => Number(b.id) - Number(a.id));
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() === "Price Low") {
      const sorted = [...filteredData].sort((a, b) => Number(a.price) - Number(b.price));
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() === "Price High") {
      const sorted = [...filteredData].sort((a, b) => Number(b.price) - Number(a.price));
      setSortedFilteredData(sorted);
    } else {
      setSortedFilteredData(filteredData);
    }
  }, [filteredData, currentSortingOption]);

  return (
    <>
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal filterFunctions={filterFunctions} />
        </div>
      </div>

      <section className="p-0 bgc-f7">
        <div className="container-fluid">
          {/* ✅ ตัด data-aos ออกกัน hydration พัง */}
          <div className="row">
            <div className="col-xl-5">
              <div className="half_map_area_content mt30">
                <div className="col-lg-12">
                  <div className="advance-search-list d-flex justify-content-between">
                    <div className="dropdown-lists">
                      <ul className="p-0 mb-0">
                        <TopFilterBar2 filterFunctions={filterFunctions} />
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ✅ เปลี่ยนเป็นภาษาไทย */}
                <h4 className="mb-1">ทรัพย์สินของฉัน (เฉพาะนายหน้า)</h4>

                <div className="row align-items-center mb10">
                  <TopFilterBar
                    pageContentTrac={pageContentTrac}
                    colstyle={colstyle}
                    setColstyle={setColstyle}
                    setCurrentSortingOption={setCurrentSortingOption}
                  />
                </div>

                <div className="row">
                  <FeaturedListings colstyle={colstyle} data={pageItems} />
                </div>

                <div className="row text-center">
                  <PaginationTwo
                    pageCapacity={4}
                    data={sortedFilteredData}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                  />
                </div>
              </div>
            </div>

            {/* ✅ ฝั่งขวา map ใหม่ */}
            <div className="col-xl-7 overflow-hidden position-relative">
              <div className="half_map_area map-canvas half_style map-v1-mapwrap">
                <MapV1LeafletDynamic items={sortedFilteredData} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
