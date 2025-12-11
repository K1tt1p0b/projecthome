"use client";

import React from "react";
import Link from "next/link";

const PointsPage = () => {
  const balance = 1250;
  const recentHistory = [
    { title: "ซื้อ 150 Point", price: "150 บาท" },
    { title: "ซื้อ 250 Point", price: "250 บาท" },
    { title: "โปรโมตประกาศ 3 วัน", price: "250 บาท" },
  ];

  return (
    <>
      {/* ===== Header เหมือน My Package ===== */}
      <div className="d-flex justify-content-between align-items-center mb40">
        <div>
          <h2 className="title mb5">Points & Credits</h2>
          <p className="text mb-0">ดูพอยต์คงเหลือ และใช้งานแพ็กเกจของคุณ</p>
        </div>
      </div>

      {/* ===== การ์ดหลัก (เหมือน My Package) ===== */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">

        {/* พอยต์คงเหลือ */}
        <div className="mb30">
          <div className="d-inline-block px-3 py-2 bgc-f7 bdrs12">
            <span className="fw500">
              ⭐ พอยต์คงเหลือ:{" "}
              <span className="fw600">{balance.toLocaleString()} พอยต์</span>
            </span>
          </div>
        </div>

        {/* เงื่อนไข */}
        <div className="mb40">
          <div className="bgc-f7 bdrs12 p20">
            <p className="fw500 mb10">เงื่อนไขการซื้อ และการใช้งาน</p>
            <ul className="ps-3 mb-0" style={{ listStyle: "disc" }}>
              <li>เครดิตไม่สามารถแลกคืนเป็นเงินสดได้</li>
              <li>เครดิตไม่สามารถโอนไปบัญชีผู้ใช้อื่นได้</li>
              <li>ใช้ได้เฉพาะบนเว็บไซต์นี้เท่านั้น</li>
              <li>เครดิตมีอายุการใช้งาน 1 ปี</li>
              <li>ไม่สามารถขอยกเลิกรายการซื้อเครดิตได้</li>
            </ul>
          </div>
        </div>

        {/* ซื้อพอยต์ */}
        <div className="mb20">
          <div className="bgc-f7 bdrs12 px-3 py-3 d-flex justify-content-between align-items-center">
            <span className="fw500">⭐ ซื้อพอยต์</span>
            <Link href="/dashboard-points/buy" className="ud-btn btn-light px-3 py-1">
              ซื้อ
            </Link>
          </div>
        </div>

        {/* โปรโมตประกาศ */}
        <div className="mb30">
          <div className="bgc-f7 bdrs12 px-3 py-3 d-flex justify-content-between align-items-center">
            <span className="fw500">⭐ โปรโมตประกาศ</span>
            <Link href="/dashboard-points/promote" className="ud-btn btn-light px-3 py-1">
              โปรโมต
            </Link>
          </div>
        </div>

        {/* รายการล่าสุด */}
        <div className="mb10">
          <div className="d-inline-block px-3 py-2 bgc-f7 bdrs12 fw500">
            รายการล่าสุด
          </div>
        </div>

        <div className="bgc-f7 bdrs12 p20">
          {recentHistory.map((item, idx) => (
            <div
              key={idx}
              className="d-flex justify-content-between mb10"
            >
              <span>⭐ {item.title}</span>
              <span>{item.price}</span>
            </div>
          ))}
        </div>

      </div>
      {/* END ps-widget */}
    </>
  );
};

export default PointsPage;
