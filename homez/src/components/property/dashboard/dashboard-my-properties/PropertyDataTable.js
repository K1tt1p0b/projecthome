"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { propertyData as mockData } from "@/data/propertyData";
import { toast } from "react-toastify";

const getStatusStyle = (status) => {
  switch (status) {
    case "รอตรวจสอบ":
      return "pending-style style1";
    case "เผยแพร่แล้ว":
      return "pending-style style2";
    case "กำลังดำเนินการ":
      return "pending-style style3";
    default:
      return "";
  }
};

const BOOST_URL = (id) => `/dashboard-boost-property/${id}`;
const VIDEO_URL = (id) => `/dashboard-video-gallery?propertyId=${id}`;

// ===== LocalStorage Video Store (Front-only DB) =====
const VIDEO_STORE_KEY = "landx_property_videos_v1";
/**
 * ✅ shape (1:1 enforced in UI):
 * {
 *   [propertyId: string]: Array<{ id: string, url: string, provider: "youtube"|"tiktok", createdAt: string }>
 * }
 *
 * 🔒 rule:
 * - 1 propertyId => max 1 video (array length should be 0 or 1)
 */
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
function detectProvider(url) {
  const u = (url || "").trim();
  if (u.includes("tiktok.com/")) return "tiktok";
  return "youtube";
}
function isValidVideoUrl(url) {
  if (!url) return false;
  const u = url.trim();
  const isYoutube = u.includes("youtube.com/watch") || u.includes("youtu.be/") || u.includes("youtube.com/shorts/");
  const isTiktok = u.includes("tiktok.com/");
  return isYoutube || isTiktok;
}
function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// ===== skeleton row =====
const SkeletonRow = () => (
  <tr>
    <th scope="row">
      <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
        <div
          style={{
            width: 110,
            height: 94,
            borderRadius: 12,
            background: "#eee",
            flexShrink: 0,
          }}
        />
        <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4 w-100">
          <div style={{ width: "60%", height: 14, background: "#eee", borderRadius: 6 }} />
          <div style={{ width: "30%", height: 12, background: "#eee", borderRadius: 6, marginTop: 10 }} />
        </div>
      </div>
    </th>
    <td className="vam">
      <div style={{ width: 90, height: 12, background: "#eee", borderRadius: 6 }} />
    </td>
    <td className="vam">
      <div style={{ width: 110, height: 28, background: "#eee", borderRadius: 999 }} />
    </td>
    <td className="vam">
      <div style={{ width: 60, height: 12, background: "#eee", borderRadius: 6 }} />
    </td>
    <td className="vam">
      <div className="d-flex align-items-center gap-2">
        <div style={{ width: 28, height: 28, background: "#eee", borderRadius: 6 }} />
        <div style={{ width: 28, height: 28, background: "#eee", borderRadius: 6 }} />
      </div>
    </td>
  </tr>
);

const PropertyDataTable = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  // row loading states
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [boostingId, setBoostingId] = useState(null);

  // ===== videoSummary (from localStorage) =====
  // { [propertyId]: { hasVideo: boolean, count: number } }
  const [videoSummary, setVideoSummary] = useState({});

  // ===== modal states =====
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalProperty, setVideoModalProperty] = useState(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoSaving, setVideoSaving] = useState(false);

  const hasData = useMemo(() => properties?.length > 0, [properties]);

  // ✅ enforce 1:1 summary: count is 0 or 1
  const refreshVideoSummaryFromLocal = (propertyIds) => {
    const store = readVideoStore();
    const next = {};
    (propertyIds || []).forEach((id) => {
      const list = store?.[String(id)] ?? [];
      const cnt = Array.isArray(list) ? Math.min(1, list.length) : 0;
      next[id] = { count: cnt, hasVideo: cnt > 0 };
    });
    setVideoSummary(next);
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 350));
      const list = Array.isArray(mockData) ? mockData : [];
      setProperties(list);

      refreshVideoSummaryFromLocal(list.map((p) => p.id));
    } catch (e) {
      console.error(e);
      toast.error("โหลดประกาศไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync ข้ามแท็บ / หน้าต่าง
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== VIDEO_STORE_KEY) return;
      refreshVideoSummaryFromLocal(properties.map((p) => p.id));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  const rowBusy = (id) => editingId === id || deletingId === id || boostingId === id || (videoSaving && videoModalProperty?.id === id);

  const handleEdit = async (id) => {
    try {
      if (deletingId === id) return;
      setEditingId(id);
      await new Promise((r) => setTimeout(r, 250));
      router.push(`/dashboard-edit-property/${id}`);
    } catch (e) {
      console.error(e);
      toast.error("ไปหน้าแก้ไขไม่สำเร็จ");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (editingId === id) return;
    const ok = window.confirm("ยืนยันการลบประกาศนี้ใช่ไหม?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await new Promise((r) => setTimeout(r, 400));

      setProperties((prev) => prev.filter((p) => p.id !== id));

      // ลบ summary เฉยๆ (ไม่ลบ localStorage videos อัตโนมัติ)
      setVideoSummary((prev) => {
        const next = { ...(prev || {}) };
        delete next[id];
        return next;
      });

      toast.success("ลบประกาศสำเร็จ");
    } catch (e) {
      console.error(e);
      toast.error("ลบประกาศไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBoost = async (id) => {
    try {
      if (deletingId === id) return;
      setBoostingId(id);
      await new Promise((r) => setTimeout(r, 200));
      router.push(BOOST_URL(id));
    } catch (e) {
      console.error(e);
      toast.error("ไปหน้าดันประกาศไม่สำเร็จ");
    } finally {
      setBoostingId(null);
    }
  };

  const handleVideoPage = (id) => router.push(VIDEO_URL(id));

  // ✅ บังคับ: ถ้ามีวิดีโอแล้ว ห้ามเปิด modal เพิ่ม (แจ้งเตือน)
  const openVideoModal = (property) => {
    const id = property?.id;
    if (!id) return;

    const cnt = videoSummary?.[id]?.count ?? 0;
    if (cnt > 0) {
      toast.info("โพสนี้มีวิดีโอแล้ว (เพิ่มได้แค่อันเดียว) ไปที่ “จัดการวิดีโอ” เพื่อเปลี่ยน/ย้าย");
      return;
    }

    setVideoModalProperty(property);
    setVideoUrlInput("");
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    if (videoSaving) return;
    setVideoModalOpen(false);
    setVideoModalProperty(null);
    setVideoUrlInput("");
  };

  // ✅ save url to localStorage (enforce 1 video per post)
  const saveVideoUrlFrontOnly = async () => {
    const property = videoModalProperty;
    const url = videoUrlInput.trim();

    if (!property?.id) return;

    if (!url) return toast.warning("กรุณาใส่ลิงก์วิดีโอ");
    if (!isValidVideoUrl(url)) return toast.error("ลิงก์ไม่ถูกต้อง (รองรับ YouTube / TikTok)");

    try {
      setVideoSaving(true);
      await new Promise((r) => setTimeout(r, 250));

      const store = readVideoStore();
      const key = String(property.id);

      // 🔒 บังคับ: 1 โพส มีได้แค่วิดีโอเดียว
      const current = Array.isArray(store[key]) ? store[key] : [];
      if (current.length > 0) {
        toast.error("โพสนี้มีวิดีโอแล้ว (เพิ่มได้แค่อันเดียว)");
        closeVideoModal();
        return;
      }

      // (optional but good) 🔒 กัน url ซ้ำข้ามโพส
      const all = Object.values(store || {}).flatMap((arr) => (Array.isArray(arr) ? arr : []));
      const urlUsed = all.some((v) => (v?.url || "").trim() === url);
      if (urlUsed) {
        toast.error("ลิงก์นี้ถูกผูกกับโพสอื่นอยู่แล้ว");
        return;
      }

      const item = {
        id: uid(),
        url,
        provider: detectProvider(url),
        createdAt: new Date().toISOString(),
      };

      // ✅ เก็บเป็น array ที่มี 1 ตัวเท่านั้น
      const nextStore = { ...store, [key]: [item] };
      writeVideoStore(nextStore);

      // update summary immediately => count = 1
      setVideoSummary((prev) => ({
        ...(prev || {}),
        [property.id]: { count: 1, hasVideo: true },
      }));

      toast.success("เพิ่มวิดีโอสำเร็จ");
      closeVideoModal();
    } catch (e) {
      console.error(e);
      toast.error("เพิ่มวิดีโอไม่สำเร็จ");
    } finally {
      setVideoSaving(false);
    }
  };

  return (
    <>
      {/* ===== Modal Popup ===== */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="เพิ่มวิดีโอ"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeVideoModal();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "min(640px, 100%)",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}
          >
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <div>
                <div className="h6 mb-0">เพิ่มวิดีโอ</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  ประกาศ: <b>{videoModalProperty?.title}</b>
                </div>
              </div>

              <button type="button" className="btn btn-light" onClick={closeVideoModal} disabled={videoSaving} aria-label="close">
                <span className="fas fa-times" />
              </button>
            </div>

            <div className="px-4 py-4">
              <label className="form-label" style={{ fontWeight: 600 }}>
                ลิงก์วิดีโอ (YouTube / TikTok)
              </label>

              <input
                className="form-control"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="วางลิงก์ เช่น https://youtu.be/... หรือ https://www.tiktok.com/@.../video/..."
                disabled={videoSaving}
              />

              <div className="mt-2" style={{ fontSize: 13, opacity: 0.8 }}>
                * จำกัด 1 วิดีโอ ต่อ 1 ประกาศ (ถ้ามีแล้วให้ไปหน้า “จัดการวิดีโอ”)
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button 
                  type="button"
                  className="ud-btn btn-white2" 
                  onClick={closeVideoModal} 
                  disabled={videoSaving}
                  style={{ height: 44, padding: "0 18px", borderRadius: 12 }}
                  >
                  ยกเลิก
                </button>

                <button 
                  type="button" 
                  className="ud-btn btn-thme" 
                  onClick={saveVideoUrlFrontOnly} 
                  disabled={videoSaving}
                  style={{ height: 44, padding: "0 18px", borderRadius: 12 }}
                  >
                  {videoSaving ? (
                    <>
                      <span className="fas fa-spinner fa-spin me-2" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <span className="fas fa-plus me-2" />
                      เพิ่มวิดีโอ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th scope="col">รายการทรัพย์</th>
            <th scope="col">ราคา</th>
            <th scope="col">สถานะ</th>
            <th scope="col">ยอดเข้าชม</th>
            <th scope="col">จัดการ</th>
          </tr>
        </thead>

        <tbody className="t-body">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : !hasData ? (
            <tr>
              <td colSpan={5} className="text-center py-5">
                ยังไม่มีประกาศ
              </td>
            </tr>
          ) : (
            properties.map((property) => {
              const count = videoSummary?.[property.id]?.count ?? 0; // 0/1
              const hasVideo = count > 0;

              const busy = rowBusy(property.id);

              return (
                <tr key={property.id}>
                  <th scope="row">
                    <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                      <div className="list-thumb">
                        <Image width={110} height={94} className="w-100" src={property.imageSrc} alt="property" />
                      </div>

                      <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                        <div className="h6 list-title d-flex align-items-center gap-2">
                          <Link href={`/single-v1/${property.id}`}>{property.title}</Link>

                          {/* ✅ ไอคอนวิดีโอ เฉพาะโพสต์ที่มีวิดีโอ */}
                          {hasVideo && (
                            <>
                              <button
                                type="button"
                                className="icon"
                                disabled={busy}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  padding: 0,
                                  opacity: busy ? 0.5 : 1,
                                  cursor: busy ? "not-allowed" : "pointer",
                                }}
                                data-tooltip-id={`video-${property.id}`}
                                onClick={() => handleVideoPage(property.id)}
                                aria-label="video"
                              >
                                <span className="fas fa-video" />
                              </button>

                              <ReactTooltip id={`video-${property.id}`} place="top" content={`วิดีโอ (${count})`} />
                            </>
                          )}
                        </div>

                        <p className="list-text mb-0">
                          {property?.location?.province ? `${property.location.province} ${property.location.district ?? ""}` : property.location || "-"}
                        </p>
                      </div>
                    </div>
                  </th>

                  <td className="vam">{property.priceText || property.price?.toLocaleString?.() || "-"}</td>

                  <td className="vam">
                    <span className={getStatusStyle(property.status)}>{property.status}</span>
                  </td>

                  <td className="vam">{property.views ?? "-"}</td>

                  <td className="vam">
                    <div className="d-flex align-items-center justify-content-end">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="icon"
                          disabled={busy}
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            opacity: busy ? 0.5 : 1,
                            cursor: busy ? "not-allowed" : "pointer",
                          }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          aria-label="actions"
                          data-tooltip-id={`actions-${property.id}`}
                        >
                          <span className="fas fa-ellipsis-h" />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => handleEdit(property.id)}
                            >
                              {editingId === property.id ? <span className="fas fa-spinner fa-spin" /> : <span className="fas fa-pen" />}
                              แก้ไข
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => handleBoost(property.id)}
                            >
                              {boostingId === property.id ? <span className="fas fa-spinner fa-spin" /> : <span className="fas fa-bolt" />}
                              ดันประกาศ
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => openVideoModal(property)}
                            >
                              <span className="fas fa-video" />
                              เพิ่มวิดีโอ
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => handleVideoPage(property.id)}
                            >
                              <span className="fas fa-folder-open" />
                              จัดการวิดีโอ
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2 text-danger"
                              disabled={busy}
                              onClick={() => handleDelete(property.id)}
                            >
                              {deletingId === property.id ? <span className="fas fa-spinner fa-spin" /> : <span className="flaticon-bin" />}
                              ลบ
                            </button>
                          </li>
                        </ul>

                        <ReactTooltip id={`actions-${property.id}`} place="top" content="จัดการ" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
};

export default PropertyDataTable;
