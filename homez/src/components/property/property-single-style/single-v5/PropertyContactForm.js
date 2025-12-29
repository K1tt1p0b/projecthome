"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const PropertyContactForm = ({ propertyId }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      toast.error("กรุณากรอกชื่อและเบอร์โทร");
      return;
    }

    try {
      setLoading(true);

      // 🔧 ตรงนี้ในอนาคตเปลี่ยนเป็น API จริงได้
      await new Promise((r) => setTimeout(r, 800));

      toast.success("ส่งข้อความถึงผู้ประกาศเรียบร้อย");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-widget contact-form-widget mb30">
      <h4 className="title mb20">ติดต่อผู้ประกาศ</h4>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="mb15">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="ชื่อของคุณ"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb15">
          <input
            type="tel"
            name="phone"
            className="form-control"
            placeholder="เบอร์โทรศัพท์"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb15">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="อีเมล (ไม่จำเป็น)"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb15">
          <textarea
            name="message"
            rows="4"
            className="form-control"
            placeholder="ข้อความถึงผู้ประกาศ"
            value={form.message}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="ud-btn btn-thm w-100"
          disabled={loading}
        >
          {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
        </button>
      </form>
    </div>
  );
};

export default PropertyContactForm;
