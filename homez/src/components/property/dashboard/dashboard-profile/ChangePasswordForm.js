"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const oldPassword = form.oldPassword.trim();
    const newPassword = form.newPassword.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!oldPassword) {
      toast.error("กรุณากรอกรหัสผ่านเก่า");
      return false;
    }
    if (!newPassword) {
      toast.error("กรุณากรอกรหัสผ่านใหม่");
      return false;
    }
    if (newPassword.length < 8) {
      toast.error("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
      return false;
    }
    if (!confirmPassword) {
      toast.error("กรุณายืนยันรหัสผ่านใหม่");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return false;
    }
    if (oldPassword === newPassword) {
      toast.error("รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเก่า");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const ok = validate();
    if (!ok) return;

    try {
      setLoading(true);

      // ตรงนี้ให้เปลี่ยนเป็น API จริงของคุณ
      // ตัวอย่าง:
      // await fetch("/api/change-password", { method:"POST", body: JSON.stringify({ ... }) })

      await new Promise((r) => setTimeout(r, 900)); // mock delay

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านเก่า
            </label>
            <input
              name="oldPassword"
              type="password"
              className="form-control"
              placeholder="รหัสผ่านเก่า"
              value={form.oldPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านใหม่
            </label>
            <input
              name="newPassword"
              type="password"
              className="form-control"
              placeholder="รหัสผ่านใหม่"
              value={form.newPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              name="confirmPassword"
              type="password"
              className="form-control"
              placeholder="ยืนยันรหัสผ่านใหม่"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="text-end">
            <button
              type="submit"
              className="ud-btn btn-dark"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
