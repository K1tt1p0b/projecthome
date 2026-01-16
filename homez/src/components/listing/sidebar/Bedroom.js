"use client";

import React from "react";

const Bedroom = ({ filterFunctions }) => {
  const options = [
    { id: "bed-any", label: "any", value: 0 },
    { id: "bed-1", label: "1+", value: 1 },
    { id: "bed-2", label: "2+", value: 2 },
    { id: "bed-3", label: "3+", value: 3 },
    { id: "bed-4", label: "4+", value: 4 },
    { id: "bed-5", label: "5+", value: 5 },
  ];

  const current = Number(filterFunctions?.bedrooms ?? 0);

  return (
    <>
      {options.map((option) => (
        <div className="selection" key={option.id}>
          <input
            id={option.id}
            name="lx-bedrooms"
            type="radio"
            onChange={() => filterFunctions?.handlebedrooms?.(option.value)}
            checked={current === option.value}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default Bedroom;
