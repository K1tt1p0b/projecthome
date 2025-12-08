"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useState, useRef } from "react";
import Image from "next/image";

const UploadPhotoGallery = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // กำหนดขั้นต่ำ (เอาไว้เช็คเพื่อแสดงเตือนเฉยๆ ไม่ใช่เอาไว้บล็อกการอัปโหลด)
  const MIN_IMAGE_COUNT = 5;

  // (Optional) ควรกำหนดเพดานสูงสุดไว้ด้วยเพื่อกันระบบค้าง เช่น 20 รูป
  const HARD_LIMIT = 10;

  const isMinRequirementMet = uploadedImages.length >= MIN_IMAGE_COUNT;

  const handleUpload = (files) => {
    const fileArray = Array.from(files);

    if (uploadedImages.length + fileArray.length > HARD_LIMIT) {
      alert(`อัปโหลดได้สูงสุดไม่เกิน ${HARD_LIMIT} รูปครับ`);
      return;
    }

    // 3. อ่านไฟล์รูปภาพ (ใช้ Promise เพื่อรอให้อ่านครบทุกรูปก่อนค่อย Set State ทีเดียว)
    const fileReaders = fileArray.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });

    // 4. เมื่ออ่านครบทุกรูปแล้ว ให้เอาไปรวมกับของเดิม
    Promise.all(fileReaders)
      .then((newImages) => {
        setUploadedImages((prevImages) => [...prevImages, ...newImages]);
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
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  return (
    <>
      <div
        className="upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2"
        style={{
          border: isMinRequirementMet ? "1px solid #ddd" : "2px dashed red",
          height: "auto",
          minHeight: "200px"
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="icon mb30">
          <span className="flaticon-upload" />
        </div>
        <h4 className="title fz17 mb10">อัปโหลดรูปภาพบ้าน/ที่ดินของคุณที่นี้</h4>
        <p className="text mb25">
          รูปภาพต้องเป็นไฟล์ JPEG หรือ PNG เท่านั้น (สูงสุดได้ {HARD_LIMIT} รูป)
        </p>

        <label className="ud-btn btn-white mb30">
          Browse Files
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            multiple
            className="ud-btn btn-white"
            onChange={(e) => handleUpload(e.target.files)}
            style={{ display: "none" }}
          />
        </label>

        {/* --- ส่วนแสดงรูปภาพ (ปรับขนาดใหญ่ขึ้น) --- */}
        {uploadedImages.length > 0 && (
          // ใช้ row g-3 เพื่อจัดช่องไฟสวยๆ
          <div className="row g-3 mt-2 pb-4 px-3">
            {uploadedImages.map((imageData, index) => (
              // col-6 = มือถือแถวละ 2 รูป | col-md-3 = จอคอมแถวละ 4 รูป
              <div key={index} className="col-6 col-sm-4 col-md-3">
                <div style={{ position: "relative", height: "200px", width: "100%" }}>
                  <Image
                    fill // สั่งให้รูปขยายเต็มพื้นที่ div แม่
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="bdrs12"
                    style={{ objectFit: "cover", border: "1px solid #eee" }}
                    src={imageData}
                    alt={`Uploaded Image ${index + 1}`}
                  />

                  {/* ปุ่มลบ */}
                  <button
                    style={{
                      border: "none",
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(255, 0, 0, 0.8)", // สีแดงโปร่งแสงนิดๆ จะได้ดูแพง
                      color: "white",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                      zIndex: 10 // มั่นใจว่าปุ่มอยู่บนสุด
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
        {/* --- จบส่วนแสดงรูปภาพ --- */}

      </div>
    </>
  );
};

export default UploadPhotoGallery;
