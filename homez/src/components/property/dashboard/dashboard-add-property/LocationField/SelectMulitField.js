"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

// ==========================
// Mock ข้อมูลประเทศไทย
// ==========================
const thaiAddress = {
  กรุงเทพมหานคร: {
    เขตดอนเมือง: {
      subdistricts: ["สีกัน", "ดอนเมือง"],
      zip: "10210",
    },
    เขตจตุจักร: {
      subdistricts: ["จตุจักร", "ลาดยาว"],
      zip: "10900",
    },
    เขตบางกะปิ: {
      subdistricts: ["หัวหมาก", "คลองจั่น"],
      zip: "10240",
    },
  },

  นนทบุรี: {
    อำเภอเมืองนนทบุรี: {
      subdistricts: ["บางกระสอ", "บางเขน"],
      zip: "11000",
    },
    อำเภอบางบัวทอง: {
      subdistricts: ["บางบัวทอง", "บางรักพัฒนา"],
      zip: "11110",
    },
  },

  ปทุมธานี: {
    อำเภอเมืองปทุมธานี: {
      subdistricts: ["บางปรอก", "บางพูด"],
      zip: "12000",
    },
    อำเภอคลองหลวง: {
      subdistricts: ["คลองหนึ่ง", "คลองสาม"],
      zip: "12120",
    },
  },

  ชลบุรี: {
    อำเภอเมืองชลบุรี: {
      subdistricts: ["บางปลาสร้อย", "บ้านโขด"],
      zip: "20000",
    },
    อำเภอบางละมุง: {
      subdistricts: ["หนองปรือ", "นาเกลือ"],
      zip: "20150",
    },
  },
};

// Province options
const provinceOptions = Object.keys(thaiAddress).map((name) => ({
  value: name,
  label: name,
}));

const customStyles = {
  option: (styles, { isFocused, isSelected, isHovered }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#eb6753"
      : isHovered || isFocused
      ? "#eb675312"
      : undefined,
  }),
};

const SelectMultiField = () => {
  const [showSelect, setShowSelect] = useState(false);

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [subdistrict, setSubdistrict] = useState(null);
  const [zipCode, setZipCode] = useState("");

  // Neighborhood / หมู่บ้าน / โครงการ
  const [neighborhood, setNeighborhood] = useState("");

  useEffect(() => {
    setShowSelect(true);
  }, []);

  // Convert districts to options
  const districtOptions = province
    ? Object.keys(thaiAddress[province.value]).map((d) => ({
        value: d,
        label: d,
      }))
    : [];

  // Convert subdistricts to options
  const subdistrictOptions =
    province && district
      ? thaiAddress[province.value][district.value].subdistricts.map((sd) => ({
          value: sd,
          label: sd,
        }))
      : [];

  // ======================
  // Handlers
  // ======================
  const handleProvinceChange = (selected) => {
    setProvince(selected);
    setDistrict(null);
    setSubdistrict(null);
    setZipCode("");
  };

  const handleDistrictChange = (selected) => {
    setDistrict(selected);
    setSubdistrict(null);

    if (province && selected) {
      const zip = thaiAddress[province.value][selected.value].zip;
      setZipCode(zip);
    }
  };

  const handleSubdistrictChange = (selected) => {
    setSubdistrict(selected);
  };

  return (
    <>
      {/* จังหวัด */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">จังหวัด *</label>
          {showSelect && (
            <Select
              styles={customStyles}
              className="select-custom pl-0"
              classNamePrefix="select"
              placeholder="เลือกจังหวัด"
              options={provinceOptions}
              value={province}
              onChange={handleProvinceChange}
              required
            />
          )}
        </div>
      </div>

      {/* อำเภอ/เขต */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">อำเภอ/เขต *</label>
          {showSelect && (
            <Select
              styles={customStyles}
              className="select-custom pl-0"
              classNamePrefix="select"
              placeholder="เลือกอำเภอ/เขต"
              options={districtOptions}
              value={district}
              onChange={handleDistrictChange}
              isDisabled={!province}
              required
            />
          )}
        </div>
      </div>

      {/* ตำบล/แขวง */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">ตำบล/แขวง *</label>
          {showSelect && (
            <Select
              styles={customStyles}
              className="select-custom pl-0"
              classNamePrefix="select"
              placeholder="เลือกตำบล/แขวง"
              options={subdistrictOptions}
              value={subdistrict}
              onChange={handleSubdistrictChange}
              isDisabled={!district}
              required
            />
          )}
        </div>
      </div>

      {/* ZIP code */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">รหัสไปรษณีย์ *</label>
          <input
            type="text"
            className="form-control"
            placeholder="รหัสไปรษณีย์"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Neighborhood (ให้กรอกเอง) */}
      <div className="col-sm-6 col-xl-8">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            หมู่บ้าน / โครงการ / ตรอก / ซอย
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="กรอกชื่อหมู่บ้าน หรือซอย"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default SelectMultiField;
