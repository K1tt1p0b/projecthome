"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Select from "@/components/common/ClientSelect";

import announcerStatusOptions from "./announcerStatusOptions.json";
import listingTypeOptions from "./listingTypeOptions.json";
import propertyConditionOptions from "./propertyConditionOptions.json";
import propertyTypeOptionsRaw from "./propertyTypeOptions.json";
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

  // ✅ dropdown "ราคาประมาณ" (ช่วงราคาประมาณ)
  const APPROX_PRICE_OPTIONS = useMemo(
    () => [
      { value: "0-100000", label: "ต่ำกว่า 100,000", min: 0, max: 100000 },
      { value: "100000-300000", label: "100,000 - 300,000", min: 100000, max: 300000 },
      { value: "300000-500000", label: "300,000 - 500,000", min: 300000, max: 500000 },
      { value: "500000-1000000", label: "500,000 - 1,000,000", min: 500000, max: 1000000 },
      { value: "1000000-3000000", label: "1,000,000 - 3,000,000", min: 1000000, max: 3000000 },
      { value: "3000000-5000000", label: "3,000,000 - 5,000,000", min: 3000000, max: 5000000 },
      { value: "5000000-10000000", label: "5,000,000 - 10,000,000", min: 5000000, max: 10000000 },
      { value: "10000000-20000000", label: "10,000,000 - 20,000,000", min: 10000000, max: 20000000 },
      { value: "20000000+", label: "มากกว่า 20,000,000", min: 20000000, max: null },
    ],
    []
  );

  // ✅ เพิ่ม "ร้านค้า" ในประเภททรัพย์
  const propertyTypeOptions = useMemo(() => {
    const existsShop = (propertyTypeOptionsRaw || []).some(
      (o) => String(o?.value) === "shop" || String(o?.label) === "ร้านค้า"
    );
    if (existsShop) return propertyTypeOptionsRaw;
    return [...(propertyTypeOptionsRaw || []), { value: "shop", label: "ร้านค้า" }];
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ✅ ราคา + แสดงราคา
  const [showPrice, setShowPrice] = useState(true);
  const [price, setPrice] = useState("");

  // ✅ ราคาประมาณ (dropdown)
  const [approxPrice, setApproxPrice] = useState(null);

  // ✅ Co-Broker State (เพิ่มใหม่)
  const [acceptCoBroke, setAcceptCoBroke] = useState(false);
  const [commissionType, setCommissionType] = useState("percent"); // 'percent' | 'amount'
  const [commissionValue, setCommissionValue] = useState("");

  const [announcerStatus, setAnnouncerStatus] = useState(null);

  // ✅ ประเภทการขาย: เลือกได้อย่างเดียว
  const [listingType, setListingType] = useState(null);

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

    if (typeof raw === "object" && raw.value != null) return raw;

    const s = String(raw).trim();

    let found = options.find((o) => String(o.value) === s);
    if (found) return found;

    found = options.find((o) => String(o.label) === s);
    if (found) return found;

    return null;
  };

  const formatNumberWithComma = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num) || num <= 0) return "";
    return num.toLocaleString("en-US");
  };

  // ✅ ตรวจว่าประเภทการขาย = "เซ้ง" ไหม (กันพลาดทั้ง value/label)
  const isTransferListing = useMemo(() => {
    const v = String(listingType?.value ?? "").toLowerCase();
    const l = String(listingType?.label ?? "");
    return (
      l.includes("เซ้ง") ||
      v === "เซ้ง" ||
      v === "seung" ||
      v === "transfer" ||
      v === "takeover" ||
      v === "cession"
    );
  }, [listingType]);

  // ✅ option ร้านค้า
  const shopOption = useMemo(() => {
    return (
      propertyTypeOptions.find((o) => String(o.value) === "shop") ||
      propertyTypeOptions.find((o) => String(o.label) === "ร้านค้า") ||
      { value: "shop", label: "ร้านค้า" }
    );
  }, [propertyTypeOptions]);

  // ✅ options ของประเภททรัพย์: ถ้า "เซ้ง" → เหลือแค่ร้านค้า
  const filteredPropertyTypeOptions = useMemo(() => {
    if (!isTransferListing) return propertyTypeOptions;
    return [shopOption];
  }, [isTransferListing, propertyTypeOptions, shopOption]);

  // ✅ สำคัญ: จับ “การเปลี่ยนจาก เซ้ง -> ไม่เซ้ง” เพื่อ reset ประเภททรัพย์เป็นค่าว่าง
  const didHydrateRef = useRef(false);
  const prevIsTransferRef = useRef(false);

  useEffect(() => {
    // หลัง render ครั้งแรกให้เริ่มจับ transition
    if (!didHydrateRef.current) {
      prevIsTransferRef.current = isTransferListing;
      didHydrateRef.current = true;
      return;
    }

    const prev = prevIsTransferRef.current;

    // ✅ ตอนนี้เป็น "เซ้ง" → บังคับร้านค้า
    if (isTransferListing) {
      setPropertyType(shopOption);
    }

    // ✅ ถ้าเคยเป็น "เซ้ง" แล้วเปลี่ยนกลับ "ขาย/เช่า/อื่นๆ" → reset เป็นค่าว่าง
    if (prev === true && isTransferListing === false) {
      setPropertyType(null); // << รีใหม่เลย ให้เลือกใหม่
    }

    prevIsTransferRef.current = isTransferListing;
  }, [isTransferListing, shopOption]);

  // sync จาก initialValue (สำคัญสุดสำหรับหน้าแก้ไข)
  useEffect(() => {
    if (!initialValue) return;

    setTitle(initialValue.title ?? "");
    setDescription(initialValue.description ?? "");

    // ✅ showPrice
    const show =
      initialValue.showPrice ??
      (Number(initialValue.price ?? 0) > 0 || !!(initialValue.price_text ?? initialValue.priceText));
    setShowPrice(Boolean(show));

    // ✅ price
    const initialPriceText =
      initialValue.price_text ??
      initialValue.priceText ??
      (initialValue.price != null ? formatNumberWithComma(initialValue.price) : "");
    setPrice(String(initialPriceText ?? ""));

    // ✅ approxPrice
    const ap =
      toOption(initialValue.approxPrice, APPROX_PRICE_OPTIONS) ||
      toOption(initialValue.approxPrice_value, APPROX_PRICE_OPTIONS) ||
      toOption(initialValue.approxPrice_label, APPROX_PRICE_OPTIONS);
    setApproxPrice(ap);

    // ✅ Co-Broker Init
    setAcceptCoBroke(initialValue.acceptCoBroke === true || initialValue.acceptCoBroke === "true");
    setCommissionType(initialValue.commissionType || "percent");
    setCommissionValue(initialValue.commissionValue || "");

    // announcerStatus
    const a =
      toOption(initialValue.announcerStatus, announcerStatusOptions) ||
      toOption(initialValue.announcerStatus_label, announcerStatusOptions) ||
      toOption(initialValue.announcerStatus_value, announcerStatusOptions);
    setAnnouncerStatus(a);

    // ✅ listingType
    const rawLT =
      initialValue.listingType ??
      initialValue.listingType_value ??
      initialValue.listingType_label ??
      initialValue.listingTypes ??
      initialValue.listingTypes_value ??
      initialValue.listingTypes_label;

    let lt = null;
    if (Array.isArray(rawLT)) lt = toOption(rawLT[0], listingTypeOptions);
    else lt = toOption(rawLT, listingTypeOptions);
    setListingType(lt);

    // propertyType (ตั้งค่าตาม initial ไว้ก่อน)
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
  }, [initialValue, propertyTypeOptions, APPROX_PRICE_OPTIONS]);

  const priceNumber = useMemo(() => {
    const n = Number(String(price).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [price]);

  const buildFormData = () => ({
    title: title.trim(),
    description: description.trim(),

    // ✅ ราคา
    showPrice,
    price_text: showPrice ? price : "xxxx",
    price: showPrice ? priceNumber : 0,

    // ✅ ราคาประมาณ
    approxPrice: approxPrice?.value ?? null,
    approxPrice_label: approxPrice?.label ?? null,
    approxPrice_min: approxPrice?.min ?? null,
    approxPrice_max: approxPrice?.max ?? null,

    // ✅ Co-Broker Data
    acceptCoBroke,
    commissionType: acceptCoBroke ? commissionType : null,
    commissionValue: acceptCoBroke ? commissionValue : null,

    announcerStatus: announcerStatus?.value ?? null,
    announcerStatus_label: announcerStatus?.label ?? null,

    listingType: listingType?.value ?? null,
    listingType_label: listingType?.label ?? null,

    propertyType: propertyType?.value ?? null,
    propertyType_label: propertyType?.label ?? null,

    condition: condition?.value ?? null,
    condition_label: condition?.label ?? null,
  });

  // ✅ เช็คลำดับ “ทีละ step”
  const getFirstMissingField = () => {
    if (!title.trim()) return "หัวข้อประกาศ";
    if (!description.trim()) return "รายละเอียดประกาศ";
    if (!announcerStatus) return "สถานะผู้ประกาศ";
    if (!listingType) return "ประเภทการขาย";
    if (!propertyType) return "ประเภททรัพย์";
    if (!condition) return "สภาพทรัพย์";
    if (showPrice && (!price.trim() || priceNumber <= 0)) return "ราคา";
    return null;
  };

  const isAllEmpty = () => {
    const noTitle = !title.trim();
    const noDesc = !description.trim();
    const noAnnouncer = !announcerStatus;
    const noListing = !listingType;
    const noPropertyType = !propertyType;
    const noCondition = !condition;
    const noPrice = showPrice ? (!price.trim() || priceNumber <= 0) : true;

    return noTitle && noDesc && noAnnouncer && noListing && noPropertyType && noCondition && noPrice;
  };

  const handleNext = () => {
    if (isAllEmpty()) {
      toast.warn("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

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
                  value={listingType}
                  onChange={setListingType}
                  options={listingTypeOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกประเภทการขาย"
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
                  options={filteredPropertyTypeOptions}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="เลือกประเภททรัพย์"
                  isDisabled={isTransferListing}
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

        {/* ✅ แถวราคา & Co-Broker */}
        <div className="col-sm-12 col-xl-8">
          <div className="row">
            {/* ซ้าย: ราคา */}
            <div className="col-sm-6">
              <div className="mb30">
                <div className="d-flex align-items-center justify-content-between mb10">
                  <label className="heading-color ff-heading fw600 mb0">
                    ราคา {showPrice && <span className="text-danger">*</span>}
                  </label>

                  <label className="d-flex align-items-center gap-2 mb-0" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showPrice}
                      onChange={(e) => setShowPrice(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span className="heading-color ff-heading fw600" style={{ fontSize: '14px' }}>แสดงราคา</span>
                  </label>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  placeholder={showPrice ? "กรอกราคาทรัพย์" : "ไม่แสดงราคา (จะส่งเป็น xxxx)"}
                  value={showPrice ? price : ""}
                  disabled={!showPrice}
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d,]/g, ""))}
                />

                {!showPrice && (
                  <small className="text-muted d-block mt-1">
                    ตอนบันทึก/ถัดไป ระบบจะส่ง <b>price_text = "xxxx"</b>
                  </small>
                )}
              </div>
            </div>

            {/* ขวา: ราคาประมาณ */}
            <div className="col-sm-6">
              <div className="mb30">
                <label className="heading-color ff-heading fw600 mb10">ราคาประมาณ</label>
                <div className="location-area">
                  {showSelect && (
                    <Select
                      value={approxPrice}
                      onChange={setApproxPrice}
                      options={APPROX_PRICE_OPTIONS}
                      styles={customStyles}
                      menuPortalTarget={document.body}
                      className="select-custom pl-0"
                      classNamePrefix="select"
                      placeholder="เลือกช่วงราคาโดยประมาณ"
                    />
                  )}
                </div>
                <small className="text-muted d-block mt-1">
                  (ไม่บังคับ) ใช้เพื่อช่วยให้ผู้สนใจเห็นช่วงราคาคร่าวๆ
                </small>
              </div>
            </div>
          </div>
        </div>
        {/* ✅✅ เพิ่มส่วน Co-Broke ตรงนี้ (เต็มความกว้างใน col-xl-8) */}
        <div className="col-12 mb-5">
          <div
            className="rounded-4 transition-all"
            style={{
              backgroundColor: acceptCoBroke ? '#fff' : '#f8f9fa',
              border: acceptCoBroke ? '2px solid #eb6753' : '1px solid #e9ecef',
              padding: '24px',
              boxShadow: acceptCoBroke ? '0 10px 30px rgba(235, 103, 83, 0.1)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Header ส่วนหัวกดเปิดปิด */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                {/* Icon Wrapper */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: acceptCoBroke ? '#eb6753' : '#e9ecef',
                    color: acceptCoBroke ? '#fff' : '#6c757d',
                    transition: 'all 0.3s ease',
                    fontSize: '20px'
                  }}
                >
                  <i className="fas fa-handshake"></i>
                </div>

                {/* Title & Desc */}
                <div>
                  <h6 className="m-0 fw-bold" style={{ fontSize: '16px', color: acceptCoBroke ? '#eb6753' : '#181a20' }}>
                    ยินดีรับนายหน้าช่วยขาย
                  </h6>
                  <small className="text-muted">
                    เปิดโอกาสให้นายหน้าท่านอื่นช่วยนำทรัพย์นี้ไปเสนอขาย เพื่อปิดการขายได้ไวขึ้น
                  </small>
                </div>
              </div>

              {/* Switch Toggle */}
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="button"
                  checked={acceptCoBroke}
                  onChange={(e) => {
                    setAcceptCoBroke(e.target.checked);
                    if (!e.target.checked) setCommissionValue("");
                  }}
                  style={{
                    width: '3.5em',
                    height: '1.9em',
                    cursor: 'pointer',
                    backgroundColor: acceptCoBroke ? '#eb6753' : undefined,
                    borderColor: acceptCoBroke ? '#eb6753' : undefined
                  }}
                />
              </div>
            </div>

            {/* Content Area (Expandable) */}
            {acceptCoBroke && (
              <div className="mt-4 animate__animated animate__fadeIn">
                <hr className="mb-4 text-muted opacity-25" />

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">รูปแบบคอมมิชชั่น</label>
                      <div className="location-area">
                        <Select
                          value={commissionType === 'percent' ? { value: 'percent', label: 'เปอร์เซ็นต์ (%)' } : { value: 'amount', label: 'จำนวนเงิน (บาท)' }}
                          onChange={(option) => setCommissionType(option.value)}
                          options={[
                            { value: 'percent', label: 'เปอร์เซ็นต์ (%)' },
                            { value: 'amount', label: 'จำนวนเงิน (บาท)' }
                          ]}
                          styles={{
                            ...customStyles,
                            control: (base, state) => ({
                              ...base,
                              borderColor: state.isFocused ? '#eb6753' : '#e9ecef',
                              boxShadow: state.isFocused ? '0 0 0 1px #eb6753' : null,
                              borderRadius: '8px',
                              height: '55px'
                            })
                          }}
                          className="select-custom pl-0"
                          classNamePrefix="select"
                          placeholder="เลือกรูปแบบ"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        {commissionType === 'percent' ? 'ระบุเปอร์เซ็นต์' : 'ระบุจำนวนเงิน'}
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder={commissionType === 'percent' ? 'เช่น 3' : 'เช่น 50000'}
                          value={commissionValue}
                          onChange={(e) => setCommissionValue(e.target.value)}
                          style={{
                            height: '55px',
                            borderRadius: '8px 0 0 8px',
                            borderColor: '#e9ecef'
                          }}
                        />
                        <span
                          className="input-group-text fw-bold"
                          style={{
                            borderRadius: '0 8px 8px 0',
                            backgroundColor: '#fbfbfb',
                            borderColor: '#e9ecef',
                            color: '#eb6753'
                          }}
                        >
                          {commissionType === 'percent' ? '%' : '฿'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-1">
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '13px' }}>
                      <i className="fas fa-info-circle"></i>
                      <span>ข้อมูลส่วนนี้จะแสดงให้นายหน้าท่านอื่นเห็นเท่านั้น (ลูกค้าทั่วไปจะไม่เห็น)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* จบส่วน Co-Broke */}

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