"use client";

import React from "react";
import Link from "next/link";

const PointsPage = () => {
  const balance = 1250;

  return (
    <>
      {/* Header หน้า */}
      <div className="d-flex justify-content-between align-items-center mb40">
        <div>
          <h2 className="title mb5">Points & Credits</h2>
          <p className="text mb-0">
            ดูพอยต์คงเหลือ และจัดการการใช้งานของคุณ
          </p>
        </div>
      </div>

      {/* กล่องหลัก */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
        {/* พอยต์คงเหลือ */}
        <div className="mb30">
          <div className="d-inline-block px-3 py-2 bgc-f7 bdrs12">
            <span className="fw500">
              ⭐ พอยต์คงเหลือ:{" "}
              <span className="fw600">
                {balance.toLocaleString()} พอยต์
              </span>
            </span>
          </div>
        </div>

        {/* เงื่อนไขการใช้งาน */}
        <div className="mb40">
          <div className="bgc-f7 bdrs12 p20">
            <p className="fw500 mb10">เงื่อนไขการซื้อ และการใช้งาน</p>
            <ul className="ps-3 mb-0" style={{ listStyle: "disc" }}>
              <li>เครดิตไม่สามารถแลกคืนเป็นเงินสดได้</li>
              <li>เครดิตไม่สามารถโอนไปบัญชีผู้ใช้อื่นได้</li>
              <li>ใช้ได้เฉพาะบนเว็บไซต์นี้เท่านั้น</li>
              <li>เครดิตมีอายุการใช้งานตามที่ระบบกำหนด</li>
              <li>ไม่สามารถขอยกเลิกรายการซื้อเครดิตได้</li>
            </ul>
          </div>
        </div>

        {/* ซื้อพอยต์ */}
        <div className="mb20">
          <div className="bgc-f7 bdrs12 px-3 py-3 d-flex align-items-center justify-content-between">
            <div className="fw500">⭐ เติมพอยต์</div>
            <Link
              href="/dashboard-points/buy"
              className="ud-btn btn-light px-3 py-1"
            >
              ไปหน้าเติมพอยต์
            </Link>
          </div>
        </div>

        {/* โปรโมตประกาศ */}
        <div className="mb20">
          <div className="bgc-f7 bdrs12 px-3 py-3 d-flex align-items-center justify-content-between">
            <div className="fw500">⭐ โปรโมตประกาศ</div>
            <Link
              href="/dashboard-points/promote"
              className="ud-btn btn-light px-3 py-1"
            >
              ไปหน้าโปรโมต
            </Link>
          </div>
        </div>

        {/* ลิงก์ไปหน้าประวัติการใช้งานพอยต์ */}
        <div className="mt30">
          <Link
            href="/dashboard-my-package" // ถ้าเปลี่ยนชื่อ route เป็นอย่างอื่นก็แก้ตรงนี้
            className="fz14 text-thm"
          >
            ดูประวัติการใช้งานพอยต์ทั้งหมด →
          </Link>
        </div>
      </div>
    </>
  );
};

export default PointsPage;
