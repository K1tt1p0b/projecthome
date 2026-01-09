"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import s from "./banner.module.css";

// 1. IMPORT ข้อมูล
import { propertyData } from "@/data/propertyData";
import { constructionServices } from "@/components/services/ConstructionRequest"; 
import { allCourses } from "@/components/services/CourseLanding"; 

const statusBadgeClass = (status) =>
  status === "active" || status === "ใช้งานอยู่" || status === "ใช้งานอยู่" 
    ? "pending-style style2" // สีเขียว (ใช้งานอยู่)
    : "pending-style style1"; // สีแดง/เทา (ซ่อน/อื่นๆ)

// ✅ แก้ไข 1: เปลี่ยนคำแสดงผลตามที่ขอ (ใช้งานอยู่, ซ่อน)
const statusText = (status) => {
    if (status === "active" || status === "ใช้งานอยู่" || status === "ใช้งานอยู่") return "ใช้งานอยู่";
    if (status === "paused" || status === "ซ่อน") return "ซ่อน";
    return status || "ใช้งานอยู่";
};

const FALLBACK_IMG = "/images/listings/list-1.jpg";

const checkIsExpired = (endAt) => {
  if (!endAt) return false;
  const end = new Date(endAt);
  const now = new Date();
  return end < now;
};

export default function BannerDashboardContent() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [tab, setTab] = useState("property"); 
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    setLoading(true);
    let targetData = [];

    switch (tab) {
      case "construction":
        targetData = constructionServices || [];
        break;
      case "course":
        targetData = allCourses || [];
        break;
      case "property":
      default:
        targetData = propertyData || [];
        break;
    }

    setItems(targetData);
    setLoading(false);
  }, [tab]);

  const getDisplayItem = (item) => {
    return {
      id: item.id,
      title: item.title,
      image: item.imageSrc || item.image || (item.gallery && item.gallery[0]) || FALLBACK_IMG,
      status: item.status || "active",
      price: item.priceText || (item.price ? `฿${item.price.toLocaleString()}` : ""),
      location: item.location?.province || item.location?.address || item.location || "",
      views: item.views || 0,
      endAt: item.endAt,
      // ลิงก์คงเดิมตามที่คุณต้องการ
      editLink: tab === 'construction' ? `/add-listing?id=${item.id}` 
              : tab === 'course' ? `/add-course?id=${item.id}` 
              : `/dashboard-banners/new?id=${item.id}`
    }
  };

  const list = useMemo(() => {
    return items.filter((rawItem) => {
      const item = getDisplayItem(rawItem);
      const isExpired = checkIsExpired(item.endAt);
      
      let matchStatus = true;
      // Logic กรองตามคำใหม่
      if (filterStatus === "active") matchStatus = (item.status === "active" || item.status === "ใช้งานอยู่" || item.status === "ใช้งานอยู่") && !isExpired;
      if (filterStatus === "paused") matchStatus = (item.status === "paused" || item.status === "ซ่อน");
      if (filterStatus === "expired") matchStatus = isExpired;

      return matchStatus;
    });
  }, [items, filterStatus, tab]); 

  const handleRenew = (e, id) => {
      e.stopPropagation(); 
      e.preventDefault();
      alert(`ต่ออายุรายการ ID: ${id} เรียบร้อย!`);
  };

  // ✅ แก้ไข 2: เปลี่ยนชื่อแท็บเป็น "ใช้งานอยู่", "ซ่อน", "หมดอายุ"
  const statusTabs = [
      { id: "all", label: "ทั้งหมด" },
      { id: "active", label: "ใช้งานอยู่" },
      { id: "paused", label: "ซ่อน" }, 
      { id: "expired", label: "หมดอายุ" },
  ];

  const categoryTabs = [
      { id: "property", label: "อสังหาฯ", icon: "flaticon-home" },
      { id: "construction", label: "งานรับเหมา", icon: null },
      { id: "course", label: "คอร์สเรียน", icon: null },
  ];

  return (
    <div className={s.wrap}>
      {/* Top Header */}
      <div className={s.top}>
        <div className={s.brand}>
          <div>
            <div className={s.h1}>ทรัพย์สินของฉัน</div>
            <div className={s.sub}>
              จัดการรายการและประกาศของคุณทั้งหมด
            </div>
          </div>
        </div>
      </div>

      {/* แถวเลือกหมวดหมู่ */}
      <div className="row mb-4 mt-4 bg-white p-3 rounded-3 shadow-sm mx-0">
        <div className="col-12 d-flex justify-content-start"> 
            <div className="nav nav-pills bg-light p-1 rounded-pill">
              {categoryTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`nav-link rounded-pill px-4 ${tab === t.id ? "active bg-white text-dark shadow-sm fw600" : "text-muted"}`}
                  onClick={() => { setTab(t.id); setFilterStatus("all"); }}
                  style={{ transition: 'all 0.2s' }}
                >
                  {t.icon && <i className={`${t.icon} me-2`} />} 
                  {t.label}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Filters: ตัวกรองสถานะ */}
      <div className={s.filters}>
        <div className="d-flex align-items-center justify-content-between w-100">
           
           <div className="d-flex align-items-center gap-2">
               <span className="fw600 me-2 text-dark">สถานะ:</span>
               <div className="d-flex gap-2"> 
                  {statusTabs.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${filterStatus === st.id ? "btn-dark text-white" : "btn-light text-muted bg-white border"}`}
                        onClick={() => setFilterStatus(st.id)}
                        style={{ fontSize: '14px', transition: 'all 0.2s' }}
                      >
                        {st.label}
                      </button>
                  ))}
               </div>
           </div>
           
           <div className="text-muted fz14">
              แสดงผล <b>{list.length}</b> รายการ
           </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className={s.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`${s.card} ${s.skel}`}>
              <div className={s.cover} style={{ height: 200 }} />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIc}>
            <i className="flaticon-folder" />
          </div>
          <div className={s.emptyTitle}>ไม่พบข้อมูลตามสถานะที่เลือก</div>
        </div>
      ) : (
        <div className={s.grid}>
          {list.map((rawItem) => {
            const item = getDisplayItem(rawItem);
            const isExpired = checkIsExpired(item.endAt);

            return (
              <Link 
                href={item.editLink} 
                key={item.id} 
                className={s.card}
                style={{ 
                    height: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit'
                }}
              >
                <div
                  className={s.coverWrap}
                  style={{
                      height: '220px',
                      minHeight: '220px',
                      position: 'relative',
                      ...(isExpired ? { filter: 'grayscale(100%)', opacity: 0.8 } : {})
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1200}
                    height={600}
                    className={s.coverImg}
                    unoptimized={true}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <div className={s.ov} />

                  {isExpired && (
                    <div className="position-absolute top-50 start-50 translate-middle badge bg-danger" style={{ zIndex: 9 }}>
                      หมดอายุ
                    </div>
                  )}

                  <div className={s.badges} style={{ zIndex: 5 }}>
                    {!isExpired && (
                      <span className={statusBadgeClass(item.status)}>{statusText(item.status)}</span>
                    )}
                  </div>
                </div>

                <div 
                    className={s.body} 
                    style={{ 
                        marginTop: '0px', 
                        paddingTop: '15px',
                        paddingBottom: '15px',
                        flexGrow: 1, 
                        backgroundColor: '#fff',
                        position: 'relative',
                        zIndex: 10
                    }}
                >
                  <div className={s.titleRow}>
                    <div className={s.title} title={item.title} style={{ color: isExpired ? '#999' : 'inherit' }}>
                      {item.title}
                    </div>
                  </div>

                  <div className={s.meta}>
                    {item.price ? (
                      <div className={isExpired ? "text-danger" : "text-success fw600"}>
                        {item.price}
                      </div>
                    ) : (
                      <div className="text-muted fz14">บริการ</div>
                    )}

                    {item.location && (
                      <div>
                        <i className="flaticon-location" /> {item.location}
                      </div>
                    )}
                  </div>

                  <div className={s.stats}>
                    <div>
                      <div className={s.k}>Views</div>
                      <div className={s.v}>{item.views}</div>
                    </div>
                    
                    <div className="ms-auto d-flex align-items-center gap-2">
                        {isExpired && (
                            <button 
                                className="btn btn-sm btn-dark text-white rounded-pill px-3" 
                                onClick={(e) => handleRenew(e, item.id)}
                                style={{fontSize: '12px'}}
                            >
                                <i className="fas fa-sync-alt me-1"></i> ต่ออายุ
                            </button>
                        )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}