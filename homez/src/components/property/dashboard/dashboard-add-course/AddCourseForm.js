"use client";
import React, { useState } from "react";
import Image from "next/image";
// ✅ 1. เพิ่ม Import สำหรับเปลี่ยนหน้าและแจ้งเตือน
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const AddCourseForm = () => {
  // ✅ 2. เรียกใช้ Router
  const router = useRouter();

  // --- State ---
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    category: "",
    description: "",
    type: "course",
    courseType: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  // ✅ วิดีโอ 4 ช่อง fixed
  const [videoUrls, setVideoUrls] = useState(["", "", "", ""]);
  const [videoErrors, setVideoErrors] = useState(["", "", "", ""]);

  // Handle ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle รูปภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Dropdown
  const courseTypeOptions = [
    { value: "hybrid", label: "ผสมผสาน (Hybrid)" },
    { value: "online", label: "เรียนออนไลน์ (Online)" },
    { value: "onsite", label: "เรียนออนไซต์ (On-site)" },
  ];

  const handleDropdownSelect = (value) => {
    setFormData((prev) => ({ ...prev, courseType: value }));
  };

  const getCurrentLabel = () => {
    const selected = courseTypeOptions.find((opt) => opt.value === formData.courseType);
    return selected ? selected.label : "เลือกรูปแบบ...";
  };

  const setVideoAt = (idx, value) => {
    setVideoUrls((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });

    setVideoErrors((prev) => {
      const next = [...prev];
      next[idx] = "";
      return next;
    });
  };

  const validateVideos = () => {
    const errors = ["", "", "", ""];
    const cleaned = videoUrls.map((v) => norm(v)).filter(Boolean);

    const lowered = cleaned.map((v) => v.toLowerCase());
    if (new Set(lowered).size !== lowered.length) {
      return { ok: false, errors, dup: true };
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
    return { ok, errors, dup: false };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ เพิ่มเช็คชื่อคอร์สกันเหนียว
    if (!formData.title) {
        toast.error("กรุณากรอกชื่อคอร์สเรียน");
        return;
    }

    const { ok, errors, dup } = validateVideos();
    setVideoErrors(errors);

    if (!ok) {
      if (dup) {
        toast.error("ลิงก์วิดีโอมีซ้ำกัน กรุณาแก้ไข"); // ใช้ toast แทน alert
      } else {
        toast.error("กรุณาแก้ไขลิงก์วิดีโอให้ถูกต้อง"); // ใช้ toast แทน alert
      }
      return;
    }

    const finalVideoUrls = videoUrls.map((v) => norm(v)).filter(Boolean);

    console.log("Submitting Online Course:", {
      ...formData,
      coverImage: imagePreview,
      videoUrls: finalVideoUrls,
    });
    
    // ✅ 3. แจ้งเตือนสำเร็จและเปลี่ยนหน้า
    toast.success("ลงประกาศคอร์สเรียนเรียบร้อยแล้ว!");
    router.push("/dashboard-my-course"); // เปลี่ยนหน้าไปที่รายการคอร์สของฉัน
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="ps-widget bg-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
          <h4 className="mb-4">
            <i className="fas fa-laptop-code me-2"></i>ลงประกาศคอร์สออนไลน์
          </h4>

          <form className="form-style1" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">ชื่อคอร์สเรียน</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="เช่น สอนยิงแอด Facebook รวยด้วยมือถือ..."
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Dropdown */}
              <div className="col-sm-12 col-xl-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">รูปแบบการเรียน</label>
                  <div className="dropdown">
                    <button
                      className="btn btn-white w-100 text-start border d-flex justify-content-between align-items-center"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        height: "55px",
                        borderRadius: "8px",
                        borderColor: "#ebebeb",
                        color: formData.courseType ? "#222" : "#777",
                      }}
                    >
                      <span>{getCurrentLabel()}</span>
                      <i className="fas fa-chevron-down fz12"></i>
                    </button>

                    <ul
                      className="dropdown-menu w-100 p-2 shadow border-0"
                      style={{ borderRadius: "8px", marginTop: "5px" }}
                    >
                      {courseTypeOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            type="button"
                            className={`dropdown-item rounded-2 py-2 ${
                              formData.courseType === option.value ? "active" : ""
                            }`}
                            onClick={() => handleDropdownSelect(option.value)}
                            style={{
                              cursor: "pointer",
                              backgroundColor:
                                formData.courseType === option.value ? "#eb6753" : "transparent",
                              color: formData.courseType === option.value ? "#fff" : "#222",
                            }}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">ชื่อผู้สอน (Instructor)</label>
                  <input
                    type="text"
                    name="instructor"
                    className="form-control"
                    placeholder="เช่น โค้ชพี่ทอม, คุณเจน Digital..."
                    value={formData.instructor}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-md-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">รายละเอียดบทเรียน</label>
                  <textarea
                    cols="30"
                    rows="6"
                    name="description"
                    className="form-control"
                    placeholder="รายละเอียดสิ่งที่จะได้รับ, เนื้อหาที่สอน..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* ✅ วิดีโอ 4 ช่องแบบ box (2x2) */}
              <div className="col-md-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">วิดีโอแนะนำคอร์ส (YouTube/TikTok)</label>

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

              {/* Cover image */}
              <div className="col-md-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">รูปภาพปกคอร์ส</label>
                  <div className="upload-field text-center p-4 border border-dashed rounded-3 bg-light position-relative">
                    {imagePreview ? (
                      <div className="position-relative d-inline-block">
                        <Image
                          src={imagePreview}
                          width={300}
                          height={200}
                          alt="preview"
                          className="rounded-3 object-fit-cover shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-3">
                          <i className="fas fa-cloud-upload-alt fz40 text-thm"></i>
                        </div>
                        <p className="mb-2 fw600">คลิกเพื่ออัปโหลดรูปปก</p>
                        <input
                          type="file"
                          className="form-control w-50 mx-auto mt-3 opacity-0 position-absolute top-0 start-0 h-100 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="d-grid mt-3">
                  <button className="ud-btn btn-thm btn-lg rounded-3" type="submit">
                    ลงประกาศขายคอร์ส <i className="fal fa-arrow-right-long ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourseForm;