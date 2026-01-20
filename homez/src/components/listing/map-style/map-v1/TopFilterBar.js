"use client";

import React, { useMemo } from "react";

export default function TopFilterBar({ colstyle, setColstyle, pageContentTrac }) {
  const meta = useMemo(() => {
    const a = Array.isArray(pageContentTrac) ? pageContentTrac : [];
    const start = Number(a[0] ?? 0);
    const endRaw = Number(a[1] ?? 0);
    const total = Number(a[2] ?? 0);

    const safeStart = Number.isFinite(start) ? start : 0;
    const safeEndRaw = Number.isFinite(endRaw) ? endRaw : 0;
    const safeTotal = Number.isFinite(total) ? total : 0;
    const end = safeTotal < safeEndRaw ? safeTotal : safeEndRaw;

    return { start: safeStart, end, total: safeTotal };
  }, [pageContentTrac]);

  const isList = !!colstyle;

  return (
    <>
      <div className="col-sm-6">
        <div className="text-center text-sm-start">
          <p className="pagination_page_count mb-0">
            Showing {meta.start}–{meta.end} of {meta.total} results
          </p>
        </div>
      </div>

      <div className="col-sm-6">
        <div className="page_control_shorting d-flex align-items-center justify-content-center justify-content-sm-end">
          <button
            type="button"
            className={`pl15 pr15 bdrl1 bdrr1 d-none d-md-block cursor ${
              !isList ? "menuActive" : ""
            }`}
            aria-pressed={!isList}
            onClick={() => setColstyle(false)} // Grid
          >
            Grid
          </button>

          <button
            type="button"
            className={`pl15 d-none d-md-block cursor ${isList ? "menuActive" : ""}`}
            aria-pressed={isList}
            onClick={() => setColstyle(true)} // List
          >
            List
          </button>
        </div>
      </div>
    </>
  );
}
