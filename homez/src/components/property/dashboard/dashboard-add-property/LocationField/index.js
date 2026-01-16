"use client";

import React, { useEffect, useState } from "react";
import SelectMulitField from "./SelectMulitField";
import LeafletMap from "@/components/common/LeafletMap";
import { toast } from "react-toastify";

const LocationField = ({ initialValue, onBack, onNext, onSaveDraft }) => {
  const [address, setAddress] = useState("");

  const [locationSelect, setLocationSelect] = useState({
    province: null,
    district: null,
    subdistrict: null,
    zipCode: "",
    neighborhood: "",
  });

  const [latitude, setLatitude] = useState(13.9869);
  const [longitude, setLongitude] = useState(100.6184);

  useEffect(() => {
    if (!initialValue) return;

    setAddress(initialValue.address ?? "");

    const zip =
      initialValue.zipCode ??
      initialValue.zipcode ??
      initialValue.zip_code ??
      "";

    const neighborhood =
      initialValue.neighborhood ??
      initialValue.village ??
      initialValue.projectName ??
      "";

    setLocationSelect((prev) => ({
      ...prev,
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

  const buildFormData = () => ({
    address: address || "",
    province: locationSelect.province?.label || "",
    district: locationSelect.district?.label || "",
    subdistrict: locationSelect.subdistrict?.label || "",
    zipCode: locationSelect.zipCode || "",
    neighborhood: locationSelect.neighborhood || "",
    latitude,
    longitude,
  });

  const handleNext = () => {
    const province = locationSelect.province?.label?.trim();
    const district = locationSelect.district?.label?.trim();
    const subdistrict = locationSelect.subdistrict?.label?.trim();

    if (!address.trim()) return toast.warn("กรุณากรอกที่อยู่ของทรัพย์สิน");
    if (!province) return toast.warn("กรุณาเลือกจังหวัด");
    if (!district) return toast.warn("กรุณาเลือกอำเภอ/เขต");
    if (!subdistrict) return toast.warn("กรุณาเลือกตำบล/แขวง");

    if (latitude === "" || latitude === null || Number.isNaN(Number(latitude))) {
      return toast.warn("กรุณากรอกละติจูด (Latitude)");
    }
    if (longitude === "" || longitude === null || Number.isNaN(Number(longitude))) {
      return toast.warn("กรุณากรอกลองจิจูด (Longitude)");
    }

    onNext?.(buildFormData());
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(buildFormData());
    alert("บันทึกร่างตำแหน่งทรัพย์เรียบร้อย (mock)");
  };

  const safeLat = Number.isFinite(Number(latitude)) ? Number(latitude) : 13.9869;
  const safeLng = Number.isFinite(Number(longitude)) ? Number(longitude) : 100.6184;

  return (
    <form
      className="form-style1"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="row">
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

        <SelectMulitField value={locationSelect} onChange={setLocationSelect} />

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

            <LeafletMap
              lat={safeLat}
              lng={safeLng}
              zoom={14}
              height={550}
              draggable
              clickToMove
              enableSearch
              enableGPS
              restrictToThailand={true}
              // (optional) ถ้าอยากให้ reset กลับค่าที่โหลดมาตอนแรก
              initialPosition={{ lat: safeLat, lng: safeLng }}
              onChange={({ lat, lng }) => {
              setLatitude(lat);
              setLongitude(lng);
              }}
              scrollWheelZoom={true}
              requireCtrlToZoom={true}
              wheelHintText="กด Ctrl + Scroll Mouse ขึ้นลงเพื่อซูมแผนที่"
              onAddressChange={({ displayName, address }) => {
              // displayName = ที่อยู่เต็มแบบสตริง
              // address = object แยกส่วน เช่น { province, state, county, ... } (แล้วแต่พื้นที่)
              // ตัวอย่าง: ถ้าอยากเอาไปเติม address input:
              // setAddress(displayName);

              // หรือ log ดูโครงก่อน:
              // console.log(displayName, address);
              }}
            />

          </div>
        </div>
      </div>

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
              <button type="button" className="ud-btn btn-light" onClick={handleSaveDraft}>
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
