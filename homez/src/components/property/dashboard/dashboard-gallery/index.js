"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const CATEGORIES = ["รูปทั่วไป", "บ้านและที่ดิน", "ที่ดิน", "คอนโด", "ห้องเช่า"];
const PAGE_SIZE = 16; // 4x4

const DEFAULT_FILTER = "ทั้งหมด";
const DEFAULT_SORT = "desc";

export default function DashboardGalleryContent() {
  const inputRef = useRef(null);

  const [items, setItems] = useState([
    {
      id: "img_1",
      url: "/images/listings/list-1.jpg",
      name: "front.jpg",
      category: "บ้านและที่ดิน",
      createdAt: new Date("2026-01-05T10:00"),
    },
    {
      id: "img_2",
      url: "/images/listings/list-2.jpg",
      name: "room.jpg",
      category: "ห้องเช่า",
      createdAt: new Date("2026-01-05T09:00"),
    },
    {
      id: "img_3",
      url: "/images/listings/list-3.jpg",
      name: "land.jpg",
      category: "รูปทั่วไป",
      createdAt: new Date("2026-01-04T18:00"),
    },
  ]);

  // filter/sort/page
  const [filterCat, setFilterCat] = useState(DEFAULT_FILTER);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  // selection mode
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // loading
  const [uploading, setUploading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // edit category (เฉพาะโหมดปกติ)
  const [editingId, setEditingId] = useState(null);

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

  const selectThisPage = (pageItems) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pageItems.forEach((x) => next.add(x.id));
      return next;
    });
  };

  // ===== Data: filter + sort =====
  const filteredSorted = useMemo(() => {
    let arr = [...items];

    if (filterCat !== DEFAULT_FILTER) {
      arr = arr.filter((x) => (x.category || "รูปทั่วไป") === filterCat);
    }

    arr.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? tb - ta : ta - tb;
    });

    return arr;
  }, [items, filterCat, sortOrder]);

  // ===== Pagination =====
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE)),
    [filteredSorted.length]
  );

  const pageSafe = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, pageSafe]);

  const pageNumbers = useMemo(() => {
    const nums = [];
    const push = (n) => nums.push(n);

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
      return nums;
    }

    push(1);
    const left = Math.max(2, pageSafe - 1);
    const right = Math.min(totalPages - 1, pageSafe + 1);

    if (left > 2) nums.push("...");
    for (let i = left; i <= right; i++) push(i);
    if (right < totalPages - 1) nums.push("...");
    push(totalPages);

    return nums;
  }, [pageSafe, totalPages]);

  // ===== Actions =====
  const openPicker = () => inputRef.current?.click();

  const handlePickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    try {
      setUploading(true);
      await wait(450);

      const newItems = files.map((file) => ({
        id: `img_${Date.now()}_${Math.random()}`,
        url: URL.createObjectURL(file),
        name: file.name,
        category: "รูปทั่วไป", // เพิ่มจาก gallery = รูปทั่วไป
        createdAt: new Date(),
      }));

      setItems((prev) => [...prev, ...newItems]);
      toast.success("เพิ่มรูปเรียบร้อย (เข้าหมวดรูปทั่วไป)");
      setPage(1);
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
      toast.success("ลบแล้ว");
    } catch {
      toast.error("ลบไม่สำเร็จ");
    }
  };

  const changeSingleCategory = (id, nextCat) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, category: nextCat } : x)));
    toast.success("เปลี่ยนหมวดแล้ว");
    setEditingId(null);
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

  const bulkChangeCategory = async (nextCat) => {
    if (!nextCat) return;
    if (selectedCount === 0) {
      toast.info("ยังไม่ได้เลือกรูป");
      return;
    }

    try {
      setBulkLoading(true);
      await wait(450);

      setItems((prev) =>
        prev.map((x) => (selectedIds.has(x.id) ? { ...x, category: nextCat } : x))
      );

      toast.success(`ย้าย ${selectedCount} รูป ไปหมวด “${nextCat}” แล้ว`);
      clearSelection();
    } catch {
      toast.error("ย้ายหมวดไม่สำเร็จ");
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleSelectMode = () => {
    setSelectMode((p) => {
      const next = !p;
      if (!next) clearSelection();
      // เข้าโหมดเลือกให้ปิดแก้ไขหมวดที่ค้างอยู่
      if (next) setEditingId(null);
      return next;
    });
  };

  const onChangeFilter = (v) => {
    setFilterCat(v);
    setPage(1);
    clearSelection();
    setEditingId(null);
  };

  const clearFilter = () => {
    setFilterCat(DEFAULT_FILTER);
    setSortOrder(DEFAULT_SORT);
    setPage(1);

    clearSelection();
    setSelectMode(false);
    setEditingId(null);

    toast.info("ล้างตัวกรองแล้ว");
  };

  const isFiltered = filterCat !== DEFAULT_FILTER || sortOrder !== DEFAULT_SORT;

  return (
    <div className="px-3 pb-4">
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0">แกลเลอรีรูปภาพ</h6>
          <div className="text-muted fz13">
            ทั้งหมด {filteredSorted.length} รูป • หน้า {pageSafe}/{totalPages}
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

          <button className="ud-btn btn-thm btn-sm" onClick={openPicker} disabled={uploading || selectMode}>
            {uploading ? "กำลังเพิ่ม..." : "เพิ่มรูป"}
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
          style={{ maxWidth: 240 }}
          value={filterCat}
          onChange={(e) => onChangeFilter(e.target.value)}
          disabled={bulkLoading}
        >
          <option value={DEFAULT_FILTER}>ทั้งหมด</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="form-select form-select-sm"
          style={{ width: 160 }}
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
            clearSelection();
            setEditingId(null);
          }}
          disabled={bulkLoading}
        >
          <option value="desc">ล่าสุดก่อน</option>
          <option value="asc">เก่าสุดก่อน</option>
        </select>

        {/* ปุ่มล้างตัวกรอง */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={clearFilter}
            disabled={bulkLoading}
          >
            ล้างตัวกรอง
          </button>
        )}

        {/* Bulk actions (โชว์เฉพาะโหมดเลือก) */}
        {selectMode && (
          <div className="d-flex flex-wrap gap-2 ms-auto align-items-center">
            <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => selectThisPage(pageItems)}
              disabled={pageItems.length === 0 || bulkLoading}
            >
              เลือกทั้งหน้า
            </button>

            <select
              className="form-select form-select-sm"
              style={{ width: 210 }}
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value;
                e.target.value = "";
                bulkChangeCategory(val);
              }}
              disabled={selectedCount === 0 || bulkLoading}
              title={selectedCount === 0 ? "เลือกอย่างน้อย 1 รูปก่อน" : ""}
            >
              <option value="">เปลี่ยนหมวดที่เลือก…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

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

      {/* grid 4x4 */}
      {pageItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="fz16 fw600 mb-2">ยังไม่มีรูป</div>
          <div className="text-muted fz14">กด “เพิ่มรูป” เพื่อเริ่มต้น</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {pageItems.map((img) => (
            <div
              key={img.id}
              className="border bdrs12 overflow-hidden position-relative"
              style={{
                borderColor: "rgba(0,0,0,0.08)",
                background: "#f7f7f7",
                outline: selectMode && isSelected(img.id) ? "3px solid rgba(13,110,253,0.6)" : "none",
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
                <Image src={img.url} alt={img.name} fill style={{ objectFit: "cover" }} />
              </div>

              {/* badge category */}
              <div
                className="position-absolute"
                style={{
                  left: 8,
                  top: 8,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 10,
                  maxWidth: "70%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={img.category || "รูปทั่วไป"}
              >
                {img.category || "รูปทั่วไป"}
              </div>

              {/* โหมดเลือก: checkbox อย่างเดียว + ซ่อนปุ่มแก้ไขหมวด/ลบรายรูป */}
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
                // โหมดปกติ: ปุ่มแก้ไขหมวด + ลบรายรูป
                <div className="position-absolute d-flex gap-2" style={{ right: 8, top: 8 }}>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    style={{ borderRadius: 10 }}
                    onClick={() => setEditingId(img.id)}
                  >
                    แก้ไขหมวด
                  </button>

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

              {/* inline editor (เฉพาะโหมดปกติ) */}
              {!selectMode && editingId === img.id && (
                <div
                  className="position-absolute"
                  style={{
                    left: 8,
                    right: 8,
                    bottom: 8,
                    background: "#fff",
                    borderRadius: 12,
                    padding: 10,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw600 fz14">เลือกหมวด</div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      ปิด
                    </button>
                  </div>

                  <select
                    className="form-select form-select-sm"
                    defaultValue={img.category || "รูปทั่วไป"}
                    onChange={(e) => changeSingleCategory(img.id, e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
          <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe === 1 || bulkLoading}
          >
            ก่อนหน้า
          </button>

          {pageNumbers.map((n, idx) =>
            n === "..." ? (
              <span key={`dots_${idx}`} className="px-2 text-muted">
                ...
              </span>
            ) : (
              <button
                key={n}
                className={`btn btn-sm ${pageSafe === n ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setPage(n)}
                disabled={bulkLoading}
              >
                {n}
              </button>
            )
          )}

          <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageSafe === totalPages || bulkLoading}
          >
            ถัดไป
          </button>
        </div>
      )}

      {/* responsive: มือถือ 2 คอลัมน์ */}
      <style jsx>{`
        @media (max-width: 991px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
