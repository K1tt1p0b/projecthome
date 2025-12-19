"use client";
import { useEffect, useMemo, useState } from "react";
import Select from "@/components/common/ClientSelect";

import announcerStatusOptions from "./announcerStatusOptions.json";
import listingTypeOptions from "./listingTypeOptions.json";
import propertyConditionOptions from "./propertyConditionOptions.json";
import propertyTypeOptions from "./propertyTypeOptions.json";
import { toast } from "react-toastify";

const PropertyDescription = ({ onNext, onSaveDraft }) => {
  const customStyles = {
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? "#eb6753" : isFocused ? "#eb675312" : undefined,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ราคา: เก็บเป็น string แต่บังคับให้พิมพ์ได้แค่เลข+comma
  const [price, setPrice] = useState("");

  const [announcerStatus, setAnnouncerStatus] = useState(null);
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyType, setPropertyType] = useState(null);
  const [condition, setCondition] = useState(null);

  const [error, setError] = useState("");
  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => setShowSelect(true), []);

  const priceNumber = useMemo(() => {
    const n = Number(String(price).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [price]);

  const buildFormData = () => ({
    title: title.trim(),
    description: description.trim(),

    // เก็บทั้ง string และ number (เลือกใช้ได้)
    price_text: price,
    price: priceNumber,

    announcerStatus: announcerStatus?.value ?? null,
    announcerStatus_label: announcerStatus?.label ?? null,

    listingTypes: listingTypes.map((x) => x.value), // ✅ array ของ value
    listingTypes_label: listingTypes.map((x) => x.label),

    propertyType: propertyType?.value ?? null,
    propertyType_label: propertyType?.label ?? null,

    condition: condition?.value ?? null,
    condition_label: condition?.label ?? null,
  });

  const handleNext = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !announcerStatus ||
      listingTypes.length === 0 ||
      !propertyType ||
      !condition ||
      !price.trim() ||
      priceNumber <= 0
    ) {
      toast.warn("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
      return;
    }

    onNext?.(buildFormData());
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(buildFormData());
    alert("บันทึกร่างประกาศเรียบร้อย (mock)");
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
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">หัวข้อประกาศ *</label>
            <input
              type="text"
              className="form-control"
              placeholder="กรอกหัวข้อประกาศ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">รายละเอียดประกาศ *</label>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">สถานะผู้ประกาศ *</label>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ประเภทการขาย *</label>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ประเภททรัพย์ *</label>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">สภาพทรัพย์ *</label>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">ราคา *</label>
            <input
              type="text"
              inputMode="numeric"
              className="form-control"
              placeholder="กรอกราคาทรัพย์"
              value={price}
              onChange={(e) => {
                // ให้พิมพ์ได้เฉพาะตัวเลขและ comma
                const v = e.target.value.replace(/[^\d,]/g, "");
                setPrice(v);
              }}
            />
          </div>
        </div>

        {error && (
          <div className="col-12">
            <p className="text-danger mb10">{error}</p>
          </div>
        )}

        <div className="col-12">
          <div className="d-flex justify-content-between mt10">
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

export default PropertyDescription;
