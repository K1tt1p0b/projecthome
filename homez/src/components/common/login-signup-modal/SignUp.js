"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = ({ onGoLogin }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
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

  const handleSignUp = async (e) => {
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
      const payload = {
        email: form.email,
        password: form.password,
      };

      console.log("Form Data:", payload);

      // TODO: ต่อ API จริง
      setMessage({
        type: "success",
        text: "สร้างบัญชีสำเร็จ (mock)",
      });

      setTimeout(() => {
        router.push("/dashboard-verification");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoLoginClick = () => {
    if (typeof onGoLogin === "function") {
      // ใช้ใน modal → สลับแท็บไปหน้า SignIn
      onGoLogin();
    } else {
      // ใช้ในหน้า /register ปกติ → ไปหน้า /login
      router.push("/login");
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSignUp}>
      {/* Global message */}
      {message && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
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
      <div className="mb20">
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

      {/* Confirm Password */}
      <div className="mb20">
        <label className="form-label fw600 dark-color">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          className="form-control"
          placeholder="Confirm Password"
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
          {loading ? "Creating..." : "Create account"}{" "}
          <i className="fal fa-arrow-right-long" />
        </button>
      </div>

      <p className="dark-color text-center mb0 mt10">
        Already Have an Account?{" "}
        {typeof onGoLogin === "function" ? (
          <button
            type="button"
            className="btn btn-link dark-color fw600 p-0"
            onClick={handleGoLoginClick}
          >
            Login
          </button>
        ) : (
          <Link className="dark-color fw600" href="/login">
            Login
          </Link>
        )}
      </p>
    </form>
  );
};

export default SignUp;
