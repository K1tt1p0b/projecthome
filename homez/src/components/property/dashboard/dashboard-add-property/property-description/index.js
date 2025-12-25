"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "@/components/common/ClientSelect";

import announcerStatusOptions from "./announcerStatusOptions.json";
import listingTypeOptions from "./listingTypeOptions.json";
import propertyConditionOptions from "./propertyConditionOptions.json";
import propertyTypeOptions from "./propertyTypeOptions.json";
import { toast } from "react-toastify";

const PropertyDescription = ({ initialValue, onNext, onSaveDraft }) => {
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

  // ----------------------------
  // helpers: normalize initialValue -> option objects
  // ----------------------------
  const toOption = (raw, options) => {
    if (!raw) return null;

    // ถ้ามาเป็น {value,label} อยู่แล้ว
    if (typeof raw === "object" && raw.value != null) return raw;

    const s = String(raw).trim();

    // match ด้วย value ก่อน
    let found = options.find((o) => String(o.value) === s);
    if (found) return found;

    // สำคัญ: match ด้วย label (เช่น "เจ้าของทรัพย์")
    found = options.find((o) => String(o.label) === s);
    if (found) return found;

    return null;
  };

  const toMultiOptions = (raw, options) => {
    if (!raw) return [];

    const arr = Array.isArray(raw) ? raw : [raw];
    if (!arr.length) return [];

    // ถ้ามาเป็น [{value,label}] อยู่แล้ว
    if (typeof arr[0] === "object" && arr[0]?.value != null) return arr;

    // ถ้ามาเป็น ["sell","rent"] หรือ [value,value]
    return arr
      .map((v) => {
        const vv = String(v).trim();
        // match value ก่อน
        return (
          options.find((o) => String(o.value) === vv) ||
          options.find((o) => String(o.label) === vv) ||
          null
        );
      })
      .filter(Boolean);
  };

  const formatNumberWithComma = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num) || num <= 0) return "";
    return num.toLocaleString("en-US");
  };

  // sync จาก initialValue (สำคัญสุดสำหรับหน้าแก้ไข)
  useEffect(() => {
    if (!initialValue) return;

    setTitle(initialValue.title ?? "");
    setDescription(initialValue.description ?? "");

    // ราคา: รับได้ทั้ง price_text / priceText / price (number)
    const initialPriceText =
      initialValue.price_text ??
      initialValue.priceText ??
      (initialValue.price != null ? formatNumberWithComma(initialValue.price) : "");
    setPrice(String(initialPriceText ?? ""));

    // announcerStatus: รับได้ทั้ง value ("owner") หรือ label ("เจ้าของทรัพย์") หรือ object
    const a =
      toOption(initialValue.announcerStatus, announcerStatusOptions) ||
      toOption(initialValue.announcerStatus_label, announcerStatusOptions) ||
      toOption(initialValue.announcerStatus_value, announcerStatusOptions);
    setAnnouncerStatus(a);

    // listingTypes: แก้บั๊ก || (เพราะ [] เป็น truthy)
    const lt1 = toMultiOptions(initialValue.listingTypes, listingTypeOptions);
    const lt2 = toMultiOptions(initialValue.listingTypes_value, listingTypeOptions);
    const lt3 = toMultiOptions(initialValue.listingTypes_label, listingTypeOptions);
    setListingTypes(lt1.length ? lt1 : lt2.length ? lt2 : lt3);

    // propertyType
    const pt =
      toOption(initialValue.propertyType, propertyTypeOptions) ||
      toOption(initialValue.propertyType_label, propertyTypeOptions) ||
      toOption(initialValue.propertyType_value, propertyTypeOptions);
    setPropertyType(pt);

    // condition
    const cd =
      toOption(initialValue.condition, propertyConditionOptions) ||
      toOption(initialValue.condition_label, propertyConditionOptions) ||
      toOption(initialValue.condition_value, propertyConditionOptions);
    setCondition(cd);

    setError("");
  }, [initialValue]);

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

    listingTypes: listingTypes.map((x) => x.value),
    listingTypes_label: listingTypes.map((x) => x.label),

    propertyType: propertyType?.value ?? null,
    propertyType_label: propertyType?.label ?? null,

    condition: condition?.value ?? null,
    condition_label: condition?.label ?? null,
  });

  // ✅ เพิ่ม: เช็คลำดับ “ทีละ step” (ตัวแรกที่ยังขาดจะถูกแจ้ง)
  const getFirstMissingField = () => {
    if (!title.trim()) return "หัวข้อประกาศ";
    if (!description.trim()) return "รายละเอียดประกาศ";
    if (!announcerStatus) return "สถานะผู้ประกาศ";
    if (!listingTypes || listingTypes.length === 0) return "ประเภทการขาย";
    if (!propertyType) return "ประเภททรัพย์";
    if (!condition) return "สภาพทรัพย์";
    if (!price.trim() || priceNumber <= 0) return "ราคา";
    return null;
  };

  // ✅ เพิ่ม: เช็คว่า “ยังไม่กรอกเลย” ไหม
  const isAllEmpty = () => {
    const noTitle = !title.trim();
    const noDesc = !description.trim();
    const noAnnouncer = !announcerStatus;
    const noListing = !listingTypes || listingTypes.length === 0;
    const noPropertyType = !propertyType;
    const noCondition = !condition;
    const noPrice = !price.trim() || priceNumber <= 0;

    return (
      noTitle &&
      noDesc &&
      noAnnouncer &&
      noListing &&
      noPropertyType &&
      noCondition &&
      noPrice
    );
  };

  const handleNext = () => {
    // ✅ เคส 1: ไม่กรอกเลยสักช่อง
    if (isAllEmpty()) {
      toast.warn("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // ✅ เคส 2: กรอกไปบางส่วน → แจ้ง “ทีละช่อง” ตามลำดับที่ควรกรอก
    const firstMissing = getFirstMissingField();
    if (firstMissing) {
      toast.warn(`กรุณากรอก${firstMissing}`);
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
            <label className="heading-color ff-heading fw600 mb10">
              หัวข้อประกาศ <span className="text-danger">*</span>
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

        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              รายละเอียดประกาศ <span className="text-danger">*</span>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              สถานะผู้ประกาศ <span className="text-danger">*</span>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ประเภทการขาย <span className="text-danger">*</span>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ประเภททรัพย์ <span className="text-danger">*</span>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              สภาพทรัพย์ <span className="text-danger">*</span>
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

        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              ราคา <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="form-control"
              placeholder="กรอกราคาทรัพย์"
              value={price}
              onChange={(e) => {
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
