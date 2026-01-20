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
const MOCK_CURRENT_USER = "user_a";
const PAGE_SIZE = 6;

// ทำ mock ให้มีเยอะขึ้น แต่ “อิงจาก propertyData เดิม” และ “พิกัด/ประเภทตรง”
function buildMockAll(base, total = 24) {
  const src = Array.isArray(base) ? base : [];
  const out = [];
  if (!src.length) return out;

  for (let i = 0; i < total; i++) {
    const s = src[i % src.length];

    // สลับเจ้าของ: ให้ user_a เยอะหน่อยเพื่อ map-v1 เห็นชัด
    const ownerId = i % 10 < 7 ? "user_a" : "user_b";

    out.push({
      ...s,
      id: `${s.id}-${i + 1}`, // unique
      ownerId,
      agentId: ownerId,
      title: s.title ? `${s.title} (${i + 1})` : `ทรัพย์ตัวอย่าง (${i + 1})`,
      // คุมให้ประเภท “วนตามของจริง + เพิ่มกระจาย”
      propertyType: s.propertyType || ["house-and-land", "condo", "land", "room-rent"][i % 4],
      // คุมพิกัดให้ “ไม่หลุด” แต่กระจายเบา ๆ เพื่อไม่ทับกันเยอะเกิน
      location: {
        ...(s.location || {}),
        latitude: Number(s?.location?.latitude) + (i % 3) * 0.0012,
        longitude: Number(s?.location?.longitude) + (i % 4) * 0.0012,
      },
    });
  }

  return out;
}

export default function PropertyFilteringTwo({ agentOnly = true }) {
  // ✅ ทำ mock all (ใช้กับหน้า home ได้ด้วยถ้าอยาก reuse)
  const mockAll = useMemo(() => buildMockAll(propertyData, 24), []);

  // ✅ map-v1: โชว์เฉพาะของ “คนที่ล็อกอิน” (mock)
  const baseData = useMemo(() => {
    if (!agentOnly) return mockAll;
    return mockAll.filter((x) => String(x?.ownerId ?? x?.agentId) === MOCK_CURRENT_USER);
  }, [agentOnly, mockAll]);

  // ===== state =====
  const [filteredData, setFilteredData] = useState([]);
  const [sortedFilteredData, setSortedFilteredData] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(true);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  // ✅ selection from map
  const [pickedIds, setPickedIds] = useState([]);
  const [pickedTitle, setPickedTitle] = useState("");

  // ✅ map should NOT disappear when picked
  const [mapData, setMapData] = useState(baseData);

  useEffect(() => {
    setPageItems(sortedFilteredData.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE));
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
    document.querySelectorAll(".filterSelect").forEach((el) => (el.value = "All Provinces"));
  };

  const handlelistingStatus = (elm) => setListingStatus((pre) => (pre === elm ? "All" : elm));
  const handlepropertyTypes = (elm) => {
    if (elm === "All") setPropertyTypes([]);
    else setPropertyTypes((pre) => (pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm]));
  };

  const handlepriceRange = (elm) => setPriceRange(elm);
  const handlebedrooms = (elm) => setBedrooms(elm);
  const handlebathroms = (elm) => setBathroms(elm);
  const handlelocation = (elm) => setLocation(elm);
  const handleyearBuild = (elm) => setyearBuild(elm);
  const handlecategories = (elm) => {
    if (elm === "All") setCategories([]);
    else setCategories((pre) => (pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm]));
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

  // ✅ filter หลัก + แยก mapData (ไม่โดน pickedIds)
  useEffect(() => {
    const refItems = baseData.filter((elm) => {
      const types = Array.isArray(elm?.listingTypes) ? elm.listingTypes : [];
      if (listingStatus === "All") return true;
      if (listingStatus === "Buy") return types.includes("sell");
      if (listingStatus === "Rent") return types.includes("rent");
      return true;
    });

    const arrays = [];

    if (propertyTypes.length > 0) {
      arrays.push(refItems.filter((elm) => propertyTypes.includes(elm?.propertyType)));
    }

    arrays.push(refItems.filter((el) => Number(el?.details?.bedrooms ?? 0) >= Number(bedrooms)));
    arrays.push(refItems.filter((el) => Number(el?.details?.bathrooms ?? 0) >= Number(bathroms)));

    const q = String(searchQuery || "").toLowerCase().trim();
    arrays.push(
      refItems.filter((el) => {
        if (!q) return true;
        const t = String(el?.title || "").toLowerCase();
        const full = String(el?.location?.fullText || "").toLowerCase();
        const prov = String(el?.location?.province || "").toLowerCase();
        const dist = String(el?.location?.district || "").toLowerCase();
        return t.includes(q) || full.includes(q) || prov.includes(q) || dist.includes(q);
      })
    );

    arrays.push(
      !categories.length
        ? [...refItems]
        : refItems.filter((elm) => categories.every((c) => (elm?.details?.amenities || []).includes(c)))
    );

    if (location !== "All Provinces") {
      arrays.push(refItems.filter((el) => String(el?.location?.province) === String(location)));
    }

    if (priceRange?.length === 2) {
      arrays.push(
        refItems.filter((elm) => {
          const p = Number(elm?.price ?? 0);
          return p >= Number(priceRange[0]) && p <= Number(priceRange[1]);
        })
      );
    }

    // yearBuild ไม่มีจริง -> ผ่าน
    arrays.push([...refItems]);

    const common = refItems.filter((item) => arrays.every((arr) => arr.includes(item)));

    // ✅ mapData = common (ไม่โดน picked)
    setMapData(common);

    // ✅ listData = common + pickedIds
    let listCommon = common;
    if (pickedIds.length > 0) {
      const s = new Set(pickedIds.map(String));
      listCommon = listCommon.filter((x) => s.has(String(x?.id)));
    }

    setFilteredData(listCommon);
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

  // sort: ไม่ทำ (ตามข้อมูล)
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

                <h4 className="mb-1">ทรัพย์สินของฉัน (เฉพาะนายหน้า)</h4>

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
                <MapV1LeafletDynamic
                  // ✅ สำคัญ: map ใช้ mapData (ไม่โดน pickedIds)
                  items={mapData}
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
