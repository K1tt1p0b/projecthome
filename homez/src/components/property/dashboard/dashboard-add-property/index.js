"use client";

import React, { useRef, useState } from "react";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Checkdetailsandconfirm from "./check-details-and-confirm";

const AddPropertyTabContent = () => {
  // refs สำหรับเปลี่ยนแท็บ
  const tabBasicRef = useRef(null);
  const tabLocationRef = useRef(null);
  const tabMediaRef = useRef(null);
  const tabDetailsRef = useRef(null);

  const goBasic = () => tabBasicRef.current?.click();
  const goLocation = () => tabLocationRef.current?.click();
  const goMedia = () => tabMediaRef.current?.click();
  const goDetails = () => tabDetailsRef.current?.click();
  const goConfirm = () =>
    document.getElementById("nav-item5-tab")?.click();

  // -----------------------------
  // state รวมจากแต่ละ Step
  // -----------------------------
  const [basicInfoForm, setBasicInfoForm] = useState(null);    // จาก PropertyDescription
  const [locationForm, setLocationForm] = useState(null);      // จาก LocationField
  const [mediaForm, setMediaForm] = useState(null);            // จาก UploadMedia (ไว้ต่อทีหลัง)
  const [detailsForm, setDetailsForm] = useState(null);        // จาก DetailsFiled

  // helper แปลง data ให้เข้ารูปที่ Summary ใช้
  const buildBasicSummary = () => {
    if (!basicInfoForm) return undefined;
    return {
      title: basicInfoForm.title,
      description: basicInfoForm.description,
      price: basicInfoForm.price ? Number(basicInfoForm.price) : undefined,
      listingType: basicInfoForm.listingTypes
        ?.map((o) => o.label)
        .join(", "),
      propertyType: basicInfoForm.propertyType?.label,
      condition: basicInfoForm.condition?.label,
    };
  };

  const buildLocationSummary = () => {
    if (!locationForm) return undefined;
    // ถ้าทีหลัง SelectMulitField คืน province/district ฯลฯ มา
    // ก็เพิ่มเข้า object นี้ได้เลย
    return {
      address: locationForm.address,
      province: locationForm.province,
      district: locationForm.district,
      subdistrict: locationForm.subdistrict,
      zipCode: locationForm.zipCode,
      latitude: locationForm.latitude,
      longitude: locationForm.longitude,
    };
  };

  const buildDetailsSummary = () => {
    if (!detailsForm) return undefined;
    return {
      ห้องนอน: detailsForm.bedrooms?.label ?? "",
      ห้องน้ำ: detailsForm.bathrooms?.label ?? "",
      จำนวนชั้น: detailsForm.floors ?? "",
      ที่จอดรถ: detailsForm.parking?.label ?? "",
      "ขนาดที่ดิน (ตร.ม)": detailsForm.size ?? "",
      ทิศทางหน้าบ้าน: detailsForm.direction?.label ?? "",
      การตกแต่ง: detailsForm.furnishing?.label ?? "",
      ปีที่สร้าง: detailsForm.yearBuilt ?? "",
      "หมายเหตุ(เจ้าของ/นายหน้า)": detailsForm.note ?? "",
      amenities: detailsForm.amenities || [],
    };
  };

  // รูปภาพ – ตอนนี้ยังไม่ได้ดึงจริงจาก UploadPhotoGallery
  // เลยให้เป็น [] ไปก่อน หรือจะเอา mock ไปใช้ต่อก็ได้
  const buildImages = () => {
    if (!mediaForm) return [];
    // สมมติทีหลังให้ UploadMedia ส่ง { images: [...] }
    return mediaForm.images || [];
  };

  const basicInfoSummary = buildBasicSummary();
  const locationSummary = buildLocationSummary();
  const detailsSummary = buildDetailsSummary();
  const imagesSummary = buildImages();

  return (
    <>
      <nav>
        <div className="nav nav-tabs" id="nav-tab2" role="tablist">
          <button
            ref={tabBasicRef}
            className="nav-link active fw600 ms-3"
            id="nav-item1-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item1"
            type="button"
            role="tab"
            aria-controls="nav-item1"
            aria-selected="true"
          >
            1. หัวข้อทรัพย์
          </button>
          <button
            ref={tabLocationRef}
            className="nav-link fw600"
            id="nav-item3-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item3"
            type="button"
            role="tab"
            aria-controls="nav-item3"
            aria-selected="false"
          >
            2. ที่อยู่ทรัพย์
          </button>
          <button
            ref={tabMediaRef}
            className="nav-link fw600"
            id="nav-item2-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item2"
            type="button"
            role="tab"
            aria-controls="nav-item2"
            aria-selected="false"
          >
            3. เพิ่มรูปทรัพย์
          </button>
          <button
            ref={tabDetailsRef}
            className="nav-link fw600"
            id="nav-item4-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item4"
            type="button"
            role="tab"
            aria-controls="nav-item4"
            aria-selected="false"
          >
            4. รายละเอียด
          </button>
          <button
            className="nav-link fw600"
            id="nav-item5-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item5"
            type="button"
            role="tab"
            aria-controls="nav-item5"
            aria-selected="false"
          >
            5. ยืนยัน
          </button>
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        {/* 1. หัวข้อทรัพย์ */}
        <div
          className="tab-pane fade show active"
          id="nav-item1"
          role="tabpanel"
          aria-labelledby="nav-item1-tab"
        >
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">หัวข้อทรัพย์</h4>
            <PropertyDescription
              onNext={(data) => {
                setBasicInfoForm(data);
                goLocation();
              }}
              onSaveDraft={(data) => {
                setBasicInfoForm(data);
                console.log("draft basic:", data);
              }}
            />
          </div>
        </div>

        {/* 3. เพิ่มรูปทรัพย์ */}
        <div
          className="tab-pane fade"
          id="nav-item2"
          role="tabpanel"
          aria-labelledby="nav-item2-tab"
        >
          <UploadMedia
            onBack={goLocation}
            onNext={(data) => {
              setMediaForm(data);
              goDetails();
            }}
            onSaveDraft={(data) => {
              setMediaForm(data);
              console.log("draft media:", data);
            }}
          />
        </div>

        {/* 2. ที่อยู่ทรัพย์ */}
        <div
          className="tab-pane fade"
          id="nav-item3"
          role="tabpanel"
          aria-labelledby="nav-item3-tab"
        >
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">ที่อยู่ทรัพย์</h4>
            <LocationField
              onBack={goBasic}
              onNext={(data) => {
                setLocationForm(data);
                goMedia();
              }}
              onSaveDraft={(data) => {
                setLocationForm(data);
                console.log("draft location:", data);
              }}
            />
          </div>
        </div>

        {/* 4. รายละเอียด */}
        <div
          className="tab-pane fade"
          id="nav-item4"
          role="tabpanel"
          aria-labelledby="nav-item4-tab"
        >
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">รายละเอียด</h4>
            <DetailsFiled
              onBack={goMedia}
              onNext={(data) => {
                console.log("DETAILS FROM STEP:", data);
                setDetailsForm(data);
                goConfirm();
              }}
              onSaveDraft={(data) => {
                setDetailsForm(data);
                console.log("draft details:", data);
              }}
            />
          </div>
        </div>

        {/* 5. ยืนยัน */}
        <div
          className="tab-pane fade"
          id="nav-item5"
          role="tabpanel"
          aria-labelledby="nav-item5-tab"
        >
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h3 className="ff-heading fw600 mb10">ตรวจสอบและยืนยัน</h3>
            <div className="row">
              <Checkdetailsandconfirm
                basicInfo={basicInfoSummary}
                location={locationSummary}
                images={imagesSummary}
                details={detailsSummary}
                onEditBasic={goBasic}
                onEditLocation={goLocation}
                onEditImages={goMedia}
                onEditDetails={goDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPropertyTabContent;
