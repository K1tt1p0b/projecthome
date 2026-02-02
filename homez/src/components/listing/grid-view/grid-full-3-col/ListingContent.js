"use client"; // ✅ ไฟล์นี้เป็น Client Component

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/home/home-v10/Header";
import MobileMenu from "@/components/common/mobile-menu";
import ProperteyFiltering from "@/components/listing/grid-view/grid-full-3-col/ProperteyFiltering";
import Footer from "@/components/common/default-footer";
import propertyData from "@/data/propertyData";

// สร้าง Component ย่อยเพื่อดึง Params (ต้องอยู่ภายใต้ Suspense)
const ListingBody = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const categoryTitles = {
    "house-and-land": "บ้านพร้อมที่ดิน",
    "condo": "คอนโดมิเนียม",
    "house": "บ้านเดี่ยว",
    "townhome": "ทาวน์โฮม",
    "land": "ที่ดินเปล่า",
  };

  const pageTitle = categoryTitles[categoryParam] || "อสังหาริมทรัพย์ทั้งหมด";

  return (
    <>
      {/* Breadcumb Sections */}
      <section className="breadcumb-section bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">{pageTitle}</h2>
                <div className="breadcumb-list">
                  <a href="/">หน้าแรก</a>
                  <a href="#">{pageTitle}</a>
                </div>
                <a
                  className="filter-btn-left mobile-filter-btn d-block d-lg-none"
                  data-bs-toggle="offcanvas"
                  href="#listingSidebarFilter"
                  role="button"
                  aria-controls="listingSidebarFilter"
                >
                  <span className="flaticon-settings" /> Filter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Filtering */}
      <ProperteyFiltering data={propertyData} />
    </>
  );
};

const ListingContent = () => {
  return (
    <>
      <Header />
      <MobileMenu />
      
      {/* ✅ ห่อส่วนที่ใช้ useSearchParams ด้วย Suspense ป้องกัน Error ตอน Build */}
      <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
        <ListingBody />
      </Suspense>

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default ListingContent;