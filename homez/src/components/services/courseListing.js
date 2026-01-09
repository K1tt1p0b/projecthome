"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { allCourses as mockData } from "@/components/services/CourseLanding";
import { toast } from "react-toastify";

const getStatusStyle = (status) => {
  switch (status) {
    case "รอตรวจสอบ":
      return "pending-style style1";
    case "เผยแพร่แล้ว":
    case "active":
      return "pending-style style2";
    case "กำลังดำเนินการ":
      return "pending-style style3";
    default:
      return "";
  }
};

const BOOST_URL = (id) => `/dashboard-boost-course/${id}`;
const VIDEO_URL = (id) => `/dashboard-video-gallery?courseId=${id}`;
const VIDEO_STORE_KEY = "landx_course_videos_v1";
const MAX_SLOTS = 4;

const toUrlText = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.url || v.src || v.link || "";
  return String(v);
};
const toTrimmedUrl = (v) => String(toUrlText(v) || "").trim();

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
  const u = toTrimmedUrl(url);
  if (u.includes("tiktok.com/")) return "tiktok";
  return "youtube";
}

function isValidVideoUrl(url) {
  const u = toTrimmedUrl(url);
  if (!u) return true;

  const isYoutube =
    u.includes("youtube.com/watch") ||
    u.includes("youtu.be/") ||
    u.includes("youtube.com/shorts/");
  const isTiktok = u.includes("tiktok.com/");
  return isYoutube || isTiktok;
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeStoreValueToUrls(v) {
  if (!v) return [];
  if (Array.isArray(v)) {
    if (v.length && typeof v[0] === "object") {
      return v.map((x) => toTrimmedUrl(x?.url || x?.src || x?.link)).filter(Boolean);
    }
    return v.map((x) => toTrimmedUrl(x)).filter(Boolean);
  }
  if (Array.isArray(v?.urls)) {
    return v.urls.map((x) => toTrimmedUrl(x)).filter(Boolean);
  }
  return [];
}

function buildItemsFromUrls(urls) {
  const now = new Date().toISOString();
  return (urls || [])
    .map((u) => toTrimmedUrl(u))
    .filter(Boolean)
    .slice(0, MAX_SLOTS)
    .map((url) => ({
      id: uid(),
      url,
      provider: detectProvider(url),
      createdAt: now,
    }));
}

// ===== Skeleton Row =====
const SkeletonRow = () => (
  <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
    <th scope="row" className="py-4 ps-4">
      <div className="d-flex align-items-center">
        <div
          style={{
            width: 110,
            height: 80,
            borderRadius: 12,
            background: "#eee",
            flexShrink: 0,
          }}
        />
        <div className="ms-3 w-100">
          <div style={{ width: "60%", height: 16, background: "#eee", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ width: "40%", height: 14, background: "#eee", borderRadius: 6 }} />
        </div>
      </div>
    </th>
    <td className="align-middle text-center">
      <div style={{ width: 100, height: 28, background: "#eee", borderRadius: 14, margin: "0 auto" }} />
    </td>
    <td className="align-middle text-center">
      <div style={{ width: 60, height: 16, background: "#eee", borderRadius: 6, margin: "0 auto" }} />
    </td>
    <td className="align-middle text-end pe-4">
      <div className="d-flex align-items-center justify-content-end gap-2">
        <div style={{ width: 32, height: 32, background: "#eee", borderRadius: 8 }} />
      </div>
    </td>
  </tr>
);

const CourseDataTable = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  // row loading states
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [boostingId, setBoostingId] = useState(null);

  const [videoSummary, setVideoSummary] = useState({});

  // ===== modal states =====
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalCourse, setVideoModalCourse] = useState(null);
  const [videoInputs, setVideoInputs] = useState(Array(MAX_SLOTS).fill(""));
  const [videoSaving, setVideoSaving] = useState(false);

  const hasData = useMemo(() => courses?.length > 0, [courses]);

  const refreshVideoSummaryFromLocal = (ids) => {
    const store = readVideoStore();
    const next = {};
    (ids || []).forEach((id) => {
      const list = store?.[String(id)] ?? [];
      const urls = normalizeStoreValueToUrls(list);
      const cnt = Math.min(MAX_SLOTS, urls.length);
      next[id] = { count: cnt, hasVideo: cnt > 0 };
    });
    setVideoSummary(next);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 350));
      const list = Array.isArray(mockData) ? mockData : [];
      setCourses(list);
      refreshVideoSummaryFromLocal(list.map((p) => p.id));
    } catch (e) {
      console.error(e);
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== VIDEO_STORE_KEY) return;
      refreshVideoSummaryFromLocal(courses.map((p) => p.id));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);

  const rowBusy = (id) =>
    editingId === id ||
    deletingId === id ||
    boostingId === id ||
    (videoSaving && videoModalCourse?.id === id);

  const handleEdit = async (id) => {
    try {
      if (deletingId === id) return;
      setEditingId(id);
      await new Promise((r) => setTimeout(r, 250));
      router.push(`/add-course?id=${id}`);
    } catch (e) {
      console.error(e);
      toast.error("ไปหน้าแก้ไขไม่สำเร็จ");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (editingId === id) return;
    const ok = window.confirm("ยืนยันการลบคอร์สเรียนนี้ใช่ไหม?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await new Promise((r) => setTimeout(r, 400));

      setCourses((prev) => prev.filter((p) => p.id !== id));

      setVideoSummary((prev) => {
        const next = { ...(prev || {}) };
        delete next[id];
        return next;
      });

      toast.success("ลบสำเร็จ");
    } catch (e) {
      console.error(e);
      toast.error("ลบไม่สำเร็จ");
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

  const openVideoModal = (course) => {
    const id = course?.id;
    if (!id) return;

    const store = readVideoStore();
    const existing = store?.[String(id)];
    const urls = normalizeStoreValueToUrls(existing);

    const nextInputs = Array(MAX_SLOTS).fill("");
    urls.slice(0, MAX_SLOTS).forEach((u, i) => (nextInputs[i] = toTrimmedUrl(u)));

    setVideoModalCourse(course);
    setVideoInputs(nextInputs);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    if (videoSaving) return;
    setVideoModalOpen(false);
    setVideoModalCourse(null);
    setVideoInputs(Array(MAX_SLOTS).fill(""));
  };

  const setVideoAt = (idx, value) => {
    setVideoInputs((prev) => {
      const next = [...prev];
      next[idx] = String(value ?? "");
      return next;
    });
  };

  const saveVideoUrlsFrontOnly = async () => {
    const course = videoModalCourse;
    if (!course?.id) return;

    for (let i = 0; i < videoInputs.length; i++) {
      const u = toTrimmedUrl(videoInputs[i]);
      if (!isValidVideoUrl(u)) {
        toast.error(`ลิงก์ช่องที่ ${i + 1} ไม่ถูกต้อง (รองรับ YouTube / TikTok)`);
        return;
      }
    }

    const cleaned = videoInputs
      .map((u) => toTrimmedUrl(u))
      .filter(Boolean)
      .slice(0, MAX_SLOTS);

    try {
      setVideoSaving(true);
      await new Promise((r) => setTimeout(r, 250));

      const store = readVideoStore();
      const key = String(course.id);

      const all = Object.entries(store || {}).flatMap(([pid, arr]) => {
        const urls = normalizeStoreValueToUrls(arr);
        return urls.map((u) => ({ pid, url: u }));
      });

      for (const u of cleaned) {
        const used = all.find((x) => x.url === u && x.pid !== key);
        if (used) {
          toast.error("ลิงก์นี้ถูกผูกกับคอร์สอื่นอยู่แล้ว");
          return;
        }
      }

      store[key] = buildItemsFromUrls(cleaned);
      writeVideoStore(store);

      setVideoSummary((prev) => ({
        ...(prev || {}),
        [course.id]: { count: cleaned.length, hasVideo: cleaned.length > 0 },
      }));

      toast.success(cleaned.length ? "บันทึกวิดีโอเรียบร้อย" : "ลบวิดีโอออกเรียบร้อย");
      closeVideoModal();
    } catch (e) {
      console.error(e);
      toast.error("บันทึกวิดีโอไม่สำเร็จ");
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
              width: "min(720px, 100%)",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}
          >
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <div>
                <div className="h6 mb-0">วิดีโอคอร์ส (สูงสุด {MAX_SLOTS} อัน)</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  คอร์ส: <b>{videoModalCourse?.title}</b>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-light"
                onClick={closeVideoModal}
                disabled={videoSaving}
                aria-label="close"
              >
                <span className="fas fa-times" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div style={{ fontSize: 13, opacity: 0.8 }} className="mb-3">
                รองรับ YouTube / TikTok (เว้นว่างได้)
              </div>

              <div className="row">
                {videoInputs.map((val, idx) => {
                  const textVal = String(val ?? "");
                  const trimmed = toTrimmedUrl(textVal);

                  return (
                    <div className="col-12" key={idx}>
                      <label className="form-label" style={{ fontWeight: 600 }}>
                        URL วิดีโอ {idx + 1}
                      </label>

                      <input
                        className="form-control mb-2"
                        value={textVal}
                        onChange={(e) => setVideoAt(idx, e.target.value)}
                        placeholder="https://youtu.be/... หรือ https://www.tiktok.com/@.../video/..."
                        disabled={videoSaving}
                      />

                      {!!trimmed && !isValidVideoUrl(trimmed) && (
                        <div style={{ color: "#ef4444", fontSize: 12 }} className="mb-2">
                          ลิงก์ไม่ถูกต้อง (รองรับ YouTube / TikTok)
                        </div>
                      )}
                    </div>
                  );
                })}
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
                  onClick={saveVideoUrlsFrontOnly}
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
                      <span className="fas fa-save me-2" />
                      บันทึก
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Table Design */}
      <div className="table-responsive">
        <table className="table table-borderless table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" className="py-3 ps-4" style={{ width: "50%" }}>คอร์สเรียน</th>
              <th scope="col" className="py-3 text-center" style={{ width: "20%" }}>สถานะ</th>
              <th scope="col" className="py-3 text-center" style={{ width: "15%" }}>ยอดเข้าชม</th>
              <th scope="col" className="py-3 text-end pe-4" style={{ width: "15%" }}>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : !hasData ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-muted">
                  <div className="mb-2"><i className="fas fa-folder-open fz30"></i></div>
                  ยังไม่มีข้อมูลคอร์สเรียน
                </td>
              </tr>
            ) : (
              courses.map((course) => {
                const count = videoSummary?.[course.id]?.count ?? 0;
                const hasVideo = count > 0;
                const busy = rowBusy(course.id);

                return (
                  <tr key={course.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <th scope="row" className="py-3 ps-4 align-middle">
                      <div className="d-flex align-items-center">
                        <div className="position-relative" style={{ width: 110, height: 80, flexShrink: 0 }}>
                          <Image
                            fill
                            className="rounded-3"
                            src={course.image || course.imageSrc || "/images/listings/list-1.jpg"}
                            alt="course"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>

                        <div className="ms-3">
                          <div className="h6 mb-1 d-flex align-items-center gap-2">
                            <Link 
                                href={`/course/${course.id}`} 
                                className="text-dark text-decoration-none hover-primary"
                                style={{ transition: "0.2s" }}
                            >
                                {course.title}
                            </Link>

                            {hasVideo && (
                              <>
                                <button
                                  type="button"
                                  className="d-flex align-items-center justify-content-center bg-light rounded-circle border-0"
                                  disabled={busy}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    opacity: busy ? 0.5 : 1,
                                    cursor: busy ? "not-allowed" : "pointer",
                                    color: "#eb6753"
                                  }}
                                  data-tooltip-id={`video-${course.id}`}
                                  onClick={() => handleVideoPage(course.id)}
                                >
                                  <span className="fas fa-video fz10" />
                                </button>
                                <ReactTooltip id={`video-${course.id}`} place="top" content={`วิดีโอ (${count})`} />
                              </>
                            )}
                          </div>

                          <p className="text-muted mb-0 fz13">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {course?.location?.province || course?.location || "Online"}
                          </p>
                        </div>
                      </div>
                    </th>

                    <td className="align-middle text-center">
                      <span className={getStatusStyle(course.status || "active")}>
                        {course.status || "Active"}
                      </span>
                    </td>

                    <td className="align-middle text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1 text-muted">
                            <i className="far fa-eye"></i>
                            {course.views ?? 0}
                        </div>
                    </td>

                    <td className="align-middle text-end pe-4">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-light rounded-circle shadow-sm"
                          disabled={busy}
                          style={{
                            width: 36,
                            height: 36,
                            padding: 0,
                            opacity: busy ? 0.5 : 1,
                          }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-ellipsis-v text-dark" />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg" style={{ borderRadius: 12, overflow: "hidden" }}>
                          <li>
                            <button
                              type="button"
                              className="dropdown-item py-2 d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => handleEdit(course.id)}
                            >
                              <i className="fas fa-pen text-primary w-20 text-center" /> แก้ไข
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item py-2 d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => handleBoost(course.id)}
                            >
                              <i className="fas fa-bolt text-warning w-20 text-center" /> ดันประกาศ
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item py-2 d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => openVideoModal(course)}
                            >
                              <i className="fas fa-video text-info w-20 text-center" /> {hasVideo ? "แก้ไขวิดีโอ" : "เพิ่มวิดีโอ"}
                            </button>
                          </li>

                          {/* ✅ เพิ่มปุ่ม จัดการวิดีโอ กลับมา */}
                          <li>
                            <button
                              type="button"
                              className="dropdown-item py-2 d-flex align-items-center gap-2"
                              disabled={busy}
                              onClick={() => handleVideoPage(course.id)}
                            >
                              <i className="fas fa-folder-open text-success w-20 text-center" /> จัดการวิดีโอ
                            </button>
                          </li>

                          <li><hr className="dropdown-divider my-1" /></li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger"
                              disabled={busy}
                              onClick={() => handleDelete(course.id)}
                            >
                              <i className="fas fa-trash-alt w-20 text-center" /> ลบ
                            </button>
                          </li>
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

export default CourseDataTable;