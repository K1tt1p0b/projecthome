"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const PersonalInfo = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    taxId: "",
    address: "",
    about: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const requiredFields = [
      { key: "email", label: "อีเมล" },
      { key: "phone", label: "เบอร์โทรศัพท์" },
      { key: "firstName", label: "ชื่อจริง" },
      { key: "lastName", label: "นามสกุล" },
      { key: "taxId", label: "เลขประจำตัวผู้เสียภาษี" },
      { key: "address", label: "ที่อยู่" },
    ];

    for (const field of requiredFields) {
      if (!form[field.key].trim()) {
        toast.error(`กรุณากรอก${field.label}`);
        return false;
      }
    }

    // ตรวจ email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    // ตรวจเบอร์โทร
    const phoneOnlyNumber = form.phone.replace(/\D/g, "");
    if (phoneOnlyNumber.length < 9) {
      toast.error("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return false;
    }

    // ตรวจเลขผู้เสียภาษี
    if (form.taxId.replace(/\D/g, "").length < 10) {
      toast.error("เลขประจำตัวผู้เสียภาษีไม่ถูกต้อง");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

    try {
      setLoading(true);

      // เปลี่ยนเป็น API จริงของคุณภายหลัง
      // await fetch("/api/profile/update", { method: "POST", body: JSON.stringify(form) })

      await new Promise((r) => setTimeout(r, 800)); // mock

      toast.success("อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">

        {/** Email */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">อีเมล</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="ระบุอีเมล"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/** Phone */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              เบอร์โทรศัพท์
            </label>
            <input
              name="phone"
              type="text"
              className="form-control"
              placeholder="ระบุเบอร์โทรศัพท์"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/** First name */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ชื่อจริง
            </label>
            <input
              name="firstName"
              type="text"
              className="form-control"
              value={form.firstName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/** Last name */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              นามสกุล
            </label>
            <input
              name="lastName"
              type="text"
              className="form-control"
              value={form.lastName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>



        {/** Tax ID */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              เลขประจำตัวผู้เสียภาษี
            </label>
            <input
              name="taxId"
              type="text"
              className="form-control"
              value={form.taxId}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/** Address */}
        <div className="col-xl-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ที่อยู่
            </label>
            <input
              name="address"
              type="text"
              className="form-control"
              value={form.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/** About */}
        <div className="col-md-12">
          <div className="mb10">
            <label className="heading-color ff-heading fw600 mb10">
              เกี่ยวกับฉัน
            </label>
            <textarea
              name="about"
              cols={30}
              rows={4}
              className="form-control"
              placeholder="เขียนแนะนำตัวสั้นๆ..."
              value={form.about}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="text-end">
            <button
              type="submit"
              className="ud-btn btn-dark"
              disabled={loading}
            >
              {loading ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfo;
