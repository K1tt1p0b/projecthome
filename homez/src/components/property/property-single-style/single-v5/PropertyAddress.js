import ListingMap1 from "@/components/listing/map-style/ListingMap1";
import React from "react";

const PropertyAddress = () => {
  const addressData = {
    address: "10425 ถนนสุขุมวิท",
    city: "เขตวัฒนา",
    state: "กรุงเทพมหานคร",
    zipCode: "10110",
    country: "ไทย",
  };

  return (
    <>
      {/* ใช้ row เพื่อห่อหุ้มคอลัมน์ */}
      <div className="col-lg-12">
        <div className="row">
          
          {/* 🟢 คอลัมน์ซ้าย: แสดง ที่อยู่, อำเภอ, จังหวัด */}
          <div className="col-md-6">
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">ที่อยู่</span>
              <span className="text-black">{addressData.address}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">อำเภอ/เขต</span>
              <span className="text-black">{addressData.city}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">จังหวัด</span>
              <span className="text-black">{addressData.state}</span>
            </div>
          </div>

          {/* 🟢 คอลัมน์ขวา: แสดง รหัสไปรษณีย์, ประเทศ */}
          <div className="col-md-6">
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">รหัสไปรษณีย์</span>
              <span className="text-black">{addressData.zipCode}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">ประเทศ</span>
              <span className="text-black">{addressData.country}</span>
            </div>
          </div>

        </div>
      </div>

      {/* แผนที่ */}
      <div className="col-md-12 h-500 mt30" style={{ height: '400px' }}>
        <ListingMap1 />
      </div>
    </>
  );
};

export default PropertyAddress;