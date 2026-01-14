"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import s from "./banner-edit.module.css";

// IMPORT ข้อมูล Mock Data
import { propertyData } from "@/data/propertyData";
import { constructionServices } from "@/components/services/ConstructionRequest";
import { allCourses } from "@/components/services/CourseLanding";

export default function BannerEditClient() {
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

  // ✅ โหลดข้อมูลจาก item ต้นทาง (property/service/course) ตาม id/type
  useEffect(() => {
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) return;

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
        title: foundItem.title || "",
        linkUrl: generateLink,
      }));

      const existingImage =
        foundItem.imageSrc || foundItem.image || (foundItem.gallery && foundItem.gallery[0]) || null;

      setImagePreview(existingImage);
    }
  }, [searchParams]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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
    if (!imagePreview && !imageFile) return "กรุณาเลือกรูปแบนเนอร์";
    return "";
  };

  // ✅ ไม่บันทึกจริง: แค่ toast + กลับหน้า index
  const onSaveFake = async () => {
    const err = validate();
    if (err) return toast.error(err);

    try {
      setSaving(true);
      toast.loading("กำลังบันทึกการแก้ไข...", { toastId: "edit-banner" });

      // จำลองหน่วงนิดนึงให้ UX เหมือนเซฟ
      await new Promise((r) => setTimeout(r, 600));

      toast.update("edit-banner", {
        render: "แก้ไขเสร็จแล้ว",
        type: "success",
        isLoading: false,
        autoClose: 1200,
      });

      setTimeout(() => {
        router.push("/dashboard-banners");
      }, 900);
    } catch (e) {
      toast.update("edit-banner", {
        render: "เกิดข้อผิดพลาด",
        type: "error",
        isLoading: false,
        autoClose: 2000,
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
            <div className={s.h1}>แก้ไขแบนเนอร์</div>
            <div className={s.sub}>แก้ไขข้อมูลแล้วกลับไปหน้ารายการ</div>
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
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={s.previewImg}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
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

          <button className="ud-btn btn-thm" type="button" onClick={onSaveFake} disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm" />
                <span style={{ marginLeft: 8 }}>กำลังบันทึก</span>
              </>
            ) : (
              <>
                บันทึก
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
