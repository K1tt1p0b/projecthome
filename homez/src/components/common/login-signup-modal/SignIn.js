"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const THEME_COLOR = "#eb6753";

const SignIn = ({ onForgotPassword, onGoRegister }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [overlay, setOverlay] = useState({
    open: false,
    text: "กำลังดำเนินการ...",
  });

  const openOverlay = (text) =>
    setOverlay({ open: true, text: text || "กำลังดำเนินการ..." });

  const closeOverlay = () =>
    setOverlay((prev) => ({ ...prev, open: false }));

  const disabled = loading || overlay.open;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!form.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const routeWithLoading = (path, text) => {
    openOverlay(text);
    setTimeout(() => router.push(path), 250);
  };

  const callWithLoading = (fn, text) => {
    openOverlay(text);
    setTimeout(() => {
      fn?.();
      closeOverlay();
    }, 250);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (disabled) return;

    if (!validate()) {
      setMessage({ type: "error", text: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง" });
      return;
    }

    setLoading(true);
    openOverlay("กำลังเข้าสู่ระบบ...");

    try {
      await new Promise((r) => setTimeout(r, 600));
      openOverlay("กำลังพาไปหน้า Dashboard...");
      setTimeout(() => router.replace("/dashboard-verification"), 600);
    } catch {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาด" });
      closeOverlay();
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay Loader */}
      {overlay.open && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
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

      <form className="form-style1" onSubmit={handleSignIn}>
        {message && (
          <div className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"} mb20`}>
            {message.text}
          </div>
        )}

        <div className="mb25">
          <label className="form-label fw600">อีเมล</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            disabled={disabled}
            placeholder="กรุณากรอกอีเมลของคุณ"
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        <div className="mb15">
          <label className="form-label fw600">รหัสผ่าน</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            disabled={disabled}
            placeholder="กรุณากรอกรหัสผ่านของคุณ"
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}
        </div>

        <div className="checkbox-style1 d-flex justify-content-between mb10">
          <label className="custom_checkbox">
            จำรหัสผ่าน
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              disabled={disabled}
            />
            <span className="checkmark" />
          </label>

          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              typeof onForgotPassword === "function"
                ? callWithLoading(onForgotPassword, "กำลังเปิดหน้าลืมรหัสผ่าน...")
                : routeWithLoading("/forgot-password", "กำลังพาไปหน้าลืมรหัสผ่าน...")
            }
            disabled={disabled}
          >
            ลืมรหัสผ่าน?
          </button>
        </div>

        <div className="d-grid mb20">
          <button className="ud-btn btn-thm" type="submit" disabled={disabled}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>

        <p className="text-center">
          ยังไม่ได้เป็นสมาชิก?{" "}
          <button
            type="button"
            className="btn btn-link p-0 fw600"
            onClick={() =>
              typeof onGoRegister === "function"
                ? callWithLoading(onGoRegister, "กำลังเปิดหน้าสมัครสมาชิก...")
                : routeWithLoading("/register", "กำลังพาไปหน้าสมัครสมาชิก...")
            }
            disabled={disabled}
          >
            สร้างบัญชี
          </button>
        </p>
      </form>
    </>
  );
};

export default SignIn;
