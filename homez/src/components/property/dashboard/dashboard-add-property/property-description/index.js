"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Select from "@/components/common/ClientSelect";

import announcerStatusOptions from "./announcerStatusOptions.json";
import listingTypeOptions from "./listingTypeOptions.json";
import propertyTypeOptionsRaw from "./propertyTypeOptions.json";
import { toast } from "react-toastify";

const PropertyDescription = ({ initialValue, onNext, onSaveDraft }) => {
  const customStyles = {
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : isFocused
          ? "#eb675312"
          : undefined,
      color: isSelected ? "#fff" : styles.color,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  // ✅ dropdown "ราคาประมาณ" (โชว์ทุกโหมด / ไม่บังคับ)
  const APPROX_PRICE_OPTIONS = useMemo(
    () => [
      { value: "0-100000", label: "ต่ำกว่า 100,000", min: 0, max: 100000 },
      {
        value: "100000-300000",
        label: "100,000 - 300,000",
        min: 100000,
        max: 300000,
      },
      {
        value: "300000-500000",
        label: "300,000 - 500,000",
        min: 300000,
        max: 500000,
      },
      {
        value: "500000-1000000",
        label: "500,000 - 1,000,000",
        min: 500000,
        max: 1000000,
      },
      {
        value: "1000000-3000000",
        label: "1,000,000 - 3,000,000",
        min: 1000000,
        max: 3000000,
      },
      {
        value: "3000000-5000000",
        label: "3,000,000 - 5,000,000",
        min: 3000000,
        max: 5000000,
      },
      {
        value: "5000000-10000000",
        label: "5,000,000 - 10,000,000",
        min: 5000000,
        max: 10000000,
      },
      {
        value: "10000000-20000000",
        label: "10,000,000 - 20,000,000",
        min: 10000000,
        max: 20000000,
      },
      { value: "20000000+", label: "มากกว่า 20,000,000", min: 20000000, max: null },
    ],
    []
  );

  // ✅ condition options แยกตามโหมด
  // - ขาย/เช่า: มือ1/มือ2
  // - เซ้ง: พร้อมเปิด/ปรับปรุงเล็กน้อย
  const CONDITION_OPTIONS_SALE_RENT = useMemo(
    () => [
      { value: "first-hand", label: "มือ 1" },
      { value: "second-hand", label: "มือ 2" },
    ],
    []
  );

  const CONDITION_OPTIONS_TRANSFER = useMemo(
    () => [
      { value: "ready", label: "พร้อมเปิดทันที" },
      { value: "renovate", label: "ต้องปรับปรุงเล็กน้อย" },
    ],
    []
  );

  // ✅ เพิ่ม "ร้านค้า" + "หอพัก" ในประเภททรัพย์ (กันกรณี options เดิมไม่มี)
  const propertyTypeOptions = useMemo(() => {
    const existsShop = (propertyTypeOptionsRaw || []).some(
      (o) => String(o?.value) === "shop" || String(o?.label) === "ร้านค้า"
    );
    const existsDormitory = (propertyTypeOptionsRaw || []).some(
      (o) => String(o?.value) === "dormitory" || String(o?.label) === "หอพัก"
    );

    let next = propertyTypeOptionsRaw || [];
    if (!existsShop) next = [...next, { value: "shop", label: "ร้านค้า" }];
    if (!existsDormitory) next = [...next, { value: "dormitory", label: "หอพัก" }];
    return next;
  }, []);

  // ----------------------------
  // state: common
  // ----------------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ✅ checkbox แสดงราคา (ใช้ร่วมกันทุกโหมด)
  const [showPrice, setShowPrice] = useState(true);

  // ✅ ราคาแบบแยกตามโหมด
  const [salePrice, setSalePrice] = useState(""); // ขาย
  const [rentPerMonth, setRentPerMonth] = useState(""); // เช่า/เซ้ง
  const [keyMoney, setKeyMoney] = useState(""); // เซ้ง

  // ✅ ราคาประมาณ (มีเสมอ / ไม่บังคับ)
  const [approxPrice, setApproxPrice] = useState(null);

  // ✅ Co-Broker State
  const [acceptCoBroke, setAcceptCoBroke] = useState(false);
  const [commissionType, setCommissionType] = useState("percent"); // 'percent' | 'amount'
  const [commissionValue, setCommissionValue] = useState("");

  const [announcerStatus, setAnnouncerStatus] = useState(null);
  const [listingType, setListingType] = useState(null); // single
  const [propertyType, setPropertyType] = useState(null);

  // ✅ สภาพทรัพย์ (ใช้คนละ options ตามโหมด)
  const [condition, setCondition] = useState(null);

  const [error, setError] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => setShowSelect(true), []);

  // ----------------------------
  // helpers
  // ----------------------------
  const toOption = (raw, options) => {
    if (!raw) return null;
    if (typeof raw === "object" && raw.value != null) return raw;
    const s = String(raw).trim();
    return (
      options.find((o) => String(o.value) === s) ||
      options.find((o) => String(o.label) === s) ||
      null
    );
  };

  const normalizeNumber = (v) => {
    const n = Number(String(v ?? "").replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : 0;
  };

  const formatNumberWithComma = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num) || num <= 0) return "";
    return num.toLocaleString("en-US");
  };

  // ✅ แทนทุกเลขด้วย x แต่คง comma ไว้
  const maskPriceDigits = (priceNumber) => {
    const n = Number(priceNumber);
    if (!Number.isFinite(n) || n <= 0) return "";
    const formatted = n.toLocaleString("en-US");
    return formatted.replace(/\d/g, "x");
  };

  // ----------------------------
  // determine listing mode: sale | rent | transfer
  // ----------------------------
  const listingMode = useMemo(() => {
    const v = String(listingType?.value ?? "").toLowerCase();
    const l = String(listingType?.label ?? "");

    const transfer =
      l.includes("เซ้ง") ||
      v === "เซ้ง" ||
      v.includes("seung") ||
      v.includes("transfer") ||
      v.includes("takeover") ||
      v.includes("cession");
    if (transfer) return "transfer";

    const rent = l.includes("เช่า") || v.includes("rent");
    if (rent) return "rent";

    return "sale";
  }, [listingType]);

  const isSale = listingMode === "sale";
  const isRent = listingMode === "rent";
  const isTransfer = listingMode === "transfer";

  // ✅ condition options ตามโหมด
  const conditionOptions = useMemo(() => {
    return isTransfer ? CONDITION_OPTIONS_TRANSFER : CONDITION_OPTIONS_SALE_RENT;
  }, [isTransfer, CONDITION_OPTIONS_TRANSFER, CONDITION_OPTIONS_SALE_RENT]);

  // ----------------------------
  // shop option + filter property types (เซ้ง => ร้านค้าเท่านั้น)
  // ----------------------------
  const shopOption = useMemo(() => {
    return (
      propertyTypeOptions.find((o) => String(o.value) === "shop") ||
      propertyTypeOptions.find((o) => String(o.label) === "ร้านค้า") ||
      { value: "shop", label: "ร้านค้า" }
    );
  }, [propertyTypeOptions]);

  const filteredPropertyTypeOptions = useMemo(() => {
    if (!isTransfer) return propertyTypeOptions;
    return [shopOption];
  }, [isTransfer, propertyTypeOptions, shopOption]);

  // ✅ จับ transition เซ้ง <-> ไม่เซ้ง เพื่อจัดการ propertyType + condition
  const didHydrateRef = useRef(false);
  const prevIsTransferRef = useRef(false);

  useEffect(() => {
    if (!didHydrateRef.current) {
      prevIsTransferRef.current = isTransfer;
      didHydrateRef.current = true;
      return;
    }

    const prev = prevIsTransferRef.current;

    if (isTransfer) {
      setPropertyType(shopOption);
    }

    // ถ้าเคยเป็นเซ้งแล้วกลับเป็นขาย/เช่า => reset ประเภททรัพย์ให้เลือกใหม่
    if (prev === true && isTransfer === false) {
      setPropertyType(null);
    }

    // ✅ เปลี่ยนโหมดแล้ว: reset condition เสมอ (เพราะ options คนละชุด)
    if (prev !== isTransfer) {
      setCondition(null);
    }

    prevIsTransferRef.current = isTransfer;
  }, [isTransfer, shopOption]);

  // ----------------------------
  // sync from initialValue (รองรับหน้าแก้ไข)
  // ----------------------------
  useEffect(() => {
    if (!initialValue) return;

    setTitle(initialValue.title ?? "");
    setDescription(initialValue.description ?? "");

    // ✅ showPrice (ถ้า text เป็น x => ถือว่าไม่แสดง)
    const anyMasked =
      String(initialValue.price_text ?? initialValue.priceText ?? "").includes("x") ||
      String(initialValue.rent_text ?? "").includes("x") ||
      String(initialValue.keyMoney_text ?? "").includes("x");

    const show =
      initialValue.showPrice ??
      initialValue.show_price ??
      (!anyMasked &&
        (Number(initialValue.price ?? 0) > 0 ||
          Number(initialValue.rentPerMonth ?? 0) > 0 ||
          Number(initialValue.keyMoney ?? 0) > 0));

    setShowPrice(Boolean(show));

    // ✅ Co-Broke init
    setAcceptCoBroke(initialValue.acceptCoBroke === true || initialValue.acceptCoBroke === "true");
    setCommissionType(initialValue.commissionType || "percent");
    setCommissionValue(initialValue.commissionValue || "");

    // announcerStatus
    const a =
      toOption(initialValue.announcerStatus, announcerStatusOptions) ||
      toOption(initialValue.announcerStatus_label, announcerStatusOptions) ||
      toOption(initialValue.announcerStatus_value, announcerStatusOptions);
    setAnnouncerStatus(a);

    // listingType
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

    // propertyType
    const ptOpt =
      toOption(initialValue.propertyType, propertyTypeOptions) ||
      toOption(initialValue.propertyType_label, propertyTypeOptions) ||
      toOption(initialValue.propertyType_value, propertyTypeOptions);
    setPropertyType(ptOpt);

    // ✅ condition: map ให้เจอทั้ง 2 ชุดก่อน
    const condRaw =
      initialValue.condition ?? initialValue.condition_value ?? initialValue.condition_label;

    const condFromSaleRent = toOption(condRaw, CONDITION_OPTIONS_SALE_RENT);
    const condFromTransfer = toOption(condRaw, CONDITION_OPTIONS_TRANSFER);

    const modeGuess =
      String(initialValue.listingType_label ?? "").includes("เซ้ง") ||
      String(initialValue.listingType ?? "").includes("transfer");

    setCondition(modeGuess ? condFromTransfer : condFromSaleRent || condFromTransfer || null);

    // ✅ ราคา
    const saleN = normalizeNumber(initialValue.salePrice ?? initialValue.price);
    const rentN = normalizeNumber(
      initialValue.rentPerMonth ?? initialValue.rent_price ?? initialValue.rent
    );
    const keyN = normalizeNumber(
      initialValue.keyMoney ?? initialValue.transferPrice ?? initialValue.key_money
    );

    setSalePrice(saleN > 0 ? formatNumberWithComma(saleN) : "");
    setRentPerMonth(rentN > 0 ? formatNumberWithComma(rentN) : "");
    setKeyMoney(keyN > 0 ? formatNumberWithComma(keyN) : "");

    // approxPrice
    const ap =
      toOption(initialValue.approxPrice, APPROX_PRICE_OPTIONS) ||
      toOption(initialValue.approxPrice_value, APPROX_PRICE_OPTIONS) ||
      toOption(initialValue.approxPrice_label, APPROX_PRICE_OPTIONS);
    setApproxPrice(ap);

    setError("");
  }, [
    initialValue,
    propertyTypeOptions,
    APPROX_PRICE_OPTIONS,
    CONDITION_OPTIONS_SALE_RENT,
    CONDITION_OPTIONS_TRANSFER,
  ]);

  // ----------------------------
  // when listing mode changes, clear irrelevant pricing fields (กันข้อมูลค้าง)
  // ----------------------------
  const prevModeRef = useRef(null);
  useEffect(() => {
    const prev = prevModeRef.current;
    if (prev === null) {
      prevModeRef.current = listingMode;
      return;
    }

    if (prev !== listingMode) {
      setError("");

      if (listingMode === "sale") {
        setRentPerMonth("");
        setKeyMoney("");
      }
      if (listingMode === "rent") {
        setSalePrice("");
        setKeyMoney("");
      }
      if (listingMode === "transfer") {
        setSalePrice("");
      }

      // ✅ เปลี่ยนโหมดแล้ว reset condition เสมอ (options เปลี่ยน)
      setCondition(null);
    }

    prevModeRef.current = listingMode;
  }, [listingMode]);

  // ----------------------------
  // computed numbers + preview
  // ----------------------------
  const salePriceNumber = useMemo(() => normalizeNumber(salePrice), [salePrice]);
  const rentPerMonthNumber = useMemo(() => normalizeNumber(rentPerMonth), [rentPerMonth]);
  const keyMoneyNumber = useMemo(() => normalizeNumber(keyMoney), [keyMoney]);

  const previewSale = useMemo(() => {
    if (!salePriceNumber) return "";
    return showPrice ? formatNumberWithComma(salePriceNumber) : maskPriceDigits(salePriceNumber);
  }, [showPrice, salePriceNumber]);

  const previewRent = useMemo(() => {
    if (!rentPerMonthNumber) return "";
    return showPrice ? formatNumberWithComma(rentPerMonthNumber) : maskPriceDigits(rentPerMonthNumber);
  }, [showPrice, rentPerMonthNumber]);

  const previewKey = useMemo(() => {
    if (!keyMoneyNumber) return "";
    return showPrice ? formatNumberWithComma(keyMoneyNumber) : maskPriceDigits(keyMoneyNumber);
  }, [showPrice, keyMoneyNumber]);

  // ----------------------------
  // build payload
  // ----------------------------
  const buildFormData = () => {
    const base = {
      title: title.trim(),
      description: description.trim(),

      showPrice,
      listingMode,

      // ✅ Co-Broke
      acceptCoBroke,
      commissionType: acceptCoBroke ? commissionType : null,
      commissionValue: acceptCoBroke ? commissionValue : null,

      announcerStatus: announcerStatus?.value ?? null,
      announcerStatus_label: announcerStatus?.label ?? null,

      listingType: listingType?.value ?? null,
      listingType_label: listingType?.label ?? null,

      propertyType: propertyType?.value ?? null,
      propertyType_label: propertyType?.label ?? null,

      // ✅ condition
      condition: condition?.value ?? null,
      condition_label: condition?.label ?? null,

      // ราคาประมาณ (UI มีเสมอ)
      approxPrice: approxPrice?.value ?? null,
      approxPrice_label: approxPrice?.label ?? null,
      approxPrice_min: approxPrice?.min ?? null,
      approxPrice_max: approxPrice?.max ?? null,
    };

    if (listingMode === "sale") {
      return {
        ...base,
        salePrice: salePriceNumber,
        price: salePriceNumber,
        price_text: showPrice
          ? formatNumberWithComma(salePriceNumber)
          : maskPriceDigits(salePriceNumber),
      };
    }

    if (listingMode === "rent") {
      return {
        ...base,
        rentPerMonth: rentPerMonthNumber,
        rent_text: showPrice
          ? formatNumberWithComma(rentPerMonthNumber)
          : maskPriceDigits(rentPerMonthNumber),
      };
    }

    return {
      ...base,
      keyMoney: keyMoneyNumber,
      keyMoney_text: showPrice
        ? formatNumberWithComma(keyMoneyNumber)
        : maskPriceDigits(keyMoneyNumber),

      rentPerMonth: rentPerMonthNumber,
      rent_text: showPrice
        ? formatNumberWithComma(rentPerMonthNumber)
        : maskPriceDigits(rentPerMonthNumber),
    };
  };

  // ----------------------------
  // validation
  // ----------------------------
  const getFirstMissingField = () => {
    if (!title.trim()) return "หัวข้อประกาศ";
    if (!description.trim()) return "รายละเอียดประกาศ";
    if (!announcerStatus) return "สถานะผู้ประกาศ";
    if (!listingType) return "ประเภทการขาย";
    if (!propertyType) return "ประเภททรัพย์";
    if (!condition) return "สภาพทรัพย์";

    if (listingMode === "sale") {
      if (!salePrice.trim() || salePriceNumber <= 0) return "ราคา";
    }
    if (listingMode === "rent") {
      if (!rentPerMonth.trim() || rentPerMonthNumber <= 0) return "ค่าเช่า/เดือน";
    }
    if (listingMode === "transfer") {
      if (!keyMoney.trim() || keyMoneyNumber <= 0) return "ราคาเซ้ง";
      if (!rentPerMonth.trim() || rentPerMonthNumber <= 0) return "ค่าเช่า/เดือน";
    }

    return null;
  };

  const handleNext = () => {
    const firstMissing = getFirstMissingField();
    if (firstMissing) {
      toast.warn(`กรุณากรอก${firstMissing}`);
      return;
    }
    setError("");
    onNext?.(buildFormData());
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(buildFormData());
    alert("บันทึกร่างประกาศเรียบร้อย (mock)");
  };

  // ----------------------------
  // UI helpers
  // ----------------------------
  const onMoneyInput = (setter) => (e) => {
    const next = String(e.target.value ?? "").replace(/[^\d,]/g, "");
    setter(next);
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
        {/* ===== Title ===== */}
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

        {/* ===== Description ===== */}
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

        {/* ===== announcerStatus ===== */}
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

        {/* ===== listingType ===== */}
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

        {/* ===== propertyType ===== */}
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
                  isDisabled={isTransfer} // เซ้ง = ล็อคเป็นร้านค้า
                />
              )}
            </div>
          </div>
        </div>

        {/* =========================
            ROW: สภาพทรัพย์ | ราคา | ราคาประมาณ
            - เซ้ง: ราคาเซ้ง | ค่าเช่า | ราคาประมาณ
        ========================= */}

        {/* ====== CASE: เซ้ง ====== */}
        {isTransfer ? (
          <>
            {/* สภาพทรัพย์ (พร้อมเปิด/ปรับปรุงเล็กน้อย) */}
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
                      options={conditionOptions}
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

            {/* ช่อง 1: ราคาเซ้ง + checkbox */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <div className="d-flex align-items-center justify-content-between mb10">
                  <label className="heading-color ff-heading fw600 mb0">
                    ราคาเซ้ง <span className="text-danger">*</span>
                  </label>

                  <label
                    className="d-flex align-items-center gap-2 mb-0"
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="checkbox"
                      checked={showPrice}
                      onChange={(e) => setShowPrice(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    <span className="heading-color ff-heading fw600" style={{ fontSize: 14 }}>
                      แสดงราคา
                    </span>
                  </label>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="กรอกราคาเซ้ง"
                  value={keyMoney}
                  onChange={onMoneyInput(setKeyMoney)}
                />

                {keyMoneyNumber > 0 && (
                  <small className="text-muted d-block mt-1">
                    จะแสดงเป็น: <b>{previewKey}</b>
                  </small>
                )}
              </div>
            </div>

            {/* ช่อง 2: ค่าเช่า/เดือน */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  ค่าเช่า/เดือน <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="กรอกค่าเช่าต่อเดือน"
                  value={rentPerMonth}
                  onChange={onMoneyInput(setRentPerMonth)}
                />

                {rentPerMonthNumber > 0 && (
                  <small className="text-muted d-block mt-1">
                    จะแสดงเป็น: <b>{previewRent}</b>
                  </small>
                )}
              </div>
            </div>

            {/* ราคาประมาณ */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
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
          </>
        ) : (
          <>
            {/* ====== CASE: ขาย/เช่า ====== */}

            {/* สภาพทรัพย์ (มือ1/มือ2) */}
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
                      options={conditionOptions}
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

            {/* ราคา/ค่าเช่า + checkbox */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <div className="d-flex align-items-center justify-content-between mb10">
                  <label className="heading-color ff-heading fw600 mb0">
                    {isSale ? (
                      <>
                        ราคา <span className="text-danger">*</span>
                      </>
                    ) : (
                      <>
                        ค่าเช่า/เดือน <span className="text-danger">*</span>
                      </>
                    )}
                  </label>

                  <label className="d-flex align-items-center gap-2 mb-0">
                    <input
                      type="checkbox"
                      checked={showPrice}
                      onChange={(e) => setShowPrice(e.target.checked)}
                    />
                    <span className="heading-color ff-heading fw600">แสดงราคา</span>
                  </label>
                </div>

                {isSale ? (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      placeholder="กรอกราคาทรัพย์"
                      value={salePrice}
                      onChange={onMoneyInput(setSalePrice)}
                    />
                    {salePriceNumber > 0 && (
                      <small className="text-muted d-block mt-1">
                        จะแสดงเป็น: <b>{previewSale}</b>
                      </small>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      placeholder="กรอกค่าเช่าต่อเดือน"
                      value={rentPerMonth}
                      onChange={onMoneyInput(setRentPerMonth)}
                    />
                    {rentPerMonthNumber > 0 && (
                      <small className="text-muted d-block mt-1">
                        จะแสดงเป็น: <b>{previewRent}</b>
                      </small>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ราคาประมาณ */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
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
          </>
        )}

        {/* ✅ Co-Broke (เต็มความกว้าง) */}
        <div className="col-12 mb-4">
          <div
            className="rounded-4"
            style={{
              backgroundColor: acceptCoBroke ? "#fff" : "#f8f9fa",
              border: acceptCoBroke ? "2px solid #eb6753" : "1px solid #e9ecef",
              padding: 20,
              boxShadow: acceptCoBroke ? "0 10px 30px rgba(235, 103, 83, 0.10)" : "none",
              transition: "all 0.25s ease",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: acceptCoBroke ? "#eb6753" : "#e9ecef",
                    color: acceptCoBroke ? "#fff" : "#6c757d",
                    transition: "all 0.25s ease",
                    fontSize: 18,
                  }}
                >
                  <i className="fas fa-handshake"></i>
                </div>

                <div>
                  <div
                    className="fw-bold"
                    style={{ fontSize: 16, color: acceptCoBroke ? "#eb6753" : "#181a20" }}
                  >
                    ยินดีรับนายหน้าช่วยขาย (Co-Broke)
                  </div>
                  <small className="text-muted">
                    เปิดโอกาสให้นายหน้าท่านอื่นช่วยนำทรัพย์นี้ไปเสนอขาย เพื่อปิดการขายได้ไวขึ้น
                  </small>
                </div>
              </div>

              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="button"
                  checked={acceptCoBroke}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAcceptCoBroke(checked);
                    if (!checked) setCommissionValue("");
                  }}
                  style={{
                    width: "3.2em",
                    height: "1.8em",
                    cursor: "pointer",
                    backgroundColor: acceptCoBroke ? "#eb6753" : undefined,
                    borderColor: acceptCoBroke ? "#eb6753" : undefined,
                  }}
                />
              </div>
            </div>

            {acceptCoBroke && (
              <div className="mt-4">
                <hr className="mb-4 text-muted opacity-25" />
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">รูปแบบคอมมิชชั่น</label>
                      <div className="location-area">
                        {showSelect && (
                          <Select
                            value={
                              commissionType === "percent"
                                ? { value: "percent", label: "เปอร์เซ็นต์ (%)" }
                                : { value: "amount", label: "จำนวนเงิน (บาท)" }
                            }
                            onChange={(opt) => setCommissionType(opt?.value || "percent")}
                            options={[
                              { value: "percent", label: "เปอร์เซ็นต์ (%)" },
                              { value: "amount", label: "จำนวนเงิน (บาท)" },
                            ]}
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            className="select-custom pl-0"
                            classNamePrefix="select"
                            placeholder="เลือกรูปแบบ"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        {commissionType === "percent" ? "ระบุเปอร์เซ็นต์" : "ระบุจำนวนเงิน"}
                      </label>

                      <div className="input-group">
                        <input
                          type="text"             // 1. เปลี่ยนเป็น text เพื่อคุมเองได้
                          inputMode="numeric"     // 2. ให้มือถือเด้งแป้นตัวเลข
                          className="form-control"
                          placeholder={commissionType === "percent" ? "เช่น 3" : "เช่น 50000"}
                          value={commissionValue}
                          // ✅✅ 3. แก้ตรงนี้: ลบทุกอย่างที่ไม่ใช่เลข 0-9 ทิ้งทันที (รวมถึงจุดทศนิยมด้วย)
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setCommissionValue(val);
                          }}
                          style={{ height: 52 }}
                        />
                        <span className="input-group-text fw-bold">
                          {commissionType === "percent" ? "%" : "฿"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-1">
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 13 }}>
                      <i className="fas fa-info-circle"></i>
                      <span>ข้อมูลส่วนนี้จะแสดงให้นายหน้าท่านอื่นเห็นเท่านั้น (ลูกค้าทั่วไปจะไม่เห็น)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="col-12">
            <p className="text-danger mb10">{error}</p>
          </div>
        )}

        {/* buttons */}
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
