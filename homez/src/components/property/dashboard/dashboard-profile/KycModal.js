"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

/**
 * KYC RULE
 * - ใช้บัตรประชาชนเท่านั้น
 * - อัปโหลด: ด้านหน้า + เซลฟี่คู่บัตร
 * - มี preview รูป
 * - มี toast + loading
 */

const MAX_MB = 5;
const ACCEPT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function isValidImage(file) {
  if (!file) return { ok: false, msg: "ไม่พบไฟล์" };
  if (!ACCEPT_TYPES.includes(file.type))
    return { ok: false, msg: "รองรับเฉพาะไฟล์ JPG/PNG/WEBP" };
  const mb = file.size / 1024 / 1024;
  if (mb > MAX_MB) return { ok: false, msg: `ขนาดไฟล์ต้องไม่เกิน ${MAX_MB}MB` };
  return { ok: true, msg: "" };
}

// ✅ 1. อัปเกรด FileCard ให้รองรับสถานะ Error (แดง) และ ValidOld (เขียว)
function FileCard({ label, file, error, disabled, onPick, onRemove, hint, isError, isValidOld }) {

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 🎨 Logic สีและการตกแต่งกล่อง
  let borderStyle = "1px solid rgba(0,0,0,0.08)"; // ปกติ (เทา)
  let boxBg = "#fff"; // พื้นหลังกล่องนอก
  let uploadAreaBorder = "1px dashed rgba(0,0,0,0.18)";
  let uploadAreaBg = "rgba(0,0,0,0.02)";
  let iconClass = "fal fa-cloud-upload";
  let mainText = "คลิกเพื่ออัปโหลดรูป";
  let subText = `JPG / PNG / WEBP (≤ ${MAX_MB}MB)`;
  let iconColor = "";

  // ถ้ามี Error (ต้องแก้)
  if (isError) {
    borderStyle = "1px solid #dc3545"; // กรอบแดง
    boxBg = "#fff5f5"; // พื้นหลังแดงอ่อน
    uploadAreaBorder = "2px dashed #dc3545";
    uploadAreaBg = "#fff";
    iconClass = "fas fa-exclamation-triangle";
    iconColor = "text-danger";
    mainText = "กรุณาอัปโหลดใหม่";
    subText = "รูปเดิมไม่ผ่านการตรวจสอบ";
  }
  // ถ้าเป็นข้อมูลเก่าที่ถูกต้อง (ผ่านแล้ว) และยังไม่ได้เลือกรูปใหม่
  else if (isValidOld && !file) {
    borderStyle = "1px solid #198754"; // กรอบเขียว
    boxBg = "#f0fff4"; // พื้นหลังเขียวอ่อน
    uploadAreaBorder = "2px solid #198754";
    uploadAreaBg = "#fff";
    iconClass = "fas fa-check-circle";
    iconColor = "text-success";
    mainText = "รูปนี้ผ่านแล้ว";
    subText = "ใช้รูปเดิม (หรือคลิกเพื่อเปลี่ยน)";
  }

  return (
    <div
      className="bdrs12 p15"
      style={{
        border: borderStyle,
        background: boxBg,
        transition: 'all 0.2s'
      }}
    >
      <div className="d-flex align-items-start justify-content-between gap-2">
        <div>
          <div className={`fw600 fz14 ${isError ? 'text-danger' : ''}`}>
            {label} {isError && "*"}
          </div>
          {hint && <div className="fz12 text mt5">{hint}</div>}
        </div>

        {file && !disabled && (
          <button
            type="button"
            className="ud-btn btn-white2"
            onClick={onRemove}
            style={{ padding: "6px 10px" }}
          >
            ลบ
            <i className="fal fa-trash ms-2" />
          </button>
        )}
      </div>

      <div className="mt12">
        {file ? (
          // --- กรณีเลือกไฟล์ใหม่แล้ว (Preview) ---
          <div className="d-flex gap-3 align-items-center animate-up-1">
            <div
              className="bdrs12 overflow-hidden"
              style={{
                width: 96,
                height: 72,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="flex-grow-1">
              <div className="fw600 fz14 text-primary" style={{ wordBreak: "break-word" }}>
                <i className="fas fa-check-circle me-1"></i> {file.name}
              </div>
              <div className="fz12 text">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <div className="fz11 text-success">พร้อมส่งรูปใหม่</div>
            </div>
          </div>
        ) : (
          // --- กรณีว่าง (แสดงสถานะตาม Error/ValidOld) ---
          <label
            className="d-flex align-items-center justify-content-center bdrs12"
            style={{
              border: uploadAreaBorder,
              minHeight: 110,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              background: uploadAreaBg,
            }}
          >
            <div className="text-center p10">
              <i className={`${iconClass} fz24 ${iconColor}`} />
              <div className={`fw600 fz14 mt8 ${iconColor}`}>{mainText}</div>
              <div className="fz12 text">{subText}</div>

              <input
                type="file"
                className="d-none"
                accept="image/*"
                disabled={disabled}
                onChange={(e) => onPick(e.target.files?.[0] || null)}
              />
            </div>
          </label>
        )}

        {/* แสดง Error text ถ้ามีการ validate failed ในหน้า modal */}
        {error && <div className="text-danger fz13 mt10">{error}</div>}
      </div>
    </div>
  );
}

export default function KycModal({ open, onClose, onSubmit, kyc }) {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    idFront: null,
    selfie: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ 2. ดึงรายการที่ผิดมาจาก Props
  const invalidFields = useMemo(() => kyc?.invalidFields || [], [kyc]);
  const isRejected = kyc?.status === "rejected";
  const isVerified = kyc?.status === "verified";

  useEffect(() => {
    if (!open) return;
    // Reset form ถ้าไม่ใช่การแก้ไข (หรือจะดึงค่าเดิมมาใส่ก็ได้ถ้ามี API)
    // ในที่นี้เราจะ Reset แค่ Error
    setErrors({});
    setSubmitting(false);
  }, [open]);

  if (!open) return null;

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePickFile = (fieldName, file) => {
    if (!file) return;

    const { ok, msg } = isValidImage(file);
    if (!ok) {
      toast.error(msg);
      setErrors((prev) => ({ ...prev, [fieldName]: msg }));
      return;
    }

    setField(fieldName, file);
    toast.success("อัปโหลดรูปสำเร็จ");
  };

  const handleRemoveFile = (fieldName) => {
    setField(fieldName, null);
    toast.info("ลบรูปแล้ว");
  };

  // ✅ 3. ปรับ Validate ให้ข้าม Field ที่ "ผ่านแล้ว" (ValidOld)
  const validate = () => {
    const e = {};

    // เช็ค Text Input
    if (!form.idNumber?.trim()) {
      // ถ้าเลขบัตรผิด หรือ เป็นการกรอกใหม่
      if (invalidFields.includes('idNumber') || !isRejected) {
        e.idNumber = "กรุณากรอกเลขบัตรประชาชน";
      }
    } else {
      const digitsOnly = (form.idNumber || "").replace(/\D/g, "");
      if (digitsOnly.length && digitsOnly.length !== 13) {
        e.idNumber = "เลขบัตรต้องเป็น 13 หลัก";
      }
    }

    // เช็ครูปภาพ (Logic: ต้องมีรูปใหม่ OR (เป็นเคสแก้ AND รูปเดิมผ่าน))
    const isIdFrontValidOld = isRejected && !invalidFields.includes('idFront');
    if (!form.idFront && !isIdFrontValidOld) {
      e.idFront = "กรุณาอัปโหลดรูปบัตรประชาชนด้านหน้า";
    }

    const isSelfieValidOld = isRejected && !invalidFields.includes('selfie');
    if (!form.selfie && !isSelfieValidOld) {
      e.selfie = "กรุณาอัปโหลดรูปเซลฟี่คู่บัตร";
    }

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("กรุณากรอกข้อมูล/อัปโหลดรูปให้ครบ");
      return false;
    }
    return true;
  };

  const handleClose = () => {
    if (submitting) {
      toast.info("กำลังส่งข้อมูล กรุณารอสักครู่...");
      return;
    }
    onClose?.();
  };

  const handleSubmit = async () => {
    if (isVerified) return handleClose();
    if (submitting) return;
    if (!validate()) return;

    try {
      setSubmitting(true);
      toast.info("กำลังส่งข้อมูลยืนยันตัวตน...");

      await onSubmit({
        fullName: form.fullName.trim(), // (ถ้าไม่ได้ใช้ ลบออกได้)
        idNumber: form.idNumber.trim(),
        idFront: form.idFront,
        selfie: form.selfie,
      });

      // toast.success("ส่งข้อมูลเรียบร้อย! รอตรวจสอบ"); // ย้ายไปให้ Parent จัดการได้
      handleClose();
    } catch (err) {
      toast.error(err?.message || "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.55)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content bdrs12 overflow-hidden animate-up-1">
          {/* HEADER */}
          <div className="modal-header bgc-f7" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <div>
              <h5 className="mb0">ยืนยันตัวตน (KYC)</h5>
              <div className="fz13 text">แก้ไขข้อมูลตามที่เจ้าหน้าที่แจ้งเพื่อดำเนินการต่อ</div>
            </div>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>

          {/* Alert Message for Rejection */}
          {isRejected && (
            <div className="px-4 pt-3">
              <div className="alert alert-danger d-flex align-items-center m-0" role="alert">
                <i className="fas fa-info-circle me-2 fz20"></i>
                <div>
                  <strong>ไม่ผ่านการอนุมัติ:</strong> {kyc.rejectReason}
                </div>
              </div>
            </div>
          )}

          {/* BODY */}
          <div className="modal-body">
            <div className="row g-4">
              {/* INFO */}
              <div className="col-lg-5">
                <div className="bdrs12 p20" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
                  <div className="fw700 fz16 mb15">ข้อมูลผู้ใช้งาน</div>

                  <div className="mb15">
                    <label className="form-label fw600">
                      เลขบัตรประชาชน
                      {/* Show Error Label */}
                      {invalidFields.includes('idNumber') && <span className="text-danger ms-2">* ข้อมูลไม่ถูกต้อง</span>}
                    </label>
                    <input
                      className={`form-control ${invalidFields.includes('idNumber') ? 'is-invalid border-danger text-danger' : (isRejected ? 'border-success text-success' : '')}`}
                      value={form.idNumber}
                      onChange={(e) => setField("idNumber", e.target.value)}
                      disabled={isVerified || submitting || (!invalidFields.includes('idNumber') && isRejected)} // Lock if correct
                      placeholder="13 หลัก"
                    />
                    {errors.idNumber && <div className="text-danger fz13 mt5">{errors.idNumber}</div>}

                    {/* Show Success Label if valid old */}
                    {!invalidFields.includes('idNumber') && isRejected && (
                      <div className="text-success fz12 mt-1"><i className="fas fa-check-circle me-1"></i> ข้อมูลถูกต้องแล้ว</div>
                    )}
                  </div>

                  <div className="bdrs12 p15 bgc-f7 fz14">
                    <ul className="mb0">
                      <li>ข้อมูลต้องตรงกับบัตรประชาชน</li>
                      <li>รูปต้องชัด ไม่เบลอ ไม่สะท้อนแสง</li>
                      <li>ใช้เพื่อยืนยันตัวตนเท่านั้น</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* UPLOAD */}
              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FileCard
                      label="รูปบัตรประชาชน (ด้านหน้า)"
                      file={form.idFront}
                      error={errors.idFront}
                      disabled={isVerified || submitting}
                      onPick={(f) => handlePickFile("idFront", f)}
                      onRemove={() => handleRemoveFile("idFront")}
                      hint="เห็นข้อมูลครบ ไม่ปิดบัง"
                      // ✅ ส่ง Status ไปบอก FileCard
                      isError={invalidFields.includes('idFront')}
                      isValidOld={isRejected && !invalidFields.includes('idFront')}
                    />
                  </div>

                  <div className="col-md-6">
                    <FileCard
                      label="รูปเซลฟี่คู่บัตรประชาชน"
                      file={form.selfie}
                      error={errors.selfie}
                      disabled={isVerified || submitting}
                      onPick={(f) => handlePickFile("selfie", f)}
                      onRemove={() => handleRemoveFile("selfie")}
                      hint="เห็นหน้าและบัตรชัดเจน"
                      // ✅ ส่ง Status ไปบอก FileCard
                      isError={invalidFields.includes('selfie')}
                      isValidOld={isRejected && !invalidFields.includes('selfie')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer bgc-f7" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <button
              type="button"
              className="ud-btn btn-white2"
              onClick={handleClose}
              disabled={submitting}
            >
              {isVerified ? "ปิด" : "ยกเลิก"}
            </button>

            {!isVerified && (
              <button
                type="button"
                className="ud-btn btn-thm"
                onClick={handleSubmit}
                disabled={submitting}
                style={{ backgroundColor: isRejected ? '#ff5a3c' : undefined, borderColor: isRejected ? '#ff5a3c' : undefined }}
              >
                {submitting ? (
                  <>
                    <i className="far fa-spinner fa-spin me-2" />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    {isRejected ? 'ส่งข้อมูลแก้ไข' : 'ส่งเพื่อยืนยันตัวตน'}
                    <i className="fal fa-arrow-right-long ms-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}