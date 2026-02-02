'use client'

import React, { useState, useEffect } from 'react'
import ListingSidebar from '../../sidebar'
import AdvanceFilterModal from '@/components/common/advance-filter-two'
import TopFilterBar from './TopFilterBar'
import FeaturedListings from '@/components/listing/grid-view/grid-full-3-col/FeatuerdListings'
import PaginationTwo from "../../PaginationTwo";

// ==========================================
// ✅ 1. ส่วนจัดการ Auto Boost
// ==========================================
const LS_AUTO_KEY = "landx_boost_auto_v1";

const getBoostData = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_AUTO_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // Debug: ดูว่าอ่านค่าจาก LS ได้อะไร?
    console.log("🔥 [Boost Check] Raw LS Data:", data);

    // ต้อง Enabled และมี ID ถึงจะถือว่า Boost
    if (data && data.enabled && data.activePropertyId) {
      return {
        id: String(data.activePropertyId), // แปลงเป็น String เสมอ
        startedAt: data.activeStartedAt || Date.now()
      };
    }
  } catch (error) {
    console.error("Error reading boost:", error);
    return null;
  }
  return null;
};

// ==========================================
// ✅ Main Component
// ==========================================
export default function ProperteyFiltering({ data = [] }) {

  const allListings = data || [];

  const [filteredData, setFilteredData] = useState([]);
  const [currentSortingOption, setCurrentSortingOption] = useState('Newest')
  const [sortedFilteredData, setSortedFilteredData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1)
  const [colstyle, setColstyle] = useState(false)
  const [pageItems, setPageItems] = useState([])
  const [pageContentTrac, setPageContentTrac] = useState([])

  // State เก็บข้อมูล Boost
  const [activeBoost, setActiveBoost] = useState(null);

  // ✅ โหลดข้อมูล Boost ตอนเริ่มต้น
  useEffect(() => {
    const boostInfo = getBoostData();
    if (boostInfo) {
      console.log("✅ [Boost Found] Active ID:", boostInfo.id);
    } else {
      console.log("❌ [Boost Not Found] No active boost.");
    }
    setActiveBoost(boostInfo);
  }, []);

  // --- Pagination Logic ---
  useEffect(() => {
    setPageItems(sortedFilteredData.slice((pageNumber - 1) * 9, pageNumber * 9))
    setPageContentTrac([((pageNumber - 1) * 9) + 1, pageNumber * 9, sortedFilteredData.length])
  }, [pageNumber, sortedFilteredData])

  // --- Filter States ---
  const [listingStatus, setListingStatus] = useState('All')
  const [propertyTypes, setPropertyTypes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 100000000])
  const [bedrooms, setBedrooms] = useState(0)
  const [bathroms, setBathroms] = useState(0)
  const [location, setLocation] = useState('All Cities')
  const [squirefeet, setSquirefeet] = useState([])
  const [yearBuild, setyearBuild] = useState([])
  const [categories, setCategories] = useState([])

  const resetFilter = () => {
    setListingStatus('All')
    setPropertyTypes([])
    setPriceRange([0, 100000000])
    setBedrooms(0)
    setBathroms(0)
    setLocation('All Cities')
    setSquirefeet([])
    setyearBuild([0, 2050])
    setCategories([])
    setCurrentSortingOption('Newest')
    document.querySelectorAll(".filterInput").forEach((element) => { element.value = null; });
    document.querySelectorAll(".filterSelect").forEach((element) => { element.value = 'All Cities'; });
  }

  const handlelistingStatus = (elm) => setListingStatus(pre => pre == elm ? 'All' : elm)
  const handlepropertyTypes = (elm) => {
    if (elm == 'All') {
      setPropertyTypes([])
    } else {
      setPropertyTypes(pre => pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm])
    }
  }
  const handlepriceRange = (elm) => setPriceRange(elm)
  const handlebedrooms = (elm) => setBedrooms(elm)
  const handlebathroms = (elm) => setBathroms(elm)
  const handlelocation = (elm) => setLocation(elm)
  const handlesquirefeet = (elm) => setSquirefeet(elm)
  const handleyearBuild = (elm) => setyearBuild(elm)
  const handlecategories = (elm) => {
    if (elm == 'All') {
      setCategories([])
    } else {
      setCategories(pre => pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm])
    }
  }

  const filterFunctions = {
    handlelistingStatus, handlepropertyTypes, handlepriceRange, handlebedrooms,
    handlebathroms, handlelocation, handlesquirefeet, handleyearBuild, handlecategories,
    priceRange, listingStatus, propertyTypes, resetFilter, bedrooms, bathroms,
    location, squirefeet, yearBuild, categories, setPropertyTypes
  }

  // --- Main Filter Logic ---
  useEffect(() => {
    const refItems = allListings.filter((elm) => {
      if (listingStatus == "All") return true;
      if (listingStatus == "Buy") return !elm.forRent;
      if (listingStatus == "Rent") return elm.forRent;
    });

    let filteredArrays = [];

    if (propertyTypes.length > 0) {
      const filtered = refItems.filter((elm) => propertyTypes.includes(elm.propertyType));
      filteredArrays = [...filteredArrays, filtered];
    }

    filteredArrays = [...filteredArrays, refItems.filter((el => (el.bed || el.details?.bedrooms || 0) >= bedrooms))];
    filteredArrays = [...filteredArrays, refItems.filter((el => (el.bath || el.details?.bathrooms || 0) >= bathroms))];

    if (location != 'All Cities') {
      filteredArrays = [...filteredArrays, refItems.filter((el => (el.city || el.location?.province) == location))];
    }

    if (priceRange.length > 0) {
      const filtered = refItems.filter((elm) => {
        let price = elm.price;
        if (typeof price === 'string') {
          price = Number(price.replace(/[^0-9.-]+/g, ""));
        }
        return price >= priceRange[0] && price <= priceRange[1];
      });
      filteredArrays = [...filteredArrays, filtered];
    }

    const commonItems = refItems.filter((item) =>
      filteredArrays.every((array) => array.includes(item))
    );

    setFilteredData(commonItems);

  }, [listingStatus, propertyTypes, priceRange, bedrooms, bathroms, location, squirefeet, yearBuild, categories, allListings])


  // --- ⚡ Sorting Logic (ฉบับแก้ไข: Featured = Boost แบบเดียว) ---
  useEffect(() => {
    setPageNumber(1)
    let sorted = [...filteredData];

    // 1. ฟังก์ชันเช็คว่า "มีป้าย Featured หรือไม่?" (ใช้ Logic เดียวกับไฟล์แสดงผล)
    const isFeatured = (item) => {
      // กรณี A: เป็นตัวที่กำลัง Auto Boost (ถือว่า Featured)
      if (activeBoost && String(item.id) === String(activeBoost.id)) {
        return true;
      }
      // กรณี B: เป็นรายการขาย (ที่โชว์ป้าย Featured สีส้มตาม Logic เดิม)
      // ถ้าคุณต้องการให้ "Featured มีแค่แบบเดียว" คือต้องเช็คทั้งคู่แบบนี้
      if (!item.listingTypes?.includes("rent") && !item.forRent) {
        return true;
      }

      return false;
    };

    // 2. ฟังก์ชันเช็คว่าเป็น "Active Boost" (ตัวที่เพิ่งกดดัน) หรือไม่?
    const isActiveBoost = (item) => {
      return activeBoost && String(item.id) === String(activeBoost.id);
    };

    const getPrice = (item) => {
      if (typeof item.price === 'string') {
        return Number(item.price.replace(/[^0-9.-]+/g, ""));
      }
      return item.price;
    };

    sorted.sort((a, b) => {
      const featuredA = isFeatured(a);
      const featuredB = isFeatured(b);

      // ---------------------------------------------------------
      // ⚡ Step 1: แยก "Featured" vs "คนธรรมดา"
      // ---------------------------------------------------------

      // ถ้า A เป็น Featured แต่ B ไม่ใช่ -> A ขึ้นก่อน
      if (featuredA && !featuredB) return -1;

      // ถ้า B เป็น Featured แต่ A ไม่ใช่ -> B ขึ้นก่อน
      if (!featuredA && featuredB) return 1;

      // ---------------------------------------------------------
      // ⚡ Step 2: ถ้าเป็น "Featured" เหมือนกัน (อยู่ในกลุ่มบนเหมือนกัน)
      // ---------------------------------------------------------
      if (featuredA && featuredB) {
        // ให้ "Active Boost" (ตัวที่เพิ่งกดดัน) ชนะเสมอ
        const activeA = isActiveBoost(a);
        const activeB = isActiveBoost(b);

        if (activeA && !activeB) return -1; // A คือตัวที่เพิ่งดัน -> A ขึ้นที่ 1
        if (!activeA && activeB) return 1;  // B คือตัวที่เพิ่งดัน -> B ขึ้นที่ 1

        // ถ้าไม่มีใครเป็น Active (หรือเป็น Static Featured ทั้งคู่) 
        // ให้เรียงตาม Newest/Price ตามปกติ
      }

      // ---------------------------------------------------------
      // ⚡ Step 3: การเรียงลำดับภายในกลุ่ม (Sorting Option)
      // ---------------------------------------------------------
      if (currentSortingOption == 'Newest') {
        return b.id - a.id;
      }
      else if (currentSortingOption.trim() == 'Price Low') {
        return getPrice(a) - getPrice(b);
      }
      else if (currentSortingOption.trim() == 'Price High') {
        return getPrice(b) - getPrice(a);
      }

      return 0;
    });

    setSortedFilteredData(sorted);

  }, [filteredData, currentSortingOption, activeBoost])

  return (
    <section className="pt0 pb90 bgc-f7">
      <div className="container">
        <div className="offcanvas offcanvas-start p-0" tabIndex="-1" id="listingSidebarFilter" aria-labelledby="listingSidebarFilterLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="listingSidebarFilterLabel">Listing Filter</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body p-0">
            <ListingSidebar filterFunctions={filterFunctions} />
          </div>
        </div>

        <div className="advance-feature-modal">
          <div className="modal fade" id="advanceSeachModal" tabIndex={-1} aria-labelledby="advanceSeachModalLabel" aria-hidden="true">
            <AdvanceFilterModal filterFunctions={filterFunctions} />
          </div>
        </div>

        <div className="row">
          <TopFilterBar
            pageContentTrac={pageContentTrac}
            colstyle={colstyle}
            setColstyle={setColstyle}
            filterFunctions={filterFunctions}
            setCurrentSortingOption={setCurrentSortingOption}
          />
        </div>

        {/* ส่ง activeBoostId ไปให้ FeaturedListings */}
        <div className="row">
          <FeaturedListings
            colstyle={colstyle}
            data={pageItems}
            activeBoostId={activeBoost?.id}
          />
        </div>

        <div className="row">
          <PaginationTwo
            pageCapacity={9}
            data={sortedFilteredData}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        </div>
      </div>
    </section>
  )
}