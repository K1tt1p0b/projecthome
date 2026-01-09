"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import s from "./banner.module.css"; // เราจะใช้น้อยที่สุด

// 1. IMPORT ข้อมูล
import { propertyData } from "@/data/propertyData";
import { constructionServices } from "@/components/services/ConstructionRequest"; 
import { allCourses } from "@/components/services/CourseLanding"; 

const FALLBACK_IMG = "/images/listings/list-1.jpg";

export default function BannerDashboardContent() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("property"); 

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
      price: item.priceText || (item.price ? `฿${item.price.toLocaleString()}` : ""),
      location: item.location?.province || item.location?.address || item.location || "",
      
      createLink: tab === 'construction' ? `/add-listing?id=${item.id}&type=construction` 
                : tab === 'course' ? `/add-course?id=${item.id}&type=course` 
                : `/dashboard-banners/new?id=${item.id}&type=property` 
    }
  };

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
            <div className={s.h1}>เลือกรายการเพื่อลงโฆษณา</div>
            <div className={s.sub}>
              เลือกรายการสินทรัพย์ของคุณด้านล่าง เพื่อนำไปสร้างแบนเนอร์
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
                  onClick={() => setTab(t.id)}
                  style={{ transition: 'all 0.2s' }}
                >
                  {t.icon && <i className={`${t.icon} me-2`} />} 
                  {t.label}
                </button>
              ))}
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
      ) : items.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIc}>
            <i className="flaticon-folder" />
          </div>
          <div className={s.emptyTitle}>ไม่พบข้อมูลรายการของคุณ</div>
        </div>
      ) : (
        // ✅ ใช้ Grid ของ Bootstrap หรือ CSS Grid แบบกำหนดเองที่ไม่ใช่ s.grid เพื่อความชัวร์
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {items.map((rawItem) => {
            const item = getDisplayItem(rawItem);

            return (
              // ✅ CARD CONTAINER: ใช้ class มาตรฐาน ไม่ใช้ s.card เพื่อเลี่ยง Hover Effect ของธีม
              <div 
                key={item.id} 
                className="bg-white rounded-3 overflow-hidden border"
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // เงาบางๆ
                    transition: 'none' // ⛔ ห้ามมี Animation ตอน Hover ที่การ์ด
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
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* 2. ส่วนเนื้อหา */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                  
                  {/* หัวข้อ: ล็อกสีดำไว้ ไม่ให้เปลี่ยนเป็นส้ม */}
                  <div className="mb-2">
                    <h6 
                        className="fw-bold text-truncate" 
                        title={item.title} 
                        style={{ fontSize: '16px', color: '#111', margin: 0 }} // 🔒 ล็อกสี #111
                    >
                        {item.title}
                    </h6>
                  </div>

                  {/* ราคาและสถานที่ */}
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

                  {/* 3. ปุ่มกดลงโฆษณา (สีส้มเฉพาะตรงนี้) */}
                  <div className="mt-auto pt-3 border-top">
                        <Link 
                            href={item.createLink}
                            // ใช้ class ของ Bootstrap ปกติ
                            className="btn btn-sm w-100 rounded-pill fw-bold text-white" 
                            style={{ 
                                backgroundColor: '#eb6753', // สีส้มพื้นฐาน
                                border: 'none',
                                transition: '0.3s'
                            }}
                            // เพิ่มลูกเล่นให้ปุ่มเข้มขึ้นนิดหน่อยตอน Hover (เฉพาะปุ่ม)
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d14b36'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eb6753'}
                        >
                            ลงโฆษณา
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