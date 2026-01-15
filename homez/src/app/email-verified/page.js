"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/property/dashboard/Footer";

const THEME_ORANGE = "#ff5a3c";

const EmailVerifiedPage = () => {
  return (
    // ✅ 1. ตั้ง Container เป็น Flex Column เพื่อจัดระเบียบ บน-กลาง-ล่าง
    <div 
        className="bgc-f7" 
        style={{ 
            minHeight: "100vh", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between" // ดันเนื้อหากับ Footer ให้ห่างกัน
        }}
    >
      
      {/* ✅ 2. ส่วนเนื้อหา (Card) ให้ flex-grow: 1 เพื่อขยายพื้นที่เต็มส่วนกลางและดัน Footer ลงล่าง */}
      <div 
        style={{ 
            flex: "1 0 auto",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "40px 20px" 
        }}
      >
        <div 
            className="ps-widget bg-white bdrs12 p50 position-relative border-0 shadow-sm text-center overflow-hidden" 
            style={{ 
                maxWidth: "480px", 
                width: "100%", 
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
            }}
        >


            {/* --- ส่วนไอคอน --- */}
            <div className="mb30 position-relative z-1">
                <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle" 
                    style={{ 
                        width: '100px', 
                        height: '100px', 
                        backgroundColor: 'rgba(255, 90, 60, 0.1)', 
                        color: THEME_ORANGE
                    }}
                >
                    <i className="fas fa-check fz40"></i>
                </div>
            </div>

            {/* --- ส่วนหัวข้อ --- */}
            <h3 className="title fz24 fw700 mb15 text-dark">
                ยืนยันอีเมลสำเร็จ!
            </h3>
            
            {/* --- ส่วนเนื้อหา --- */}
            <p className="text-muted fz15 mb30" style={{ lineHeight: '1.6' }}>
                บัญชีของคุณได้รับการยืนยันเรียบร้อยแล้ว <br className="d-none d-sm-block" />
                คุณสามารถเข้าใช้งานระบบได้ทันที
            </p>

            {/* --- ปุ่ม Action --- */}
            <div className="d-grid gap-3">
                <Link 
                    href="/dashboard-home" 
                    className="ud-btn btn-thm fw600" 
                    style={{ borderRadius: '30px', padding: '12px 0' }}
                >
                    ไปที่หน้าแดชบอร์ด <i className="fal fa-arrow-right-long ms-2"></i>
                </Link>

                <Link 
                    href="/" 
                    className="btn btn-link text-muted text-decoration-none fz14 fw500"
                >
                    กลับหน้าหลัก
                </Link>
            </div>

        </div>
      </div>

      {/* ✅ 3. Footer วางแบบปกติ (ไม่ต้อง absolute) มันจะอยู่ล่างสุดเสมอเพราะ Flex ด้านบนดันลงมา */}
      <div className="pb-2 w-100" style={{ flexShrink: 0, width: '100%'}}>
         <Footer />
      </div>

    </div>
  );
};

export default EmailVerifiedPage;   