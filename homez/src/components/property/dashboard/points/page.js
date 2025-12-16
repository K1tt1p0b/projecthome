"use client";

import React from "react";
import Link from "next/link";

const PointsPage = () => {
  const balance = 1250;

  return (
    <>
      {/* Header ข้อความ */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="title mb5">Points & Credits</h2>
          <p className="text mb-0">
            ดูพอยต์คงเหลือ และจัดการการใช้งานของคุณ
          </p>
        </div>
      </div>

      {/* --- ส่วนการ์ดลอย (แก้ตรงนี้) --- */}
      <div
        className="row justify-content-center position-relative"
        // 1. เพิ่ม mt-5 (margin-top) เพื่อดันลงมาไม่ให้ชน Header
        // 2. ลด zIndex เหลือ 2 (เพื่อให้ต่ำกว่า Navbar ปกติที่มักจะเป็น 1000+)
        style={{ zIndex: 2, marginBottom: '-100px', marginTop: '20px' }}
      >
        <div className="col-lg-7">
          <div
            className="p-4 text-white position-relative overflow-hidden default-box-shadow2"
            style={{
              background: "linear-gradient(135deg, #eb6753 0%, #ff9f43 100%)",
              boxShadow: "0 20px 40px -10px rgba(235, 103, 83, 0.4)",
              minHeight: "240px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            {/* ลายน้ำพื้นหลัง */}
            <div style={{ position: 'absolute', right: '30px', top: '140px', opacity: '0.15', transform: 'rotate(25deg)' }}>
              <i className="fas fa-coins" style={{ fontSize: '180px' }}></i>
            </div>

            {/* ส่วนบนของบัตร (ย้ายไปไว้ใน div แยก เพื่อไม่ให้โดนจัดกลางไปด้วย) */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px' }}>
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                    <i className="fas fa-crown text-warning fz20"></i>
                  </div>
                  <div>
                    <span className="d-block fz14 opacity-75 lh-1">My Balance</span>
                    <span className="fw600 fz16">พอยต์คงเหลือ</span>
                  </div>
                </div>
                <i className="fas fa-wifi opacity-50 fz20"></i>
              </div>
            </div>

            {/* ตัวเลขตรงกลาง (จะถูกจัดกลางโดยอัตโนมัติจาก settings ของ parent) */}
            <div className="text-center position-relative">
              <h1 className="fw-bold m-0 text-white" style={{ fontSize: "70px", textShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                {balance.toLocaleString()}
              </h1>
            </div>

          </div>
        </div>
      </div>

      {/* --- กล่องขาวด้านล่าง --- */}
      <div
        className="ps-widget bgc-white bdrs12 default-box-shadow2 mb30 overflow-hidden position-relative"
        style={{ padding: '200px 30px 30px 30px' }}
      >

        {/* แบบที่ 4: Mini Cards Style */}
        <div className="mb40">
          <p className="fw600 mb-3 fz18">เงื่อนไขการใช้งาน</p>
          <div className="row g-3">
            {/* Card 1 */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 bdrs12 border bg-white">
                <i className="fas fa-money-bill-wave text-secondary fz20 me-3 opacity-50"></i>
                <span className="fz14">ไม่สามารถแลกคืนเงินสดได้</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 bdrs12 border bg-white">
                <i className="fas fa-exchange-alt text-secondary fz20 me-3 opacity-50"></i>
                <span className="fz14">ไม่สามารถโอนให้ผู้อื่นได้</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 bdrs12 border bg-white">
                <i className="fas fa-desktop text-secondary fz20 me-3 opacity-50"></i>
                <span className="fz14">ใช้เฉพาะบนเว็บนี้เท่านั้น</span>
              </div>
            </div>
            {/* Card 4 */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 bdrs12 border bg-white">
                <i className="fas fa-ban text-danger fz20 me-3 opacity-50"></i>
                <span className="fz14">ไม่สามารถยกเลิกรายการได้</span>
              </div>
            </div>
          </div>
        </div>

        {/* ซื้อพอยต์ */}
        <div className="mb20">
          <div className="bgc-f7 bdrs12 px-3 py-3 d-flex align-items-center justify-content-between">
            <div className="fw500">⭐ เติมพอยต์</div>
            <Link href="/dashboard-points/buy" className="ud-btn btn-light px-3 py-1">
              ไปหน้าเติมพอยต์
            </Link>
          </div>
        </div>

        {/* โปรโมตประกาศ */}
        <div className="mb20">
          <div className="bgc-f7 bdrs12 px-3 py-3 d-flex align-items-center justify-content-between">
            <div className="fw500">⭐ โปรโมตประกาศ</div>
            <Link href="/dashboard-points/promote" className="ud-btn btn-light px-3 py-1">
              ไปหน้าโปรโมต
            </Link>
          </div>
        </div>

        {/* ลิงก์ไปหน้าประวัติ */}
        <div className="mt30">
          <Link href="/dashboard-my-package" className="fz14 text-thm">
            ดูประวัติการใช้งานพอยต์ทั้งหมด →
          </Link>
        </div>
      </div>
    </>
  );
};

export default PointsPage;