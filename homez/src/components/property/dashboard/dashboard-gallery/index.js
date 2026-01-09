"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const MAX_ITEMS = 20;
const DEFAULT_SORT = "desc";

export default function DashboardGalleryContent() {
  const inputRef = useRef(null);

  const [items, setItems] = useState([
    {
      id: "img_1",
      url: "/images/listings/list-1.jpg",
      name: "front.jpg",
      createdAt: new Date("2026-01-05T10:00"),
    },
    {
      id: "img_2",
      url: "/images/listings/list-2.jpg",
      name: "room.jpg",
      createdAt: new Date("2026-01-05T09:00"),
    },
    {
      id: "img_3",
      url: "/images/listings/list-3.jpg",
      name: "land.jpg",
      createdAt: new Date("2026-01-04T18:00"),
    },
  ]);

  // sort
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);

  // selection mode
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // loading
  const [uploading, setUploading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // ===== Helpers =====
  const clearSelection = () => setSelectedIds(new Set());
  const selectedCount = selectedIds.size;
  const isSelected = (id) => selectedIds.has(id);

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllShown = (shownItems) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      shownItems.forEach((x) => next.add(x.id));
      return next;
    });
  };

  // ===== Data: sort + cap 20 =====
  const shownItems = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? tb - ta : ta - tb;
    });
    return arr.slice(0, MAX_ITEMS); // ✅ แสดงแค่ 20 รูปในหน้าเดียว
  }, [items, sortOrder]);

  const remainingSlots = Math.max(0, MAX_ITEMS - items.length);

  // ===== Actions =====
  const openPicker = () => {
    if (items.length >= MAX_ITEMS) {
      toast.info(`เพิ่มไม่ได้แล้ว (ได้สูงสุด ${MAX_ITEMS} รูป)`);
      return;
    }
    inputRef.current?.click();
  };

  const handlePickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    // ✅ บังคับไม่เกิน 20
    const slots = MAX_ITEMS - items.length;
    if (slots <= 0) {
      toast.info(`เพิ่มไม่ได้แล้ว (ได้สูงสุด ${MAX_ITEMS} รูป)`);
      return;
    }

    const accepted = files.slice(0, slots);
    const rejectedCount = files.length - accepted.length;

    try {
      setUploading(true);
      await wait(450);

      const newItems = accepted.map((file) => ({
        id: `img_${Date.now()}_${Math.random()}`,
        url: URL.createObjectURL(file),
        name: file.name,
        createdAt: new Date(),
      }));

      setItems((prev) => [...prev, ...newItems]);

      if (rejectedCount > 0) {
        toast.info(`เพิ่มได้ ${accepted.length} รูป (เต็ม ${MAX_ITEMS} แล้ว อีก ${rejectedCount} รูปไม่ได้เพิ่ม)`);
      } else {
        toast.success("เพิ่มรูปเรียบร้อย");
      }
    } catch {
      toast.error("เพิ่มรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  const deleteSingle = async (id) => {
    try {
      await wait(250);
      setItems((prev) => prev.filter((x) => x.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("ลบแล้ว");
    } catch {
      toast.error("ลบไม่สำเร็จ");
    }
  };

  const bulkDelete = async () => {
    if (selectedCount === 0) return;
    const ok = confirm(`ต้องการลบรูปที่เลือก ${selectedCount} รูป ใช่ไหม?`);
    if (!ok) return;

    try {
      setBulkLoading(true);
      await wait(500);

      setItems((prev) => prev.filter((x) => !selectedIds.has(x.id)));
      clearSelection();
      toast.success("ลบรูปที่เลือกแล้ว");
    } catch {
      toast.error("ลบไม่สำเร็จ");
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleSelectMode = () => {
    setSelectMode((p) => {
      const next = !p;
      if (!next) clearSelection();
      return next;
    });
  };

  const clearSort = () => {
    setSortOrder(DEFAULT_SORT);
    clearSelection();
    setSelectMode(false);
    toast.info("ล้างตัวกรองแล้ว");
  };

  const isSorted = sortOrder !== DEFAULT_SORT;

  return (
    <div className="px-3 pb-4">
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0">แกลเลอรีรูปภาพ</h6>
          <div className="text-muted fz13">
            แสดง {shownItems.length} / {MAX_ITEMS} รูป (ทั้งหมดในระบบ {items.length} รูป)
            {selectMode && (
              <>
                {" "}
                • เลือกแล้ว <span className="fw600">{selectedCount}</span> รูป
              </>
            )}
          </div>
        </div>

        <div className="d-flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handlePickFiles}
          />

          <button
            className="ud-btn btn-thm btn-sm"
            onClick={openPicker}
            disabled={uploading || selectMode || items.length >= MAX_ITEMS}
            title={items.length >= MAX_ITEMS ? `ได้สูงสุด ${MAX_ITEMS} รูป` : ""}
          >
            {uploading ? "กำลังเพิ่ม..." : `เพิ่มรูป${items.length >= MAX_ITEMS ? " (เต็ม)" : ""}`}
          </button>

          <button
            className={`btn btn-sm ${selectMode ? "btn-dark" : "btn-outline-dark"}`}
            onClick={toggleSelectMode}
            disabled={bulkLoading}
          >
            {selectMode ? "ออกจากโหมดเลือก" : "เลือกรูป"}
          </button>
        </div>
      </div>

      {/* toolbar */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <select
          className="form-select form-select-sm"
          style={{ width: 160 }}
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            clearSelection();
          }}
          disabled={bulkLoading}
        >
          <option value="desc">ล่าสุดก่อน</option>
          <option value="asc">เก่าสุดก่อน</option>
        </select>

        {isSorted && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={clearSort}
            disabled={bulkLoading}
          >
            ล้างตัวกรอง
          </button>
        )}

        {/* Bulk actions */}
        {selectMode && (
          <div className="d-flex flex-wrap gap-2 ms-auto align-items-center">
            <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => selectAllShown(shownItems)}
              disabled={shownItems.length === 0 || bulkLoading}
            >
              เลือกทั้งหมด
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={bulkDelete}
              disabled={selectedCount === 0 || bulkLoading}
            >
              {bulkLoading ? "กำลังทำ..." : `ลบที่เลือก (${selectedCount})`}
            </button>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={clearSelection}
              disabled={selectedCount === 0 || bulkLoading}
            >
              ล้างที่เลือก
            </button>
          </div>
        )}
      </div>

      {/* hint remaining */}
      <div className="text-muted fz13 mb-2">
        เพิ่มได้อีก <span className="fw600">{remainingSlots}</span> รูป
      </div>

      {/* grid (หน้าเดียว สูงสุด 20) */}
      {shownItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="fz16 fw600 mb-2">ยังไม่มีรูป</div>
          <div className="text-muted fz14">กด “เพิ่มรูป” เพื่อเริ่มต้น</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))", // ✅ 5x4 = 20
            gap: 12,
          }}
        >
          {shownItems.map((img) => (
            <div
              key={img.id}
              className="border bdrs12 overflow-hidden position-relative"
              style={{
                borderColor: "rgba(0,0,0,0.08)",
                background: "#f7f7f7",
                outline:
                  selectMode && isSelected(img.id)
                    ? "3px solid rgba(13,110,253,0.6)"
                    : "none",
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
                <Image src={img.url} alt={img.name} fill style={{ objectFit: "cover" }} />
              </div>

              {selectMode ? (
                <label
                  className="position-absolute"
                  style={{
                    left: 8,
                    bottom: 8,
                    background: "rgba(255,255,255,0.92)",
                    borderRadius: 10,
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected(img.id)}
                    onChange={() => toggleOne(img.id)}
                  />
                  <span className="fz12">เลือก</span>
                </label>
              ) : (
                <div className="position-absolute d-flex gap-2" style={{ right: 8, top: 8 }}>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ borderRadius: 10 }}
                    onClick={() => deleteSingle(img.id)}
                  >
                    ลบ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* responsive: มือถือ 2 คอลัมน์ */}
      <style jsx>{`
        @media (max-width: 991px) {
          div[style*="grid-template-columns: repeat(5"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
