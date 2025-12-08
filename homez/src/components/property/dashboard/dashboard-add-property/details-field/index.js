"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";

// =========================================================
// 1. ย้ายข้อมูลออกมาไว้นอกฟังก์ชัน (Global Constants)
//    เพื่อให้ข้อมูล "นิ่ง" ไม่หายเวลา Component รีเฟรช
// =========================================================

const amenitiesData = {
  column1: [
    { label: "ห้องใต้หลังคา", defaultChecked: false },
    { label: "สนามบาส", defaultChecked: false },
    { label: "เครื่องปรับอากาศ", defaultChecked: true },
    { label: "สนามหญ้า", defaultChecked: true },
    { label: "สระว่ายน้ำ", defaultChecked: false },
    { label: "ลานบาร์บีคิว", defaultChecked: false },
    { label: "ไมโครเวฟ", defaultChecked: false },
  ],
  column2: [
    { label: "เคเบิลทีวี", defaultChecked: false },
    { label: "เครื่องอบผ้า", defaultChecked: false },
    { label: "ฝักบัวกลางแจ้ง", defaultChecked: false },
    { label: "เครื่องซักผ้า", defaultChecked: true },
    { label: "ฟิตเนส", defaultChecked: false },
    { label: "วิวทะเล", defaultChecked: false },
    { label: "พื้นที่ส่วนตัว", defaultChecked: false },
  ],
  column3: [
    { label: "วิวทะเลสาบ", defaultChecked: false },
    { label: "ห้องเก็บไวน์", defaultChecked: false },
    { label: "สวนหน้าบ้าน", defaultChecked: true },
    { label: "ตู้เย็น", defaultChecked: true },
    { label: "WiFi", defaultChecked: true },
    { label: "ห้องซักรีด", defaultChecked: false },
    { label: "ซาวน่า", defaultChecked: false },
  ],
};

const bedroomOptions = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4+" },
];

const bathroomOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4+" },
];

const parkingOptions = [
  { value: "0", label: "ไม่มี" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3+" },
];

const directionOptions = [
  { value: "north", label: "ทิศเหนือ" },
  { value: "south", label: "ทิศใต้" },
  { value: "east", label: "ทิศตะวันออก" },
  { value: "west", label: "ทิศตะวันตก" },
];

const furnishOptions = [
  { value: "fully", label: "แต่งครบ (Fully)" },
  { value: "partly", label: "บางส่วน (Partly)" },
  { value: "bare", label: "ห้องเปล่า (Bare)" },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    background: '#fff',
    borderColor: '#e5e5e5',
    borderRadius: '8px',
    minHeight: '55px',
    paddingLeft: '5px',
    boxShadow: 'none',
    '&:hover': { borderColor: '#ddd' }
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? '#eb6753' : isFocused ? '#fceceb' : undefined,
    color: isSelected ? '#fff' : '#000',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#222',
  }),
  // สไตล์เพื่อให้เมนูลอยทับทุกอย่าง
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999
  })
};

// =========================================================
// 2. ตัว Component เริ่มตรงนี้ (ข้างในจะสะอาดมาก)
// =========================================================

const DetailsFiled = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <form className="form-style1">
      <div className="row">

        {/* --- แถวที่ 1 --- */}

        {/* 1. ห้องนอน */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ห้องนอน</label>
            <Select
              defaultValue={bedroomOptions[0]}
              options={bedroomOptions}
              styles={customStyles}
              classNamePrefix="select"
              isSearchable={false}
              instanceId="bedrooms"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 2. ห้องน้ำ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ห้องน้ำ</label>
            <Select
              defaultValue={bathroomOptions[0]}
              options={bathroomOptions}
              styles={customStyles}
              classNamePrefix="select"
              isSearchable={false}
              instanceId="bathrooms"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 3. จำนวนชั้น */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">จำนวนชั้น</label>
            <input
              type="text"
              className="form-control"
              placeholder="เช่น 12A"
              style={{ height: '55px' }}
            />
          </div>
        </div>

        {/* 4. ที่จอดรถ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ที่จอดรถ (คัน)</label>
            <Select
              options={parkingOptions}
              styles={customStyles}
              classNamePrefix="select"
              placeholder="ระบุ"
              isSearchable={false}
              instanceId="parking"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* --- แถวที่ 2 --- */}

        {/* 5. ขนาดพื้นที่ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ขนาด (ตร.ม.)</label>
            <input
              type="number"
              className="form-control"
              placeholder="ระบุขนาด"
              style={{ height: '55px' }}
            />
          </div>
        </div>

        {/* 6. ทิศหน้าทรัพย์ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ทิศหน้าทรัพย์</label>
            <Select
              options={directionOptions}
              styles={customStyles}
              classNamePrefix="select"
              placeholder="ระบุทิศ"
              isSearchable={false}
              instanceId="direction"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 7. การตกแต่ง */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">การตกแต่ง</label>
            <Select
              options={furnishOptions}
              styles={customStyles}
              classNamePrefix="select"
              placeholder="ระบุ"
              isSearchable={false}
              instanceId="furnishing"
              menuPosition="fixed"
              menuPortalTarget={mounted ? document.body : null}
            />
          </div>
        </div>

        {/* 8. ปีที่สร้างเสร็จ */}
        <div className="col-sm-6 col-md-3">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">ปีที่สร้าง (พ.ศ.)</label>
            <input
              type="number"
              className="form-control"
              placeholder="เช่น 2565"
              style={{ height: '55px' }}
            />
          </div>
        </div>

      </div>
      {/* จบส่วน Details */}


      {/* ================= ส่วน Amenities (สิ่งอำนวยความสะดวก) ================= */}
      <div className="row">
        <div className="col-sm-12">
          <div className="mb20">
            <h4 className="title fz17 mb30">สิ่งอำนวยความสะดวก</h4>
          </div>
        </div>

        {Object.keys(amenitiesData).map((columnKey, index) => (
          <div key={index} className="col-sm-6 col-lg-4">
            <div className="checkbox-style1">
              {amenitiesData[columnKey].map((amenity, amenityIndex) => (
                <label key={amenityIndex} className="custom_checkbox">
                  {amenity.label}
                  <input
                    type="checkbox"
                    defaultChecked={amenity.defaultChecked}
                  />
                  <span className="checkmark" />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>


      {/* ================= ส่วนหมายเหตุ ================= */}
      <div className="row mt30">
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              หมายเหตุ (สำหรับเจ้าของ/นายหน้า)
            </label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="บันทึกช่วยจำ (ไม่แสดงหน้าเว็บ)"
            />
          </div>
        </div>
      </div>

    </form>
  );
};

export default DetailsFiled;