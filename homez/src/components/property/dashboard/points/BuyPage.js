"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // ใช้สำหรับรับค่าที่ส่งมาจากหน้าอื่น
import { toast } from "react-toastify";

// Component หลัก (หุ้มด้วย Suspense เพื่อกัน Error ใน Next.js App Router)
const BuyPackagePage = () => {
  return (
    <Suspense fallback={<div className="p-5 text-center">Loading...</div>}>
      <BuyPackageContent />
    </Suspense>
  );
};

// เนื้อหาภายใน
const BuyPackageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // 1. ดึงข้อมูลจาก URL (ถ้าไม่มี ให้ใช้ข้อมูล Default จำลอง)
  const packageTitle = searchParams.get('package') || "Pro Agent";
  const billingCycle = searchParams.get('cycle') === 'yearly' ? 'รายปี' : 'รายเดือน';
  const price = searchParams.get('price') || "฿99";
  const orderId = "INV-" + Math.floor(100000 + Math.random() * 900000); // สุ่มเลข Invoice

  // State
  const [slipFile, setSlipFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle File Upload
  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // เช็คขนาด 5MB
        toast.error("ไฟล์มีขนาดใหญ่เกินไป (Max 5MB)");
        return;
      }
      setSlipFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Handle Confirm Payment
  const handleConfirm = async () => {
    if (!slipFile) {
      toast.warn("กรุณาแนบสลิปโอนเงินก่อนยืนยันครับ");
      return;
    }

    setIsSubmitting(true);

    // --- จำลองการส่งข้อมูลไป Backend (ตรงนี้ใส่ API จริงได้เลย) ---
    await new Promise((resolve) => setTimeout(resolve, 1500)); // จำลอง Loading 1.5 วิ

    toast.success(`แจ้งชำระเงินบิล ${orderId} เรียบร้อยแล้ว! รอการตรวจสอบ`);
    setIsSubmitting(false);

    // ส่งกลับไปหน้า Dashboard หรือหน้าประวัติ
    router.push('/dashboard-my-package'); 
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="row mb30 align-items-center">
        <div className="col-lg-8">
           <div className="d-flex align-items-center">
              <button 
                onClick={() => router.back()} 
                className="btn btn-sm btn-light rounded-circle me-3 border" 
                title="ย้อนกลับ"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h4 className="title fz20 mb-1">ชำระเงิน (Payment)</h4>
                <p className="text-muted fz14 mb-0">
                    กำลังทำรายการสมัคร: <span className="text-thm fw600">{packageTitle}</span> <span className="badge bg-light text-dark border ms-2">{billingCycle}</span>
                </p>
              </div>
           </div>
        </div>
        <div className="col-lg-4 text-lg-end">
            <div className="text-muted fz13">Ref Order: {orderId}</div>
        </div>
      </div>

      <hr className="opacity-25 mb30" />

      {/* --- MAIN CONTENT (2 Columns) --- */}
      <div className="row g-4">
        
        {/* LEFT COLUMN: QR CODE */}
        <div className="col-lg-6">
          <div className="bgc-f7 p30 bdrs12 h-100 position-relative">
            
            <h5 className="title mb20 d-flex align-items-center">
              ยอดชำระ: <span className="text-thm ms-2 fz28 fw700">{price}</span>
            </h5>

            <div className="text-center bg-white p30 bdrs12 mb20 border shadow-sm">
              <div className="qr-container mx-auto mb15 position-relative bg-light d-flex align-items-center justify-content-center text-muted" style={{ width: 220, height: 220, border: '1px solid #eee' }}>
                 {/* ✅ ใส่รูป QR Code จริงที่นี่ */}
                 {/* <img src="/images/qr-code.png" alt="QR Code" className="img-fluid" /> */}
                 <i className="fas fa-qrcode fz80 text-dark opacity-25"></i>
              </div>
              
              <p className="fz16 text-dark fw700 mb-1">
                 บจก. โฮมส์ เอเจนซี่
              </p>
              <div className="d-flex justify-content-center align-items-center gap-2 text-muted fz14">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Kasikornbank_Logo.svg" alt="kbank" width="20" />
                 <span>012-3-45678-9</span>
                 <i 
                    className="fas fa-copy cursor-pointer hover-text-thm" 
                    title="คัดลอกเลขบัญชี"
                    onClick={() => { navigator.clipboard.writeText("0123456789"); toast.info("คัดลอกเลขบัญชีแล้ว") }}
                 ></i>
              </div>
            </div>
            
            <div className="text-center">
               <div className="d-inline-flex align-items-center bg-white px-3 py-1 rounded-pill border text-danger fz13">
                 <i className="fas fa-exclamation-circle me-2"></i> กรุณาโอนเงินให้ตรงยอด
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: UPLOAD SLIP */}
        <div className="col-lg-6">
          <div className="bg-white border p30 bdrs12 h-100 d-flex flex-column">
            
            <h5 className="title mb20">
              <i className="fas fa-receipt me-2 text-thm"></i>
              แนบสลิปโอนเงิน
            </h5>

            {/* Upload Area */}
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <div
                className="upload-area text-center p-4 mb-3 position-relative transition-style"
                style={{
                  border: '2px dashed #eb6753',
                  borderRadius: '12px',
                  backgroundColor: '#fff5f4', // สีชมพูอ่อน
                  cursor: 'pointer',
                  minHeight: '280px',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  // State: มีรูปแล้ว
                  <div className="preview-box position-relative w-100 h-100 animate__animated animate__fadeIn">
                    <img 
                        src={previewUrl} 
                        alt="Slip Preview" 
                        className="img-fluid bdrs6 shadow-sm" 
                        style={{ maxHeight: '250px', objectFit: 'contain' }} 
                    />
                    <div className="mt-3 text-thm fz14 fw600 bg-white d-inline-block px-3 py-1 rounded-pill border">
                        <i className="fas fa-sync-alt me-1"></i> เปลี่ยนรูปใหม่
                    </div>
                  </div>
                ) : (
                  // State: ยังไม่มีรูป
                  <>
                    <div className="icon-wrapper mb20 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 70, height: 70 }}>
                      <i className="fas fa-cloud-upload-alt fz30 text-thm"></i>
                    </div>
                    <h6 className="fw600 mb-1 fz16">แตะเพื่ออัปโหลดสลิป</h6>
                    <p className="fz13 text-muted mb-0">รองรับไฟล์ JPG, PNG (Max 5MB)</p>
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

            {/* ปุ่มกดส่ง */}
            <button 
                type="button" 
                className={`ud-btn w-100 mt-2 ${isSubmitting ? 'btn-dark' : 'btn-thm'}`}
                onClick={handleConfirm}
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                 <><i className="fas fa-spinner fa-spin me-2"></i> กำลังตรวจสอบ...</>
              ) : (
                 <>แจ้งชำระเงิน <i className="fal fa-check-circle ms-1"></i></>
              )}
            </button>

          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="row mt30">
        <div className="col-12 text-center">
           <p className="text-muted fz13 mb-2">ติดปัญหาการชำระเงิน? <a href="#" className="text-thm fw600">ติดต่อเจ้าหน้าที่</a></p>
           <div className="d-flex justify-content-center gap-3 fz13 text-muted">
              <Link href="/dashboard-my-package" className="hover-text-thm"><i className="fas fa-history me-1"></i> ประวัติการสั่งซื้อ</Link>
              <span>|</span>
              <Link href="/pricing" className="hover-text-thm">เลือกแพ็กเกจอื่น</Link>
           </div>
        </div>
      </div>

    </div>
  );
};

export default BuyPackagePage;