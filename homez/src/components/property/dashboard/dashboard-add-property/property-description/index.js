"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

// ✅ import options จากไฟล์ JSON ในโฟลเดอร์เดียวกัน
import announcerStatusOptions from "./announcerStatusOptions.json";
import listingTypeOptions from "./listingTypeOptions.json";
import propertyConditionOptions from "./propertyConditionOptions.json";
import propertyTypeOptions from "./propertyTypeOptions.json";

const PropertyDescription = ({ onNext, onSaveDraft }) => {
  // ==========================
  // Custom Styles
  // ==========================
  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : isHovered || isFocused
        ? "#eb675312"
        : undefined,
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

  // ==========================
  // State ฟอร์ม
  // ==========================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [announcerStatus, setAnnouncerStatus] = useState(null);
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyType, setPropertyType] = useState(null);
  const [condition, setCondition] = useState(null);

  const [error, setError] = useState("");

  // handle react-select render delay
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);

  // สร้าง object ข้อมูลฟอร์ม เผื่อส่งไป onNext / onSaveDraft
  const buildFormData = () => ({
    title,
    description,
    price,
    announcerStatus,
    listingTypes,
    propertyType,
    condition,
  });

  // ==========================
  // Handlers
  // ==========================
  const handleNext = () => {
    // เช็กฟิลด์ที่บังคับ (เครื่องหมาย *)
    if (
      !title.trim() ||
      !description.trim() ||
      !announcerStatus ||
      listingTypes.length === 0 ||
      !propertyType ||
      !condition ||
      !price.trim()
    ) {
      setError("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      return;
    }

    setError("");

    const data = buildFormData();
    if (onNext) {
      onNext(data);
    } else {
      console.log("Next with data:", data);
    }
  };

  const handleSaveDraft = () => {
    const data = buildFormData();
    if (onSaveDraft) {
      onSaveDraft(data);
    } else {
      console.log("Save draft with data:", data);
    }
    alert("บันทึกร่างประกาศเรียบร้อย (mock)");
  };

  // ==========================
  // Render
  // ==========================
  return (
    <form
      className="form-style1"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="row">
        {/* Title */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              หัวข้อประกาศ *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="กรอกหัวข้อประกาศ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รายละเอียดประกาศ *
            </label>
            <textarea
              cols={30}
              rows={5}
              className="form-control"
              placeholder="กรอกข้อมูลรายละเอียดทรัพย์สินของคุณที่นี่..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* สถานะผู้ประกาศ */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              สถานะผู้ประกาศ *
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  value={announcerStatus}
                  onChange={setAnnouncerStatus}
                  options={announcerStatusOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกสถานะผู้ประกาศ"
                />
              )}
            </div>
          </div>
        </div>

        {/* ประเภทการขาย */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ประเภทการขาย *
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  value={listingTypes}
                  onChange={setListingTypes}
                  options={listingTypeOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกประเภทการขาย"
                  isMulti
                />
              )}
            </div>
          </div>
        </div>

        {/* ประเภททรัพย์ */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ประเภททรัพย์ *
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  value={propertyType}
                  onChange={setPropertyType}
                  options={propertyTypeOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกประเภททรัพย์"
                />
              )}
            </div>
          </div>
        </div>

        {/* สภาพทรัพย์ */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              สภาพทรัพย์ *
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  value={condition}
                  onChange={setCondition}
                  options={propertyConditionOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกสภาพทรัพย์"
                />
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              ราคา *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="กรอกราคาทรัพย์"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* error message */}
        {error && (
          <div className="col-12">
            <p className="text-danger mb10">{error}</p>
          </div>
        )}

        {/* ปุ่มด้านล่าง */}
        <div className="col-12">
          <div className="d-flex justify-content-between mt10">
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
    </form>
  );
};

export default PropertyDescription;
