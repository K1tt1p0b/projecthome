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

function FileCard({ label, file, error, disabled, onPick, onRemove, hint }) {
  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div
      className="bdrs12 p15"
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
      }}
    >
      <div className="d-flex align-items-start justify-content-between gap-2">
        <div>
          <div className="fw600 fz14">{label}</div>
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
          <div className="d-flex gap-3 align-items-center">
            <div
              className="bdrs12 overflow-hidden"
              style={{
                width: 96,
                height: 72,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {/* preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="flex-grow-1">
              <div className="fw600 fz14" style={{ wordBreak: "break-word" }}>
                {file.name}
              </div>
              <div className="fz12 text">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        ) : (
          <label
            className="d-flex align-items-center justify-content-center bdrs12"
            style={{
              border: "1px dashed rgba(0,0,0,0.18)",
              minHeight: 110,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <div className="text-center p10">
              <i className="fal fa-cloud-upload fz20" />
              <div className="fw600 fz14 mt8">คลิกเพื่ออัปโหลดรูป</div>
              <div className="fz12 text">JPG / PNG / WEBP (≤ {MAX_MB}MB)</div>

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

  const isReadOnly = useMemo(() => kyc?.status === "verified", [kyc]);

  useEffect(() => {
    if (!open) return;
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

  const validate = () => {
    const e = {};
    if (!form.fullName?.trim()) e.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!form.idNumber?.trim()) e.idNumber = "กรุณากรอกเลขบัตรประชาชน";

    // เช็คเลขบัตรแบบง่าย (13 หลัก) — ถ้าไม่อยากบังคับ ลบส่วนนี้ได้
    const digitsOnly = (form.idNumber || "").replace(/\D/g, "");
    if (digitsOnly.length && digitsOnly.length !== 13) {
      e.idNumber = "เลขบัตรต้องเป็น 13 หลัก";
    }

    if (!form.idFront) e.idFront = "กรุณาอัปโหลดรูปบัตรประชาชนด้านหน้า";
    if (!form.selfie) e.selfie = "กรุณาอัปโหลดรูปเซลฟี่คู่บัตร";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("กรุณากรอกข้อมูล/อัปโหลดรูปให้ครบ");
      return false;
    }
    return true;
  };

  const handleClose = () => {
    // ป้องกันกดปิดตอนกำลังส่ง
    if (submitting) {
      toast.info("กำลังส่งข้อมูล กรุณารอสักครู่...");
      return;
    }
    onClose?.();
  };

  const handleSubmit = async () => {
    if (isReadOnly) return handleClose();
    if (submitting) return;
    if (!validate()) return;

    try {
      setSubmitting(true);
      toast.info("กำลังส่งข้อมูลยืนยันตัวตน...");

      await onSubmit({
        fullName: form.fullName.trim(),
        idNumber: form.idNumber.trim(),
        idFront: form.idFront,
        selfie: form.selfie,
      });

      toast.success("ส่งข้อมูลเรียบร้อย! รอตรวจสอบ");
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
        <div className="modal-content bdrs12 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bgc-f7" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <div>
              <h5 className="mb0">ยืนยันตัวตน (KYC)</h5>
              <div className="fz13 text">ใช้บัตรประชาชนด้านหน้า + รูปเซลฟี่คู่บัตร</div>
            </div>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="row g-4">
              {/* INFO */}
              <div className="col-lg-5">
                <div className="bdrs12 p20" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
                  <div className="fw700 fz16 mb15">ข้อมูลผู้ใช้งาน</div>

                  <div className="mb15">
                    <label className="form-label fw600">เลขบัตรประชาชน</label>
                    <input
                      className="form-control"
                      value={form.idNumber}
                      onChange={(e) => setField("idNumber", e.target.value)}
                      disabled={isReadOnly || submitting}
                      placeholder="13 หลัก"
                    />
                    {errors.idNumber && <div className="text-danger fz13 mt5">{errors.idNumber}</div>}
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
                      disabled={isReadOnly || submitting}
                      onPick={(f) => handlePickFile("idFront", f)}
                      onRemove={() => handleRemoveFile("idFront")}
                      hint="เห็นข้อมูลครบ ไม่ปิดบัง"
                    />
                  </div>

                  <div className="col-md-6">
                    <FileCard
                      label="รูปเซลฟี่คู่บัตรประชาชน"
                      file={form.selfie}
                      error={errors.selfie}
                      disabled={isReadOnly || submitting}
                      onPick={(f) => handlePickFile("selfie", f)}
                      onRemove={() => handleRemoveFile("selfie")}
                      hint="เห็นหน้าและบัตรชัดเจน"
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
              {submitting ? (
                <>
                  <i className="far fa-spinner fa-spin me-2" />
                  กำลังทำงาน...
                </>
              ) : isReadOnly ? (
                "ปิด"
              ) : (
                "ยกเลิก"
              )}
            </button>

            {!isReadOnly && (
              <button
                type="button"
                className="ud-btn btn-thm"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="far fa-spinner fa-spin me-2" />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    ส่งเพื่อยืนยันตัวตน
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
