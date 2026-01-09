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

// เนื้อหาภายใน BuyPackageContent
const BuyPackageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // --- 1. รับค่าจาก URL (ปรับปรุงใหม่) ---
  const itemName = searchParams.get('package') || "สินค้าทั่วไป"; // เปลี่ยนตัวแปรให้สื่อความหมายรวมๆ
  const cycle = searchParams.get('cycle') || "-";
  const price = searchParams.get('price') || "฿0";
  const type = searchParams.get('type') || "package"; // รับประเภท: 'package' หรือ 'banner'

  // ✅ ถ้ามี ref_id ส่งมา (จากหน้า Banner) ให้ใช้ตัวนั้น ถ้าไม่มีค่อยสุ่มใหม่ (สำหรับ Package)
  const incomingRefId = searchParams.get('ref_id');
  const orderId = incomingRefId || "INV-" + Math.floor(100000 + Math.random() * 900000);

  // State
  const [slipFile, setSlipFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... (handleSlipChange เหมือนเดิม) ...
  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ไฟล์มีขนาดใหญ่เกินไป (Max 5MB)");
        return;
      }
      setSlipFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // ... (handleConfirm ปรับปรุงใหม่) ...
  const handleConfirm = async () => {
    if (!slipFile) {
      toast.warn("กรุณาแนบสลิปโอนเงินก่อนยืนยันครับ");
      return;
    }

    setIsSubmitting(true);

    // --- ตรงนี้คือจุดที่ API จะทำงาน ---
    // คุณสามารถส่ง type ไปบอก Backend ได้ว่านี่คือการจ่ายค่าอะไร
    // const payload = { type, orderId, slipFile, amount: price }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(`แจ้งชำระเงินบิล ${orderId} เรียบร้อยแล้ว! รอการตรวจสอบ`);
    setIsSubmitting(false);

    // ✅ Logic การเปลี่ยนหน้า (Redirect)
    if (type === 'banner') {
      // ถ้าเป็นแบนเนอร์ ให้กลับไปหน้ารายการแบนเนอร์
      router.push('/dashboard-banners');
    } else {
      // ถ้าเป็นแพ็กเกจ ให้กลับไปหน้าแพ็กเกจของฉัน
      router.push('/dashboard-my-package');
    }
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
                รายการ: <span className="text-thm fw600">{itemName}</span>
                {cycle !== '-' && <span className="badge bg-light text-dark border ms-2">{cycle}</span>}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 text-lg-end">
          <div className="text-muted fz13">Ref Order: {orderId}</div>
        </div>
      </div>

      <hr className="opacity-25 mb30" />

      <div className="row g-4">

        {/* --- LEFT: QR CODE (ปรับให้มีรูปจริง) --- */}
        <div className="col-lg-6">
          <div className="bg-light p30 bdrs12 h-100 position-relative border">

            <h5 className="title mb20 d-flex align-items-center justify-content-center">
              ยอดชำระ: <span className="text-thm ms-2 fz28 fw700">{price}</span>
            </h5>

            {/* การ์ด QR Code สีขาว */}
            <div className="text-center bg-white p-4 bdrs12 mb20 shadow-sm border" style={{ maxWidth: '320px', margin: '0 auto' }}>

              {/* หัวพร้อมเพย์ */}
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" alt="PromptPay" height="30" style={{ objectFit: 'contain' }} />
                <span className="fw600 text-dark">สแกนจ่าย</span>
              </div>

              {/* ✅ รูป QR Code (ใช้ API สร้างรูปจำลองให้เห็นก่อน) */}
              <div className="qr-container mx-auto mb-3" style={{ width: 200, height: 200 }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${orderId}`}
                  alt="QR Code"
                  className="img-fluid border p-1 rounded"
                />
              </div>

              <p className="fz16 text-dark fw700 mb-1">บจก. โฮมส์ เอเจนซี่</p>
              <p className="text-muted fz13 mb-0">Ref: {orderId}</p>

              <hr className="my-3 opacity-50" />

              {/* เลขบัญชี */}
              <div className="d-flex justify-content-center align-items-center gap-2 text-muted fz14 bg-light py-2 rounded">
                <span className="fw600 text-dark">012-3-45678-9</span>
                <i
                  className="fas fa-copy cursor-pointer text-thm ms-1"
                  title="คัดลอก"
                  onClick={() => { navigator.clipboard.writeText("0123456789"); toast.info("คัดลอกเลขบัญชีแล้ว") }}
                ></i>
              </div>
            </div>

            <div className="text-center text-muted fz12">
              *กรุณาตรวจสอบยอดเงินและชื่อบัญชีก่อนโอน
            </div>
          </div>
        </div>

        {/* --- RIGHT: UPLOAD (ปรับกรอบให้ชัดขึ้น) --- */}
        <div className="col-lg-6">
          <div className="bg-white border p30 bdrs12 h-100 d-flex flex-column shadow-sm">

            <h5 className="title mb20">
              <i className="fas fa-receipt me-2 text-thm"></i> แนบสลิปโอนเงิน
            </h5>

            {/* พื้นที่ Upload */}
            <div className="flex-grow-1 d-flex flex-column">
              <div
                className="upload-area text-center p-4 mb-3 position-relative d-flex flex-column align-items-center justify-content-center h-100"
                style={{
                  border: '2px dashed #eb6753', // เส้นประสีส้มชัดๆ
                  borderRadius: '12px',
                  backgroundColor: '#fffcfb', // สีพื้นหลังจางๆ
                  cursor: 'pointer',
                  minHeight: '250px'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="preview-box position-relative">
                    <img
                      src={previewUrl}
                      alt="Slip Preview"
                      className="img-fluid bdrs6 shadow-sm"
                      style={{ maxHeight: '220px', objectFit: 'contain' }}
                    />
                    <div className="mt-2 text-thm fz13 fw600"><i className="fas fa-sync-alt me-1"></i> เปลี่ยนรูป</div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 bg-white p-3 rounded-circle shadow-sm border">
                      <i className="fas fa-cloud-upload-alt fz30 text-thm"></i>
                    </div>
                    <h6 className="fw600 mb-1">แตะเพื่ออัปโหลดสลิป</h6>
                    <p className="fz13 text-muted mb-0">หรือลากไฟล์มาวางที่นี่</p>
                  </>
                )}

                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleSlipChange} />
              </div>
            </div>

            <button
              type="button"
              className={`ud-btn w-100 mt-2 btn-thm`}
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? <><i className="fas fa-spinner fa-spin me-2"></i> กำลังตรวจสอบ...</> : 'แจ้งชำระเงิน'}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BuyPackagePage;