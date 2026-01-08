"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

const ProfilePersonalAndSocialForm = () => {
  const [form, setForm] = useState({
    // ===== Personal =====
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    taxId: "",
    address: "",
    about: "",

    // ===== Social =====
    facebook: "",
    line: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(false);

  const requiredFields = useMemo(
    () => [
      { key: "email", label: "อีเมล" },
      { key: "phone", label: "เบอร์โทรศัพท์" },
      { key: "firstName", label: "ชื่อจริง" },
      { key: "lastName", label: "นามสกุล" },
      { key: "taxId", label: "เลขบัตรประจำตัวประชาชน" },
      { key: "address", label: "ที่อยู่" },
    ],
    []
  );

  const socialFields = useMemo(
    () => [
      { name: "facebook", label: "Facebook Url" },
      { name: "line", label: "Line ID" },
      { name: "instagram", label: "Instagram Url" },
      { name: "tiktok", label: "Tiktok Url" },
      { name: "linkedin", label: "Linkedin Url" },
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeUrl = (value) => {
    const v = (value ?? "").trim();
    if (!v) return "";
    return v.startsWith("http") ? v : `https://${v}`;
  };

  const isValidUrl = (value) => {
    const v = (value ?? "").trim();
    if (!v) return true; // ✅ ว่าง = ผ่าน (เพราะตรวจเฉพาะช่องที่กรอก)
    try {
      new URL(normalizeUrl(v));
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    // ===== Required (Personal) =====
    for (const field of requiredFields) {
      if (!String(form[field.key] ?? "").trim()) {
        toast.error(`กรุณากรอก${field.label}`);
        return false;
      }
    }

    // ===== Email format =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    // ===== Phone (min 9 digits) =====
    const phoneOnlyNumber = String(form.phone).replace(/\D/g, "");
    if (phoneOnlyNumber.length < 9) {
      toast.error("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return false;
    }

    // ===== Tax ID (บัตรประชาชนไทย = 13 หลัก) =====
    const taxOnlyNumber = String(form.taxId).replace(/\D/g, "");
    if (taxOnlyNumber.length !== 13) {
      toast.error("เลขบัตรประจำตัวประชาชนไม่ถูกต้อง (ต้องเป็น 13 หลัก)");
      return false;
    }

    // ===== Social URL validation (เฉพาะที่กรอก) =====
    // line เป็น ID ไม่จำเป็นต้องเป็น URL -> ข้ามการตรวจ URL
    for (const f of socialFields) {
      const value = String(form[f.name] ?? "").trim();
      if (!value) continue;

      if (f.name === "line") continue; // ✅ Line ID ไม่ตรวจ url

      if (!isValidUrl(value)) {
        toast.error(`${f.label} ไม่ถูกต้อง`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

    try {
      setLoading(true);

      // ✅ ทำ payload ให้ URL ที่ผู้ใช้กรอกมี https:// ให้เรียบร้อย
      const payload = {
        // personal
        email: form.email.trim(),
        phone: form.phone.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        taxId: form.taxId.trim(),
        address: form.address.trim(),
        about: form.about.trim(),

        // social
        facebook: form.facebook ? normalizeUrl(form.facebook) : "",
        line: form.line.trim(),
        instagram: form.instagram ? normalizeUrl(form.instagram) : "",
        tiktok: form.tiktok ? normalizeUrl(form.tiktok) : "",
        linkedin: form.linkedin ? normalizeUrl(form.linkedin) : "",
      };

      // 🔁 ต่อ API จริงภายหลัง (ปุ่มเดียว)
      // await fetch("/api/profile/update-all", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      await new Promise((r) => setTimeout(r, 800)); // mock

      toast.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        {/* ===== Personal ===== */}
        <div className="col-12">
          <h6 className="ff-heading fw700 mb20">ข้อมูลส่วนตัว</h6>
        </div>

        {/* Email */}
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

        {/* Phone */}
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

        {/* First name */}
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

        {/* Last name */}
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

        {/* Tax ID */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              เลขบัตรประจำตัวประชาชน
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

        {/* Address */}
        <div className="col-xl-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ที่อยู่</label>
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

        {/* About */}
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

        {/* ===== Social ===== */}
        <div className="col-12">
          <hr className="my30" />
          <h6 className="ff-heading fw700 mb20">ข้อมูลโซเชียล</h6>
        </div>

        {socialFields.map((item) => (
          <div className="col-sm-6 col-xl-4" key={item.name}>
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                {item.label}
              </label>
              <input
                type="text"
                name={item.name}
                className="form-control"
                placeholder={item.label}
                value={form[item.name]}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
        ))}

        {/* ===== Single Submit Button ===== */}
        <div className="col-md-12">
          <div className="text-end">
            <button type="submit" className="ud-btn btn-dark" disabled={loading}>
              {loading ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfilePersonalAndSocialForm;
