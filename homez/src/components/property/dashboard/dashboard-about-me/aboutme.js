"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import agents from "@/data/agents";

// ✅ Rich Text Editor
import RichTextEditor from "@/components/common/RichTextEditor";

const AboutMe = () => {
  // 1) ข้อมูลต้นฉบับ
  const originalData = agents && agents.length > 0 ? agents[0] : {};

  // 2) State สำหรับ Form
  // ✅ ล็อคทุกอย่าง ยกเว้น desc (Bio)
  const [formData, setFormData] = useState({
    name: originalData.name || "",
    position: originalData.category || "",
    city: originalData.city || "",

    // ✅ แก้ไม่ได้ แต่ยังโชว์
    mobile: originalData.mobile || "",
    email: originalData.email || "",
    lineId: "@agent_line",

    // ✅ ถ้าไม่ได้ใช้จะเก็บไว้เฉยๆ
    experience: "5",
    closedSales: "50+",

    // ✅ แก้ได้ตัวเดียว
    desc: originalData.desc || "",
  });

  const imagePreview =
    originalData.img || originalData.image || "/images/team/agent-1.jpg";

  const [isSaving, setIsSaving] = useState(false);

  // ✅ อัปเดตจาก Rich Text Editor (เฉพาะ Bio)
  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, desc: content }));
  };

  // ✅ ยกเลิก: คืนค่าเฉพาะ Bio
  const handleCancel = () => {
    setFormData((prev) => ({ ...prev, desc: originalData.desc || "" }));
    toast.info("คืนค่า Bio เดิมแล้ว");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // ✅ เซฟเฉพาะ Bio (HTML)
    console.log("Saving Bio:", formData.desc);

    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);
    toast.success("บันทึก Bio เรียบร้อยแล้ว!");
  };

  return (
    <form
      onSubmit={handleSave}
      className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative"
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h4 className="title fz17 mb-0">แก้ไขข้อมูลส่วนตัว</h4>
      </div>

      <div className="row">
        {/* ✅ รูปโปรไฟล์ (แก้ไม่ได้) */}
        <div className="col-xl-3 col-lg-4 text-center mb-4 mb-lg-0 border-end-lg">
          <div className="position-relative d-inline-block">
            <div
              className="rounded-circle overflow-hidden border border-3 border-light shadow-sm"
              style={{ width: "160px", height: "160px", position: "relative" }}
              title="รูปโปรไฟล์ถูกล็อค (แก้ไขจากหน้าอื่น)"
            >
              <Image
                src={imagePreview}
                alt="Profile"
                fill
                className="object-fit-cover"
                priority
              />
            </div>
          </div>

          <div className="mt-3 text-muted fz12">
            รูปโปรไฟล์ถูกล็อค (แก้ไขจากหน้าอื่น)
          </div>
        </div>

        {/* Form Inputs */}
        <div className="col-xl-9 col-lg-8">
          <div className="row g-3">
            {/* ✅ ชื่อ-นามสกุล (แก้ไม่ได้) */}
            <div className="col-md-12">
              <label className="form-label fw600 fz14">ชื่อ-นามสกุล</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                readOnly
                disabled
                title="ข้อมูลนี้ดึงมาจากหน้าอื่น (แก้ไขไม่ได้ที่นี่)"
              />
            </div>

            {/* ✅ พื้นที่ให้บริการ (แก้ไม่ได้) */}
            <div className="col-md-12">
              <label className="form-label fw600 fz14">พื้นที่ให้บริการ</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                readOnly
                disabled
                title="ข้อมูลนี้ดึงมาจากหน้าอื่น (แก้ไขไม่ได้ที่นี่)"
              />
            </div>

            {/* ✅ แก้ได้: Bio */}
            <div className="col-12">
              <label className="form-label fw600 fz14">เกี่ยวกับฉัน (Bio)</label>
              <RichTextEditor
                value={formData.desc}
                onChange={handleEditorChange}
                placeholder="แนะนำตัวของคุณ ประสบการณ์ทำงาน หรือทักษะพิเศษ..."
              />
            </div>

            <div className="col-12 mt-2">
              <hr className="opacity-50" />
              <h5 className="title fz15 mb-3">ข้อมูลการติดต่อ</h5>
              <div className="text-muted fz12">
                ข้อมูลการติดต่อถูกล็อค (แก้ไขจากหน้าอื่น)
              </div>
            </div>

            {/* ✅ ข้อมูลการติดต่อ (แก้ไม่ได้ทั้งหมด) */}
            <div className="col-md-6">
              <label className="form-label fw600 fz14">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                readOnly
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw600 fz14">อีเมล</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                readOnly
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw600 fz14">Line ID</label>
              <input
                type="text"
                className="form-control"
                name="lineId"
                value={formData.lineId}
                readOnly
                disabled
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row mt-4 pt-3 border-top">
            <div className="col-12 text-end">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-light border me-2"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                className="btn btn-light border me-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i> กำลังบันทึก...
                  </>
                ) : (
                  "บันทึกการเปลี่ยนแปลง"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AboutMe;
