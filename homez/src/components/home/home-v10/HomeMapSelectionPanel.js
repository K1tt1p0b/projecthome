"use client";

import React, { useMemo } from "react";
import ListingPopupCard from "@/components/listing/map-style/ListingPopupCard";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function HomeMapSelectionPanel({ selection, onClose }) {
  const { title, items, prefer, anchorX, mapW } = selection || {};

  const showItems = useMemo(() => {
    const arr = Array.isArray(items) ? items : [];
    return arr.slice(0, 3); // ✅ 1–3 ใบกำลังดี
  }, [items]);

  if (!selection) return null;

  // ✅ ความกว้าง panel ใน css เป็น min(420px, 100%-24)
  // เลยคำนวณแบบ conservative เพื่อไม่ให้ล้นจอ
  const panelMaxW = Math.min(420, (mapW || 9999) - 24);
  const half = panelMaxW / 2;

  // ✅ วาง panel ให้กึ่งกลางอยู่ที่ anchorX แต่ clamp ไม่ให้ล้น
  const left = clamp(anchorX ?? (mapW || 0) / 2, 12 + half, (mapW || 0) - 12 - half);

  // ✅ ตำแหน่งลูกศรภายใน panel (0..panelW)
  const arrowX = clamp((anchorX ?? left) - (left - half), 22, panelMaxW - 22);

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
        <div className="lx-map-sheet-title">{title}</div>

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
        {showItems.map((it) => (
          <ListingPopupCard key={it.id} item={it} />
        ))}

        {Array.isArray(items) && items.length > 3 ? (
          <div className="lx-map-sheet-more">
            และอีก {items.length - 3} รายการ (เลื่อนดูได้)
          </div>
        ) : null}
      </div>
    </div>
  );
}
