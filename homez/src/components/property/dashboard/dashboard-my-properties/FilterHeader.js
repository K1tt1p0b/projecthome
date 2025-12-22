"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FilterHeader = () => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (isAdding) return; // กันกดซ้ำ
    setIsAdding(true);
    router.push("/dashboard-add-property");
  };

  return (
    <div className="dashboard_search_meta d-md-flex align-items-center justify-content-between gap-2">
      {/* Search */}
      <div className="item1 flex-grow-1 mb15-sm">
        <div className="search_area">
          <input
            type="text"
            className="form-control bdrs12"
            placeholder="ค้นหาชื่อประกาศ / จังหวัด / อำเภอ"
          />
          <label>
            <span className="flaticon-search" />
          </label>
        </div>
      </div>

      {/* Sort */}
      <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 bgc-white mb15-sm maxw200">
        <div className="pcs_dropdown d-flex align-items-center">
          <span className="title-color me-2" style={{ whiteSpace: "nowrap" }}>
            เรียงตาม:
          </span>
          <select className="form-select show-tick">
            <option value="latest">ล่าสุด</option>
            <option value="price_asc">ราคาต่ำ → สูง</option>
            <option value="price_desc">ราคาสูง → ต่ำ</option>
            <option value="views_desc">ยอดเข้าชมสูงสุด</option>
            <option value="status">สถานะประกาศ</option>
          </select>
        </div>
      </div>

      {/* Add Property (with loading) */}
      <button
        type="button"
        className="ud-btn btn-thm"
        onClick={handleAdd}
        disabled={isAdding}
        aria-busy={isAdding}
      >
        {isAdding ? (
          <>
            กำลังไปหน้าเพิ่มประกาศ...
            <i className="fal fa-spinner fa-spin ms-2" />
          </>
        ) : (
          <>
            เพิ่มประกาศใหม่
          </>
        )}
      </button>
    </div>
  );
};

export default FilterHeader;
