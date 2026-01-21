"use client";

import React, { useEffect, useMemo, useState } from "react";
import { propertyData } from "@/data/propertyData";

import TopFilterBar from "./TopFilterBar";
import TopFilterBar2 from "./TopFilterBar2";
import FeaturedListings from "./FeatuerdListings";

import AdvanceFilterModal from "@/components/common/advance-filter-two";
import PaginationTwo from "../../PaginationTwo";
import MapV1LeafletDynamic from "./MapV1Leaflet.dynamic";

// =====================
// ✅ MOCK SETTINGS
// =====================
const MOCK_CURRENT_USER = "owner_a"; // สมมติคนที่ล็อกอิน (owner_a หรือ agent_a ก็ได้)
const PAGE_SIZE = 6;

export default function PropertyFilteringTwo({ agentOnly = true }) {
  // ✅ map-v1: เอาเฉพาะ owner/agent คนนี้เท่านั้น
  const baseData = useMemo(() => {
    const arr = Array.isArray(propertyData) ? propertyData : [];
    if (!agentOnly) return arr;

    // ✅ ให้ owner/agent เข้าดูหน้า map-v1 ได้
    return arr.filter(
      (x) =>
        String(x?.ownerId) === MOCK_CURRENT_USER ||
        String(x?.agentId) === MOCK_CURRENT_USER
    );
  }, [agentOnly]);

  const [filteredData, setFilteredData] = useState([]);
  const [sortedFilteredData, setSortedFilteredData] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(true);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  // ✅ selection from map (คลิก marker แล้วฝั่งซ้าย filter)
  const [pickedIds, setPickedIds] = useState([]);
  const [pickedTitle, setPickedTitle] = useState("");

  useEffect(() => {
    setPageItems(
      sortedFilteredData.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE)
    );
    setPageContentTrac([
      (pageNumber - 1) * PAGE_SIZE + 1,
      pageNumber * PAGE_SIZE,
      sortedFilteredData.length,
    ]);
  }, [pageNumber, sortedFilteredData]);

  // ===== Filters =====
  const [listingStatus, setListingStatus] = useState("All");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Provinces");
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
    setSearchQuery("");

    setPickedIds([]);
    setPickedTitle("");

    document.querySelectorAll(".filterInput").forEach((el) => (el.value = null));
    document
      .querySelectorAll(".filterSelect")
      .forEach((el) => (el.value = "All Provinces"));
  };

  const handlelistingStatus = (elm) =>
    setListingStatus((pre) => (pre === elm ? "All" : elm));

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

  // ✅ filter หลัก
  useEffect(() => {
    const refItems = baseData.filter((elm) => {
      const types = Array.isArray(elm?.listingTypes) ? elm.listingTypes : [];
      if (listingStatus === "All") return true;
      if (listingStatus === "Buy") return types.includes("sell");
      if (listingStatus === "Rent") return types.includes("rent");
      return true;
    });

    const filteredArrays = [];

    if (propertyTypes.length > 0) {
      filteredArrays.push(refItems.filter((elm) => propertyTypes.includes(elm?.propertyType)));
    }

    filteredArrays.push(refItems.filter((el) => Number(el?.details?.bedrooms ?? 0) >= Number(bedrooms)));
    filteredArrays.push(refItems.filter((el) => Number(el?.details?.bathrooms ?? 0) >= Number(bathroms)));

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

    filteredArrays.push(
      !categories.length
        ? [...refItems]
        : refItems.filter((elm) =>
            categories.every((c) => (elm?.details?.amenities || []).includes(c))
          )
    );

    if (location !== "All Provinces") {
      filteredArrays.push(refItems.filter((el) => String(el?.location?.province) === String(location)));
    }

    if (priceRange?.length === 2) {
      filteredArrays.push(
        refItems.filter((elm) => {
          const p = Number(elm?.price ?? 0);
          return p >= Number(priceRange[0]) && p <= Number(priceRange[1]);
        })
      );
    }

    filteredArrays.push([...refItems]);

    let commonItems = refItems.filter((item) =>
      filteredArrays.every((array) => array.includes(item))
    );

    // ✅ apply pickedIds filter (จากการคลิก marker) -> กระทบแค่ list ฝั่งซ้าย
    if (pickedIds.length > 0) {
      const s = new Set(pickedIds.map(String));
      commonItems = commonItems.filter((x) => s.has(String(x?.id)));
    }

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
    pickedIds,
  ]);

  // sort: ไม่ทำ (ตามที่ขอเอา sort ออก)
  useEffect(() => {
    setPageNumber(1);
    setSortedFilteredData(filteredData);
  }, [filteredData]);

  const activeIdsForHighlight = useMemo(() => pickedIds.map(String), [pickedIds]);

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

      <section className="p-0 bgc-f7 map-v1-page">
        <div className="container-fluid map-v1-container">
          <div className="row map-v1-row">
            {/* LEFT */}
            <div className="col-xl-5 map-v1-left">
              <div className="half_map_area_content mt30 map-v1-left-scroll">
                <div className="col-lg-12">
                  <div className="advance-search-list d-flex justify-content-between">
                    <div className="dropdown-lists">
                      <ul className="p-0 mb-0">
                        <TopFilterBar2 filterFunctions={filterFunctions} />
                      </ul>
                    </div>
                  </div>
                </div>

                <h4 className="mb-1">ทรัพย์สินของฉัน</h4>

                {/* ✅ ถ้าเลือกจาก map แล้ว ให้มีแถบแจ้ง + ปุ่มล้าง */}
                {pickedIds.length > 0 && (
                  <div className="lx-picked-bar">
                    <div className="lx-picked-title">
                      กรองจากแผนที่: <b>{pickedTitle || "พื้นที่ที่เลือก"}</b> ({pickedIds.length})
                    </div>
                    <button
                      type="button"
                      className="ud-btn btn-light"
                      onClick={() => {
                        setPickedIds([]);
                        setPickedTitle("");
                      }}
                    >
                      แสดงทั้งหมด
                    </button>
                  </div>
                )}

                <div className="row align-items-center mb10">
                  <TopFilterBar colstyle={colstyle} setColstyle={setColstyle} pageContentTrac={pageContentTrac} />
                </div>

                <div className="row">
                  <FeaturedListings colstyle={colstyle} data={pageItems} activeIds={activeIdsForHighlight} />
                </div>

                <div className="row text-center">
                  <PaginationTwo
                    pageCapacity={PAGE_SIZE}
                    data={sortedFilteredData}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-xl-7 overflow-hidden position-relative map-v1-right">
              <div className="half_map_area map-canvas half_style map-v1-mapwrap">
                {/* ✅ map ต้องใช้ baseData เสมอ เพื่อไม่ให้จุดอื่นหาย */}
                <MapV1LeafletDynamic
                  items={baseData}
                  onSelectItems={(picked, payload) => {
                    const ids = (picked || []).map((x) => String(x?.id)).filter(Boolean);
                    setPickedIds(ids);
                    setPickedTitle(payload?.title || "");
                    setPageNumber(1);
                  }}
                  onClearSelect={() => {
                    setPickedIds([]);
                    setPickedTitle("");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
