"use client";

import React, { useEffect, useState } from "react";
import UploadPhotoGallery from "./UploadPhotoGallery";
import { toast } from "react-toastify";

const normalizeInitialImages = (initialValue) => {
  if (!initialValue) return [];

  if (Array.isArray(initialValue.images) && initialValue.images.length) {
    return initialValue.images.filter(Boolean);
  }

  if (Array.isArray(initialValue.gallery) && initialValue.gallery.length) {
    return initialValue.gallery.filter(Boolean);
  }

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

  // ✅ มีขั้นต่ำเหมือนเดิม
  const MIN_IMAGES = 5;

  useEffect(() => {
    const init = normalizeInitialImages(initialValue);
    setImages(init);
  }, [initialValue]);

  const handleImagesChange = (nextImages) => {
    setImages(Array.isArray(nextImages) ? nextImages : []);
  };

  const buildPayload = () => ({ images });

  const handleNext = () => {
    // ✅ อนุญาตให้ "ไม่ใส่รูปเลย" ได้
    // ⚠️ ถ้าใส่แล้วแต่ยังไม่ถึงขั้นต่ำ -> เตือน แต่ไปต่อได้
    if (images.length > 0 && images.length < MIN_IMAGES) {
      toast.warn(
        `คุณอัปโหลด ${images.length} รูป (ขั้นต่ำ ${MIN_IMAGES} รูป) — ถ้าจะใส่รูป กรุณาเพิ่มให้ครบ หรือไม่ใส่รูปแล้วกดถัดไปได้เลย`
      );
    }

    onNext?.(buildPayload());
  };

  const handleSaveDraft = () => {
    const payload = buildPayload();
    onSaveDraft?.(payload);
    toast.success("บันทึกร่างรูปภาพเรียบร้อย");
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
