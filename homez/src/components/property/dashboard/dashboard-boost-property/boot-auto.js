"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";

import { PACKAGES, getPackage } from "./boost/config/boostPackages";
import { LS_AUTO, AUTO_FALLBACK } from "./boost/config/boostStorage";
import { readLS, writeLS, formatCountdown } from "./boost/utils/boostUtils";

// ===== Utils =====
const canBoost = (p) => String(p?.status || "") === "เผยแพร่แล้ว";

const pickLocationText = (p) => {
  const full = p?.location?.fullText;
  if (full) return full;
  const province = p?.location?.province || "";
  const district = p?.location?.district || "";
  const sub = p?.location?.subdistrict || "";
  return [sub, district, province].filter(Boolean).join(" · ") || "-";
};

// ✅ get ids จาก order ก่อน ถ้าไม่มีค่อย fallback items
function getActiveIdsFromStore(store) {
  const items = store?.items && typeof store.items === "object" ? store.items : {};
  let order = Array.isArray(store?.order) ? store.order.map(String).filter(Boolean) : [];
  order = order.filter((id) => !!items?.[id]);

  if (order.length > 0) return order;
  return Object.keys(items).map(String);
}

// ✅ สำคัญ: ไม่ fallback packageKey เป็น business (กันลบ LS แล้วเด้งกลับเอง)
function normalizeAutoStore(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const pkgKey = typeof s.packageKey === "string" ? s.packageKey : ""; // ✅ ปล่อยว่างได้

  return {
    enabled: !!s.enabled,
    packageKey: pkgKey,
    items: s.items && typeof s.items === "object" ? s.items : {},
    queue: Array.isArray(s.queue) ? s.queue.map((x) => String(x)) : [],
    order: Array.isArray(s.order) ? s.order.map((x) => String(x)) : [],
  };
}

function clampStep(s) {
  const n = Number(s) || 1;
  if (n < 1) return 1;
  if (n > 2) return 2;
  return n;
}

// ===== Toast helpers =====
const tLoading = (msg) => toast.loading(msg);
const tUpdate = (id, type, msg) =>
  toast.update(id, {
    render: msg,
    type,
    isLoading: false,
    autoClose: 1600,
    closeButton: true,
  });

// ===== UI Bits =====
const ToneBadge = ({ tone = "gray", children }) => {
  const map = {
    green: { bg: "#E9FBF0", text: "#0A7A3B", border: "#BFECD0" },
    red: { bg: "#FFECEC", text: "#A40000", border: "#FFC2C2" },
    gray: { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" },
    blue: { bg: "#EAF4FF", text: "#0B4EA2", border: "#BFD9FF" },
    purple: { bg: "#F3EEFF", text: "#5B21B6", border: "#DDD6FE" },
  };
  const c = map[tone] || map.gray;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        padding: "5px 10px",
        borderRadius: 999,
        fontSize: 12,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

const Card = ({ title, desc, right, children }) => (
  <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative mb30">
    <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap mb20">
      <div>
        {title ? <h4 className="title fz17 mb5">{title}</h4> : null}
        {desc ? (
          <p className="text-muted mb0" style={{ fontSize: 13 }}>
            {desc}
          </p>
        ) : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
    {children}
  </div>
);

const StepPill = ({ active, done, children, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="btn"
    style={{
      borderRadius: 999,
      padding: "8px 12px",
      fontSize: 13,
      border: active ? "2px solid #0d6efd" : "1px solid #e9ecef",
      background: active ? "#F5F9FF" : "#fff",
      color: disabled ? "#9CA3AF" : "#111827",
      opacity: disabled ? 0.7 : 1,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: done ? "#E9FBF0" : "#F3F4F6",
        color: done ? "#0A7A3B" : "#6B7280",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        lineHeight: 1,
      }}
    >
      {done ? "✓" : "•"}
    </span>
    {children}
  </button>
);

const StickyBar = ({ children }) => (
  <div style={{ position: "sticky", bottom: 14, zIndex: 20, marginTop: 14 }}>
    <div
      className="bgc-white"
      style={{
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
      }}
    >
      {children}
    </div>
  </div>
);

const PropertyPickRow = ({ p, checked, onToggle, noteRight, disabled, title, badgeText, badgeTone }) => {
  const boostable = canBoost(p);
  const dis = disabled || !boostable;

  const tone = badgeTone || (!boostable ? "red" : checked ? "purple" : dis ? "gray" : "green");
  const text = badgeText || (!boostable ? "ดันไม่ได้" : checked ? "เลือกแล้ว" : dis ? "ล็อก" : "ดันได้");

  return (
    <button
      type="button"
      className="btn text-start"
      onClick={!dis ? onToggle : undefined}
      style={{
        width: "100%",
        borderRadius: 14,
        padding: 12,
        border: checked ? "2px solid #0d6efd" : "1px solid #eee",
        background: checked ? "#F5F9FF" : "#fff",
        opacity: dis ? 0.6 : 1,
        cursor: dis ? "not-allowed" : "pointer",
      }}
      title={
        title ||
        (!boostable
          ? "ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)"
          : dis
          ? "ถึงลิมิตแล้ว / หรืออยู่ในโหมดต่อคิว"
          : "กดเพื่อเลือก")
      }
    >
      <div className="d-flex align-items-center justify-content-between gap-2">
        <div style={{ minWidth: 0 }}>
          <div className="fw700">{p.title}</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            รหัส: {p.id} · {pickLocationText(p)}
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {noteRight}
          <ToneBadge tone={tone}>{text}</ToneBadge>
        </div>
      </div>
    </button>
  );
};

export default function BootAuto({
  properties,
  selectedMap,
  selectedIds,
  selectedList,
  toggleOne,
  clearSelected,
  goManual,
  initialStep = 1,
  packageKey = "pro", // ✅ ให้ index คุมเป็นหลัก (default pro)
}) {
  const [step, setStep] = useState(() => clampStep(initialStep));
  const [q, setQ] = useState("");
  const [now, setNow] = useState(Date.now());
  const [isBusy, setIsBusy] = useState(false);

  const [autoStore, setAutoStore] = useState(() => {
    const s = readLS(LS_AUTO, AUTO_FALLBACK);
    return normalizeAutoStore({ ...AUTO_FALLBACK, ...s });
  });

  const syncAutoStore = useCallback(() => {
    const s = readLS(LS_AUTO, AUTO_FALLBACK);
    setAutoStore(normalizeAutoStore({ ...AUTO_FALLBACK, ...s }));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    syncAutoStore();
  }, [syncAutoStore]);

  // ===== Active ids / status =====
  const activeIds = useMemo(() => getActiveIdsFromStore(autoStore), [autoStore]);
  const activeCount = activeIds.length;

  const hasItems = activeCount > 0;
  const autoEnabled = !!autoStore?.enabled;
  const autoPausedButHasItems = !autoEnabled && hasItems;

  // ✅ อิง index เป็นหลัก "เฉพาะตอนยังไม่มีรายการ"
  // ✅ ถ้ามีรายการแล้ว ยึด store ก่อน เพื่อกันเปลี่ยนกลางคัน
  const effectivePkgKey = hasItems
    ? (autoStore?.packageKey || packageKey || "pro")
    : (packageKey || autoStore?.packageKey || "pro");

  const pkg = getPackage?.(effectivePkgKey) || PACKAGES?.[effectivePkgKey] || PACKAGES.pro;
  const ACTIVE_INTERVAL_MS = Number(pkg.intervalMs || 0);

  // ✅ ถ้ายังไม่มีรายการ: sync packageKey ลง store ให้ตาม index (กัน UI งง)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!packageKey) return;

    const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
    const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });
    const ids = getActiveIdsFromStore(store);
    const hasItemsLS = ids.length > 0;

    if (!hasItemsLS && store.packageKey !== packageKey) {
      store.packageKey = packageKey;
      writeLS(LS_AUTO, store);
      setAutoStore(store);
    }
  }, [packageKey]);

  // ✅ เพิ่ม active ได้จนเต็ม (เฉพาะแพ็กที่ autoMaxPosts > 1)
  const canAddActive = hasItems && pkg.autoMaxPosts > 1 && activeCount < pkg.autoMaxPosts;
  const mode = !hasItems ? "start" : canAddActive ? "add" : "queue"; // start | add | queue

  // queueMax (ตามแพ็ก)
  const queueMax = pkg.autoMaxPosts > 1 ? 5 : 1;

  // ===== ✅ Auto-run simulate + rotate order + switch queue =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!autoStore?.enabled) return;
    if (ACTIVE_INTERVAL_MS <= 0) return;

    const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
    const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });
    if (!store.enabled) return;

    const items = store.items || {};
    let order = getActiveIdsFromStore(store);
    if (order.length === 0) return;

    const curActiveId = String(order[0]);
    const it = items[curActiveId];
    if (!it?.nextRunAt) return;
    if (now < it.nextRunAt) return;

    // “ดัน” รอบนี้
    const runAt = now;
    it.lastRunAt = runAt;
    it.nextRunAt = runAt + ACTIVE_INTERVAL_MS;

    // ✅ หมุน order จริง (ตัวที่เพิ่งดันไปท้าย)
    order = order.slice(1).concat(curActiveId);

    // ✅ ถ้ามี queue: เอาตัวแรกมาลองใส่
    const qArr = Array.isArray(store.queue) ? store.queue.map(String).filter(Boolean) : [];
    if (qArr.length > 0) {
      const nextId = String(qArr[0]);

      if (nextId && !order.includes(nextId)) {
        const maxActive = Number(pkg.autoMaxPosts || 1);

        if (order.length < maxActive) {
          // ยังไม่เต็ม -> เพิ่มเข้า active ได้เลย
          order.push(nextId);
          items[nextId] = items[nextId] || {
            enabledAt: it.enabledAt || runAt,
            lastRunAt: 0,
            nextRunAt: it.nextRunAt,
          };
          store.queue = qArr.slice(1);
        } else {
          // เต็มแล้ว -> replace “ตัวที่เพิ่งดัน” (curActiveId)
          order = order.filter((x) => x !== curActiveId);
          order.push(nextId);

          delete items[curActiveId];

          items[nextId] = items[nextId] || {
            enabledAt: it.enabledAt || runAt,
            lastRunAt: 0,
            nextRunAt: it.nextRunAt,
          };

          store.queue = qArr.slice(1);
        }
      }
    }

    store.items = items;
    store.order = order;

    // ✅ keep packageKey ถ้ามีแล้ว (ถ้าไม่มีให้ใส่จาก effective)
    store.packageKey = store.packageKey || effectivePkgKey;

    writeLS(LS_AUTO, store);
    setAutoStore(store);
  }, [now, autoStore?.enabled, ACTIVE_INTERVAL_MS, pkg.autoMaxPosts, effectivePkgKey]);

  // step sync
  useEffect(() => {
    setStep(clampStep(initialStep));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStep]);

  // ===== list filter =====
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let arr = [...(properties || [])];

    if (keyword) {
      arr = arr.filter((p) => {
        const hay = `${p.title} ${p.id} ${pickLocationText(p)} ${p.location?.province || ""}`.toLowerCase();
        return hay.includes(keyword);
      });
    }
    arr.sort((a, b) => Number(canBoost(b)) - Number(canBoost(a)));
    return arr;
  }, [properties, q]);

  const activeId = activeIds[0] ? String(activeIds[0]) : "";

  const autoRunningList = useMemo(() => {
    const items = autoStore?.items || {};
    const order = activeIds.length ? activeIds : Object.keys(items).map(String);

    return order
      .filter((id) => items?.[id])
      .map((id) => {
        const prop = (properties || []).find((p) => String(p.id) === String(id));
        const it = items[id];
        const remain = it?.nextRunAt ? Math.max(0, it.nextRunAt - now) : 0;
        return {
          id: String(id),
          title: prop?.title || `ประกาศ #${id}`,
          location: prop ? pickLocationText(prop) : "-",
          lastRunAt: it?.lastRunAt || 0,
          nextRunAt: it?.nextRunAt || 0,
          remain,
        };
      });
  }, [autoStore, properties, now, activeIds]);

  const queueList = useMemo(() => {
    const qArr = Array.isArray(autoStore?.queue) ? autoStore.queue : [];
    const uniq = [];
    const seen = new Set();
    qArr.forEach((id) => {
      const sid = String(id);
      if (!sid || seen.has(sid)) return;
      seen.add(sid);
      uniq.push(sid);
    });

    return uniq
      .map((id) => {
        const prop = (properties || []).find((p) => String(p.id) === String(id));
        return { id, title: prop?.title || `ประกาศ #${id}`, location: prop ? pickLocationText(prop) : "-" };
      })
      .slice(0, 50);
  }, [autoStore?.queue, properties]);

  // picked (queue / start/add)
  const pickedOne = (selectedIds?.length || 0) > 0;
  const pickedIdForQueue = pickedOne ? String(selectedIds[0]) : "";
  const pickedPropForQueue = useMemo(() => {
    if (!pickedIdForQueue) return null;
    return (properties || []).find((p) => String(p.id) === pickedIdForQueue) || null;
  }, [pickedIdForQueue, properties]);

  const stepDone1 = mode === "queue" ? pickedOne : selectedList.filter(canBoost).length > 0;

  // ===== Actions =====
  const clearQueue = async () => {
    if (isBusy) return;
    setIsBusy(true);
    const tid = tLoading("กำลังล้างคิว...");
    try {
      const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });
      store.queue = [];
      writeLS(LS_AUTO, store);
      setAutoStore(store);
      tUpdate(tid, "success", "ล้างคิวเรียบร้อย");
    } catch {
      tUpdate(tid, "error", "ล้างคิวไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  // ✅ ปุ่มล้างออโต้ทั้งหมด (ช่วยแก้ “ค้างแพ็ก/ค้างสเตต”)
  const hardClearAuto = async () => {
    if (isBusy) return;
    setIsBusy(true);
    const tid = tLoading("กำลังล้างข้อมูลออโต้ทั้งหมด...");
    try {
      const cleared = normalizeAutoStore({
        enabled: false,
        packageKey: packageKey || "pro",
        items: {},
        order: [],
        queue: [],
      });
      writeLS(LS_AUTO, cleared);
      setAutoStore(cleared);
      clearSelected();
      setStep(1);
      tUpdate(tid, "success", "ล้างข้อมูลออโต้ทั้งหมดแล้ว");
    } catch {
      tUpdate(tid, "error", "ล้างข้อมูลออโต้ไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  const startAuto = async () => {
    if (isBusy) return;
    setIsBusy(true);
    const tid = tLoading("กำลังเปิดออโต้...");

    try {
      const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store0 = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });
      const existingActive = getActiveIdsFromStore(store0);

      if (existingActive.length > 0) {
        tUpdate(tid, "warning", "มีออโต้เดิมอยู่แล้ว (เพิ่มรายการได้ถ้ายังไม่เต็ม / ไม่งั้นจะเป็นโหมดคิว)");
        return;
      }

      const boostableList = selectedList.filter(canBoost);
      if (boostableList.length === 0) {
        tUpdate(tid, "warning", "กรุณาเลือกประกาศที่เผยแพร่แล้วอย่างน้อย 1 รายการ");
        return;
      }

      if (boostableList.length > pkg.autoMaxPosts) {
        tUpdate(tid, "warning", `${pkg.label} จำกัดออโต้ได้ ${pkg.autoMaxPosts} โพส`);
        return;
      }

      await new Promise((r) => setTimeout(r, 200));

      const pickedIds = boostableList.map((p) => String(p.id));
      const startAt = Date.now();

      const store = normalizeAutoStore({
        enabled: true,
        packageKey: effectivePkgKey, // ✅ ตอนยังไม่เริ่ม = index เป็นหลัก
        items: {},
        queue: [],
        order: [],
      });

      pickedIds.forEach((pid) => {
        store.items[pid] = { enabledAt: startAt, lastRunAt: 0, nextRunAt: startAt + pkg.intervalMs };
      });

      store.order = [...pickedIds];

      writeLS(LS_AUTO, store);
      setAutoStore(store);

      clearSelected();
      setStep(1);
      tUpdate(tid, "success", `เปิดออโต้แล้ว (${pkg.label})`);
    } catch {
      tUpdate(tid, "error", "เปิดออโต้ไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  const pauseAuto = async () => {
    if (isBusy) return;
    setIsBusy(true);
    const tid = tLoading("กำลังหยุดดันออโต้ชั่วคราว...");

    try {
      const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });
      const ids = getActiveIdsFromStore(store);
      if (ids.length === 0) {
        tUpdate(tid, "info", "ยังไม่มีรายการออโต้");
        return;
      }

      await new Promise((r) => setTimeout(r, 120));
      store.enabled = false;
      writeLS(LS_AUTO, store);
      setAutoStore(store);
      tUpdate(tid, "info", "หยุดดันออโต้ชั่วคราวแล้ว (เวลาเดิมยังอยู่)");
      setStep(1);
    } catch {
      tUpdate(tid, "error", "หยุดดันออโต้ไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  const resumeAuto = async () => {
    if (isBusy) return;
    setIsBusy(true);
    const tid = tLoading("กำลังเปิดการดันออโต้ต่อ...");

    try {
      const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });
      const ids = getActiveIdsFromStore(store);
      if (ids.length === 0) {
        tUpdate(tid, "warning", "ยังไม่มีรายการออโต้ให้ Resume");
        return;
      }

      await new Promise((r) => setTimeout(r, 120));
      store.enabled = true;
      writeLS(LS_AUTO, store);
      setAutoStore(store);
      clearSelected();
      setStep(1);
      tUpdate(tid, "success", "เปิดการดันออโต้ต่อแล้ว (ไม่รีเซ็ตเวลา)");
    } catch {
      tUpdate(tid, "error", "Resume ไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  // ✅ เพิ่ม active ได้จนเต็ม
  const addActive = async () => {
    if (isBusy) return;

    const boostableList = selectedList.filter(canBoost);
    if (boostableList.length === 0) return toast.warn("กรุณาเลือกประกาศที่เผยแพร่แล้ว");

    setIsBusy(true);
    const tid = tLoading("กำลังเพิ่มรายการออโต้...");

    try {
      const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });

      const curIds = getActiveIdsFromStore(store);
      const remainSlots = Math.max(0, (pkg.autoMaxPosts || 1) - curIds.length);

      if (remainSlots <= 0) {
        tUpdate(tid, "warning", `ออโต้เต็มแล้ว (${pkg.autoMaxPosts} โพส) — ตอนนี้จะเป็นโหมดเข้าคิว`);
        return;
      }

      const toAdd = boostableList
        .map((p) => String(p.id))
        .filter((id) => !curIds.includes(id))
        .slice(0, remainSlots);

      if (toAdd.length === 0) {
        tUpdate(tid, "info", "โพสที่เลือกมีอยู่ในออโต้แล้ว");
        return;
      }

      // inherit เวลาเดียวกับตัว active แรก (เพื่อไม่รีเซ็ตเวลา)
      const baseId = curIds[0];
      const base = store.items?.[baseId] || {};
      const baseEnabledAt = base.enabledAt || Date.now();
      const baseLastRunAt = base.lastRunAt || 0;
      const baseNextRunAt = base.nextRunAt || Date.now() + pkg.intervalMs;

      store.items = store.items || {};
      toAdd.forEach((pid) => {
        store.items[pid] = store.items[pid] || {
          enabledAt: baseEnabledAt,
          lastRunAt: baseLastRunAt,
          nextRunAt: baseNextRunAt,
        };
      });

      const nextOrder = [...curIds];
      toAdd.forEach((pid) => {
        if (!nextOrder.includes(pid)) nextOrder.push(pid);
      });

      store.order = nextOrder;
      store.packageKey = store.packageKey || effectivePkgKey;

      writeLS(LS_AUTO, store);
      setAutoStore(store);

      clearSelected();
      setStep(1);
      tUpdate(tid, "success", `เพิ่มรายการออโต้เรียบร้อย (${toAdd.length} รายการ)`);
    } catch {
      tUpdate(tid, "error", "เพิ่มรายการออโต้ไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  // ✅ เพิ่มเข้าคิว
  const confirmQueue = async () => {
    if (isBusy) return;
    if (!pickedIdForQueue) return toast.warn("ยังไม่ได้เลือกโพส");

    setIsBusy(true);
    const tid = tLoading("กำลังเพิ่มเข้าคิว...");

    try {
      await new Promise((r) => setTimeout(r, 120));

      const storeRaw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...storeRaw });

      const curIds = getActiveIdsFromStore(store);
      const curActive = curIds[0] ? String(curIds[0]) : "";
      if (!curActive) {
        tUpdate(tid, "warning", "ยังไม่มีรายการกำลังดันอยู่");
        return;
      }

      const sid = String(pickedIdForQueue);

      if (sid === curActive) {
        tUpdate(tid, "warning", "โพสนี้กำลังดันอยู่แล้ว เลือกโพสอื่นเพื่อเข้าคิว");
        return;
      }

      const qArr = Array.isArray(store.queue) ? store.queue.map(String).filter(Boolean) : [];
      const uniqArr = qArr.filter((x, i, arr) => arr.indexOf(x) === i).filter((x) => x !== curActive);

      // Pro/Starter: คิวได้ 1 -> ทับ
      if (queueMax === 1) {
        store.queue = [sid];
        writeLS(LS_AUTO, store);
        setAutoStore(store);
        clearSelected();
        setStep(1);
        tUpdate(tid, "success", "ตั้งคิวรอบถัดไปเรียบร้อย");
        return;
      }

      // Business: คิวหลายตัว
      if (uniqArr.includes(sid)) {
        tUpdate(tid, "info", "โพสนี้อยู่ในคิวแล้ว");
        return;
      }

      if (uniqArr.length >= queueMax) {
        tUpdate(tid, "warning", `คิวเต็มแล้ว (สูงสุด ${queueMax} รายการ) — ล้างคิวหรือรอให้สลับรอบก่อน`);
        return;
      }

      store.queue = [...uniqArr, sid].slice(0, queueMax);
      store.packageKey = store.packageKey || effectivePkgKey;

      writeLS(LS_AUTO, store);
      setAutoStore(store);

      clearSelected();
      setStep(1);
      tUpdate(tid, "success", "เพิ่มเข้าคิวรอบถัดไปแล้ว");
    } catch {
      tUpdate(tid, "error", "เพิ่มเข้าคิวไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  // ===== Selection behavior =====
  const selectedLimitReached = selectedList.filter(canBoost).length >= pkg.autoMaxPosts;

  const handlePick = (id, p) => {
    if (!canBoost(p)) return;
    const sid = String(id);
    const already = !!selectedMap?.[sid];

    // start/add: เลือกได้หลาย (business) แต่กันเกิน max เฉพาะตอน start
    if (mode !== "queue" && pkg.autoMaxPosts > 1) {
      if (!already && selectedLimitReached) {
        toast.warn(`${pkg.label} จำกัดเลือกได้ ${pkg.autoMaxPosts} โพส`);
        return;
      }
      toggleOne(sid);
      return;
    }

    // queue mode: เลือกทีละ 1
    clearSelected();
    toggleOne(sid);
  };

  // ===== Step nav =====
  const goNext = () => {
    if (step !== 1) return;

    if (mode === "queue") {
      if (!pickedOne) return toast.warn("กรุณาเลือก 1 โพสเพื่อเข้าคิว");
      setStep(2);
      return;
    }

    const boostableCount = selectedList.filter(canBoost).length;
    if (boostableCount === 0) return toast.warn("กรุณาเลือกประกาศที่เผยแพร่แล้วอย่างน้อย 1 รายการ");
    setStep(2);
  };

  const goBack = () => setStep(1);

  // ===== Header =====
  const descText =
    `${pkg.label}: ` +
    `Auto ได้ ${pkg.autoMaxPosts} โพส · ` +
    `ออโต้ดัน ${pkg.intervalLabel} · ` +
    `Manual: ${pkg.manualFreeText}`;

  const statusBadge = autoEnabled ? (
    <ToneBadge tone="green">AUTO: เปิดอยู่</ToneBadge>
  ) : autoPausedButHasItems ? (
    <ToneBadge tone="gray">AUTO: หยุดดันชั่วคราว</ToneBadge>
  ) : (
    <ToneBadge tone="gray">AUTO: ปิดอยู่</ToneBadge>
  );

  const primaryBtnText = mode === "queue" ? "เพิ่มเข้าคิว" : mode === "add" ? "เพิ่มรายการออโต้" : "เปิดออโต้";
  const primaryBtnAction = mode === "queue" ? confirmQueue : mode === "add" ? addActive : startAuto;

  const primaryDisabled =
    isBusy || (mode === "queue" ? !pickedOne : selectedList.filter(canBoost).length === 0);

  return (
    <Card
      title="ดันขึ้นฟีด (ออโต้)"
      desc={descText}
      right={
        <div className="d-flex gap-2 flex-wrap justify-content-end">
          {statusBadge}
          <ToneBadge tone={hasItems ? "purple" : "blue"}>{pkg.label}</ToneBadge>

          <button
            type="button"
            className="ud-btn btn-white2"
            style={{ height: 44, padding: "0 14px", borderRadius: 12 }}
            onClick={goManual}
            disabled={isBusy}
          >
            ไปแท็บแมนนวล
          </button>
        </div>
      }
    >
      <div className="d-flex gap-2 flex-wrap mb20">
        <StepPill active={step === 1} done={stepDone1} onClick={() => setStep(1)} disabled={false}>
          1) เลือกประกาศ
        </StepPill>
        <StepPill active={step === 2} done={false} onClick={() => setStep(2)} disabled={!stepDone1}>
          2) ยืนยัน
        </StepPill>
      </div>

      {/* ===== Running + Queue ===== */}
      <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }} className="mb20">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="fw700">รายการกำลังดันอยู่ (ออโต้)</div>

          <div className="d-flex gap-2 flex-wrap justify-content-end">
            {hasItems ? (
              autoEnabled ? (
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  style={{ height: 38, borderRadius: 12 }}
                  onClick={pauseAuto}
                  disabled={isBusy}
                >
                  {isBusy ? "กำลังทำ..." : "หยุดการดันชั่วคราว"}
                </button>
              ) : (
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  style={{ height: 38, borderRadius: 12 }}
                  onClick={resumeAuto}
                  disabled={isBusy}
                >
                  {isBusy ? "กำลังทำ..." : "ดำเนินการต่อ"}
                </button>
              )
            ) : null}

            {queueList.length > 0 ? (
              <button
                type="button"
                className="ud-btn btn-white2"
                style={{ height: 38, borderRadius: 12 }}
                onClick={clearQueue}
                disabled={isBusy}
              >
                {isBusy ? "กำลังทำ..." : "ล้างคิว"}
              </button>
            ) : null}

            {/* ✅ ปุ่มล้างทั้งหมด */}
            <button
              type="button"
              className="ud-btn btn-white2"
              style={{ height: 38, borderRadius: 12 }}
              onClick={hardClearAuto}
              disabled={isBusy}
              title="เคลียร์ enabled/items/order/queue/packageKey"
            >
              ล้างออโต้ทั้งหมด
            </button>
          </div>
        </div>

        {autoRunningList.length === 0 ? (
          <div className="text-muted mt10" style={{ fontSize: 13 }}>
            ยังไม่มีรายการออโต้
          </div>
        ) : (
          <>
            <div className="mt10" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {autoRunningList.map((x) => (
                <div
                  key={x.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div className="fw600" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {x.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      รหัส: {x.id} · {x.location}
                      {x.lastRunAt ? ` · รอบล่าสุด: ${new Date(x.lastRunAt).toLocaleString()}` : " · ยังไม่เคยดัน"}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <ToneBadge tone="red">รอบถัดไปใน {formatCountdown(x.remain)}</ToneBadge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt12">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="fw700">รอคิว (รอบถัดไป)</div>
                {queueList.length === 0 ? <ToneBadge tone="gray">ไม่มีคิว</ToneBadge> : <ToneBadge tone="blue">{queueList.length} รายการ</ToneBadge>}
              </div>

              {queueList.length === 0 ? (
                <div className="text-muted mt10" style={{ fontSize: 13 }}>
                  เลือกโพสด้านล่าง → ถัดไป → ยืนยัน
                </div>
              ) : (
                <div className="mt10" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {queueList.map((x, idx) => (
                    <div
                      key={x.id}
                      style={{
                        background: "#fff",
                        border: "1px dashed #ddd",
                        borderRadius: 12,
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div className="fw600" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {idx + 1}. {x.title}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          รหัส: {x.id} · {x.location}
                        </div>
                      </div>
                      <ToneBadge tone="blue">รอคิว</ToneBadge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="text-muted mt10" style={{ fontSize: 12 }}>
          * Auto: เมื่อถึงเวลา ระบบจะ “ดัน” ตัวแรกใน order แล้วหมุน order (ถ้ามีคิวจะสลับเข้า active)
        </div>
      </div>

      {/* ===== Step 1 ===== */}
      {step === 1 ? (
        <>
          <div className="row g-3 align-items-end mb20">
            <div className="col-lg-8">
              <label className="form-label fw600">ค้นหา</label>
              <input
                className="form-control"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ชื่อประกาศ / รหัส / ทำเล"
                style={{ height: 48, borderRadius: 12 }}
                disabled={isBusy}
              />
            </div>

            <div className="col-lg-4 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="ud-btn btn-white2"
                style={{ height: 48, borderRadius: 12, padding: "0 14px" }}
                onClick={clearSelected}
                disabled={isBusy}
              >
                ล้างที่เลือก ({selectedIds.length || 0})
              </button>
            </div>
          </div>

          {mode === "queue" ? (
            <div className="mb20">
              <ToneBadge tone="red">โหมดเข้าคิว: active เต็มแล้ว → เลือก 1 โพส → ถัดไป → เพิ่มเข้าคิว</ToneBadge>
            </div>
          ) : mode === "add" ? (
            <div className="mb20">
              <ToneBadge tone="blue">โหมดเพิ่มรายการ: ยังเพิ่ม active ได้อีก {Math.max(0, pkg.autoMaxPosts - activeCount)} โพส</ToneBadge>
            </div>
          ) : null}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div className="text-center text-muted py-4">ไม่พบประกาศตามเงื่อนไข</div>
            ) : (
              filtered.map((p) => {
                const id = String(p.id);
                const isActive = activeIds.includes(id);
                const checked = !!selectedMap?.[id];

                // queue mode: ห้ามเลือก active และเลือกทีละ 1
                if (mode === "queue") {
                  const picked = (selectedIds?.[0] ? String(selectedIds[0]) : "") === id;

                  return (
                    <PropertyPickRow
                      key={id}
                      p={p}
                      checked={picked}
                      disabled={isBusy || !canBoost(p) || isActive}
                      title={
                        !canBoost(p)
                          ? "ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)"
                          : isActive
                          ? "โพสนี้อยู่ใน active (เข้าคิวไม่ได้)"
                          : "เลือกโพสนี้ แล้วกดถัดไปเพื่อเข้าคิว"
                      }
                      onToggle={() => {
                        if (isBusy || isActive) return;
                        clearSelected();
                        toggleOne(id);
                      }}
                      noteRight={
                        isActive && autoRunningList?.[0]?.remain ? <ToneBadge tone="red">{formatCountdown(autoRunningList[0].remain)}</ToneBadge> : null
                      }
                      badgeText={isActive ? "กำลังดัน" : picked ? "เลือกแล้ว" : "เลือกเพื่อเข้าคิว"}
                      badgeTone={isActive ? "green" : picked ? "purple" : "gray"}
                    />
                  );
                }

                // start/add mode
                const boostableCount = selectedList.filter(canBoost).length;
                const disableBecauseLimit =
                  pkg.autoMaxPosts > 1 && boostableCount >= pkg.autoMaxPosts && !checked && mode === "start";
                const disabled = isBusy || !canBoost(p) || disableBecauseLimit;

                return (
                  <PropertyPickRow
                    key={id}
                    p={p}
                    checked={checked}
                    disabled={disabled}
                    title={!canBoost(p) ? "ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)" : disableBecauseLimit ? `${pkg.label} จำกัดเลือกได้ ${pkg.autoMaxPosts} โพส` : ""}
                    onToggle={() => handlePick(id, p)}
                    badgeText={isActive ? "อยู่ใน active" : checked ? "เลือกแล้ว" : "เลือกได้"}
                    badgeTone={isActive ? "green" : checked ? "purple" : "gray"}
                  />
                );
              })
            )}
          </div>

          <StickyBar>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="text-muted" style={{ fontSize: 13 }}>
                {mode === "queue"
                  ? `active เต็มแล้ว (${activeCount}/${pkg.autoMaxPosts}) · เลือก 1 โพสเพื่อเข้าคิว · คิวได้สูงสุด ${queueMax}`
                  : mode === "add"
                  ? `เพิ่ม active ได้อีก ${Math.max(0, pkg.autoMaxPosts - activeCount)} โพส (ไม่รีเซ็ตเวลา)`
                  : "เลือกประกาศที่ “เผยแพร่แล้ว” เพื่อเปิดออโต้ดัน"}
              </div>

              <button
                type="button"
                className="ud-btn btn-thme"
                style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
                onClick={goNext}
                disabled={isBusy || (mode === "queue" ? !pickedOne : selectedList.filter(canBoost).length === 0)}
              >
                {isBusy ? "กำลังทำ..." : "ถัดไป"}
              </button>
            </div>
          </StickyBar>
        </>
      ) : null}

      {/* ===== Step 2 ===== */}
      {step === 2 ? (
        <>
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }}>
            <div className="fw700 mb10">
              {mode === "queue" ? "ยืนยันเพิ่มเข้าคิว" : mode === "add" ? "ยืนยันเพิ่มรายการออโต้" : "ยืนยันเปิดออโต้"}
            </div>

            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12, background: "#fff" }}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="fw700">สรุป</div>
                <ToneBadge tone="purple">{mode === "queue" ? "QUEUE" : pkg.label}</ToneBadge>
              </div>

              <div className="text-muted mt10" style={{ fontSize: 13, lineHeight: 1.7 }}>
                {mode === "queue" ? (
                  <>
                    - โพสเข้าคิว: <b>{pickedPropForQueue?.title || (pickedIdForQueue ? `ประกาศ #${pickedIdForQueue}` : "-")}</b>
                    <br />
                    - รหัส: <b>{pickedIdForQueue || "-"}</b>
                    <br />
                    - ทำเล: <b>{pickedPropForQueue ? pickLocationText(pickedPropForQueue) : "-"}</b>
                    <br />
                    - คิวได้สูงสุด <b>{queueMax}</b> รายการ
                  </>
                ) : (
                  <>
                    - ออโต้ดัน: <b>{pkg.intervalLabel}</b> <br />
                    - จำกัด active: <b>{pkg.autoMaxPosts}</b> โพส <br />
                    - ที่เลือก: <b>{selectedList.filter(canBoost).length}</b> โพส
                  </>
                )}
              </div>
            </div>
          </div>

          <StickyBar>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="text-muted" style={{ fontSize: 13 }}>
                {mode === "queue"
                  ? "กด “เพิ่มเข้าคิว” เพื่อบันทึกเป็นรอบถัดไป"
                  : mode === "add"
                  ? "กด “เพิ่มรายการออโต้” เพื่อเพิ่มเข้า active (ไม่รีเซ็ตเวลา)"
                  : "กด “เปิดออโต้” แล้วจะเห็นรายการกำลังดันอยู่ด้านบน"}
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  style={{ height: 46, padding: "0 16px", borderRadius: 12 }}
                  onClick={goBack}
                  disabled={isBusy}
                >
                  ย้อนกลับ
                </button>

                <button
                  type="button"
                  className="ud-btn btn-thme"
                  style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
                  onClick={primaryBtnAction}
                  disabled={primaryDisabled}
                >
                  {isBusy ? "กำลังทำ..." : primaryBtnText}
                </button>
              </div>
            </div>
          </StickyBar>
        </>
      ) : null}
    </Card>
  );
}
