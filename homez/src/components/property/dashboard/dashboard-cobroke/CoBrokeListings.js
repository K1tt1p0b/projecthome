"use client";

import { useEffect, useMemo, useState } from "react";
import { propertyData } from "@/data/propertyData";
import Image from "next/image";
import Link from "next/link";

const PRIMARY = "#eb6753";    
const PILL_BG = "#fff"; 
const TEXT_DARK = "#111827";  

const CoBrokeListings = () => {
  const source = propertyData.filter(item => 
    item.acceptCoBroke === true || String(item.acceptCoBroke) === "true"
  );

  const [statusFilter, setStatusFilter] = useState("all"); 
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8; 

  // --- Logic Filter ---
  const filteredListings = useMemo(() => {
    let list = [...source];
    if (statusFilter === "sale") list = list.filter((item) => !item.listingTypes?.includes("rent"));
    else if (statusFilter === "rent") list = list.filter((item) => item.listingTypes?.includes("rent"));
    
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.title?.toLowerCase().includes(q) || item.location?.fullText?.toLowerCase().includes(q));
    }
    return list;
  }, [source, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedListings = useMemo(() => {
    const start = (currentPageSafe - 1) * PER_PAGE;
    return filteredListings.slice(start, start + PER_PAGE);
  }, [filteredListings, currentPageSafe]);

  useEffect(() => setCurrentPage(1), [statusFilter, search]);

  const StatusPill = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className="me-2 mb-2 shadow-sm"
      style={{
        borderRadius: '8px', padding: "8px 20px", fontSize: 14, fontWeight: 500, border: active ? "none" : "1px solid #eee",
        backgroundColor: active ? PRIMARY : PILL_BG, color: active ? "#FFFFFF" : TEXT_DARK, transition: "all 0.15s ease-in-out",
      }}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* --- Filter Section --- */}
      <div className="row align-items-center mb20">
        <div className="col-lg-12">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white p-3 rounded-3 shadow-sm">
            <div className="d-flex align-items-center flex-wrap">
                <span className="fw-bold me-3 text-dark">สถานะ:</span>
                <StatusPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>ทั้งหมด</StatusPill>
                <StatusPill active={statusFilter === "sale"} onClick={() => setStatusFilter("sale")}>ขาย</StatusPill>
                <StatusPill active={statusFilter === "rent"} onClick={() => setStatusFilter("rent")}>เช่า</StatusPill>
            </div>
            <div style={{ minWidth: 250 }} className="flex-grow-1 flex-lg-grow-0">
              <div className="position-relative">
                <input type="text" className="form-control border bg-light" style={{ borderRadius: '8px', padding: "10px 15px 10px 40px", height: 46 }}
                  placeholder="ค้นหาทรัพย์..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <i className="fas fa-search position-absolute text-muted" style={{ top: '15px', left: '15px' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <p className="text-muted fz14 mb-0">พบ {filteredListings.length} รายการที่เปิดรับ Co-Broker</p>
      </div>

      {/* --- Listings List View (สไตล์ Dashboard เรียบหรู) --- */}
      <div className="row g-3">
        {paginatedListings.map((listing, index) => (
          <div className="col-12" key={listing.id}>
            <div 
                className="d-md-flex align-items-center bg-white p-3 rounded-3" 
                style={{ 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)', // เงาบางๆ แบบ Dashboard
                    border: '1px solid #f0f0f0',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                }}
            >
              
              {/* 1. รูปภาพ (ซ้าย) - สี่เหลี่ยมมนๆ */}
              <div className="flex-shrink-0 position-relative" style={{ width: '140px', height: '100px' }}>
                <Image
                  fill
                  className="rounded-3"
                  style={{ objectFit: 'cover' }}
                  src={listing.imageSrc?.startsWith('/') ? listing.imageSrc : `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80`}
                  alt="listings"
                  onError={(e) => { e.currentTarget.srcset = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }}
                />
                 {/* ป้ายขาย/เช่า เล็กๆ มุมรูป */}
                 <div className="position-absolute top-0 start-0 m-2 badge bg-dark opacity-75" style={{fontSize: '10px'}}>
                    {listing.listingTypes?.includes('rent') ? "เช่า" : "ขาย"}
                 </div>
              </div>

              {/* 2. เนื้อหา (กลาง) */}
              <div className="flex-grow-1 ms-md-4 mt-2 mt-md-0 d-flex flex-column justify-content-center">
                 <h6 className="mb-1 text-truncate" style={{maxWidth: '400px'}}>
                    <Link href={`/single-v5/${listing.id}`} className="text-dark fw-bold text-decoration-none hover-primary">
                        {listing.title}
                    </Link>
                 </h6>
                 <p className="text-muted fz13 mb-2 text-truncate" style={{maxWidth: '400px'}}>
                    <i className="flaticon-placeholder me-1"></i> {listing.location?.fullText}
                 </p>
                 
                 {/* ส่วนแสดงค่าคอมมิชชั่น และ Spec */}
                 <div className="d-flex align-items-center flex-wrap gap-3">
                    {/* Badge ค่าคอมฯ */}
                    <div className="d-inline-flex align-items-center px-2 py-1 rounded" 
                         style={{ backgroundColor: '#fff5f3', border: '1px solid #ffe0db', color: '#eb6753', fontSize: '12px', fontWeight: '600' }}>
                        <i className="fas fa-handshake me-1"></i> 
                        ค่าคอม {Number(listing.commissionValue).toLocaleString()} {listing.commissionType === 'percent' ? '%' : '฿'}
                    </div>

                    {/* Spec บ้าน */}
                    <div className="d-none d-lg-flex align-items-center text-muted fz12 gap-3">
                        {listing.details?.bedrooms > 0 && <span><i className="fas fa-bed me-1"></i>{listing.details.bedrooms}</span>}
                        {listing.details?.bathrooms > 0 && <span><i className="fas fa-bath me-1"></i>{listing.details.bathrooms}</span>}
                        {listing.details?.usableArea > 0 && <span><i className="fas fa-ruler-combined me-1"></i>{listing.details.usableArea} ตร.ม.</span>}
                    </div>
                 </div>
              </div>

              {/* 3. ราคา & Action (ขวา) */}
              <div className="ms-md-4 mt-3 mt-md-0 text-md-end d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end" style={{minWidth: '150px'}}>
                 <div className="fw-bold text-primary mb-md-2 fz18">
                    {listing.priceText}
                 </div>
                 
                 <Link 
                    href={`/dashboard-message?interest_property=${listing.id}&type=cobroke`}
                    className="btn btn-sm text-white fw-500 shadow-sm"
                    style={{ 
                        backgroundColor: '#eb6753', 
                        borderRadius: '6px', 
                        padding: '8px 16px',
                        fontSize: '13px',
                        width: 'auto'
                    }}
                 >
                    ทักแชท <i className="far fa-comment-dots ms-1"></i>
                 </Link>
              </div>

            </div>
          </div>
        ))}

        {!paginatedListings.length && (
          <div className="col-12 text-center py-5">
            <h5 className="mt-3 fw-bold text-muted">ไม่พบรายการทรัพย์</h5>
          </div>
        )}
      </div>

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <div className="row mt40">
          <div className="col-12 d-flex align-items-center justify-content-center gap-2">
             <button className="btn btn-white border shadow-sm rounded-3" style={{width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPageSafe === 1}><i className="fas fa-chevron-left fz12"></i></button>
             <span className="fw-bold mx-2 text-dark fz14">หน้า {currentPageSafe} / {totalPages}</span>
             <button className="btn btn-white border shadow-sm rounded-3" style={{width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPageSafe === totalPages}><i className="fas fa-chevron-right fz12"></i></button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoBrokeListings;