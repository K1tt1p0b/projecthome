"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { propertyData } from "@/data/propertyData";

import TopFilterBar from "./TopFilterBar";
import TopFilterBar2 from "./TopFilterBar2";

import AdvanceFilterModal from "@/components/common/advance-filter-two";
import PaginationTwo from "../../PaginationTwo";

// ✅ ใช้ dynamic กัน SSR พัง
import MapV1LeafletDynamic from "./MapV1Leaflet.dynamic";

const FALLBACK_IMAGE = "/images/listings/list-1.jpg";

function safeNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getImageSrc(it) {
  const src =
    it?.imageSrc ||
    (Array.isArray(it?.gallery) ? it.gallery[0] : null) ||
    it?.image; // รองรับของเก่าถ้ามี
  if (!src || String(src).trim() === "") return FALLBACK_IMAGE;
  return src;
}

function getLocationText(it) {
  const loc = it?.location;
  if (typeof loc === "string") return loc || "—";
  const full = loc?.fullText;
  if (typeof full === "string" && full.trim()) return full;
  const composed = [loc?.address, loc?.district, loc?.province].filter(Boolean).join(" ");
  return composed || "—";
}

function isForRent(it) {
  const types = Array.isArray(it?.listingTypes) ? it.listingTypes : [];
  return types.includes("rent");
}

function priceLabel(it) {
  if (it?.priceText) return `฿${it.priceText}`;
  const n = safeNumber(it?.price, 0);
  return `฿${n.toLocaleString()}`;
}

function forWhatLabel(it) {
  return isForRent(it) ? "ให้เช่า" : "ขาย";
}

// ✅ การ์ดรายการแบบง่าย (ไม่มีป้าย FEATURED)
function ListingCard({ item }) {
  const imgSrc = getImageSrc(item);
  const locText = getLocationText(item);

  const bed = safeNumber(item?.details?.bedrooms, 0);
  const bath = safeNumber(item?.details?.bathrooms, 0);
  const area = safeNumber(item?.details?.usableArea, 0);

  return (
    <div className="col-sm-12">
      <div className="listing-style1 listCustom listing-type">
        <div className="list-thumb">
          <Image
            width={382}
            height={248}
            className="w-100 cover"
            src={imgSrc}
            style={{ height: "240px", objectFit: "cover" }}
            alt={item?.title || "listing"}
          />

          <div className="list-price">
            {priceLabel(item)} {isForRent(item) ? <span>/ เดือน</span> : null}
          </div>
        </div>

        <div className="list-content">
          <h6 className="list-title">
            <Link href={`/single-v5/${item?.id ?? ""}`}>{item?.title || "—"}</Link>
          </h6>

          <p className="list-text">{locText}</p>

          <div className="list-meta d-flex align-items-center">
            <a href="#">
              <span className="flaticon-bed" /> {bed} ห้อง
            </a>
            <a href="#">
              <span className="flaticon-shower" /> {bath} ห้อง
            </a>
            <a href="#">
              <span className="flaticon-expand" /> {area} ตร.ม.
            </a>
          </div>

          <hr className="mt-2 mb-2" />

          <div className="list-meta2 d-flex justify-content-between align-items-center">
            <span className="for-what">{forWhatLabel(item)}</span>
            <div className="icons d-flex align-items-center">
              <a href="#">
                <span className="flaticon-fullscreen" />
              </a>
              <a href="#">
                <span className="flaticon-new-tab" />
              </a>
              <a href="#">
                <span className="flaticon-like" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [colstyle, setColstyle] = useState(true); // ยังให้ toggle ได้ แต่ตอนนี้เราจะ render แบบ list เป็นหลัก
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([0, 0, 0]);

  useEffect(() => {
    const pageSize = 4;
    const start = (pageNumber - 1) * pageSize;
    const end = pageNumber * pageSize;

    setPageItems(sortedFilteredData.slice(start, end));
    setPageContentTrac([start + 1, end, sortedFilteredData.length]);
  }, [pageNumber, sortedFilteredData]);

  // ===== Filters =====
  const [listingStatus, setListingStatus] = useState("All"); // Buy/Rent
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
    setCurrentSortingOption("Newest");
    setSearchQuery("");

    if (typeof document !== "undefined") {
      document.querySelectorAll(".filterInput").forEach((el) => (el.value = null));
      document
        .querySelectorAll(".filterSelect")
        .forEach((el) => (el.value = "All Provinces"));
    }
  };

  const handlelistingStatus = (elm) =>
    setListingStatus((pre) => (pre === elm ? "All" : elm));

  const handlepropertyTypes = (elm) => {
    if (elm === "All") setPropertyTypes([]);
    else {
      setPropertyTypes((pre) =>
        pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm]
      );
    }
  };

  const handlepriceRange = (elm) => setPriceRange(elm);
  const handlebedrooms = (elm) => setBedrooms(elm);
  const handlebathroms = (elm) => setBathroms(elm);
  const handlelocation = (elm) => setLocation(elm);
  const handleyearBuild = (elm) => setyearBuild(elm);

  const handlecategories = (elm) => {
    if (elm === "All") setCategories([]);
    else {
      setCategories((pre) =>
        pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm]
      );
    }
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
      const types = Array.isArray(elm?.listingTypes) ? elm.listingTypes : [];

      if (listingStatus === "All") return true;
      if (listingStatus === "Buy") return types.includes("sell");
      if (listingStatus === "Rent") return types.includes("rent");
      return true;
    });

    const filteredArrays = [];

    // propertyType
    if (propertyTypes.length > 0) {
      filteredArrays.push(
        refItems.filter((elm) => propertyTypes.includes(elm?.propertyType))
      );
    }

    // bedrooms / bathrooms
    filteredArrays.push(
      refItems.filter((el) => safeNumber(el?.details?.bedrooms, 0) >= Number(bedrooms))
    );
    filteredArrays.push(
      refItems.filter((el) => safeNumber(el?.details?.bathrooms, 0) >= Number(bathroms))
    );

    // search
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

    // categories: details.amenities
    filteredArrays.push(
      !categories.length
        ? [...refItems]
        : refItems.filter((elm) =>
            categories.every((c) => (elm?.details?.amenities || []).includes(c))
          )
    );

    // location filter: province
    if (location !== "All Provinces") {
      filteredArrays.push(
        refItems.filter(
          (el) => String(el?.location?.province) === String(location)
        )
      );
    }

    // price range
    if (Array.isArray(priceRange) && priceRange.length === 2) {
      filteredArrays.push(
        refItems.filter((elm) => {
          const p = safeNumber(elm?.price, 0);
          return p >= Number(priceRange[0]) && p <= Number(priceRange[1]);
        })
      );
    }

    // yearBuild: ยังไม่มีจริงใน data → ผ่าน
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
      const sorted = [...filteredData].sort((a, b) => Number(b.id) - Number(a.id));
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() === "Price Low") {
      const sorted = [...filteredData].sort((a, b) => safeNumber(a.price) - safeNumber(b.price));
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() === "Price High") {
      const sorted = [...filteredData].sort((a, b) => safeNumber(b.price) - safeNumber(a.price));
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

      {/* ✅ ใส่ class เต็มจอ (ไปใช้คู่กับ CSS ที่ทำไว้) */}
      <section className="p-0 bgc-f7 map-v1-page">
        <div className="container-fluid map-v1-container">
          <div className="row map-v1-row">
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

                <div className="row align-items-center mb10">
                  <TopFilterBar
                    pageContentTrac={pageContentTrac}
                    colstyle={colstyle}
                    setColstyle={setColstyle}
                    setCurrentSortingOption={setCurrentSortingOption}
                  />
                </div>

                <div className="row">
                  {pageItems.length ? (
                    pageItems.map((it) => <ListingCard key={String(it?.id)} item={it} />)
                  ) : (
                    <div className="col-12">
                      <div style={{ padding: 14, opacity: 0.7 }}>
                        ไม่พบรายการที่ตรงกับเงื่อนไข
                      </div>
                    </div>
                  )}
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

            <div className="col-xl-7 overflow-hidden position-relative map-v1-right">
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
