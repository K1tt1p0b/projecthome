"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

const BuyPackagePage = () => {
  return (
    <Suspense fallback={<div className="p-5 text-center">Loading...</div>}>
      <BuyPackageContent />
    </Suspense>
  );
};

// --- Component ย่อย: Custom Dropdown เลือกเวลา ---
const CustomTimeDropdown = ({ options, value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    if (isOpen) {
        const selectedEl = document.getElementById(`option-${name}-${value}`);
        if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'center' });
        }
    }
  }, [isOpen, value, name]);

  return (
    <div className="position-relative" ref={wrapperRef} style={{ width: '80px' }}>
      <div 
        className="form-control text-center fw-bold border-2 cursor-pointer d-flex align-items-center justify-content-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
            height: '50px', 
            fontSize: '18px',
            borderRadius: '10px',
            backgroundColor: '#f8f9fa',
            userSelect: 'none',
            border: isOpen ? '2px solid #eb6753' : '1px solid #dee2e6'
        }}
      >
        {value} 
        <i className={`fas fa-chevron-down ms-2 fz10 text-muted`} style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: '0.2s'
        }}></i>
      </div>

      {isOpen && (
        <div 
            className="position-absolute start-0 w-100 bg-white border rounded shadow-sm custom-scrollbar" 
            style={{ 
                top: '110%', 
                zIndex: 1000, 
                maxHeight: '200px', 
                overflowY: 'auto' 
            }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              id={`option-${name}-${opt}`}
              className={`py-2 text-center cursor-pointer`}
              onClick={() => {
                onChange({ target: { name, value: opt } });
                setIsOpen(false);
              }}
              style={{ 
                  backgroundColor: value === opt ? '#fff0ec' : 'transparent',
                  color: value === opt ? '#eb6753' : '#333',
                  fontWeight: value === opt ? 'bold' : 'normal',
              }}
              onMouseEnter={(e) => { if(value !== opt) e.target.style.backgroundColor = '#f8f9fa' }}
              onMouseLeave={(e) => { if(value !== opt) e.target.style.backgroundColor = 'transparent' }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BuyPackageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const itemName = searchParams.get('package') || "สินค้าทั่วไป";
  const cycle = searchParams.get('cycle') || "-";
  const priceRaw = searchParams.get('price') || "0";
  const type = searchParams.get('type') || "package";
  
  const amount = priceRaw.replace(/[^0-9.]/g, ''); 
  const incomingRefId = searchParams.get('ref_id');

  // ✅ แก้ไข Hydration Error: ใช้ State แทนการสุ่มตัวเลขตรงๆ
  const [orderId, setOrderId] = useState(incomingRefId || ""); 

  // --- State & Form ---
  const [form, setForm] = useState({
    name: "",  
    phone: "",
    bank: "",
    date: "",
    hour: "12",
    minute: "00",
    note: "",
  });

  const [slipFile, setSlipFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // ✅ สร้าง Order ID ใน useEffect (เพื่อให้รันเฉพาะฝั่ง Client ไม่ชนกับ Server)
    if (!incomingRefId) {
        setOrderId("INV-" + Math.floor(100000 + Math.random() * 900000));
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMinute = String(now.getMinutes()).padStart(2, '0');
    
    setForm((prev) => ({ 
        ...prev, 
        date: dateStr, 
        hour: currentHour, 
        minute: currentMinute 
    }));
  }, [incomingRefId]);

  const formatThaiDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("th-TH", { month: "long" });
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
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
    if (!form.name.trim()) { toast.warn("กรุณากรอกชื่อผู้โอน"); return; }
    if (!form.bank) { toast.warn("กรุณาเลือกธนาคารที่โอน"); return; }
    if (!form.date) { toast.warn("กรุณาระบุวันที่โอน"); return; }
    if (!slipFile) { toast.warn("กรุณาแนบสลิปโอนเงิน"); return; }

    const finalTime = `${form.hour}:${form.minute}`;
    console.log("Submitting:", { ...form, time: finalTime, orderId }); // ส่ง orderId ไปด้วย

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

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  
  const banks = [
    { id: "kbank", name: "ธนาคารกสิกรไทย (KBANK)" },
    { id: "scb", name: "ธนาคารไทยพาณิชย์ (SCB)" },
    { id: "bbl", name: "ธนาคารกรุงเทพ (BBL)" },
    { id: "ktb", name: "ธนาคารกรุงไทย (KTB)" },
    { id: "bay", name: "ธนาคารกรุงศรีอยุธยา (BAY)" },
    { id: "ttb", name: "ธนาคารทหารไทยธนชาต (TTB)" },
    { id: "gsb", name: "ธนาคารออมสิน (GSB)" },
    { id: "other", name: "ช่องทางอื่นๆ / ธนาคารอื่น" }
  ];

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
          {/* แสดง Order ID จาก State */}
          <div className="text-muted fz13">Ref Order: {orderId || "..."}</div>
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
                <span className="fw600 text-dark">สแกนจ่าย</span>
              </div>
              <div className="qr-container mx-auto mb-3" style={{ width: 200, height: 200 }}>
                {/* ใช้ orderId จาก state ในการสร้าง QR */}
                {orderId && (
                    <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${orderId}-${amount}`}
                    alt="QR Code"
                    className="img-fluid border p-1 rounded"
                    />
                )}
              </div>
              <p className="fz16 text-dark fw700 mb-1">บจก. โฮมส์ เอเจนซี่</p>
              <p className="text-muted fz13 mb-0">Ref: {orderId || "..."}</p>
              <hr className="my-3 opacity-50" />
              <div 
                className="d-flex justify-content-center align-items-center gap-2 py-3 rounded position-relative"
                style={{ backgroundColor: '#fff0ec', border: '1px dashed #eb6753' }}
              >
                <span className="text-dark fw700 fz20 letter-spacing-1">012-3-45678-9</span>
                <i className="fas fa-copy cursor-pointer text-thm fz18 ms-2 hover-scale" title="คัดลอก" onClick={() => { navigator.clipboard.writeText("0123456789"); toast.info("คัดลอกเลขบัญชีแล้ว") }}></i>
              </div>
              <div className="text-muted fz15 mt-2">ธนาคารกสิกรไทย (KBANK)</div>
            </div>
            <div className="text-center text-muted fz12">*กรุณาตรวจสอบยอดเงินและชื่อบัญชีก่อนโอน</div>
          </div>
        </div>

        {/* --- RIGHT: FORM --- */}
        <div className="col-lg-7">
          <div className="bg-white border p30 bdrs12 h-100 d-flex flex-column shadow-sm">
            <h5 className="title mb-3 border-bottom pb-2">
              <i className="fas fa-file-invoice-dollar me-2 text-thm"></i> แจ้งรายละเอียดการโอน
            </h5>

            <div className="row g-3 mb-4">
                {/* 1. ชื่อผู้โอน */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">ชื่อผู้โอน (ตามสลิป) <span className="text-danger">*</span></label>
                    <input type="text" name="name" className="form-control" placeholder="ระบุชื่อ-นามสกุล" value={form.name} onChange={handleInputChange} />
                </div>

                {/* 2. เบอร์ติดต่อ */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">เบอร์ติดต่อกลับ</label>
                    <input type="tel" name="phone" className="form-control" placeholder="08x-xxx-xxxx" value={form.phone} onChange={handleInputChange} />
                </div>

                {/* 3. ธนาคาร */}
                <div className="col-12">
                    <label className="form-label fw600 fz14">ธนาคารที่โอน <span className="text-danger">*</span></label>
                    <select 
                        name="bank" 
                        className="form-select cursor-pointer" 
                        value={form.bank} 
                        onChange={handleInputChange}
                        style={{ fontSize: '15px', height: '50px' }}
                    >
                        <option value="">-- เลือกธนาคาร --</option>
                        {banks.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                {/* 4. วันที่ */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">วันที่โอน <span className="text-danger">*</span></label>
                    <input 
                        type="date" 
                        name="date"
                        className="form-control cursor-pointer"
                        value={form.date}
                        onChange={handleInputChange}
                        max={today}
                        style={{ fontSize: '16px', height: '50px' }}
                    />
                    {form.date && (
                        <div className="text-thm fz13 mt-2 fw600 bg-light px-2 py-1 rounded d-inline-block border">
                            <i className="far fa-calendar-check me-1"></i> {formatThaiDate(form.date)}
                        </div>
                    )}
                </div>

                {/* 5. เวลา (Custom) */}
                <div className="col-md-6">
                    <label className="form-label fw600 fz14">เวลาที่โอน <span className="text-danger">*</span></label>
                    
                    <div className="d-flex align-items-center gap-2">
                        <CustomTimeDropdown options={hours} value={form.hour} name="hour" onChange={handleInputChange} />
                        <span className="fw-bold fz20">:</span>
                        <CustomTimeDropdown options={minutes} value={form.minute} name="minute" onChange={handleInputChange} />
                        <span className="text-muted ms-2 fz16 fw600">น.</span>
                    </div>

                    <div className="text-muted fz12 mt-2">* ระบุเวลาตามสลิป (24 ชม.)</div>
                </div>

                {/* 6. ยอดเงิน */}
                <div className="col-12">
                    <label className="form-label fw600 fz14">จำนวนเงินที่โอน</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light fw-bold">฿</span>
                        <input type="text" className="form-control bg-light fw-bold text-dark" value={Number(amount).toLocaleString()} readOnly />
                    </div>
                </div>
            </div>

            <h6 className="fw600 mb-2 fz14">หลักฐานการโอน (สลิป) <span className="text-danger">*</span></h6>
            <div className="flex-grow-1 d-flex flex-column">
              <div
                className="upload-area text-center p-3 mb-3 position-relative d-flex flex-column align-items-center justify-content-center h-100"
                style={{ border: '2px dashed #eb6753', borderRadius: '12px', backgroundColor: '#fffcfb', cursor: 'pointer', minHeight: '200px' }}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="preview-box position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                    <div className="text-success fw-bold mb-2"><i className="fas fa-check-circle me-1"></i> แนบสลิปแล้ว</div>
                    <img src={previewUrl} alt="Slip Preview" className="img-fluid bdrs6 shadow-sm" style={{ maxHeight: '200px', objectFit: 'contain' }} />
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

            <button type="button" className={`ud-btn w-100 mt-2 btn-thm`} onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? <><i className="fas fa-spinner fa-spin me-2"></i> กำลังส่งข้อมูล...</> : 'แจ้งชำระเงิน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPackagePage;