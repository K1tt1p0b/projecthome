'use client'

import React from "react";
import ListingStatus from "../../sidebar/ListingStatus";
import PropertyType from "../../sidebar/PropertyType";
import PriceRange from "../../sidebar/PriceRange";
import Bedroom from "../../sidebar/Bedroom";
import Bathroom from "../../sidebar/Bathroom";

const TopFilterBar = ({ filterFunctions, setCurrentSortingOption, colstyle, setColstyle }) => {

  return (
    <>
      <div className="col-xl-9 d-none d-lg-block">
        <div className="dropdown-lists">
          <ul className="p-0 text-center text-xl-start">

            {/* ✅ 1. เปลี่ยนชื่อเป็น "สถานะ" เพื่อครอบคลุมทั้ง ขายและเช่า */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
              >
                สถานะ <i className="fa fa-angle-down ms-2" />
              </button>
              <div className="dropdown-menu">
                <div className="widget-wrapper bdrb1 pb25 mb0 pl20">
                  <h6 className="list-title">เลือกสถานะประกาศ</h6>
                  <div className="radio-element">
                    <ListingStatus filterFunctions={filterFunctions} />
                  </div>
                </div>
                <div className="text-end mt10 pr10">
                  <button type="button" className="done-btn ud-btn btn-thm drop_btn">
                    เสร็จสิ้น
                  </button>
                </div>
              </div>
            </li>

            {/* ✅ 2. ประเภททรัพย์สิน */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
              >
                ประเภททรัพย์ <i className="fa fa-angle-down ms-2" />
              </button>
              <div className="dropdown-menu">
                <div className="widget-wrapper bdrb1 pb25 mb0 pl20">
                  <h6 className="list-title">เลือกประเภททรัพย์</h6>
                  <div className="checkbox-style1">
                    <PropertyType filterFunctions={filterFunctions} />
                  </div>
                </div>
                <div className="text-end mt10 pr10">
                  <button type="button" className="done-btn ud-btn btn-thm dropdown-toggle">
                    เสร็จสิ้น
                  </button>
                </div>
              </div>
            </li>

            {/* ✅ 3. ช่วงราคา */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
              >
                ช่วงราคา <i className="fa fa-angle-down ms-2" />
              </button>
              <div className="dropdown-menu dd3">
                <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
                  <h6 className="list-title">กำหนดช่วงราคา</h6>
                  <div className="range-slider-style1">
                    <PriceRange filterFunctions={filterFunctions} />
                  </div>
                </div>
                <div className="text-end mt10 pr10">
                  <button type="button" className="done-btn ud-btn btn-thm drop_btn3">
                    เสร็จสิ้น
                  </button>
                </div>
              </div>
            </li>

            {/* ✅ 4. ห้องนอน / ห้องน้ำ */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
              >
                ห้องนอน / ห้องน้ำ <i className="fa fa-angle-down ms-2" />
              </button>
              <div className="dropdown-menu dd4 pb20">
                <div className="widget-wrapper pl20 pr20">
                  <h6 className="list-title">จำนวนห้องนอน</h6>
                  <div className="d-flex">
                    <Bedroom filterFunctions={filterFunctions} />
                  </div>
                </div>

                <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
                  <h6 className="list-title">จำนวนห้องน้ำ</h6>
                  <div className="d-flex">
                    <Bathroom filterFunctions={filterFunctions} />
                  </div>
                </div>
                <div className="text-end mt10 pr10">
                  <button type="button" className="done-btn ud-btn btn-thm drop_btn4">
                    เสร็จสิ้น
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* End .col-9 */}

      <div className="col-xl-3">
        <div className="page_control_shorting d-flex align-items-center justify-content-center justify-content-sm-end">
          <div className="pcs_dropdown pr10 d-flex align-items-center">
            <span style={{ minWidth: "60px" }}>เรียงตาม</span>

            {/* ✅ 5. ตัดตัวเลือกที่ไม่จำเป็นออก เหลือแค่ที่ใช้จริง */}
            <select
              className="form-select"
              onChange={(e) => setCurrentSortingOption && setCurrentSortingOption(e.target.value)}
            >
              <option value="Newest">ใหม่ล่าสุด</option>
              <option value="Price Low">ราคา: ต่ำ - สูง</option>
              <option value="Price High">ราคา: สูง - ต่ำ</option>
            </select>
          </div>

          {/* ปุ่ม Grid/List */}
          <div
            className={`pl15 pr15 bdrl1 bdrr1 d-none d-md-block  cursor ${!colstyle ? 'menuActive' : '#'}`}
            onClick={() => setColstyle(false)}
          >
            Grid
          </div>
          <div
            className={`pl15 d-none d-md-block  cursor ${colstyle ? 'menuActive' : '#'}`}
            onClick={() => setColstyle(true)}
          >
            List
          </div>
        </div>
      </div>
      {/* End .col-3 */}
    </>
  );
};

export default TopFilterBar;