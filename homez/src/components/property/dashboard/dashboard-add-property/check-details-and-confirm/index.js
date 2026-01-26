"use client";
import React, { useMemo, useEffect, useState } from "react";
import LeafletMap from "@/components/common/LeafletMap";
import announcerStatusOptions from "../property-description/announcerStatusOptions.json";
import listingTypeOptions from "../property-description/listingTypeOptions.json";
import propertyConditionOptions from "../property-description/propertyConditionOptions.json";
import propertyTypeOptions from "../property-description/propertyTypeOptions.json";

const DETAILS_STORE_KEY_V2 = "landx_add_property_details_v2";
const DETAILS_STORE_KEY_V1 = "landx_add_property_details";
const DETAILS_STORE_KEY_LEGACY = "landx_property_details_v1";

const safeParse = (v) => {
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
};

const isBlank = (v) =>
  v === undefined || v === null || String(v).trim() === "";

// ✅ ดึงค่าได้หลายคีย์ (รองรับไทย/อังกฤษ/legacy)
const getAny = (obj, keys) => {
  if (!obj) return undefined;
  for (const k of keys) {
    const val = obj?.[k];
    if (!isBlank(val)) return val;
  }
  return undefined;
};

// ✅ ดึง label จาก react-select option หรือค่าดิบ
const labelOf = (v) => {
  if (isBlank(v)) return undefined;
  if (typeof v === "object") {
    if (v?.label != null) return String(v.label);
    if (v?.value != null) return String(v.value);
    return undefined;
  }
  return String(v);
};

/* =========================================================
  ✅ FIX: videos อาจเป็น string[] หรือ object[] ({url, provider...})
  ให้ normalize เป็น string url[] เสมอ ก่อน render
========================================================= */
const getVideoUrl = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object")
    return String(v.url || v.src || v.link || "").trim();
  return String(v).trim();
};

const normalizeVideoList = (videos) => {
  const arr = Array.isArray(videos) ? videos : videos ? [videos] : [];
  return arr.map(getVideoUrl).filter((s) => !isBlank(s));
};
/* ========================================================= */

const PropertySummary = ({
  basicInfo,
  location,
  images,
  details,

  videos,
  onEditVideo,

  onEditBasic,
  onEditLocation,
  onEditImages,
  onEditDetails,
  onSaveDraft,
  onSubmit,
}) => {
  const cardStyle = {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 16,
  };

  const editButtonStyle = {
    borderRadius: 999,
    border: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
    padding: "4px 14px",
    fontSize: 12,
  };

  const safeBasic = basicInfo || {};
  const safeLocation = location || {};
  const safeImages = Array.isArray(images) ? images : [];

  // ✅ ดึงข้อมูล Co-Broke มาเตรียมไว้
  const acceptCoBroke =
    safeBasic.acceptCoBroke === true || safeBasic.acceptCoBroke === "true";
  const commissionType = safeBasic.commissionType;
  const commissionValue = safeBasic.commissionValue;

  // ✅ FIX: videos -> string url[]
  const safeVideos = useMemo(() => normalizeVideoList(videos), [videos]);

  const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

  // ✅ helper: แปลง value เป็น label จาก options
  const findLabel = (options, value) => {
    if (!value) return null;
    const found = options?.find((o) => String(o.value) === String(value));
    return found?.label || value;
  };

  const toNumber = (v) => {
    const n = Number(String(v ?? "").replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : 0;
  };

  // ✅ format เงิน (รองรับ showPrice=false => masked text)
  const formatMoney = (rawNumber, rawText, showPrice, suffix = "บาท") => {
    if (showPrice === false) {
      const t = String(rawText ?? "").trim();
      if (t) return `${t} ${suffix}`;
      const n = toNumber(rawNumber);
      if (n > 0)
        return n.toLocaleString("en-US").replace(/\d/g, "x") + ` ${suffix}`;
      return "-";
    }

    const n = toNumber(rawNumber);
    if (n > 0) return n.toLocaleString("en-US") + ` ${suffix}`;

    const n2 = toNumber(rawText);
    if (n2 > 0) return n2.toLocaleString("en-US") + ` ${suffix}`;

    const t2 = String(rawText ?? "").trim();
    if (t2) return `${t2} ${suffix}`;

    return "-";
  };

  // ✅ แปลงข้อมูล basicInfo จาก property-description เป็น display format
  const resolvedBasicInfo = useMemo(() => {
    const b = safeBasic || {};

    // ✅ listingType: รองรับทั้ง array และ single value
    const listingTypeValue = b.listingType || b.listingType_value;
    let listingTypeLabel =
      b.listingType_label ||
      (Array.isArray(b.listingTypes) && b.listingTypes.length > 0
        ? b.listingTypes
            .map((lt) => {
              const val =
                typeof lt === "object" ? lt.value ?? lt.label ?? null : lt;
              return findLabel(listingTypeOptions, val) || String(val || "");
            })
            .filter(Boolean)
            .join(", ")
        : null) ||
      (listingTypeValue
        ? findLabel(listingTypeOptions, listingTypeValue)
        : null) ||
      "-";
    listingTypeLabel = String(listingTypeLabel || "-");

    // ✅ propertyType
    const propertyTypeValue =
      typeof b.propertyType === "object"
        ? b.propertyType?.value ?? b.propertyType_value
        : b.propertyType || b.propertyType_value;
    let propertyTypeLabel =
      b.propertyType_label ||
      (propertyTypeValue
        ? findLabel(propertyTypeOptions, propertyTypeValue)
        : null) ||
      "-";
    propertyTypeLabel = String(propertyTypeLabel || "-");

    // ✅ condition
    const conditionValue =
      typeof b.condition === "object"
        ? b.condition?.value ?? b.condition_value
        : b.condition || b.condition_value;
    let conditionLabel =
      b.condition_label ||
      (conditionValue
        ? findLabel(propertyConditionOptions, conditionValue)
        : null) ||
      "-";
    conditionLabel = String(conditionLabel || "-");

    // ✅ announcerStatus
    const announcerStatusValue =
      typeof b.announcerStatus === "object"
        ? b.announcerStatus?.value ??
          b.announcer_status ??
          b.announcerStatus_value
        : b.announcerStatus || b.announcer_status || b.announcerStatus_value;
    let announcerStatusLabel =
      b.announcerStatus_label ||
      (announcerStatusValue
        ? findLabel(announcerStatusOptions, announcerStatusValue)
        : null) ||
      b.announcerStatusText ||
      "-";
    announcerStatusLabel = String(announcerStatusLabel || "-");

    // ✅ showPrice
    const showPrice = b.showPrice !== undefined ? Boolean(b.showPrice) : true;

    // ✅ listingMode ใหม่: sale | rent | transfer
    const listingMode = String(b.listingMode || "").trim() || null;

    // ✅ ราคาตามโหมด
    const salePrice = getAny(b, ["salePrice", "price"]);
    const priceText = getAny(b, ["price_text", "priceText"]);

    const rentPerMonth = getAny(b, ["rentPerMonth", "rent_price", "rent"]);
    const rentText = getAny(b, ["rent_text"]);

    const keyMoney = getAny(b, ["keyMoney", "transferPrice", "key_money"]);
    const keyMoneyText = getAny(b, ["keyMoney_text"]);

    return {
      title: String(b.title || "-"),
      description: String(b.description || "-"),

      showPrice,
      listingMode,

      // sale
      salePrice,
      price_text: priceText,

      // rent
      rentPerMonth,
      rent_text: rentText,

      // transfer
      keyMoney,
      keyMoney_text: keyMoneyText,

      approxPrice: b.approxPrice_label
        ? String(b.approxPrice_label)
        : b.approxPrice
        ? String(b.approxPrice)
        : null,

      listingType: listingTypeLabel,
      propertyType: propertyTypeLabel,
      condition: conditionLabel,
      announcerStatus: announcerStatusLabel,
    };
  }, [safeBasic]);

  // ✅ สร้างข้อความราคาให้ถูกตาม listingMode
  const priceLines = useMemo(() => {
    const b = resolvedBasicInfo;
    const mode = String(b.listingMode || "").toLowerCase();

    // fallback: ถ้าไม่มี listingMode ให้ใช้แบบเดิม (ราคาเดียว)
    if (!mode) {
      return [
        {
          label: "ราคา",
          value: formatMoney(b.salePrice, b.price_text, b.showPrice, "บาท"),
        },
      ];
    }

    if (mode === "sale") {
      return [
        {
          label: "ราคา",
          value: formatMoney(b.salePrice, b.price_text, b.showPrice, "บาท"),
        },
      ];
    }

    if (mode === "rent") {
      return [
        {
          label: "ค่าเช่า/เดือน",
          value: formatMoney(
            b.rentPerMonth,
            b.rent_text,
            b.showPrice,
            "บาท/เดือน"
          ),
        },
      ];
    }

    // transfer
    return [
      {
        label: "ราคาเซ้ง",
        value: formatMoney(b.keyMoney, b.keyMoney_text, b.showPrice, "บาท"),
      },
      {
        label: "ค่าเช่า/เดือน",
        value: formatMoney(
          b.rentPerMonth,
          b.rent_text,
          b.showPrice,
          "บาท/เดือน"
        ),
      },
    ];
  }, [resolvedBasicInfo]);

  // ✅ Details: props เป็นหลัก / กัน hydration
  const [resolvedDetails, setResolvedDetails] = useState(() => details || {});

  useEffect(() => {
    const fromProps = details || {};

    const hasNonBlankInProps = Object.keys(fromProps).some(
      (k) => !isBlank(fromProps?.[k])
    );
    if (hasNonBlankInProps) {
      setResolvedDetails(fromProps);
      return;
    }

    if (typeof window === "undefined") {
      setResolvedDetails(fromProps);
      return;
    }

    const loadLS = (key) => {
      try {
        const v = safeParse(localStorage.getItem(key));
        return v && typeof v === "object" ? v : null;
      } catch {
        return null;
      }
    };

    const ls =
      loadLS(DETAILS_STORE_KEY_V2) ||
      loadLS(DETAILS_STORE_KEY_V1) ||
      loadLS(DETAILS_STORE_KEY_LEGACY) ||
      {};

    const keys = Object.keys(ls || {}).filter((k) => !isBlank(ls?.[k]));
    const looksValid =
      keys.length >= 2 ||
      keys.includes("amenities") ||
      keys.includes("unitFloor") ||
      keys.includes("roomArea") ||
      keys.includes("deedNumber") ||
      keys.includes("titleDeed") ||
      keys.includes("landSqw") ||
      keys.includes("usableArea") ||
      // ✅ กันกรณีร้านค้า / เซ้งร้าน
      keys.includes("shopBusinessType") ||
      keys.includes("contractDuration") ||
      keys.includes("shopWaterFee") ||
      keys.includes("shopElectricFee");

    setResolvedDetails(looksValid ? ls : fromProps);
  }, [details]);

  const safeDetails = resolvedDetails || {};

  const handleSaveDraft = () => {
    if (!onSaveDraft) return;
    onSaveDraft?.({
      basicInfo: safeBasic,
      location: safeLocation,
      images: safeImages,
      details: safeDetails,
      videos: safeVideos, // ✅ url string[]
    });
  };

  const handleSubmit = () => {
    if (!onSubmit) return;
    onSubmit?.({
      basicInfo: safeBasic,
      location: safeLocation,
      images: safeImages,
      details: safeDetails,
      videos: safeVideos, // ✅ url string[]
    });
  };

  const LAND_FILL_LABEL = {
    filled: "ถมแล้ว",
    "not-filled": "ยังไม่ถม",
    unknown: "ไม่แน่ใจ/ไม่ระบุ",
  };

  const ZONING_COLOR_LABEL = {
    red: "ผังสีแดง",
    brown: "ผังสีน้ำตาล",
    yellow: "ผังสีเหลือง",
    orange: "ผังสีส้ม",
    purple: "ผังสีม่วง",
    green: "ผังสีเขียว",
    blue: "ผังสีน้ำเงิน",
    other: "อื่นๆ/ไม่แน่ใจ",
  };

  // ✅ สร้างรายละเอียดสำหรับ Summary
  const detailsView = useMemo(() => {
    const d = safeDetails || {};
    const out = {};

    const pick = (label, value) => {
      if (isBlank(value)) return;

      if (typeof value === "object") {
        if (value?.label != null) out[label] = String(value.label);
        else if (value?.value != null) out[label] = String(value.value);
        else return;
      } else {
        out[label] = String(value);
      }
    };

    // ---------- บ้านและที่ดิน ----------
    pick("ห้องนอน", labelOf(getAny(d, ["bedrooms", "ห้องนอน"])));
    pick("ห้องน้ำ", labelOf(getAny(d, ["bathrooms", "ห้องน้ำ"])));
    pick(
      "พื้นที่ใช้สอย (ตร.ม.)",
      getAny(d, ["usableArea", "พื้นที่ใช้สอย (ตร.ม.)", "พื้นที่ใช้สอย"])
    );
    pick(
      "ขนาดที่ดิน (ตร.ว.)",
      getAny(d, ["landSqw", "ขนาดที่ดิน (ตร.ว.)", "ขนาดที่ดิน"])
    );
    pick(
      "เอกสารสิทธิ (เลขโฉนด)",
      getAny(d, ["deedNumber", "titleDeed", "เอกสารสิทธิ (เลขโฉนด)", "เอกสารสิทธิ"])
    );
    pick("จำนวนชั้น", getAny(d, ["floors", "จำนวนชั้น"]));
    pick("ที่จอดรถ", labelOf(getAny(d, ["parking", "ที่จอดรถ"])));

    pick(
      "ถนนหน้าบ้าน/ที่ดินกว้าง (ม.)",
      getAny(d, [
        "roadWidth",
        "ถนนหน้าบ้านกว้าง (ม.) (ถ้ามี)",
        "ถนนหน้าที่ดินกว้าง (ม.) (ถ้ามี)",
        "ถนนหน้าบ้าน/ที่ดินกว้าง (ม.)",
        "ถนนหน้าที่ดินกว้าง (ม.)",
      ])
    );

    pick("หน้ากว้างที่ดิน (ม.)", getAny(d, ["frontage", "หน้ากว้างที่ดิน (ม.)"]));
    pick("ความลึกที่ดิน (ม.)", getAny(d, ["depth", "ความลึกที่ดิน (ม.)"]));

    // ---------- รูปโฉนด ----------
    const deedFile = getAny(d, [
      "titleDeedImage",
      "titleDeedImages",
      "รูปเอกสารโฉนด",
      "รูปโฉนด",
    ]);
    const deedName = getAny(d, [
      "titleDeedImageName",
      "ชื่อไฟล์โฉนด",
      "ไฟล์เดิม/ที่เลือก",
    ]);

    let deedText = undefined;
    if (typeof deedFile === "string" && deedFile.trim()) deedText = deedFile;
    else if (deedFile?.name) deedText = deedFile.name;
    else if (typeof deedFile === "object" && deedFile?.url) deedText = deedFile.url;
    else if (Array.isArray(deedFile)) {
      const first = deedFile[0];
      if (typeof first === "string" && first.trim()) deedText = first;
      else if (first?.name) deedText = first.name;
      else if (first?.url) deedText = first.url;
    }
    if (isBlank(deedText) && !isBlank(deedName)) deedText = deedName;
    pick("รูปโฉนด", deedText);

    // ---------- ที่ดินเปล่า ----------
    const landFillRaw = getAny(d, ["landFillStatus", "สภาพที่ดิน"]);
    const zoningRaw = getAny(d, ["zoningColor", "ผังสี"]);
    if (!isBlank(landFillRaw))
      pick("สภาพที่ดิน", LAND_FILL_LABEL[landFillRaw] ?? landFillRaw);
    if (!isBlank(zoningRaw))
      pick("ผังสี", ZONING_COLOR_LABEL[zoningRaw] ?? zoningRaw);

    // ---------- คอนโด / ห้องเช่า ----------
    pick("อาคาร/ตึก", getAny(d, ["building", "อาคาร/ตึก", "อาคาร"]));
    pick("ชั้น", getAny(d, ["unitFloor", "ชั้น"]));
    pick("ขนาดห้อง (ตร.ม.)", getAny(d, ["roomArea", "ขนาดห้อง (ตร.ม.)", "ขนาดห้อง"]));
    pick("ค่าน้ำ", getAny(d, ["waterFee", "waterRate", "ค่าน้ำ"]));
    pick("ค่าไฟ", getAny(d, ["electricFee", "electricRate", "ค่าไฟ"]));
    pick("ค่าส่วนกลาง", getAny(d, ["commonFee", "ค่าส่วนกลาง"]));

    // ---------- ✅ ร้านค้า (ของเดิม + เพิ่มใหม่) ----------
    pick("ประเภทร้าน", getAny(d, ["shopBusinessType", "ประเภทร้าน"]));
    pick("ระยะสัญญา", getAny(d, ["contractDuration", "ระยะสัญญา"]));

    // (ของเดิมร้าน) — เผื่อบางหน้าอยากเห็นใน summary ด้วย (ถ้ามีค่า)
    pick("ขนาดพื้นที่ร้าน (ตร.ม.)", getAny(d, ["shopArea", "ขนาดพื้นที่ร้าน (ตร.ม.)"]));
    pick("ชั้น/ทำเลชั้น", getAny(d, ["shopFloor", "ชั้น/ทำเลชั้น"]));
    pick("ถนนหน้าร้านกว้าง (ม.)", getAny(d, ["shopRoadWidth", "ถนนหน้าร้านกว้าง (ม.)"]));
    pick("หน้ากว้าง (ม.)", getAny(d, ["shopFrontage", "หน้ากว้าง (ม.)"]));
    pick("ความลึก (ม.)", getAny(d, ["shopDepth", "ความลึก (ม.)"]));

    // ---------- ✅ เซ้งร้าน: เพิ่มตามที่คุณเพิ่มใน DetailsFiled ----------
    pick("ค่าน้ำ (ร้าน)", getAny(d, ["shopWaterFee", "ค่าน้ำ (ร้าน)", "ค่าน้ำร้าน"]));
    pick("ค่าไฟ (ร้าน)", getAny(d, ["shopElectricFee", "ค่าไฟ (ร้าน)", "ค่าไฟร้าน"]));

    const hasStaffRaw = getAny(d, ["shopHasStaff", "มีพนักงาน"]);
    if (
      hasStaffRaw !== undefined &&
      hasStaffRaw !== null &&
      String(hasStaffRaw).trim() !== ""
    ) {
      const yes =
        hasStaffRaw === true ||
        hasStaffRaw === "true" ||
        hasStaffRaw === "yes" ||
        hasStaffRaw === 1 ||
        hasStaffRaw === "1";
      pick("มีพนักงาน", yes ? "มี" : "ไม่มี");
      if (yes) {
        pick("จำนวนพนักงาน", getAny(d, ["shopStaffCount", "จำนวนพนักงาน"]));
        pick("ค่าแรงพนักงาน", getAny(d, ["shopStaffWage", "ค่าแรงพนักงาน"]));
      }
    }

    const hasEquipRaw = getAny(d, ["shopHasEquipment", "มีอุปกรณ์ให้"]);
    if (
      hasEquipRaw !== undefined &&
      hasEquipRaw !== null &&
      String(hasEquipRaw).trim() !== ""
    ) {
      const yes =
        hasEquipRaw === true ||
        hasEquipRaw === "true" ||
        hasEquipRaw === "yes" ||
        hasEquipRaw === 1 ||
        hasEquipRaw === "1";
      pick("มีอุปกรณ์ให้", yes ? "มี" : "ไม่มี");
      if (yes) {
        pick("รายการอุปกรณ์", getAny(d, ["shopEquipmentList", "รายการอุปกรณ์"]));
      }
    }

    pick("รายละเอียดเพิ่มเติม", getAny(d, ["note", "รายละเอียดเพิ่มเติม"]));

    const am = getAny(d, ["amenities", "สิ่งอำนวยความสะดวก"]) || [];
    if (Array.isArray(am)) out.amenities = am;

    return out;
  }, [safeDetails]);

  const amenities = Array.isArray(detailsView.amenities) ? detailsView.amenities : [];

  const DETAILS_ORDER = [
    "ห้องนอน",
    "ห้องน้ำ",
    "พื้นที่ใช้สอย (ตร.ม.)",
    "ขนาดที่ดิน (ตร.ว.)",
    "เอกสารสิทธิ (เลขโฉนด)",
    "รูปโฉนด",
    "จำนวนชั้น",
    "สภาพที่ดิน",
    "ผังสี",
    "ที่จอดรถ",
    "ถนนหน้าบ้าน/ที่ดินกว้าง (ม.)",
    "หน้ากว้างที่ดิน (ม.)",
    "ความลึกที่ดิน (ม.)",
    "อาคาร/ตึก",
    "ชั้น",
    "ขนาดห้อง (ตร.ม.)",
    "ค่าน้ำ",
    "ค่าไฟ",
    "ค่าส่วนกลาง",

    // ✅ ร้านค้า (เพิ่มใหม่)
    "ประเภทร้าน",
    "ระยะสัญญา",

    // ✅ เซ้งร้าน (เพิ่มใหม่)
    "ค่าน้ำ (ร้าน)",
    "ค่าไฟ (ร้าน)",
    "มีพนักงาน",
    "จำนวนพนักงาน",
    "ค่าแรงพนักงาน",
    "มีอุปกรณ์ให้",
    "รายการอุปกรณ์",

    // ✅ ร้านค้า (ของเดิม)
    "ขนาดพื้นที่ร้าน (ตร.ม.)",
    "ชั้น/ทำเลชั้น",
    "ถนนหน้าร้านกว้าง (ม.)",
    "หน้ากว้าง (ม.)",
    "ความลึก (ม.)",

    "รายละเอียดเพิ่มเติม",
  ];

  const detailsEntries = useMemo(() => {
    const d = detailsView || {};
    const used = new Set();

    const normalizeValue = (v) => {
      if (v == null) return v;
      if (typeof v === "object") {
        if (v.label != null) return String(v.label);
        if (v.value != null) return String(v.value);
        return String(v);
      }
      return String(v);
    };

    const ordered = DETAILS_ORDER
      .filter((k) => k in d)
      .map((k) => [k, normalizeValue(d[k])])
      .filter(([, v]) => !isBlank(v))
      .filter(([k]) => k !== "amenities");

    ordered.forEach(([k]) => used.add(k));

    const rest = Object.entries(d)
      .filter(([k]) => k !== "amenities")
      .filter(([k]) => !used.has(k))
      .map(([k, v]) => [k, normalizeValue(v)])
      .filter(([, v]) => !isBlank(v));

    return [...ordered, ...rest];
  }, [detailsView]);

  const neighborhoodText =
    safeLocation.neighborhood ||
    safeLocation.village ||
    safeLocation.projectName ||
    "";

  const mapLat = Number(safeLocation.latitude ?? safeLocation.lat);
  const mapLng = Number(safeLocation.longitude ?? safeLocation.lng);
  const hasMap = Number.isFinite(mapLat) && Number.isFinite(mapLng);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasMap) return;
    const styleId = "hide-map-controls-property-summary";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .property-summary-map .lx-map-actions { display: none !important; }
      .property-summary-map .lx-map-search { display: none !important; }
      .property-summary-map .lx-map-overlay-inner { display: none !important; }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) document.head.removeChild(existingStyle);
    };
  }, [hasMap]);

  return (
    <div className="row">
      {/* 1) ข้อมูลทรัพย์สิน */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">ข้อมูลทรัพย์สิน</h4>
          {onEditBasic && (
            <button type="button" style={editButtonStyle} onClick={onEditBasic}>
              {isEmptyObject(safeBasic) ? "เพิ่มข้อมูล" : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {isEmptyObject(safeBasic) ? (
            <p className="text-muted mb0">ยังไม่มีข้อมูลทรัพย์สิน</p>
          ) : (
            <>
              <p>
                <strong>หัวข้อประกาศ:</strong> {resolvedBasicInfo.title}
              </p>
              <p>
                <strong>สถานะผู้ประกาศ:</strong> {resolvedBasicInfo.announcerStatus}
              </p>
              <p>
                <strong>ประเภทการขาย:</strong> {resolvedBasicInfo.listingType}
              </p>
              <p>
                <strong>ประเภททรัพย์:</strong> {resolvedBasicInfo.propertyType}
              </p>
              <p>
                <strong>สภาพทรัพย์:</strong> {resolvedBasicInfo.condition}
              </p>

              {/* ✅ ราคาแบบใหม่: ขาย/เช่า/เซ้ง */}
              {priceLines.map((line) => (
                <p key={line.label}>
                  <strong>{line.label}:</strong> {line.value}
                </p>
              ))}

              {/* ✅✅ แสดงผล Co-Broke ในหน้าสรุป ✅✅ */}
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center gap-2">
                  <i
                    className={`fas fa-handshake ${
                      acceptCoBroke ? "text-success" : "text-muted"
                    }`}
                  ></i>
                  <strong>นายหน้าช่วยขาย (Co-Broke):</strong>

                  {acceptCoBroke ? (
                    <span className="text-success fw-bold">
                      ✅ ยินดีรับ (
                      {Number(commissionValue || 0).toLocaleString()}{" "}
                      {commissionType === "percent" ? "%" : "บาท"})
                    </span>
                  ) : (
                    <span className="text-muted">ไม่รับ / ไม่ระบุ</span>
                  )}
                </div>
              </div>

              {resolvedBasicInfo.approxPrice && (
                <p className="mt-2">
                  <strong>ราคาประมาณ:</strong>{" "}
                  {String(resolvedBasicInfo.approxPrice)}
                </p>
              )}

              <p className="mt10">
                <strong>รายละเอียดประกาศ:</strong> {resolvedBasicInfo.description}
              </p>
            </>
          )}
        </div>
      </div>

      {/* 2) ที่อยู่ทรัพย์สิน */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">ที่อยู่ทรัพย์สิน</h4>
          {onEditLocation && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditLocation}
            >
              {isEmptyObject(safeLocation) ? "เพิ่มข้อมูล" : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {isEmptyObject(safeLocation) ? (
            <p className="text-muted mb0">ยังไม่มีข้อมูลที่อยู่ทรัพย์สิน</p>
          ) : (
            <>
              {!isBlank(neighborhoodText) && (
                <p>
                  <strong>หมู่บ้าน / โครงการ:</strong> {neighborhoodText}
                </p>
              )}
              {!isBlank(safeLocation.address) && (
                <p>
                  <strong>ที่อยู่:</strong> {safeLocation.address}
                </p>
              )}
              {!isBlank(safeLocation.subdistrict) && (
                <p>
                  <strong>ตำบล/แขวง:</strong> {safeLocation.subdistrict}
                </p>
              )}
              {!isBlank(safeLocation.district) && (
                <p>
                  <strong>อำเภอ/เขต:</strong> {safeLocation.district}
                </p>
              )}
              {!isBlank(safeLocation.province) && (
                <p>
                  <strong>จังหวัด:</strong> {safeLocation.province}
                </p>
              )}
              {!isBlank(safeLocation.zipCode) && (
                <p>
                  <strong>รหัสไปรษณีย์:</strong> {safeLocation.zipCode}
                </p>
              )}

              {hasMap && (
                <div className="mt15 property-summary-map">
                  <LeafletMap
                    lat={mapLat}
                    lng={mapLng}
                    zoom={15}
                    height={360}
                    draggable={false}
                    clickToMove={false}
                    enableSearch={false}
                    enableGPS={false}
                    restrictToThailand={true}
                    initialPosition={{ lat: mapLat, lng: mapLng }}
                  />
                  <div className="d-flex gap-3 mt10">
                    <small>
                      <strong>Lat:</strong> {mapLat}
                    </small>
                    <small>
                      <strong>Lng:</strong> {mapLng}
                    </small>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3) รายละเอียดทรัพย์เพิ่มเติม */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">รายละเอียดทรัพย์เพิ่มเติม</h4>
          {onEditDetails && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditDetails}
            >
              {detailsEntries.length === 0 && amenities.length === 0
                ? "เพิ่มข้อมูล"
                : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {detailsEntries.length === 0 && amenities.length === 0 ? (
            <p className="text-muted mb0">ยังไม่มีรายละเอียดเพิ่มเติม</p>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {detailsEntries.map(([k, v]) => (
                  <div key={k} style={{ fontSize: 14 }}>
                    <strong>{k}:</strong> {String(v)}
                  </div>
                ))}
              </div>

              {amenities.length > 0 && (
                <div className="mt20">
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    สิ่งอำนวยความสะดวก:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {amenities.map((a, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#fff",
                          border: "1px solid #e5e5e5",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                        }}
                      >
                        {typeof a === "object"
                          ? a?.label ?? a?.value ?? String(a)
                          : String(a)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 4) รูปภาพทรัพย์สิน */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">รูปภาพทรัพย์สิน</h4>
          {onEditImages && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditImages}
            >
              {safeImages.length === 0 ? "เพิ่มรูป" : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {safeImages.length === 0 ? (
            <p className="text-muted mb0">ยังไม่มีรูปภาพ</p>
          ) : (
            <div className="row g-3">
              {safeImages.map((src, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                  <img
                    src={typeof src === "string" ? src : src?.url}
                    alt={`property-${idx}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5) วิดีโอทรัพย์สิน */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">วิดีโอทรัพย์สิน</h4>
          {onEditVideo && (
            <button type="button" style={editButtonStyle} onClick={onEditVideo}>
              {safeVideos.length === 0 ? "เพิ่มวิดีโอ" : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {safeVideos.length === 0 ? (
            <p className="text-muted mb0">ยังไม่มีวิดีโอ</p>
          ) : (
            <div className="row g-3">
              {safeVideos.map((u, idx) => (
                <div className="col-12 col-md-6" key={idx}>
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e5e5",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontSize: 13, marginBottom: 6 }}>
                      <strong>วิดีโอ {idx + 1}:</strong>{" "}
                      <a href={u} target="_blank" rel="noreferrer">
                        เปิดลิงก์
                      </a>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{u}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="col-12">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="ud-btn btn-light"
            onClick={handleSaveDraft}
          >
            บันทึกร่าง
          </button>
          <button
            type="button"
            className="ud-btn btn-thm"
            onClick={handleSubmit}
          >
            ยืนยันลงประกาศ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySummary;
