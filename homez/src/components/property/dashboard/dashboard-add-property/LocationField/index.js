"use client";

import React, { useEffect, useState } from "react";
import SelectMulitField from "./SelectMulitField";
import Map from "./Map";
import { toast } from "react-toastify";

const LocationField = ({ initialValue, onBack, onNext, onSaveDraft }) => {
  // ที่อยู่ข้อความ
  const [address, setAddress] = useState("");

  // จังหวัด / เขต / ตำบล / ZIP / หมู่บ้าน/โครงการ
  const [locationSelect, setLocationSelect] = useState({
    province: null,
    district: null,
    subdistrict: null,
    zipCode: "",
    neighborhood: "", // ✅ หมู่บ้าน / โครงการ (ถ้ามี)
  });

  // lat / lng
  const [latitude, setLatitude] = useState(13.9869); // ค่าเริ่มต้น
  const [longitude, setLongitude] = useState(100.6184);

  // sync ค่าเดิมตอน "แก้ไข"
  useEffect(() => {
    if (!initialValue) return;

    setAddress(initialValue.address ?? "");

    const zip =
      initialValue.zipCode ??
      initialValue.zipcode ??
      initialValue.zip_code ??
      "";

    // ✅ neighborhood รองรับชื่ออื่น ๆ เผื่อของเดิมเคยใช้คนละ key
    const neighborhood =
      initialValue.neighborhood ??
      initialValue.village ??
      initialValue.projectName ?? // เผื่อเคยเก็บชื่อโครงการคอนโดใน location มาก่อน
      "";

    setLocationSelect((prev) => ({
      ...prev,
      // ทำเป็น object ที่มี label เพื่อให้ SelectMulitField โชว์ได้
      province: initialValue.province
        ? { label: initialValue.province, value: initialValue.province }
        : null,
      district: initialValue.district
        ? { label: initialValue.district, value: initialValue.district }
        : null,
      subdistrict: initialValue.subdistrict
        ? { label: initialValue.subdistrict, value: initialValue.subdistrict }
        : null,

      zipCode: zip,
      neighborhood,
    }));

    // รองรับหลายชื่อ field
    const lat =
      initialValue.latitude ??
      initialValue.lat ??
      initialValue.location?.latitude ??
      initialValue.location?.lat;

    const lng =
      initialValue.longitude ??
      initialValue.lng ??
      initialValue.location?.longitude ??
      initialValue.location?.lng;

    if (lat !== undefined && lat !== null && lat !== "") setLatitude(Number(lat));
    if (lng !== undefined && lng !== null && lng !== "") setLongitude(Number(lng));
  }, [initialValue]);

  const handleLatChange = (e) => {
    const value = e.target.value;
    setLatitude(value === "" ? "" : Number(value));
  };

  const handleLngChange = (e) => {
    const value = e.target.value;
    setLongitude(value === "" ? "" : Number(value));
  };

  // ✅ รวมข้อมูลที่จะส่งให้ parent (ชื่อ key แน่นอน)
  const buildFormData = () => ({
    address: address || "",

    province: locationSelect.province?.label || "",
    district: locationSelect.district?.label || "",
    subdistrict: locationSelect.subdistrict?.label || "",
    zipCode: locationSelect.zipCode || "",

    // ✅ ช่องเดียว: “หมู่บ้าน / โครงการ”
    neighborhood: locationSelect.neighborhood || "",

    latitude,
    longitude,
  });

  const handleNext = () => {
    const province = locationSelect.province?.label?.trim();
    const district = locationSelect.district?.label?.trim();
    const subdistrict = locationSelect.subdistrict?.label?.trim();

    // ✅ validate: บังคับที่อยู่ + จังหวัด + อำเภอ/เขต + ตำบล/แขวง + lat/lng
    if (!address.trim()) {
      toast.warn("กรุณากรอกที่อยู่ของทรัพย์สิน");
      return;
    }
    if (!province) {
      toast.warn("กรุณาเลือกจังหวัด");
      return;
    }
    if (!district) {
      toast.warn("กรุณาเลือกอำเภอ/เขต");
      return;
    }
    if (!subdistrict) {
      toast.warn("กรุณาเลือกตำบล/แขวง");
      return;
    }
    if (latitude === "" || latitude === null || Number.isNaN(Number(latitude))) {
      toast.warn("กรุณากรอกละติจูด (Latitude)");
      return;
    }
    if (longitude === "" || longitude === null || Number.isNaN(Number(longitude))) {
      toast.warn("กรุณากรอกลองจิจูด (Longitude)");
      return;
    }

    const data = buildFormData();
    onNext?.(data);
  };

  const handleSaveDraft = () => {
    const data = buildFormData();
    onSaveDraft?.(data);
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
              ที่อยู่ของทรัพย์สิน <span className="text-danger">*</span>
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

        {/* จังหวัด / อำเภอ / ตำบล / ZIP / หมู่บ้าน/โครงการ */}
        <SelectMulitField value={locationSelect} onChange={setLocationSelect} />

        {/* แผนที่ */}
        <div className="col-sm-12">
          <div className="mb20 mt30">
            <label className="heading-color ff-heading fw600 mb30">
              Place the listing pin on the map
            </label>

            <div className="row">
              <div className="col-sm-6 col-xl-4">
                <div className="mb30">
                  <label className="heading-color ff-heading fw600 mb10">
                    ละติจูด (Latitude) <span className="text-danger">*</span>
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
                    ลองจิจูด (Longitude) <span className="text-danger">*</span>
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
            </div>

            <Map lat={Number(latitude) || 0} lng={Number(longitude) || 0} zoom={14} />
          </div>
        </div>
      </div>

      {/* ปุ่มล่าง */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between mt10">
            {onBack ? (
              <button type="button" className="ud-btn btn-light" onClick={onBack}>
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
