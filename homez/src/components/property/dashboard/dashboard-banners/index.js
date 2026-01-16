"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import s from "./banner.module.css";

// ... (IMPORT ข้อมูลเหมือนเดิม) ...
import { propertyData } from "@/data/propertyData";
import { constructionServices } from "@/components/services/ConstructionRequest";
import { allCourses } from "@/components/services/CourseLanding";

const FALLBACK_IMG = "/images/listings/list-1.jpg";

export default function BannerDashboardContent() {
  const router = useRouter();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    setLoading(true);
    let targetData = [];

    const addType = (data, typeName) => data.map(item => ({ ...item, type: typeName }));

    switch (tab) {
      case "all":
        targetData = [
          ...addType(propertyData, 'property'),
          ...addType(constructionServices, 'construction'),
          ...addType(allCourses, 'course')
        ];
        break;
      case "construction": targetData = addType(constructionServices, 'construction'); break;
      case "course": targetData = addType(allCourses, 'course'); break;
      case "property": default: targetData = addType(propertyData, 'property'); break;
    }

    const mapStatus = (thaiStatus) => {
      if (!thaiStatus) return 'active';
      if (thaiStatus === 'เผยแพร่แล้ว') return 'active';
      if (thaiStatus === 'ยังไม่เผยแพร่') return 'unactive';
      if (thaiStatus === 'กำลังดำเนินการ') return 'pending';
      if (thaiStatus === 'หมดอายุ') return 'expired';
      if (thaiStatus === 'ซ่อน') return 'hidden';
      if (thaiStatus === 'ไม่อนุมัติ') return 'rejected';
      return 'active';
    };

    const formattedData = targetData.map((item, index) => {
      const seed = item.id || (index + 1); 

      // Mock Status Logic
      let mockStatus = 'เผยแพร่แล้ว';
      if (seed % 10 === 0) mockStatus = 'ไม่อนุมัติ'; 
      else if (seed % 6 === 0) mockStatus = 'ยังไม่เผยแพร่';
      else if (seed % 5 === 0) mockStatus = 'กำลังดำเนินการ';
      else if (seed % 8 === 0) mockStatus = 'หมดอายุ';
      else if (seed % 7 === 0) mockStatus = 'ซ่อน';
      
      const finalRawStatus = item.status || mockStatus;
      const finalStatus = mapStatus(finalRawStatus);

      return {
        ...item,
        status: finalStatus,
        views: item.views || (seed * 123) % 1000, 
        rejectReason: finalStatus === 'rejected' 
          ? "รูปภาพไม่ชัดเจน กรุณาอัปโหลดใหม่ และตรวจสอบรายละเอียดสินค้าอีกครั้ง" 
          : null
      };
    });

    formattedData.sort((a, b) => {
        // กำหนดคะแนนความสำคัญ (เลขน้อยขึ้นก่อน)
        const priority = {
            'rejected': 1,  // ไม่อนุมัติ (สำคัญสุด)
            'active': 2,    // เผยแพร่แล้ว (สำคัญรองลงมา)
            'pending': 3,   // รอตรวจสอบ
            'unactive': 4,  // ยังไม่เผยแพร่
            'expired': 5,
            'hidden': 6
        };

        const pA = priority[a.status] || 99; // ถ้าไม่เจอให้ไปท้ายสุด
        const pB = priority[b.status] || 99;

        return pA - pB;
    });

    setItems(formattedData);
    setLoading(false);
  }, [tab]);

  const filteredItems = items.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  const getDisplayItem = (item) => {
    const currentType = item.type || tab;
    return {
      id: item.id,
      title: item.title,
      image: item.imageSrc || item.image || (item.gallery && item.gallery[0]) || FALLBACK_IMG,
      price: item.priceText || (item.price ? `฿${item.price.toLocaleString()}` : ""),
      location: item.location?.province || item.location?.address || item.location || "",
      status: item.status,
      views: item.views || 0,
      createLink: `/dashboard-banners/new?id=${item.id}&type=${currentType}`,
      editLink: `/dashboard-banners/edit?id=${item.id}&type=${currentType}`,
      rejectReason: item.rejectReason
    }
  };

  const categoryTabs = [
    { id: "all", label: "ทั้งหมด", icon: "flaticon-home" },
    { id: "property", label: "อสังหาฯ", icon: null },
    { id: "construction", label: "งานรับเหมา", icon: null },
    { id: "course", label: "คอร์สเรียน", icon: null },
  ];

  const statusOptions = [
    { id: "all", label: "ทั้งหมด" },
    { id: "active", label: "เผยแพร่แล้ว" },
    { id: "unactive", label: "ยังไม่เผยแพร่" },
    { id: "hidden", label: "ซ่อนรายการ" },
    { id: "expired", label: "หมดอายุ" },
    { id: "pending", label: "รอตรวจสอบ" },
    { id: "rejected", label: "ไม่อนุมัติ" },
  ];

  const renderRejectionIcon = (item) => {
    if (item.status !== 'rejected' || !item.rejectReason) return null;
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-reject-${item.id}`}>
            <div className="text-start p-2">
              <strong>สาเหตุที่ไม่อนุมัติ:</strong>
              <div className="mt-1 fw-normal">{item.rejectReason}</div>
            </div>
          </Tooltip>
        }
      >
        <i className="fas fa-info-circle text-danger ms-2" style={{ cursor: 'help', fontSize: '16px' }}></i>
      </OverlayTrigger>
    );
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 border-0">เผยแพร่แล้ว</span>;
      case 'unactive': return <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2 border-0">ยังไม่เผยแพร่</span>;
      case 'pending': return <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2 border-0"><i className="fas fa-clock me-1"></i> รอตรวจสอบ</span>;
      case 'hidden': return <span className="badge rounded-pill bg-dark-subtle text-dark px-3 py-2 border-0">ซ่อน</span>;
      case 'expired': return <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2 border-0">หมดอายุ</span>;
      case 'rejected': return <span className="badge rounded-pill bg-danger text-white px-3 py-2 border-0">ไม่อนุมัติ</span>;
      default: return null;
    }
  };

  return (
    <div className={s.wrap} style={{ overflow: 'visible' }}>
      <div className={s.top}>
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between w-100 gap-3">
          <div>
            <div className={s.h1}>จัดการรายการและโฆษณา</div>
            <div className={s.sub}>ตรวจสอบสถานะและจัดการรายการทรัพย์ของคุณ</div>
          </div>
          <div className="nav nav-pills p-1 rounded-pill d-inline-flex ms-lg-auto flex-shrink-0" style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
            {categoryTabs.map((t) => (
              <button key={t.id} type="button" className={`nav-link rounded-pill px-3 fz14 ${tab === t.id ? "active bg-dark text-white shadow-sm fw600" : "text-muted"}`} onClick={() => setTab(t.id)} style={{ transition: 'all 0.2s' }}>
                {t.icon && <i className={`${t.icon} me-2`} />} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between gap-3 mb-4 mt-4" style={{ overflow: 'hidden' }}>
        <div className="d-flex align-items-center gap-2 no-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: '2px', flexGrow: 1 }}>
          <style jsx>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>
          <span className="text-muted fz14 fw600 me-2 d-none d-md-block">สถานะ:</span>
          {statusOptions.map((opt) => (
            <button key={opt.id} type="button" onClick={() => setStatusFilter(opt.id)} className={`btn btn-sm rounded-pill px-3 fw600 border ${statusFilter === opt.id ? 'bg-dark text-white border-dark' : 'bg-white text-muted border-light'}`} style={{ flexShrink: 0, fontSize: '13px' }}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="d-flex align-items-center gap-3 flex-shrink-0 ps-2">
          <div className="btn-group shadow-sm border rounded bg-white" role="group">
            <button type="button" className="btn btn-sm d-flex align-items-center justify-content-center" onClick={() => setViewMode('list')} style={{ width: 36, height: 36, backgroundColor: viewMode === 'list' ? '#eb6753' : '#fff', color: viewMode === 'list' ? '#fff' : '#333', border: 'none', borderRadius: 0 }}><i className="fas fa-list-ul"></i></button>
            <button type="button" className="btn btn-sm d-flex align-items-center justify-content-center" onClick={() => setViewMode('grid')} style={{ width: 36, height: 36, backgroundColor: viewMode === 'grid' ? '#eb6753' : '#fff', color: viewMode === 'grid' ? '#fff' : '#333', borderLeft: '1px solid #eee', borderRadius: 0 }}><i className="fas fa-th-large"></i></button>
          </div>
        </div>
      </div>

      {viewMode === 'list' && !loading && filteredItems.length > 0 && (
        <div className="d-none d-md-flex row px-4 py-2 mb-2 text-muted fw600 fz14">
          <div className="col-5">รายการทรัพย์</div>
          <div className="col-2 text-center">ราคา</div>
          <div className="col-2 text-center">สถานะ</div>
          <div className="col-2 text-center">ยอดเข้าชม</div>
          <div className="col-1 text-end">จัดการ</div>
        </div>
      )}

      {loading ? (
        <div className={s.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`${s.card} ${s.skel}`}><div className={s.cover} style={{ height: 200 }} /></div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border border-dashed">
          <div className="mb-3 text-muted"><i className="flaticon-folder fz50" /></div>
          <h5 className="text-muted">ไม่พบข้อมูลในสถานะที่เลือก</h5>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'row g-4' : 'd-flex flex-column gap-3'}>
          {filteredItems.map((rawItem) => {
            const item = getDisplayItem(rawItem);
            
            // ✅ แก้ไขจุดที่ 1: เพิ่ม 'unactive' เข้าไปในรายการที่กดได้
            const isActionable = ['active', 'hidden', 'expired', 'unactive'].includes(item.status);

            if (viewMode === 'grid') {
              return (
                <div key={`${item.id}-${rawItem.type}`} className="col-md-6 col-lg-4 col-xl-4 mb-4">
                  <div className="bg-white rounded-3 overflow-hidden border h-100 d-flex flex-column shadow-sm">
                    <div className="position-relative" style={{ height: '240px', backgroundColor: '#e9ecef' }}>
                      <Image src={item.image} alt={item.title} fill className="object-fit-cover" unoptimized={true} />
                      <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 1 }}>
                        {renderStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="p-3 d-flex flex-column flex-grow-1">
                      
                      <div className="d-flex align-items-center mb-1">
                          <h6 className="fw-bold mb-0 text-dark text-truncate" title={item.title}>
                             {item.title}
                          </h6>
                          {renderRejectionIcon(item)}
                      </div>

                      <div className="text-success fw-bold mb-2">{item.price ? item.price : <span className="text-muted fz14 fw-normal">ติดต่อสอบถาม</span>}</div>
                      <div className="text-muted mb-3 d-flex align-items-center fz13"><i className="flaticon-location me-2" /> {item.location || '-'}</div>

                      <div className="mt-auto">
                        {isActionable ? (
                          <Link href={item.createLink} className="btn w-100 rounded-pill fw-bold text-white border-0 py-2" style={{ backgroundColor: '#eb6753' }}>
                            {/* ถ้าเป็น unactive ก็จะขึ้น "ลงโฆษณา" */}
                            {item.status === 'expired' ? 'ต่ออายุ' : 'ลงโฆษณา'}
                          </Link>
                        ) : (
                          <Link href={item.editLink} className="btn w-100 rounded-pill fw-bold btn-light border py-2 text-muted">
                            <i className="fas fa-pen me-2"></i> แก้ไขรายการ
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={`${item.id}-${rawItem.type}`} className="bg-white p-3 rounded-3 border shadow-sm">
                <div className="row align-items-center">
                  <div className="col-md-5 d-flex align-items-center gap-3">
                    <div className="flex-shrink-0 position-relative rounded overflow-hidden" style={{ width: '100px', height: '80px', backgroundColor: '#eee' }}>
                      <Image src={item.image} alt={item.title} fill className="object-fit-cover" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      
                      <div className="d-flex align-items-center mb-1">
                          <h6 className="fw-bold mb-0 text-dark text-truncate">
                              <Link href="#" className="text-dark text-decoration-none">{item.title}</Link>
                          </h6>
                          {renderRejectionIcon(item)}
                      </div>

                      <div className="text-muted fz13 text-truncate"><i className="flaticon-location me-1 text-thm" /> {item.location || '-'}</div>
                    </div>
                  </div>
                  <div className="col-md-2 d-flex flex-column justify-content-center align-items-md-center mt-3 mt-md-0">
                    <span className="d-md-none text-muted mb-1">ราคา:</span>
                    {item.price ? <><h6 className="text-thm fw-bold mb-0 fz16">{item.price}</h6><span className="text-muted fz12">(ราคาขาย)</span></> : <span className="text-muted">ติดต่อสอบถาม</span>}
                  </div>
                  <div className="col-md-2 text-md-center mt-2 mt-md-0">
                    <span className="d-md-none text-muted me-2">สถานะ:</span>
                    {renderStatusBadge(item.status)}
                  </div>
                  <div className="col-md-2 text-md-center mt-2 mt-md-0">
                    <span className="d-md-none text-muted me-2">เข้าชม:</span>
                    <span className="text-dark">{item.views}</span>
                  </div>
                  <div className="col-md-1 text-end mt-2 mt-md-0">
                    <div className="dropdown">
                      <button className="btn btn-sm btn-light border rounded-circle" type="button" data-bs-toggle="dropdown"><i className="fas fa-ellipsis-h text-muted"></i></button>
                      <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                        <li><Link className="dropdown-item" href={item.editLink}><i className="fas fa-pen me-2 text-muted"></i> แก้ไข</Link></li>
                        
                        {/* ✅ แก้ไขจุดที่ 2: Dropdown ก็ต้องขึ้นปุ่มลงโฆษณาด้วย */}
                        {isActionable && <li><Link className="dropdown-item" href={item.createLink}><i className="fas fa-bullhorn me-2 text-muted"></i> ลงโฆษณา</Link></li>}
                        
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger"><i className="fas fa-trash me-2"></i> ลบ</button></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}