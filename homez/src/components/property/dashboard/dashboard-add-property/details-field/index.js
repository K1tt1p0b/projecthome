"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import Amenities from "../Amenities";

// ✅ ดึง options จากไฟล์ JSON ในโฟลเดอร์เดียวกัน
import bedroomOptions from "./bedroomOptions.json";
import bathroomOptions from "./bathroomOptions.json";
import parkingOptions from "./parkingOptions.json";
import directionOptions from "./directionOptions.json";
import furnishOptions from "./furnishOptions.json";

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
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#222",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const DetailsFiled = ({ onBack, onNext, onSaveDraft }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- state หลัก ๆ ของรายละเอียดทรัพย์ ----
  const [bedrooms, setBedrooms] = useState(bedroomOptions[0] || null);
  const [bathrooms, setBathrooms] = useState(bathroomOptions[0] || null);
  const [floors, setFloors] = useState("");
  const [parking, setParking] = useState(null);
  const [size, setSize] = useState("");
  const [direction, setDirection] = useState(null);
  const [furnishing, setFurnishing] = useState(null);
  const [yearBuilt, setYearBuilt] = useState("");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  const buildFormData = () => ({
    bedrooms,
    bathrooms,
    floors,
    parking,
    size,
    direction,
    furnishing,
    yearBuilt,
    note,
  });

  const handleNext = () => {
    if (!bedrooms || !bathrooms || !size.trim()) {
      setError("กรุณาระบุอย่างน้อย ห้องนอน / ห้องน้ำ และขนาดพื้นที่ (ตร.ม.)");
      return;
    }
    setError("");

    const data = buildFormData();
    if (onNext) {
      onNext(data);
    } else {
      console.log("details next:", data);
    }
  };

  const handleSaveDraft = () => {
    const data = buildFormData();
    if (onSaveDraft) {
      onSaveDraft(data);
    } else {
      console.log("details draft:", data);
    }
    alert("บันทึกร่างรายละเอียดทรัพย์เรียบร้อย (mock)");
  };

  return (
    <form
      className="form-style1"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="row">
        {/* 1. ห้องนอน */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ห้องนอน *
            </label>
            <Select
              value={bedrooms}
              onChange={setBedrooms}
              options={bedroomOptions}
              styles={customStyles}
              classNamePrefix="select"
              isSearchable={false}
              instanceId="bedrooms"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 2. ห้องน้ำ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ห้องน้ำ *
            </label>
            <Select
              value={bathrooms}
              onChange={setBathrooms}
              options={bathroomOptions}
              styles={customStyles}
              classNamePrefix="select"
              isSearchable={false}
              instanceId="bathrooms"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 3. จำนวนชั้น */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              จำนวนชั้น
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="เช่น 2"
              style={{ height: "55px" }}
              value={floors}
              onChange={(e) => setFloors(e.target.value)}
            />
          </div>
        </div>

        {/* 4. ที่จอดรถ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ที่จอดรถ (คัน)
            </label>
            <Select
              value={parking}
              onChange={setParking}
              options={parkingOptions}
              styles={customStyles}
              classNamePrefix="select"
              placeholder="ระบุ"
              isSearchable={false}
              instanceId="parking"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* แถวที่ 2 */}

        {/* 5. ขนาดพื้นที่ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ขนาด (ตร.ม.) *
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="ระบุขนาด"
              style={{ height: "55px" }}
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
        </div>

        {/* 6. ทิศหน้าทรัพย์ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ทิศหน้าทรัพย์
            </label>
            <Select
              value={direction}
              onChange={setDirection}
              options={directionOptions}
              styles={customStyles}
              classNamePrefix="select"
              placeholder="ระบุทิศ"
              isSearchable={false}
              instanceId="direction"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 7. การตกแต่ง */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              การตกแต่ง
            </label>
            <Select
              value={furnishing}
              onChange={setFurnishing}
              options={furnishOptions}
              styles={customStyles}
              classNamePrefix="select"
              placeholder="ระบุ"
              isSearchable={false}
              instanceId="furnishing"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 8. ปีที่สร้างเสร็จ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ปีที่สร้าง (พ.ศ.)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="เช่น 2565"
              style={{ height: "55px" }}
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* สิ่งอำนวยความสะดวก */}
      <div className="row">
        <div className="col-sm-12">
          <div className="mb20">
            <h4 className="title fz17 mb30">สิ่งอำนวยความสะดวก</h4>
          </div>
        </div>
        <Amenities />
      </div>

      {/* หมายเหตุ */}
      <div className="row mt30">
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              หมายเหตุ (สำหรับเจ้าของ/นายหน้า)
            </label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="บันทึกช่วยจำ (ไม่แสดงหน้าเว็บ)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* error + ปุ่มล่าง */}
      {error && (
        <div className="row">
          <div className="col-12">
            <p className="text-danger mb10">{error}</p>
          </div>
        </div>
      )}

      <div className="row mt10">
        <div className="col-12">
          <div className="d-flex justify-content-between">
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
              <button type="submit" className="ud-btn btn-thm">
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DetailsFiled;
