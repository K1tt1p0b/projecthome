"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import KycModal from "./KycModal";

const MOCK_KYC = {
  status: "unverified",
  updatedAt: null,
  rejectReason: "",
};

const statusMap = {
  unverified: { label: "ยังไม่ยืนยันตัวตน", className: "pending-style style1" },
  pending: { label: "รอตรวจสอบ", className: "pending-style style3" },
  verified: { label: "ยืนยันแล้ว", className: "pending-style style2" },
  rejected: { label: "ไม่ผ่านการยืนยัน", className: "pending-style style1" },
};

export default function KycBox() {
  const [kyc, setKyc] = useState(MOCK_KYC);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // hover state สำหรับปุ่มหลัก (ไม่ใช่ reset)
  const [hoverBtn, setHoverBtn] = useState(null);

  const meta = useMemo(
    () => statusMap[kyc.status] || statusMap.unverified,
    [kyc.status]
  );

  // โชว์ Reset หลังจาก "มีการส่งข้อมูลแล้ว"
  const showReset = useMemo(() => {
    return !!kyc.updatedAt || ["pending", "verified", "rejected"].includes(kyc.status);
  }, [kyc.updatedAt, kyc.status]);

  // สีธีมส้ม (ถ้าคุณมีค่าส้มของธีมจริง เปลี่ยนตรงนี้ได้)
  const THEME_ORANGE = "#ff5a3c";

  const primaryBtnStyle = (key) => {
    const isHover = hoverBtn === key;
    return {
      background: isHover ? THEME_ORANGE : "#111111",
      border: `1px solid ${isHover ? THEME_ORANGE : "#111111"}`,
      color: "#ffffff",
      transition: "all 0.18s ease",
      boxShadow: isHover ? "0 10px 24px rgba(255, 90, 60, 0.22)" : "none",
    };
  };

  const openModal = () => {
    if (submitting) return toast.info("กำลังส่งข้อมูล กรุณารอสักครู่...");
    setOpen(true);
  };

  const closeModal = () => {
    if (submitting) return toast.info("กำลังส่งข้อมูล กรุณารอสักครู่...");
    setOpen(false);
  };

  const handleSubmitKyc = async (payload) => {
    if (submitting) return;

    try {
      setSubmitting(true);

      // TODO: ต่อ API จริงตรงนี้
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
      toast.error(err?.message || "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (submitting) return toast.info("กำลังส่งข้อมูล กรุณารอสักครู่...");
    setKyc(MOCK_KYC);
    toast.info("รีเซ็ตสถานะ KYC แล้ว");
  };

  const canStart = kyc.status === "unverified" || kyc.status === "rejected";
  const canEdit = kyc.status === "pending";
  const canView = kyc.status === "verified";

  return (
    <>
      <div className="row align-items-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className={meta.className} style={{ fontWeight: 700 }}>
              {meta.label}
            </span>

            {kyc.updatedAt ? (
              <span className="fz14 text">
                อัปเดตล่าสุด:{" "}
                {new Date(kyc.updatedAt).toLocaleString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : (
              <span className="fz14 text">ยังไม่มีการส่งข้อมูลยืนยันตัวตน</span>
            )}

            {submitting && (
              <span className="fz13 text">
                <i className="far fa-spinner fa-spin me-2" />
                กำลังดำเนินการ...
              </span>
            )}
          </div>

          {kyc.status === "unverified" && (
            <p className="text mb0 mt10 fz14">
              เพื่อความปลอดภัยและปลดล็อคสิทธิ์การใช้งานบางส่วน กรุณายืนยันตัวตนด้วย
              <span className="fw600"> บัตรประชาชน</span>
            </p>
          )}

          {kyc.status === "pending" && (
            <p className="text mb0 mt10 fz14">
              เรากำลังตรวจสอบเอกสารของคุณ โดยปกติใช้เวลา 1–2 วันทำการ
            </p>
          )}

          {kyc.status === "verified" && (
            <p className="text mb0 mt10 fz14">บัญชีของคุณผ่านการยืนยันตัวตนแล้ว</p>
          )}

          {kyc.status === "rejected" && (
            <div className="mt10">
              <p className="text mb0 fz14">
                เอกสารไม่ผ่านการตรวจสอบ{" "}
                {kyc.rejectReason ? `- เหตุผล: ${kyc.rejectReason}` : ""}
              </p>
              <p className="text mb0 fz14">กรุณาแก้ไขข้อมูลและส่งใหม่อีกครั้ง</p>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="d-flex justify-content-lg-end gap-2 mt15 mt-lg-0 flex-wrap">
            {/* ปุ่มหลัก: ดำ -> hover ส้ม */}
            {canStart && (
              <button
                type="button"
                className="ud-btn"
                onClick={openModal}
                disabled={submitting}
                style={primaryBtnStyle("start")}
                onMouseEnter={() => setHoverBtn("start")}
                onMouseLeave={() => setHoverBtn(null)}
              >
                {submitting ? (
                  <>
                    <i className="far fa-spinner fa-spin me-2" />
                    กำลังทำงาน...
                  </>
                ) : (
                  <>
                    เริ่มยืนยันตัวตน
                    <i className="fal fa-arrow-right-long ms-2" />
                  </>
                )}
              </button>
            )}

            {canEdit && (
              <button
                type="button"
                className="ud-btn"
                onClick={openModal}
                disabled={submitting}
                style={primaryBtnStyle("edit")}
                onMouseEnter={() => setHoverBtn("edit")}
                onMouseLeave={() => setHoverBtn(null)}
              >
                ดู/แก้ไขข้อมูลที่ส่ง
                <i className="fal fa-pen ms-2" />
              </button>
            )}

            {canView && (
              <button
                type="button"
                className="ud-btn"
                onClick={openModal}
                disabled={submitting}
                style={primaryBtnStyle("view")}
                onMouseEnter={() => setHoverBtn("view")}
                onMouseLeave={() => setHoverBtn(null)}
              >
                ดูรายละเอียด KYC
                <i className="fal fa-eye ms-2" />
              </button>
            )}

            {/* Reset: ซ่อนไว้ก่อน / โชว์หลังมีการส่งข้อมูลแล้ว */}
            {showReset && (
              <button
                type="button"
                className="ud-btn btn-white2"
                onClick={handleReset}
                disabled={submitting}
                title="สำหรับทดสอบ"
              >
                Reset
                <i className="fal fa-rotate-left ms-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      <KycModal open={open} onClose={closeModal} onSubmit={handleSubmitKyc} kyc={kyc} />
    </>
  );
}
