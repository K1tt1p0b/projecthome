"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { constructionServices as mockData } from "@/components/services/ConstructionRequest";
import { toast } from "react-toastify";

// ✅ 1. ตั้งค่าตัวเลือกสถานะ (ให้ตรงกับหน้า Add Listing)
const STATUS_OPTIONS = [
  { value: "active", label: "เผยแพร่ (Active)", class: "style2" }, // สีเขียว
  { value: "pending", label: "รอตรวจสอบ (Pending)", class: "style1" }, // สีส้ม
  { value: "hidden", label: "ซ่อน (Hidden)", class: "style3" }, // สีฟ้า/เทา (สมมติว่าใช้ style3)
];

// Helper: แปลงค่า status เป็น class สี
const getStatusClass = (status) => {
  const found = STATUS_OPTIONS.find(o => o.value === status);
  return found ? `pending-style ${found.class}` : "pending-style";
};

// Helper: เอา Label ภาษาไทยมาโชว์
const getStatusLabel = (status) => {
  const found = STATUS_OPTIONS.find(o => o.value === status);
  return found ? found.label : status;
};

// ... (Code ส่วน Helper URL/Video เหมือนเดิม ขอละไว้เพื่อความสั้น) ...
const BOOST_URL = (id) => `/dashboard-boost-property/${id}`;
const VIDEO_URL = (id) => `/dashboard-video-gallery?propertyId=${id}`;
const VIDEO_STORE_KEY = "landx_property_videos_v1";
const MAX_SLOTS = 4;

const toUrlText = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.url || v.src || v.link || "";
  return String(v);
};
const toTrimmedUrl = (v) => String(toUrlText(v) || "").trim();

function safeParse(json) { try { return JSON.parse(json); } catch { return null; } }
function readVideoStore() { if (typeof window === "undefined") return {}; const raw = window.localStorage.getItem(VIDEO_STORE_KEY); const parsed = raw ? safeParse(raw) : null; return parsed && typeof parsed === "object" ? parsed : {}; }
function writeVideoStore(store) { if (typeof window === "undefined") return; window.localStorage.setItem(VIDEO_STORE_KEY, JSON.stringify(store ?? {})); }
function detectProvider(url) { const u = toTrimmedUrl(url); if (u.includes("tiktok.com/")) return "tiktok"; return "youtube"; }
function isValidVideoUrl(url) { const u = toTrimmedUrl(url); if (!u) return true; const isYoutube = u.includes("youtube.com/watch") || u.includes("youtu.be/") || u.includes("youtube.com/shorts/"); const isTiktok = u.includes("tiktok.com/"); return isYoutube || isTiktok; }
function uid() { return `${Date.now()}_${Math.random().toString(16).slice(2)}`; }
function normalizeStoreValueToUrls(v) { if (!v) return []; if (Array.isArray(v)) { if (v.length && typeof v[0] === "object") { return v.map((x) => toTrimmedUrl(x?.url || x?.src || x?.link)).filter(Boolean); } return v.map((x) => toTrimmedUrl(x)).filter(Boolean); } if (Array.isArray(v?.urls)) { return v.urls.map((x) => toTrimmedUrl(x)).filter(Boolean); } return []; }
function buildItemsFromUrls(urls) { const now = new Date().toISOString(); return (urls || []).map((u) => toTrimmedUrl(u)).filter(Boolean).slice(0, MAX_SLOTS).map((url) => ({ id: uid(), url, provider: detectProvider(url), createdAt: now, })); }

// ===== Skeleton Row =====
const SkeletonRow = () => (
  <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
    <th scope="row" className="py-4 ps-4"><div className="d-flex align-items-center"><div style={{ width: 110, height: 80, borderRadius: 12, background: "#eee", flexShrink: 0 }} /><div className="ms-3 w-100"><div style={{ width: "60%", height: 16, background: "#eee", borderRadius: 6, marginBottom: 8 }} /><div style={{ width: "40%", height: 14, background: "#eee", borderRadius: 6 }} /></div></div></th>
    <td className="align-middle text-center"><div style={{ width: 100, height: 28, background: "#eee", borderRadius: 14, margin: "0 auto" }} /></td>
    <td className="align-middle text-center"><div style={{ width: 60, height: 16, background: "#eee", borderRadius: 6, margin: "0 auto" }} /></td>
    <td className="align-middle text-end pe-4"><div style={{ width: 32, height: 32, background: "#eee", borderRadius: 8 }} /></td>
  </tr>
);

const Construction = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  // row loading states
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [boostingId, setBoostingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null); // ✅ State สำหรับโหลดตอนเปลี่ยนสถานะ

  const [videoSummary, setVideoSummary] = useState({});

  // modal states
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalProperty, setVideoModalProperty] = useState(null);
  const [videoInputs, setVideoInputs] = useState(Array(MAX_SLOTS).fill(""));
  const [videoSaving, setVideoSaving] = useState(false);

  const hasData = useMemo(() => properties?.length > 0, [properties]);

  // ... (Functions: refreshVideoSummary, fetchProperties, onStorage เหมือนเดิม) ...
  const refreshVideoSummaryFromLocal = (propertyIds) => { const store = readVideoStore(); const next = {}; (propertyIds || []).forEach((id) => { const list = store?.[String(id)] ?? []; const urls = normalizeStoreValueToUrls(list); const cnt = Math.min(MAX_SLOTS, urls.length); next[id] = { count: cnt, hasVideo: cnt > 0 }; }); setVideoSummary(next); };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 350));
      // Mockup Data: ให้มี status เริ่มต้น
      const list = Array.isArray(mockData) ? mockData.map(p => ({ ...p, status: p.status || "active" })) : [];
      setProperties(list);
      refreshVideoSummaryFromLocal(list.map((p) => p.id));
    } catch (e) { console.error(e); toast.error("โหลดข้อมูลไม่สำเร็จ"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);
  useEffect(() => { const onStorage = (e) => { if (e.key !== VIDEO_STORE_KEY) return; refreshVideoSummaryFromLocal(properties.map((p) => p.id)); }; window.addEventListener("storage", onStorage); return () => window.removeEventListener("storage", onStorage); }, [properties]);

  // ✅ 2. ฟังก์ชันเปลี่ยนสถานะ (หัวใจสำคัญ)
  const handleStatusChange = async (id, newStatus) => {
    try {
      setStatusUpdatingId(id); // เริ่มหมุน Loading
      // จำลอง Delay (เหมือนส่งไป Backend)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // อัปเดต State
      setProperties((prev) =>
        prev.map((p) => p.id === id ? { ...p, status: newStatus } : p)
      );

      toast.success(`เปลี่ยนสถานะเป็น "${getStatusLabel(newStatus)}" แล้ว`);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setStatusUpdatingId(null); // หยุดหมุน
    }
  };

  const rowBusy = (id) => editingId === id || deletingId === id || boostingId === id || statusUpdatingId === id || (videoSaving && videoModalProperty?.id === id);

  // ... (Other handlers: Edit, Delete, Boost, Video - Keep same) ...
  const handleEdit = async (id) => { try { if (deletingId === id) return; setEditingId(id); await new Promise((r) => setTimeout(r, 250)); router.push(`/add-listing?id=${id}`); } catch (e) { console.error(e); toast.error("ไปหน้าแก้ไขไม่สำเร็จ"); } finally { setEditingId(null); } };
  const handleDelete = async (id) => { if (editingId === id) return; const ok = window.confirm("ยืนยันการลบรายการนี้ใช่ไหม?"); if (!ok) return; try { setDeletingId(id); await new Promise((r) => setTimeout(r, 400)); setProperties((prev) => prev.filter((p) => p.id !== id)); setVideoSummary((prev) => { const next = { ...(prev || {}) }; delete next[id]; return next; }); toast.success("ลบสำเร็จ"); } catch (e) { console.error(e); toast.error("ลบไม่สำเร็จ"); } finally { setDeletingId(null); } };
  const handleBoost = async (id) => { try { if (deletingId === id) return; setBoostingId(id); await new Promise((r) => setTimeout(r, 200)); router.push(BOOST_URL(id)); } catch (e) { console.error(e); toast.error("ไปหน้าดันประกาศไม่สำเร็จ"); } finally { setBoostingId(null); } };
  const handleVideoPage = (id) => router.push(VIDEO_URL(id));
  const openVideoModal = (property) => { const id = property?.id; if (!id) return; const store = readVideoStore(); const existing = store?.[String(id)]; const urls = normalizeStoreValueToUrls(existing); const nextInputs = Array(MAX_SLOTS).fill(""); urls.slice(0, MAX_SLOTS).forEach((u, i) => (nextInputs[i] = toTrimmedUrl(u))); setVideoModalProperty(property); setVideoInputs(nextInputs); setVideoModalOpen(true); };
  const closeVideoModal = () => { if (videoSaving) return; setVideoModalOpen(false); setVideoModalProperty(null); setVideoInputs(Array(MAX_SLOTS).fill("")); };
  const setVideoAt = (idx, value) => { setVideoInputs((prev) => { const next = [...prev]; next[idx] = String(value ?? ""); return next; }); };
  const saveVideoUrlsFrontOnly = async () => { const property = videoModalProperty; if (!property?.id) return; for (let i = 0; i < videoInputs.length; i++) { const u = toTrimmedUrl(videoInputs[i]); if (!isValidVideoUrl(u)) { toast.error(`ลิงก์ช่องที่ ${i + 1} ไม่ถูกต้อง`); return; } } const cleaned = videoInputs.map((u) => toTrimmedUrl(u)).filter(Boolean).slice(0, MAX_SLOTS); try { setVideoSaving(true); await new Promise((r) => setTimeout(r, 250)); const store = readVideoStore(); const key = String(property.id); store[key] = buildItemsFromUrls(cleaned); writeVideoStore(store); setVideoSummary((prev) => ({ ...(prev || {}), [property.id]: { count: cleaned.length, hasVideo: cleaned.length > 0 } })); toast.success(cleaned.length ? "บันทึกวิดีโอเรียบร้อย" : "ลบวิดีโอออกเรียบร้อย"); closeVideoModal(); } catch (e) { console.error(e); toast.error("บันทึกวิดีโอไม่สำเร็จ"); } finally { setVideoSaving(false); } };

  return (
    <>
      {/* ===== Modal Video (คงเดิม) ===== */}
      {videoModalOpen && (
        <div role="dialog" onMouseDown={(e) => { if (e.target === e.currentTarget) closeVideoModal(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "min(720px, 100%)", background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <div className="h6 mb-0">วิดีโอประกาศ</div>
              <button type="button" className="btn btn-light" onClick={closeVideoModal} disabled={videoSaving}><span className="fas fa-times" /></button>
            </div>
            <div className="px-4 py-4">
              <div className="row">
                {videoInputs.map((val, idx) => (
                  <div className="col-12 mb-2" key={idx}><label className="form-label fw-bold">URL {idx + 1}</label><input className="form-control" value={val} onChange={(e) => setVideoAt(idx, e.target.value)} disabled={videoSaving} /></div>
                ))}
              </div>
              <div className="d-flex gap-2 justify-content-end mt-3">
                <button type="button" className="ud-btn btn-white2" onClick={closeVideoModal}>ยกเลิก</button>
                <button type="button" className="ud-btn btn-thme" onClick={saveVideoUrlsFrontOnly}>{videoSaving ? "บันทึก..." : "บันทึก"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ตารางแสดงผล */}
      <div className="table-responsive">
        <table className="table table-borderless table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" className="py-3 ps-4" style={{ width: "45%" }}>รายการบริการ</th>
              <th scope="col" className="py-3 text-center" style={{ width: "25%" }}>สถานะ (เปลี่ยนได้)</th>
              <th scope="col" className="py-3 text-center" style={{ width: "15%" }}>ยอดเข้าชม</th>
              <th scope="col" className="py-3 text-end pe-4" style={{ width: "15%" }}>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {loading ? <><SkeletonRow /><SkeletonRow /></> : !hasData ? (
              <tr><td colSpan={4} className="text-center py-5 text-muted">ยังไม่มีข้อมูล</td></tr>
            ) : (
              properties.map((property) => {
                const count = videoSummary?.[property.id]?.count ?? 0;
                const busy = rowBusy(property.id);
                const isStatusLoading = statusUpdatingId === property.id;

                return (
                  <tr key={property.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <th scope="row" className="py-3 ps-4 align-middle">
                      <div className="d-flex align-items-center">
                        <div className="position-relative" style={{ width: 110, height: 80, flexShrink: 0 }}>
                          <Image fill className="rounded-3" src={property.image || "/images/listings/list-1.jpg"} alt="prop" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="ms-3">
                          <Link href={`/service/${property.id}`} className="h6 mb-1 text-dark text-decoration-none hover-primary">{property.title}</Link>
                          <p className="text-muted mb-0 fz13">{property.location || "-"}</p>
                        </div>
                      </div>
                    </th>

                    {/* ✅🔥 จุดสำคัญ: Dropdown เปลี่ยนสถานะในตาราง */}
                    <td className="align-middle text-center">
                      <div className="dropdown d-inline-block">
                        <button
                          className={`btn btn-sm dropdown-toggle ${getStatusClass(property.status)} border-0 shadow-sm`}
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          disabled={busy}
                          style={{
                            minWidth: "140px",
                            borderRadius: "30px",
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                        >
                          {isStatusLoading ? (
                            <><i className="fas fa-spinner fa-spin me-2"></i> กำลังเปลี่ยน...</>
                          ) : (
                            getStatusLabel(property.status)
                          )}
                        </button>

                        <ul className="dropdown-menu border-0 shadow-lg p-2" style={{ borderRadius: "12px", minWidth: "180px" }}>
                          {STATUS_OPTIONS.map((opt) => (
                            <li key={opt.value}>
                              <button
                                className={`dropdown-item py-2 px-3 rounded-2 d-flex align-items-center justify-content-between mb-1 ${property.status === opt.value ? 'bg-light text-primary fw-bold' : ''}`}
                                onClick={() => handleStatusChange(property.id, opt.value)}
                              >
                                {opt.label}
                                {property.status === opt.value && <i className="fas fa-check"></i>}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>

                    <td className="align-middle text-center"><div className="text-muted"><i className="far fa-eye me-1"></i> {property.views ?? 0}</div></td>

                    <td className="align-middle text-end pe-4">
                      <div className="dropdown">
                        <button className="btn btn-light rounded-circle shadow-sm" style={{ width: 36, height: 36 }} data-bs-toggle="dropdown"><i className="fas fa-ellipsis-v" /></button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg" style={{ borderRadius: 12 }}>
                          <li><button className="dropdown-item py-2" onClick={() => handleEdit(property.id)}><i className="fas fa-pen text-primary w-20 text-center me-2" /> แก้ไข</button></li>
                          <li><button className="dropdown-item py-2 text-danger" onClick={() => handleDelete(property.id)}><i className="fas fa-trash-alt w-20 text-center me-2" /> ลบ</button></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Construction;