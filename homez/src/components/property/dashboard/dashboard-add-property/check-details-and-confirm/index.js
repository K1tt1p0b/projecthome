"use client";
import React, { useMemo } from "react";
import Map from "./Map";

const PropertySummary = ({
  basicInfo,
  location,
  images,
  details,
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
  const safeDetails = details || {};

  const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

  const isBlank = (v) => v === undefined || v === null || String(v).trim() === "";

  const formatPrice = (p) => {
    if (p === undefined || p === null || p === "") return "-";
    if (typeof p === "number") return p.toLocaleString() + " บาท";
    const n = Number(String(p).replace(/,/g, ""));
    return Number.isFinite(n) && n > 0 ? n.toLocaleString() + " บาท" : String(p);
  };

  const handleSaveDraft = () => {
    if (!onSaveDraft) return;
    const payload = {
      basicInfo: safeBasic,
      location: safeLocation,
      images: safeImages,
      details: safeDetails,
    };
    onSaveDraft?.(payload);
  };

  const handleSubmit = () => {
    if (!onSubmit) return;
    const payload = {
      basicInfo: safeBasic,
      location: safeLocation,
      images: safeImages,
      details: safeDetails,
    };
    onSubmit?.(payload);
  };

  // ----- detailsView (รองรับทั้ง summary ไทย และ raw detailsForm) -----
  const detailsView = useMemo(() => {
    const d = safeDetails || {};
    const hasThaiKeys = Object.keys(d).some((k) => /[ก-๙]/.test(k));
    if (hasThaiKeys) return d;

    const out = {};
    const pick = (label, value) => {
      if (isBlank(value)) return;
      out[label] = value;
    };

    pick("ห้องนอน", d.bedrooms?.label ?? d.bedrooms);
    pick("ห้องน้ำ", d.bathrooms?.label ?? d.bathrooms);
    pick("จำนวนชั้น", d.floors);
    pick("ที่จอดรถ", d.parking?.label ?? d.parking);
    pick("พื้นที่ใช้สอย (ตร.ม.)", d.usableArea);
    pick("ขนาดที่ดิน (ตร.ว.)", d.landSqw);
    pick("เอกสารสิทธิ", d.titleDeed);
    pick("ถนนหน้าบ้าน/ที่ดินกว้าง (ม.)", d.roadWidth);
    pick("หน้ากว้างที่ดิน (ม.)", d.frontage);
    pick("ความลึกที่ดิน (ม.)", d.depth);

    // รูปโฉนด
    if (d.titleDeedImage) {
      const name =
        typeof d.titleDeedImage === "string"
          ? d.titleDeedImage
          : d.titleDeedImage?.name || "มีไฟล์แนบ";
      pick("รูปโฉนด", name);
    }

    // ✅ เอา "ชื่อโครงการ" ออกจาก details แล้ว (ย้ายไปที่อยู่: location.neighborhood)
    pick("อาคาร/ตึก", d.building);
    pick("ชั้น", d.unitFloor);
    pick("ขนาดห้อง (ตร.ม.)", d.roomArea);
    pick("ประเภทห้อง", d.roomType);
    pick("สิทธิ์ที่จอดรถ", d.condoParking);

    pick("ขนาดห้อง (ตร.ม.)", d.roomAreaRent);
    pick("ชั้นที่อยู่", d.rentFloor);
    if (d.bathroomPrivate !== undefined) pick("ห้องน้ำในตัว", d.bathroomPrivate ? "มี" : "ไม่มี");
    if (d.internetIncluded !== undefined) pick("รวมอินเทอร์เน็ต", d.internetIncluded ? "รวม" : "ไม่รวม");
    pick("ค่าไฟ (บาท/หน่วย)", d.electricRate);
    pick("ค่าน้ำ", d.waterRate);

    pick("รายละเอียดเพิ่มเติม", d.note);

    if (Array.isArray(d.amenities)) out.amenities = d.amenities;

    return out;
  }, [safeDetails]);

  const amenities = Array.isArray(detailsView.amenities) ? detailsView.amenities : [];

  // เรียง key รายละเอียด (ไม่บังคับ แต่ช่วยให้ไม่มั่ว)
  // ✅ เอา "ชื่อโครงการ" ออก
  const DETAILS_ORDER = [
    "ห้องนอน",
    "ห้องน้ำ",
    "พื้นที่ใช้สอย (ตร.ม.)",
    "ขนาดที่ดิน (ตร.ว.)",
    "เอกสารสิทธิ",
    "รูปโฉนด",
    "จำนวนชั้น",
    "ที่จอดรถ",
    "ถนนหน้าบ้าน/ที่ดินกว้าง (ม.)",
    "หน้ากว้างที่ดิน (ม.)",
    "ความลึกที่ดิน (ม.)",
    "อาคาร/ตึก",
    "ชั้น",
    "ขนาดห้อง (ตร.ม.)",
    "ประเภทห้อง",
    "สิทธิ์ที่จอดรถ",
    "ชั้นที่อยู่",
    "ห้องน้ำในตัว",
    "รวมอินเทอร์เน็ต",
    "ค่าไฟ (บาท/หน่วย)",
    "ค่าน้ำ",
    "รายละเอียดเพิ่มเติม",
  ];

  const detailsEntries = useMemo(() => {
    const d = detailsView || {};
    const used = new Set();

    const ordered = DETAILS_ORDER
      .filter((k) => k in d)
      .map((k) => [k, d[k]])
      .filter(([, v]) => !isBlank(v))
      .filter(([k]) => k !== "amenities");

    ordered.forEach(([k]) => used.add(k));

    const rest = Object.entries(d)
      .filter(([k]) => k !== "amenities")
      .filter(([k]) => !used.has(k))
      .filter(([, v]) => !isBlank(v));

    return [...ordered, ...rest];
  }, [detailsView]);

  // สถานะผู้ประกาศ (รองรับหลายชื่อ key กันพัง)
  const announcerText =
    safeBasic.announcerStatus ||
    safeBasic.announcer_status ||
    safeBasic.announcerStatus_label ||
    safeBasic.announcerStatusText ||
    "-";

  // ✅ ช่องเดียว: หมู่บ้าน / โครงการ (ถ้ามี)
  const neighborhoodText =
    safeLocation.neighborhood ||
    safeLocation.village ||
    safeLocation.projectName || // เผื่อข้อมูลเก่าเคยเก็บชื่อนี้ใน location
    "";

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
                <strong>หัวข้อประกาศ:</strong> {safeBasic.title || "-"}
              </p>

              {/* เพิ่ม: สถานะผู้ประกาศ */}
              <p>
                <strong>สถานะผู้ประกาศ:</strong> {announcerText}
              </p>

              <p>
                <strong>ประเภทประกาศ:</strong> {safeBasic.listingType || "-"}
              </p>
              <p>
                <strong>ประเภททรัพย์:</strong> {safeBasic.propertyType || "-"}
              </p>
              <p>
                <strong>สภาพทรัพย์:</strong> {safeBasic.condition || "-"}
              </p>
              <p>
                <strong>ราคา:</strong> {formatPrice(safeBasic.price ?? safeBasic.price_text)}
              </p>
              <p className="mt10">
                <strong>รายละเอียดประกาศ:</strong> {safeBasic.description || "-"}
                <br />
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
            <button type="button" style={editButtonStyle} onClick={onEditLocation}>
              {isEmptyObject(safeLocation) ? "เพิ่มข้อมูล" : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {isEmptyObject(safeLocation) ? (
            <p className="text-muted mb0">ยังไม่มีข้อมูลที่อยู่ทรัพย์สิน</p>
          ) : (
            <>
              {/* ✅ หมู่บ้าน / โครงการ (ถ้ามี) */}
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

              {(!isBlank(safeLocation.latitude) || !isBlank(safeLocation.longitude)) && (
                <div className="mt15">
                  <Map lat={Number(safeLocation.latitude)} lng={Number(safeLocation.longitude)} />
                  <div className="d-flex gap-3 mt10">
                    {!isBlank(safeLocation.latitude) && (
                      <small>
                        <strong>Lat:</strong> {safeLocation.latitude}
                      </small>
                    )}
                    {!isBlank(safeLocation.longitude) && (
                      <small>
                        <strong>Lng:</strong> {safeLocation.longitude}
                      </small>
                    )}
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
            <button type="button" style={editButtonStyle} onClick={onEditDetails}>
              {isEmptyObject(detailsView) ? "เพิ่มข้อมูล" : "แก้ไข"}
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
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>สิ่งอำนวยความสะดวก:</div>
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
                        {a}
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
            <button type="button" style={editButtonStyle} onClick={onEditImages}>
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

      {/* Actions */}
      <div className="col-12">
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="ud-btn btn-light" onClick={handleSaveDraft}>
            บันทึกร่าง
          </button>
          <button type="button" className="ud-btn btn-thm" onClick={handleSubmit}>
            ยืนยันลงประกาศ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySummary;
