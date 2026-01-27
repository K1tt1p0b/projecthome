// PropertyDataTable.js
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { propertyData as mockData } from "@/data/propertyData";
import { toast } from "react-toastify";

// ✅ boost real store
import {
  LS_AUTO,
  LS_MANUAL,
  AUTO_FALLBACK,
} from "../dashboard-boost-property/boost/config/boostStorage";
import {
  PACKAGES,
  getPackage,
} from "../dashboard-boost-property/boost/config/boostPackages";
import {
  readLS,
  writeLS,
} from "../dashboard-boost-property/boost/utils/boostUtils";

// =====================
// ✅ จุดกลางแพ็กเกจผู้ใช้ (mock)
const USER_PACKAGE_LS_KEY = "landx_user_package_key_v1";
const DEFAULT_PACKAGE_KEY = "pro";
// =====================

// ✅ ไปหน้า boost confirm
const BOOST_URL = (id, mode) =>
  `/dashboard-boost-property?propertyId=${id}&step=2${
    mode ? `&mode=${mode}` : ""
  }`;

const VIDEO_URL = (id) => `/dashboard-video-gallery?propertyId=${id}`;

// =====================
// LocalStorage: Video
// =====================
const VIDEO_STORE_KEY = "landx_property_videos_v1";
const MAX_SLOTS = 4;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// =====================
// Video helpers
// =====================
const toUrlText = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.url || v.src || v.link || "";
  return String(v);
};
const toTrimmedUrl = (v) => String(toUrlText(v) || "").trim();

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
      return v
        .map((x) => toTrimmedUrl(x?.url || x?.src || x?.link))
        .filter(Boolean);
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

// =====================
// ✅ Package helpers (source กลาง)
// =====================
function isValidPackageKey(key) {
  const k = String(key || "").trim();
  return !!PACKAGES?.[k];
}

function readUserPackageKey() {
  if (typeof window === "undefined") return DEFAULT_PACKAGE_KEY;

  const raw = window.localStorage.getItem(USER_PACKAGE_LS_KEY);
  if (isValidPackageKey(raw)) return raw;

  const autoRaw = readLS(LS_AUTO, AUTO_FALLBACK);
  const fromAuto = autoRaw?.packageKey;
  if (isValidPackageKey(fromAuto)) return fromAuto;

  return DEFAULT_PACKAGE_KEY;
}

// =====================
// ✅ Auto store helpers (single active + single queue + cancelAfterCooldown)
// =====================
function normalizeAutoStore(raw, fallbackPkgKey) {
  const s = raw && typeof raw === "object" ? raw : {};

  const pkgKey =
    typeof s.packageKey === "string" && s.packageKey
      ? s.packageKey
      : fallbackPkgKey;

  // ---- legacy (เก่า) ----
  const oldItems = s.items && typeof s.items === "object" ? s.items : {};
  const oldOrder = Array.isArray(s.order)
    ? s.order.map(String).filter(Boolean)
    : [];
  const oldQueue = Array.isArray(s.queue)
    ? s.queue.map(String).filter(Boolean)
    : [];

  const legacyActiveId =
    typeof s.activePropertyId === "string" && s.activePropertyId
      ? s.activePropertyId
      : oldOrder.find((id) => !!oldItems?.[id]) ||
        Object.keys(oldItems)[0] ||
        "";

  const legacyQueuedId =
    typeof s.queuedPropertyId === "string" && s.queuedPropertyId
      ? s.queuedPropertyId
      : oldQueue[0] || "";

  const legacyActiveItem = legacyActiveId ? oldItems?.[legacyActiveId] : null;

  const cooldownEndAt =
    typeof s.cooldownEndAt === "number" && s.cooldownEndAt
      ? s.cooldownEndAt
      : typeof legacyActiveItem?.nextRunAt === "number"
      ? legacyActiveItem.nextRunAt
      : 0;

  const activeStartedAt =
    typeof s.activeStartedAt === "number" && s.activeStartedAt
      ? s.activeStartedAt
      : typeof legacyActiveItem?.enabledAt === "number"
      ? legacyActiveItem.enabledAt
      : 0;

  return {
    enabled: !!s.enabled,
    packageKey: isValidPackageKey(pkgKey) ? pkgKey : fallbackPkgKey,

    activePropertyId: String(legacyActiveId || ""),
    queuedPropertyId: String(legacyQueuedId || ""),

    activeStartedAt: Number(activeStartedAt || 0),
    cooldownEndAt: Number(cooldownEndAt || 0),

    cancelAfterCooldown: !!s.cancelAfterCooldown,
  };
}

// migrate auto store เมื่อเปลี่ยนแพ็ก (sync packageKey อย่างเดียว)
function migrateAutoStoreToPackage(newPkgKey) {
  const raw = readLS(LS_AUTO, AUTO_FALLBACK);
  const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw }, newPkgKey);

  if (store.packageKey === newPkgKey) return;

  const next = { ...store, packageKey: newPkgKey };
  writeLS(LS_AUTO, next);
}

function formatThaiDateTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String((d.getFullYear() + 543) % 100).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${min} น.`;
}

function formatHMS(totalSec) {
  const s = Math.max(0, Math.floor(totalSec || 0));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatThaiTimeOnly(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

// ✅ NEW: block rule — ต้องยกเลิก Active ก่อน + ต้องยกเลิก Queue ก่อน (ถ้ามีคิวอยู่แล้ว)
function getAutoBlockInfo(userPkgKey) {
  const raw = readLS(LS_AUTO, AUTO_FALLBACK);
  const s = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw }, userPkgKey);

  const activeId = String(s.activePropertyId || "");
  const queuedId = String(s.queuedPropertyId || "");

  const blockedNeedCancelActive = !!activeId && !s.cancelAfterCooldown;
  const blockedNeedCancelQueue = !!queuedId;

  return {
    activeId,
    queuedId,
    blockedNeedCancelActive,
    blockedNeedCancelQueue,
  };
}

// =====================
// ✅ Status badge (ของคุณ) แต่ใช้ร่วมกับโค้ดใหม่
// =====================
const baseStatusStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 20px",
  borderRadius: "30px",
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "1",
  textAlign: "center",
  minWidth: "120px",
  whiteSpace: "nowrap",
};

const getStatusMeta = (status) => {
  const s = String(status || "");
  switch (s) {
    case "เผยแพร่แล้ว":
    case "published":
      return { label: "เผยแพร่แล้ว", bg: "#E3F2FD", color: "#2196F3" };
    case "ขายแล้ว":
    case "sold":
      return { label: "ขายแล้ว", bg: "#FFEBEE", color: "#F44336" };
    case "รอตรวจสอบ":
    case "pending":
      return { label: "รอตรวจสอบ", bg: "#FFF3E0", color: "#FF9800" };
    case "กำลังดำเนินการ":
      return { label: "กำลังดำเนินการ", bg: "#E8EAF6", color: "#3F51B5" };
    case "ไม่อนุมัติ":
      return { label: "ไม่อนุมัติ", bg: "#FFEBEE", color: "#D32F2F" };
    default:
      return { label: s || "-", bg: "#F5F5F5", color: "#616161" };
  }
};

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
          <div
            style={{
              width: "60%",
              height: 14,
              background: "#eee",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              width: "30%",
              height: 12,
              background: "#eee",
              borderRadius: 6,
              marginTop: 10,
            }}
          />
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
      <div style={{ width: 120, height: 12, background: "#eee", borderRadius: 6 }} />
    </td>
  </tr>
);

const PropertyDataTable = () => {
  const router = useRouter();

  const [userPkgKey, setUserPkgKey] = useState(DEFAULT_PACKAGE_KEY);

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [boostingId, setBoostingId] = useState(null);

  const [videoSummary, setVideoSummary] = useState({});
  const [tick, setTick] = useState(0);

  // ===== modal (video) =====
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalProperty, setVideoModalProperty] = useState(null);
  const [videoInputs, setVideoInputs] = useState(Array(MAX_SLOTS).fill(""));
  const [videoSaving, setVideoSaving] = useState(false);

  // ===== modal (boost picker) =====
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [boostModalProperty, setBoostModalProperty] = useState(null);

  const hasData = useMemo(() => properties?.length > 0, [properties]);

  useEffect(() => {
    const k = readUserPackageKey();
    setUserPkgKey(k);
    migrateAutoStoreToPackage(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pkg = useMemo(() => getPackage(userPkgKey), [userPkgKey]);

  // ✅ interval ของแพ็ก (ใช้ทั้ง manual/auto ใน mock นี้)
  const MANUAL_COOLDOWN_MS = useMemo(
    () => Number(pkg.intervalMs || 0) || 0,
    [pkg]
  );
  const AUTO_INTERVAL_MS = useMemo(
    () => Number(pkg.intervalMs || 0) || 0,
    [pkg]
  );

  const refreshVideoSummaryFromLocal = (propertyIds) => {
    const store = readVideoStore();
    const next = {};
    (propertyIds || []).forEach((id) => {
      const list = store?.[String(id)] ?? [];
      const urls = normalizeStoreValueToUrls(list);
      const cnt = Math.min(MAX_SLOTS, urls.length);
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

      const ids = list.map((p) => p.id);
      refreshVideoSummaryFromLocal(ids);
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

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === VIDEO_STORE_KEY)
        refreshVideoSummaryFromLocal(properties.map((p) => p.id));
      if (e.key === LS_AUTO || e.key === USER_PACKAGE_LS_KEY) {
        const k = readUserPackageKey();
        setUserPkgKey(k);
        migrateAutoStoreToPackage(k);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  const rowBusy = (id) =>
    editingId === id ||
    deletingId === id ||
    boostingId === id ||
    (videoSaving && videoModalProperty?.id === id);

  const handleUpdateStatus = (id, newStatus) => {
    const confirm = window.confirm(`ยืนยันการเปลี่ยนสถานะเป็น '${newStatus}'?`);
    if (confirm) {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      toast.success("อัปเดตสถานะเรียบร้อย!");
    }
  };

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

  const handleVideoPage = (id) => router.push(VIDEO_URL(id));

  // ===== modal video =====
  const openVideoModal = (property) => {
    const id = property?.id;
    if (!id) return;
    const store = readVideoStore();
    const existing = store?.[String(id)];
    const urls = normalizeStoreValueToUrls(existing);
    const nextInputs = Array(MAX_SLOTS).fill("");
    urls.slice(0, MAX_SLOTS).forEach((u, i) => (nextInputs[i] = toTrimmedUrl(u)));
    setVideoModalProperty(property);
    setVideoInputs(nextInputs);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    if (videoSaving) return;
    setVideoModalOpen(false);
    setVideoModalProperty(null);
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
    const property = videoModalProperty;
    if (!property?.id) return;

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
      const key = String(property.id);

      // ห้ามซ้ำข้ามโพส
      const all = Object.entries(store || {}).flatMap(([pid, arr]) => {
        const urls = normalizeStoreValueToUrls(arr);
        return urls.map((u) => ({ pid, url: u }));
      });

      for (const u of cleaned) {
        const used = all.find((x) => x.url === u && x.pid !== key);
        if (used) {
          toast.error("ลิงก์นี้ถูกผูกกับโพสอื่นอยู่แล้ว");
          return;
        }
      }

      store[key] = buildItemsFromUrls(cleaned);
      writeVideoStore(store);

      setVideoSummary((prev) => ({
        ...(prev || {}),
        [property.id]: { count: cleaned.length, hasVideo: cleaned.length > 0 },
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

  // =========================
  // ✅ Auto tick (simulate run)
  // =========================
  useEffect(() => {
    const raw = readLS(LS_AUTO, AUTO_FALLBACK);
    const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw }, userPkgKey);

    if (!store.enabled) return;
    if (!store.activePropertyId) return;
    if (!AUTO_INTERVAL_MS) return;

    const endAt = Number(store.cooldownEndAt || 0);
    if (!endAt) return;

    const now = Date.now();
    if (now < endAt) return;

    const next = { ...store };

    // ถ้ามีคิว -> สลับ active ไปคิว
    if (next.queuedPropertyId) {
      next.activePropertyId = next.queuedPropertyId;
      next.queuedPropertyId = "";
      next.cancelAfterCooldown = false;

      next.activeStartedAt = now;
      next.cooldownEndAt = now + AUTO_INTERVAL_MS;

      writeLS(LS_AUTO, next);
      return;
    }

    // ถ้าถูกกดยกเลิก -> ปิดหลังครบเวลา
    if (next.cancelAfterCooldown) {
      next.activePropertyId = "";
      next.queuedPropertyId = "";
      next.cancelAfterCooldown = false;

      next.activeStartedAt = 0;
      next.cooldownEndAt = 0;
      next.enabled = false;

      writeLS(LS_AUTO, next);
      return;
    }

    // ไม่มีคิวและไม่ยกเลิก -> รีสตาร์ทรอบ
    next.activeStartedAt = now;
    next.cooldownEndAt = now + AUTO_INTERVAL_MS;

    writeLS(LS_AUTO, next);
  }, [tick, userPkgKey, AUTO_INTERVAL_MS]);

  // =========================
  // ✅ Boost status per property
  // =========================
  const getBoostUi = (propertyId) => {
    void tick;

    const sid = String(propertyId);

    // ---- manual cooldown ----
    const manualStore = readLS(LS_MANUAL, {});
    const manualLast = Number(manualStore?.[sid]?.lastBoostAt || 0);

    const manualNextAt = manualLast ? manualLast + MANUAL_COOLDOWN_MS : 0;
    const manualRemainSec = manualNextAt
      ? Math.max(0, Math.floor((manualNextAt - Date.now()) / 1000))
      : 0;
    const manualCooling = manualNextAt ? Date.now() < manualNextAt : false;

    // ---- auto status ----
    const autoRaw = readLS(LS_AUTO, AUTO_FALLBACK);
    const autoStore = normalizeAutoStore(
      { ...AUTO_FALLBACK, ...autoRaw },
      userPkgKey
    );

    const isAutoActive =
      !!autoStore.activePropertyId && String(autoStore.activePropertyId) === sid;
    const isAutoQueued =
      !!autoStore.queuedPropertyId && String(autoStore.queuedPropertyId) === sid;

    if (isAutoActive || isAutoQueued) {
      const nextAt = Number(autoStore.cooldownEndAt || 0);
      const nextTimeText = nextAt ? formatThaiTimeOnly(nextAt) : "-";

      return {
        has: true,
        mode: "auto",
        isAutoActive,
        isAutoQueued,
        queuePos: isAutoQueued ? 1 : 0,

        nextAt,
        nextTimeText,

        cancelAfterCooldown: !!autoStore.cancelAfterCooldown,
        lastAt: Number(autoStore.activeStartedAt || 0),

        manualCooling,
      };
    }

    if (manualLast) {
      return {
        has: true,
        mode: "manual",
        manualLast,
        manualCooling,
        manualRemainSec,
        nextAt: manualNextAt,
      };
    }

    return { has: false };
  };

  // ✅ เปิด modal เลือก manual/auto
  const openBoostPicker = (property) => {
    if (!property?.id) return;
    if (deletingId === property.id) return;

    const ui = getBoostUi(property.id);

    // ถ้าอยู่ auto อยู่แล้ว ไม่ต้องเปิด (ให้จัดการจากปุ่มยกเลิก/ยกเลิกคิว)
    if (ui?.has && ui?.mode === "auto") return;

    // ถ้า manual ยังติด cooldown ก็ไม่ให้เปิด
    if (ui?.has && ui?.mode === "manual" && ui?.manualCooling) return;

    setBoostModalProperty(property);
    setBoostModalOpen(true);
  };

  const closeBoostPicker = () => {
    if (boostingId) return;
    setBoostModalOpen(false);
    setBoostModalProperty(null);
  };

  const goManualConfirm = async () => {
    const id = boostModalProperty?.id;
    if (!id) return;

    try {
      setBoostingId(id);
      await new Promise((r) => setTimeout(r, 120));
      closeBoostPicker();
      router.push(BOOST_URL(id, "manual"));
    } catch (e) {
      console.error(e);
      toast.error("ไปหน้ายืนยันแมนนวลไม่สำเร็จ");
    } finally {
      setBoostingId(null);
    }
  };

  const goAutoConfirm = async () => {
    const id = boostModalProperty?.id;
    if (!id) return;

    const info = getAutoBlockInfo(userPkgKey);

    // ✅ 1) ยังไม่กดยกเลิก Active -> ห้ามเลือกโพสอื่น
    if (info.blockedNeedCancelActive && String(info.activeId) !== String(id)) {
      toast.warn(`ต้องยกเลิกออโต้ของโพส #${info.activeId} ก่อน ถึงจะเลือกโพสอื่นได้`);
      return;
    }

    // ✅ 2) มีคิวอยู่แล้ว -> ห้าม replace ต้องไปยกเลิกคิวก่อน
    if (info.blockedNeedCancelQueue && String(info.queuedId) !== String(id)) {
      toast.warn(
        `ตอนนี้มีโพส #${info.queuedId} อยู่ในคิวแล้ว — ต้องยกเลิกคิวก่อน ถึงจะเลือกโพสอื่นได้`
      );
      return;
    }

    try {
      setBoostingId(id);
      await new Promise((r) => setTimeout(r, 120));
      closeBoostPicker();
      router.push(BOOST_URL(id, "auto"));
    } catch (e) {
      console.error(e);
      toast.error("ไปหน้ายืนยันออโต้ไม่สำเร็จ");
    } finally {
      setBoostingId(null);
    }
  };

  // ✅ ยกเลิกคิว (queuedPropertyId ตัวเดียว)
  const cancelAutoQueue = async (propertyId) => {
    if (!propertyId) return;
    const ok = window.confirm("ยืนยันยกเลิกคิวออโต้ของประกาศนี้?");
    if (!ok) return;

    try {
      setBoostingId(propertyId);
      await new Promise((r) => setTimeout(r, 150));

      const raw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw }, userPkgKey);

      if (String(store.queuedPropertyId || "") !== String(propertyId)) {
        toast.info("ประกาศนี้ไม่ได้อยู่ในคิวแล้ว");
        return;
      }

      const next = { ...store, queuedPropertyId: "" };
      writeLS(LS_AUTO, next);
      toast.success("ยกเลิกคิวเรียบร้อย");
    } catch (e) {
      console.error(e);
      toast.error("ยกเลิกคิวไม่สำเร็จ");
    } finally {
      setBoostingId(null);
    }
  };

  // ✅ ยกเลิกออโต้ (ยกเลิกแล้ว “ยังรอให้ cooldown หมด”)
  const cancelAutoActive = async (propertyId) => {
    if (!propertyId) return;

    const ok = window.confirm("ยืนยันยกเลิกออโต้? (จะหยุดหลังครบเวลา)");
    if (!ok) return;

    try {
      setBoostingId(propertyId);
      await new Promise((r) => setTimeout(r, 150));

      const raw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw }, userPkgKey);

      if (String(store.activePropertyId || "") !== String(propertyId)) {
        toast.info("ประกาศนี้ไม่ได้เป็น Active แล้ว");
        return;
      }

      const next = { ...store, cancelAfterCooldown: true };
      writeLS(LS_AUTO, next);
      toast.success("ยกเลิกแล้ว (จะหยุดหลังครบเวลา)");
    } catch (e) {
      console.error(e);
      toast.error("ยกเลิกออโต้ไม่สำเร็จ");
    } finally {
      setBoostingId(null);
    }
  };

  // ===== styles =====
  const boostBtnStyle = (disabled) => ({
    height: 34,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid #eb6753",
    background: disabled ? "#fff1ee" : "#eb6753",
    color: disabled ? "#9c2f21" : "#fff",
    fontSize: 13,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.75 : 1,
    whiteSpace: "nowrap",
    lineHeight: "34px",
  });

  const boostCountdownStyle = () => ({
    height: 34,
    minWidth: 180,
    maxWidth: 260,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid #f3b2a8",
    background: "#fff1ee",
    color: "#9c2f21",
    fontSize: 13,
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    whiteSpace: "nowrap",
  });

  const timeLineStyle = {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    lineHeight: "16px",
  };

  const modePillStyle = (mode) => ({
    marginTop: 6,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 22,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: `1px solid ${mode === "auto" ? "#dbeafe" : "#fee2e2"}`,
    background: mode === "auto" ? "#eff6ff" : "#fff1ee",
    color: mode === "auto" ? "#1d4ed8" : "#9c2f21",
    whiteSpace: "nowrap",
  });

  const cancelQueueBtnStyle = (disabled) => ({
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid #e5e5e5",
    background: "#fff",
    fontSize: 12,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    whiteSpace: "nowrap",
  });

  const cancelActiveBtnStyle = (disabled) => ({
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid #f3b2a8",
    background: "#fff1ee",
    color: "#9c2f21",
    fontSize: 12,
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    whiteSpace: "nowrap",
  });

  const manageRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  };

  const manageStackRightStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
    minHeight: 72,
  };

  const dotsBtnStyle = (busy) => ({
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "1px solid #eee",
    background: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    opacity: busy ? 0.5 : 1,
    cursor: busy ? "not-allowed" : "pointer",
  });

  const canBoostStatus = (p) => String(p?.status || "") === "เผยแพร่แล้ว";

  const getAutoSlotInfo = () => {
    const raw = readLS(LS_AUTO, AUTO_FALLBACK);
    const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw }, userPkgKey);

    const activeCount = store.activePropertyId ? 1 : 0;
    const max = 1;
    return { activeCount, max, isFull: activeCount >= max };
  };

  const autoSlotInfo = useMemo(() => getAutoSlotInfo(), [tick, userPkgKey]);

  // ✅ NEW: ใช้ใน modal เพื่อ disable ปุ่ม Auto ถ้ายังไม่ยกเลิก Active หรือยังไม่ยกเลิก Queue
  const autoBlockInfo = useMemo(() => getAutoBlockInfo(userPkgKey), [tick, userPkgKey]);

  const autoBlockedForThis =
    (autoBlockInfo.blockedNeedCancelActive &&
      String(autoBlockInfo.activeId) !== String(boostModalProperty?.id || "")) ||
    (autoBlockInfo.blockedNeedCancelQueue &&
      String(autoBlockInfo.queuedId) !== String(boostModalProperty?.id || ""));

  return (
    <>
      {/* =========================
          Modal: Video
      ========================= */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
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
                <div className="h6 mb-0">วิดีโอประกาศ (สูงสุด {MAX_SLOTS} อัน)</div>
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
              <div className="row">
                {videoInputs.map((val, idx) => (
                  <div className="col-12" key={idx}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      URL วิดีโอ {idx + 1}
                    </label>
                    <input
                      className="form-control mb-2"
                      value={String(val ?? "")}
                      onChange={(e) => setVideoAt(idx, e.target.value)}
                      disabled={videoSaving}
                      placeholder="https://youtube.com/... หรือ https://tiktok.com/..."
                    />
                  </div>
                ))}
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
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          Modal: Boost Picker
      ========================= */}
      {boostModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="เลือกประเภทการดัน"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeBoostPicker();
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
              width: "min(560px, 100%)",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}
          >
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <div>
                <div className="h6 mb-0">เลือกวิธีดันโพสต์</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  ประกาศ: <b>{boostModalProperty?.title}</b>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-light"
                onClick={closeBoostPicker}
                disabled={!!boostingId}
                aria-label="close"
              >
                <span className="fas fa-times" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="mb-3" style={{ fontSize: 13, opacity: 0.85 }}>
                แพ็กคุณตอนนี้: <b>{pkg.label}</b>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={goManualConfirm}
                  disabled={!!boostingId}
                  style={{
                    textAlign: "left",
                    borderRadius: 14,
                    border: "1px solid #f3b2a8",
                    background: "#fff",
                    padding: 14,
                    cursor: boostingId ? "not-allowed" : "pointer",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div style={{ fontWeight: 900 }}>
                      <span className="fas fa-bolt me-2" />
                      ดันทันที
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{pkg.manualFreeText}</div>
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                    ไปหน้ายืนยันแมนนวล แล้วกด “ยืนยันดัน”
                  </div>
                </button>

                <button
                  type="button"
                  onClick={goAutoConfirm}
                  disabled={!!boostingId || autoBlockedForThis}
                  style={{
                    textAlign: "left",
                    borderRadius: 14,
                    border: "1px solid #e5e5e5",
                    background: "#fff",
                    padding: 14,
                    cursor: boostingId || autoBlockedForThis ? "not-allowed" : "pointer",
                    opacity: autoBlockedForThis ? 0.75 : 1,
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div style={{ fontWeight: 900 }}>
                      <span className="fas fa-robot me-2" />
                      ดันทันทีต่อเนื่อง
                    </div>

                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {autoBlockInfo.blockedNeedCancelActive &&
                      String(autoBlockInfo.activeId) !== String(boostModalProperty?.id || "")
                        ? `ต้องยกเลิกออโต้โพส #${autoBlockInfo.activeId} ก่อน`
                        : autoBlockInfo.blockedNeedCancelQueue &&
                          String(autoBlockInfo.queuedId) !== String(boostModalProperty?.id || "")
                        ? `ต้องยกเลิกคิวโพส #${autoBlockInfo.queuedId} ก่อน`
                        : autoSlotInfo.isFull
                        ? `Auto ทำงานอยู่ · ${pkg.intervalLabel}`
                        : `Auto ได้ 1 โพส · ${pkg.intervalLabel}`}
                    </div>
                  </div>

                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                    {autoBlockInfo.blockedNeedCancelActive &&
                    String(autoBlockInfo.activeId) !== String(boostModalProperty?.id || "")
                      ? `ตอนนี้กำลังดันโพส #${autoBlockInfo.activeId} อยู่ — กรุณายกเลิกก่อน`
                      : autoBlockInfo.blockedNeedCancelQueue &&
                        String(autoBlockInfo.queuedId) !== String(boostModalProperty?.id || "")
                      ? `ตอนนี้มีโพส #${autoBlockInfo.queuedId} อยู่ในคิว — กรุณายกเลิกคิวก่อน`
                      : "ไปหน้ายืนยันออโต้ แล้วกด “ยืนยัน”"}
                  </div>
                </button>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  style={{ height: 44, padding: "0 18px", borderRadius: 12 }}
                  onClick={closeBoostPicker}
                  disabled={!!boostingId}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          Table
      ========================= */}
      <table className="table-style3 table at-savesearch" style={{ tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "45%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "16%" }} />
        </colgroup>

        <thead className="t-head">
          <tr>
            <th scope="col">รายการทรัพย์</th>
            <th scope="col">ราคา</th>
            <th scope="col" style={{ textAlign: "center" }}>
              สถานะ
            </th>
            <th scope="col" style={{ whiteSpace: "nowrap" }}>
              ยอดเข้าชม
            </th>
            <th scope="col" style={{ textAlign: "right", paddingRight: 18 }}>
              จัดการ
            </th>
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
              const count = videoSummary?.[property.id]?.count ?? 0;
              const hasVideo = count > 0;
              const busy = rowBusy(property.id);

              const boostUi = getBoostUi(property.id);
              const isPublished = canBoostStatus(property);

              const isQueued = !!boostUi?.isAutoQueued;
              const isActive = !!boostUi?.isAutoActive;

              const canPressBoost =
                isPublished &&
                (!boostUi?.has || (boostUi?.mode === "manual" && !boostUi?.manualCooling));

              const statusMeta = getStatusMeta(property.status);

              return (
                <tr key={property.id}>
                  <th scope="row">
                    <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                      <div className="list-thumb">
                        <Image
                          width={110}
                          height={94}
                          className="w-100"
                          src={property.imageSrc}
                          alt="property"
                        />
                      </div>

                      <div
                        className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4"
                        style={{ minWidth: 0 }}
                      >
                        <div
                          className="h6 list-title d-flex align-items-center gap-2"
                          style={{ marginBottom: 6 }}
                        >
                          <Link href={`/single-v1/${property.id}`}>{property.title}</Link>

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
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                                data-tooltip-id={`video-${property.id}`}
                                onClick={() => handleVideoPage(property.id)}
                                aria-label="video"
                              >
                                <span className="fas fa-video" />
                                <span style={{ fontSize: 12, opacity: 0.85 }}>{count}</span>
                              </button>

                              <ReactTooltip id={`video-${property.id}`} place="top" content={`วิดีโอ (${count})`} />
                            </>
                          )}
                        </div>

                        <p className="list-text mb-0" style={{ marginTop: 2 }}>
                          {property?.location?.province
                            ? `${property.location.province} ${property.location.district ?? ""}`
                            : property.location || "-"}
                        </p>

                        {boostUi?.has && (
                          <div style={modePillStyle(boostUi.mode)} data-tooltip-id={`boost-mode-${property.id}`}>
                            {boostUi.mode === "auto" ? (
                              <>
                                <span className="fas fa-robot" />
                                {isQueued ? (
                                  <>
                                    <span>{`ดันออโต้ (เข้าคิว)`}</span>
                                    <span
                                      style={{
                                        marginLeft: 8,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "0 8px",
                                        height: 18,
                                        borderRadius: 999,
                                        border: "1px solid rgba(29,78,216,0.20)",
                                        background: "rgba(29,78,216,0.06)",
                                        fontWeight: 900,
                                      }}
                                    >
                                      {`จะเริ่มเวลา ~ ${boostUi.nextTimeText || "-"}`}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span>ดันออโต้ (กำลังทำงาน)</span>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <span className="fas fa-bolt" />
                                ดันแบบแมนนวล
                              </>
                            )}

                            <ReactTooltip
                              id={`boost-mode-${property.id}`}
                              place="top"
                              content={
                                boostUi.mode === "auto"
                                  ? isQueued
                                    ? `โพสต์นี้อยู่ในคิว · จะเริ่มหลังเวลา ${boostUi.nextTimeText || "-"}`
                                    : boostUi.cancelAfterCooldown
                                    ? `โพสต์นี้เป็น Active · ถูกยกเลิกแล้ว (จะหยุดหลังเวลา ${boostUi.nextTimeText || "-"})`
                                    : `โพสต์นี้เป็น Active · ดันได้อีกครั้งเวลา ${boostUi.nextTimeText || "-"}`
                                  : "โพสต์นี้ดันด้วยแมนนวล"
                              }
                            />
                          </div>
                        )}

                        {boostUi?.has && (
                          <div style={timeLineStyle}>
                            <span className="far fa-clock" />
                            <span>
                              {boostUi.mode === "auto" ? (
                                <>
                                  {boostUi.lastAt ? (
                                    <>
                                      รอบล่าสุด:{" "}
                                      <b style={{ color: "#374151", fontWeight: 700 }}>
                                        {formatThaiDateTime(boostUi.lastAt)}
                                      </b>
                                    </>
                                  ) : (
                                    <>—</>
                                  )}
                                </>
                              ) : (
                                <>
                                  {boostUi.manualLast ? (
                                    <>
                                      ดันล่าสุด:{" "}
                                      <b style={{ color: "#374151", fontWeight: 700 }}>
                                        {formatThaiDateTime(boostUi.manualLast)}
                                      </b>
                                    </>
                                  ) : null}
                                </>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  {/* ราคา (ไม่ซ้ำ) */}
                  <td className="vam">{property.priceText || property.price?.toLocaleString?.() || "-"}</td>

                  {/* สถานะแบบ badge (ของคุณ) */}
                  <td className="vam" style={{ textAlign: "center" }}>
                    <span style={{ ...baseStatusStyle, backgroundColor: statusMeta.bg, color: statusMeta.color }}>
                      {statusMeta.label}
                    </span>
                  </td>

                  <td className="vam">{property.views ?? "-"}</td>

                  <td className="vam" style={{ paddingRight: 18, verticalAlign: "middle", textAlign: "right" }}>
                    {/* queued */}
                    {boostUi?.has && boostUi.mode === "auto" && isQueued ? (
                      <div style={manageStackRightStyle}>
                        <div className="dropdown">
                          <button
                            type="button"
                            disabled={busy}
                            style={dotsBtnStyle(busy)}
                            className="icon"
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
                                <span className="fas fa-pen" />
                                แก้ไข
                              </button>
                            </li>

                            {property.status !== "ขายแล้ว" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item d-flex align-items-center gap-2 text-success"
                                  disabled={busy}
                                  onClick={() => handleUpdateStatus(property.id, "ขายแล้ว")}
                                >
                                  <span className="fas fa-check-circle" />
                                  ปิดการขาย
                                </button>
                              </li>
                            )}

                            <li>
                              <button
                                type="button"
                                className="dropdown-item d-flex align-items-center gap-2"
                                disabled={busy}
                                onClick={() => openVideoModal(property)}
                              >
                                <span className="fas fa-video" />
                                {hasVideo ? "แก้ไขวิดีโอ" : "เพิ่มวิดีโอ"}
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
                                <span className="flaticon-bin" />
                                ลบ
                              </button>
                            </li>
                          </ul>

                          <ReactTooltip id={`actions-${property.id}`} place="top" content="จัดการ" />
                        </div>

                        <button
                          type="button"
                          style={cancelQueueBtnStyle(busy || boostingId === property.id)}
                          disabled={busy || boostingId === property.id}
                          onClick={() => cancelAutoQueue(property.id)}
                          data-tooltip-id={`cancel-auto-${property.id}`}
                        >
                          <span className="fas fa-ban" />
                          ยกเลิกคิว
                          <ReactTooltip id={`cancel-auto-${property.id}`} place="top" content="ยกเลิกคิวรอบถัดไป" />
                        </button>
                      </div>
                    ) : boostUi?.has && boostUi.mode === "auto" && isActive ? (
                      /* active -> มีปุ่มยกเลิก */
                      <div style={manageStackRightStyle}>
                        <div className="dropdown">
                          <button
                            type="button"
                            disabled={busy}
                            style={dotsBtnStyle(busy)}
                            className="icon"
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
                                <span className="fas fa-pen" />
                                แก้ไข
                              </button>
                            </li>

                            {property.status !== "ขายแล้ว" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item d-flex align-items-center gap-2 text-success"
                                  disabled={busy}
                                  onClick={() => handleUpdateStatus(property.id, "ขายแล้ว")}
                                >
                                  <span className="fas fa-check-circle" />
                                  ปิดการขาย
                                </button>
                              </li>
                            )}

                            <li>
                              <button
                                type="button"
                                className="dropdown-item d-flex align-items-center gap-2"
                                disabled={busy}
                                onClick={() => openVideoModal(property)}
                              >
                                <span className="fas fa-video" />
                                {hasVideo ? "แก้ไขวิดีโอ" : "เพิ่มวิดีโอ"}
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
                                <span className="flaticon-bin" />
                                ลบ
                              </button>
                            </li>
                          </ul>

                          <ReactTooltip id={`actions-${property.id}`} place="top" content="จัดการ" />
                        </div>

                        <div style={boostCountdownStyle()} data-tooltip-id={`boost-next-${property.id}`}>
                          <span className="far fa-clock" />
                          ดันได้อีกครั้งเวลา {boostUi.nextTimeText || "-"}
                          <ReactTooltip
                            id={`boost-next-${property.id}`}
                            place="top"
                            content={boostUi.cancelAfterCooldown ? "ถูกยกเลิกแล้ว (จะหยุดหลังครบเวลา)" : "รอบถัดไปของออโต้"}
                          />
                        </div>

                        <button
                          type="button"
                          style={cancelActiveBtnStyle(busy || boostingId === property.id || boostUi.cancelAfterCooldown)}
                          disabled={busy || boostingId === property.id || boostUi.cancelAfterCooldown}
                          onClick={() => cancelAutoActive(property.id)}
                          data-tooltip-id={`cancel-active-${property.id}`}
                        >
                          <span className="fas fa-ban" />
                          {boostUi.cancelAfterCooldown ? "ยกเลิกแล้วจะหยุดดันหลังครบเวลา" : "ยกเลิกออโต้"}
                          <ReactTooltip
                            id={`cancel-active-${property.id}`}
                            place="top"
                            content="ยกเลิกแล้วจะหยุดหลังครบเวลา (ยังต้องรอ cooldown)"
                          />
                        </button>
                      </div>
                    ) : boostUi?.has && boostUi.mode === "manual" && boostUi.manualCooling ? (
                      /* manual cooldown */
                      <div style={manageStackRightStyle}>
                        <div className="dropdown">
                          <button
                            type="button"
                            disabled={busy}
                            style={dotsBtnStyle(busy)}
                            className="icon"
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
                                <span className="fas fa-pen" />
                                แก้ไข
                              </button>
                            </li>

                            {property.status !== "ขายแล้ว" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item d-flex align-items-center gap-2 text-success"
                                  disabled={busy}
                                  onClick={() => handleUpdateStatus(property.id, "ขายแล้ว")}
                                >
                                  <span className="fas fa-check-circle" />
                                  ปิดการขาย
                                </button>
                              </li>
                            )}

                            <li>
                              <button
                                type="button"
                                className="dropdown-item d-flex align-items-center gap-2"
                                disabled={busy}
                                onClick={() => openVideoModal(property)}
                              >
                                <span className="fas fa-video" />
                                {hasVideo ? "แก้ไขวิดีโอ" : "เพิ่มวิดีโอ"}
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
                                <span className="flaticon-bin" />
                                ลบ
                              </button>
                            </li>
                          </ul>

                          <ReactTooltip id={`actions-${property.id}`} place="top" content="จัดการ" />
                        </div>

                        <div style={boostCountdownStyle()} data-tooltip-id={`boost-cd-${property.id}`}>
                          <span className="far fa-clock" />
                          เหลืออีก {formatHMS(boostUi.manualRemainSec)}
                          <ReactTooltip id={`boost-cd-${property.id}`} place="top" content="รอคูลดาวน์แมนนวล" />
                        </div>
                      </div>
                    ) : (
                      /* normal */
                      <div style={manageRowStyle}>
                        <button
                          type="button"
                          onClick={() => openBoostPicker(property)}
                          disabled={busy || !canPressBoost}
                          style={boostBtnStyle(busy || !canPressBoost)}
                          data-tooltip-id={`boost-btn-${property.id}`}
                        >
                          <span className="fas fa-bolt" />
                          ดัน
                          <ReactTooltip
                            id={`boost-btn-${property.id}`}
                            place="top"
                            content={!isPublished ? "ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)" : "ดันโพสต์ (เลือก Manual / Auto)"}
                          />
                        </button>

                        <div className="dropdown">
                          <button
                            type="button"
                            disabled={busy}
                            style={{
                              border: "none",
                              background: "transparent",
                              padding: 0,
                              opacity: busy ? 0.5 : 1,
                              cursor: busy ? "not-allowed" : "pointer",
                            }}
                            className="icon"
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
                                <span className="fas fa-pen" />
                                แก้ไข
                              </button>
                            </li>

                            {property.status !== "ขายแล้ว" && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item d-flex align-items-center gap-2 text-success"
                                  disabled={busy}
                                  onClick={() => handleUpdateStatus(property.id, "ขายแล้ว")}
                                >
                                  <span className="fas fa-check-circle" />
                                  ปิดการขาย
                                </button>
                              </li>
                            )}

                            <li>
                              <button
                                type="button"
                                className="dropdown-item d-flex align-items-center gap-2"
                                disabled={busy}
                                onClick={() => openVideoModal(property)}
                              >
                                <span className="fas fa-video" />
                                {hasVideo ? "แก้ไขวิดีโอ" : "เพิ่มวิดีโอ"}
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
                                <span className="flaticon-bin" />
                                ลบ
                              </button>
                            </li>
                          </ul>

                          <ReactTooltip id={`actions-${property.id}`} place="top" content="จัดการ" />
                        </div>
                      </div>
                    )}
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
