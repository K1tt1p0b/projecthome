"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Select from "react-select";
import geographyData from "@/components/property/dashboard/dashboard-add-property/LocationField/geography.json";

// ✅ toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_IMAGES = 5;
const MIN_IMAGES = 3;

// -------------------------
// Helpers: Video URL
// -------------------------
const norm = (v) => String(v ?? "").trim();

const isYouTubeUrl = (url) => /(^https:\/\/)(www\.)?(youtube\.com|youtu\.be)\//i.test(norm(url));
const isTikTokUrl = (url) => /(^https:\/\/)(www\.)?(tiktok\.com|vt\.tiktok\.com)\//i.test(norm(url));

const getYouTubeId = (url) => {
  try {
    const u = new URL(norm(url));
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" && parts[1]) return parts[1];
    }
    return null;
  } catch {
    return null;
  }
};

const getYouTubeThumb = (url) => {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

const isValidVideoUrl = (url) => isYouTubeUrl(url) || isTikTokUrl(url);

const AddListingForm = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    provinces: [],
    description: "",
    type: "service",
  });

  const [images, setImages] = useState([]);

  // ✅ วิดีโอ 4 ช่อง fixed
  const [videoUrls, setVideoUrls] = useState(["", "", "", ""]);
  const [videoErrors, setVideoErrors] = useState(["", "", "", ""]);

  // ✅ Handle รูปภาพ
  const handleImageUpload = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`อัปโหลดได้สูงสุดรวมกันไม่เกิน ${MAX_IMAGES} รูปครับ`);
      e.target.value = "";
      return;
    }

    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    try {
      const newImages = await Promise.all(fileReaders);
      setImages((prevImages) => [...prevImages, ...newImages]);
      toast.success(`อัปโหลดเพิ่ม ${newImages.length} รูปเรียบร้อย`);
    } catch (error) {
      console.error("Error reading files:", error);
      toast.error("เกิดข้อผิดพลาดในการอ่านไฟล์");
    }

    e.target.value = "";
  };

  // ✅ Handle ลบรูปภาพ
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    toast.success("ลบรูปภาพแล้ว");
  };

  // --- Logic กรองจังหวัด ---
  const provinceOptions = useMemo(() => {
    const uniqueProvinces = [...new Set(geographyData.map((item) => item.provinceNameTh))];
    return uniqueProvinces.sort().map((provinceName) => ({
      value: provinceName,
      label: provinceName,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ วิดีโอ: เปลี่ยนค่าทีละช่อง
  const setVideoAt = (idx, value) => {
    setVideoUrls((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });

    // เคลียร์ error ตอนพิมพ์
    setVideoErrors((prev) => {
      const next = [...prev];
      next[idx] = "";
      return next;
    });
  };

  const validateVideos = () => {
    const errors = ["", "", "", ""];
    const cleaned = videoUrls.map((v) => norm(v)).filter(Boolean);

    // กันซ้ำ (case-insensitive)
    const lowered = cleaned.map((v) => v.toLowerCase());
    if (new Set(lowered).size !== lowered.length) {
      // โยน error ให้ทุกช่องที่ซ้ำ (ง่ายสุด: แจ้งรวม)
      toast.error("ลิงก์วิดีโอมีซ้ำกัน กรุณาแก้ไข");
      return { ok: false, errors };
    }

    for (let i = 0; i < 4; i++) {
      const url = norm(videoUrls[i]);
      if (!url) continue;

      if (!/^https:\/\//i.test(url)) {
        errors[i] = "ต้องขึ้นต้นด้วย https://";
        continue;
      }

      if (!isValidVideoUrl(url)) {
        errors[i] = "รองรับเฉพาะ YouTube/TikTok";
        continue;
      }

      if (isYouTubeUrl(url) && !getYouTubeId(url)) {
        errors[i] = "ลิงก์ YouTube ไม่ถูกต้อง";
        continue;
      }
    }

    const ok = errors.every((e) => !e);
    return { ok, errors };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("กรุณากรอกหัวข้อประกาศ");
      return;
    }

    if (images.length < MIN_IMAGES) {
      toast.error(`กรุณาอัปโหลดรูปภาพอย่างน้อย ${MIN_IMAGES} รูปครับ`);
      return;
    }

    const { ok, errors } = validateVideos();
    setVideoErrors(errors);
    if (!ok) {
      toast.error("กรุณาแก้ไขลิงก์วิดีโอให้ถูกต้อง");
      return;
    }

    // ส่งเฉพาะลิงก์ที่ไม่ว่าง
    const finalVideoUrls = videoUrls.map((v) => norm(v)).filter(Boolean);

    console.log("Submitting:", { ...formData, images, videoUrls: finalVideoUrls });
    toast.success("ลงประกาศเรียบร้อยแล้ว!");
  };

  return (
    <div className="ps-widget bg-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      <h4 className="mb-4">
        <i className="fas fa-tools me-2"></i>ลงประกาศงานช่าง/บริการ
      </h4>

      <form className="form-style1" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">หัวข้อประกาศ</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="เช่น รับถมที่ดิน ปรับพื้นที่..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-sm-6 col-xl-6">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                พื้นที่ให้บริการ (เลือกได้หลายจังหวัด)
              </label>
              <Select
                instanceId="provinces-select"
                isMulti
                name="provinces"
                options={provinceOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="ค้นหาจังหวัด..."
                noOptionsMessage={() => "ไม่พบจังหวัดที่ค้นหา"}
                onChange={(selectedOptions) => {
                  const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
                  setFormData((prev) => ({ ...prev, provinces: values }));
                }}
                value={provinceOptions.filter((option) => formData.provinces?.includes(option.value))}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "8px",
                    borderColor: "#ebebeb",
                    padding: "2px",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#eb6753" },
                  }),
                }}
              />
            </div>
          </div>

          <div className="col-sm-6 col-xl-6">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">หมวดหมู่</label>
              <select
                className="form-select"
                name="category"
                onChange={handleChange}
                value={formData.category}
              >
                <option value="">เลือกหมวดหมู่...</option>
                <option value="piling">ตอกเสาเข็ม</option>
                <option value="land-fill">ถมที่ดิน</option>
                <option value="renovate">รีโนเวท</option>
                <option value="construction">รับเหมาก่อสร้าง</option>
                <option value="electrician">ช่างไฟ</option>
              </select>
            </div>
          </div>

          <div className="col-md-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">รายละเอียด</label>
              <textarea
                cols="30"
                rows="5"
                name="description"
                className="form-control"
                placeholder="อธิบายรายละเอียดงานของคุณ ประสบการณ์ เครื่องจักรที่มี..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* ✅ วิดีโอ 4 ช่องแบบ box (2x2) */}
          <div className="col-md-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">วิดีโอผลงาน (YouTube/TikTok)</label>

              <div className="row g-3">
                {[0, 1, 2, 3].map((idx) => {
                  const url = norm(videoUrls[idx]);
                  const isYT = url && isYouTubeUrl(url);
                  const thumb = isYT ? getYouTubeThumb(url) : null;

                  return (
                    <div key={idx} className="col-12 col-md-6">
                      <div className="p-3 rounded-3 border bg-light h-100">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="fw600">ลิงก์ #{idx + 1}</div>
                          <div className="d-flex align-items-center gap-2">
                            {url && isYouTubeUrl(url) && <i className="fab fa-youtube text-danger"></i>}
                            {url && isTikTokUrl(url) && <i className="fab fa-tiktok"></i>}
                          </div>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://..."
                          value={videoUrls[idx]}
                          onChange={(e) => setVideoAt(idx, e.target.value)}
                        />

                        {videoErrors[idx] && (
                          <div className="text-danger fz12 mt-2">{videoErrors[idx]}</div>
                        )}

                        {/* Preview เฉพาะ YouTube (thumb) */}
                        {thumb && (
                          <div className="mt-2 position-relative" style={{ aspectRatio: "16/9" }}>
                            <Image
                              src={thumb}
                              fill
                              alt={`youtube-thumb-${idx}`}
                              className="rounded-3 object-fit-cover shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ✅ รูปภาพ */}
          <div className="col-md-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                รูปภาพผลงาน (อย่างน้อย {MIN_IMAGES} รูป, สูงสุด {MAX_IMAGES} รูป)
              </label>

              <div className="upload-field p-4 border border-dashed rounded-3 bg-light position-relative">
                {images.length > 0 && (
                  <div className="row mb-3 g-3">
                    {images.map((imgSrc, index) => (
                      <div key={index} className="col-6 col-sm-4 col-md-3 position-relative">
                        <div className="position-relative" style={{ aspectRatio: "4/3" }}>
                          <Image
                            src={imgSrc}
                            fill
                            alt={`preview-${index}`}
                            className="rounded-3 object-fit-cover shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle shadow p-0 d-flex align-items-center justify-content-center"
                            style={{ width: "24px", height: "24px", zIndex: 10 }}
                          >
                            <i className="fas fa-times fz10"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length < MAX_IMAGES ? (
                  <div className="text-center position-relative py-4 hover-bg-gray" style={{ cursor: "pointer" }}>
                    <div className="mb-3">
                      <i className="fas fa-cloud-upload-alt fz40 text-thm"></i>
                    </div>
                    <p className="mb-2 fw600">คลิกเพื่ออัปโหลดรูปภาพเพิ่ม</p>
                    <p className="text-muted fz14 mb-0">
                      (ตอนนี้มี {images.length} / {MAX_IMAGES} รูป)
                    </p>
                    {images.length > 0 && images.length < MIN_IMAGES && (
                      <p className="text-danger fz12 mt-1">
                        * ต้องเพิ่มอีก {MIN_IMAGES - images.length} รูป
                      </p>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                      style={{ cursor: "pointer", zIndex: 5 }}
                      onChange={handleImageUpload}
                    />
                  </div>
                ) : (
                  <div className="text-center py-3 text-success">
                    <i className="fas fa-check-circle fz30 mb-2"></i>
                    <p className="mb-0 fw600">อัปโหลดครบ {MAX_IMAGES} รูปแล้ว</p>
                    <p className="text-muted fz12">ลบรูปบางส่วนออกหากต้องการเพิ่มใหม่</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="d-grid mt-3">
              <button className="ud-btn btn-thm btn-lg rounded-3" type="submit">
                ลงประกาศงานบริการ <i className="fal fa-arrow-right-long ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddListingForm;
