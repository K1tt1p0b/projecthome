"use client";

import React, { useState } from "react";
import Link from "next/link"; // ✅ เพิ่มอันนี้

const POINT_PACKAGES = [
  { id: 1, points: 150, price: "150 บาท" },
  { id: 2, points: 300, price: "250 บาท", best: true },
  { id: 3, points: 500, price: "400 บาท" },
];

const BuyPointsPage = () => {
  const [step, setStep] = useState(1); // 1 = เลือกแพ็กเกจ, 2 = QR + แนบสลิป
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [slipFile, setSlipFile] = useState(null);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handleConfirm = () => {
    if (!selectedPackage || !slipFile) return;

    alert(
      `ส่งคำขอซื้อแพ็กเกจ ${selectedPackage.points} พอยต์ (${selectedPackage.price}) พร้อมสลิป ${slipFile.name} แล้ว`
    );

    setStep(1);
    setSelectedPackage(null);
    setSlipFile(null);
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedPackage(null);
    setSlipFile(null);
  };

  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    setSlipFile(file || null);
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
      {/* Header เล็ก */}
      <div className="mb30">
        <h4 className="title mb5">เติมพอยต์</h4>
        <p className="text mb-0">
          เลือกแพ็กเกจพอยต์ และอัปโหลดสลิปการชำระเงิน
        </p>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="row">
          {POINT_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="col-md-4 mb20">
              <div className="bdrs12 bgc-f7 p20 h-100 d-flex flex-column justify-content-between">
                <div>
                  <p className="fw500 mb5">{pkg.points} พอยต์</p>
                  <p className="fz20 fw600 mb10">{pkg.price}</p>
                  {pkg.best && (
                    <span className="badge bg-warning fz12">แนะนำ</span>
                  )}
                </div>

                <button
                  className="ud-btn btn-thm mt20 w-100"
                  onClick={() => handleSelectPackage(pkg)}
                >
                  เลือกแพ็กเกจนี้
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          {/* สรุปแพ็กเกจ */}
          <div className="bgc-f7 bdrs12 p15 mb20">
            <strong>แพ็กเกจที่เลือก:</strong>{" "}
            {selectedPackage
              ? `${selectedPackage.points} พอยต์ (${selectedPackage.price})`
              : "-"}
          </div>

          {/* QR */}
          <div className="bgc-f7 bdrs12 p20 mb20">
            <p className="fw500 mb10">ชำระเงินผ่าน PromptPay (สแกน QR)</p>
            <p className="mb10">
              จำนวนเงินที่ต้องชำระ:{" "}
              <strong>{selectedPackage?.price || "-"}</strong>
            </p>

            <div className="d-flex flex-wrap align-items-start gap-3">
              <div
                className="bdrs12 bgc-white p15 default-box-shadow2"
                style={{
                  width: 180,
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/images/payment/promptpay-qr-demo.png"
                  alt="PromptPay QR"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <ul className="mb-0">
                <li>เปิดแอปธนาคารของคุณ แล้วเลือกเมนูสแกน QR</li>
                <li>สแกน QR Code ด้านซ้าย และตรวจสอบยอดเงินให้ถูกต้อง</li>
                <li>หลังชำระเงินแล้ว ให้บันทึกสลิปเป็นไฟล์รูปภาพ</li>
              </ul>
            </div>
          </div>

          {/* แนบสลิป */}
          <div className="bgc-f7 bdrs12 p20 mb20">
            <p className="fw500 mb10">แนบสลิปการโอนเงิน</p>
            <p className="mb10 fz14">
              รองรับไฟล์รูปภาพ เช่น .jpg, .png ขนาดไฟล์ไม่เกิน 5MB
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleSlipChange}
              className="form-control"
            />
            {slipFile && (
              <p className="mt10 fz14">
                ไฟล์ที่เลือก: <strong>{slipFile.name}</strong>
              </p>
            )}
          </div>

          {/* ปุ่มยืนยัน / ยกเลิก */}
          <div className="d-flex justify-content-end gap-2 mt20">
            <button
              className="ud-btn btn-light"
              type="button"
              onClick={handleCancel}
            >
              ยกเลิก
            </button>
            <button
              className="ud-btn btn-thm"
              type="button"
              disabled={!slipFile}
              onClick={handleConfirm}
            >
              ยืนยันการซื้อ
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

export default BuyPointsPage;
