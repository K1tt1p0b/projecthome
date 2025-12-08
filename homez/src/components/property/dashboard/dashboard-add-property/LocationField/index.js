"use client";

import React, { useState } from "react";
import SelectMulitField from "./SelectMulitField";
import Map from "./Map";

const LocationField = () => {
  const [latitude, setLatitude] = useState(13.9869);   // ค่าเริ่มต้น: กทม.
  const [longitude, setLongitude] = useState(100.6184);

  const handleLatChange = (e) => {
    const value = e.target.value;
    setLatitude(value === "" ? "" : Number(value));
  };

  const handleLngChange = (e) => {
    const value = e.target.value;
    setLongitude(value === "" ? "" : Number(value));
  };

  return (
    <form className="form-style1">
      <div className="row">
        {/* ที่อยู่ของทรัพย์สิน */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              ที่อยู่ของทรัพย์สิน
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="กรอกที่อยู่ของทรัพย์สิน"
            />
          </div>
        </div>

        {/* จังหวัด / อำเภอ / ตำบล จาก SelectMulitField */}
        <SelectMulitField />

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

      {/* Lat / Lng */}
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              ละติจูด (Latitude)
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
              ลองจิจูด (Longitude)
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
    </form>
  );
};

export default LocationField;
