"use client";

import React, { useMemo } from "react";

const statusLabel = (listingStatus) => {
  const v = String(listingStatus || "All");
  if (v === "Buy") return "ขาย";
  if (v === "Rent") return "เช่า";
  return "ทั้งหมด";
};

const TYPE_OPTIONS = [
  { key: "house-and-land", label: "บ้าน / บ้านพร้อมที่ดิน" },
  { key: "condo", label: "คอนโด" },
  { key: "land", label: "ที่ดิน" },
  { key: "room-rent", label: "ห้องเช่า / หอพัก" },
  { key: "shop", label: "ร้านค้า / พาณิชย์" },
  { key: "office", label: "ออฟฟิศ" },
  { key: "warehouse", label: "โกดัง" },
];

function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

const TopFilterBar2 = ({ filterFunctions }) => {
  const listingStatus = filterFunctions?.listingStatus ?? "All";
  const propertyTypes = Array.isArray(filterFunctions?.propertyTypes)
    ? filterFunctions.propertyTypes
    : [];
  const priceRange = Array.isArray(filterFunctions?.priceRange)
    ? filterFunctions.priceRange
    : [0, 100000000];
  const bedrooms = Number(filterFunctions?.bedrooms ?? 0);
  const bathroms = Number(filterFunctions?.bathroms ?? 0);

  const label = useMemo(() => statusLabel(listingStatus), [listingStatus]);

  const typeSummary = useMemo(() => {
    if (!propertyTypes?.length) return "ทั้งหมด";
    if (propertyTypes.length === 1) {
      const found = TYPE_OPTIONS.find((x) => x.key === propertyTypes[0]);
      return found?.label || "เลือกแล้ว 1";
    }
    return `เลือกแล้ว ${propertyTypes.length}`;
  }, [propertyTypes]);

  const priceSummary = useMemo(() => {
    const [min, max] = priceRange;
    const mn = Number(min ?? 0);
    const mx = Number(max ?? 0);
    if (!Number.isFinite(mn) || !Number.isFinite(mx)) return "ไม่จำกัด";
    if (mn <= 0 && mx >= 100000000) return "ไม่จำกัด";
    return `฿${mn.toLocaleString()} - ฿${mx.toLocaleString()}`;
  }, [priceRange]);

  const bedBathSummary = useMemo(() => {
    const b = bedrooms || 0;
    const ba = bathroms || 0;
    if (!b && !ba) return "ไม่จำกัด";
    if (b && !ba) return `ห้องนอน ${b}+`;
    if (!b && ba) return `ห้องน้ำ ${ba}+`;
    return `นอน ${b}+ · น้ำ ${ba}+`;
  }, [bedrooms, bathroms]);

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
          <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
            <h6 className="list-title">ประเภทประกาศ</h6>

            <div className="radio-element">
              <label className="radio mb10">
                <input
                  type="radio"
                  name="lx_listingStatus"
                  checked={String(listingStatus) === "All"}
                  onChange={() => filterFunctions?.handlelistingStatus?.("All")}
                />
                <span className="checkmark" />
                ทั้งหมด
              </label>

              <label className="radio mb10">
                <input
                  type="radio"
                  name="lx_listingStatus"
                  checked={String(listingStatus) === "Buy"}
                  onChange={() => filterFunctions?.handlelistingStatus?.("Buy")}
                />
                <span className="checkmark" />
                ขาย
              </label>

              <label className="radio">
                <input
                  type="radio"
                  name="lx_listingStatus"
                  checked={String(listingStatus) === "Rent"}
                  onChange={() => filterFunctions?.handlelistingStatus?.("Rent")}
                />
                <span className="checkmark" />
                เช่า
              </label>
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
          title={typeSummary}
        >
          ประเภททรัพย์: {typeSummary} <i className="fa fa-angle-down ms-2" />
        </button>

        <div className="dropdown-menu">
          <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
            <h6 className="list-title">ประเภททรัพย์</h6>

            <div className="checkbox-style1">
              <label className="custom_checkbox mb10">
                <input
                  type="checkbox"
                  checked={!propertyTypes.length}
                  onChange={() => filterFunctions?.handlepropertyTypes?.("All")}
                />
                <span className="checkmark" />
                ทั้งหมด
              </label>

              {TYPE_OPTIONS.map((t) => (
                <label className="custom_checkbox mb10" key={t.key}>
                  <input
                    type="checkbox"
                    checked={propertyTypes.includes(t.key)}
                    onChange={() => filterFunctions?.handlepropertyTypes?.(t.key)}
                  />
                  <span className="checkmark" />
                  {t.label}
                </label>
              ))}
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
          title={priceSummary}
        >
          ราคา: {priceSummary} <i className="fa fa-angle-down ms-2" />
        </button>

        <div className="dropdown-menu dd3">
          <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
            <h6 className="list-title">Price Range</h6>

            <div className="range-slider-style1">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label mb5">ต่ำสุด</label>
                  <input
                    className="form-control"
                    type="number"
                    value={Number(priceRange?.[0] ?? 0)}
                    onChange={(e) => {
                      const min = clamp(e.target.value, 0, 100000000);
                      const max = clamp(priceRange?.[1] ?? 100000000, 0, 100000000);
                      filterFunctions?.handlepriceRange?.([min, Math.max(min, max)]);
                    }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label mb5">สูงสุด</label>
                  <input
                    className="form-control"
                    type="number"
                    value={Number(priceRange?.[1] ?? 100000000)}
                    onChange={(e) => {
                      const max = clamp(e.target.value, 0, 100000000);
                      const min = clamp(priceRange?.[0] ?? 0, 0, 100000000);
                      filterFunctions?.handlepriceRange?.([Math.min(min, max), max]);
                    }}
                  />
                </div>
              </div>

              <div className="mt10">
                <button
                  type="button"
                  className="ud-btn btn-light"
                  onClick={() => filterFunctions?.handlepriceRange?.([0, 100000000])}
                >
                  ไม่จำกัด
                </button>
              </div>
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
          title={bedBathSummary}
        >
          ห้องนอน / ห้องน้ำ: {bedBathSummary}{" "}
          <i className="fa fa-angle-down ms-2" />
        </button>

        <div className="dropdown-menu dd4 pb20">
          <div className="widget-wrapper pl20 pr20">
            <h6 className="list-title">Bedrooms</h6>
            <div className="d-flex gap-2 flex-wrap">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={`bed-${n}`}
                  type="button"
                  className={`ud-btn btn-light ${bedrooms === n ? "active" : ""}`}
                  onClick={() => filterFunctions?.handlebedrooms?.(n)}
                >
                  {n === 0 ? "ไม่จำกัด" : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
            <h6 className="list-title">Bathrooms</h6>
            <div className="d-flex gap-2 flex-wrap">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={`bath-${n}`}
                  type="button"
                  className={`ud-btn btn-light ${bathroms === n ? "active" : ""}`}
                  onClick={() => filterFunctions?.handlebathroms?.(n)}
                >
                  {n === 0 ? "ไม่จำกัด" : `${n}+`}
                </button>
              ))}
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

      {/* Reset */}
      <li className="list-inline-item">
        <button
          type="button"
          className="open-btn mb15"
          onClick={() => filterFunctions?.resetFilter?.()}
          title="ล้างตัวกรองทั้งหมด"
        >
          ล้างตัวกรอง
        </button>
      </li>
    </>
  );
};

export default TopFilterBar2;
