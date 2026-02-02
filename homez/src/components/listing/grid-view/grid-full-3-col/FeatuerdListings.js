"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FeaturedListings = ({ data, colstyle, activeBoostId }) => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // กรองข้อมูล
  const filteredData = data?.filter((listing) => {
    if (!currentCategory || currentCategory === "all") return true;
    return listing.propertyType === currentCategory;
  }) || [];

  // กรณีไม่พบข้อมูล
  if (filteredData.length === 0) {
    return (
      <div className="col-12 text-center py-5">
        <h4>ไม่พบข้อมูลในหมวดหมู่นี้ ({currentCategory})</h4>
        <p className="text-muted">ลองเลือกหมวดหมู่ใหม่ หรือดูรายการทั้งหมด</p>
      </div>
    );
  }

  return (
    <>
      {filteredData.map((listing) => {

        // ==========================================
        // 🔥 1. คำนวณสถานะป้ายก่อน (เพื่อความสะอาด)
        // ==========================================

        // เช็คว่าเป็น Featured หรือไม่? (Boost หรือ ขาย)
        const isFeatured =
          (activeBoostId && String(listing.id) === String(activeBoostId)) ||
          (!listing.listingTypes?.includes("rent") && !listing.forRent);

        // เช็คว่าเป็น Co-Broke หรือไม่? (เช็คจากตัวแปร acceptCoBroke)
        const isCoBroke = listing.acceptCoBroke === true;

        return (
          <div
            className={` ${colstyle ? "col-sm-12 col-lg-6" : "col-sm-6 col-lg-4"} `}
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
                  style={{ height: "230px", objectFit: "cover" }}
                  src={listing.imageSrc || listing.image}
                  alt="listings"
                />

                {/* ==========================================
                    🔥 2. ส่วนแสดงป้าย Badge (แก้ตรงนี้)
                   ========================================== */}
                {/* ✅ แบบที่ 1: เรียงแนวนอน (Side-by-Side) */}
                <div
                  className="sale-sticker-wrap"
                  style={{
                    display: 'flex',
                    gap: '8px',       // ระยะห่างระหว่างป้าย
                    flexWrap: 'wrap', // ถ้าที่เต็ม ให้ปัดลงบรรทัดใหม่
                    alignItems: 'flex-start' // จัดให้ชิดขอบบน
                  }}
                >

                  {/* --- ป้าย FEATURED --- */}
                  {isFeatured && (
                    <div className="list-tag fz12">
                      <span className="flaticon-electricity me-2" />
                      FEATURED
                    </div>
                  )}

                  {/* --- ป้าย CO-BROKE --- */}
                  {isCoBroke && (
                    <div
                      className="list-tag fz12"
                      style={{
                        backgroundColor: "#198754", // สีเขียว
                        // ❌ ไม่ต้องใช้ marginTop แล้ว
                      }}
                    >
                      <span className="flaticon-user-1 me-2" />
                      CO-BROKE
                    </div>
                  )}

                </div>

                <div className="list-price">
                  {listing.priceText || listing.price} / <span>เดือน</span>
                </div>
              </div>
              <div className="list-content">
                <h6 className="list-title">
                  <Link href={`/single-v5/${listing.id}`}>{listing.title}</Link>
                </h6>
                <p className="list-text">
                  {listing.location?.fullText || listing.location}
                </p>
                <div className="list-meta d-flex align-items-center">
                  <a href="#">
                    <span className="flaticon-bed" /> {listing.details?.bedrooms || listing.bed || 0} เตียง
                  </a>
                  <a href="#">
                    <span className="flaticon-shower" /> {listing.details?.bathrooms || listing.bath || 0} ห้องน้ำ
                  </a>
                  <a href="#">
                    <span className="flaticon-expand" /> {listing.details?.usableArea || listing.sqft || 0} ตร.ม.
                  </a>
                </div>
                <hr className="mt-2 mb-2" />
                <div className="list-meta2 d-flex justify-content-between align-items-center">
                  <span className="for-what">
                    {listing.listingTypes?.includes("rent") || listing.forRent ? "เช่า" : "ขาย"}
                  </span>
                  <div className="icons d-flex align-items-center">
                    <a href="#"><span className="flaticon-fullscreen" /></a>
                    <a href="#"><span className="flaticon-new-tab" /></a>
                    <a href="#"><span className="flaticon-like" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FeaturedListings;