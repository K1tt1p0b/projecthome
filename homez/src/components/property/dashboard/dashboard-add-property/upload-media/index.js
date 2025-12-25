"use client";

import React, { useEffect, useMemo, useState } from "react";
import UploadPhotoGallery from "./UploadPhotoGallery";
import { toast } from "react-toastify";

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const normalizeInitialImages = (initialValue) => {
  if (!initialValue) return [];

  // 1) ถ้า initialValue เป็น { images: [] } ตรง ๆ
  if (Array.isArray(initialValue.images) && initialValue.images.length) {
    return initialValue.images.filter(Boolean);
  }

  // 2) ถ้าเป็น { gallery: [] }
  if (Array.isArray(initialValue.gallery) && initialValue.gallery.length) {
    return initialValue.gallery.filter(Boolean);
  }

  // 3) ถ้าเป็น { cover, gallery }
  const cover = initialValue.cover || initialValue.imageSrc || "";
  const gallery = Array.isArray(initialValue.gallery)
    ? initialValue.gallery
    : Array.isArray(initialValue.images)
      ? initialValue.images
      : [];

  return [cover, ...gallery].filter(Boolean);
};

const UploadMedia = ({ initialValue, onBack, onNext, onSaveDraft }) => {
  const [images, setImages] = useState([]);

  // กำหนดขั้นต่ำสำหรับไปหน้าถัดไป
  const MIN_IMAGES = 5;

  // sync รูปเดิมตอนเข้าแก้ไข
  useEffect(() => {
    const init = normalizeInitialImages(initialValue);
    setImages(init);
  }, [initialValue]);

  const handleImagesChange = (nextImages) => {
    setImages(Array.isArray(nextImages) ? nextImages : []);
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
              minCount={MIN_IMAGES}
            />
          </div>
        </div>

        <div className="row mt20">
          <div className="col-12 d-flex justify-content-between">
            {onBack ? (
              <button type="button" className="ud-btn btn-light" onClick={onBack}>
                ย้อนกลับ
              </button>
            ) : (
              <span />
            )}

            <div className="d-flex gap-2">
              <button type="button" className="ud-btn btn-light" onClick={handleSaveDraft}>
                บันทึกร่าง
              </button>
              <button type="button" className="ud-btn btn-thm" onClick={handleNext}>
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
