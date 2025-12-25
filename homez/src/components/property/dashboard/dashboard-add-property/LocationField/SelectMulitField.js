"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "@/components/common/ClientSelect";
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
  singleValue: (provided) => ({ ...provided, color: "#222" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
};

const toOption = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object" && raw.value != null) return raw;
  const s = String(raw);
  return { value: s, label: s };
};

const sameOpt = (a, b) => String(a?.value ?? "") === String(b?.value ?? "");

const SelectMulitField = ({ value = {}, onChange }) => {
  const [province, setProvince] = useState(toOption(value.province));
  const [district, setDistrict] = useState(toOption(value.district));
  const [subdistrict, setSubdistrict] = useState(toOption(value.subdistrict));
  const [zipCode, setZipCode] = useState(value.zipCode ?? value.zipcode ?? "");
  const [neighborhood, setNeighborhood] = useState(value.neighborhood ?? "");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // กัน loop ตอน sync props
  const syncingRef = useRef(false);

  // sync จาก parent (หน้า edit)
  useEffect(() => {
    syncingRef.current = true;

    const nextProvince = toOption(value.province);
    const nextDistrict = toOption(value.district);
    const nextSubdistrict = toOption(value.subdistrict);
    const nextZip = value.zipCode ?? value.zipcode ?? "";
    const nextNeighborhood = value.neighborhood ?? "";

    setProvince((prev) => (sameOpt(prev, nextProvince) ? prev : nextProvince));
    setDistrict((prev) => (sameOpt(prev, nextDistrict) ? prev : nextDistrict));
    setSubdistrict((prev) =>
      sameOpt(prev, nextSubdistrict) ? prev : nextSubdistrict
    );

    // อย่าทับ zip ถ้า parent ไม่ส่งมา (กัน blank)
    setZipCode((prev) => (nextZip === "" ? prev : String(prev) === String(nextZip) ? prev : nextZip));
    setNeighborhood((prev) =>
      String(prev) === String(nextNeighborhood) ? prev : nextNeighborhood
    );

    const t = setTimeout(() => {
      syncingRef.current = false;
    }, 0);
    return () => clearTimeout(t);
  }, [value]);

  // provinceOptions
  const provinceOptions = useMemo(() => {
    const map = new Map();
    geography.forEach((row) => {
      const name = row.provinceNameTh;
      if (name && !map.has(name)) map.set(name, { value: name, label: name });
    });
    return Array.from(map.values());
  }, []);

  // districtOptions
  const districtOptions = useMemo(() => {
    if (!province?.value) return [];
    const map = new Map();
    geography
      .filter((row) => row.provinceNameTh === province.value)
      .forEach((row) => {
        const name = row.districtNameTh;
        if (name && !map.has(name)) map.set(name, { value: name, label: name });
      });
    return Array.from(map.values());
  }, [province]);

  // subdistrictOptions
  const subdistrictOptions = useMemo(() => {
    if (!province?.value || !district?.value) return [];
    const map = new Map();
    geography
      .filter(
        (row) =>
          row.provinceNameTh === province.value &&
          row.districtNameTh === district.value
      )
      .forEach((row) => {
        const name = row.subdistrictNameTh;
        if (name && !map.has(name)) map.set(name, { value: name, label: name });
      });
    return Array.from(map.values());
  }, [province, district]);

  // FIX: auto fill ZIP ทันทีเมื่อเลือกตำบล
  useEffect(() => {
    if (!subdistrict?.value) return;

    // match แบบละเอียดก่อน
    let row =
      geography.find(
        (r) =>
          r.provinceNameTh === province?.value &&
          r.districtNameTh === district?.value &&
          r.subdistrictNameTh === subdistrict.value
      ) || null;

    // fallback: ถ้า district/province ยังไม่ครบหรือชื่อซ้ำ ให้หา subdistrict อย่างเดียว
    if (!row) {
      row = geography.find((r) => r.subdistrictNameTh === subdistrict.value) || null;
    }

    const nextZip = row ? String(row.postalCode ?? "") : "";
    setZipCode(nextZip);
  }, [subdistrict, province, district]);

  // ส่งค่ากลับ parent (ไม่ยิงตอน sync)
  useEffect(() => {
    if (!mounted) return;
    if (!onChange) return;
    if (syncingRef.current) return;

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
          <label className="heading-color ff-heading fw600 mb10">จังหวัด</label>
          <Select
            value={province}
            onChange={(val) => {
              setProvince(val);
              setDistrict(null);
              setSubdistrict(null);
              setZipCode(""); // reset ได้ตอนเปลี่ยนจังหวัด
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
          <label className="heading-color ff-heading fw600 mb10">อำเภอ / เขต</label>
          <Select
            value={district}
            onChange={(val) => {
              setDistrict(val);
              setSubdistrict(null);
              setZipCode(""); // reset ได้ตอนเปลี่ยนอำเภอ
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
          <label className="heading-color ff-heading fw600 mb10">ตำบล / แขวง</label>
          <Select
            value={subdistrict}
            onChange={(val) => setSubdistrict(val)}
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
          <label className="heading-color ff-heading fw600 mb10">รหัสไปรษณีย์</label>
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
