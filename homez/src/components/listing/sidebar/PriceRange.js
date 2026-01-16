"use client";

import React, { useEffect, useMemo, useState } from "react";
import Slider from "rc-slider";

const clampNum = (n, fallback = 0) => {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
};

const fmt = (n) =>
  new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(
    clampNum(n, 0)
  );

const PriceRange = ({ filterFunctions }) => {
  const max = 100000000; // 100 ล้าน (ให้พอสำหรับขาย)
  const min = 0;

  const initial = useMemo(() => {
    const r = filterFunctions?.priceRange;
    const a = clampNum(r?.[0], 0);
    const b = clampNum(r?.[1], 100000);
    const lo = Math.max(min, Math.min(a, b));
    const hi = Math.min(max, Math.max(a, b));
    return [lo, hi];
  }, [filterFunctions?.priceRange]);

  const [price, setPrice] = useState(initial);

  // sync ถ้า parent เปลี่ยนค่า
  useEffect(() => {
    setPrice(initial);
  }, [initial]);

  const handleOnChange = (value) => {
    const lo = clampNum(value?.[0], 0);
    const hi = clampNum(value?.[1], 0);
    setPrice([lo, hi]);
    filterFunctions?.handlepriceRange?.([lo, hi]);
  };

  return (
    <>
      <div className="range-wrapper">
        <Slider
          range
          max={max}
          min={min}
          value={price}
          onChange={handleOnChange}
          id="slider"
        />

        <div className="d-flex align-items-center">
          <span id="slider-range-value1">฿{fmt(price[0])}</span>
          <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
          <span id="slider-range-value2">฿{fmt(price[1])}</span>
        </div>
      </div>
    </>
  );
};

export default PriceRange;
