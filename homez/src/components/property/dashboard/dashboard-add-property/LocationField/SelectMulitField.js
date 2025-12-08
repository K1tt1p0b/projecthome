"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";

const customStyles = {
  control: (provided) => ({
    ...provided,
    background: "#fff",
    borderColor: "#e5e5e5",
    borderRadius: "8px",
    minHeight: "55px",
    paddingLeft: "5px",
    boxShadow: "none",
    "&:hover": { borderColor: "#ddd" },
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#eb6753" : isFocused ? "#fceceb" : undefined,
    color: isSelected ? "#fff" : "#000",
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#222",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

// ---------- MOCK DATA ----------
const provinceOptions = [
  { value: "กรุงเทพมหานคร", label: "กรุงเทพมหานคร" },
  { value: "ปทุมธานี", label: "ปทุมธานี" },
  { value: "นนทบุรี", label: "นนทบุรี" },
];

const districtOptionsMock = {
  กรุงเทพมหานคร: [
    { value: "เขตปทุมวัน", label: "เขตปทุมวัน" },
    { value: "เขตจตุจักร", label: "เขตจตุจักร" },
  ],
  ปทุมธานี: [
    { value: "คลองหลวง", label: "คลองหลวง" },
    { value: "ธัญบุรี", label: "ธัญบุรี" },
  ],
  นนทบุรี: [
    { value: "ปากเกร็ด", label: "ปากเกร็ด" },
    { value: "เมืองนนทบุรี", label: "เมืองนนทบุรี" },
  ],
};

const subdistrictOptionsMock = {
  คลองหลวง: [
    { value: "คลองหนึ่ง", label: "คลองหนึ่ง" },
    { value: "คลองสอง", label: "คลองสอง" },
  ],
  ธัญบุรี: [
    { value: "ประชาธิปัตย์", label: "ประชาธิปัตย์" },
    { value: "รังสิต", label: "รังสิต" },
  ],
};

// mapping ตำบล → รหัสไปรษณีย์ (ตัวอย่าง)
const zipBySubdistrict = {
  คลองหนึ่ง: "12120",
  คลองสอง: "12121",
  ประชาธิปัตย์: "12130",
  รังสิต: "12110",
};

const SelectMulitField = ({ value = {}, onChange }) => {
  const [province, setProvince] = useState(value.province || null);
  const [district, setDistrict] = useState(value.district || null);
  const [subdistrict, setSubdistrict] = useState(value.subdistrict || null);
  const [zipCode, setZipCode] = useState(value.zipCode || "");
  const [neighborhood, setNeighborhood] = useState(value.neighborhood || "");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // auto fill ZIP จากตำบลทุกครั้งที่ subdistrict เปลี่ยน
  useEffect(() => {
    if (subdistrict) {
      const code = zipBySubdistrict[subdistrict.value] || "";
      setZipCode(code);
    } else {
      setZipCode("");
    }
  }, [subdistrict]);

  // ส่งค่ากลับไปให้ parent เวลา field ใด ๆ เปลี่ยน
  useEffect(() => {
    if (!onChange) return;
    onChange({
      province,
      district,
      subdistrict,
      zipCode,
      neighborhood,
    });
    // อย่าใส่ onChange ใน dependency เดี๋ยว loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province, district, subdistrict, zipCode, neighborhood, mounted]);

  const districtOptions =
    province && districtOptionsMock[province.value]
      ? districtOptionsMock[province.value]
      : [];

  const subdistrictOptions =
    district && subdistrictOptionsMock[district.value]
      ? subdistrictOptionsMock[district.value]
      : [];

      if (!mounted) {
    return null;
  }

  return (
    <>
      {/* จังหวัด */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            จังหวัด
          </label>
          <Select
            value={province}
            onChange={(val) => {
              setProvince(val);
              setDistrict(null);
              setSubdistrict(null);
            }}
            options={provinceOptions}
            styles={customStyles}
            classNamePrefix="select"
            placeholder="เลือกจังหวัด"
            isSearchable
            menuPortalTarget={mounted ? document.body : null}
            menuPosition="fixed"
          />
        </div>
      </div>

      {/* อำเภอ/เขต */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            อำเภอ / เขต
          </label>
          <Select
            value={district}
            onChange={(val) => {
              setDistrict(val);
              setSubdistrict(null);
            }}
            options={districtOptions}
            styles={customStyles}
            classNamePrefix="select"
            placeholder="เลือกอำเภอ / เขต"
            isSearchable
            isDisabled={!province}
            menuPortalTarget={mounted ? document.body : null}
            menuPosition="fixed"
          />
        </div>
      </div>

      {/* ตำบล/แขวง */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            ตำบล / แขวง
          </label>
          <Select
            value={subdistrict}
            onChange={setSubdistrict}
            options={subdistrictOptions}
            styles={customStyles}
            classNamePrefix="select"
            placeholder="เลือกตำบล / แขวง"
            isSearchable
            isDisabled={!district}
            menuPortalTarget={mounted ? document.body : null}
            menuPosition="fixed"
          />
        </div>
      </div>

      {/* หมู่บ้าน / โครงการ */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            หมู่บ้าน / โครงการ (Neighborhood)
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="เช่น หมู่บ้านฟิวเจอร์วิลล์"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </div>
      </div>

      {/* รหัสไปรษณีย์ (auto จากตำบล) */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            รหัสไปรษณีย์
          </label>
          <input
            type="text"
            className="form-control"
            value={zipCode}
            readOnly
            placeholder="ระบบจะกำหนดจากตำบล/แขวงที่เลือก"
          />
        </div>
      </div>
    </>
  );
};

export default SelectMulitField;
