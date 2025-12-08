"use client";
import React from "react";
import Map from "./Map";

// ============================
// MOCK DATA (fallback ถ้า parent ไม่ส่ง props)
// ============================
const mockBasicInfo = {
  title: "ขายบ้านเดี่ยว 2 ชั้น หมู่บ้านฟิวเจอร์วิลล์ รังสิต",
  description:
    "บ้านเดี่ยว 2 ชั้น ใกล้ฟิวเจอร์พาร์ครังสิต รีโนเวทใหม่ทั้งหลัง พร้อมเข้าอยู่ได้ทันที พื้นที่ใช้สอยเยอะ เหมาะกับครอบครัวขนาดกลางถึงใหญ่",
  price: 3250000,
  listingType: "ขาย",
  propertyType: "บ้านเดี่ยว",
  condition: "ปรับปรุงใหม่",
};

const mockLocation = {
  address: "99/12 หมู่บ้านฟิวเจอร์วิลล์ ถนนรังสิต-นครนายก",
  province: "ปทุมธานี",
  district: "อำเภอคลองหลวง",
  subdistrict: "ตำบลคลองหนึ่ง",
  zipCode: "12120",
  latitude: 13.9869,
  longitude: 100.6184,
};

const mockImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1502005097973-6a7082348e28",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
];

const mockDetails = {
  ห้องนอน: "3",
  ห้องน้ำ: "2",
  จำนวนชั้น: "2",
  ที่จอดรถ: "2",
  "ขนาดที่ดิน (ตร.ม)": "50",
  ทิศทางหน้าบ้าน: "ทิศใต้",
  การตกแต่ง: "แต่งครบ",
  ปีที่สร้าง: "2015",
};

// ============================
// COMPONENT แสดงผล Summary
// ============================
const PropertySummary = ({
  basicInfo = mockBasicInfo,
  location = mockLocation,
  images = mockImages,
  details = mockDetails,
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

  const handleSaveDraft = () => {
    const payload = { basicInfo, location, images, details };
    if (onSaveDraft) {
      onSaveDraft(payload);
    } else {
      console.log("SAVE DRAFT (summary):", payload);
      alert("บันทึกร่างประกาศเรียบร้อย (mock)");
    }
  };

  const handleSubmit = () => {
    const payload = { basicInfo, location, images, details };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log("SUBMIT (summary):", payload);
      alert("ส่งประกาศขึ้นระบบ (mock)");
    }
  };

  return (
    <div className="row">
      {/* ข้อมูลทรัพย์สิน */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">ข้อมูลทรัพย์สิน</h4>
          {onEditBasic && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditBasic}
            >
              แก้ไข
            </button>
          )}
        </div>
        <div style={cardStyle}>
          <p className="mb5">
            <strong>หัวข้อประกาศ: </strong>
            {basicInfo.title || "-"}
          </p>
          <p className="mb5">
            <strong>ประเภทประกาศ: </strong>
            {basicInfo.listingType || "-"}
          </p>
          <p className="mb5">
            <strong>ประเภททรัพย์: </strong>
            {basicInfo.propertyType || "-"}
          </p>
          <p className="mb5">
            <strong>สภาพทรัพย์: </strong>
            {basicInfo.condition || "-"}
          </p>
          <p className="mb5">
            <strong>ราคา: </strong>
            {basicInfo.price
              ? `${basicInfo.price.toLocaleString()} บาท`
              : "-"}
          </p>
          <p className="mt10 mb0">
            <strong>รายละเอียดประกาศ</strong>
            <br />
            {basicInfo.description || "ยังไม่ได้กรอกรายละเอียด"}
          </p>
        </div>
      </div>

      {/* ที่อยู่ทรัพย์สิน */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">ที่อยู่ทรัพย์สิน</h4>
          {onEditLocation && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditLocation}
            >
              แก้ไข
            </button>
          )}
        </div>
        <div style={cardStyle}>
          <p className="mb5">
            <strong>ที่อยู่: </strong>
            {location.address || "-"}
          </p>
          <p className="mb5">
            <strong>จังหวัด: </strong>
            {location.province || "-"}
          </p>
          <p className="mb5">
            <strong>อำเภอ/เขต: </strong>
            {location.district || "-"}
          </p>
          <p className="mb5">
            <strong>ตำบล/แขวง: </strong>
            {location.subdistrict || "-"}
          </p>
          <p className="mb5">
            <strong>รหัสไปรษณีย์: </strong>
            {location.zipCode || "-"}
          </p>
          <p className="mb0">
            <strong>พิกัด (Lat, Lng): </strong>
            {location.latitude && location.longitude
              ? `${location.latitude}, ${location.longitude}`
              : "-"}
          </p>
        </div>
      </div>

      {/* ตำแหน่งบนแผนที่ */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">ตำแหน่งบนแผนที่</h4>
          {onEditLocation && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditLocation}
            >
              แก้ไข
            </button>
          )}
        </div>
        <div style={cardStyle}>
          {location.latitude && location.longitude ? (
            <Map
              lat={Number(location.latitude)}
              lng={Number(location.longitude)}
              zoom={16}
            />
          ) : (
            <p className="mb0 text-muted">ยังไม่ได้ระบุพิกัดแผนที่</p>
          )}
        </div>
      </div>

      {/* รูปภาพทรัพย์สิน */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">รูปภาพทรัพย์สิน</h4>
          {onEditImages && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditImages}
            >
              แก้ไข
            </button>
          )}
        </div>
        <div style={cardStyle}>
          {images && images.length > 0 ? (
            <div className="row g-2">
              {images.map((img, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                  <div
                    style={{
                      borderRadius: 6,
                      overflow: "hidden",
                      backgroundColor: "#eaeaea",
                    }}
                  >
                    <img
                      src={img}
                      alt={`property-${idx}`}
                      className="w-100"
                      style={{ objectFit: "cover", height: 130 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb0 text-muted">ยังไม่ได้อัปโหลดรูปภาพ</p>
          )}
        </div>
      </div>

      {/* รายละเอียดทรัพย์เพิ่มเติม */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">รายละเอียดทรัพย์เพิ่มเติม</h4>
          {onEditDetails && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditDetails}
            >
              แก้ไข
            </button>
          )}
        </div>
        <div style={cardStyle}>
          {details && Object.keys(details).length > 0 ? (
            <div className="row">
              {Object.entries(details).map(([key, value]) => (
                <div className="col-sm-6 col-md-3 mb10" key={key}>
                  <p className="mb0">
                    <strong>{key}: </strong>
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb0 text-muted">ยังไม่ได้กรอกรายละเอียดเพิ่มเติม</p>
          )}
        </div>
      </div>

      {/* ปุ่มล่าง: บันทึกร่าง / ยืนยันลงประกาศ */}
      <div className="col-12 mt10">
        <div className="d-flex justify-content-between">
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
