"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const THEME_COLOR = "#eb6753";

const SignUp = ({ onGoLogin }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setMessage(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstname) {
      newErrors.firstname = "กรุณากรอกชื่อ";
    }

    if (!form.lastname) {
      newErrors.lastname = "กรุณากรอกนามสกุล";
    }

    if (!form.phoneNumber) {
      newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (String(form.phoneNumber).trim().length < 10) {
      newErrors.phoneNumber = "เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 ตัวอักษร";
    }

    if (!form.email) {
      newErrors.email = "กรุณากรอกอีเมล";
    }

    if (!form.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
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

  // ✅ ใช้ตอนเปลี่ยนหน้า (page ปกติ)
  const routeWithLoading = (path, text = "กำลังพาไปหน้าใหม่...") => {
    openOverlay(text);
    setTimeout(() => {
      router.push(path);
    }, 250);
  };

  // ✅ ใช้ตอนสลับแท็บใน modal (ไม่มี route)
  const callWithLoading = (fn, text = "กำลังดำเนินการ...") => {
    openOverlay(text);
    setTimeout(() => {
      try {
        fn?.();
      } finally {
        closeOverlay();
      }
    }, 250);
  };

  const handleGoLoginClick = () => {
    if (typeof onGoLogin === "function") {
      // modal → สลับแท็บไปหน้า SignIn (แต่ก็ให้มี loading)
      callWithLoading(onGoLogin, "กำลังเปิดหน้าเข้าสู่ระบบ...");
    } else {
      // /register ปกติ → ไป /login (มี loading)
      routeWithLoading("/login", "กำลังพาไปหน้าเข้าสู่ระบบ...");
    }
  };

  const handleSignUp = async (e) => {
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
    openOverlay("กำลังสร้างบัญชี...");

    try {
      const payload = {
        firstname: form.firstname,
        lastname: form.lastname,
        phoneNumber: form.phoneNumber,
        email: form.email,
        password: form.password,
      };

      console.log("Form Data:", payload);

      // TODO: ต่อ API จริง
      await new Promise((r) => setTimeout(r, 700));

      setMessage({
        type: "success",
        text: "สร้างบัญชีสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...",
      });

      openOverlay("กำลังพาไปหน้าเข้าสู่ระบบ...");

      setTimeout(() => {
        if (typeof onGoLogin === "function") {
          onGoLogin(); // modal -> สลับแท็บ
          closeOverlay();
        } else {
          router.replace("/login"); // page -> ไป /login
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

      <form className="form-style1" onSubmit={handleSignUp}>
        {/* Global message */}
        {message && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            } mb20`}
          >
            {message.text}
          </div>
        )}

        {/* First Name */}
        <div className="mb25">
          <label className="form-label fw600 dark-color">ชื่อ</label>
          <input
            name="firstname"
            type="text"
            className="form-control"
            placeholder="กรุณากรอกชื่อ"
            value={form.firstname}
            onChange={handleChange}
            required
            disabled={disabled}
          />
          {errors.firstname && (
            <small className="text-danger d-block mt5">{errors.firstname}</small>
          )}
        </div>

        {/* Last Name */}
        <div className="mb20">
          <label className="form-label fw600 dark-color">นามสกุล</label>
          <input
            name="lastname"
            type="text"
            className="form-control"
            placeholder="กรุณากรอกนามสกุล"
            value={form.lastname}
            onChange={handleChange}
            required
            disabled={disabled}
          />
          {errors.lastname && (
            <small className="text-danger d-block mt5">{errors.lastname}</small>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb20">
          <label className="form-label fw600 dark-color">เบอร์โทรศัพท์</label>
          <input
            name="phoneNumber"
            type="text"
            className="form-control"
            placeholder="กรุณากรอกเบอร์โทรศัพท์"
            value={form.phoneNumber}
            onChange={handleChange}
            required
            disabled={disabled}
          />
          {errors.phoneNumber && (
            <small className="text-danger d-block mt5">
              {errors.phoneNumber}
            </small>
          )}
        </div>

        {/* Email */}
        <div className="mb25">
          <label className="form-label fw600 dark-color">อีเมล</label>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="กรุณากรอกอีเมล"
            value={form.email}
            onChange={handleChange}
            required
            disabled={disabled}
          />
          {errors.email && (
            <small className="text-danger d-block mt5">{errors.email}</small>
          )}
        </div>

        {/* Password */}
        <div className="mb20">
          <label className="form-label fw600 dark-color">รหัสผ่าน</label>
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="กรุณากรอกรหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            required
            disabled={disabled}
          />
          {errors.password && (
            <small className="text-danger d-block mt5">{errors.password}</small>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb20">
          <label className="form-label fw600 dark-color">ยืนยันรหัสผ่าน</label>
          <input
            name="confirmPassword"
            type="password"
            className="form-control"
            placeholder="ยืนยันรหัสผ่าน"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            disabled={disabled}
          />
          {errors.confirmPassword && (
            <small className="text-danger d-block mt5">
              {errors.confirmPassword}
            </small>
          )}
        </div>

        {/* Submit Button */}
        <div className="d-grid mb20">
          <button className="ud-btn btn-thm" type="submit" disabled={disabled}>
            {loading ? "กำลังสร้าง..." : "สร้างบัญชี"}{" "}
            <i className="fal fa-arrow-right-long" />
          </button>
        </div>

        <p className="dark-color text-center mb0 mt10">
          คุณมีบัญชีอยู่แล้ว?{" "}
          {typeof onGoLogin === "function" ? (
            <button
              type="button"
              className="btn btn-link dark-color fw600 p-0"
              onClick={handleGoLoginClick}
              disabled={disabled}
            >
              เข้าสู่ระบบ
            </button>
          ) : (
            // ✅ เพื่อให้ “กดแล้วมี loading” เหมือนกัน → ใช้ปุ่มเรียก handler
            <button
              type="button"
              className="btn btn-link dark-color fw600 p-0"
              onClick={handleGoLoginClick}
              disabled={disabled}
            >
              เข้าสู่ระบบ
            </button>
          )}
        </p>
      </form>
    </>
  );
};

export default SignUp;
