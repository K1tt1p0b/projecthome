"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import KycModal from "./KycModal";

// --- MOCK DATA ---
const MOCK_KYC = {
  status: "verified",
  updatedAt: "2023-10-25T10:00:00.000Z",
  rejectReason: "รูปบัตรไม่ชัด",
};

// --- CONFIG ---
const STATUS_CONFIG = {
  unverified: {
    label: "ยังไม่ยืนยันตัวตน",
    desc: "ยืนยันตัวตนเพื่อปลดล็อคฟีเจอร์และความน่าเชื่อถือ",
    icon: "fas fa-shield-alt",
    colorClass: "text-dark",
    bgClass: "bg-light",
  },
  pending: {
    label: "กำลังตรวจสอบ",
    desc: "เจ้าหน้าที่กำลังตรวจสอบเอกสาร (1-2 วันทำการ)",
    icon: "fas fa-clock",
    colorClass: "text-warning",
    bgClass: "bg-warning-subtle",
  },
  verified: {
    label: "ยืนยันตัวตนแล้ว",
    desc: "บัญชีของคุณผ่านการตรวจสอบเรียบร้อยแล้ว",
    icon: "fas fa-check-circle",
    colorClass: "text-success",
    bgClass: "bg-success-subtle",
  },
  rejected: {
    label: "ไม่ผ่านการอนุมัติ",
    desc: "เอกสารไม่ถูกต้อง กรุณาตรวจสอบและส่งใหม่",
    icon: "fas fa-exclamation-circle",
    colorClass: "text-danger",
    bgClass: "bg-danger-subtle",
  },
};

export default function KycBox() {
  const [kyc, setKyc] = useState(MOCK_KYC);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State สำหรับ Hover ต่างๆ
  const [hoverBtn, setHoverBtn] = useState(null);
  const [hoverCard, setHoverCard] = useState(false); // ✅ 1. State สำหรับกล่องใหญ่
  const [hoverLink, setHoverLink] = useState(false); // ✅ 2. State สำหรับลิงก์ดูรายละเอียด

  // ดึง Config ตามสถานะ
  const currentStatus = useMemo(
    () => STATUS_CONFIG[kyc.status] || STATUS_CONFIG.unverified,
    [kyc.status]
  );

  // Logic ปุ่ม Reset
  const showReset = useMemo(() => {
    if (kyc.status === "verified") return false;
    return !!kyc.updatedAt || ["pending", "rejected"].includes(kyc.status);
  }, [kyc.updatedAt, kyc.status]);

  const THEME_ORANGE = "#ff5a3c";

  // Style ปุ่มหลัก
  const primaryBtnStyle = (key) => {
    const isHover = hoverBtn === key;
    return {
      background: isHover ? THEME_ORANGE : "#111111",
      border: `1px solid ${isHover ? THEME_ORANGE : "#111111"}`,
      color: "#ffffff",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: isHover ? "0 8px 20px rgba(255, 90, 60, 0.25)" : "none",
      padding: "10px 24px",
      borderRadius: "30px",
      fontWeight: 600,
      fontSize: "14px"
    };
  };

  const openModal = () => {
    if (submitting) return toast.info("กำลังส่งข้อมูล...");
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  const handleSubmitKyc = async (payload) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 700));
      setKyc((prev) => ({
        ...prev,
        status: "pending",
        updatedAt: new Date().toISOString(),
        rejectReason: "",
      }));
      toast.success("ส่งข้อมูลเรียบร้อย! รอตรวจสอบ");
      setOpen(false);
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setKyc(MOCK_KYC);
    toast.info("Reset สถานะแล้ว");
  };

  const canStart = kyc.status === "unverified" || kyc.status === "rejected";
  const canEdit = kyc.status === "pending";
  const canView = kyc.status === "verified";

  return (
    <>
      {/* ✅ 1. เพิ่ม onMouseEnter/Leave และ Style ให้กล่องใหญ่ */}
      <div
        className="ps-widget bg-white bdrs12 p30 position-relative border-0"
        style={{
          boxShadow: hoverCard ? '0 15px 30px rgba(0,0,0,0.08)' : '0 5px 20px rgba(0,0,0,0.03)',
          transform: hoverCard ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          overflow: 'hidden',
          cursor: 'default'
        }}
        onMouseEnter={() => setHoverCard(true)}
        onMouseLeave={() => setHoverCard(false)}
      >

        <div className="row align-items-center">

          {/* --- ฝั่งซ้าย: ไอคอน & เนื้อหา --- */}
          <div className="col-lg-8">
            <div className="d-flex align-items-start gap-4">

              <div
                className={`d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle ${currentStatus.bgClass} ${currentStatus.colorClass}`}
                style={{ width: '70px', height: '70px', fontSize: '28px' }}
              >
                <i className={currentStatus.icon}></i>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-3 mb-1">
                  <h4 className="title mb-0 fw-bold fz18">{currentStatus.label}</h4>

                  {kyc.updatedAt && (
                    <span className="badge rounded-pill bg-light text-muted fw-normal border fz12">
                      <i className="far fa-calendar-alt me-1"></i>
                      {new Date(kyc.updatedAt).toLocaleDateString("th-TH")}
                    </span>
                  )}
                </div>

                <p className="text-muted fz14 mb-2" style={{ lineHeight: '1.6' }}>
                  {currentStatus.desc}
                </p>

                {/* --- 🔴 Alert Box กรณี Rejected --- */}
                {kyc.status === "rejected" && (
                  <div className="bg-danger-subtle border-start border-danger border-4 p-3 rounded-end mt-3 animate-up-1">

                    {/* ส่วนหัวข้อ: จัดไอคอนให้อยู่ 'กึ่งกลาง' กับตัวหนังสือ (align-items-center) */}
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="fas fa-info-circle text-danger" style={{ fontSize: '18px' }}></i>
                      <h6 className="text-danger fw-bold fz15 mb-0" style={{ lineHeight: '1' }}>
                        สาเหตุที่ไม่อนุมัติ:
                      </h6>
                    </div>

                    {/* ส่วนเนื้อหา: เว้นระยะซ้าย (ms-4) ให้ตรงกับแนวตัวหนังสือด้านบน */}
                    <div className="ms-4">
                      <p className="mb-0 text-dark fz14" style={{ lineHeight: '1.5' }}>
                        {kyc.rejectReason}
                      </p>
                    </div>

                  </div>
                )}

                {submitting && (
                  <div className="text-primary fz13 mt-2">
                    <i className="fas fa-circle-notch fa-spin me-2"></i> กำลังส่งข้อมูล...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- ฝั่งขวา: ปุ่ม Action --- */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="d-flex flex-column align-items-lg-end gap-2">

              {canStart && (
                <button
                  onClick={openModal}
                  disabled={submitting}
                  style={primaryBtnStyle("start")}
                  onMouseEnter={() => setHoverBtn("start")}
                  onMouseLeave={() => setHoverBtn(null)}
                >
                  {kyc.status === 'rejected' ? 'แก้ไขและส่งใหม่' : 'เริ่มยืนยันตัวตน'}
                  <i className="fal fa-arrow-right ms-2" />
                </button>
              )}

              {canEdit && (
                <button
                  onClick={openModal}
                  disabled={submitting}
                  style={primaryBtnStyle("edit")}
                  onMouseEnter={() => setHoverBtn("edit")}
                  onMouseLeave={() => setHoverBtn(null)}
                >
                  ตรวจสอบข้อมูล
                  <i className="fal fa-search ms-2" />
                </button>
              )}

              {canView && (
                <div className="text-lg-end">
                  {/* ✅ 2. เพิ่ม Hover Effect ให้ปุ่ม Link */}
                  <button
                    onClick={openModal}
                    disabled={submitting}
                    className="btn btn-link fw-bold text-decoration-none p-0"
                    style={{
                      color: hoverLink ? '#157347' : '#198754', // เปลี่ยนสีเข้มขึ้นเมื่อ Hover
                      textDecoration: hoverLink ? 'underline !important' : 'none', // ขีดเส้นใต้เมื่อ Hover
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={() => setHoverLink(true)}
                    onMouseLeave={() => setHoverLink(false)}
                  >
                    ดูรายละเอียดบัตร
                    {/* อนิเมชันลูกศรขยับ */}
                    <i
                      className="fal fa-chevron-right ms-1"
                      style={{
                        transform: hoverLink ? 'translateX(3px)' : 'translateX(0)',
                        transition: 'transform 0.2s ease'
                      }}
                    ></i>
                  </button>
                </div>
              )}

              {showReset && (
                <button
                  onClick={handleReset}
                  disabled={submitting}
                  className="btn btn-sm btn-link text-muted text-decoration-none mt-1 fz12"
                  title="สำหรับ Dev Test"
                >
                  <i className="fal fa-history me-1"></i> Reset Status
                </button>
              )}

            </div>
          </div>

        </div>
      </div>

      <KycModal open={open} onClose={closeModal} onSubmit={handleSubmitKyc} kyc={kyc} />
    </>
  );
}