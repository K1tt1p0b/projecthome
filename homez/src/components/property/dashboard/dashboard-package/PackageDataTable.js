"use client";

import React, { useState } from "react";
import Link from "next/link";
import pointHistoryData from "./pointHistory.json";

const PointHistoryTable = () => {
  const history = pointHistoryData.history || pointHistoryData;
  // ประกาศตัวแปรชื่อ pointsBalance
  const pointsBalance =
    pointHistoryData.pointsBalance ??
    (history.length > 0 ? history[0].balanceAfter : 0);

  const [isHover, setIsHover] = useState(false);

  return (
    <>
      {/* --- ส่วนการ์ดลอย --- */}
      <div
        className="row justify-content-center position-relative"
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
              justifyContent: "center",
              alignItems: "center" // เพิ่ม align-items center เพื่อให้ปุ่มกับตัวหนังสืออยู่กลางเป๊ะๆ
            }}
          >
            {/* ลายน้ำพื้นหลัง */}
            <div style={{ position: 'absolute', right: '30px', top: '140px', opacity: '0.15', transform: 'rotate(25deg)' }}>
              <i className="fas fa-coins" style={{ fontSize: '180px' }}></i>
            </div>

            {/* ส่วนบนของบัตร */}
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

            {/* ตัวเลขตรงกลาง */}
            {/* ผมรวมปุ่มไว้ใน div นี้ด้วยเลย เพื่อให้จัด layout ง่ายขึ้น */}
            <div className="text-center position-relative z-1 mt-4">
              <h1 className="fw-bold m-0 text-white" style={{ fontSize: "70px", textShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                {/* ✅ แก้ไขจุดที่ 1: เปลี่ยน balance เป็น pointsBalance ให้ถูกต้อง */}
                {pointsBalance.toLocaleString()}
              </h1>

              {/* ปุ่มกด */}
              <div className="mt-3">
                <Link
                  href="/dashboard-points"
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  className="fw600 px-5 py-3 d-inline-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: isHover ? '#c0392b' : '#e74c3c',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    fontSize: '18px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                    borderRadius: '15px',
                    minWidth: '280px'
                  }}
                >
                  <i className="fas fa-plus-circle me-3 fz20"></i> เติมพอยต์ทันที
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* ✅ แก้ไขจุดที่ 2: ลบ </div> ที่เกินมาตรงนี้ออกแล้ว */}


      {/* --- ส่วนที่ 2: กล่องขาว (Table Box) --- */}
      <div
        className="ps-widget bgc-white bdrs12 default-box-shadow2 mb30 overflow-hidden position-relative"
        style={{
          paddingTop: '160px',
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '30px',
          zIndex: 1
        }}
      >
        <h4 className="fw600 mb20">ประวัติธุรกรรม</h4>

        <div className="table-responsive">
          <table className="table-style3 table">
            <thead className="t-head">
              <tr>
                <th scope="col">วันที่</th>
                <th scope="col">รายการ</th>
                <th scope="col">รายละเอียด</th>
                <th scope="col">เปลี่ยนแปลง</th>
                <th scope="col">คงเหลือ</th>
                <th scope="col">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody className="t-body">
              {history.map((item, index) => (
                <tr key={index}>
                  <td className="vam">{item.date}</td>
                  <td className="vam fw500">{item.type}</td>
                  <td className="vam text-muted">{item.detail}</td>
                  <td
                    className="vam"
                    style={{
                      color: item.pointsChange > 0 ? "#16a34a" : "#dc2626",
                      fontWeight: 700,
                    }}
                  >
                    {item.pointsChange > 0 ? "+" : ""}
                    {item.pointsChange.toLocaleString()}
                  </td>
                  <td className="vam fw600">{item.balanceAfter.toLocaleString()}</td>
                  <td className="vam fz14 text-muted">{item.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PointHistoryTable;