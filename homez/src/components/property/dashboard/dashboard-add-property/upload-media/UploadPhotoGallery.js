"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const UploadPhotoGallery = ({
  value = [],
  onChange,
  minCount = 5,
  hardLimit = 10,
}) => {
  const safeValue = Array.isArray(value) ? value : [];
  const [uploadedImages, setUploadedImages] = useState(safeValue);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUploadedImages(Array.isArray(value) ? value : []);
  }, [value]);

  // ✅ ผ่านขั้นต่ำ ถ้า "ครบขั้นต่ำ" หรือ "ไม่ใส่เลย"
  const isMinRequirementMet =
    uploadedImages.length === 0 || uploadedImages.length >= minCount;

  const updateImages = (nextImages) => {
    const next = Array.isArray(nextImages) ? nextImages : [];
    setUploadedImages(next);
    onChange?.(next);
  };

  const handleUpload = (files) => {
    const fileArray = Array.from(files || []);
    if (!fileArray.length) return;

    if (uploadedImages.length + fileArray.length > hardLimit) {
      toast.warn(`อัปโหลดได้สูงสุดไม่เกิน ${hardLimit} รูปครับ`);
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
        toast.error("อ่านไฟล์รูปไม่สำเร็จ");
      });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer?.files);
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
          // ✅ เส้นแดงเฉพาะกรณี "มีรูปแล้วแต่ยังไม่ถึงขั้นต่ำ"
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
        {uploadedImages.length === 0 && (
          <>
            <div className="icon mb30">
              <span className="flaticon-upload" />
            </div>
            <h4 className="title fz17 mb10">อัปโหลดรูปภาพทรัพย์ของคุณที่นี้</h4>
            <p className="text mb25">
              ถ้าจะใส่รูป แนะนำอย่างน้อย {minCount} รูป (สูงสุด {hardLimit} รูป) — หรือข้ามได้
            </p>
          </>
        )}

        {uploadedImages.length > 0 && (
          <>
            {!isMinRequirementMet && (
              <div className="px-3 pt-3">
                <div className="alert alert-warning mb-2" role="alert">
                  ตอนนี้มี {uploadedImages.length} รูป — ถ้าจะใส่รูป กรุณาเพิ่มให้ครบอย่างน้อย {minCount} รูป
                  (หรือจะลบให้เหลือ 0 แล้วข้ามได้)
                </div>
              </div>
            )}

            <div className="row g-3 mb30 px-3 pt-2">
              {uploadedImages.map((imageData, index) => (
                <div key={index} className="col-6 col-sm-4 col-md-3">
                  <div style={{ position: "relative", height: "200px", width: "100%" }}>
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
          </>
        )}

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
