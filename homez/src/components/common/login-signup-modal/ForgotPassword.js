"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPassword = ({ onBackToLogin }) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: "..." }
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) {
      setMessage({
        type: "error",
        text: "กรุณาตรวจสอบอีเมลให้ถูกต้อง",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = { email };
      console.log("Forgot Password Request:", payload);

      // TODO: ต่อกับ API จริง
      setMessage({
        type: "success",
        text: "ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว (ตัวอย่าง/mock)",
      });
      setEmail("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (typeof onBackToLogin === "function") {
      // กรณีอยู่ใน modal → สลับแท็บ
      onBackToLogin();
    } else {
      // กรณีอยู่ในหน้า /forgot-password → เด้งไป /login
      router.push("/login");
    }
  };

  return (
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
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors({ email: "" });
            setMessage(null);
          }}
          required
        />
        {errors.email && (
          <small className="text-danger d-block mt5">{errors.email}</small>
        )}
      </div>

      {/* ปุ่มส่ง */}
      <div className="d-grid mb20">
        <button className="ud-btn btn-thm" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}{" "}
          <i className="fal fa-arrow-right-long" />
        </button>
      </div>

      {/* Back to login */}
      <p className="dark-color text-center mb0 mt10">
        Remembered your password?{" "}
        <button
          type="button"
          className="btn btn-link dark-color fw600 p-0"
          onClick={handleBackClick}
        >
          Back to login
        </button>
      </p>
    </form>
  );
};

export default ForgotPassword;
