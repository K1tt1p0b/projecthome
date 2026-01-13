"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import agents from "@/data/agents";

const AboutMe = () => {
  // 1. เก็บข้อมูลต้นฉบับไว้ในตัวแปร (เพื่อใช้ตอนกด Reset)
  const originalData = (agents && agents.length > 0) ? agents[0] : {};

  // 2. State สำหรับ Form
  const [formData, setFormData] = useState({
    name: originalData.name || "",
    position: originalData.category || "",
    city: originalData.city || "",
    desc: originalData.desc || "",
    mobile: originalData.mobile || "",
    email: originalData.email || "",
    lineId: "@agent_line",
    experience: "5",
    closedSales: "50+"
  });

  const [imagePreview, setImagePreview] = useState(
    originalData.img || originalData.image || "/images/team/agent-1.jpg"
  );

  const [isSaving, setIsSaving] = useState(false);

  // --- ฟังก์ชันต่างๆ ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("รูปภาพต้องขนาดไม่เกิน 2MB");
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  // ✅ ฟังก์ชันปุ่ม "ยกเลิก" (Reset ค่ากลับเป็นเดิม)
  const handleCancel = () => {
    // คืนค่า Form เป็นค่าเริ่มต้น
    setFormData({
      name: originalData.name || "",
      position: originalData.category || "",
      city: originalData.city || "",
      desc: originalData.desc || "",
      mobile: originalData.mobile || "",
      email: originalData.email || "",
      lineId: "@agent_line",
      experience: "5",
      closedSales: "50+"
    });
    // คืนค่ารูปภาพ
    setImagePreview(originalData.img || originalData.image || "/images/team/agent-1.jpg");

    toast.info("คืนค่าข้อมูลเดิมแล้ว");
  };

  // ✅ ฟังก์ชันปุ่ม "ดูตัวอย่าง" (เปิดหน้าใหม่)
  const handlePreview = () => {
    // สมมติว่าหน้า Agent Single คือ /agent-single/1
    window.open('/agent-single/1', '_blank');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    toast.success("บันทึกข้อมูลเรียบร้อยแล้ว!");
  };

  return (
    <form onSubmit={handleSave} className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h4 className="title fz17 mb-0">แก้ไขข้อมูลส่วนตัว</h4>
      </div>

      <div className="row">
        {/* ... (ส่วนรูปโปรไฟล์เหมือนเดิม) ... */}
        <div className="col-xl-3 col-lg-4 text-center mb-4 mb-lg-0 border-end-lg">
          <div className="position-relative d-inline-block">
            <div
              className="rounded-circle overflow-hidden border border-3 border-light shadow-sm"
              style={{ width: '160px', height: '160px', position: 'relative' }}
            >
              <Image
                src={imagePreview}
                alt="Profile"
                fill
                className="object-fit-cover"
              />
            </div>
            <label
              htmlFor="profile-upload"
              className="position-absolute bottom-0 end-0 bg-white border rounded-circle shadow-sm p-2 cursor-pointer hover-scale"
              style={{ transform: 'translate(10%, -10%)' }}
            >
              <i className="fas fa-camera text-dark fz16"></i>
              <input id="profile-upload" type="file" hidden accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <div className="mt-3 text-muted fz12">แนะนำรูปสี่เหลี่ยมจัตุรัส <br /> (JPG, PNG ไม่เกิน 2MB)</div>
        </div>

        {/* ... (ส่วน Form Inputs เหมือนเดิม) ... */}
        <div className="col-xl-9 col-lg-8">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw600 fz14">ชื่อ-นามสกุล</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw600 fz14">ตำแหน่ง / อาชีพ</label>
              <input type="text" className="form-control" name="position" value={formData.position} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label fw600 fz14">พื้นที่ให้บริการ</label>
              <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label fw600 fz14">เกี่ยวกับฉัน (Bio)</label>
              <textarea className="form-control" rows="4" name="desc" value={formData.desc} onChange={handleChange}></textarea>
            </div>

            <div className="col-12 mt-2"><hr className="opacity-50" /><h5 className="title fz15 mb-3">ข้อมูลการติดต่อ</h5></div>

            <div className="col-md-6">
              <label className="form-label fw600 fz14">เบอร์โทรศัพท์</label>
              <input type="tel" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw600 fz14">อีเมล</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw600 fz14">Line ID</label>
              <input type="text" className="form-control" name="lineId" value={formData.lineId} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw600 fz14">ประสบการณ์ (ปี)</label>
              <input type="text" className="form-control text-center" name="experience" value={formData.experience} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw600 fz14">ปิดการขาย</label>
              <input type="text" className="form-control text-center" name="closedSales" value={formData.closedSales} onChange={handleChange} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row mt-4 pt-3 border-top">
            <div className="col-12 text-end">
              <button type="button" className="btn btn-light border me-2">ยกเลิก</button>
              <button
                type="submit"
                className="btn btn-light border me-2"
                disabled={isSaving}
              >
                {isSaving ? <><i className="fas fa-spinner fa-spin me-2"></i> กำลังบันทึก...</> : 'บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          </div>

        </div>
      </div>

    </form>
  );
};

export default AboutMe;