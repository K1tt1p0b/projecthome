"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const SocialField = () => {
  const [form, setForm] = useState({
    facebook: "",
    pinterest: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    //  ตรวจเฉพาะช่องที่ผู้ใช้กรอก
    for (const [key, value] of Object.entries(form)) {
      if (value.trim() && !isValidUrl(value)) {
        toast.error(`${key} Url ไม่ถูกต้อง`);
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

      const payload = {
        ...form,
        website: form.website
          ? form.website.startsWith("http")
            ? form.website
            : `https://${form.website}`
          : "",
      };

      //  ต่อ API จริงภายหลัง
      // await fetch("/api/profile/social", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      await new Promise((r) => setTimeout(r, 700));

      toast.success("อัปเดตข้อมูลโซเชียลเรียบร้อยแล้ว");
    } catch {
      toast.error("อัปเดตข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        {[
          { name: "facebook", label: "Facebook Url" },
          { name: "line", label: "Line ID" },
          { name: "instagram", label: "Instagram Url" },
          { name: "tiktok", label: "Tiktok Url" },
          { name: "linkedin", label: "Linkedin Url" },
        ].map((item) => (
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

        <div className="col-md-12">
          <div className="text-end">
            <button
              type="submit"
              className="ud-btn btn-dark"
              disabled={loading}
            >
              {loading ? "กำลังอัปเดต..." : "อัปเดตข้อมูลโซเชียล"}
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SocialField;
