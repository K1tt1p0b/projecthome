"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

// Component หลัก
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

  // --- 1. รับค่าจาก URL ---
  const itemName = searchParams.get('package') || "สินค้าทั่วไป";
  const cycle = searchParams.get('cycle') || "-";
  const priceRaw = searchParams.get('price') || "0";
  const type = searchParams.get('type') || "package";
  
  const amount = priceRaw.replace(/[^0-9.]/g, ''); 
  const incomingRefId = searchParams.get('ref_id');
  const orderId = incomingRefId || "INV-" + Math.floor(100000 + Math.random() * 900000);

  // --- 2. State & Form ---
  const [form, setForm] = useState({
    name: "",  
    date: "",
    time: "",
    phone: "",
  });

  const [slipFile, setSlipFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // วันที่ปัจจุบันสำหรับ max date
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // ตั้งค่าเริ่มต้นเป็นวันนี้และเวลาปัจจุบัน
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().slice(0, 5);
    setForm((prev) => ({ ...prev, date: dateStr, time: timeStr }));
  }, []);

  // ฟังก์ชันแปลงวันที่เป็นไทย
  const formatThaiDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };

  // ฟังก์ชันตั้งค่าวันด่วน
  const setQuickDate = (type) => {
    const now = new Date();
    if (type === 'yesterday') {
        now.setDate(now.getDate() - 1);
    }
    const dateStr = now.toISOString().split("T")[0];
    // ถ้าเลือกวัน ให้คงเวลาเดิมไว้ หรือถ้าไม่มีให้ใช้ 12:00
    setForm(prev => ({ ...prev, date: dateStr }));
  };

  // ✅ ฟังก์ชันตั้งค่าเวลาปัจจุบัน
  const setCurrentTime = () => {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5); // HH:mm
    setForm(prev => ({ ...prev, time: timeStr }));
    toast.info("ตั้งเวลาเป็นปัจจุบันแล้ว");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleConfirm = async () => {
    if (!form.name.trim()) {
        toast.warn("กรุณากรอกชื่อผู้โอน");
        return;
    }
    if (!form.date || !form.time) {
        toast.warn("กรุณาระบุวันและเวลาที่โอน");
        return;
    }
    if (!slipFile) {
      toast.warn("กรุณาแนบสลิปโอนเงิน");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(`แจ้งชำระเงินเรียบร้อย! รอการตรวจสอบ`);
    setIsSubmitting(false);

    if (type === 'banner') {
      router.push('/dashboard-banners');
    } else {
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

        {/* --- LEFT: QR CODE --- */}
        <div className="col-lg-5">
          <div className="bg-light p30 bdrs12 h-100 position-relative border text-center">
            <h5 className="title mb20 d-flex align-items-center justify-content-center">
              ยอดชำระ: <span className="text-thm ms-2 fz28 fw700">฿{Number(amount).toLocaleString()}</span>
            </h5>

            <div className="text-center bg-white p-4 bdrs12 mb20 shadow-sm border mx-auto" style={{ maxWidth: '320px' }}>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" alt="PromptPay" height="30" style={{ objectFit: 'contain' }} />
                <span className="fw600 text-dark">สแกนจ่าย</span>
              </div>

              <div className="qr-container mx-auto mb-3" style={{ width: 200, height: 200 }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${orderId}-${amount}`}
                  alt="QR Code"
                  className="img-fluid border p-1 rounded"
                />
              </div>

              <p className="fz16 text-dark fw700 mb-1">บจก. โฮมส์ เอเจนซี่</p>
              <p className="text-muted fz13 mb-0">Ref: {orderId}</p>

              <hr className="my-3 opacity-50" />

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

        {/* --- RIGHT: FORM + UPLOAD --- */}
        <div className="col-lg-7">
          <div className="bg-white border p30 bdrs12 h-100 d-flex flex-column shadow-sm">

            <h5 className="title mb-3 border-bottom pb-2">
              <i className="fas fa-file-invoice-dollar me-2 text-thm"></i> แจ้งรายละเอียดการโอน
            </h5>

            {/* Form Inputs */}
            <div className="row g-3 mb-4">
                
                {/* 1. ชื่อผู้โอน */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">ชื่อผู้โอน (ตามสลิป) <span className="text-danger">*</span></label>
                    <input 
                        type="text" 
                        name="name"
                        className="form-control"
                        placeholder="ระบุชื่อ-นามสกุล"
                        value={form.name}
                        onChange={handleInputChange}
                    />
                </div>

                {/* 2. เบอร์ติดต่อ */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">เบอร์ติดต่อกลับ</label>
                    <input 
                        type="tel" 
                        name="phone"
                        className="form-control"
                        placeholder="08x-xxx-xxxx"
                        value={form.phone}
                        onChange={handleInputChange}
                    />
                </div>

                {/* 3. วันที่ */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">วันที่โอน <span className="text-danger">*</span></label>
                    
                    <div className="d-flex gap-2 mb-2">
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light border fz12 rounded-pill px-3 hover-bg-gray"
                            onClick={() => setQuickDate('today')}
                        >
                            วันนี้
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light border fz12 rounded-pill px-3 hover-bg-gray"
                            onClick={() => setQuickDate('yesterday')}
                        >
                            เมื่อวาน
                        </button>
                    </div>

                    <input 
                        type="date" 
                        name="date"
                        className="form-control cursor-pointer"
                        value={form.date}
                        onChange={handleInputChange}
                        max={today}
                    />
                    {form.date && (
                        <div className="text-thm fz13 mt-1 fw600">
                            <i className="far fa-calendar-check me-1"></i> {formatThaiDate(form.date)}
                        </div>
                    )}
                </div>

                {/* ✅ 4. เวลา (เพิ่มปุ่ม 'ตอนนี้') */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">เวลาที่โอน <span className="text-danger">*</span></label>
                    
                    <div className="d-flex gap-2 mb-2">
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light border fz12 rounded-pill px-3 hover-bg-gray"
                            onClick={setCurrentTime}
                        >
                            <i className="far fa-clock me-1"></i> ตอนนี้ (ล่าสุด)
                        </button>
                    </div>

                    <input 
                        type="time" 
                        name="time"
                        className="form-control cursor-pointer"
                        value={form.time}
                        onChange={handleInputChange}
                    />
                </div>

                {/* 5. ยอดเงิน */}
                <div className="col-12">
                    <label className="form-label fw600 fz14">จำนวนเงินที่โอน</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light fw-bold">฿</span>
                        <input 
                            type="text" 
                            className="form-control bg-light fw-bold text-dark"
                            value={Number(amount).toLocaleString()} 
                            readOnly 
                        />
                    </div>
                </div>
            </div>

            <h6 className="fw600 mb-2 fz14">หลักฐานการโอน (สลิป) <span className="text-danger">*</span></h6>

            <div className="flex-grow-1 d-flex flex-column">
              <div
                className="upload-area text-center p-3 mb-3 position-relative d-flex flex-column align-items-center justify-content-center h-100"
                style={{
                  border: '2px dashed #eb6753',
                  borderRadius: '12px',
                  backgroundColor: '#fffcfb',
                  cursor: 'pointer',
                  minHeight: '200px'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="preview-box position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                    <div className="text-success fw-bold mb-2"><i className="fas fa-check-circle me-1"></i> แนบสลิปแล้ว</div>
                    <img
                      src={previewUrl}
                      alt="Slip Preview"
                      className="img-fluid bdrs6 shadow-sm"
                      style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                    <div className="mt-2 text-thm fz13 fw600"><i className="fas fa-sync-alt me-1"></i> เปลี่ยนรูป</div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 bg-white p-3 rounded-circle shadow-sm border">
                      <i className="fas fa-cloud-upload-alt fz30 text-thm"></i>
                    </div>
                    <h6 className="fw600 mb-1">แตะเพื่ออัปโหลดสลิป</h6>
                    <p className="fz13 text-muted mb-0">รองรับไฟล์ JPG, PNG (Max 5MB)</p>
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
              {isSubmitting ? <><i className="fas fa-spinner fa-spin me-2"></i> กำลังส่งข้อมูล...</> : 'แจ้งชำระเงิน'}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BuyPackagePage;