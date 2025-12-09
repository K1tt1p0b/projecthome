"use client";
import React from "react";
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

  return (
    <div className="row">
      {/* --------------------
          ข้อมูลทรัพย์สิน
      -------------------- */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">ข้อมูลทรัพย์สิน</h4>

          {onEditBasic && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditBasic}
            >
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
                <strong>ราคา:</strong>{" "}
                {safeBasic.price
                  ? safeBasic.price.toLocaleString() + " บาท"
                  : "-"}
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
              <p>
                <strong>ที่อยู่:</strong> {safeLocation.address || "-"}
              </p>
              <p>
                <strong>จังหวัด:</strong> {safeLocation.province || "-"}
              </p>
              <p>
                <strong>อำเภอ/เขต:</strong> {safeLocation.district || "-"}
              </p>
              <p>
                <strong>ตำบล/แขวง:</strong> {safeLocation.subdistrict || "-"}
              </p>
              <p>
                <strong>รหัสไปรษณีย์:</strong> {safeLocation.zipCode || "-"}
              </p>
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
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditLocation}
            >
              {safeLocation.latitude && safeLocation.longitude
                ? "แก้ไข"
                : "เพิ่มข้อมูล"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {safeLocation.latitude && safeLocation.longitude ? (
            <Map
              lat={Number(safeLocation.latitude)}
              lng={Number(safeLocation.longitude)}
              zoom={16}
            />
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
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditImages}
            >
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
                    <img
                      src={img}
                      className="w-100"
                      style={{ height: 130, objectFit: "cover" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --------------------
          รายละเอียดทรัพย์เพิ่มเติม + สิ่งอำนวยความสะดวก
      -------------------- */}
      <div className="col-12 mb25">
        <div className="d-flex justify-content-between align-items-center mb10">
          <h4 className="ff-heading fw600 mb0">รายละเอียดทรัพย์เพิ่มเติม</h4>

          {onEditDetails && (
            <button
              type="button"
              style={editButtonStyle}
              onClick={onEditDetails}
            >
              {isEmptyObject(safeDetails) && amenities.length === 0
                ? "เพิ่มข้อมูล"
                : "แก้ไข"}
            </button>
          )}
        </div>

        <div style={cardStyle}>
          {isEmptyObject(safeDetails) && amenities.length === 0 ? (
            <p className="text-muted mb0">ยังไม่ได้กรอกรายละเอียดเพิ่มเติม</p>
          ) : (
            <>
              {/* รายละเอียดอื่น ๆ (ตัด amenities ออกไม่ให้ซ้ำ) */}
              {!isEmptyObject(safeDetails) && (
                <div className="row">
                  {Object.entries(safeDetails)
                    .filter(([key]) => key !== "amenities")
                    .map(([key, value], idx) => (
                      <div className="col-sm-6 col-md-3 mb10" key={idx}>
                        <p className="mb0">
                          <strong>{key}:</strong> {value || "-"}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              {/* สิ่งอำนวยความสะดวก */}
              {amenities.length > 0 && (
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
