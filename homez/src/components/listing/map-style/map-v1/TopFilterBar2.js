"use client";

import React, { useMemo } from "react";
import PropertyType from "../../sidebar/PropertyType";
import PriceRange from "../../sidebar/PriceRange";
import Bedroom from "../../sidebar/Bedroom";
import Bathroom from "../../sidebar/Bathroom";
import ListingStatus from "../../sidebar/ListingStatus";

const statusLabel = (listingStatus) => {
  // listingStatus เดิมใน template: "All" | "Buy" | "Rent"
  const v = String(listingStatus || "All");
  if (v === "Buy") return "ขาย";
  if (v === "Rent") return "เช่า";
  return "ทั้งหมด";
};

const TopFilterBar2 = ({ filterFunctions }) => {
  const label = useMemo(
    () => statusLabel(filterFunctions?.listingStatus),
    [filterFunctions?.listingStatus]
  );

  return (
    <>
      {/* Listing Status */}
      <li className="list-inline-item position-relative">
        <button
          type="button"
          className="open-btn mb15 dropdown-toggle"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
        >
          {label} <i className="fa fa-angle-down ms-2" />
        </button>

        <div className="dropdown-menu">
          <div className="widget-wrapper bdrb1 pb25 mb0 pl20">
            <h6 className="list-title">ประเภทประกาศ</h6>
            <div className="radio-element">
              <ListingStatus filterFunctions={filterFunctions} />
            </div>
          </div>

          <div className="text-end mt10 pr10">
            <button
              type="button"
              className="done-btn ud-btn btn-thm drop_btn"
              data-bs-dismiss="dropdown"
            >
              Done
            </button>
          </div>
        </div>
      </li>

      {/* Property Type */}
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
            <h6 className="list-title">Property Type</h6>
            <div className="checkbox-style1">
              <PropertyType filterFunctions={filterFunctions} />
            </div>
          </div>

          <div className="text-end mt10 pr10">
            <button
              type="button"
              className="done-btn ud-btn btn-thm"
              data-bs-dismiss="dropdown"
            >
              Done
            </button>
          </div>
        </div>
      </li>

      {/* Price */}
      <li className="list-inline-item position-relative">
        <button
          type="button"
          className="open-btn mb15 dropdown-toggle"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
        >
          ราคา <i className="fa fa-angle-down ms-2" />
        </button>

        <div className="dropdown-menu dd3">
          <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
            <h6 className="list-title">Price Range</h6>
            <div className="range-slider-style1">
              <PriceRange filterFunctions={filterFunctions} />
            </div>
          </div>

          <div className="text-end mt10 pr10">
            <button
              type="button"
              className="done-btn ud-btn btn-thm drop_btn3"
              data-bs-dismiss="dropdown"
            >
              Done
            </button>
          </div>
        </div>
      </li>

      {/* Beds / Baths */}
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
            <h6 className="list-title">Bedrooms</h6>
            <div className="d-flex">
              <Bedroom filterFunctions={filterFunctions} />
            </div>
          </div>

          <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
            <h6 className="list-title">Bathrooms</h6>
            <div className="d-flex">
              <Bathroom filterFunctions={filterFunctions} />
            </div>
          </div>

          <div className="text-end mt10 pr10">
            <button
              type="button"
              className="done-btn ud-btn btn-thm drop_btn4"
              data-bs-dismiss="dropdown"
            >
              Done
            </button>
          </div>
        </div>
      </li>

      {/* More Filter */}
      <li className="list-inline-item">
        <button
          type="button"
          className="open-btn mb15"
          data-bs-toggle="modal"
          data-bs-target="#advanceSeachModal"
        >
          <i className="flaticon-settings me-2" /> More Filter
        </button>
      </li>
    </>
  );
};

export default TopFilterBar2;
