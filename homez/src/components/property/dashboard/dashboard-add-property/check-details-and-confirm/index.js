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
  const safeImages = images || [];
  const safeDetails = details || {};
  const amenities = safeDetails.amenities || [];

  const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

  const handleSaveDraft = () => {
    const payload = {
      basicInfo: safeBasic,
      location: safeLocation,
      images: safeImages,
      details: safeDetails,
    };
    onSaveDraft?.(payload);
  };

  const handleSubmit = () => {
    const payload = {
      basicInfo: safeBasic,
      location: safeLocation,
      images: safeImages,
      details: safeDetails,
    };
    onSubmit?.(payload);
  };

  // ---------- helpers ----------
  const isBlank = (v) => v === undefined || v === null || String(v).trim() === "";

  const formatPrice = (p) => {
    if (p === undefined || p === null || p === "") return "-";
    if (typeof p === "number") return p.toLocaleString() + " บาท";
    // เผื่อเป็น string
    const n = Number(String(p).replace(/,/g, ""));
    return Number.isFinite(n) && n > 0 ? n.toLocaleString() + " บาท" : String(p);
  };

  // ---------- map label ตาม field ใหม่จาก DetailsFiled ----------
  // details ที่คุณส่งมาจาก AddPropertyTabContent จะเป็น summary object แล้ว
  // แต่เผื่อกรณีที่ส่งเป็น raw detailsForm ก็รองรับด้วยการ map ต่อไปนี้
  const detailsView = useMemo(() => {
    // ถ้า details ถูก build มาเป็น key ภาษาไทยแล้ว (ตาม buildDetailsSummary ใหม่) ก็ใช้ได้เลย
    // แต่ถ้าเป็น raw (landSqw, usableArea, projectName...) จะถูก map ให้เป็นไทย
    const d = safeDetails || {};

    // ถ้าเจอ key ภาษาไทยแล้ว ให้ใช้แบบนั้นเลย
    const hasThaiKeys = Object.keys(d).some((k) => /[ก-๙]/.test(k));
    if (hasThaiKeys) return d;

    const out = {};

    const pick = (label, value) => {
      if (isBlank(value)) return;
      out[label] = value;
    };

    // house-and-land
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

    // condo
    pick("ชื่อโครงการ", d.projectName);
    pick("อาคาร/ตึก", d.building);
    pick("ชั้น", d.unitFloor);
    pick("ขนาดห้อง (ตร.ม.)", d.roomArea);
    pick("ประเภทห้อง", d.roomType);
    pick("สิทธิ์ที่จอดรถ", d.condoParking);

    // room-rent
    pick("ขนาดห้อง (ตร.ม.)", d.roomAreaRent);
    pick("ชั้นที่อยู่", d.rentFloor);
    if (d.bathroomPrivate !== undefined) pick("ห้องน้ำในตัว", d.bathroomPrivate ? "มี" : "ไม่มี");
    if (d.internetIncluded !== undefined) pick("รวมอินเทอร์เน็ต", d.internetIncluded ? "รวม" : "ไม่รวม");
    pick("ค่าไฟ (บาท/หน่วย)", d.electricRate);
    pick("ค่าน้ำ", d.waterRate);

    // common
    pick("ทิศหน้าทรัพย์", d.direction?.label ?? d.direction);
    pick("การตกแต่ง", d.furnishing?.label ?? d.furnishing);
    pick("ปีที่สร้าง", d.yearBuilt);
    pick("หมายเหตุ(เจ้าของ/นายหน้า)", d.note);

    if (Array.isArray(d.amenities)) out.amenities = d.amenities;

    return out;
  }, [safeDetails]);

  // กรอง key ที่ไม่อยากโชว์
  const detailsEntries = useMemo(() => {
    return Object.entries(detailsView)
      .filter(([k]) => k !== "amenities")
      .filter(([, v]) => !isBlank(v));
  }, [detailsView]);

  return (
    <div className="row">
      {/* --------------------
          ข้อมูลทรัพย์สิน
      -------------------- */}
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
                <strong>รายละเอียดประกาศ:</strong>
                <br />
                {safeBasic.description || "-"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* --------------------
          ที่อยู่ทรัพย์สิน
      -------------------- */}
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
              {!isBlank(safeLocation.address) && (
                <p>
                  <strong>ที่อยู่:</strong> {safeLocation.address}
                </p>
              )}
              {!isBlank(safeLocation.province) && (
                <p>
                  <strong>จังหวัด:</strong> {safeLocation.province}
                </p>
              )}
              {!isBlank(safeLocation.district) && (
                <p>
                  <strong>อำเภอ/เขต:</strong> {safeLocation.district}
                </p>
              )}
              {!isBlank(safeLocation.subdistrict) && (
                <p>
                  <strong>ตำบล/แขวง:</strong> {safeLocation.subdistrict}
                </p>
              )}
              {!isBlank(safeLocation.zipCode) && (
                <p>
                  <strong>รหัสไปรษณีย์:</strong> {safeLocation.zipCode}
                </p>
              )}
              <p>
                <strong>พิกัด:</strong>{" "}
                {safeLocation.latitude && safeLocation.longitude
                  ? `${safeLocation.latitude}, ${safeLocation.longitude}`
                  : "-"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* --------------------
          ตำแหน่งบนแผนที่
      -------------------- */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">ตำแหน่งบนแผนที่</h4>

          {onEditLocation && (
            <button type="button" style={editButtonStyle} onClick={onEditLocation}>
              {safeLocation.latitude && safeLocation.longitude ? "แก้ไข" : "เพิ่มข้อมูล"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {safeLocation.latitude && safeLocation.longitude ? (
            <Map lat={Number(safeLocation.latitude)} lng={Number(safeLocation.longitude)} zoom={16} />
          ) : (
            <p className="text-muted mb0">ยังไม่ได้ระบุพิกัดแผนที่</p>
          )}
        </div>
      </div>

      {/* --------------------
          รูปภาพทรัพย์สิน
      -------------------- */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">รูปภาพทรัพย์สิน</h4>

          {onEditImages && (
            <button type="button" style={editButtonStyle} onClick={onEditImages}>
              {safeImages.length === 0 ? "เพิ่มข้อมูล" : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {safeImages.length === 0 ? (
            <p className="text-muted mb0">ยังไม่ได้อัปโหลดรูปภาพ</p>
          ) : (
            <div className="row g-2">
              {safeImages.map((img, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                  <div
                    style={{
                      borderRadius: 6,
                      overflow: "hidden",
                      backgroundColor: "#eaeaea",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-100" style={{ height: 130, objectFit: "cover" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --------------------
          รายละเอียดทรัพย์เพิ่มเติม
      -------------------- */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">รายละเอียดทรัพย์เพิ่มเติม</h4>

          {onEditDetails && (
            <button type="button" style={editButtonStyle} onClick={onEditDetails}>
              {detailsEntries.length === 0 && amenities.length === 0 ? "เพิ่มข้อมูล" : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {detailsEntries.length === 0 && amenities.length === 0 ? (
            <p className="text-muted mb0">ยังไม่ได้กรอกรายละเอียดเพิ่มเติม</p>
          ) : (
            <>
              {/* รายละเอียดอื่น ๆ */}
              {detailsEntries.length > 0 && (
                <div className="row">
                  {detailsEntries.map(([key, value], idx) => (
                    <div className="col-sm-6 col-md-3 mb10" key={idx}>
                      <p className="mb0">
                        <strong>{key}:</strong> {String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* สิ่งอำนวยความสะดวก */}
              {Array.isArray(amenities) && amenities.length > 0 && (
                <div className="mt10">
                  <strong>สิ่งอำนวยความสะดวก:</strong>
                  <div className="d-flex flex-wrap gap-2 mt5">
                    {amenities.map((label, idx) => (
                      <span
                        key={idx}
                        className="badge bg-light text-dark"
                        style={{
                          borderRadius: 999,
                          border: "1px solid #ddd",
                          padding: "4px 10px",
                          fontSize: 12,
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --------------------
          ปุ่มล่าง
      -------------------- */}
      <div className="col-12 mt10">
        <div className="d-flex justify-content-between">
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
