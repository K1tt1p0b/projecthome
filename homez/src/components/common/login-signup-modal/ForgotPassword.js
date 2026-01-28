"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const THEME_COLOR = "#eb6753";

const ForgotPassword = ({ onBackToLogin }) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: "..." }
  const [loading, setLoading] = useState(false);

  // ✅ overlay loader (กดอะไรก็ขึ้น)
  const [overlay, setOverlay] = useState({
    open: false,
    text: "กำลังดำเนินการ...",
  });

  const openOverlay = (text = "กำลังดำเนินการ...") =>
    setOverlay({ open: true, text });

  const closeOverlay = () =>
    setOverlay((prev) => ({ ...prev, open: false }));

  const disabled = loading || overlay.open;

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const callWithLoading = (fn, text = "กำลังดำเนินการ...") => {
    openOverlay(text);
    setTimeout(() => {
      try {
        fn?.();
      } finally {
        // modal switch ไม่มี route → ปิดเอง
        closeOverlay();
      }
    }, 250);
  };

  const routeWithLoading = (path, text = "กำลังพาไปหน้าใหม่...") => {
    openOverlay(text);
    setTimeout(() => {
      router.push(path);
    }, 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (disabled) return;

    if (!validate()) {
      setMessage({
        type: "error",
        text: "กรุณาตรวจสอบอีเมลให้ถูกต้อง",
      });
      return;
    }

    setLoading(true);
    openOverlay("กำลังส่งลิงก์รีเซ็ตรหัสผ่าน...");

    try {
      const payload = { email };
      console.log("Forgot Password Request:", payload);

      // TODO: ต่อกับ API จริง
      await new Promise((r) => setTimeout(r, 700));

      setMessage({
        type: "success",
        text: "ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว (ตัวอย่าง/mock)",
      });
      setEmail("");

      // ถ้าอยากให้ส่งสำเร็จแล้วพาไป login อัตโนมัติ (เปิดใช้บรรทัดนี้ได้)
      // openOverlay("กำลังพาไปหน้าเข้าสู่ระบบ...");
      // setTimeout(() => router.replace("/login"), 600);
      closeOverlay();
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

    if (typeof onBackToLogin === "function") {
      // modal → สลับแท็บ (มี loading)
      callWithLoading(onBackToLogin, "กำลังกลับไปหน้าเข้าสู่ระบบ...");
    } else {
      // page → ไป /login (มี loading)
      routeWithLoading("/login", "กำลังพาไปหน้าเข้าสู่ระบบ...");
    }
  };

  return (
    <>
      {/* ===== Overlay Loader (spinner ส้ม / ข้อความดำ) ===== */}
      {overlay.open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(255,255,255,0.85)",
            zIndex: 9999,
          }}
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
        {/* แจ้งเตือน */}
        {message && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            } mb20`}
          >
            {message.text}
          </div>
        )}

        {/* Email */}
        <div className="mb25">
          <label className="form-label fw600 dark-color">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="กรุณากรอกอีเมลของคุณ"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ email: "" });
              setMessage(null);
            }}
            required
            disabled={disabled}
          />
          {errors.email && (
            <small className="text-danger d-block mt5">{errors.email}</small>
          )}
        </div>

        {/* ปุ่มส่ง */}
        <div className="d-grid mb20">
          <button className="ud-btn btn-thm" type="submit" disabled={disabled}>
            {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}{" "}
            <i className="fal fa-arrow-right-long" />
          </button>
        </div>

        {/* Back to login */}
        <p className="dark-color text-center mb0 mt10">
          คุณจำรหัสผ่านได้แล้วใช่ไหม?{" "}
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

export default ForgotPassword;
