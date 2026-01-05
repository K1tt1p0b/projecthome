"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const CATEGORIES = ["ทั่วไป", "บ้านและที่ดิน", "ที่ดิน", "คอนโด", "ห้องเช่า"];
const PAGE_SIZE = 16;

const DEFAULT_FILTER = "ทั้งหมด";
const DEFAULT_SORT = "desc";

const isYouTubeUrl = (url) => /youtube\.com|youtu\.be/i.test(url);
const isTikTokUrl = (url) => /tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/i.test(url);

/** fetch JSON แบบปลอดภัย */
async function safeJsonFetch(path) {
  const res = await fetch(path);
  const ct = res.headers.get("content-type") || "";

  // ไม่ใช่ JSON
  if (!ct.includes("application/json")) {
    const t = await res.text().catch(() => "");
    return { ok: false, error: "NON_JSON", status: res.status, sample: t.slice(0, 200) };
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    return { ok: false, error: json?.error || "FETCH_FAIL", status: res.status, detail: json };
  }

  return { ok: true, data: json };
}

/** resolve tiktok ทุกลิงก์ให้เป็น finalUrl + postId */
async function resolveTikTok(url) {
  const out = await safeJsonFetch(`/api/tiktok/resolve?url=${encodeURIComponent(url)}`);
  if (!out.ok) return { ok: false, ...out };
  return { ok: true, finalUrl: out.data.finalUrl || url, postId: out.data.postId || null };
}

async function fetchPreview(url) {
  if (isYouTubeUrl(url)) {
    const out = await safeJsonFetch(`/api/video/oembed?url=${encodeURIComponent(url)}`);
    if (!out.ok) return { __error: out };
    return { ...out.data, providerName: out.data.providerName || "YouTube" };
  }

  if (isTikTokUrl(url)) {
    const out = await safeJsonFetch(`/api/tiktok/oembed?url=${encodeURIComponent(url)}`);
    if (!out.ok) return { __error: out };
    return { ...out.data, providerName: out.data.providerName || "TikTok" };
  }

  return null;
}

// ===== YouTube helpers =====
function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");

    const v = u.searchParams.get("v");
    if (v) return v;

    const m = u.pathname.match(/\/shorts\/([^/]+)/);
    if (m?.[1]) return m[1];

    const e = u.pathname.match(/\/embed\/([^/]+)/);
    if (e?.[1]) return e[1];

    return null;
  } catch {
    return null;
  }
}

function toYouTubeEmbed(url) {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&rel=0`;
}

// ===== TikTok helpers =====
function toTikTokPlayerUrlById(postId) {
  if (!postId) return null;
  return `https://www.tiktok.com/player/v1/${postId}`;
}

function formatProvider(providerName) {
  return providerName || "";
}

export default function DashboardVideoGalleryContent() {
  const [items, setItems] = useState([
    {
      id: "vid_yt_1",
      type: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=dAiE1x_opbM",
      category: "ทั่วไป",
      createdAt: new Date("2026-01-05T10:00:00"),
      preview: {
        title: "วิดีโอ 360 องศา บ้าน 150 ล้าน",
        authorName: "วิดีโอ 360 องศา บ้าน 150 ล้าน",
        thumbnailUrl: "https://i.ytimg.com/vi/dAiE1x_opbM/hqdefault.jpg",
        providerName: "YouTube",
      },
    },
  ]);

  const [filterCat, setFilterCat] = useState(DEFAULT_FILTER);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const [adding, setAdding] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  // popup player
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // เก็บ item ที่กำลังเล่น
  const [popupSrc, setPopupSrc] = useState(null);

  const closePlayer = () => {
    setPlayerOpen(false);
    setPopupSrc(null);
    setTimeout(() => setActiveItem(null), 50);
  };

  useEffect(() => {
    if (!playerOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closePlayer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerOpen]);

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
      arr = arr.filter((x) => (x.category || "ทั่วไป") === filterCat);
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
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, category: nextCat } : x))
    );
    toast.success("เปลี่ยนหมวดแล้ว");
    setEditingId(null);
  };

  const bulkDelete = async () => {
    if (selectedCount === 0) return;
    const ok = confirm(`ต้องการลบวิดีโอที่เลือก ${selectedCount} รายการ ใช่ไหม?`);
    if (!ok) return;

    try {
      setBulkLoading(true);
      await wait(500);

      setItems((prev) => prev.filter((x) => !selectedIds.has(x.id)));
      clearSelection();
      toast.success("ลบวิดีโอที่เลือกแล้ว");
    } catch {
      toast.error("ลบไม่สำเร็จ");
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkChangeCategory = async (nextCat) => {
    if (!nextCat) return;
    if (selectedCount === 0) {
      toast.info("ยังไม่ได้เลือกวิดีโอ");
      return;
    }

    try {
      setBulkLoading(true);
      await wait(450);

      setItems((prev) =>
        prev.map((x) => (selectedIds.has(x.id) ? { ...x, category: nextCat } : x))
      );

      toast.success(`ย้าย ${selectedCount} รายการ ไปหมวด “${nextCat}” แล้ว`);
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

  const openAdd = () => {
    setNewUrl("");
    setShowAdd(true);
  };

  const closeAdd = () => {
    if (adding) return;
    setShowAdd(false);
    setNewUrl("");
  };

  /** เปิด popup (ถ้าเป็น tiktok จะ resolve ให้เล่นได้ทุกลิงก์) */
  const openPlayer = async (item) => {
    try {
      setActiveItem(item);
      setPlayerOpen(true);
      setPopupSrc(null);

      // YouTube
      if (item.type === "youtube" || isYouTubeUrl(item.videoUrl)) {
        const src = toYouTubeEmbed(item.videoUrl);
        setPopupSrc(src);
        return;
      }

      // TikTok
      if (item.type === "tiktok" || isTikTokUrl(item.videoUrl)) {
        // ถ้ามี postId อยู่แล้ว
        if (item.tiktokPostId) {
          setPopupSrc(toTikTokPlayerUrlById(item.tiktokPostId));
          return;
        }

        // ไม่มี postId: resolve ตอนเปิด
        const r = await resolveTikTok(item.videoUrl);
        if (!r.ok || !r.postId) {
          console.log("resolve tiktok failed:", r);
          toast.error("เล่น TikTok ไม่ได้ (อาจติด anti-bot หรือหา video id ไม่เจอ)");
          return;
        }

        // อัปเดต item ใน state ให้ครั้งต่อไปไม่ต้อง resolve ซ้ำ
        setItems((prev) =>
          prev.map((x) =>
            x.id === item.id
              ? {
                  ...x,
                  videoUrl: r.finalUrl || x.videoUrl,
                  tiktokPostId: r.postId,
                  type: "tiktok",
                }
              : x
          )
        );

        setPopupSrc(toTikTokPlayerUrlById(r.postId));
      }
    } catch (e) {
      console.log(e);
      toast.error("เปิดวิดีโอไม่สำเร็จ");
    }
  };

  /** เพิ่มวิดีโอ (TikTok จะ resolve ก่อนเสมอ เพื่อให้ได้ /video/{id}) */
  const addVideo = async () => {
    const rawUrl = newUrl.trim();
    if (!rawUrl) return toast.info("กรุณาวางลิงก์วิดีโอ");

    if (!isYouTubeUrl(rawUrl) && !isTikTokUrl(rawUrl)) {
      return toast.error("รองรับเฉพาะ YouTube / TikTok ตอนนี้");
    }

    try {
      setAdding(true);

      let finalUrl = rawUrl;
      let type = isYouTubeUrl(rawUrl) ? "youtube" : "tiktok";
      let tiktokPostId = null;

      // TikTok: resolve ให้ได้ finalUrl+postId ก่อน
      if (type === "tiktok") {
        const r = await resolveTikTok(rawUrl);
        if (!r.ok) {
          console.log("resolve error:", r);
          toast.error("เพิ่ม TikTok ไม่สำเร็จ (resolve ลิงก์ไม่ได้)");
          return;
        }
        finalUrl = r.finalUrl || rawUrl;
        tiktokPostId = r.postId || null;
      }

      // ดึง preview จาก oEmbed (ใช้ finalUrl)
      const preview = await fetchPreview(finalUrl);

      if (!preview) {
        toast.error("ดึงข้อมูลวิดีโอไม่สำเร็จ (ลองใหม่อีกครั้ง)");
        return;
      }

      if (preview.__error) {
        console.log("preview error:", preview.__error);
        toast.error(
          preview.__error.error === "NON_JSON"
            ? "ผู้ให้บริการตอบกลับไม่ใช่ JSON (อาจติด anti-bot)"
            : "ดึงข้อมูลพรีวิวไม่สำเร็จ"
        );
        return;
      }

      await wait(200);

      setItems((prev) => [
        {
          id: `vid_${Date.now()}_${Math.random()}`,
          type,
          videoUrl: finalUrl,
          tiktokPostId,
          category: "ทั่วไป",
          createdAt: new Date(),
          preview,
        },
        ...prev,
      ]);

      toast.success("เพิ่มวิดีโอเรียบร้อย (เข้าหมวดทั่วไป)");
      setPage(1);
      setShowAdd(false);
      setNewUrl("");
    } catch (e) {
      console.log(e);
      toast.error("เพิ่มวิดีโอไม่สำเร็จ");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="px-3 pb-4">
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0">แกลเลอรีวิดีโอ</h6>
          <div className="text-muted fz13">
            ทั้งหมด {filteredSorted.length} รายการ • หน้า {pageSafe}/{totalPages}
            {selectMode && (
              <>
                {" "}
                • เลือกแล้ว <span className="fw600">{selectedCount}</span> รายการ
              </>
            )}
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="ud-btn btn-thm btn-sm"
            onClick={openAdd}
            disabled={adding || selectMode}
          >
            {adding ? "กำลังเพิ่ม..." : "เพิ่มวิดีโอ"}
          </button>

          <button
            className={`btn btn-sm ${selectMode ? "btn-dark" : "btn-outline-dark"}`}
            onClick={toggleSelectMode}
            disabled={bulkLoading || adding}
          >
            {selectMode ? "ออกจากโหมดเลือก" : "เลือกวิดีโอ"}
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
          disabled={bulkLoading || adding}
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
          disabled={bulkLoading || adding}
        >
          <option value="desc">ล่าสุดก่อน</option>
          <option value="asc">เก่าสุดก่อน</option>
        </select>

        {isFiltered && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={clearFilter}
            disabled={bulkLoading || adding}
          >
            ล้างตัวกรอง
          </button>
        )}

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
              title={selectedCount === 0 ? "เลือกอย่างน้อย 1 รายการก่อน" : ""}
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

      {/* grid */}
      {pageItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="fz16 fw600 mb-2">ยังไม่มีวิดีโอ</div>
          <div className="text-muted fz14">กด “เพิ่มวิดีโอ” เพื่อเริ่มต้น</div>
        </div>
      ) : (
        <div
          className="video-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {pageItems.map((v) => {
            const title = v.preview?.title || "วิดีโอ";
            const author = v.preview?.authorName || "";
            const thumb = v.preview?.thumbnailUrl || "";
            const provider = formatProvider(v.preview?.providerName);

            return (
              <div
                key={v.id}
                className="border bdrs12 overflow-hidden position-relative"
                style={{
                  borderColor: "rgba(0,0,0,0.08)",
                  background: "#fff",
                  outline:
                    selectMode && isSelected(v.id)
                      ? "3px solid rgba(13,110,253,0.6)"
                      : "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => openPlayer(v)}
                  className="d-block w-100 border-0 p-0"
                  style={{ background: "transparent" }}
                  disabled={selectMode}
                  title={selectMode ? "อยู่ในโหมดเลือก" : "เล่นวิดีโอ"}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                    {thumb ? (
                      <Image src={thumb} alt={title} fill style={{ objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#f3f3f3" }} />
                    )}

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 999,
                          background: "rgba(0,0,0,0.55)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <span style={{ color: "#fff", fontSize: 20, marginLeft: 2 }}>▶</span>
                      </div>
                    </div>
                  </div>
                </button>

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
                  title={v.category || "ทั่วไป"}
                >
                  {v.category || "ทั่วไป"}
                </div>

                <div style={{ padding: 12 }}>
                  <div
                    className="fw600"
                    style={{
                      color: "#0b0b0b",
                      lineHeight: 1.25,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 38,
                    }}
                    title={title}
                  >
                    {title}
                  </div>

                  {(author || provider) && (
                    <div className="text-muted fz13" style={{ marginTop: 6 }}>
                      {author}
                      {author && provider ? " • " : ""}
                      {provider}
                    </div>
                  )}
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
                      checked={isSelected(v.id)}
                      onChange={() => toggleOne(v.id)}
                    />
                    <span className="fz12">เลือก</span>
                  </label>
                ) : (
                  <div className="position-absolute d-flex gap-2" style={{ right: 8, top: 8 }}>
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      style={{ borderRadius: 10 }}
                      onClick={() => setEditingId(v.id)}
                    >
                      แก้ไขหมวด
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ borderRadius: 10 }}
                      onClick={() => deleteSingle(v.id)}
                    >
                      ลบ
                    </button>
                  </div>
                )}

                {!selectMode && editingId === v.id && (
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
                      defaultValue={v.category || "ทั่วไป"}
                      onChange={(e) => changeSingleCategory(v.id, e.target.value)}
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
            );
          })}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
          <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe === 1 || bulkLoading || adding}
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
                disabled={bulkLoading || adding}
              >
                {n}
              </button>
            )
          )}

          <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageSafe === totalPages || bulkLoading || adding}
          >
            ถัดไป
          </button>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.35)", zIndex: 9999 }}
          onMouseDown={closeAdd}
        >
          <div
            className="bg-white bdrs12 default-box-shadow2 p-3"
            style={{
              width: "min(560px, 92vw)",
              margin: "12vh auto 0",
              position: "relative",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw600">เพิ่มวิดีโอจากลิงก์</div>
              <button className="btn btn-sm btn-outline-secondary" onClick={closeAdd} disabled={adding}>
                ปิด
              </button>
            </div>

            <div className="text-muted fz13 mb-2">
              รองรับลิงก์ YouTube / TikTok (จะดึงรูปปก/ชื่อคลิป/ชื่อช่องมาให้)
            </div>

            <input
              className="form-control"
              placeholder="วางลิงก์ YouTube/TikTok"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              disabled={adding}
            />

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-dark" onClick={closeAdd} disabled={adding}>
                ยกเลิก
              </button>
              <button className="ud-btn btn-thm" onClick={addVideo} disabled={adding}>
                {adding ? "กำลังเพิ่ม..." : "เพิ่มวิดีโอ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup player */}
      {playerOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.65)", zIndex: 10000 }}
          onMouseDown={closePlayer}
        >
          <div
            className="position-relative"
            style={{
              width: "min(1100px, 94vw)",
              margin: "8vh auto 0",
              borderRadius: 16,
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePlayer}
              className="btn btn-light btn-sm position-absolute"
              style={{ right: 12, top: 12, borderRadius: 999, zIndex: 2 }}
              aria-label="Close"
            >
              ✕
            </button>

            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
              {!popupSrc ? (
                <div
                  style={{
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    height: "100%",
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  กำลังเตรียมวิดีโอ...
                </div>
              ) : (
                <iframe
                  src={popupSrc}
                  title="Video player"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* responsive */}
      <style jsx>{`
        @media (max-width: 991px) {
          .video-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
