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
const isBusiness = (t) => norm(t) === "business";

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
  if (typeof raw === "object" && raw.value != null) return raw; // already option
  const found = options?.find((o) => String(o.value) === String(raw));
  return found || null;
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
  const [floors, setFloors] = useState(initialValue?.floors || "");
  const [parking, setParking] = useState(
    toOption(initialValue?.parking, parkingOptions)
  );
  const [usableArea, setUsableArea] = useState(initialValue?.usableArea || ""); // ตร.ม.

  // land fields (ใช้กับ house-and-land และ land)
  const [landSqw, setLandSqw] = useState(initialValue?.landSqw || ""); // ตร.ว.
  const [frontage, setFrontage] = useState(initialValue?.frontage || ""); // หน้ากว้าง (ม.)
  const [depth, setDepth] = useState(initialValue?.depth || ""); // ลึก (ม.)
  const [roadWidth, setRoadWidth] = useState(initialValue?.roadWidth || ""); // ถนนกว้าง (ม.)
  const [titleDeed, setTitleDeed] = useState(initialValue?.titleDeed || ""); // เอกสารสิทธิ

  // รูปโฉนด (ไม่บังคับ) รองรับได้ทั้ง File หรือ URL/string
  const [titleDeedImage, setTitleDeedImage] = useState(
    initialValue?.titleDeedImage ?? null
  );

  /* =========================
     คอนโด (condo)
  ========================= */
  const [projectName, setProjectName] = useState(initialValue?.projectName || "");
  const [building, setBuilding] = useState(initialValue?.building || "");
  const [unitFloor, setUnitFloor] = useState(initialValue?.unitFloor || "");
  const [roomArea, setRoomArea] = useState(initialValue?.roomArea || ""); // ตร.ม.
  const [roomType, setRoomType] = useState(initialValue?.roomType || "");
  const [condoParking, setCondoParking] = useState(initialValue?.condoParking || "");

  /* =========================
     ห้องเช่า (room-rent)
  ========================= */
  const [roomAreaRent, setRoomAreaRent] = useState(initialValue?.roomAreaRent || "");
  const [rentFloor, setRentFloor] = useState(initialValue?.rentFloor || "");
  const [bathroomPrivate, setBathroomPrivate] = useState(
    initialValue?.bathroomPrivate ?? true
  );
  const [internetIncluded, setInternetIncluded] = useState(
    initialValue?.internetIncluded ?? false
  );
  const [electricRate, setElectricRate] = useState(initialValue?.electricRate || "");
  const [waterRate, setWaterRate] = useState(initialValue?.waterRate || "");

  /* =========================
     เชิงกิจการ (เผื่ออนาคต)
  ========================= */
  const [businessType, setBusinessType] = useState(initialValue?.businessType || "");
  const [businessArea, setBusinessArea] = useState(initialValue?.businessArea || "");
  const [restrooms, setRestrooms] = useState(initialValue?.restrooms || "");
  const [powerPhase, setPowerPhase] = useState(initialValue?.powerPhase || "");

  /* =========================
     sync initialValue (สำคัญสำหรับหน้าแก้ไข)
  ========================= */
  useEffect(() => {
    if (!initialValue) return;

    setNote(initialValue.note ?? "");
    setAmenities(Array.isArray(initialValue.amenities) ? initialValue.amenities : []);
    setError("");

    setBedrooms(toOption(initialValue.bedrooms, bedroomOptions));
    setBathrooms(toOption(initialValue.bathrooms, bathroomOptions));
    setParking(toOption(initialValue.parking, parkingOptions));

    setFloors(initialValue.floors ?? "");
    setUsableArea(initialValue.usableArea ?? "");

    setLandSqw(initialValue.landSqw ?? "");
    setFrontage(initialValue.frontage ?? "");
    setDepth(initialValue.depth ?? "");
    setRoadWidth(initialValue.roadWidth ?? "");
    setTitleDeed(initialValue.titleDeed ?? "");

    // รูปโฉนด: ถ้าเป็น list ก็หยิบตัวแรกมาโชว์
    if (initialValue.titleDeedImage !== undefined) {
      setTitleDeedImage(initialValue.titleDeedImage ?? null);
    } else if (Array.isArray(initialValue.titleDeedImages) && initialValue.titleDeedImages[0]) {
      setTitleDeedImage(initialValue.titleDeedImages[0]);
    }

    setProjectName(initialValue.projectName ?? "");
    setBuilding(initialValue.building ?? "");
    setUnitFloor(initialValue.unitFloor ?? "");
    setRoomArea(initialValue.roomArea ?? "");
    setRoomType(initialValue.roomType ?? "");
    setCondoParking(initialValue.condoParking ?? "");

    setRoomAreaRent(initialValue.roomAreaRent ?? "");
    setRentFloor(initialValue.rentFloor ?? "");
    setBathroomPrivate(initialValue.bathroomPrivate ?? true);
    setInternetIncluded(initialValue.internetIncluded ?? false);
    setElectricRate(initialValue.electricRate ?? "");
    setWaterRate(initialValue.waterRate ?? "");

    setBusinessType(initialValue.businessType ?? "");
    setBusinessArea(initialValue.businessArea ?? "");
    setRestrooms(initialValue.restrooms ?? "");
    setPowerPhase(initialValue.powerPhase ?? "");
  }, [initialValue]);

  /* =========================
     reset เมื่อเปลี่ยนประเภท (กันข้อมูลค้าง)
  ========================= */
  useEffect(() => {
    setError("");

    // reset บ้าน
    if (!isHouseLand(propertyType)) {
      setBedrooms(null);
      setBathrooms(null);
      setParking(null);
      setFloors("");
      setUsableArea("");
    }

    // reset land fields (ใช้ร่วม house-and-land + land)
    if (!isLandOnly(propertyType) && !isHouseLand(propertyType)) {
      setLandSqw("");
      setFrontage("");
      setDepth("");
      setRoadWidth("");
      setTitleDeed("");
      setTitleDeedImage(null);
    }

    // reset condo
    if (!isCondo(propertyType)) {
      setProjectName("");
      setBuilding("");
      setUnitFloor("");
      setRoomArea("");
      setRoomType("");
      setCondoParking("");
    }

    // reset room rent
    if (!isRoomRent(propertyType)) {
      setRoomAreaRent("");
      setRentFloor("");
      setBathroomPrivate(true);
      setInternetIncluded(false);
      setElectricRate("");
      setWaterRate("");
    }

    // reset business
    if (!isBusiness(propertyType)) {
      setBusinessType("");
      setBusinessArea("");
      setRestrooms("");
      setPowerPhase("");
    }
  }, [propertyType]);

  /* =========================
     build payload
  ========================= */
  const buildFormData = () => ({
    propertyType,
    listingTypes: Array.isArray(listingTypes) ? listingTypes : [],

    // common
    amenities,
    note,

    // house
    bedrooms,
    bathrooms,
    floors,
    parking,
    usableArea,

    // land
    landSqw,
    frontage,
    depth,
    roadWidth,
    titleDeed,

    // รูปโฉนด
    titleDeedImage,

    // condo
    projectName,
    building,
    unitFloor,
    roomArea,
    roomType,
    condoParking,

    // room rent
    roomAreaRent,
    rentFloor,
    bathroomPrivate,
    internetIncluded,
    electricRate,
    waterRate,

    // business
    businessType,
    businessArea,
    restrooms,
    powerPhase,
  });

  /* =========================
     validation (required)
  ========================= */
  const handleNext = () => {
    // บ้านและที่ดิน
    if (isHouseLand(propertyType)) {
      if (!bedrooms || !bathrooms) {
        setError("กรุณาระบุ ห้องนอน และ ห้องน้ำ");
        return;
      }
      if (!usableArea) {
        setError("กรุณาระบุ พื้นที่ใช้สอย (ตร.ม.)");
        return;
      }
      if (!landSqw) {
        setError("กรุณาระบุ ขนาดที่ดิน (ตร.ว.)");
        return;
      }
      if (!String(titleDeed || "").trim()) {
        setError("กรุณาระบุ เอกสารสิทธิ (เช่น โฉนด/นส.3ก)");
        return;
      }
    }

    // ที่ดินเปล่า
    if (isLandOnly(propertyType)) {
      if (!landSqw) {
        setError("กรุณาระบุ ขนาดที่ดิน (ตร.ว.)");
        return;
      }
      if (!String(titleDeed || "").trim()) {
        setError("กรุณาระบุ เอกสารสิทธิ (เช่น โฉนด/นส.3ก)");
        return;
      }
      if (!roadWidth) {
        setError("กรุณาระบุ ถนนหน้าที่ดินกว้าง (เมตร)");
        return;
      }
    }

    // คอนโด
    if (isCondo(propertyType)) {
      if (!String(projectName || "").trim()) {
        setError("กรุณาระบุ ชื่อโครงการ");
        return;
      }
      if (!roomArea) {
        setError("กรุณาระบุ ขนาดห้อง (ตร.ม.)");
        return;
      }
      if (!unitFloor) {
        setError("กรุณาระบุ ชั้น");
        return;
      }
    }

    // ห้องเช่า
    if (isRoomRent(propertyType)) {
      if (!roomAreaRent) {
        setError("กรุณาระบุ ขนาดห้อง (ตร.ม.)");
        return;
      }
      if (!rentFloor) {
        setError("กรุณาระบุ ชั้นที่อยู่");
        return;
      }
    }

    // เชิงกิจการ
    if (isBusiness(propertyType)) {
      if (!String(businessType || "").trim()) {
        setError("กรุณาระบุ ประเภทเชิงกิจการ");
        return;
      }
      if (!businessArea) {
        setError("กรุณาระบุ พื้นที่ใช้สอย (ตร.ม.)");
        return;
      }
      if (!String(powerPhase || "").trim()) {
        setError("กรุณาระบุ ระบบไฟ (1 เฟส / 3 เฟส)");
        return;
      }
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
    if (isBusiness(propertyType)) return "รายละเอียดเชิงกิจการ";
    return "รายละเอียด";
  }, [propertyType]);

  const deedPreviewText = useMemo(() => {
    if (!titleDeedImage) return "";
    if (typeof titleDeedImage === "string") return titleDeedImage;
    if (titleDeedImage?.name) return titleDeedImage.name;
    return "แนบไฟล์แล้ว";
  }, [titleDeedImage]);

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
          <h4 className="title fz17 mb10">{typeTitle}</h4>
        </div>

        {/* =========================
            REQUIRED (ตามประเภท)
        ========================= */}

        {/* บ้านและที่ดิน */}
        {isHouseLand(propertyType) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ห้องนอน *</label>
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
              <label className="fw600 mb10">ห้องน้ำ *</label>
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
              <label className="fw600 mb10">พื้นที่ใช้สอย (ตร.ม.) *</label>
              <input
                type="number"
                className="form-control"
                value={usableArea}
                onChange={(e) => setUsableArea(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ขนาดที่ดิน (ตร.ว.) *</label>
              <input
                type="number"
                className="form-control"
                value={landSqw}
                onChange={(e) => setLandSqw(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">เอกสารสิทธิ *</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น โฉนด, นส.3ก"
                value={titleDeed}
                onChange={(e) => setTitleDeed(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            {/* รูปโฉนด (ไม่บังคับ) */}
            <div className="col-sm-6 col-md-6 mb20">
              <label className="fw600 mb10">รูปโฉนด (ไม่บังคับ)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setTitleDeedImage(file || null);
                }}
                style={{ height: "55px", paddingTop: "12px" }}
              />
              {deedPreviewText && (
                <div className="mt10 text-muted" style={{ fontSize: 13 }}>
                  ไฟล์เดิม/ที่เลือก: {deedPreviewText}
                </div>
              )}
            </div>
          </>
        )}

        {/* ที่ดินเปล่า */}
        {isLandOnly(propertyType) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ขนาดที่ดิน (ตร.ว.) *</label>
              <input
                type="number"
                className="form-control"
                value={landSqw}
                onChange={(e) => setLandSqw(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ถนนหน้าที่ดินกว้าง (ม.) *</label>
              <input
                type="number"
                className="form-control"
                value={roadWidth}
                onChange={(e) => setRoadWidth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">เอกสารสิทธิ *</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น โฉนด, นส.3ก"
                value={titleDeed}
                onChange={(e) => setTitleDeed(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            {/* รูปโฉนด (ไม่บังคับ) */}
            <div className="col-sm-6 col-md-6 mb20">
              <label className="fw600 mb10">รูปโฉนด (ไม่บังคับ)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setTitleDeedImage(file || null);
                }}
                style={{ height: "55px", paddingTop: "12px" }}
              />
              {deedPreviewText && (
                <div className="mt10 text-muted" style={{ fontSize: 13 }}>
                  ไฟล์เดิม/ที่เลือก: {deedPreviewText}
                </div>
              )}
            </div>
          </>
        )}

        {/* คอนโด */}
        {isCondo(propertyType) && (
          <>
            <div className="col-sm-6 col-md-4 mb20">
              <label className="fw600 mb10">ชื่อโครงการ *</label>
              <input
                type="text"
                className="form-control"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-2 mb20">
              <label className="fw600 mb10">ชั้น *</label>
              <input
                type="number"
                className="form-control"
                value={unitFloor}
                onChange={(e) => setUnitFloor(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ขนาดห้อง (ตร.ม.) *</label>
              <input
                type="number"
                className="form-control"
                value={roomArea}
                onChange={(e) => setRoomArea(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>
          </>
        )}

        {/* ห้องเช่า */}
        {isRoomRent(propertyType) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ขนาดห้อง (ตร.ม.) *</label>
              <input
                type="number"
                className="form-control"
                value={roomAreaRent}
                onChange={(e) => setRoomAreaRent(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ชั้นที่อยู่ *</label>
              <input
                type="number"
                className="form-control"
                value={rentFloor}
                onChange={(e) => setRentFloor(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>
          </>
        )}

        {/* =========================
            OPTIONAL (แสดงทันที ไม่ต้องมีปุ่ม และไม่บังคับกรอก)
        ========================= */}

        {/* บ้านและที่ดิน: เพิ่มเติม */}
        {isHouseLand(propertyType) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">จำนวนชั้น</label>
              <input
                type="number"
                className="form-control"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
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

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ถนนหน้าบ้านกว้าง (ม.)</label>
              <input
                type="number"
                className="form-control"
                value={roadWidth}
                onChange={(e) => setRoadWidth(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">หน้ากว้างที่ดิน (ม.)</label>
              <input
                type="number"
                className="form-control"
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ความลึกที่ดิน (ม.)</label>
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

        {/* ที่ดินเปล่า: เพิ่มเติม */}
        {isLandOnly(propertyType) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">หน้ากว้างที่ดิน (ม.)</label>
              <input
                type="number"
                className="form-control"
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ความลึกที่ดิน (ม.)</label>
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

        {/* คอนโด: เพิ่มเติม */}
        {isCondo(propertyType) && (
          <>
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
              <label className="fw600 mb10">ประเภทห้อง</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น Studio / 1BR / 2BR"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">สิทธิ์ที่จอดรถ</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น 1 คัน / ไม่มี"
                value={condoParking}
                onChange={(e) => setCondoParking(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>
          </>
        )}

        {/* ห้องเช่า: เพิ่มเติม */}
        {isRoomRent(propertyType) && (
          <>
            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ห้องน้ำในตัว</label>
              <select
                className="form-control"
                value={bathroomPrivate ? "yes" : "no"}
                onChange={(e) => setBathroomPrivate(e.target.value === "yes")}
                style={{ height: "55px" }}
              >
                <option value="yes">มี</option>
                <option value="no">ไม่มี</option>
              </select>
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">รวมอินเทอร์เน็ต</label>
              <select
                className="form-control"
                value={internetIncluded ? "yes" : "no"}
                onChange={(e) => setInternetIncluded(e.target.value === "yes")}
                style={{ height: "55px" }}
              >
                <option value="no">ไม่รวม</option>
                <option value="yes">รวม</option>
              </select>
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ค่าไฟ (บาท/หน่วย)</label>
              <input
                type="number"
                className="form-control"
                value={electricRate}
                onChange={(e) => setElectricRate(e.target.value)}
                style={{ height: "55px" }}
              />
            </div>

            <div className="col-sm-6 col-md-3 mb20">
              <label className="fw600 mb10">ค่าน้ำ</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น 20/หน่วย หรือ เหมาจ่าย"
                value={waterRate}
                onChange={(e) => setWaterRate(e.target.value)}
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
          <label className="fw600 mb10">หมายเหตุ (เจ้าของ/นายหน้า)</label>
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
