"use client";

import React from "react";

const Bathroom = ({ filterFunctions }) => {
  const options = [
    { id: "bath-any", label: "any", value: 0 },
    { id: "bath-1", label: "1+", value: 1 },
    { id: "bath-2", label: "2+", value: 2 },
    { id: "bath-3", label: "3+", value: 3 },
    { id: "bath-4", label: "4+", value: 4 },
    { id: "bath-5", label: "5+", value: 5 },
  ];

  // เดิมใน template ใช้ชื่อ bathroms (พิมพ์ผิด) — ก็รองรับต่อ
  const current = Number(filterFunctions?.bathroms ?? 0);

  return (
    <>
      {options.map((option) => (
        <div className="selection" key={option.id}>
          <input
            id={option.id}
            name="lx-bathrooms"
            type="radio"
            checked={current === option.value}
            onChange={() => filterFunctions?.handlebathroms?.(option.value)}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default Bathroom;
