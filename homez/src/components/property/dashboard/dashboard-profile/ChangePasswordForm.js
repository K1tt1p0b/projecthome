"use client";

import React, { useState } from "react";
import { toast } from "react-toastify"; // ✅ ใช้ Toast แจ้งเตือน

const ChangePasswordForm = () => {
  // 1. สร้าง State เก็บค่า
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ฟังก์ชันอัปเดตค่าเมื่อพิมพ์
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันกดส่ง
  const handleSubmit = (e) => {
    e.preventDefault(); // กันหน้าเว็บรีโหลด

    // 2. เช็คว่ากรอกครบไหม (Validation)
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.warn("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // 3. เช็คว่ารหัสใหม่ ตรงกับ ยืนยันไหม
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    // 4. (Optional) เช็คว่ารหัสใหม่ซ้ำกับรหัสเก่าไหม
    if (formData.newPassword === formData.currentPassword) {
      toast.warn("รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม");
      return;
    }

    // --- ผ่านทุกเงื่อนไข ---
    console.log("Submit Payload:", formData);
    // TODO: เรียก API เปลี่ยนรหัสตรงนี้
    toast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!");
    
    // ล้างค่าในฟอร์ม
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        
        {/* รหัสผ่านเก่า */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านเก่า <span className="text-danger">*</span>
            </label>
            <input
              type="password" // ✅ ต้องเป็น password
              name="currentPassword"
              className="form-control"
              placeholder="ระบุรหัสผ่านเดิม"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="row">
        {/* รหัสผ่านใหม่ */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รหัสผ่านใหม่ <span className="text-danger">*</span>
            </label>
            <input
              type="password" // ✅ ต้องเป็น password
              name="newPassword"
              className="form-control"
              placeholder="ระบุรหัสผ่านใหม่"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ยืนยันรหัสผ่านใหม่ */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ยืนยันรหัสผ่านใหม่ <span className="text-danger">*</span>
            </label>
            <input
              type="password" // ✅ ต้องเป็น password
              name="confirmPassword"
              className="form-control"
              placeholder="ระบุรหัสผ่านใหม่ อีกครั้ง"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="text-end">
            {/* ปุ่มเปลี่ยนเป็น type="submit" เพื่อให้ Form ทำงาน */}
            <button type="submit" className="ud-btn btn-dark">
              เปลี่ยนรหัสผ่าน
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;