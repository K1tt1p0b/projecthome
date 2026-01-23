"use client";

import React, { useEffect, useMemo, useState } from "react";
import Select from "@/components/common/ClientSelect";
import Amenities from "../Amenities";

// options (ของเดิมคุณ)
import bedroomOptions from "./bedroomOptions.json";
import bathroomOptions from "./bathroomOptions.json";
import parkingOptions from "./parkingOptions.json";

/* =========================
   helpers: ตรงกับ propertyTypeOptions.json ของคุณ
========================= */
const norm = (v) => String(v ?? "").trim();
const isHouseLand = (t) => norm(t) === "house-and-land";
const isLandOnly = (t) => norm(t) === "land";
const isCondo = (t) => norm(t) === "condo";
const isRoomRent = (t) => norm(t) === "room-rent";
const isDormitory = (t) => norm(t) === "dormitory";
const isShop = (t) => norm(t) === "shop" || norm(t) === "business";

/* =========================
   react-select styles
========================= */
const customStyles = {
  control: (provided) => ({
    ...provided,
    background: "#fff",
    borderColor: "#e5e5e5",
    borderRadius: "8px",
    minHeight: "55px",
    paddingLeft: "5px",
    boxShadow: "none",
    "&:hover": { borderColor: "#ddd" },
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#eb6753" : isFocused ? "#fceceb" : undefined,
    color: isSelected ? "#fff" : "#000",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

/* =========================
  helper: map initialValue -> react-select option
========================= */
const toOption = (raw, options) => {
  if (!raw) return null;
  if (typeof raw === "object" && raw.value != null) return raw;
  const found = options?.find((o) => String(o.value) === String(raw));
  return found || null;
};

const isImageFile = (file) => {
  if (!file) return false;
  if (file.type?.startsWith("image/")) return true;
  return /\.(jpg|jpeg|png|webp)$/i.test(file.name || "");
};

const DetailsFiled = ({
  propertyType, // string จาก Step1 (value)
  listingTypes, // เผื่อใช้ต่อ
  initialValue,
  onBack,
  onNext,
  onSaveDraft,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* =========================
     state: common
  ========================= */
  const [note, setNote] = useState(initialValue?.note || "");
  const [amenities, setAmenities] = useState(initialValue?.amenities || []);
  const [error, setError] = useState("");

  /* =========================
     บ้านและที่ดิน (house-and-land)
  ========================= */
  const [bedrooms, setBedrooms] = useState(
    toOption(initialValue?.bedrooms, bedroomOptions)
  );
  const [bathrooms, setBathrooms] = useState(
    toOption(initialValue?.bathrooms, bathroomOptions)
  );

  // ✅ จำนวนชั้น: required
  const [floors, setFloors] = useState(initialValue?.floors || "");

  // parking optional (ของเดิม)
  const [parking, setParking] = useState(
    toOption(initialValue?.parking, parkingOptions)
  );

  const [usableArea, setUsableArea] = useState(initialValue?.usableArea || "");

  // land fields (ใช้กับ house-and-land และ land)
  const [landSqw, setLandSqw] = useState(initialValue?.landSqw || "");
  const [frontage, setFrontage] = useState(initialValue?.frontage || "");
  const [depth, setDepth] = useState(initialValue?.depth || "");
  const [roadWidth, setRoadWidth] = useState(initialValue?.roadWidth || "");

  // ✅ เอกสารสิทธิ: ใช้เป็น "เลขโฉนด" (required)
  const [deedNumber, setDeedNumber] = useState(
    initialValue?.deedNumber ?? initialValue?.titleDeed ?? ""
  );

  // ✅ รูปโฉนด (บังคับเฉพาะ house-and-land / land)
  const [titleDeedImage, setTitleDeedImage] = useState(
    initialValue?.titleDeedImage ?? null
  );

  // ✅ เพิ่ม: ชื่อไฟล์รูปโฉนด
  const [titleDeedImageName, setTitleDeedImageName] = useState(
    initialValue?.titleDeedImageName ?? ""
  );

  /* =========================
     ที่ดินเปล่า: เพิ่ม "สภาพที่ดิน" + "ผังสี"
  ========================= */
  const LAND_FILL_OPTIONS = useMemo(
    () => [
      { value: "", label: "เลือกสภาพที่ดิน" },
      { value: "filled", label: "ถมแล้ว" },
      { value: "not-filled", label: "ยังไม่ถม" },
      { value: "unknown", label: "ไม่แน่ใจ/ไม่ระบุ" },
    ],
    []
  );

  const ZONING_COLOR_OPTIONS = useMemo(
    () => [
      { value: "", label: "เลือกผังสี" },
      { value: "red", label: "ผังสีแดง" },
      { value: "brown", label: "ผังสีน้ำตาล" },
      { value: "yellow", label: "ผังสีเหลือง" },
      { value: "orange", label: "ผังสีส้ม" },
      { value: "purple", label: "ผังสีม่วง" },
      { value: "green", label: "ผังสีเขียว" },
      { value: "blue", label: "ผังสีน้ำเงิน" },
      { value: "other", label: "อื่นๆ/ไม่แน่ใจ" },
    ],
    []
  );

  const [landFillStatus, setLandFillStatus] = useState(
    initialValue?.landFillStatus ?? ""
  );
  const [zoningColor, setZoningColor] = useState(
    initialValue?.zoningColor ?? ""
  );

  /* =========================
     คอนโด / ห้องเช่า / หอพัก (เหมือนกัน)
  ========================= */
  // required
  const [unitFloor, setUnitFloor] = useState(initialValue?.unitFloor || "");
  const [roomArea, setRoomArea] = useState(initialValue?.roomArea || "");

  // optional
  const [building, setBuilding] = useState(initialValue?.building || "");
  const [waterFee, setWaterFee] = useState(initialValue?.waterFee || "");
  const [electricFee, setElectricFee] = useState(initialValue?.electricFee || "");
  const [commonFee, setCommonFee] = useState(initialValue?.commonFee || "");

  /* =========================
     ร้านค้า/ธุรกิจ (ของเดิมคุณ)
  ========================= */
  const [shopArea, setShopArea] = useState(initialValue?.shopArea || ""); // ตร.ม. *
  const [shopFloor, setShopFloor] = useState(initialValue?.shopFloor || ""); // ชั้น/ทำเลชั้น *
  const [shopFrontage, setShopFrontage] = useState(initialValue?.shopFrontage || "");
  const [shopDepth, setShopDepth] = useState(initialValue?.shopDepth || "");
  const [shopRoadWidth, setShopRoadWidth] = useState(initialValue?.shopRoadWidth || "");

  /* =========================
     ✅ เพิ่มใหม่ตามที่บอก (ไม่เอาอะไรออก)
     - ประเภทร้าน *
     - ระยะสัญญา *
  ========================= */
  const [shopBusinessType, setShopBusinessType] = useState(
    initialValue?.shopBusinessType ?? ""
  );
  const [contractDuration, setContractDuration] = useState(
    initialValue?.contractDuration ?? ""
  );

  /* =========================
     sync initialValue (สำคัญสำหรับหน้าแก้ไข)
  ========================= */
  useEffect(() => {
    if (!initialValue) return;

    setNote(initialValue.note ?? "");
    setAmenities(Array.isArray(initialValue.amenities) ? initialValue.amenities : []);
    setError("");

    // house-land
    setBedrooms(toOption(initialValue.bedrooms, bedroomOptions));
    setBathrooms(toOption(initialValue.bathrooms, bathroomOptions));
    setParking(toOption(initialValue.parking, parkingOptions));
    setFloors(initialValue.floors ?? "");
    setUsableArea(initialValue.usableArea ?? "");
    setLandSqw(initialValue.landSqw ?? "");
    setFrontage(initialValue.frontage ?? "");
    setDepth(initialValue.depth ?? "");
    setRoadWidth(initialValue.roadWidth ?? "");

    setDeedNumber(initialValue.deedNumber ?? initialValue.titleDeed ?? "");

    if (initialValue.titleDeedImage !== undefined) {
      setTitleDeedImage(initialValue.titleDeedImage ?? null);
    } else if (
      Array.isArray(initialValue.titleDeedImages) &&
      initialValue.titleDeedImages[0]
    ) {
      setTitleDeedImage(initialValue.titleDeedImages[0]);
    }

    setTitleDeedImageName(
      initialValue.titleDeedImageName ??
        initialValue.titleDeedImage?.name ??
        ""
    );

    // land extra
    setLandFillStatus(initialValue.landFillStatus ?? "");
    setZoningColor(initialValue.zoningColor ?? "");

    // condo/room/dorm
    setUnitFloor(initialValue.unitFloor ?? "");
    setRoomArea(initialValue.roomArea ?? "");
    setBuilding(initialValue.building ?? "");
    setWaterFee(initialValue.waterFee ?? "");
    setElectricFee(initialValue.electricFee ?? "");
    setCommonFee(initialValue.commonFee ?? "");

    // shop (เดิม)
    setShopArea(initialValue.shopArea ?? "");
    setShopFloor(initialValue.shopFloor ?? "");
    setShopFrontage(initialValue.shopFrontage ?? "");
    setShopDepth(initialValue.shopDepth ?? "");
    setShopRoadWidth(initialValue.shopRoadWidth ?? "");

    // ✅ เพิ่มใหม่
    setShopBusinessType(initialValue.shopBusinessType ?? "");
    setContractDuration(initialValue.contractDuration ?? "");
  }, [initialValue]);

  /* =========================
     reset เมื่อเปลี่ยนประเภท (กันข้อมูลค้าง)
  ========================= */
  useEffect(() => {
    setError("");

    // reset house-land
    if (!isHouseLand(propertyType)) {
      setBedrooms(null);
      setBathrooms(null);
      setParking(null);
      setFloors("");
      setUsableArea("");
    }

    // land shared
    if (!isLandOnly(propertyType) && !isHouseLand(propertyType)) {
      setLandSqw("");
      setFrontage("");
      setDepth("");
      setRoadWidth("");
      setDeedNumber("");
      setTitleDeedImage(null);
      setTitleDeedImageName("");
      setLandFillStatus("");
      setZoningColor("");
    }

    // condo/room/dorm
    if (!isCondo(propertyType) && !isRoomRent(propertyType) && !isDormitory(propertyType)) {
      setUnitFloor("");
      setRoomArea("");
      setBuilding("");
      setWaterFee("");
      setElectricFee("");
      setCommonFee("");
    }

    // shop (เดิม + เพิ่มใหม่)
    if (!isShop(propertyType)) {
      setShopArea("");
      setShopFloor("");
      setShopFrontage("");
      setShopDepth("");
      setShopRoadWidth("");

      // ✅ เพิ่มใหม่
      setShopBusinessType("");
      setContractDuration("");
    }
  }, [propertyType]);

  /* =========================
     ต้องบังคับแนบรูปโฉนดไหม?
     - บังคับเฉพาะ house-and-land + land
========================= */
  const mustHaveDeedImage = useMemo(() => {
    if (!isHouseLand(propertyType) && !isLandOnly(propertyType)) return false;
    if (typeof titleDeedImage === "string" && titleDeedImage.trim()) return false;
    if (titleDeedImage instanceof File) return false;
    return true;
  }, [propertyType, titleDeedImage]);

  const deedPreviewText = useMemo(() => {
    if (titleDeedImageName) return titleDeedImageName;
    if (!titleDeedImage) return "";
    if (typeof titleDeedImage === "string") return titleDeedImage;
    if (titleDeedImage?.name) return titleDeedImage.name;
    return "แนบไฟล์แล้ว";
  }, [titleDeedImage, titleDeedImageName]);

  const handleDeedFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setTitleDeedImage(null);
      setTitleDeedImageName("");
      return;
    }

    if (!isImageFile(file)) {
      setError("กรุณาอัปโหลดไฟล์รูปเท่านั้น (jpg, png, webp)");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("ไฟล์รูปต้องไม่เกิน 5MB");
      e.target.value = "";
      return;
    }

    setError("");
    setTitleDeedImage(file);
    setTitleDeedImageName(file.name);
  };

  /* =========================
     build payload
  ========================= */
  const buildFormData = () => ({
    propertyType,
    listingTypes: Array.isArray(listingTypes) ? listingTypes : [],

    // common
    amenities,
    note,

    // house-land
    bedrooms,
    bathrooms,
    floors,
    parking,
    usableArea,

    // land shared
    landSqw,
    frontage,
    depth,
    roadWidth,

    // deed
    deedNumber,
    titleDeedImage,
    titleDeedImageName,

    // land only extra
    landFillStatus,
    zoningColor,

    // condo/room/dorm
    unitFloor,
    roomArea,
    building,
    waterFee,
    electricFee,
    commonFee,

    // shop (เดิม)
    shopArea,
    shopFloor,
    shopFrontage,
    shopDepth,
    shopRoadWidth,

    // ✅ เพิ่มใหม่
    shopBusinessType,
    contractDuration,
  });

  /* =========================
     validation (required)
  ========================= */
  const handleNext = () => {
    // บ้านและที่ดิน
    if (isHouseLand(propertyType)) {
      if (!bedrooms || !bathrooms) return setError("กรุณาระบุ ห้องนอน และ ห้องน้ำ");
      if (!usableArea) return setError("กรุณาระบุ พื้นที่ใช้สอย (ตร.ม.)");
      if (!landSqw) return setError("กรุณาระบุ ขนาดที่ดิน (ตร.ว.)");
      if (!String(deedNumber || "").trim()) return setError("กรุณาระบุ เลขโฉนด/เอกสารสิทธิ");
      if (!String(floors || "").trim()) return setError("กรุณาระบุ จำนวนชั้น");
      if (mustHaveDeedImage) return setError("กรุณาอัปโหลดรูปเอกสารโฉนด");
    }

    // ที่ดินเปล่า
    if (isLandOnly(propertyType)) {
      if (!landSqw) return setError("กรุณาระบุ ขนาดที่ดิน (ตร.ว.)");
      if (!String(deedNumber || "").trim()) return setError("กรุณาระบุ เลขโฉนด/เอกสารสิทธิ");
      if (mustHaveDeedImage) return setError("กรุณาอัปโหลดรูปเอกสารโฉนด");
      if (!String(landFillStatus || "").trim())
        return setError("กรุณาเลือก สภาพที่ดิน (ถมแล้ว/ยังไม่ถม)");
      if (!String(zoningColor || "").trim()) return setError("กรุณาเลือก ผังสี");
    }

    // คอนโด/ห้องเช่า/หอพัก
    if (isCondo(propertyType) || isRoomRent(propertyType) || isDormitory(propertyType)) {
      if (!String(unitFloor || "").trim()) return setError("กรุณาระบุ ชั้น");
      if (!String(roomArea || "").trim()) return setError("กรุณาระบุ ขนาดห้อง (ตร.ม.)");
    }

    // ร้านค้า/ธุรกิจ (เดิม + เพิ่มใหม่)
    if (isShop(propertyType)) {
      // เดิม
      if (!String(shopArea || "").trim()) return setError("กรุณาระบุ ขนาดพื้นที่ร้าน (ตร.ม.)");
      if (!String(shopFloor || "").trim()) return setError("กรุณาระบุ ชั้น/ทำเลชั้น");

      // ✅ เพิ่มใหม่
      if (!String(shopBusinessType || "").trim()) return setError("กรุณาระบุ ประเภทร้าน");
      if (!String(contractDuration || "").trim()) return setError("กรุณาระบุ ระยะสัญญา");
    }

    setError("");
    onNext?.(buildFormData());
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(buildFormData());
    alert("บันทึกร่างรายละเอียดทรัพย์เรียบร้อย");
  };

  const typeTitle = useMemo(() => {
    if (isHouseLand(propertyType)) return "รายละเอียดบ้านและที่ดิน";
    if (isLandOnly(propertyType)) return "รายละเอียดที่ดินเปล่า";
    if (isCondo(propertyType)) return "รายละเอียดคอนโด";
    if (isRoomRent(propertyType)) return "รายละเอียดห้องเช่า";
    if (isDormitory(propertyType)) return "รายละเอียดหอพัก";
    if (isShop(propertyType)) return "รายละเอียดร้านค้า";
    return "รายละเอียด";
  }, [propertyType]);

  return (
    <form
      className="form-style1"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="row">
        <div className="col-12 mb10">
          <p className="text-muted mb10" style={{ fontSize: 13 }}>
            ช่องที่มี <span className="text-danger">*</span> จำเป็นต้องกรอก
          </p>
        </div>

        <div className="col-12 mb10">
          <h4 className="title fz17 mb10">{typeTitle}</h4>
        </div>

        {/* =======================
            บ้านและที่ดิน
        ======================= */}
        {isHouseLand(propertyType) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                ห้องนอน <span className="text-danger">*</span>
              </label>
              <Select
                value={bedrooms}
                onChange={setBedrooms}
                options={bedroomOptions}
                styles={customStyles}
                isSearchable={false}
                menuPortalTarget={mounted ? document.body : null}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                ห้องน้ำ <span className="text-danger">*</span>
              </label>
              <Select
                value={bathrooms}
                onChange={setBathrooms}
                options={bathroomOptions}
                styles={customStyles}
                isSearchable={false}
                menuPortalTarget={mounted ? document.body : null}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                พื้นที่ใช้สอย (ตร.ม.) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={usableArea}
                onChange={(e) => setUsableArea(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                ขนาดที่ดิน (ตร.ว.) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={landSqw}
                onChange={(e) => setLandSqw(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                เอกสารสิทธิ (เลขโฉนด) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกเลขโฉนด"
                value={deedNumber}
                onChange={(e) => setDeedNumber(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-6 mb20">
              <label className="fw600 mb10">
                รูปเอกสารโฉนด <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="form-control"
                required={mustHaveDeedImage}
                onChange={handleDeedFileChange}
                style={{ height: "55px", paddingTop: "12px" }}
              />
              {deedPreviewText && (
                <div className="mt10 text-muted" style={{ fontSize: 13 }}>
                  ไฟล์เดิม/ที่เลือก: {deedPreviewText}
                </div>
              )}
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                จำนวนชั้น <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ถนนหน้าบ้านกว้าง (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={roadWidth}
                onChange={(e) => setRoadWidth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">หน้ากว้างที่ดิน (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ความลึกที่ดิน (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ที่จอดรถ (คัน)</label>
              <Select
                value={parking}
                onChange={setParking}
                options={parkingOptions}
                styles={customStyles}
                isSearchable={false}
                menuPortalTarget={mounted ? document.body : null}
              />
            </div>
          </>
        )}

        {/* =======================
            ที่ดินเปล่า
        ======================= */}
        {isLandOnly(propertyType) && (
          <>
            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                ขนาดที่ดิน (ตร.ว.) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={landSqw}
                onChange={(e) => setLandSqw(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                เอกสารสิทธิ (เลขโฉนด) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกเลขโฉนด"
                value={deedNumber}
                onChange={(e) => setDeedNumber(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-12 col-md-8 mb20">
              <label className="fw600 mb10">
                รูปเอกสารโฉนด <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="form-control"
                required={mustHaveDeedImage}
                onChange={handleDeedFileChange}
                style={{ height: "55px", paddingTop: "12px" }}
              />
              {deedPreviewText && (
                <div className="mt10 text-muted" style={{ fontSize: 13 }}>
                  ไฟล์เดิม/ที่เลือก: {deedPreviewText}
                </div>
              )}
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                สภาพที่ดิน <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                value={landFillStatus}
                onChange={(e) => setLandFillStatus(e.target.value)}
                style={{ height: "55px" }}
              >
                {LAND_FILL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                ผังสี <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                value={zoningColor}
                onChange={(e) => setZoningColor(e.target.value)}
                style={{ height: "55px" }}
              >
                {ZONING_COLOR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">ถนนหน้าที่ดินกว้าง (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={roadWidth}
                onChange={(e) => setRoadWidth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">หน้ากว้างที่ดิน (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">ความลึกที่ดิน (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>
          </>
        )}

        {/* =======================
            คอนโด + ห้องเช่า + หอพัก
        ======================= */}
        {(isCondo(propertyType) || isRoomRent(propertyType) || isDormitory(propertyType)) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                ชั้น <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={unitFloor}
                onChange={(e) => setUnitFloor(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">
                ขนาดห้อง (ตร.ม.) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={roomArea}
                onChange={(e) => setRoomArea(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">อาคาร/ตึก</label>
              <input
                type="text"
                className="form-control"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ค่าน้ำ</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น 20/หน่วย หรือ เหมาจ่าย"
                value={waterFee}
                onChange={(e) => setWaterFee(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ค่าไฟ</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น 7/หน่วย หรือ ตามมิเตอร์"
                value={electricFee}
                onChange={(e) => setElectricFee(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ค่าส่วนกลาง</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น 1,200/เดือน"
                value={commonFee}
                onChange={(e) => setCommonFee(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>
          </>
        )}

        {/* =======================
            ✅ ร้านค้า/ธุรกิจ (ของเดิม + เพิ่มใหม่)
        ======================= */}
        {isShop(propertyType) && (
          <>
            {/* ✅ ของเดิม: ขนาดพื้นที่ / ชั้นทำเล */}
            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                ขนาดพื้นที่ร้าน (ตร.ม.) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={shopArea}
                onChange={(e) => setShopArea(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                ชั้น/ทำเลชั้น <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น ชั้น 1 / ชั้น 2 / อาคารแถว"
                value={shopFloor}
                onChange={(e) => setShopFloor(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            {/* ✅ เพิ่มใหม่: ประเภทร้าน */}
            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                ประเภทร้าน <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น คาเฟ่ / ร้านอาหาร / ร้านเสริมสวย"
                value={shopBusinessType}
                onChange={(e) => setShopBusinessType(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            {/* ✅ ของเดิม: ถนนหน้าร้าน / หน้ากว้าง / ความลึก */}
            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">ถนนหน้าร้านกว้าง (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={shopRoadWidth}
                onChange={(e) => setShopRoadWidth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">หน้ากว้าง (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={shopFrontage}
                onChange={(e) => setShopFrontage(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">ความลึก (ม.) (ถ้ามี)</label>
              <input
                type="number"
                className="form-control"
                value={shopDepth}
                onChange={(e) => setShopDepth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            {/* ✅ เพิ่มใหม่: ระยะสัญญา */}
            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">
                ระยะสัญญา <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น 1 ปี / 3 ปี / ต่อสัญญาได้"
                value={contractDuration}
                onChange={(e) => setContractDuration(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>
          </>
        )}
      </div>

      {/* amenities */}
      <div className="row mt30">
        <div className="col-12">
          <h4 className="fz17 mb20">สิ่งอำนวยความสะดวก</h4>
          <Amenities value={amenities} onChange={setAmenities} />
        </div>
      </div>

      {/* note */}
      <div className="row mt30">
        <div className="col-12">
          <label className="fw600 mb10">รายละเอียดเพิ่มเติม</label>
          <textarea
            className="form-control"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="row mt10">
          <div className="col-12">
            <p className="text-danger">{error}</p>
          </div>
        </div>
      )}

      {/* buttons */}
      <div className="row mt20">
        <div className="col-12 d-flex justify-content-between">
          <button type="button" className="ud-btn btn-light" onClick={onBack}>
            ย้อนกลับ
          </button>

          <div className="d-flex gap-2">
            <button type="button" className="ud-btn btn-light" onClick={handleSaveDraft}>
              บันทึกร่าง
            </button>
            <button type="submit" className="ud-btn btn-thm">
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DetailsFiled;
