"use client";

import { useEffect, useMemo, useState } from "react";
import listings from "@/data/listings";
import Image from "next/image";
import Link from "next/link";

const PRIMARY = "#eb6753";    // สีฟ้าหลักตามธีม
const PILL_BG = "#F3F4F6";    // พื้นหลังปุ่มที่ไม่ได้เลือก
const TEXT_DARK = "#111827";  // สีตัวหนังสือปกติ

const FeaturedListings = ({ data, colstyle }) => {
  // ใช้ data ที่ส่งมา ถ้าไม่มีก็ใช้ listings เดิม
  const source = data && data.length > 0 ? data : listings;

  const [statusFilter, setStatusFilter] = useState("all"); // all | sale | rent
  const [sortBy, setSortBy] = useState("newest"); // newest | price-low | price-high
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = colstyle ? 4 : 6;

  const parsePrice = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const num = Number(value.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const filteredListings = useMemo(() => {
    let list = [...source];

    // Filter: For Sale / For Rent
    if (statusFilter === "sale") {
      list = list.filter((item) => !item.forRent);
    } else if (statusFilter === "rent") {
      list = list.filter((item) => item.forRent);
    }

    // Search: title + location
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => {
        return (
          item.title?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q)
        );
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "price-low") {
        return parsePrice(a.price) - parsePrice(b.price);
      }
      if (sortBy === "price-high") {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      // newest: สมมติใช้ id มาก = ใหม่กว่า
      return (b.id ?? 0) - (a.id ?? 0);
    });

    // ✅ แก้ไขตรงส่วน Sort นี้ครับ
    list.sort((a, b) => {
      // 1. ดัน Featured (!forRent) ขึ้นก่อนเสมอ
      const isFeaturedA = !a.forRent; // ใน JSX คุณเช็คว่าถ้าไม่เช่า คือ Featured
      const isFeaturedB = !b.forRent;

      if (isFeaturedA && !isFeaturedB) return -1; // A เป็น Featured ให้ขึ้นก่อน
      if (!isFeaturedA && isFeaturedB) return 1;  // B เป็น Featured ให้ขึ้นก่อน

      // 2. ถ้าสถานะเหมือนกัน (เป็น Featured ทั้งคู่ หรือ ธรรมดาทั้งคู่) ให้เรียงตาม SortBy ที่เลือก
      if (sortBy === "price-low") {
        return parsePrice(a.price) - parsePrice(b.price);
      }
      if (sortBy === "price-high") {
        return parsePrice(b.price) - parsePrice(a.price);
      }

      // newest: ค่า Default
      return (b.id ?? 0) - (a.id ?? 0);
    });

    return list;
  }, [source, statusFilter, sortBy, search]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedListings = useMemo(() => {
    const start = (currentPageSafe - 1) * PER_PAGE;
    return filteredListings.slice(start, start + PER_PAGE);
  }, [filteredListings, currentPageSafe]);

  // รีเซ็ตไปหน้า 1 ทุกครั้งที่มีการเปลี่ยน filter / sort / search
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy, search]);

  // component ปุ่ม pill filter เพื่อไม่ต้องเขียน style ซ้ำ
  const StatusPill = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className="me-2 mb-2"
      style={{
        borderRadius: 9999,
        padding: "8px 20px",
        fontSize: 14,
        fontWeight: 500,
        border: "none",
        backgroundColor: active ? PRIMARY : PILL_BG,
        color: active ? "#FFFFFF" : TEXT_DARK,
        boxShadow: active ? "0 10px 20px rgba(37,99,235,0.25)" : "none",
        transition: "all 0.15s ease-in-out",
      }}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* FILTER & SORT BAR */}
      <div className="row align-items-center mb20">
        {/* Left filters */}
        <div className="col-lg-9 mb-3 mb-lg-0">
          <div className="d-flex flex-wrap align-items-center">
            {/* สถานะประกาศ */}
            <StatusPill
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              ทั้งหมด
            </StatusPill>
            <StatusPill
              active={statusFilter === "sale"}
              onClick={() => setStatusFilter("sale")}
            >
              ขาย
            </StatusPill>
            <StatusPill
              active={statusFilter === "rent"}
              onClick={() => setStatusFilter("rent")}
            >
              เช่า
            </StatusPill>

            {/* Search */}
            <div
              style={{ minWidth: 260 }}
              className="ms-lg-3 flex-grow-1 mt-2 mt-lg-0"
            >
              <input
                type="text"
                className="form-control border-0"
                style={{
                  borderRadius: 9999,
                  backgroundColor: "#F9FAFB",
                  padding: "10px 20px",
                  height: 46,
                  boxShadow: "0 0 0 1px #E5E7EB inset",
                }}
                placeholder="ค้นหาจากชื่อหรือทำเล..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right sort */}
        <div className="col-lg-3">
          <div className="d-flex justify-content-lg-end align-items-center gap-2 mt-1 mt-lg-0">
            <span className="text-muted fz14">Sort by</span>
            <select
              className="form-select border-0"
              style={{
                maxWidth: 190,
                borderRadius: 9999,
                backgroundColor: "#F9FAFB",
                padding: "10px 20px",
                height: 46,
                boxShadow: "0 0 0 1px #E5E7EB inset",
              }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>
      {/* END FILTER & SORT BAR */}

      {/* SUMMARY */}
      <div className="row mb15">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <p className="mb-0 text-muted fz14">
            พบ {filteredListings.length} รายการ • หน้า {currentPageSafe} /{" "}
            {totalPages}
          </p>
        </div>
      </div>

      {/* LISTINGS GRID */}
      <div className="row g-4">
        {paginatedListings.map((listing) => (
          <div
            className={`${colstyle ? "col-sm-12 col-lg-6" : "col-sm-6 col-lg-4"
              }`}
            key={listing.id}
          >
            <div
              className={
                colstyle
                  ? "listing-style1 listCustom listing-type"
                  : "listing-style1"
              }
            >
              <div className="list-thumb">
                <Image
                  width={382}
                  height={248}
                  className="w-100 cover"
                  style={{ height: "230px" }}
                  src={listing.image}
                  alt="listings"
                />
                <div className="sale-sticker-wrap">
                  {!listing.forRent && (
                    <div className="list-tag fz12">
                      <span className="flaticon-electricity me-2" />
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="list-price">
                  {listing.price} / <span>mo</span>
                </div>
              </div>

              <div className="list-content">
                <h6 className="list-title">
                  <Link href={`/single-v5/${listing.id}`}>
                    {listing.title}
                  </Link>
                </h6>
                <p className="list-text">{listing.location}</p>

                <div className="list-meta d-flex align-items-center">
                  <a href="#">
                    <span className="flaticon-bed" /> {listing.bed} เตียง
                  </a>
                  <a href="#">
                    <span className="flaticon-shower" /> {listing.bath} ห้องน้ำ
                  </a>
                  <a href="#">
                    <span className="flaticon-expand" /> {listing.sqft} ตร.ฟุต
                  </a>
                </div>

                <hr className="mt-2 mb-2" />

                <div className="list-meta2 d-flex justify-content-between align-items-center">
                  <span className="for-what">
                    {listing.forRent ? "เช่า" : "ขาย"}
                  </span>
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
        ))}

        {!paginatedListings.length && (
          <div className="col-12">
            <p className="text-center text-muted mt-3">
              ไม่พบประกาศที่ตรงกับเงื่อนไขการค้นหา
            </p>
          </div>
        )}
      </div>
      {/* END LISTINGS GRID */}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="row mt30">
          <div className="col-12 d-flex align-items-center justify-content-center">
            {/* Prev */}
            <button
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: 38, height: 38 }}
              onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : p))}
              disabled={currentPageSafe === 1}
            >
              <i className="fa-regular fa-chevron-left" />
            </button>

            {/* ตัวเลขหน้า */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = page === currentPageSafe;
              return (
                <button
                  key={page}
                  className={`btn rounded-circle me-2 ${isActive ? "text-white" : "btn-light"
                    }`}
                  style={{
                    width: 38,
                    height: 38,
                    background: isActive ? "#E95E4A" : "#F3F4F6",
                    color: isActive ? "#ffffff" : TEXT_DARK,
                    border: "none",
                  }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 38, height: 38 }}
              onClick={() =>
                setCurrentPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={currentPageSafe === totalPages}
            >
              <i className="fa-regular fa-chevron-right" />
            </button>
          </div>
        </div>
      )}
      {/* END PAGINATION */}
    </>
  );
};

export default FeaturedListings;
