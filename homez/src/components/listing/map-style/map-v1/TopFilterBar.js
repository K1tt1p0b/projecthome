"use client";

import React, { useMemo } from "react";

export default function TopFilterBar({ colstyle, setColstyle, pageContentTrac }) {
  const meta = useMemo(() => {
    const a = Array.isArray(pageContentTrac) ? pageContentTrac : [];
    const start = Number(a[0] ?? 0);
    const endRaw = Number(a[1] ?? 0);
    const total = Number(a[2] ?? 0);
    const end = total < endRaw ? total : endRaw;
    return { start: start || 0, end: end || 0, total: total || 0 };
  }, [pageContentTrac]);

  return (
    <>
      <div className="col-7">
        <p className="pagination_page_count mb-0">
          Showing {meta.start}–{meta.end} of {meta.total} results
        </p>
      </div>

      <div className="col-5">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className={`ud-btn btn-light ${colstyle ? "active" : ""}`}
            onClick={() => setColstyle(true)}
          >
            List
          </button>

          <button
            type="button"
            className={`ud-btn btn-light ${!colstyle ? "active" : ""}`}
            onClick={() => setColstyle(false)}
          >
            Grid
          </button>
        </div>
      </div>
    </>
  );
}
