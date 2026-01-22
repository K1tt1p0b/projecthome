"use client";

import React, { useEffect, useMemo, useState } from "react";
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

const pickImage = (p) => {
  return (
    p?.cover ||
    p?.image ||
    p?.imageSrc ||
    (Array.isArray(p?.images) ? p.images[0] : null) ||
    (Array.isArray(p?.gallery) ? p.gallery[0] : null) ||
    ""
  );
};

const safeText = (v, fallback = "-") => {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
};

function dedupeKeepOrder(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr || []) {
    const s = String(x || "").trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

// ✅ get ids จาก order ก่อน ถ้าไม่มีค่อย fallback items
function getActiveIdsFromStore(store) {
  const items = store?.items && typeof store.items === "object" ? store.items : {};
  let order = Array.isArray(store?.order) ? store.order.map(String).filter(Boolean) : [];
  order = order.filter((id) => !!items?.[id]);
  if (order.length > 0) return order;
  return Object.keys(items).map(String);
}

// ✅ normalize store
function normalizeAutoStore(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const pkgKey = typeof s.packageKey === "string" ? s.packageKey : "";

  return {
    enabled: !!s.enabled,
    packageKey: pkgKey,
    items: s.items && typeof s.items === "object" ? s.items : {},
    queue: Array.isArray(s.queue) ? s.queue.map((x) => String(x)).filter(Boolean) : [],
    order: Array.isArray(s.order) ? s.order.map((x) => String(x)).filter(Boolean) : [],
  };
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
        padding: "6px 10px",
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

const InfoRow = ({ label, value }) => (
  <div className="d-flex justify-content-between gap-3 py-2" style={{ borderBottom: "1px dashed #eee" }}>
    <div className="text-muted" style={{ fontSize: 13 }}>
      {label}
    </div>
    <div className="fw600" style={{ fontSize: 13, textAlign: "right" }}>
      {value}
    </div>
  </div>
);

/**
 * ✅ BootAuto (Confirm-only)
 */
export default function BootAuto({ property, packageKey = "pro", onDone, onCancel }) {
  const [now, setNow] = useState(Date.now());
  const [isBusy, setIsBusy] = useState(false);

  const [autoStore, setAutoStore] = useState(() => {
    const s = readLS(LS_AUTO, AUTO_FALLBACK);
    return normalizeAutoStore({ ...AUTO_FALLBACK, ...s });
  });

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const s = readLS(LS_AUTO, AUTO_FALLBACK);
      setAutoStore(normalizeAutoStore({ ...AUTO_FALLBACK, ...s }));
    }, 800);
    return () => clearInterval(t);
  }, []);

  const p = property || null;
  const pId = useMemo(() => (p?.id != null ? String(p.id) : ""), [p]);
  const boostable = useMemo(() => !!p && canBoost(p), [p]);
  const locationText = useMemo(() => (p ? pickLocationText(p) : "-"), [p]);
  const imageUrl = useMemo(() => (p ? pickImage(p) : ""), [p]);

  const activeIds = useMemo(() => getActiveIdsFromStore(autoStore), [autoStore]);
  const hasActive = activeIds.length > 0;
  const curActiveId = hasActive ? String(activeIds[0]) : "";

  // ✅ effective package (กันกลางคันเพี้ยน)
  const effectivePkgKey = useMemo(() => {
    if (hasActive && autoStore?.packageKey) return autoStore.packageKey;
    return packageKey || autoStore?.packageKey || "pro";
  }, [hasActive, autoStore?.packageKey, packageKey]);

  const pkg = useMemo(
    () => getPackage?.(effectivePkgKey) || PACKAGES?.[effectivePkgKey] || PACKAGES.pro,
    [effectivePkgKey]
  );

  const intervalMs = Number(pkg.intervalMs || 0) || 0;

  const runningList = useMemo(() => {
    const items = autoStore?.items || {};
    const order = activeIds.length ? activeIds : Object.keys(items).map(String);

    return order
      .filter((id) => items?.[id])
      .map((id) => {
        const it = items[id];
        const remain = it?.nextRunAt ? Math.max(0, it.nextRunAt - now) : 0;
        return { id: String(id), lastRunAt: it?.lastRunAt || 0, nextRunAt: it?.nextRunAt || 0, remain };
      });
  }, [autoStore, activeIds, now]);

  const curRemain = runningList?.[0]?.remain || 0;
  const maxActive = Number(pkg.autoMaxPosts || 1) || 1;

  const intent = useMemo(() => {
    if (!pId) return { type: "none", label: "ไม่พบโพส" };
    if (!boostable) return { type: "blocked", label: "ดันไม่ได้ (ต้องเผยแพร่แล้ว)" };

    if (!hasActive) return { type: "start", label: "จะเริ่มดันออโต้ด้วยโพสนี้" };
    if (pId === curActiveId) return { type: "same", label: "โพสนี้กำลังดันอยู่แล้ว" };

    if (activeIds.length < maxActive) {
      return { type: "add", label: `จะเพิ่มเข้าออโต้ (active) (${activeIds.length + 1}/${maxActive})` };
    }

    return { type: "queue", label: `active เต็มแล้ว (${activeIds.length}/${maxActive}) → จะเข้าคิวรอบถัดไป` };
  }, [pId, boostable, hasActive, curActiveId, activeIds.length, maxActive]);

  const confirm = async () => {
    if (isBusy) return;
    if (!pId || !p) return toast.warn("ไม่พบทรัพย์ที่จะดัน");
    if (!boostable) return toast.warn("ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)");
    if (intent.type === "same") return toast.info("โพสนี้กำลังดันอยู่แล้ว");

    setIsBusy(true);
    const tid = tLoading("กำลังตั้งค่าออโต้...");

    try {
      await new Promise((r) => setTimeout(r, 180));

      const raw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw });

      const ids = getActiveIdsFromStore(store);
      const hasItems = ids.length > 0;
      const currentActive = hasItems ? String(ids[0]) : "";

      const pkgNow = getPackage?.(effectivePkgKey) || PACKAGES?.[effectivePkgKey] || PACKAGES.pro;
      const maxNow = Number(pkgNow.autoMaxPosts || 1) || 1;
      const intervalNow = Number(pkgNow.intervalMs || 0) || 0;

      // 1) start
      if (!hasItems) {
        const startAt = Date.now();
        store.enabled = true;
        store.packageKey = effectivePkgKey;

        store.items = {
          [pId]: { enabledAt: startAt, lastRunAt: 0, nextRunAt: startAt + intervalNow },
        };
        store.order = [pId];
        store.queue = [];

        writeLS(LS_AUTO, store);
        setAutoStore(store);

        tUpdate(tid, "success", `เปิดออโต้แล้ว: ${p.title || `#${pId}`}`);
        if (typeof onDone === "function") onDone();
        return;
      }

      // 2) already active
      if (pId === currentActive) {
        tUpdate(tid, "info", "โพสนี้กำลังดันอยู่แล้ว");
        return;
      }

      // 2.1) add to active (ยังไม่เต็ม)
      if (ids.length < maxNow) {
        const base = store.items?.[currentActive] || {};
        const baseEnabledAt = base.enabledAt || Date.now();
        const baseNextRunAt = base.nextRunAt || Date.now() + intervalNow;

        store.items = store.items || {};
        store.items[pId] = store.items[pId] || {
          enabledAt: baseEnabledAt,
          lastRunAt: 0,
          nextRunAt: baseNextRunAt,
        };

        const nextOrder = dedupeKeepOrder([...ids, pId]);
        store.order = nextOrder;

        store.packageKey = store.packageKey || effectivePkgKey;

        writeLS(LS_AUTO, store);
        setAutoStore(store);

        tUpdate(tid, "success", "เพิ่มเข้าออโต้ (active) แล้ว");
        if (typeof onDone === "function") onDone();
        return;
      }

      // 2.2) full -> queue (✅ แก้: ไม่ทับกันแล้ว + เข้าได้หลายตัวทุกแพ็ก)
      const QUEUE_MAX = 50; // จะให้มาก/น้อยปรับได้
      const nextQueue = dedupeKeepOrder([...(store.queue || []), pId]).slice(0, QUEUE_MAX);
      store.queue = nextQueue;

      store.packageKey = store.packageKey || effectivePkgKey;

      writeLS(LS_AUTO, store);
      setAutoStore(store);

      tUpdate(tid, "success", "เพิ่มเข้าคิวแล้ว");
      if (typeof onDone === "function") onDone();
    } catch (e) {
      tUpdate(tid, "error", "ตั้งค่าออโต้ไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  const descText =
    `${pkg.label}: ` +
    `Auto ได้ ${pkg.autoMaxPosts} โพส · ` +
    `ออโต้ดัน ${pkg.intervalLabel} · ` +
    `Manual: ${pkg.manualFreeText}`;

  return (
    <Card
      title="ยืนยันการดันขึ้นฟีด (ออโต้)"
      desc={descText}
      right={
        <div className="d-flex gap-2 flex-wrap justify-content-end">
          <ToneBadge tone="purple">{pkg.label}</ToneBadge>
          {intent.type === "start" ? (
            <ToneBadge tone="green">เริ่มออโต้</ToneBadge>
          ) : intent.type === "add" ? (
            <ToneBadge tone="blue">เพิ่มเข้า active</ToneBadge>
          ) : intent.type === "queue" ? (
            <ToneBadge tone="purple">เข้าคิว</ToneBadge>
          ) : intent.type === "same" ? (
            <ToneBadge tone="gray">กำลังดันอยู่</ToneBadge>
          ) : (
            <ToneBadge tone="red">ดันไม่ได้</ToneBadge>
          )}
        </div>
      }
    >
      <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }} className="mb20">
        <div className="fw700 mb10">สิทธิ์แพ็กเกจของคุณ</div>
        <InfoRow label="แพ็กเกจ" value={safeText(pkg.label)} />
        <InfoRow label="Auto ได้สูงสุด" value={`${pkg.autoMaxPosts} โพส`} />
        <InfoRow label="รอบดันออโต้" value={safeText(pkg.intervalLabel)} />
        <InfoRow label="Manual" value={safeText(pkg.manualFreeText)} />

        {hasActive ? (
          <div className="text-muted mt10" style={{ fontSize: 12, lineHeight: 1.6 }}>
            * ตอนนี้มีออโต้กำลังทำงานอยู่ <b>{activeIds.length}</b> โพส
            {curRemain > 0 ? (
              <>
                {" "}
                · รอบถัดไปใน <b>{formatCountdown(curRemain)}</b>
              </>
            ) : null}
            <br />
            * เมื่อ active เต็มแล้ว โพสใหม่จะถูกเพิ่มไปที่ <b>คิว</b> และจะสลับเมื่อถึงรอบถัดไป
          </div>
        ) : (
          <div className="text-muted mt10" style={{ fontSize: 12 }}>
            * ยังไม่มีรายการออโต้ กดยืนยันเพื่อเริ่มรอบแรก
          </div>
        )}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }}>
        <div className="fw700 mb10">รายละเอียดทรัพย์ที่จะดัน</div>

        <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12, background: "#fff" }}>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <div
              style={{
                width: 86,
                height: 64,
                borderRadius: 12,
                border: "1px solid #eee",
                background: "#f3f4f6",
                overflow: "hidden",
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                "ไม่มีรูป"
              )}
            </div>

            <div style={{ minWidth: 0, flex: "1 1 260px" }}>
              <div className="fw700" style={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {safeText(p?.title, `ประกาศ #${pId || "-"}`)}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: 12, lineHeight: 1.6 }}>
                รหัส: <b>{pId || "-"}</b> <br />
                ทำเล: <b>{locationText}</b>
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap justify-content-end" style={{ flex: "0 0 auto" }}>
              <ToneBadge tone={boostable ? "green" : "red"}>{boostable ? "เผยแพร่แล้ว" : "ยังไม่เผยแพร่"}</ToneBadge>
              {hasActive && curActiveId ? <ToneBadge tone="gray">Active ตอนนี้: #{curActiveId}</ToneBadge> : null}
            </div>
          </div>

          <div className="mt12">
            <InfoRow label="ประเภทประกาศ" value={safeText(p?.listingType || p?.listing_status || p?.listingStatus)} />
            <InfoRow label="ประเภททรัพย์" value={safeText(p?.propertyType || p?.type)} />
            <InfoRow label="ผลลัพธ์เมื่อยืนยัน" value={safeText(intent.label)} />
          </div>
        </div>
      </div>

      <StickyBar>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="text-muted" style={{ fontSize: 13 }}>
            {intent.type === "start"
              ? "กด “ยืนยันออโต้” เพื่อเริ่มดันอัตโนมัติ"
              : intent.type === "add"
              ? "กด “ยืนยันออโต้” เพื่อเพิ่มเข้า active (ไม่รีเซ็ตเวลา)"
              : intent.type === "queue"
              ? "กด “ยืนยันออโต้” เพื่อเพิ่มเข้าคิวรอบถัดไป"
              : intent.type === "same"
              ? "โพสนี้กำลังดันอยู่แล้ว"
              : "ไม่สามารถดันได้"}
          </div>

          <div className="d-flex gap-2">
            {typeof onCancel === "function" ? (
              <button
                type="button"
                className="ud-btn btn-white2"
                style={{ height: 46, padding: "0 16px", borderRadius: 12 }}
                onClick={onCancel}
                disabled={isBusy}
              >
                ยกเลิก
              </button>
            ) : null}

            <button
              type="button"
              className="ud-btn btn-thme"
              style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
              onClick={confirm}
              disabled={isBusy || !p || !boostable || intent.type === "same" || intent.type === "none" || intent.type === "blocked"}
              title={!p ? "ไม่พบทรัพย์" : !boostable ? "ต้องเผยแพร่แล้ว" : intent.type === "same" ? "กำลังดันอยู่แล้ว" : ""}
            >
              {isBusy ? "กำลังตั้งค่า..." : "ยืนยันออโต้"}
            </button>
          </div>
        </div>
      </StickyBar>
    </Card>
  );
}
