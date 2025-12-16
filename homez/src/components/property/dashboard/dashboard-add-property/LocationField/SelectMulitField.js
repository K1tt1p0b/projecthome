"use client";

import React, { useEffect, useMemo, useState } from "react";
import Select from "@/components/common/ClientSelect";

// ดึงข้อมูลจาก geography.json (วางไฟล์ไว้โฟลเดอร์เดียวกัน)
import geography from "./geography.json";

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

const SelectMulitField = ({ value = {}, onChange }) => {
  const [province, setProvince] = useState(value.province || null);
  const [district, setDistrict] = useState(value.district || null);
  const [subdistrict, setSubdistrict] = useState(value.subdistrict || null);
  const [zipCode, setZipCode] = useState(value.zipCode || "");
  const [neighborhood, setNeighborhood] = useState(value.neighborhood || "");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ------- สร้าง options จาก geography.json โดยตรง -------

  // provinceOptions: รายชื่อจังหวัดไม่ซ้ำ
  const provinceOptions = useMemo(() => {
    const map = new Map();
    geography.forEach((row) => {
      const name = row.provinceNameTh;
      if (!map.has(name)) {
        map.set(name, { value: name, label: name });
      }
    });
    return Array.from(map.values());
  }, []);

  // districtOptions: รายชื่ออำเภอตามจังหวัดที่เลือก
  const districtOptions = useMemo(() => {
    if (!province) return [];
    const map = new Map();
    geography
      .filter((row) => row.provinceNameTh === province.value)
      .forEach((row) => {
        const name = row.districtNameTh;
        if (!map.has(name)) {
          map.set(name, { value: name, label: name });
        }
      });
    return Array.from(map.values());
  }, [province]);

  // subdistrictOptions: รายชื่อตำบลตามอำเภอที่เลือก
  const subdistrictOptions = useMemo(() => {
    if (!district) return [];
    const map = new Map();
    geography
      .filter((row) => row.districtNameTh === district.value)
      .forEach((row) => {
        const name = row.subdistrictNameTh;
        if (!map.has(name)) {
          map.set(name, { value: name, label: name });
        }
      });
    return Array.from(map.values());
  }, [district]);

  // auto fill ZIP จากตำบล
  useEffect(() => {
    if (subdistrict) {
      const row = geography.find(
        (r) => r.subdistrictNameTh === subdistrict.value
      );
      setZipCode(row ? String(row.postalCode || "") : "");
    } else {
      setZipCode("");
    }
  }, [subdistrict]);

  // ส่งค่ากลับให้ parent
  useEffect(() => {
    if (!onChange) return;
    onChange({
      province,
      district,
      subdistrict,
      zipCode,
      neighborhood,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province, district, subdistrict, zipCode, neighborhood, mounted]);

  if (!mounted) return null;

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

      {/* อำเภอ / เขต */}
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

      {/* ตำบล / แขวง */}
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

      {/* รหัสไปรษณีย์ */}
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
