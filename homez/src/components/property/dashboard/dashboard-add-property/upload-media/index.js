"use client";

import React, { useState } from "react";
import UploadPhotoGallery from "./UploadPhotoGallery";
import { toast } from "react-toastify";

const UploadMedia = ({ onBack, onNext, onSaveDraft }) => {
  const [images, setImages] = useState([]);

  // กำหนดขั้นต่ำสำหรับไปหน้าถัดไป
  const MIN_IMAGES = 5;

  const handleImagesChange = (nextImages) => {
    setImages(nextImages);
  };

  const buildPayload = () => ({ images });

  const handleNext = () => {
    if (!images || images.length < MIN_IMAGES) {
      toast.warn(`กรุณาอัปโหลดรูปภาพอย่างน้อย ${MIN_IMAGES} รูป`);
      return;
    }
    onNext?.(buildPayload());
  };

  const handleSaveDraft = () => {
    const payload = buildPayload();
    onSaveDraft?.(payload);
    console.log("draft media:", payload);
    alert("บันทึกร่างรูปภาพเรียบร้อย (mock)");
  };

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <h4 className="title fz17 mb30">อัปโหลดรูปภาพทรัพย์ของคุณ</h4>

      <form
        className="form-style1"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <div className="row">
          <div className="col-lg-12">
            <UploadPhotoGallery
              value={images}
              onChange={handleImagesChange}
              minCount={MIN_IMAGES}   // ถ้าใน UploadPhotoGallery รับ prop นี้อยู่
            />
          </div>
        </div>

        <div className="row mt20">
          <div className="col-12 d-flex justify-content-between">
            {onBack ? (
              <button
                type="button"
                className="ud-btn btn-light"
                onClick={onBack}
              >
                ย้อนกลับ
              </button>
            ) : (
              <span />
            )}

            <div className="d-flex gap-2">
              <button
                type="button"
                className="ud-btn btn-light"
                onClick={handleSaveDraft}
              >
                บันทึกร่าง
              </button>
              <button
                type="button"
                className="ud-btn btn-thm"
                onClick={handleNext}
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadMedia;
