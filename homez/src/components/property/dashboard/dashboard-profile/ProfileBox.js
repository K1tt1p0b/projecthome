"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { toast } from "react-toastify";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOW_TYPES = ["image/jpeg", "image/png"];

const ProfileBox = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOW_TYPES.includes(file.type)) {
      toast.error("รองรับเฉพาะไฟล์ JPG หรือ PNG เท่านั้น");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 2MB");
      event.target.value = "";
      return;
    }

    try {
      setLoading(true);

      // preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // ต่อ API จริงภายหลัง
      // const formData = new FormData();
      // formData.append("avatar", file);
      // await fetch("/api/profile/avatar", { method: "POST", body: formData });

      await new Promise((r) => setTimeout(r, 700));
      toast.success("อัปโหลดรูปโปรไฟล์สำเร็จ");
    } catch (err) {
      toast.error("อัปโหลดรูปไม่สำเร็จ");
      setUploadedImage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!uploadedImage) return;

    if (!confirm("ต้องการลบรูปโปรไฟล์ใช่หรือไม่ ?")) return;

    setUploadedImage(null);
    if (inputRef.current) inputRef.current.value = "";
    toast.success("ลบรูปโปรไฟล์เรียบร้อยแล้ว");
  };

  return (
    <div className="profile-box position-relative d-md-flex align-items-end mb50">
      <div className="profile-img new position-relative overflow-hidden bdrs12 mb20-sm">
        <Image
          width={240}
          height={220}
          className="w-100 cover h-100"
          src={uploadedImage || "/images/listings/profile-1.jpg"}
          alt="profile avatar"
        />

        {uploadedImage && (
          <button
            className="tag-del"
            style={{ border: "none" }}
            data-tooltip-id="profile_del_unique"
            onClick={handleDelete}
            disabled={loading}
          >
            <span className="fas fa-trash-can" />
          </button>
        )}

        <ReactTooltip
          id="profile_del_unique"
          place="right"
          content="ลบรูปโปรไฟล์"
        />
      </div>

      <div className="profile-content ml30 ml0-sm">
        <label className="upload-label pointer">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleUpload}
            disabled={loading}
            style={{ display: "none" }}
          />
          <div className="ud-btn btn-white2 mb30">
            {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพโปรไฟล์"}
            <i className="fal fa-arrow-right-long" />
          </div>
        </label>

        <p className="text">
          รองรับไฟล์ JPEG หรือ PNG ขนาดไม่เกิน 2MB
        </p>
      </div>
    </div>
  );
};

export default ProfileBox;
