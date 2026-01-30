"use client";

import { useEffect, useMemo, useState } from "react";
import { propertyData } from "@/data/propertyData";
import Image from "next/image";
import Link from "next/link";
import Select from "react-select";

const PRIMARY = "#eb6753";
const PILL_BG = "#fff";
const TEXT_DARK = "#111827";

const CoBrokeListings = () => {
  const source = propertyData.filter(item =>
    item.acceptCoBroke === true || String(item.acceptCoBroke) === "true"
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  // ✅ 2. ตัวเลือกสำหรับ Dropdown (Format ของ react-select)
  const sortOptions = [
    { value: 'newest', label: 'อัปเดตล่าสุด' },
    { value: 'oldest', label: 'เก่าที่สุด' },
    { value: 'price-asc', label: 'ราคา: ต่ำ - สูง' },
    { value: 'price-desc', label: 'ราคา: สูง - ต่ำ' },
  ];

  // ✅ 3. สไตล์ Dropdown (ก๊อปมาจากหน้า Contact Admin เป๊ะๆ)
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f8f9fa', // สีพื้นหลังเทาอ่อนแบบ Contact Admin
      border: '1px solid #ced4da', // สีขอบ
      borderRadius: '8px',
      padding: '4px', // ปรับ Padding นิดหน่อยให้สูงใกล้เคียงช่องค้นหา
      minHeight: '50px', // ✅ บังคับความสูงให้เท่าช่องค้นหา
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': { borderColor: '#a8b3c4' }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '12px',
      overflow: 'hidden',
      zIndex: 9999,
      marginTop: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#eb6753' : state.isFocused ? '#e9ecef' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '14px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#212529',
      fontWeight: '600', // ตัวหนาหน่อย
      fontSize: '14px'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6c757d',
    }),
    indicatorSeparator: () => ({ display: 'none' }), // ซ่อนเส้นคั่น
  };

  // --- Logic Filter (เหมือนเดิม) ---
  const filteredListings = useMemo(() => {
    let list = [...source];

    if (statusFilter === "sale") list = list.filter((item) => !item.listingTypes?.includes("rent"));
    else if (statusFilter === "rent") list = list.filter((item) => item.listingTypes?.includes("rent"));

    if (propertyTypeFilter !== "all") {
      list = list.filter((item) => item.propertyType?.toLowerCase() === propertyTypeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.title?.toLowerCase().includes(q) || item.location?.fullText?.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const dateA = new Date(a.datePosted || new Date());
      const dateB = new Date(b.datePosted || new Date());
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);

      if (sortOrder === "newest") return dateB - dateA;
      if (sortOrder === "oldest") return dateA - dateB;
      if (sortOrder === "price-asc") return priceA - priceB;
      if (sortOrder === "price-desc") return priceB - priceA;
      return 0;
    });

    return list;
  }, [source, statusFilter, search, propertyTypeFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedListings = useMemo(() => {
    const start = (currentPageSafe - 1) * PER_PAGE;
    return filteredListings.slice(start, start + PER_PAGE);
  }, [filteredListings, currentPageSafe]);

  useEffect(() => setCurrentPage(1), [statusFilter, search, propertyTypeFilter, sortOrder]);

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

  const formatDate = (dateString) => {
    if (!dateString) return "เมื่อสักครู่";
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric', month: 'short', year: '2-digit'
    });
  };

  return (
    <>
      {/* --- Filter Section --- */}
      <div className="row align-items-center mb20">
        <div className="col-lg-12">
          <div className="bg-white p-4 rounded-3 shadow-sm">

            {/* แถวที่ 1: สถานะ และ ประเภททรัพย์ */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div className="d-flex align-items-center flex-wrap">
                <span className="fw-bold me-3 text-dark">สถานะ:</span>
                <StatusPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>ทั้งหมด</StatusPill>
                <StatusPill active={statusFilter === "sale"} onClick={() => setStatusFilter("sale")}>ขาย</StatusPill>
                <StatusPill active={statusFilter === "rent"} onClick={() => setStatusFilter("rent")}>เช่า</StatusPill>
              </div>

              <div className="d-flex align-items-center flex-wrap ms-lg-4 ps-lg-4 border-start-lg">
                <span className="fw-bold me-3 text-dark">ประเภท:</span>
                <StatusPill active={propertyTypeFilter === "all"} onClick={() => setPropertyTypeFilter("all")}>รวม</StatusPill>
                <StatusPill active={propertyTypeFilter === "condo"} onClick={() => setPropertyTypeFilter("condo")}>คอนโด</StatusPill>
                <StatusPill active={propertyTypeFilter === "house"} onClick={() => setPropertyTypeFilter("house")}>บ้าน</StatusPill>
                <StatusPill active={propertyTypeFilter === "townhome"} onClick={() => setPropertyTypeFilter("townhome")}>ทาวน์โฮม</StatusPill>
                <StatusPill active={propertyTypeFilter === "land"} onClick={() => setPropertyTypeFilter("land")}>ที่ดิน</StatusPill>
              </div>
            </div>

            {/* แถวที่ 2: ค้นหา และ เรียงลำดับ */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="flex-grow-1" style={{ minWidth: 250 }}>
                <div className="position-relative">
                  <input type="text" className="form-control border bg-light" style={{ borderRadius: '8px', padding: "10px 15px 10px 40px", height: 50 }}
                    placeholder="ค้นหาชื่อโครงการ, ทำเล..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  <i className="fas fa-search position-absolute text-muted" style={{ top: '18px', left: '15px' }}></i>
                </div>
              </div>

              {/* ✅ 4. เปลี่ยนมาใช้ react-select (สวยเหมือนหน้า Contact Admin) */}
              <div style={{ minWidth: 220 }}>
                <Select
                  instanceId="sort-select"
                  defaultValue={sortOptions[0]}
                  options={sortOptions}
                  styles={customStyles}
                  onChange={(selectedOption) => setSortOrder(selectedOption.value)}
                  isSearchable={false}
                  placeholder="เรียงลำดับ..."
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <p className="text-muted fz14 mb-0">พบ {filteredListings.length} รายการที่เปิดรับ Co-Broker</p>
      </div>

      {/* --- Listings List View (เหมือนเดิม) --- */}
      <div className="row g-3">
        {paginatedListings.map((listing, index) => (
          <div className="col-12" key={listing.id}>
            <div
              className="d-md-flex align-items-center bg-white p-3 rounded-3"
              style={{
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
            >

              <div className="flex-shrink-0 position-relative" style={{ width: '160px', height: '120px' }}>
                <Image
                  fill
                  className="rounded-3"
                  style={{ objectFit: 'cover' }}
                  src={listing.imageSrc?.startsWith('/') ? listing.imageSrc : `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80`}
                  alt="listings"
                  onError={(e) => { e.currentTarget.srcset = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }}
                />
                <div className="position-absolute top-0 start-0 m-2 badge bg-dark opacity-75" style={{ fontSize: '10px' }}>
                  {listing.listingTypes?.includes('rent') ? "เช่า" : "ขาย"}
                </div>
              </div>

              <div className="flex-grow-1 ms-md-4 mt-2 mt-md-0 d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1 text-truncate" style={{ maxWidth: '400px' }}>
                      <Link href={`/single-v5/${listing.id}`} className="text-dark fw-bold text-decoration-none hover-primary">
                        {listing.title}
                      </Link>
                    </h6>
                    <p className="text-muted fz13 mb-2 text-truncate" style={{ maxWidth: '400px' }}>
                      <i className="flaticon-placeholder me-1"></i> {listing.location?.fullText}
                    </p>
                  </div>

                  <span className="text-muted fz12 d-none d-md-block bg-light px-2 py-1 rounded">
                    <i className="far fa-clock me-1"></i> {formatDate(listing.datePosted)}
                  </span>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-3 mt-1">
                  <div className="d-inline-flex align-items-center px-2 py-1 rounded"
                    style={{ backgroundColor: '#fff5f3', border: '1px solid #ffe0db', color: '#eb6753', fontSize: '12px', fontWeight: '600' }}>
                    <i className="fas fa-handshake me-1"></i>
                    ค่าคอม {Number(listing.commissionValue).toLocaleString()} {listing.commissionType === 'percent' ? '%' : '฿'}
                  </div>

                  <div className="d-none d-lg-flex align-items-center text-muted fz12 gap-3 border-start ps-3">
                    {listing.details?.bedrooms > 0 && <span><i className="fas fa-bed me-1"></i>{listing.details.bedrooms} นอน</span>}
                    {listing.details?.bathrooms > 0 && <span><i className="fas fa-bath me-1"></i>{listing.details.bathrooms} น้ำ</span>}
                    {listing.details?.usableArea > 0 && <span><i className="fas fa-ruler-combined me-1"></i>{listing.details.usableArea} ตร.ม.</span>}
                  </div>
                </div>
              </div>

              <div className="ms-md-4 mt-3 mt-md-0 text-md-end d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end" style={{ minWidth: '150px' }}>
                <div className="fw-bold mb-md-2 fz18" style={{ color: '#363636' }}>
                  {listing.priceText}
                </div>

                <div className="text-muted fz12 mb-2 d-md-none">
                  <i className="far fa-clock me-1"></i> {formatDate(listing.datePosted)}
                </div>

                <Link
                  href={`/dashboard-message?interest_property=${listing.id}&type=cobroke`}
                  className="btn btn-sm text-white fw-500 shadow-sm w-100 w-md-auto"
                  style={{
                    backgroundColor: '#eb6753',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px'
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
            <h5 className="mt-3 fw-bold text-muted">ไม่พบรายการทรัพย์ตามเงื่อนไข</h5>
            <button className="btn btn-link text-primary" onClick={() => { setStatusFilter('all'); setPropertyTypeFilter('all'); setSearch(''); }}>ล้างตัวกรองทั้งหมด</button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="row mt40">
          <div className="col-12 d-flex align-items-center justify-content-center gap-2">
            <button className="btn btn-white border shadow-sm rounded-3" style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPageSafe === 1}><i className="fas fa-chevron-left fz12"></i></button>
            <span className="fw-bold mx-2 text-dark fz14">หน้า {currentPageSafe} / {totalPages}</span>
            <button className="btn btn-white border shadow-sm rounded-3" style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPageSafe === totalPages}><i className="fas fa-chevron-right fz12"></i></button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoBrokeListings;