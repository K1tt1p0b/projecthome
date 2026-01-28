"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const THEME_COLOR = "#eb6753";

const ResetPassword = ({ onBackToLogin }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // ใช้เฉพาะ error
  const [loading, setLoading] = useState(false);

  // overlay loader
  const [overlay, setOverlay] = useState({
    open: false,
    text: "กำลังดำเนินการ...",
  });

  const openOverlay = (text = "กำลังดำเนินการ...") =>
    setOverlay({ open: true, text });

  const closeOverlay = () =>
    setOverlay((prev) => ({ ...prev, open: false }));

  const disabled = loading || overlay.open;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.password) {
      newErrors.password = "กรุณากรอกรหัสผ่านใหม่";
    } else if (form.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const routeWithLoading = (path, text = "กำลังพาไปหน้าใหม่...") => {
    openOverlay(text);
    setTimeout(() => {
      router.replace(path);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (disabled) return;

    const isValid = validate();
    if (!isValid) {
      setMessage({
        type: "error",
        text: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการต่อ",
      });
      return;
    }

    setLoading(true);
    openOverlay("กำลังบันทึกรหัสผ่านใหม่...");

    try {
      const payload = {
        password: form.password,
        // token: "TODO_GET_FROM_URL_OR_PROPS"
      };

      console.log("Reset Password Payload:", payload);

      // TODO: ต่อ API จริง
      await new Promise((r) => setTimeout(r, 700));

      // ✅ สำเร็จแล้วพาไปหน้า login ทันที (ไม่โชว์ success message)
      openOverlay("กำลังพาไปหน้าเข้าสู่ระบบ...");
      setTimeout(() => {
        if (typeof onBackToLogin === "function") {
          onBackToLogin(); // modal
          closeOverlay();
        } else {
          router.replace("/login"); // page
        }
      }, 600);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
      closeOverlay();
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (disabled) return;
    routeWithLoading("/login", "กำลังพาไปหน้าเข้าสู่ระบบ...");
  };

  return (
    <>
      {/* Overlay Loader */}
      {overlay.open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(255,255,255,0.85)", zIndex: 9999 }}
        >
          <div className="text-center">
            <div
              className="spinner-border mb15"
              style={{
                width: 48,
                height: 48,
                color: THEME_COLOR,
                borderWidth: 3,
              }}
            />
            <div className="fw600 text-dark">{overlay.text}</div>
          </div>
        </div>
      )}

      <form className="form-style1" onSubmit={handleSubmit}>
        {/* แสดงเฉพาะ error */}
        {message && message.type === "error" && (
          <div className="alert alert-danger mb20">{message.text}</div>
        )}

        <div className="mb20">
          <label className="form-label fw600 dark-color">รหัสผ่านใหม่</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            disabled={disabled}
            placeholder="กรุณากรอกรหัสผ่านใหม่"
          />
          {errors.password && (
            <small className="text-danger d-block mt5">{errors.password}</small>
          )}
        </div>

        <div className="mb20">
          <label className="form-label fw600 dark-color">
            ยืนยันรหัสผ่านใหม่
          </label>
          <input
            name="confirmPassword"
            type="password"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={disabled}
            placeholder="กรุณากรอกยืนยันรหัสผ่านใหม่"
          />
          {errors.confirmPassword && (
            <small className="text-danger d-block mt5">
              {errors.confirmPassword}
            </small>
          )}
        </div>

        <div className="d-grid mb20">
          <button className="ud-btn btn-thm" type="submit" disabled={disabled}>
            {loading ? "กำลังบันทึก..." : "รีเซ็ตรหัสผ่าน"}{" "}
            <i className="fal fa-arrow-right-long" />
          </button>
        </div>

        <p className="dark-color text-center mb0 mt10">
          จำรหัสผ่านได้แล้วใช่ไหม?{" "}
          <button
            type="button"
            className="btn btn-link dark-color fw600 p-0"
            onClick={handleBackClick}
            disabled={disabled}
          >
            กลับไปหน้าเข้าสู่ระบบ
          </button>
        </p>
      </form>
    </>
  );
};

export default ResetPassword;
