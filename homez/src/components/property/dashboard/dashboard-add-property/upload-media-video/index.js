"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

// ✅ key เดียวกับหน้า dashboard-my-properties
const VIDEO_STORE_KEY = "landx_property_videos_v1";
const MAX_SLOTS = 4;

/** ✅ แปลงค่าใดๆ -> url string (รองรับ string | object {url/src/link} ) */
const toUrlText = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.url || v.src || v.link || "";
  return String(v);
};

const toTrimmedUrl = (v) => String(toUrlText(v) || "").trim();

// ---------- helpers (ตรงกับที่ my-properties ใช้) ----------
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

function detectProvider(anyUrl) {
  const u = toTrimmedUrl(anyUrl);
  if (u.includes("tiktok.com/")) return "tiktok";
  return "youtube";
}

// ตอนนี้เอาเหมือน my-properties: เฉพาะ YouTube/TikTok
function isValidVideoUrl(url) {
  const u = toTrimmedUrl(url);
  if (!u) return true; // ช่องว่างได้

  const isYoutube =
    u.includes("youtube.com/watch") ||
    u.includes("youtu.be/") ||
    u.includes("youtube.com/shorts/");
  const isTiktok = u.includes("tiktok.com/");
  return isYoutube || isTiktok;
}

// อ่าน urls จาก store รองรับ 2 แบบ:
// 1) store[id] = [{url,...}]  (แบบใหม่)
// 2) store[id] = ["url1","url2"] (แบบเก่า)
// 3) store[id] = { urls: [...] }
function getUrlsFromStoreValue(v) {
  if (!v) return [];

  if (Array.isArray(v)) {
    // array of objects
    if (v.length && typeof v[0] === "object") {
      return v
        .map((x) => toTrimmedUrl(x?.url || x?.src || x?.link))
        .filter(Boolean);
    }
    // array of strings
    return v.map((x) => toTrimmedUrl(x)).filter(Boolean);
  }

  if (Array.isArray(v?.urls)) {
    return v.urls.map((x) => toTrimmedUrl(x)).filter(Boolean);
  }

  return [];
}

// เขียนกลับให้เป็น shape แบบ my-properties (array of objects)
function toStoreItems(urls) {
  const now = new Date().toISOString();
  return (urls || [])
    .map((u) => toTrimmedUrl(u))
    .filter(Boolean)
    .map((u) => ({
      id: uid(),
      url: u,
      provider: detectProvider(u),
      createdAt: now,
    }));
}

export default function UploadMediaVideoStep({
  initialValue,
  onBack,
  onNext,
  onSaveDraft,
}) {
  const searchParams = useSearchParams();

  // ✅ ถ้าเป็นหน้าแก้ไข จะมี propertyId ใน query หรือ initialValue
  const propertyIdFromQuery =
    searchParams?.get("propertyId") || searchParams?.get("id");
  const propertyIdFromInitial = initialValue?.id || initialValue?._id;

  const propertyId = useMemo(() => {
    return propertyIdFromQuery || propertyIdFromInitial || "";
  }, [propertyIdFromQuery, propertyIdFromInitial]);

  const [urls, setUrls] = useState(Array(MAX_SLOTS).fill(""));
  const [saving, setSaving] = useState(false);

  // ✅ 1) ตั้งค่าจาก state ที่ parent ส่งมา (สำคัญสุดสำหรับ “เพิ่มใหม่”)
  useEffect(() => {
    const incoming = Array.isArray(initialValue?.videoUrls)
      ? initialValue.videoUrls
      : [];

    if (!incoming.length) return;

    const next = Array(MAX_SLOTS).fill("");
    incoming.slice(0, MAX_SLOTS).forEach((v, i) => {
      // ✅ แปลง object -> string ตั้งแต่ตอน set state
      next[i] = toTrimmedUrl(v);
    });

    setUrls(next);
  }, [initialValue?.videoUrls]);

  // ✅ 2) preload เฉพาะตอน “แก้ไข” (มี propertyId จริง)
  useEffect(() => {
    if (!propertyId) return; // เพิ่มใหม่ → ไม่ดึง

    const store = readVideoStore();
    const existing = store?.[String(propertyId)];
    const list = getUrlsFromStoreValue(existing);

    if (!list.length) return;

    const next = Array(MAX_SLOTS).fill("");
    list.slice(0, MAX_SLOTS).forEach((v, i) => (next[i] = toTrimmedUrl(v)));
    setUrls(next);
  }, [propertyId]);

  const setUrlAt = (idx, value) => {
    // ✅ input ส่ง string มาอยู่แล้ว แต่กันไว้ให้แน่น
    setUrls((prev) => {
      const next = [...prev];
      next[idx] = String(value ?? "");
      return next;
    });
  };

  const cleanedUrls = useMemo(() => {
    return urls.map((u) => toTrimmedUrl(u)).filter(Boolean);
  }, [urls]);

  const validateAll = () => {
    for (let i = 0; i < urls.length; i++) {
      const u = toTrimmedUrl(urls[i]); // ✅ ไม่ trim ใส่ object แล้ว
      if (!isValidVideoUrl(u)) {
        toast.error(`ลิงก์ช่องที่ ${i + 1} ไม่ถูกต้อง (รองรับ YouTube / TikTok)`);
        return false;
      }
    }
    return true;
  };

  // ✅ ถ้าเป็นแก้ไข (มี propertyId) → เขียนกลับ localStorage ให้ my-properties ใช้ต่อ
  const persistToLocalStoreIfEditing = () => {
    if (!propertyId) return; // เพิ่มใหม่ยังไม่มี id → ยังไม่เขียน

    const store = readVideoStore();
    const key = String(propertyId);

    // เขียนเป็น shape ใหม่ (array of objects)
    store[key] = toStoreItems(cleanedUrls);
    writeVideoStore(store);
  };

  const handleNext = async () => {
    if (!validateAll()) return;

    setSaving(true);
    try {
      // ✅ เฉพาะแก้ไข: sync ลง localStorage
      persistToLocalStoreIfEditing();

      // ✅ ส่งกลับไป Step 6 ใช้แสดงผล
      onNext?.({ urls: cleanedUrls });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    if (!validateAll()) return;
    onSaveDraft?.({ urls: cleanedUrls });
  };

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <h4 className="title fz17 mb10">วิดีโอทรัพย์สิน</h4>
      <p className="mb30" style={{ color: "#6b7280" }}>
        ใส่ลิงก์วิดีโอได้สูงสุด {MAX_SLOTS} อัน (เว้นว่างได้) — รองรับ YouTube/TikTok
      </p>

      <form
        className="form-style1"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <div className="row">
          {urls.map((val, idx) => {
            const textVal = String(val ?? ""); // ✅ input value ต้องเป็น string เสมอ
            const trimmed = toTrimmedUrl(textVal);

            return (
              <div className="col-12" key={idx}>
                <div className="my_profile_input form-group mb20">
                  <label className="mb-2">URL วิดีโอ {idx + 1}</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://youtu.be/... หรือ https://www.tiktok.com/..."
                    value={textVal}
                    onChange={(e) => setUrlAt(idx, e.target.value)}
                    disabled={saving}
                  />

                  {!!trimmed && !isValidVideoUrl(trimmed) && (
                    <small style={{ color: "#ef4444" }}>
                      ลิงก์ไม่ถูกต้อง (รองรับ YouTube / TikTok)
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="row mt20">
          <div className="col-12 d-flex justify-content-between">
            {onBack ? (
              <button
                type="button"
                className="ud-btn btn-light"
                onClick={onBack}
                disabled={saving}
              >
                ย้อนกลับ
              </button>
            ) : (
              <span />
            )}

            <div className="d-flex gap-2">
              <button
                type="button"
                className="ud-btn btn-light"
                onClick={handleSaveDraft}
                disabled={saving}
              >
                บันทึกร่าง
              </button>
              <button type="submit" className="ud-btn btn-thm" disabled={saving}>
                {saving ? "กำลังบันทึก..." : "ถัดไป"}
              </button>
            </div>
          </div>
        </div>

        {/* debug (ลบได้) */}
        {!!propertyId && (
          <div className="row mt20">
            <div className="col-12">
              <small style={{ color: "#9ca3af" }}>propertyId: {propertyId}</small>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
