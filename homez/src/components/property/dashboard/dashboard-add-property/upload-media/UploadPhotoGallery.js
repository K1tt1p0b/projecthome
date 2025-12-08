"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const UploadPhotoGallery = ({
  value = [],          // รูปจาก parent (ถ้ามี)
  onChange,            // callback ส่งรูปกลับไปให้ parent
  minCount = 5,        // ใช้แทน MIN_IMAGE_COUNT เดิม
  hardLimit = 10,      // ใช้แทน HARD_LIMIT เดิม
}) => {
  const [uploadedImages, setUploadedImages] = useState(value);
  const fileInputRef = useRef(null);

  // sync ค่าเริ่มต้นจาก parent เวลาเปิดหน้า / เวลา parent เปลี่ยนค่า
  useEffect(() => {
    setUploadedImages(value);
  }, [value]);

  const isMinRequirementMet = uploadedImages.length >= minCount;

  // ฟังก์ชันกลางเวลาเปลี่ยนรูป
  const updateImages = (nextImages) => {
    setUploadedImages(nextImages);
    if (onChange) {
      onChange(nextImages);   // ส่งกลับไปให้ UploadMedia
    }
  };

  const handleUpload = (files) => {
    const fileArray = Array.from(files);

    if (uploadedImages.length + fileArray.length > hardLimit) {
      alert(`อัปโหลดได้สูงสุดไม่เกิน ${hardLimit} รูปครับ`);
      return;
    }

    const fileReaders = fileArray.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((newImages) => {
        const next = [...uploadedImages, ...newImages];
        updateImages(next);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleUpload(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = (index) => {
    const next = uploadedImages.filter((_, i) => i !== index);
    updateImages(next);
  };

  return (
    <>
      <div
        className="upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2"
        style={{
          border: isMinRequirementMet ? "1px solid #ddd" : "2px dashed red",
          height: "auto",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* ถ้ายังไม่มีรูปเลย */}
        {uploadedImages.length === 0 && (
          <>
            <div className="icon mb30">
              <span className="flaticon-upload" />
            </div>
            <h4 className="title fz17 mb10">อัปโหลดรูปภาพทรัพย์ของคุณที่นี้</h4>
            <p className="text mb25">
              รูปภาพต้องเป็นไฟล์ JPEG หรือ PNG เท่านั้น (สูงสุดได้ {hardLimit} รูป)
            </p>
          </>
        )}

        {/* แสดงรูปที่อัปโหลดแล้ว */}
        {uploadedImages.length > 0 && (
          <div className="row g-3 mb30 px-3 pt-4">
            {uploadedImages.map((imageData, index) => (
              <div key={index} className="col-6 col-sm-4 col-md-3">
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    width: "100%",
                  }}
                >
                  <Image
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="bdrs12"
                    style={{ objectFit: "cover", border: "1px solid #eee" }}
                    src={imageData}
                    alt={`Uploaded Image ${index + 1}`}
                  />
                  <button
                    style={{
                      border: "none",
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(255, 0, 0, 0.8)",
                      color: "white",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                      zIndex: 10,
                    }}
                    title="Delete Image"
                    onClick={() => handleDelete(index)}
                    type="button"
                  >
                    <span className="fas fa-times" style={{ fontSize: "14px" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ปุ่มเลือกไฟล์ */}
        <div className="text-center w-100 mt-auto pb-4">
          <label className="ud-btn btn-white">
            {uploadedImages.length > 0 ? "Add More Photos" : "Browse Files"}
            <input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              className="ud-btn btn-white"
              onChange={(e) => handleUpload(e.target.files)}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default UploadPhotoGallery;
