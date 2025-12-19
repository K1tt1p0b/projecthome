"use client";

import React, { useState } from "react";
import SelectMulitField from "./SelectMulitField";
import Map from "./Map";
import { toast } from "react-toastify";

const LocationField = ({ onBack, onNext, onSaveDraft }) => {
  // ที่อยู่ข้อความ
  const [address, setAddress] = useState("");

  // จังหวัด / เขต / ตำบล / ZIP / หมู่บ้าน
  const [locationSelect, setLocationSelect] = useState({
    province: null,
    district: null,
    subdistrict: null,
    zipCode: "",
    neighborhood: "",
  });

  // lat / lng
  const [latitude, setLatitude] = useState(13.9869); // ค่าเริ่มต้น
  const [longitude, setLongitude] = useState(100.6184);


  const handleLatChange = (e) => {
    const value = e.target.value;
    setLatitude(value === "" ? "" : Number(value));
  };

  const handleLngChange = (e) => {
    const value = e.target.value;
    setLongitude(value === "" ? "" : Number(value));
  };

  // รวมข้อมูลที่จะส่งให้ parent
  const buildFormData = () => ({
    address,
    // ดึงค่าจาก SelectMulitField
    province: locationSelect.province?.label || "",
    district: locationSelect.district?.label || "",
    subdistrict: locationSelect.subdistrict?.label || "",
    zipCode: locationSelect.zipCode || "",
    neighborhood: locationSelect.neighborhood || "",
    latitude,
    longitude,
  });

  const handleNext = () => {
    // validate ขั้นต่ำก่อน
    if (!address.trim() || latitude === "" || longitude === "") {
      toast.warn("กรุณากรอกที่อยู่ และละติจูด/ลองจิจูดให้ครบถ้วน");
      return;
    }

    const data = buildFormData();
    if (onNext) {
      onNext(data);
    } else {
      console.log("Location next:", data);
    }
  };

  const handleSaveDraft = () => {
    const data = buildFormData();
    if (onSaveDraft) {
      onSaveDraft(data);
    } else {
      console.log("Location draft:", data);
    }
    alert("บันทึกร่างตำแหน่งทรัพย์เรียบร้อย (mock)");
  };

  return (
    <form
      className="form-style1"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="row">
        {/* ที่อยู่ของทรัพย์สิน */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ที่อยู่ของทรัพย์สิน *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="กรอกที่อยู่ของทรัพย์สิน"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* จังหวัด / อำเภอ / ตำบล / ZIP / หมู่บ้าน */}
        <SelectMulitField
          value={locationSelect}
          onChange={(val) => setLocationSelect(val)}
        />

        {/* แผนที่ */}
        <div className="col-sm-12">
          <div className="mb20 mt30">
            <label className="heading-color ff-heading fw600 mb30">
              Place the listing pin on the map
            </label>
            <Map lat={latitude || 0} lng={longitude || 0} zoom={14} />
          </div>
        </div>
      </div>

      {/* Lat / Lng + ปุ่ม */}
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              ละติจูด (Latitude) *
            </label>
            <input
              type="number"
              className="form-control"
              value={latitude}
              onChange={handleLatChange}
              placeholder="เช่น 13.7563"
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              ลองจิจูด (Longitude) *
            </label>
            <input
              type="number"
              className="form-control"
              value={longitude}
              onChange={handleLngChange}
              placeholder="เช่น 100.5018"
            />
          </div>
        </div>

        {/* ปุ่มล่าง */}
        <div className="col-12">
          <div className="d-flex justify-content-between mt10">
            {/* ปุ่มย้อนกลับ แสดงเฉพาะถ้ามี onBack */}
            {onBack ? (
              <button
                type="button"
                className="ud-btn btn-light"
                onClick={onBack}
              >
                ย้อนกลับ
              </button>
            ) : (
              <span />
            )}

            <div className="d-flex gap-2">
              <button
                type="button"
                className="ud-btn btn-light"
                onClick={handleSaveDraft}
              >
                บันทึกร่าง
              </button>
              <button type="submit" className="ud-btn btn-thm">
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LocationField;
