"use client";

import listingTypeOptions from "./property-description/listingTypeOptions.json";
import propertyConditionOptions from "./property-description/propertyConditionOptions.json";
import propertyTypeOptions from "./property-description/propertyTypeOptions.json";


import React, { useRef, useState, useMemo } from "react";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Checkdetailsandconfirm from "./check-details-and-confirm";



const AddPropertyTabContent = () => {
  const tabBasicRef = useRef(null);
  const tabLocationRef = useRef(null);
  const tabMediaRef = useRef(null);
  const tabDetailsRef = useRef(null);

  const goBasic = () => tabBasicRef.current?.click();
  const goLocation = () => tabLocationRef.current?.click();
  const goMedia = () => tabMediaRef.current?.click();
  const goDetails = () => tabDetailsRef.current?.click();
  const goConfirm = () => document.getElementById("nav-item5-tab")?.click();

  const [basicInfoForm, setBasicInfoForm] = useState(null);
  const [locationForm, setLocationForm] = useState(null);
  const [mediaForm, setMediaForm] = useState(null);
  const [detailsForm, setDetailsForm] = useState(null);

  // -----------------------------
  // helper: รองรับทั้ง object และ string (กันของเก่าค้าง)
  // -----------------------------
  const pickValue = (v) => (v && typeof v === "object" ? v.value : v);
  const pickLabel = (v) => (v && typeof v === "object" ? v.label : v);

  const listingTypeValues = useMemo(() => {
    const raw = basicInfoForm?.listingTypes ?? [];
    return raw.map((x) => pickValue(x)).filter(Boolean);
  }, [basicInfoForm]);

  const propertyTypeValue = useMemo(
    () => pickValue(basicInfoForm?.propertyType),
    [basicInfoForm]
  );

  const findLabel = (options, value) => {
    if (!value) return "-";
    return options?.find((o) => o.value === value)?.label ?? value;
  };


  // -----------------------------
  // Summary: Basic
  // -----------------------------
  const buildBasicSummary = () => {
  if (!basicInfoForm) return undefined;

  const listingValues = (basicInfoForm.listingTypes ?? [])
    .map((x) => pickValue(x))
    .filter(Boolean);

  const listingTypeText =
    Array.isArray(basicInfoForm.listingTypes_label) &&
    basicInfoForm.listingTypes_label.length > 0
      ? basicInfoForm.listingTypes_label.join(", ")
      : listingValues.map((v) => findLabel(listingTypeOptions, v)).join(", ");

  const propertyTypeText =
    basicInfoForm.propertyType_label ||
    findLabel(propertyTypeOptions, pickValue(basicInfoForm.propertyType));

  const conditionText =
    basicInfoForm.condition_label ||
    findLabel(propertyConditionOptions, pickValue(basicInfoForm.condition));

  return {
    title: basicInfoForm.title,
    description: basicInfoForm.description,
    price: basicInfoForm.price ?? basicInfoForm.price_text ?? undefined,
    listingType: listingTypeText || "-",
    propertyType: propertyTypeText || "-",
    condition: conditionText || "-",
  };
};


  // -----------------------------
  // Summary: Location
  // -----------------------------
  const buildLocationSummary = () => {
    if (!locationForm) return undefined;
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

  // -----------------------------
  // ✅ Summary: Details (คุม key ไทยเอง ระยะยาว)
  // รองรับ propertyType value:
  // - house-and-land
  // - land
  // - condo
  // - room-rent
  // -----------------------------
  const buildDetailsSummary = () => {
    if (!detailsForm) return undefined;

    const add = (obj, key, value) => {
      if (value === undefined || value === null) return obj;
      if (typeof value === "string" && value.trim() === "") return obj;
      obj[key] = value;
      return obj;
    };

    const summary = {};

    // common (ทุกประเภท)
    add(summary, "ทิศหน้าทรัพย์", detailsForm.direction?.label || "");
    add(summary, "การตกแต่ง", detailsForm.furnishing?.label || "");
    add(summary, "ปีที่สร้าง", detailsForm.yearBuilt || "");
    add(summary, "หมายเหตุ(เจ้าของ/นายหน้า)", detailsForm.note || "");
    add(summary, "amenities", detailsForm.amenities || []);

    const t = propertyTypeValue; // ✅ value จริงจาก JSON

    // ✅ บ้านและที่ดิน
    if (t === "house-and-land") {
      add(summary, "ห้องนอน", detailsForm.bedrooms?.label || "");
      add(summary, "ห้องน้ำ", detailsForm.bathrooms?.label || "");
      add(summary, "จำนวนชั้น", detailsForm.floors || "");
      add(summary, "ที่จอดรถ", detailsForm.parking?.label || "");
      add(summary, "พื้นที่ใช้สอย (ตร.ม.)", detailsForm.usableArea || "");
      add(summary, "ขนาดที่ดิน (ตร.ว.)", detailsForm.landSqw || "");
      add(summary, "เอกสารสิทธิ", detailsForm.titleDeed || "");
      add(summary, "ถนนหน้าบ้านกว้าง (ม.)", detailsForm.roadWidth || "");
      add(summary, "หน้ากว้างที่ดิน (ม.)", detailsForm.frontage || "");
      add(summary, "ความลึกที่ดิน (ม.)", detailsForm.depth || "");
    }

    // ที่ดินเปล่า
    if (t === "land") {
      add(summary, "ขนาดที่ดิน (ตร.ว.)", detailsForm.landSqw || "");
      add(summary, "เอกสารสิทธิ", detailsForm.titleDeed || "");
      add(summary, "ถนนหน้าที่ดินกว้าง (ม.)", detailsForm.roadWidth || "");
      add(summary, "หน้ากว้างที่ดิน (ม.)", detailsForm.frontage || "");
      add(summary, "ความลึกที่ดิน (ม.)", detailsForm.depth || "");
    }

    // คอนโด
    if (t === "condo") {
      add(summary, "ชื่อโครงการ", detailsForm.projectName || "");
      add(summary, "อาคาร/ตึก", detailsForm.building || "");
      add(summary, "ชั้น", detailsForm.unitFloor || "");
      add(summary, "ขนาดห้อง (ตร.ม.)", detailsForm.roomArea || "");
      add(summary, "ประเภทห้อง", detailsForm.roomType || "");
      add(summary, "สิทธิ์ที่จอดรถ", detailsForm.condoParking || "");
    }

    // ✅ ห้องเช่า
    if (t === "room-rent") {
      add(summary, "ขนาดห้อง (ตร.ม.)", detailsForm.roomAreaRent || "");
      add(summary, "ชั้นที่อยู่", detailsForm.rentFloor || "");
      add(summary, "ห้องน้ำในตัว", detailsForm.bathroomPrivate ? "มี" : "ไม่มี");
      add(summary, "รวมอินเทอร์เน็ต", detailsForm.internetIncluded ? "รวม" : "ไม่รวม");
      add(summary, "ค่าไฟ (บาท/หน่วย)", detailsForm.electricRate || "");
      add(summary, "ค่าน้ำ", detailsForm.waterRate || "");
    }

    return summary;
  };

  // -----------------------------
  // Images
  // -----------------------------
  const buildImages = () => {
    if (!mediaForm) return [];
    return mediaForm.images || [];
  };

  const basicInfoSummary = buildBasicSummary();
  const locationSummary = buildLocationSummary();
  const detailsSummary = buildDetailsSummary(); // ✅ ไทย
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
                // ถ้า propertyType เปลี่ยน -> ล้าง detailsForm กันข้อมูลค้าง
                const prevType = pickValue(basicInfoForm?.propertyType);
                const nextType = pickValue(data?.propertyType);
                if (prevType && nextType && prevType !== nextType) {
                  setDetailsForm(null);
                }
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
              propertyType={propertyTypeValue}
              listingTypes={listingTypeValues}
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
              propertyType={propertyTypeValue}
              listingTypes={listingTypeValues}
              initialValue={detailsForm}
              onBack={goMedia}
              onNext={(data) => {
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
                onSaveDraft={(payload) => {
                  console.log("draft confirm:", payload);
                  // TODO: call API save draft
                }}
                onSubmit={(payload) => {
                  console.log("submit final:", payload);
                  // TODO: call API submit final
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPropertyTabContent;
