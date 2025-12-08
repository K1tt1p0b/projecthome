import React from "react";

const amenitiesData = {
  column1: [
    { label: "ห้องใต้หลังคา", defaultChecked: false },
    { label: "สนามบาส", defaultChecked: false },
    { label: "เครื่องปรับอากาศ", defaultChecked: true },
    { label: "สนามหญ้า", defaultChecked: true },
    { label: "สระว่ายน้ำ", defaultChecked: false },
    { label: "ลานบาร์บีคิว", defaultChecked: false },
    { label: "ไมโครเวฟ", defaultChecked: false },
  ],
  column2: [
    { label: "เคเบิลทีวี", defaultChecked: false },
    { label: "เครื่องอบผ้า", defaultChecked: false },
    { label: "ฝักบัวกลางแจ้ง", defaultChecked: false },
    { label: "เครื่องซักผ้า", defaultChecked: true },
    { label: "ฟิตเนส", defaultChecked: false },
    { label: "วิวทะเล", defaultChecked: false },
    { label: "พื้นที่ส่วนตัว", defaultChecked: false },
  ],
  column3: [
    { label: "วิวทะเลสาบ", defaultChecked: false },
    { label: "ห้องเก็บไวน์", defaultChecked: false },
    { label: "สวนหน้าบ้าน", defaultChecked: true },
    { label: "ตู้เย็น", defaultChecked: true },
    { label: "WiFi", defaultChecked: true },
    { label: "ห้องซักรีด", defaultChecked: false },
    { label: "ซาวน่า", defaultChecked: false },
  ],
};

const Amenities = () => {
  return (
    <div className="row">
      {Object.keys(amenitiesData).map((columnKey, index) => (
        <div key={index} className="col-sm-6 col-lg-3 col-xxl-2">
          <div className="checkbox-style1">
            {amenitiesData[columnKey].map((amenity, amenityIndex) => (
              <label key={amenityIndex} className="custom_checkbox">
                {amenity.label}
                <input
                  type="checkbox"
                  defaultChecked={amenity.defaultChecked}
                />
                <span className="checkmark" />
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Amenities;
