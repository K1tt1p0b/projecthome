"use client";

import { useState } from "react";
import Link from "next/link";

const SignIn = ({ onForgotPassword }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setMessage(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "กรุณากรอกอีเมล";
    }

    if (!form.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (form.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage(null);

    const isValid = validate();
    if (!isValid) {
      setMessage({
        type: "error",
        text: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนเข้าสู่ระบบ",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: form.email,
        password: form.password,
        remember: form.remember,
      };

      console.log("Login Data:", payload);

      // TODO: ต่อ API จริง
      setMessage({
        type: "success",
        text: "เข้าสู่ระบบสำเร็จ (mock)",
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

  return (
    <form className="form-style1" onSubmit={handleSignIn}>
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
          name="email"
          type="email"
          className="form-control"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && (
          <small className="text-danger d-block mt5">{errors.email}</small>
        )}
      </div>

      {/* Password */}
      <div className="mb15">
        <label className="form-label fw600 dark-color">Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {errors.password && (
          <small className="text-danger d-block mt5">{errors.password}</small>
        )}
      </div>

      {/* Remember + Forgot */}
      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        <label className="custom_checkbox fz14 ff-heading">
          Remember me
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          <span className="checkmark" />
        </label>

        <button
          type="button"
          className="btn btn-link fz14 ff-heading p-0"
          onClick={onForgotPassword}
        >
          Lost your password?
        </button>
      </div>

      {/* Submit */}
      <div className="d-grid mb20">
        <button className="ud-btn btn-thm" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}{" "}
          <i className="fal fa-arrow-right-long" />
        </button>
      </div>

      <p className="dark-color text-center mb0 mt10">
        Not signed up?{" "}
        <Link className="dark-color fw600" href="/register">
          Create an account.
        </Link>
      </p>
    </form>
  );
};

export default SignIn;
