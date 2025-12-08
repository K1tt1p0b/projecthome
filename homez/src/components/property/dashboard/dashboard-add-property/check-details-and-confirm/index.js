"use client";
import React from "react";
import Map from "./Map";

// ============================
// MOCK DATA สำหรับทดสอบหน้า Summary
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
];

const mockDetails = {
  พื้นที่ใช้สอย: "180 ตร.ม.",
  ขนาดที่ดิน: "50 ตร.วา",
  ห้องนอน: 3,
  ห้องน้ำ: 2,
  จำนวนชั้น: 2,
  ที่จอดรถ: 2,
  เฟอร์นิเจอร์: "มีบางส่วน",
  ปีที่สร้าง: "2560",
};

// ============================
// COMPONENT แสดงผล Summary
// ============================
const PropertySummary = () => {
  const basicInfo = mockBasicInfo;
  const location = mockLocation;
  const images = mockImages;
  const details = mockDetails;

  return (
    <div className="row">
      {/* หัวข้อทรัพย์ / ข้อมูลประกาศ */}
      <div className="col-12 mb30">
        <h4 className="ff-heading fw600 mb20">ข้อมูลทรัพย์สิน</h4>
        <div className="dashboard-card p20 bdrs12 bgc-f7">
          <p className="mb5">
            <span className="fw600">หัวข้อประกาศ: </span>
            {basicInfo.title || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">ประเภทประกาศ: </span>
            {basicInfo.listingType || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">ประเภททรัพย์: </span>
            {basicInfo.propertyType || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">สภาพทรัพย์: </span>
            {basicInfo.condition || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">ราคา: </span>
            {basicInfo.price ? `${basicInfo.price.toLocaleString()} บาท` : "-"}
          </p>
          <p className="mt15">
            <span className="fw600 d-block mb5">รายละเอียดประกาศ</span>
            <span className="text-muted">
              {basicInfo.description || "ยังไม่ได้กรอกรายละเอียด"}
            </span>
          </p>
        </div>
      </div>

      {/* ที่อยู่ทรัพย์ */}
      <div className="col-12 mb30">
        <h4 className="ff-heading fw600 mb20">ที่อยู่ทรัพย์สิน</h4>
        <div className="dashboard-card p20 bdrs12 bgc-f7">
          <p className="mb5">
            <span className="fw600">ที่อยู่: </span>
            {location.address || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">จังหวัด: </span>
            {location.province || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">อำเภอ/เขต: </span>
            {location.district || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">ตำบล/แขวง: </span>
            {location.subdistrict || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">รหัสไปรษณีย์: </span>
            {location.zipCode || "-"}
          </p>
          <p className="mb5">
            <span className="fw600">พิกัด (Lat, Lng): </span>
            {location.latitude && location.longitude
              ? `${location.latitude}, ${location.longitude}`
              : "-"}
          </p>

          {/* แผนที่จากพิกัด */}
          {location.latitude && location.longitude && (
            <div className="mt20">
              <h5 className="ff-heading fw600 mb10">ตำแหน่งบนแผนที่</h5>
              <Map
                lat={Number(location.latitude)}
                lng={Number(location.longitude)}
                zoom={16}
              />
            </div>
          )}
        </div>
      </div>

      {/* รูปภาพทรัพย์ */}
      <div className="col-12 mb30">
        <h4 className="ff-heading fw600 mb20">รูปภาพทรัพย์สิน</h4>
        <div className="dashboard-card p20 bdrs12 bgc-f7">
          {images && images.length > 0 ? (
            <div className="row g-3">
              {images.map((img, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                  <div className="bdrs12 of-hidden">
                    <img
                      src={img}
                      alt={`property-${idx}`}
                      className="w-100"
                      style={{ objectFit: "cover", height: 120 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">ยังไม่ได้อัปโหลดรูปภาพ</p>
          )}
        </div>
      </div>

      {/* รายละเอียดทรัพย์เพิ่มเติม */}
      <div className="col-12 mb30">
        <h4 className="ff-heading fw600 mb20">รายละเอียดทรัพย์เพิ่มเติม</h4>
        <div className="dashboard-card p20 bdrs12 bgc-f7">
          {details && Object.keys(details).length > 0 ? (
            <div className="row">
              {Object.entries(details).map(([key, value]) => (
                <div className="col-sm-6 col-lg-3 mb10" key={key}>
                  <span className="d-block fw600 mb3">{key}</span>
                  <span>{value || "-"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">ยังไม่ได้กรอกรายละเอียดเพิ่มเติม</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySummary;
