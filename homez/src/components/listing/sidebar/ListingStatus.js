"use client";

import React from "react";

const ListingStatus = ({ filterFunctions }) => {
  const options = [
    { id: "lx-status-all", label: "All", text: "ทั้งหมด" },
    { id: "lx-status-buy", label: "Buy", text: "ขาย" },
    { id: "lx-status-rent", label: "Rent", text: "เช่า" },
  ];

  const current = filterFunctions?.listingStatus ?? "All";

  return (
    <>
      {options.map((option) => (
        <div className="form-check d-flex align-items-center mb10" key={option.id}>
          <input
            id={option.id}
            className="form-check-input"
            type="radio"
            name="lx-listing-status"
            checked={String(current) === option.label}
            onChange={() => filterFunctions?.handlelistingStatus?.(option.label)}
          />
          <label className="form-check-label" htmlFor={option.id}>
            {option.text}
          </label>
        </div>
      ))}
    </>
  );
};

export default ListingStatus;
