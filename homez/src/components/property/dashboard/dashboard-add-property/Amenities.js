"use client";
import React from "react";

const amenitiesData = {
  column1: [
    { label: "เคเบิลทีวี", defaultChecked: false },
    { label: "สนามบาส", defaultChecked: false },
    { label: "เครื่องปรับอากาศ", defaultChecked: true },
  ],
  column2: [
    { label: "กล้องวงจรปิด", defaultChecked: false },
    { label: "ฟิตเนส", defaultChecked: false },
    { label: "WiFi", defaultChecked: false },
    //{ label: "พื้นที่ส่วนตัว", defaultChecked: false },
  ],
  column3: [
    { label: "ที่จอดรถ", defaultChecked: false },
    { label: "เครื่องซักผ้า", defaultChecked: false },
    { label: "ตู้เย็น", defaultChecked: false },
  ],
  column4: [
    { label: "สวน", defaultChecked: true },
    { label: "สระว่ายน้ำ", defaultChecked: false },
    { label: "เครื่องอบผ้า", defaultChecked: true },
  ],
  column5: [
    { label: "ไมโครเวฟ", defaultChecked: false },
  ],
};

/**
 * props:
 *  - value: string[] (ชื่อ amenity ที่เลือก เช่น ["สระว่ายน้ำ", "WiFi"])
 *  - onChange: (newValue: string[]) => void
 */
const Amenities = ({ value = [], onChange }) => {
  const handleToggle = (label) => {
    let newValue;
    if (value.includes(label)) {
      newValue = value.filter((item) => item !== label);
    } else {
      newValue = [...value, label];
    }
    onChange?.(newValue);
  };

  return (
    <div className="row">
      {Object.keys(amenitiesData).map((columnKey) => (
        <div key={columnKey} className="col-sm-6 col-lg-3 col-xxl-2">
          <div className="checkbox-style1">
            {amenitiesData[columnKey].map((amenity) => (
              <label key={amenity.label} className="custom_checkbox">
                {amenity.label}
                <input
                  type="checkbox"
                  checked={value.includes(amenity.label)} // ใช้ value จาก props
                  onChange={() => handleToggle(amenity.label)}
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
