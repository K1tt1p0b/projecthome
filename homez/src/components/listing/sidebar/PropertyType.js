"use client";

import React from "react";

// map UI label -> value ที่ใช้กรองใน propertyData.propertyType
const OPTIONS = [
  { label: "บ้าน/ที่ดิน", value: "house-and-land" },
  { label: "คอนโด", value: "condo" },
  { label: "ที่ดิน", value: "land" },
  { label: "ห้องเช่า", value: "room-rent" },
  { label: "ร้านค้า/ธุรกิจ", value: "shop" },
];

const PropertyType = ({ filterFunctions }) => {
  const selected = Array.isArray(filterFunctions?.propertyTypes)
    ? filterFunctions.propertyTypes
    : [];

  const isAll = selected.length === 0;

  return (
    <>
      <label className="custom_checkbox">
        ทั้งหมด
        <input
          type="checkbox"
          checked={isAll}
          onChange={() => filterFunctions?.setPropertyTypes?.([])}
        />
        <span className="checkmark" />
      </label>

      {OPTIONS.map((opt) => (
        <label className="custom_checkbox" key={opt.value}>
          {opt.label}
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => filterFunctions?.handlepropertyTypes?.(opt.value)}
          />
          <span className="checkmark" />
        </label>
      ))}
    </>
  );
};

export default PropertyType;
