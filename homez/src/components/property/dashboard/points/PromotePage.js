"use client";

import React, { useState } from "react";
import Link from "next/link"; // ✅ เพิ่ม import นี้

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
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
      {/* Header + พอยต์คงเหลือ */}
      <div className="mb20 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="title mb5">โปรโมตประกาศ (ใช้พอยต์)</h4>
          <p className="text mb-0">
            เลือกแพ็กเกจโปรโมต และเลือกประกาศที่ต้องการโปรโมต
          </p>
        </div>
        <div className="d-inline-block px-3 py-2 bgc-f7 bdrs12">
          พอยต์คงเหลือ:{" "}
          <strong>{currentPoints.toLocaleString()} พอยต์</strong>
        </div>
      </div>

      {/* STEP 1 */}
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

      {/* STEP 2 */}
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

      {/* ✅ ปุ่มย้อนกลับไปหน้า /dashboard-points */}
      <div className="mt20">
        <Link href="/dashboard-points" className="fz14 text-thm">
          ← กลับไปหน้าจัดการพอยต์
        </Link>
      </div>
    </div>
  );
};

export default PromotePage;
