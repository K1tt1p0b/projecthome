"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
  const fileRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [form, setForm] = useState({
    title: "",
    position: "หน้าแรก",
    status: "active",
    linkUrl: "/",
    startAt: "",
    endAt: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Logic ดึงข้อมูลอัตโนมัติ (รวมถึงรูปภาพ)
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
        }));

        // ✅ เพิ่มส่วนนี้: ดึงรูปภาพมาแสดงทันที
        const existingImage = foundItem.imageSrc || foundItem.image || (foundItem.gallery && foundItem.gallery[0]);
        if (existingImage) {
            setImagePreview(existingImage);
        }
      }
    }
  }, [searchParams]);

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
      // revoke เฉพาะถ้าเป็น blob url ที่สร้างใหม่ (รูปจากระบบไม่ต้อง revoke)
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validate = () => {
    if (!form.title.trim()) return "กรุณากรอกชื่อแบนเนอร์";
    if (!form.position.trim()) return "กรุณาเลือกตำแหน่ง";
    if (!form.linkUrl.trim()) return "กรุณากรอกลิงก์ปลายทาง";
    // ✅ แก้เงื่อนไข: ถ้ามี imagePreview (รูปจากระบบ) ถือว่าผ่าน แม้จะไม่มี imageFile (ไฟล์ใหม่)
    if (!imageFile && !imagePreview) return "กรุณาเลือกรูปแบนเนอร์";
    return "";
  };

  // เปลี่ยนชื่อจาก onSave เป็น handlePaymentClick
  const handlePaymentClick = async () => {
    // ✅ 1. คำนวณจำนวนวันจริง (สูตรคำนวณวัน)
    const startDate = new Date(form.startAt);
    const endDate = new Date(form.endAt);

    // แปลงผลต่างเวลา (milli) ให้เป็นวัน
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 คือนับวันแรกด้วย (เช่น 1-1 คือ 1 วัน)

    // ✅ 2. คำนวณราคาตามจริง (สมมติวันละ 100 บาท)
    // ถ้าคุณขายเหมา ก็ใช้ราคาคงที่ได้เลย แต่ถ้าขายตามวันต้องคูณครับ
    const pricePerDay = 100;
    const totalPrice = diffDays * pricePerDay;

    try {
      setSaving(true);
      toast.loading("กำลังบันทึกแบนเนอร์...", { toastId: "saving-banner" });

      // 2. แปลงรูปภาพเหมือนเดิม
      let imageData = null;
      if (imageFile) {
        imageData = await fileToBase64(imageFile);
      }

      // 3. บันทึกลง Database (สำคัญ! ต้องบันทึกก่อนถึงจะมี ID ไปอ้างอิง)
      // แต่สถานะใน DB ควรเป็น 'pending' หรือ 'waiting_payment'
      const result = await addBanner({
        ...form,
        image: {
          name: imageFile?.name,
          type: imageFile?.type,
          size: imageFile?.size,
          dataUrl: imageData,
        },
      });

      // 4. เตรียมข้อมูลสำหรับหน้าจ่ายเงิน
      // สมมติว่า result ที่ได้กลับมามี id ของ banner (เช่น result.id)
      // ถ้าไม่มี ให้สุ่มเลขไปก่อน (แต่ทางที่ดี Backend ควรส่ง ID กลับมา)
      const refId = result?.id || 'BN-' + Math.floor(Math.random() * 100000);
      const price = 500; // ตั้งราคาค่าโฆษณา

      toast.update("saving-banner", {
        render: "บันทึกแบนเนอร์เรียบร้อยแล้ว",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // 5. 🚀 เปลี่ยนตรงนี้! พาไปหน้าจ่ายเงิน แทนหน้า List
      setTimeout(() => {
        router.push(
          `/dashboard-points/buy?` +
          `package=ค่าโฆษณา Banner` +
          `&price=${totalPrice}` +    // ส่งราคาที่คำนวณแล้ว
          `&cycle=${diffDays} วัน` +  // ส่งจำนวนวันจริง (เช่น 5 วัน)
          `&ref_id=${refId}` +
          `&type=banner`
        );
      }, 1000);

    } catch (error) {
      console.error(error); // ดู Error ใน Console
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
            <div className={s.h1}>เพิ่มแบนเนอร์</div>
            <div className={s.sub}>สร้างแบนเนอร์ใหม่ แล้วกลับไปหน้ารายการ</div>
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
                // ✅ ใช้ Image component (ต้อง allow domain ใน next.config.js หรือใช้ img ธรรมดาถ้าเป็น external url)
                // เพื่อความง่าย ผมใช้ <img> ธรรมดาที่นี่เพราะ URL รูปอาจมาจากหลายที่
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
            <div className="col-12 col-lg-7">
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

            <div className="col-12 col-lg-3">
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

            <div className="col-12 col-lg-2">
              <label className={s.label}>สถานะ</label>
              <select
                className="form-control"
                name="status"
                value={form.status}
                onChange={onChange}
                disabled={saving}
              >
                <option value="active">ใช้งาน</option>
                <option value="paused">พักไว้</option>
              </select>
            </div>

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

            // 👇 1. แก้ตรงนี้: เรียกใช้ฟังก์ชันพาไปจ่ายเงิน (แทน onSave เดิม)
            onClick={handlePaymentClick}

            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm" />
                <span style={{ marginLeft: 8 }}>กำลังบันทึก</span>
              </>
            ) : (
              // 👇 2. แก้ข้อความตรงนี้ ให้รู้ว่าต้องจ่ายเงิน
              <>
                ชำระเงิน <i className="fal fa-arrow-right-long ms-2"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}