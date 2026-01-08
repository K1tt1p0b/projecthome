"use client";

import listingTypeOptions from "./property-description/listingTypeOptions.json";
import propertyConditionOptions from "./property-description/propertyConditionOptions.json";
import propertyTypeOptions from "./property-description/propertyTypeOptions.json";
import announcerStatusOptions from "./property-description/announcerStatusOptions.json";

import React, { useRef, useState, useMemo } from "react";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import UploadMediaVideoStep from "./upload-media-video";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Checkdetailsandconfirm from "./check-details-and-confirm";

const AddPropertyTabContent = () => {
  const tabBasicRef = useRef(null);
  const tabLocationRef = useRef(null);
  const tabDetailsRef = useRef(null);
  const tabMediaRef = useRef(null);
  const tabVideoRef = useRef(null);

  const goBasic = () => tabBasicRef.current?.click();
  const goLocation = () => tabLocationRef.current?.click();
  const goDetails = () => tabDetailsRef.current?.click();
  const goMedia = () => tabMediaRef.current?.click();
  const goVideo = () => tabVideoRef.current?.click();
  const goConfirm = () => document.getElementById("nav-item6-tab")?.click();

  const [basicInfoForm, setBasicInfoForm] = useState(null);
  const [locationForm, setLocationForm] = useState(null);
  const [detailsForm, setDetailsForm] = useState(null);
  const [mediaForm, setMediaForm] = useState(null);

  // ✅ เพิ่ม: state เก็บวิดีโอที่กรอกจาก Step 5
  const [videoForm, setVideoForm] = useState({ urls: [] });

  // -----------------------------
  // helper: รองรับทั้ง object และ string (กันของเก่าค้าง)
  // -----------------------------
  const pickValue = (v) => (v && typeof v === "object" ? v.value : v);

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

    // ✅ แปลงสถานะผู้ประกาศเป็นภาษาไทย
    const announcerStatusValue =
      basicInfoForm.announcerStatus ||
      basicInfoForm.announcer_status ||
      basicInfoForm.announcerStatus_value;
    const announcerStatusLabel =
      basicInfoForm.announcerStatus_label ||
      (announcerStatusValue
        ? findLabel(announcerStatusOptions, announcerStatusValue)
        : null) ||
      basicInfoForm.announcerStatusText ||
      "-";

    return {
      title: basicInfoForm.title,
      description: basicInfoForm.description,
      price: basicInfoForm.price ?? basicInfoForm.price_text ?? undefined,
      price_text: basicInfoForm.price_text, // ✅ ส่ง price_text ไปด้วย (อาจเป็น "xxxx")
      approxPrice: basicInfoForm.approxPrice_label || basicInfoForm.approxPrice || null, // ✅ ราคาประมาณ
      listingType: listingTypeText || "-",
      propertyType: propertyTypeText || "-",
      condition: conditionText || "-",
      announcerStatus: announcerStatusLabel, // ✅ ใช้ label ภาษาไทย
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
      neighborhood:
        locationForm.neighborhood ||
        locationForm.village ||
        locationForm.projectName ||
        "",
    };
  };

  // -----------------------------
  // Summary: Details
  // ตอนนี้ให้ใช้โครงสร้างจาก DetailsFiled ตรง ๆ
  // (ไม่ map เป็น key ภาษาไทยแล้ว เพราะฝั่ง Checkdetailsandconfirm
  //  มี logic รองรับทั้ง key อังกฤษ/ไทย อยู่แล้ว และต้องการใช้ key ใหม่เช่น
  //  deedNumber, titleDeedImage, landFillStatus, zoningColor, waterFee ฯลฯ)
  // -----------------------------
  const buildDetailsSummary = () => {
    if (!detailsForm) return undefined;
    // ส่ง object เดิมจากฟอร์มไปเลย (มี key ครบตามที่ Checkdetailsandconfirm ใช้)
    return detailsForm;
  };

  // -----------------------------
  // Images
  // -----------------------------
  const buildImages = () => {
    if (!mediaForm) return [];
    return mediaForm.images || [];
  };

  // ✅ ส่งข้อมูลดิบจาก property-description ตรงๆ ให้ PropertySummary จัดการเอง
  const basicInfoSummary = basicInfoForm; // ส่งข้อมูลดิบแทน buildBasicSummary()
  const locationSummary = buildLocationSummary();
  const detailsSummary = buildDetailsSummary();
  const imagesSummary = buildImages();

  return (
    <>
      <nav>
        <div className="nav nav-tabs" id="nav-tab2" role="tablist">
          {/* 1 */}
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

          {/* 2 */}
          <button
            ref={tabLocationRef}
            className="nav-link fw600"
            id="nav-item2-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item2"
            type="button"
            role="tab"
            aria-controls="nav-item2"
            aria-selected="false"
            disabled={!basicInfoForm}
          >
            2. ที่อยู่ทรัพย์
          </button>

          {/* 3 */}
          <button
            ref={tabDetailsRef}
            className="nav-link fw600"
            id="nav-item3-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item3"
            type="button"
            role="tab"
            aria-controls="nav-item3"
            aria-selected="false"
            disabled={!locationForm}
          >
            3. รายละเอียดทรัพย์
          </button>

          {/* 4 */}
          <button
            ref={tabMediaRef}
            className="nav-link fw600"
            id="nav-item4-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item4"
            type="button"
            role="tab"
            aria-controls="nav-item4"
            aria-selected="false"
            disabled={!detailsForm}
          >
            4. เพิ่มรูปทรัพย์
          </button>

          {/* 5 */}
          <button
            ref={tabVideoRef}
            className="nav-link fw600"
            id="nav-item5-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item5"
            type="button"
            role="tab"
            aria-controls="nav-item5"
            aria-selected="false"
            disabled={!mediaForm}
          >
            5. วิดีโอทรัพย์สิน
          </button>

          {/* 6 */}
          <button
            className="nav-link fw600"
            id="nav-item6-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item6"
            type="button"
            role="tab"
            aria-controls="nav-item6"
            aria-selected="false"
            disabled={!mediaForm}
          >
            6. ยืนยัน
          </button>
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        {/* 1 */}
        <div className="tab-pane fade show active" id="nav-item1" role="tabpanel">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">หัวข้อทรัพย์</h4>

            <PropertyDescription
              onNext={(data) => {
                const prevType = pickValue(basicInfoForm?.propertyType);
                const nextType = pickValue(data?.propertyType);
                if (prevType && nextType && prevType !== nextType) {
                  setDetailsForm(null);
                }
                setBasicInfoForm(data);
                goLocation();
              }}
              onSaveDraft={(data) => setBasicInfoForm(data)}
            />
          </div>
        </div>

        {/* 2 */}
        <div className="tab-pane fade" id="nav-item2" role="tabpanel">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">ที่อยู่ทรัพย์</h4>

            <LocationField
              propertyType={propertyTypeValue}
              listingTypes={listingTypeValues}
              onBack={goBasic}
              onNext={(data) => {
                setLocationForm(data);
                goDetails();
              }}
              onSaveDraft={(data) => setLocationForm(data)}
            />
          </div>
        </div>

        {/* 3 */}
        <div className="tab-pane fade" id="nav-item3" role="tabpanel">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">รายละเอียดทรัพย์</h4>

            <DetailsFiled
              propertyType={propertyTypeValue}
              listingTypes={listingTypeValues}
              initialValue={detailsForm}
              onBack={goLocation}
              onNext={(data) => {
                setDetailsForm(data);
                goMedia();
              }}
              onSaveDraft={(data) => setDetailsForm(data)}
            />
          </div>
        </div>

        {/* 4 */}
        <div className="tab-pane fade" id="nav-item4" role="tabpanel">
          <UploadMedia
            onBack={goDetails}
            onNext={(data) => {
              setMediaForm(data);
              goVideo();
            }}
            onSaveDraft={(data) => setMediaForm(data)}
          />
        </div>

        {/* 5 */}
        <div className="tab-pane fade" id="nav-item5" role="tabpanel">
          <UploadMediaVideoStep
            // ✅ ส่งค่าที่ผู้ใช้เคยกรอกไว้กลับเข้าหน้านี้ด้วย (กันหาย)
            initialValue={{
              ...(basicInfoForm || {}),
              ...(locationForm || {}),
              ...(detailsForm || {}),
              ...(mediaForm || {}),
              videoUrls: videoForm?.urls || [],
            }}
            onBack={goMedia}
            onNext={(data) => {
              // data = { urls: [...] }
              setVideoForm(data);
              goConfirm();
            }}
            onSaveDraft={(data) => {
              // data = { urls: [...] } (ถ้าคุณใช้)
              if (data?.urls) setVideoForm(data);
            }}
          />
        </div>

        {/* 6 */}
        <div className="tab-pane fade" id="nav-item6" role="tabpanel">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h3 className="ff-heading fw600 mb10">ตรวจสอบและยืนยัน</h3>

            <div className="row">
              <Checkdetailsandconfirm
                basicInfo={basicInfoSummary}
                location={locationSummary}
                images={imagesSummary}
                details={detailsSummary}

                // ✅ ส่งวิดีโอจาก state (ไม่อ่าน localStorage)
                videos={videoForm?.urls || []}

                onEditBasic={goBasic}
                onEditLocation={goLocation}
                onEditImages={goMedia}
                onEditDetails={goDetails}
                onEditVideo={goVideo} // ✅ เพิ่มปุ่มแก้ไขวิดีโอ

                onSaveDraft={(payload) => {
                  console.log("draft confirm:", payload);
                }}
                onSubmit={(payload) => {
                  console.log("submit final:", payload);
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
