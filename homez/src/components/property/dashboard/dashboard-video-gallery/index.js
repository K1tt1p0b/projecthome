"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { propertyData } from "@/data/propertyData";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGE_SIZE = 16;
const DEFAULT_SORT = "desc";

// ✅ key เดียวกับหน้า my-properties popup
const VIDEO_STORE_KEY = "landx_property_videos_v1";

// ✅ 1 ประกาศได้สูงสุด 4 วิดีโอ
const MAX_VIDEOS_PER_PROPERTY = 4;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function readVideoStore() {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(VIDEO_STORE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return parsed && typeof parsed === "object" ? parsed : {};
}

function writeVideoStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VIDEO_STORE_KEY, JSON.stringify(store ?? {}));
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const isYouTubeUrl = (url) => /youtube\.com|youtu\.be/i.test(url);
const isTikTokUrl = (url) => /tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/i.test(url);

function detectProvider(url) {
  if (isTikTokUrl(url)) return "tiktok";
  return "youtube";
}

// ✅ Shorts check (ไว้ใช้ปรับ UI popup ให้เป็น 9:16)
function isYouTubeShorts(url) {
  try {
    const u = new URL(url);
    return u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/");
  } catch {
    return false;
  }
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

function youtubeThumb(url) {
  const id = extractYouTubeId(url);
  if (!id) return "";
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// ===== TikTok helpers (Front-only) =====
function toTikTokEmbedFallback(url) {
  return `https://www.tiktok.com/embed/v2?url=${encodeURIComponent(url)}`;
}

function extractTikTokVideoId(url) {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/video\/(\d+)/);
    if (m?.[1]) return m[1];
    return null;
  } catch {
    return null;
  }
}

async function fetchYouTubeOembed(url) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(endpoint);
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data) return null;

  return {
    title: data.title || "YouTube Video",
    authorName: data.author_name || "",
    thumbnailUrl: data.thumbnail_url || youtubeThumb(url),
    providerName: "YouTube",
  };
}

async function fetchTikTokOembed(url) {
  const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    if (!data) return null;

    let videoId = extractTikTokVideoId(url);

    if (!videoId && typeof data.html === "string") {
      const citeMatch = data.html.match(/cite="([^"]+)"/i);
      if (citeMatch?.[1]) videoId = extractTikTokVideoId(citeMatch[1]);
    }

    const embedUrl = videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : "";

    return {
      title: data.title || "TikTok Video",
      authorName: data.author_name || "",
      thumbnailUrl: data.thumbnail_url || "",
      providerName: "TikTok",
      embedUrl,
    };
  } catch {
    return null;
  }
}

function formatProvider(providerName) {
  return providerName || "";
}

// ===== flatten / group for store =====
function flattenStore(storeObj) {
  const out = [];
  const store = storeObj && typeof storeObj === "object" ? storeObj : {};
  Object.keys(store).forEach((propertyId) => {
    const arr = Array.isArray(store[propertyId]) ? store[propertyId] : [];
    arr.forEach((v) => {
      out.push({
        id: v.id,
        propertyId,
        type: v.provider || v.type || detectProvider(v.url || v.videoUrl),
        videoUrl: v.url || v.videoUrl,
        createdAt: v.createdAt ? new Date(v.createdAt) : new Date(),
        preview: v.preview || null,
      });
    });
  });
  return out;
}

function writeItemsToStore(items) {
  const grouped = {};
  items.forEach((it) => {
    const pid = String(it.propertyId);
    if (!grouped[pid]) grouped[pid] = [];

    grouped[pid].push({
      id: it.id,
      url: it.videoUrl,
      provider: it.type === "tiktok" ? "tiktok" : "youtube",
      createdAt: new Date(it.createdAt).toISOString(),
      preview: it.preview || null,
    });
  });

  writeVideoStore(grouped);
}

export default function DashboardVideoGalleryContent() {
  const searchParams = useSearchParams();

  const [hydrated, setHydrated] = useState(false);

  // ===== items from localStorage =====
  const [items, setItems] = useState([]);

  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const [adding, setAdding] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  // ✅ 4 ช่อง input
  const [videoUrls, setVideoUrls] = useState(["", "", "", ""]);

  // ✅ property filter: "ALL" | "<id>"
  const [propertyFilter, setPropertyFilter] = useState("ALL");

  // ✅ Add modal: selected propertyId (MUST be real property id)
  const [addPropertyId, setAddPropertyId] = useState("");

  // popup player
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [popupSrc, setPopupSrc] = useState(null);

  // ✅ map mock property for label
  const propertyMap = useMemo(() => {
    const m = new Map();
    (propertyData || []).forEach((p) => m.set(String(p.id), p));
    return m;
  }, []);

  const normalizeUrl = (u) => (u || "").trim();

  // ✅ count วิดีโอต่อประกาศ
  const propertyVideoCount = useMemo(() => {
    const m = new Map();
    items.forEach((x) => {
      const pid = String(x.propertyId);
      m.set(pid, (m.get(pid) || 0) + 1);
    });
    return m;
  }, [items]);

  // ✅ คำนวณ slot ที่เหลือ
  const remainingSlots = (pid) => {
    const p = String(pid || "");
    const cnt = propertyVideoCount.get(p) || 0;
    return Math.max(0, MAX_VIDEOS_PER_PROPERTY - cnt);
  };

  const urlExistsGlobally = (url, ignoreId = null) => {
    const target = normalizeUrl(url);
    return items.some((x) => x.id !== ignoreId && normalizeUrl(x.videoUrl) === target);
  };

  // ✅ auto set propertyFilter from query ?propertyId=
  useEffect(() => {
    const pid = searchParams.get("propertyId");
    if (pid) {
      setPropertyFilter(String(pid));
      setPage(1);
    }
  }, [searchParams]);

  // ===== init from localStorage =====
  useEffect(() => {
    const store = readVideoStore();
    const flat = flattenStore(store);
    setItems(flat);

    setHydrated(true);

    const onStorage = (e) => {
      if (e.key !== VIDEO_STORE_KEY) return;
      const st = readVideoStore();
      setItems(flattenStore(st));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ===== write to localStorage whenever items change =====
  useEffect(() => {
    if (!hydrated) return;
    writeItemsToStore(items);
  }, [hydrated, items]);

  // ✅ ถ้าเลือกประกาศแล้ว slot น้อยลง → ล้างค่าช่องที่เกิน (กันกรอกเกินแบบเนียนๆ)
  useEffect(() => {
    if (!showAdd) return;
    const slots = remainingSlots(addPropertyId);
    setVideoUrls((prev) => {
      const next = [...prev];
      for (let i = slots; i < 4; i++) {
        if (next[i]) next[i] = "";
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addPropertyId, propertyVideoCount, showAdd]);

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

  const isPortrait =
    activeItem?.type === "tiktok" ||
    (activeItem?.type === "youtube" && isYouTubeShorts(activeItem?.videoUrl));

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

    if (propertyFilter !== "ALL") {
      arr = arr.filter((x) => String(x.propertyId) === String(propertyFilter));
    }

    arr.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? tb - ta : ta - tb;
    });

    return arr;
  }, [items, sortOrder, propertyFilter]);

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
      await wait(200);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("ลบแล้ว");
    } catch {
      toast.error("ลบไม่สำเร็จ");
    }
  };

  const bulkDelete = async () => {
    if (selectedCount === 0) return;
    const ok = confirm(`ต้องการลบวิดีโอที่เลือก ${selectedCount} รายการ ใช่ไหม?`);
    if (!ok) return;

    try {
      setBulkLoading(true);
      await wait(350);

      setItems((prev) => prev.filter((x) => !selectedIds.has(x.id)));
      clearSelection();
      toast.success("ลบวิดีโอที่เลือกแล้ว");
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

  const clearFilter = () => {
    setSortOrder(DEFAULT_SORT);
    setPropertyFilter("ALL");
    setPage(1);

    clearSelection();
    setSelectMode(false);

    toast.info("ล้างตัวกรองแล้ว");
  };

  const isFiltered = sortOrder !== DEFAULT_SORT || propertyFilter !== "ALL";

  // ✅ Open Add modal
  const openAdd = () => {
    setVideoUrls(["", "", "", ""]);

    const pid = String(propertyFilter);
    const canUseFiltered = propertyFilter !== "ALL";

    const fallbackPid = String(propertyData?.[0]?.id || "");
    setAddPropertyId(canUseFiltered ? pid : fallbackPid);

    setShowAdd(true);
  };

  const closeAdd = () => {
    if (adding) return;
    setShowAdd(false);
    setVideoUrls(["", "", "", ""]);
  };

  /** เปิด popup player */
  const openPlayer = async (item) => {
    try {
      setActiveItem(item);
      setPlayerOpen(true);
      setPopupSrc(null);

      if (item.type === "youtube" || isYouTubeUrl(item.videoUrl)) {
        setPopupSrc(toYouTubeEmbed(item.videoUrl));
        return;
      }

      if (item.type === "tiktok" || isTikTokUrl(item.videoUrl)) {
        const embed = item.preview?.embedUrl || "";
        if (embed) setPopupSrc(embed);
        else setPopupSrc(toTikTokEmbedFallback(item.videoUrl));
        return;
      }
    } catch (e) {
      console.log(e);
      toast.error("เปิดวิดีโอไม่สำเร็จ");
    }
  };

  const updateVideoUrl = (idx, value) => {
    setVideoUrls((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  /** ✅ เพิ่มวิดีโอหลายลิงก์ทีเดียว (1-4) */
  const addVideos = async () => {
    if (!addPropertyId) return toast.info("กรุณาเลือกประกาศ");

    const pid = String(addPropertyId);
    const slots = remainingSlots(pid);

    if (slots <= 0) {
      return toast.error(`ประกาศนี้มีวิดีโอครบ ${MAX_VIDEOS_PER_PROPERTY} แล้ว`);
    }

    // normalize + เอาแต่ช่องที่ไม่ว่าง (เฉพาะช่องที่ไม่ถูก disable)
    const rawList = (videoUrls || [])
      .slice(0, slots)
      .map((x) => normalizeUrl(x))
      .filter(Boolean);

    if (rawList.length === 0) return toast.info("กรุณาวางลิงก์อย่างน้อย 1 ลิงก์");

    // ห้ามลิงก์ซ้ำภายใน modal
    const localDup = rawList.find((u, i) => rawList.indexOf(u) !== i);
    if (localDup) {
      return toast.error("มีลิงก์ซ้ำกันในช่องที่กรอก");
    }

    // validate provider
    const invalidProvider = rawList.find((u) => !isYouTubeUrl(u) && !isTikTokUrl(u));
    if (invalidProvider) {
      return toast.error("รองรับเฉพาะ YouTube / TikTok ตอนนี้");
    }

    // unique global
    const existed = rawList.find((u) => urlExistsGlobally(u));
    if (existed) {
      return toast.error("มีลิงก์อย่างน้อย 1 อันถูกผูกกับโพสอื่นอยู่แล้ว");
    }

    try {
      setAdding(true);

      const prepared = [];
      for (const url of rawList) {
        const type = detectProvider(url);
        let preview = null;

        if (type === "youtube") {
          preview =
            (await fetchYouTubeOembed(url)) || {
              title: "YouTube Video",
              authorName: "",
              thumbnailUrl: youtubeThumb(url),
              providerName: "YouTube",
            };
        } else {
          preview =
            (await fetchTikTokOembed(url)) || {
              title: "TikTok Video",
              authorName: "",
              thumbnailUrl: "",
              providerName: "TikTok",
              embedUrl: "",
            };
        }

        prepared.push({
          id: `vid_${uid()}`,
          type,
          propertyId: pid,
          videoUrl: url,
          createdAt: new Date(),
          preview,
        });
      }

      await wait(120);

      setItems((prev) => [...prepared, ...prev]);

      toast.success(`เพิ่มวิดีโอแล้ว ${prepared.length} รายการ`);
      setPage(1);
      setShowAdd(false);
      setVideoUrls(["", "", "", ""]);
    } catch (e) {
      console.log(e);
      toast.error("เพิ่มวิดีโอไม่สำเร็จ");
    } finally {
      setAdding(false);
    }
  };

  // ===== UI =====
  const addSlots = remainingSlots(addPropertyId);

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
          <button className="ud-btn btn-thm btn-sm" onClick={openAdd} disabled={adding || selectMode}>
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
          style={{ maxWidth: 360 }}
          value={propertyFilter}
          onChange={(e) => {
            setPropertyFilter(e.target.value);
            setPage(1);
            clearSelection();
          }}
          disabled={bulkLoading || adding}
          title="กรองตามประกาศ"
        >
          <option value="ALL">ทุกประกาศ (ทั้งหมด)</option>

          {(propertyData || []).map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.title} (#{p.id})
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

            <button className="btn btn-sm btn-danger" onClick={bulkDelete} disabled={selectedCount === 0 || bulkLoading}>
              {bulkLoading ? "กำลังทำ..." : `ลบที่เลือก (${selectedCount})`}
            </button>

            <button className="btn btn-sm btn-outline-secondary" onClick={clearSelection} disabled={selectedCount === 0 || bulkLoading}>
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
          <div className="text-muted fz13 mt-2">
            * จำกัด {MAX_VIDEOS_PER_PROPERTY} วิดีโอ ต่อ 1 ประกาศ
          </div>
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
            const provider = formatProvider(v.preview?.providerName);

            const thumb = v.preview?.thumbnailUrl || (v.type === "youtube" ? youtubeThumb(v.videoUrl) : "");

            const pid = String(v.propertyId);
            const p = propertyMap.get(pid);

            return (
              <div
                key={v.id}
                className="border bdrs12 overflow-hidden position-relative"
                style={{
                  borderColor: "rgba(0,0,0,0.08)",
                  background: "#fff",
                  outline: selectMode && isSelected(v.id) ? "3px solid rgba(13,110,253,0.6)" : "none",
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

                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
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

                {/* property badge */}
                <div
                  className="position-absolute"
                  style={{
                    left: 8,
                    bottom: 8,
                    background: "rgba(255,255,255,0.92)",
                    borderRadius: 10,
                    padding: "4px 8px",
                    fontSize: 12,
                    border: "1px solid rgba(0,0,0,0.08)",
                    maxWidth: "80%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={`${p?.title ?? "ประกาศ"} (#${pid})`}
                >
                  {`${p?.title ?? "ประกาศ"} (#${pid})`}
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
                      right: 8,
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
                    <input type="checkbox" checked={isSelected(v.id)} onChange={() => toggleOne(v.id)} />
                    <span className="fz12">เลือก</span>
                  </label>
                ) : (
                  <div className="position-absolute d-flex gap-2" style={{ right: 8, top: 8 }}>
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

      {/* Add modal (4 ช่อง + disable ตาม slot) */}
      {showAdd && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.35)", zIndex: 9999 }}
          onMouseDown={closeAdd}
        >
          <div
            className="bg-white bdrs12 default-box-shadow2 p-3"
            style={{
              width: "min(640px, 92vw)",
              margin: "10vh auto 0",
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

            <div className="text-muted fz13 mb-3">
              รองรับลิงก์ YouTube / TikTok • จำกัด {MAX_VIDEOS_PER_PROPERTY} วิดีโอ ต่อ 1 ประกาศ
            </div>

            <label className="fz13 fw600 mb-1">เลือกประกาศ</label>
            <select
              className="form-select mb-2"
              value={addPropertyId}
              onChange={(e) => setAddPropertyId(e.target.value)}
              disabled={adding}
            >
              {(propertyData || []).map((p) => {
                const pid = String(p.id);
                const cnt = propertyVideoCount.get(pid) || 0;
                const full = cnt >= MAX_VIDEOS_PER_PROPERTY;
                return (
                  <option key={p.id} value={pid} disabled={full}>
                    {p.title} (#{p.id}) • ({cnt}/{MAX_VIDEOS_PER_PROPERTY}){full ? " • เต็มแล้ว" : ""}
                  </option>
                );
              })}
            </select>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fz13 fw600">ลิงก์วิดีโอ (ใส่ได้ 1–4 ลิงก์)</div>
              <div className="text-muted fz12">เหลืออีก {addSlots} ช่องในประกาศนี้</div>
            </div>

            <div className="d-grid" style={{ gap: 10 }}>
              {[0, 1, 2, 3].map((i) => {
                const disabledBySlot = i >= addSlots; // ✅ นี่แหละที่ขอ
                return (
                  <input
                    key={i}
                    className="form-control"
                    placeholder={
                      disabledBySlot
                        ? `ช่อง #${i + 1} (เต็มแล้ว)`
                        : `ลิงก์วิดีโอ #${i + 1} (YouTube/TikTok)`
                    }
                    value={videoUrls[i]}
                    onChange={(e) => updateVideoUrl(i, e.target.value)}
                    disabled={adding || disabledBySlot}
                  />
                );
              })}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-dark" onClick={closeAdd} disabled={adding}>
                ยกเลิก
              </button>
              <button className="ud-btn btn-thm" onClick={addVideos} disabled={adding || addSlots === 0}>
                {adding ? "กำลังเพิ่ม..." : "เพิ่มวิดีโอ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup player */}
      {playerOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.8)", zIndex: 10000, padding: 16 }}
          onMouseDown={closePlayer}
        >
          <div
            className="position-relative"
            style={{
              width: isPortrait ? "min(420px, 92vw)" : "min(1100px, 94vw)",
              maxHeight: "92vh",
              borderRadius: 18,
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 22px 70px rgba(0,0,0,0.45)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              className="position-absolute d-flex align-items-center justify-content-between"
              style={{
                inset: "0 0 auto 0",
                padding: 12,
                zIndex: 5,
                pointerEvents: "none",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))",
              }}
            >
              <div style={{ display: "flex", gap: 8, pointerEvents: "auto" }}>
                {activeItem?.type === "tiktok" && (
                  <button
                    type="button"
                    onClick={() => window.open(activeItem.videoUrl, "_blank")}
                    className="btn btn-light btn-sm"
                    style={{ borderRadius: 999 }}
                  >
                    เปิดใน TikTok
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={closePlayer}
                className="btn btn-light btn-sm"
                style={{ borderRadius: 999, pointerEvents: "auto" }}
                aria-label="ปิด"
              >
                ✕
              </button>
            </div>

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: isPortrait ? "9/16" : "16/9",
                maxHeight: "92vh",
                background: "#000",
              }}
            >
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
                  กำลังโหลดวิดีโอ...
                </div>
              ) : (
                <iframe
                  key={popupSrc}
                  src={popupSrc}
                  title="Video Player"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: "0",
                    background: "#000",
                  }}
                />
              )}
            </div>

            {activeItem?.type === "tiktok" && (
              <div
                style={{
                  padding: "10px 12px",
                  background: "#0b0b0b",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  TikTok อาจแสดงปุ่ม/แถบของตัวเอง
                </span>
                <button
                  type="button"
                  onClick={() => window.open(activeItem.videoUrl, "_blank")}
                  className="btn btn-outline-light btn-sm"
                  style={{ borderRadius: 999, padding: "2px 8px" }}
                >
                  เปิดใน TikTok
                </button>
              </div>
            )}
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
