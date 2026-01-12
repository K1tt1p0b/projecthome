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

const FALLBACK_IMG = "/images/listings/list-1.jpg";

export default function BannerDashboardContent() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab 1: หมวดหมู่
  const [tab, setTab] = useState("property"); 
  
  // Tab 2: สถานะ
  const [statusFilter, setStatusFilter] = useState("all");

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

    // (จำลอง status)
    const mockDataWithStatus = targetData.map((item, index) => ({
        ...item,
        status: item.status || (index % 3 === 0 ? 'hidden' : index % 4 === 0 ? 'expired' : 'active') 
    }));

    setItems(mockDataWithStatus);
    setLoading(false);
  }, [tab]);

  const filteredItems = items.filter((item) => {
      if (statusFilter === "all") return true;
      return item.status === statusFilter;
  });

  const getDisplayItem = (item) => {
    return {
      id: item.id,
      title: item.title,
      image: item.imageSrc || item.image || (item.gallery && item.gallery[0]) || FALLBACK_IMG,
      price: item.priceText || (item.price ? `฿${item.price.toLocaleString()}` : ""),
      location: item.location?.province || item.location?.address || item.location || "",
      status: item.status,
      
      // ลิงก์สำหรับสร้าง/ต่ออายุ (ไปหน้าเดียวกันเพื่อซื้อแพ็กเกจใหม่)
      createLink: tab === 'construction' ? `/dashboard-banners/new?id=${item.id}&type=construction` 
                : tab === 'course' ? `/dashboard-banners/new?id=${item.id}&type=course` 
                : `/dashboard-banners/new?id=${item.id}&type=property` 
    }
  };

  const categoryTabs = [
      { id: "property", label: "อสังหาฯ", icon: "flaticon-home" },
      { id: "construction", label: "งานรับเหมา", icon: null },
      { id: "course", label: "คอร์สเรียน", icon: null },
  ];

  const statusTabs = [
      { id: "all", label: "ทั้งหมด" },
      { id: "active", label: "ใช้งานอยู่" },
      { id: "hidden", label: "ซ่อน" },
      { id: "expired", label: "หมดอายุ" },
  ];

  const getStatusBadge = (status) => {
      switch(status) {
          case 'active': return <span className="badge bg-success position-absolute top-0 end-0 m-3 shadow-sm">ใช้งานอยู่</span>;
          case 'hidden': return <span className="badge bg-secondary position-absolute top-0 end-0 m-3 shadow-sm">ซ่อน</span>;
          case 'expired': return <span className="badge bg-danger position-absolute top-0 end-0 m-3 shadow-sm">หมดอายุ</span>;
          default: return null;
      }
  }

  return (
    <div className={s.wrap}>
      {/* Top Header */}
      <div className={s.top}>
        <div className={s.brand}>
          <div>
            <div className={s.h1}>เลือกรายการเพื่อลงโฆษณา</div>
            <div className={s.sub}>
              เลือกรายการสินทรัพย์ของคุณด้านล่าง เพื่อนำไปสร้างแบนเนอร์
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="row mb-3 mt-4 bg-white p-3 rounded-3 shadow-sm mx-0">
        <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3"> 
            
            {/* ซ้าย: หมวดหมู่ */}
            <div className="nav nav-pills bg-light p-1 rounded-pill">
              {categoryTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`nav-link rounded-pill px-4 ${tab === t.id ? "active bg-white text-dark shadow-sm fw600" : "text-muted"}`}
                  onClick={() => setTab(t.id)}
                  style={{ transition: 'all 0.2s' }}
                >
                  {t.icon && <i className={`${t.icon} me-2`} />} 
                  {t.label}
                </button>
              ))}
            </div>

            {/* ขวา: สถานะ */}
            <ul className="nav nav-tabs border-bottom-0">
                {statusTabs.map((st) => (
                    <li className="nav-item" key={st.id}>
                        <button 
                            className={`nav-link border-0 bg-transparent fw600 ${statusFilter === st.id ? 'active text-dark border-bottom border-2 border-dark' : 'text-muted'}`}
                            onClick={() => setStatusFilter(st.id)}
                            style={{ borderRadius: 0 }}
                        >
                            {st.label}
                        </button>
                    </li>
                ))}
            </ul>

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
      ) : filteredItems.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIc}>
            <i className="flaticon-folder" />
          </div>
          <div className={s.emptyTitle}>ไม่พบข้อมูลในสถานะนี้</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredItems.map((rawItem) => {
            const item = getDisplayItem(rawItem);
            const isExpired = item.status === 'expired';

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3 overflow-hidden border position-relative"
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'none'
                }}
              >
                {/* 1. ส่วนรูปภาพ */}
                <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={400}
                    className="w-100 h-100"
                    unoptimized={true}
                    style={{ objectFit: 'cover', filter: isExpired ? 'grayscale(80%)' : 'none' }} // ถ้าหมดอายุ ปรับภาพเป็นขาวดำนิดๆ
                  />
                  {getStatusBadge(item.status)}
                </div>

                {/* 2. ส่วนเนื้อหา */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <div className="mb-2">
                    <h6 
                        className="fw-bold text-truncate" 
                        title={item.title} 
                        style={{ fontSize: '16px', color: '#111', margin: 0 }}
                    >
                        {item.title}
                    </h6>
                  </div>

                  <div className="mb-3">
                    {item.price ? (
                      <div className="text-success fw-bold" style={{ fontSize: '15px' }}>
                        {item.price}
                      </div>
                    ) : (
                      <div className="text-muted" style={{ fontSize: '14px' }}>บริการ</div>
                    )}

                    {item.location && (
                      <div className="text-muted mt-1" style={{ fontSize: '13px' }}>
                        <i className="flaticon-location me-1" /> {item.location}
                      </div>
                    )}
                  </div>

                  {/* ✅ 3. ปุ่มกด (Logic ใหม่) */}
                  <div className="mt-auto pt-3 border-top">
                        <Link 
                            href={item.createLink}
                            className={`btn btn-sm w-100 rounded-pill fw-bold text-white d-block text-center text-decoration-none`} 
                            style={{ 
                                backgroundColor: isExpired ? '#ffc107' : '#eb6753', 
                                color: isExpired ? '#000' : '#fff',
                                border: 'none',
                                transition: '0.3s',
                                padding: '8px 0',
                            }}
                            onMouseOver={(e) => {
                                if (isExpired) e.currentTarget.style.backgroundColor = '#e0a800';
                                else e.currentTarget.style.backgroundColor = '#d14b36';
                            }}
                            onMouseOut={(e) => {
                                if (isExpired) e.currentTarget.style.backgroundColor = '#ffc107';
                                else e.currentTarget.style.backgroundColor = '#eb6753';
                            }}
                        >
                            {isExpired ? (
                                <span><i className="fas fa-redo me-1"></i> ต่ออายุแบนเนอร์</span>
                            ) : (
                                'ลงโฆษณา'
                            )}
                        </Link>
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