"use client";

import React, { useMemo } from "react";
import ListingPopupCard from "@/components/listing/map-style/ListingPopupCard";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function HomeMapSelectionPanel({ selection, onClose }) {
  const { title, items, prefer, anchorX, mapW } = selection || {};

  const safeItems = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items]
  );

  // ✅ ไม่จำกัดจำนวน: โชว์ทั้งหมด (ให้ไปคุมความสูง/scroll ที่ CSS แทน)
  const showItems = safeItems;

  if (!selection) return null;

  // panel width ตาม css: min(420px, 100%-24)
  const panelMaxW = Math.min(420, (mapW || 9999) - 24);
  const half = panelMaxW / 2;

  // วาง panel ให้อยู่กึ่งกลาง anchorX แต่ไม่ล้นจอ
  const left = clamp(
    anchorX ?? (mapW || 0) / 2,
    12 + half,
    (mapW || 0) - 12 - half
  );

  // ตำแหน่งลูกศร
  const arrowX = clamp(
    (anchorX ?? left) - (left - half),
    22,
    panelMaxW - 22
  );

  return (
    <div
      className={`lx-map-sheet ${prefer === "top" ? "is-top" : "is-bottom"}`}
      style={{
        left: `${left}px`,
        ["--lx-arrow-x"]: `${arrowX}px`,
      }}
      role="dialog"
      aria-label="รายการทรัพย์สิน"
    >
      <div className="lx-map-sheet-head">
        <div className="lx-map-sheet-title">
          {title}
          {/* (ออปชัน) ถ้าอยากให้เห็นจำนวนด้วย */}
          {safeItems.length ? (
            <span style={{ opacity: 0.7, marginLeft: 8 }}>
              ({safeItems.length})
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="lx-map-sheet-close"
          onClick={onClose}
          aria-label="ปิด"
          title="ปิด"
        >
          ✕
        </button>
      </div>

      <div className="lx-map-sheet-body">
        {showItems.length ? (
          showItems.map((it) => <ListingPopupCard key={it.id} item={it} />)
        ) : (
          <div className="lx-map-sheet-empty">ไม่พบรายการ</div>
        )}
      </div>
    </div>
  );
}
