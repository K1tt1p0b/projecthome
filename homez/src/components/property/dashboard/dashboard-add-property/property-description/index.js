"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const PropertyDescription = () => {
  // ==========================
  // Options
  // ==========================
  const propertyCondition = [
    { value: "New", label: "ใหม่" },
    { value: "Like New", label: "เหมือนใหม่" },
    { value: "Renovated", label: "ปรับปรุงใหม่" },
    { value: "Used", label: "มือสอง" },
  ];

  const announcerStatusOptions = [
    { value: "owner", label: "เจ้าของทรัพย์" },
    { value: "agent", label: "นายหน้า" },
  ];

  const listingTypeOptions = [
    { value: "sell", label: "ขาย" },
    { value: "rent", label: "เช่า" },
    { value: "supply", label: "จัดหา" },
  ];

  const propertyTypeOptions = [
    { value: "house and land", label: "บ้านและที่ดิน" },
    { value: "land", label: "ที่ดินเปล่า" },
    { value: "condo", label: "คอนโด" },
    { value: "room for rent", label: "ห้องเช่า" },
    { value: "business for sale", label: "เซ้งกิจการ" },
  ];

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

  // ให้ dropdown ลอยขึ้นมา ไม่โดนตัด
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
  // Handle Select Render Delay
  // ==========================
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);

  // ==========================
  // Render
  // ==========================
  return (
    <form className="form-style1">
      <div className="row">
        {/* Title */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">หัวข้อประกาศ</label>
            <input type="text" className="form-control" placeholder="กรอกหัวข้อประกาศ" />
          </div>
        </div>

        {/* Description */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">รายละเอียดประกาศ</label>
            <textarea
              cols={30}
              rows={5}
              placeholder="กรอกข้อมูลรายละเอียดทรัพย์สินของคุณที่นี่..."
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
                  options={announcerStatusOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกสถานะผู้ประกาศ"
                  required
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
                  options={listingTypeOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกประเภทการขาย"
                  isMulti
                  required
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
                  options={propertyTypeOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกประเภททรัพย์"
                  required
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
                  options={propertyCondition}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกสภาพทรัพย์"
                  required
                />
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">ราคา</label>
            <input type="text" className="form-control" placeholder="กรอกราคาทรัพย์" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PropertyDescription;
