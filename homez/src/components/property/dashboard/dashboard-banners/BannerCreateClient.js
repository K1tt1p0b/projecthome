"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // ✅ เพิ่ม usePathname
import { toast } from "react-toastify";
import { addBanner } from "./storage";
import s from "./banner-create.module.css";

// IMPORT ข้อมูล Mock Data
import { propertyData } from "@/data/propertyData";
import { constructionServices } from "@/components/services/ConstructionRequest"; 
import { allCourses } from "@/components/services/CourseLanding"; 

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function BannerCreateClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // ✅ ดึง URL ปัจจุบันมาเช็ค
  const fileRef = useRef(null);

  // ✅ แก้ Logic: เช็คว่าคำว่า "edit" อยู่ใน URL หรือไม่
  // ถ้าอยู่ที่หน้า /new แม้จะมี ?id=... ก็ถือว่าไม่ใช่โหมดแก้ไข
  const isEditMode = pathname.includes("/edit");

  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [form, setForm] = useState({
    title: "",
    position: "หน้าแรก",
    status: "pending", // ค่า Default สำหรับสร้างใหม่
    linkUrl: "/",
    startAt: "",
    endAt: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Logic ดึงข้อมูลอัตโนมัติ
  useEffect(() => {
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (id && type) {
      let foundItem = null;
      let generateLink = "/";

      if (type === "property") {
        foundItem = propertyData.find((item) => item.id == id);
        generateLink = `/property/${id}`; 
      } else if (type === "construction") {
        foundItem = constructionServices.find((item) => item.id == id);
        generateLink = `/service/${id}`;
      } else if (type === "course") {
        foundItem = allCourses.find((item) => item.id == id);
        generateLink = `/course/${id}`;
      }

      if (foundItem) {
        setForm((prev) => ({
          ...prev,
          title: foundItem.title,
          linkUrl: generateLink,
          // ✅ ถ้าเป็น Create Mode (มาจาก Unactive) ให้บังคับ status = 'pending' เสมอ ไม่ต้องสนใจ status เดิมของอสังหาฯ
          // ✅ ถ้าเป็น Edit Mode ค่อยดึง status เดิมมาโชว์
          status: isEditMode ? (foundItem.status || 'active') : 'pending',
        }));

        const existingImage = foundItem.imageSrc || foundItem.image || (foundItem.gallery && foundItem.gallery[0]);
        if (existingImage) {
            setImagePreview(existingImage);
        }
      }
    }
  }, [searchParams, isEditMode]); // เพิ่ม dependency isEditMode

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const pickFile = () => {
    if (saving) return;
    fileRef.current?.click();
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("ไฟล์ที่เลือกต้องเป็นรูปภาพเท่านั้น");
      return;
    }

    const maxMB = 3;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`ขนาดรูปต้องไม่เกิน ${maxMB}MB`);
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (saving) return;
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (saving) return;
    setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  useMemo(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validate = () => {
    if (!form.title.trim()) return "กรุณากรอกชื่อแบนเนอร์";
    if (!form.position.trim()) return "กรุณาเลือกตำแหน่ง";
    if (!form.linkUrl.trim()) return "กรุณากรอกลิงก์ปลายทาง";
    if (!imageFile && !imagePreview) return "กรุณาเลือกรูปแบนเนอร์";
    return "";
  };

  const handlePaymentClick = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    if (!form.startAt || !form.endAt) {
       toast.error("กรุณาระบุวันเริ่มต้นและสิ้นสุด");
       return;
    }

    const startDate = new Date(form.startAt);
    const endDate = new Date(form.endAt);

    if (startDate > endDate) {
        toast.error("วันที่เริ่มต้น ต้องมาก่อน วันที่สิ้นสุด");
        return;
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    const pricePerDay = 100;
    const totalPrice = diffDays * pricePerDay;

    try {
      setSaving(true);
      toast.loading("กำลังบันทึกข้อมูล...", { toastId: "saving-banner" });
      
      let imageData = null;
      if (imageFile) {
        imageData = await fileToBase64(imageFile);
      }

      const result = await addBanner({
        ...form,
        image: {
          name: imageFile?.name,
          type: imageFile?.type,
          size: imageFile?.size,
          dataUrl: imageData,
        },
      });

      const refId = result?.id || 'BN-' + Math.floor(Math.random() * 100000);

      toast.update("saving-banner", {
        render: "บันทึกแล้ว! กำลังไปหน้าชำระเงิน...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push(
          `/dashboard-points/buy?` +
          `package=ค่าโฆษณา Banner (${diffDays} วัน)` + 
          `&price=${totalPrice}` +
          `&cycle=${diffDays} วัน` +
          `&ref_id=${refId}` +
          `&type=banner`
        );
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.update("saving-banner", {
        render: "เกิดข้อผิดพลาดในการบันทึก",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={s.top}>
        <div className={s.brand}>
          <span className={s.icon}>
            <i className="flaticon-photo" />
          </span>
          <div>
            <div className={s.h1}>{isEditMode ? "แก้ไขแบนเนอร์" : "เพิ่มแบนเนอร์"}</div>
            <div className={s.sub}>{isEditMode ? "ปรับปรุงข้อมูลแบนเนอร์ของคุณ" : "สร้างแบนเนอร์ใหม่ แล้วกลับไปหน้ารายการ"}</div>
          </div>
        </div>

        <button
          className="ud-btn btn-white2"
          type="button"
          onClick={() => router.push("/dashboard-banners")}
          disabled={saving}
        >
          กลับ
        </button>
      </div>

      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 pb30 mb30 overflow-hidden position-relative">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPickImage}
          className={s.hiddenFile}
          tabIndex={-1}
        />

        <div className={s.previewWrap}>
          <button
            type="button"
            className={`${s.previewBtn} ${dragging ? s.dragging : ""}`}
            onClick={pickFile}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            disabled={saving}
          >
            <div className={s.preview}>
              {imagePreview !== null ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={s.previewImg}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className={s.previewEmpty}>
                  <div className={s.previewEmptyIcon}>
                    <i className="flaticon-photo" />
                  </div>
                  <div className={s.previewTitle}>เลือกภาพเพื่อดูตัวอย่าง</div>
                  <div className={s.previewSub}>(คลิกที่นี่ หรือ ลากไฟล์มาวาง)</div>
                </div>
              )}

              <div className={s.previewOverlay}>
                <i className="flaticon-photo" />
                <span>{imagePreview ? "คลิกเพื่อเปลี่ยนรูป" : "คลิกเพื่อเลือกรูป"}</span>
              </div>
            </div>
          </button>

          <div className={s.hint}>
            รองรับไฟล์รูปภาพ (jpg/png/webp) และแนะนำไม่เกิน <b>3MB</b>
            {imageFile ? (
              <>
                {" "}
                • เลือกแล้ว: <b>{imageFile.name}</b>
              </>
            ) : imagePreview ? (
               <> • ใช้รูปภาพจากรายการสินทรัพย์ (สามารถเปลี่ยนได้)</>
            ) : null}
          </div>
        </div>

        <div className={s.formPad}>
          <div className="row g-3">
            
            {/* ✅ Logic การแบ่ง Column */}
            <div className={`col-12 ${isEditMode ? 'col-lg-6' : 'col-lg-8'}`}>
              <label className={s.label}>ชื่อแบนเนอร์</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={onChange}
                disabled={saving}
                placeholder="เช่น โปรโมชั่นคอนโดหรู..."
              />
            </div>

            <div className={`col-12 ${isEditMode ? 'col-lg-3' : 'col-lg-4'}`}>
              <label className={s.label}>ตำแหน่ง</label>
              <select
                className="form-control"
                name="position"
                value={form.position}
                onChange={onChange}
                disabled={saving}
              >
                <option value="หน้าแรก">หน้าแรก</option>
                <option value="หน้ารายการทรัพย์">หน้ารายการทรัพย์</option>
                <option value="หน้าโปรไฟล์นายหน้า">หน้าโปรไฟล์นายหน้า</option>
                <option value="Pricing">Pricing</option>
              </select>
            </div>

            {/* ✅ แสดงช่องสถานะ "เฉพาะตอนแก้ไข (isEditMode)" เท่านั้น */}
            {isEditMode && (
                <div className="col-12 col-lg-3">
                    <label className={s.label}>สถานะ</label>
                    <select
                        className="form-control"
                        name="status"
                        value={form.status}
                        onChange={onChange}
                        disabled={saving}
                        style={{ 
                            color: form.status === 'active' ? 'green' : (form.status === 'hidden' ? 'gray' : 'black'),
                            fontWeight: 'bold'
                        }}
                    >
                        <option value="active">เปิดใช้งาน (Active)</option>
                        <option value="hidden">ซ่อน / พัก (Hidden)</option>
                        {form.status === 'pending' && <option value="pending" disabled>รอตรวจสอบ</option>}
                        {form.status === 'rejected' && <option value="rejected" disabled>ไม่อนุมัติ</option>}
                    </select>
                </div>
            )}

            <div className="col-12">
              <label className={s.label}>ลิงก์ปลายทาง (อัตโนมัติ)</label>
              <input
                className="form-control"
                name="linkUrl"
                value={form.linkUrl}
                readOnly
                style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
              />
            </div>

            <div className="col-12 col-lg-6">
              <label className={s.label}>เริ่มวันที่</label>
              <input
                className="form-control"
                type="date"
                name="startAt"
                value={form.startAt}
                onChange={onChange}
                disabled={saving}
              />
            </div>

            <div className="col-12 col-lg-6">
              <label className={s.label}>สิ้นสุดวันที่</label>
              <input
                className="form-control"
                type="date"
                name="endAt"
                value={form.endAt}
                onChange={onChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className={s.actions}>
          <button
            className="ud-btn btn-white2"
            type="button"
            onClick={() => router.push("/dashboard-banners")}
            disabled={saving}
          >
            ยกเลิก
          </button>

          <button
            className="ud-btn btn-thm"
            type="button"
            onClick={handlePaymentClick}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm" />
                <span style={{ marginLeft: 8 }}>กำลังบันทึก</span>
              </>
            ) : (
              <>
                {isEditMode ? "บันทึกการแก้ไข" : "ชำระเงิน"} <i className="fal fa-arrow-right-long ms-2"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}