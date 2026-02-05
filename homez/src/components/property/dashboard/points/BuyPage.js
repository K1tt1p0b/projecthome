"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Select from "react-select";
import { QRCodeCanvas } from "qrcode.react";
import generatePayload from "promptpay-qr";

// ==========================================
// 1. Main Component (Wrapped in Suspense)
// ==========================================
const BuyPackagePage = () => {
  return (
    <Suspense fallback={<div className="p-5 text-center">Loading Payment Page...</div>}>
      <BuyPackageContent />
    </Suspense>
  );
};

// ==========================================
// 2. Helper Components & Styles
// ==========================================

// --- Custom Time Dropdown ---
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
      if (selectedEl) selectedEl.scrollIntoView({ block: 'center' });
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
        <div className="position-absolute start-0 w-100 bg-white border rounded shadow-sm custom-scrollbar" style={{ top: '110%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
          {options.map((opt) => (
            <div
              key={opt}
              id={`option-${name}-${opt}`}
              className={`py-2 text-center cursor-pointer`}
              onClick={() => { onChange({ target: { name, value: opt } }); setIsOpen(false); }}
              style={{ backgroundColor: value === opt ? '#fff0ec' : 'transparent', color: value === opt ? '#eb6753' : '#333', fontWeight: value === opt ? 'bold' : 'normal' }}
              onMouseEnter={(e) => { if (value !== opt) e.target.style.backgroundColor = '#f8f9fa' }}
              onMouseLeave={(e) => { if (value !== opt) e.target.style.backgroundColor = 'transparent' }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- React-Select Styles ---
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#eb6753' : '#dee2e6',
    minHeight: '50px',
    height: '50px',
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 1px #eb6753' : null,
    '&:hover': { borderColor: '#eb6753' },
    cursor: 'pointer'
  }),
  valueContainer: (provided) => ({ ...provided, height: '50px', padding: '0 6px', display: 'flex', alignItems: 'center' }),
  input: (provided) => ({ ...provided, margin: '0px', paddingTop: '0' }),
  indicatorSeparator: () => ({ display: 'none' }),
  indicatorsContainer: (provided) => ({ ...provided, height: '50px' }),
  menu: (provided) => ({ ...provided, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 9999 }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#eb6753' : state.isFocused ? '#f8f9fa' : '#fff',
    color: state.isSelected ? '#fff' : '#333',
    cursor: 'pointer',
    padding: '10px 15px',
    fontSize: '15px',
    '&:active': { backgroundColor: '#eb6753' },
  }),
  placeholder: (provided) => ({ ...provided, color: '#777', fontSize: '14px' }),
  singleValue: (provided) => ({ ...provided, color: '#333', fontSize: '15px', fontWeight: '500' })
};

// ==========================================
// 3. Main Content Logic
// ==========================================
const BuyPackageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // --- ข้อมูลแพ็กเกจจาก URL ---
  const itemName = searchParams.get('package') || "สินค้าทั่วไป";
  const cycle = searchParams.get('cycle') || "-";
  const priceRaw = searchParams.get('price') || "0";
  const type = searchParams.get('type') || "package";
  const amount = Number(priceRaw.replace(/[^0-9.]/g, ''));
  const incomingRefId = searchParams.get('ref_id');

  // --- States ---
  const [orderId, setOrderId] = useState(incomingRefId || "");
  const [form, setForm] = useState({ name: "", phone: "", bank: "", otherBank: "", date: "", hour: "12", minute: "00", note: "" });
  const [slipFile, setSlipFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrPayload, setQrPayload] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // ✅ CONFIG: ข้อมูลการชำระเงิน (แก้เลขจริงที่นี่)
  const PAYMENT_INFO = {
    PROMPTPAY: "0812345678",      // เบอร์พร้อมเพย์ (สำหรับเจน QR)
    BANK_ACC: "0123456789",       // เลขบัญชีธนาคาร
    BANK_NAME: "ธนาคารกสิกรไทย (KBANK)",
    ACC_NAME: "บจก. โฮมส์ เอเจนซี่"
  };

  // --- Initialize ---
  useEffect(() => {
    if (!incomingRefId) {
      setOrderId("INV-" + Math.floor(100000 + Math.random() * 900000));
    }
    const now = new Date();
    setForm((prev) => ({
      ...prev,
      date: now.toISOString().split("T")[0],
      hour: String(now.getHours()).padStart(2, '0'),
      minute: String(now.getMinutes()).padStart(2, '0')
    }));
  }, [incomingRefId]);

  // --- Generate QR Code (PromptPay with Amount) ---
  useEffect(() => {
    if (amount > 0) {
      // สร้าง Payload พร้อมเพย์แบบระบุยอดเงิน
      const payload = generatePayload(PAYMENT_INFO.PROMPTPAY, { amount: amount });
      setQrPayload(payload);
    }
  }, [amount]);

  // --- Helper Functions ---
  const maskMobile = (num) => (num && num.length >= 10 ? `${num.slice(0, 3)}-xxx-${num.slice(-4)}` : num);
  const maskBank = (num) => (num && num.length >= 10 ? `xxx-x-xx${num.slice(-4).substring(0, 3)}-${num.slice(-1)}` : num);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (selectedOption) => {
    const val = selectedOption ? selectedOption.value : "";
    setForm((prev) => ({ ...prev, bank: val, otherBank: val === 'other' ? prev.otherBank : "" }));
  };

  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error("ไฟล์มีขนาดใหญ่เกินไป (Max 5MB)"); return; }
      setSlipFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirm = async () => {
    if (!form.name.trim()) { toast.warn("กรุณากรอกชื่อผู้โอน"); return; }
    if (!form.bank) { toast.warn("กรุณาเลือกธนาคารที่โอน"); return; }
    if (form.bank === 'other' && !form.otherBank.trim()) { toast.warn("กรุณาระบุชื่อธนาคารอื่น"); return; }
    if (!form.date) { toast.warn("กรุณาระบุวันที่โอน"); return; }
    if (!slipFile) { toast.warn("กรุณาแนบสลิปโอนเงิน"); return; }

    // Logic ส่งข้อมูลไป Backend
    const finalBank = form.bank === 'other' ? `Other: ${form.otherBank}` : form.bank;
    const finalTime = `${form.hour}:${form.minute}`;

    console.log("Submitting:", { ...form, bank: finalBank, time: finalTime, amount, orderId });

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(`แจ้งชำระเงินเรียบร้อย! รอการตรวจสอบ`);
    setIsSubmitting(false);

    if (type === 'banner') router.push('/dashboard-banners');
    else router.push('/dashboard-my-package');
  };

  // --- Constants ---
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const bankOptions = [
    { value: "kbank", label: "ธนาคารกสิกรไทย (KBANK)" },
    { value: "scb", label: "ธนาคารไทยพาณิชย์ (SCB)" },
    { value: "bbl", label: "ธนาคารกรุงเทพ (BBL)" },
    { value: "ktb", label: "ธนาคารกรุงไทย (KTB)" },
    { value: "bay", label: "ธนาคารกรุงศรีอยุธยา (BAY)" },
    { value: "ttb", label: "ธนาคารทหารไทยธนชาต (TTB)" },
    { value: "gsb", label: "ธนาคารออมสิน (GSB)" },
    { value: "baac", label: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)" },
    { value: "ghb", label: "ธนาคารอาคารสงเคราะห์ (GHB)" },
    { value: "kkp", label: "ธนาคารเกียรตินาคินภัทร (KKP)" },
    { value: "cimb", label: "ธนาคารซีไอเอ็มบี ไทย (CIMBT)" },
    { value: "uob", label: "ธนาคารยูโอบี (UOB)" },
    { value: "tisco", label: "ธนาคารทิสโก้ (TISCO)" },
    { value: "lh", label: "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)" },
    { value: "ibank", label: "ธนาคารอิสลามแห่งประเทศไทย (IBANK)" },
    { value: "other", label: "ช่องทางอื่นๆ / ธนาคารอื่น" }
  ];

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden">
      {/* Header */}
      <div className="row mb30 align-items-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center">
            <button onClick={() => router.back()} className="btn btn-sm btn-light rounded-circle me-3 border">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h4 className="title fz20 mb-1">ชำระเงิน (Payment)</h4>
              <p className="text-muted fz14 mb-0">รายการ: <span className="text-thm fw600">{itemName}</span> {cycle !== '-' && <span className="badge bg-light text-dark border ms-2">{cycle}</span>}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 text-lg-end"><div className="text-muted fz13">Ref Order: {orderId || "..."}</div></div>
      </div>
      <hr className="opacity-25 mb30" />

      <div className="row g-4">

        {/* ==========================
            LEFT COLUMN: PAYMENT INFO
           ========================== */}
        <div className="col-lg-5">
          <div className="bg-light p30 bdrs12 h-100 position-relative border text-center">

            <h5 className="title mb20 d-flex align-items-center justify-content-center">
              ยอดชำระ: <span className="text-thm ms-2 fz28 fw700">฿{amount.toLocaleString()}</span>
            </h5>

            <div className="text-center bg-white p-4 bdrs12 mb20 shadow-sm border mx-auto" style={{ maxWidth: '340px' }}>

              {/* 1. QR Code */}
              <div className="qr-container mx-auto mb-3" style={{ width: 180, height: 180 }}>
                {qrPayload ? (
                  <QRCodeCanvas value={qrPayload} size={180} level="L" includeMargin={true} className="img-fluid border p-1 rounded" />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded text-muted">Loading QR...</div>
                )}
              </div>
              <p className="text-muted fz12 mb-3"><i className="fas fa-scan me-1"></i> สแกนเพื่อจ่าย (ยอดเงินระบุอัตโนมัติ)</p>

              <h6 className="fw-bold text-dark">{PAYMENT_INFO.ACC_NAME}</h6>
              <p className="text-muted fz13 mb-3">{PAYMENT_INFO.BANK_NAME}</p>

              <hr className="opacity-50 my-3" />

              {/* 2. PromptPay Box (สีฟ้า) */}
              <div className="d-flex justify-content-between align-items-center px-3 py-2 rounded mb-2" style={{ backgroundColor: '#eefeff', border: '1px dashed #0099cc' }}>
                <div className="text-start">
                  <div className="fz11 text-muted fw600">พร้อมเพย์ (PromptPay)</div>
                  <div className="text-dark fw700 fz16 letter-spacing-1">{maskMobile(PAYMENT_INFO.PROMPTPAY)}</div>
                </div>
                <button
                  className="btn btn-sm btn-outline-info rounded-circle"
                  title="คัดลอกเบอร์โทร"
                  onClick={() => { navigator.clipboard.writeText(PAYMENT_INFO.PROMPTPAY); toast.info("คัดลอกเบอร์โทรแล้ว"); }}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>

              {/* 3. Bank Account Box (สีส้ม) */}
              <div className="d-flex justify-content-between align-items-center px-3 py-2 rounded" style={{ backgroundColor: '#fff0ec', border: '1px dashed #eb6753' }}>
                <div className="text-start">
                  <div className="fz11 text-muted fw600">เลขบัญชีธนาคาร</div>
                  <div className="text-dark fw700 fz16 letter-spacing-1">{maskBank(PAYMENT_INFO.BANK_ACC)}</div>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger rounded-circle"
                  title="คัดลอกเลขบัญชี"
                  onClick={() => { navigator.clipboard.writeText(PAYMENT_INFO.BANK_ACC); toast.info("คัดลอกเลขบัญชีแล้ว"); }}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>

            </div>

            <div className="text-center text-muted fz12 mt-3">
              *เลือกโอนช่องทางใดก็ได้ (QR, พร้อมเพย์, หรือเลขบัญชี)
            </div>

          </div>
        </div>

        {/* ==========================
            RIGHT COLUMN: FORM
           ========================== */}
        <div className="col-lg-7">
          <div className="bg-white border p30 bdrs12 h-100 d-flex flex-column shadow-sm">
            <h5 className="title mb-3 border-bottom pb-2">
              <i className="fas fa-file-invoice-dollar me-2 text-thm"></i> แจ้งรายละเอียดการโอน
            </h5>

            <div className="row g-3 mb-4">
              <div className="col-md-full">
                <label className="form-label fw600 fz14">ชื่อผู้โอน (ตามสลิป) <span className="text-danger">*</span></label>
                <input type="text" name="name" className="form-control" placeholder="ระบุชื่อ-นามสกุล" value={form.name} onChange={handleInputChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw600 fz14">ธนาคารที่โอน <span className="text-danger">*</span></label>
                <Select
                  instanceId="bank-select"
                  options={bankOptions}
                  value={bankOptions.find(opt => opt.value === form.bank)}
                  onChange={handleBankChange}
                  styles={customSelectStyles}
                  placeholder="-- เลือกธนาคาร --"
                  isSearchable={false}
                />
                {form.bank === 'other' && (
                  <div className="mt-3 ps-3 border-3 border-danger bg-light p-2 rounded">
                    <label className="form-label fw600 fz13 text-danger">โปรดระบุธนาคาร <span className="text-danger">*</span></label>
                    <input type="text" name="otherBank" className="form-control" placeholder="ระบุชื่อธนาคาร" value={form.otherBank} onChange={handleInputChange} />
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label fw600 fz14">วันที่โอน <span className="text-danger">*</span></label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleInputChange} max={today} style={{ height: '50px' }} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw600 fz14">เวลาที่โอน <span className="text-danger">*</span></label>
                <div className="d-flex align-items-center gap-2">
                  <CustomTimeDropdown options={hours} value={form.hour} name="hour" onChange={handleInputChange} />
                  <span className="fw-bold">:</span>
                  <CustomTimeDropdown options={minutes} value={form.minute} name="minute" onChange={handleInputChange} />
                  <span className="text-muted fz14">น.</span>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw600 fz14">จำนวนเงินที่โอน</label>
                <input type="text" className="form-control bg-light fw-bold text-dark" value={amount.toLocaleString()} readOnly />
              </div>
            </div>

            <h6 className="fw600 mb-2 fz14">หลักฐานการโอน (สลิป) <span className="text-danger">*</span></h6>
            <div className="flex-grow-1 d-flex flex-column">
              <div className="upload-area text-center p-3 mb-3 position-relative d-flex flex-column align-items-center justify-content-center h-100" style={{ border: '2px dashed #eb6753', borderRadius: '12px', backgroundColor: '#fffcfb', cursor: 'pointer', minHeight: '200px' }} onClick={() => fileInputRef.current?.click()}>
                {previewUrl ? (
                  <div className="preview-box position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                    <div className="text-success fw-bold mb-2"><i className="fas fa-check-circle me-1"></i> แนบสลิปแล้ว</div>
                    <img src={previewUrl} alt="Slip Preview" className="img-fluid bdrs6 shadow-sm" style={{ maxHeight: '200px', objectFit: 'contain' }} />
                    <div className="mt-2 text-thm fz13 fw600"><i className="fas fa-sync-alt me-1"></i> เปลี่ยนรูป</div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 bg-white p-3 rounded-circle shadow-sm border"><i className="fas fa-cloud-upload-alt fz30 text-thm"></i></div>
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