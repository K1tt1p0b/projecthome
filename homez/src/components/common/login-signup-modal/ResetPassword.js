"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ResetPassword = ({ onBackToLogin }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: "..." }
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const isValid = validate();
    if (!isValid) {
      setMessage({
        type: "error",
        text: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการต่อ",
      });
      return;
    }

    setLoading(true);

    try {
      // ตรงนี้อนาคตจะมี token จากลิงก์ที่ส่งไปในเมล เช่น ?token=xxxx
      // ตอนนี้ mock ไว้ก่อน
      const payload = {
        password: form.password,
        // token: "TODO_GET_FROM_URL_OR_PROPS"
      };

      console.log("Reset Password Payload:", payload);

      // TODO: ตรงนี้เอาไปต่อกับ API จริง เช่น:
      // const res = await fetch("https://your-backend/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // const data = await res.json();
      // if (!res.ok) {
      //   throw new Error(data.message || "ไม่สามารถตั้งรหัสผ่านใหม่ได้");
      // }

      setMessage({
        type: "success",
        text: "ตั้งรหัสผ่านใหม่สำเร็จแล้ว (mock) คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้เลย",
      });

      setForm({
        password: "",
        confirmPassword: "",
      });
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
      // ใช้ใน modal → สลับแท็บกลับไปหน้า Login
      onBackToLogin();
    } else {
      // ใช้ในหน้าเต็ม → เด้งไปหน้า /login
      router.push("/login");
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
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

      {/* New Password */}
      <div className="mb20">
        <label className="form-label fw600 dark-color">New Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
          placeholder="Enter new password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {errors.password && (
          <small className="text-danger d-block mt5">{errors.password}</small>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="mb20">
        <label className="form-label fw600 dark-color">
          Confirm New Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          className="form-control"
          placeholder="Confirm new password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && (
          <small className="text-danger d-block mt5">
            {errors.confirmPassword}
          </small>
        )}
      </div>

      {/* Submit Button */}
      <div className="d-grid mb20">
        <button className="ud-btn btn-thm" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Reset Password"}{" "}
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

export default ResetPassword;
