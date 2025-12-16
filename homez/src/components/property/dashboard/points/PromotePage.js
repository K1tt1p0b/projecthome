"use client";

import React, { useState } from "react";
import Link from "next/link";

const PROMOTE_PACKAGES = [
  { id: 1, days: 3, label: "โปรโมต 3 วัน", pointsCost: 150 },
  { id: 2, days: 7, label: "โปรโมต 7 วัน", pointsCost: 300, best: true },
  { id: 3, days: 30, label: "โปรโมต 30 วัน", pointsCost: 600 },
];

const MOCK_LISTINGS = [
  { id: 101, title: "ที่ดินเปล่า คลอง 4 ธัญบุรี", location: "ปทุมธานี", status: "เผยแพร่" },
  { id: 102, title: "บ้านเดี่ยว 2 ชั้น ลำลูกกา คลอง 2", location: "ปทุมธานี", status: "รออนุมัติ" },
  { id: 103, title: "คอนโดใจกลางเมือง รังสิต", location: "ปทุมธานี", status: "เผยแพร่" },
];

const INITIAL_POINTS = 1250;

const PromotePage = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(INITIAL_POINTS);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handleSelectListing = (id) => {
    setSelectedListingId(id);
  };

  const handleConfirm = () => {
    if (!selectedPackage || !selectedListingId) return;

    if (currentPoints < selectedPackage.pointsCost) {
      alert(
        `พอยต์ไม่เพียงพอ\nต้องใช้ ${selectedPackage.pointsCost.toLocaleString()} พอยต์ แต่คุณมี ${currentPoints.toLocaleString()} พอยต์`
      );
      return;
    }

    const newBalance = currentPoints - selectedPackage.pointsCost;
    setCurrentPoints(newBalance);

    alert(
      `โปรโมตประกาศ ID: ${selectedListingId} ด้วยแพ็กเกจ "${selectedPackage.label}"\nหักพอยต์ ${selectedPackage.pointsCost.toLocaleString()} พอยต์\nพอยต์คงเหลือ: ${newBalance.toLocaleString()} พอยต์`
    );

    setStep(1);
    setSelectedPackage(null);
    setSelectedListingId(null);
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedPackage(null);
    setSelectedListingId(null);
  };

  return (
    <>
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

            {/* ตัวเลขพอยต์ตรงกลาง */}
            <div className="text-center position-relative">
              <h1 className="fw-bold m-0 text-white" style={{ fontSize: "70px", textShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                {currentPoints.toLocaleString()} {/* ใช้ตัวแปร currentPoints ของหน้านี้ */}
              </h1>
            </div>

          </div>
        </div>
      </div>

      {/* 3. กล่องขาวด้านล่าง (ส่วนเนื้อหา) */}
      <div 
        className="ps-widget bgc-white bdrs12 default-box-shadow2 mb30 overflow-hidden position-relative"
        // สำคัญ: ต้องใส่ padding-top เยอะๆ (200px) เพื่อให้เนื้อหาไม่โดนการ์ดบัง
        style={{ padding: '200px 30px 30px 30px' }}
      >
        
        {/* STEP 1: เลือกแพ็กเกจ */}
        {step === 1 && (
          <div className="row">
            {PROMOTE_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="col-md-4 mb20">
                <div className="bdrs12 bgc-f7 p20 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <p className="fw500 mb5">{pkg.label}</p>
                    <p className="fz16 mb5">
                      ใช้พอยต์:{" "}
                      <strong>{pkg.pointsCost.toLocaleString()} พอยต์</strong>
                    </p>
                    {pkg.best && (
                      <span className="badge bg-warning fz12">แนะนำ</span>
                    )}
                  </div>
                  <div className="mt20">
                    <button
                      type="button"
                      className="ud-btn btn-thm w-100"
                      onClick={() => handleSelectPackage(pkg)}
                    >
                      ใช้แพ็กเกจนี้
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: เลือกประกาศและยืนยัน */}
        {step === 2 && (
          <>
            <div className="bgc-f7 bdrs12 p15 mb20">
              <strong>แพ็กเกจที่เลือก:</strong>{" "}
              {selectedPackage
                ? `${selectedPackage.label} (ใช้ ${selectedPackage.pointsCost.toLocaleString()} พอยต์)`
                : "-"}
            </div>

            <div className="mb15">
              <p className="fw500 mb10">เลือกประกาศที่ต้องการโปรโมต</p>
            </div>

            <div className="table-responsive">
              <table className="table-style3 table">
                <thead className="t-head">
                  <tr>
                    <th scope="col">เลือก</th>
                    <th scope="col">ชื่อประกาศ</th>
                    <th scope="col">ทำเล</th>
                    <th scope="col">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="t-body">
                  {MOCK_LISTINGS.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <input
                          type="radio"
                          name="selectedListing"
                          checked={selectedListingId === listing.id}
                          onChange={() => handleSelectListing(listing.id)}
                        />
                      </td>
                      <th scope="row">{listing.title}</th>
                      <td>{listing.location}</td>
                      <td>{listing.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end gap-2 mt20">
              <button
                type="button"
                className="ud-btn btn-light"
                onClick={handleCancel}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="ud-btn btn-thm"
                disabled={!selectedListingId}
                onClick={handleConfirm}
              >
                ยืนยันโปรโมต (หักพอยต์)
              </button>
            </div>
          </>
        )}

        {/* ปุ่มย้อนกลับ */}
        <div className="mt20">
          <Link href="/dashboard-points" className="fz14 text-thm">
            ← กลับไปหน้าจัดการพอยต์
          </Link>
        </div>

      </div>
    </>
  );
};

export default PromotePage;