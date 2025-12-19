"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// ข้อมูลแพ็กเกจจำลอง
const POINT_PACKAGES = [
  {
    id: 1,
    points: 150,
    price: "150",
    unit: "บาท",
    desc: "เหมาะสำหรับผู้เริ่มต้น",
    features: ["ลงประกาศได้ 1-2 รายการ", "ดันประกาศได้เล็กน้อย"],
  },
  {
    id: 2,
    points: 300,
    price: "250",
    unit: "บาท",
    best: true, // ตัวแนะนำ
    desc: "คุ้มค่าที่สุด ขายดี!",
    features: ["ลงประกาศได้ 3-5 รายการ", "ดันประกาศขึ้นหน้าแรกได้", "ติดป้าย Hot ได้ 1 รายการ"],
  },
  {
    id: 3,
    points: 500,
    price: "400",
    unit: "บาท",
    desc: "สำหรับเอเจ้นท์มืออาชีพ",
    features: ["พอยต์เยอะจุใจ", "ดันประกาศได้ทุกวัน", "ติดป้าย Premium ได้"],
  },
];

const BuyPointsPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [slipFile, setSlipFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // สำหรับแสดงรูปสลิป
  const fileInputRef = useRef(null);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setStep(2);
    // Scroll ไปบนสุดเวลาเปลี่ยน Step
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirm = () => {
    if (!selectedPackage) {
      toast.warn("กรุณาเลือกแพ็กเกจก่อนทำรายการครับ");
      return;
    }
    if (!slipFile) {
      toast.warn("กรุณาแนบสลิปโอนเงินก่อนยืนยันครับ");
      return;
    }

    // จำลองการส่งข้อมูล
    toast.success(
      `ส่งคำขอซื้อแพ็กเกจ ${selectedPackage.points} พอยต์ เรียบร้อยแล้ว! รอการตรวจสอบ`
    );

    // Reset ค่า
    handleCancel();
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedPackage(null);
    setSlipFile(null);
    setPreviewUrl(null);
  };

  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      // สร้าง URL สำหรับ Preview รูป
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden">
      {/* --- HEADER & STEPPER --- */}
      <div className="row mb30 align-items-center">
        <div className="col-lg-6">
          <h4 className="title fz20 mb5">เติมพอยต์ (Buy Points)</h4>
          <p className="text mb-0 fz14 text-muted">
            เพิ่มพอยต์เพื่อใช้ในการโปรโมทประกาศของคุณให้เข้าถึงลูกค้ามากขึ้น
          </p>
        </div>
        <div className="col-lg-6">
          {/* Stepper แบบง่าย */}
          <div className="d-flex justify-content-lg-end mt-3 mt-lg-0 gap-3">
            <div className={`d-flex align-items-center ${step === 1 ? 'text-thm fw600' : 'text-muted'}`}>
              <span className={`bdrs-circle d-flex align-items-center justify-content-center me-2 ${step === 1 ? 'bg-thm text-white' : 'bg-light'}`} style={{ width: 30, height: 30 }}>1</span>
              เลือกแพ็กเกจ
            </div>
            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-chevron-right fz12"></i>
            </div>
            <div className={`d-flex align-items-center ${step === 2 ? 'text-thm fw600' : 'text-muted'}`}>
              <span className={`bdrs-circle d-flex align-items-center justify-content-center me-2 ${step === 2 ? 'bg-thm text-white' : 'bg-light'}`} style={{ width: 30, height: 30 }}>2</span>
              ชำระเงิน
            </div>
          </div>
        </div>
      </div>

      <hr className="opacity-25 mb30" />

      {/* --- STEP 1: SELECT PACKAGE --- */}
      {step === 1 && (
        <div className="row justify-content-center">
          {POINT_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="col-md-6 col-lg-4 mb20">
              {/* ✅ แก้ไขจุดที่ผิด: ลบ ></div> ที่ปิดทันทีออก แล้วไปปิดท้ายสุด */}
              <motion.div
                className="pricing_table_item text-center p30 bdrs12 h-100 d-flex flex-column"
                // สั่งงานตรงนี้บรรทัดเดียวจบ
                whileHover={{ scale: 1.05, borderColor: "#eb6753", y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  border: pkg.best ? '2px solid #eb6753' : '1px solid #eee',
                  backgroundColor: pkg.best ? '#fff5f4' : '#fff',
                  position: 'relative',
                  overflow: 'visible',
                  marginTop: '20px'
                }}
              >
                {pkg.best && (
                  <div
                    className="position-absolute bg-black text-white fw600"
                    style={{
                      top: 0,                       // วางที่เส้นขอบบน
                      left: '50%',                  // จัดกึ่งกลางแนวนอน
                      transform: 'translate(-50%, -50%)', // ดึงกลับให้กลางเป๊ะ
                      padding: '6px 20px',          // เพิ่มพื้นที่รอบตัวหนังสือ
                      borderRadius: '30px',         // ทำมนๆ เหมือนแคปซูล
                      fontSize: '14px',
                      boxShadow: '0 4px 10px rgba(235, 103, 83, 0.4)', // ใส่เงาให้ดูลอยทับเส้น
                      whiteSpace: 'nowrap',         // ห้ามตัดบรรทัด
                      zIndex: 20                    // อยู่บนสุดแน่นอน ทับเส้นขอบชัวร์
                    }}
                  >
                    🔥 ขายดี (Best Seller)
                  </div>
                )}

                <div className="pricing_header mb20">
                  <h5 className="title">{pkg.points} Points</h5>
                  <div className="price fz30 fw600 text-thm mt10">฿{pkg.price}</div>
                  <p className="text-muted fz13">{pkg.desc}</p>
                </div>

                <div className="pricing_body mb30 flex-grow-1 text-start">
                  <ul className="list-style-none p-0">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-start">
                        <i className="fas fa-check-circle text-thm me-2 mt-1"></i>
                        <span className="fz14">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pricing_footer">
                  <button
                    className={`ud-btn w-100 ${pkg.best ? 'btn-thm' : 'btn-white border-thm text-thm'}`}
                    onClick={() => handleSelectPackage(pkg)}
                  >
                    เลือกแพ็กเกจนี้
                  </button>
                </div>
              </motion.div> {/* ✅ ปิด motion.div ตรงนี้ เพื่อห่อหุ้มเนื้อหาทั้งหมด */}
            </div>
          ))}
        </div>
      )}

      {/* --- STEP 2: PAYMENT & UPLOAD --- */}
      {step === 2 && selectedPackage && (
        <div className="row g-4 animate__animated animate__fadeIn">
          {/* ฝั่งซ้าย: ข้อมูลชำระเงิน */}
          <div className="col-lg-6">
            <div className="bgc-f7 p30 bdrs12 h-100">
              <h5 className="title mb20 d-flex align-items-center">
                <i className="fas fa-qrcode me-2 text-thm"></i>
                สแกน QR Code เพื่อชำระเงิน
              </h5>

              <div className="payment-summary bg-white p20 bdrs12 mb20 border-dashed">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">แพ็กเกจที่เลือก</span>
                  <span className="fw600">{selectedPackage.points} Points</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">ยอดชำระสุทธิ</span>
                  <span className="fz20 fw700 text-thm">฿{selectedPackage.price}</span>
                </div>
              </div>

              <div className="text-center bg-white p20 bdrs12 mb20">
                <div className="qr-container mx-auto mb15" style={{ width: 200, height: 200, position: 'relative' }}>
                  {/* รูป QR จริง หรือ Demo */}
                  <Image
                    src=""
                    alt="PromptPay QR"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p className="fz13 text-muted mb-0">
                  <i className="fas fa-info-circle me-1"></i>
                  ชื่อบัญชี: บจก. เรียลเอสเตท เอเจนซี่ <br />
                  ธนาคาร: กสิกรไทย (KBANK)
                </p>
              </div>

              <div className="alert alert-warning fz13 mb-0" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                กรุณาโอนเงินให้ตรงกับยอดที่ระบุ และแนบสลิปภายใน 15 นาที
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: อัปโหลดสลิป */}
          <div className="col-lg-6">
            <div className="bg-white border p30 bdrs12 h-100 d-flex flex-column">
              <h5 className="title mb20">
                <i className="fas fa-file-invoice-dollar me-2 text-thm"></i>
                ยืนยันการชำระเงิน
              </h5>

              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                {/* Area Upload สวยๆ */}
                <div
                  className="upload-area text-center p-4 mb-3 position-relative"
                  style={{
                    border: '2px dashed #eb6753',
                    borderRadius: '12px',
                    backgroundColor: '#fff5f4',
                    cursor: 'pointer',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="preview-box position-relative w-100 h-100">
                      <img
                        src={previewUrl}
                        alt="Slip Preview"
                        className="img-fluid bdrs6"
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                      />
                      <div className="mt-2 text-thm fz13 fw600">
                        <i className="fas fa-sync-alt me-1"></i> เปลี่ยนรูปภาพ
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="icon-wrapper mb15 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 60, height: 60 }}>
                        <i className="fas fa-cloud-upload-alt fz24 text-thm"></i>
                      </div>
                      <h6 className="fw600 mb-1">คลิกเพื่ออัปโหลดสลิป</h6>
                      <p className="fz13 text-muted mb-0">รองรับไฟล์ JPG, PNG (ไม่เกิน 5MB)</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    hidden
                    onChange={handleSlipChange}
                  />
                </div>
              </div>

              <div className="btns-group mt20">
                <button
                  type="button"
                  className="ud-btn btn-thm w-100 mb-2"
                  onClick={handleConfirm}
                >
                  ยืนยันการแจ้งโอนเงิน <i className="fal fa-arrow-right-long"></i>
                </button>
                <button
                  type="button"
                  className="ud-btn btn-white w-100 border-0 text-muted"
                  onClick={handleCancel}
                >
                  ย้อนกลับ / ยกเลิก
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Footer Link */}
      <div className="row mt30">
        <div className="col-12 text-center">
          <Link href="/dashboard-my-package" className="text-decoration-none text-muted fz14 hover-text-thm transition-style">
            <i className="fas fa-history me-1"></i> ดูประวัติการเติมพอยต์
          </Link>
        </div>
      </div>

    </div>
  );
};

export default BuyPointsPage;