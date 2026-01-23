// boot-auto.js
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

// ✅ normalize store (single active + single queue)
function normalizeAutoStore(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const pkgKey = typeof s.packageKey === "string" ? s.packageKey : "";

  // ---- legacy ----
  const oldItems = s.items && typeof s.items === "object" ? s.items : {};
  const oldOrder = Array.isArray(s.order) ? s.order.map(String).filter(Boolean) : [];
  const oldQueue = Array.isArray(s.queue) ? s.queue.map(String).filter(Boolean) : [];

  const legacyActiveId =
    typeof s.activePropertyId === "string" && s.activePropertyId
      ? s.activePropertyId
      : oldOrder.find((id) => !!oldItems?.[id]) || Object.keys(oldItems)[0] || "";

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
    packageKey: pkgKey,

    activePropertyId: String(legacyActiveId || ""),
    queuedPropertyId: String(legacyQueuedId || ""),

    activeStartedAt: Number(activeStartedAt || 0),
    cooldownEndAt: Number(cooldownEndAt || 0),

    cancelAfterCooldown: !!s.cancelAfterCooldown,
  };
}

function hasActive(store) {
  return !!store?.activePropertyId;
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

  const hasAct = useMemo(() => hasActive(autoStore), [autoStore]);
  const curActiveId = useMemo(() => String(autoStore?.activePropertyId || ""), [autoStore]);
  const queuedId = useMemo(() => String(autoStore?.queuedPropertyId || ""), [autoStore]);

  // ✅ effective package (กันกลางคันเพี้ยน)
  const effectivePkgKey = useMemo(() => {
    if (hasAct && autoStore?.packageKey) return autoStore.packageKey;
    return packageKey || autoStore?.packageKey || "pro";
  }, [hasAct, autoStore?.packageKey, packageKey]);

  const pkg = useMemo(
    () => getPackage?.(effectivePkgKey) || PACKAGES?.[effectivePkgKey] || PACKAGES.pro,
    [effectivePkgKey]
  );

  const intervalMs = Number(pkg.intervalMs || 0) || 0;

  const cooldownEndAt = Number(autoStore?.cooldownEndAt || 0);
  const remainMs = cooldownEndAt ? Math.max(0, cooldownEndAt - now) : 0;

  // TODO: countdown (future use)
  // const countdownText = formatCountdown(remainMs);

  const nextTimeText = useMemo(() => {
    if (!cooldownEndAt) return "-";
    const d = new Date(cooldownEndAt);
    return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  }, [cooldownEndAt]);

  const intent = useMemo(() => {
    if (!pId) return { type: "none", label: "ไม่พบโพส" };
    if (!boostable) return { type: "blocked", label: "ดันไม่ได้ (ต้องเผยแพร่แล้ว)" };

    if (!hasAct) return { type: "start", label: "จะเริ่มดันออโต้ด้วยโพสนี้" };
    if (pId === curActiveId) return { type: "same", label: "โพสนี้กำลังดันอยู่แล้ว" };

    // ✅ ต้องยกเลิก Active ก่อนถึงจะเลือกโพสอื่นได้
    if (hasAct && !autoStore?.cancelAfterCooldown) {
      return {
        type: "blocked_need_cancel",
        label: `ต้องยกเลิกออโต้ของโพส #${curActiveId || "-"} ก่อน ถึงจะเลือกโพสอื่นได้`,
      };
    }

    // ✅ NEW: ถ้ามีคิวอยู่แล้ว ห้ามทับ ต้องยกเลิกคิวก่อน
    if (queuedId && queuedId !== pId) {
      return {
        type: "blocked_need_cancel_queue",
        label: `ตอนนี้มีโพส #${queuedId} อยู่ในคิวแล้ว — ต้องยกเลิกคิวก่อน ถึงจะเลือกโพสอื่นได้`,
      };
    }

    // ✅ ถ้าคิวเป็นโพสเดียวกัน ให้แค่บอกว่าอยู่ในคิวแล้ว
    if (queuedId && queuedId === pId) {
      return { type: "queued_same", label: "โพสนี้อยู่ในคิวแล้ว" };
    }

    return { type: "queue", label: "จะเข้าคิวรอบถัดไป" };
  }, [pId, boostable, hasAct, curActiveId, queuedId, autoStore?.cancelAfterCooldown]);

  const confirm = async () => {
    if (isBusy) return;
    if (!pId || !p) return toast.warn("ไม่พบทรัพย์ที่จะดัน");
    if (!boostable) return toast.warn("ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)");
    if (intent.type === "same") return toast.info("โพสนี้กำลังดันอยู่แล้ว");

    if (intent.type === "blocked_need_cancel") return toast.warn(intent.label);
    if (intent.type === "blocked_need_cancel_queue") return toast.warn(intent.label);
    if (intent.type === "queued_same") return toast.info("โพสนี้อยู่ในคิวแล้ว");

    setIsBusy(true);
    const tid = tLoading("กำลังตั้งค่าออโต้...");

    try {
      await new Promise((r) => setTimeout(r, 180));

      const raw = readLS(LS_AUTO, AUTO_FALLBACK);
      const store = normalizeAutoStore({ ...AUTO_FALLBACK, ...raw });

      const pkgNow = getPackage?.(effectivePkgKey) || PACKAGES?.[effectivePkgKey] || PACKAGES.pro;
      const intervalNow = Number(pkgNow.intervalMs || 0) || 0;

      // 1) start
      if (!store.activePropertyId) {
        const startAt = Date.now();

        const next = {
          enabled: true,
          packageKey: effectivePkgKey,

          activePropertyId: pId,
          queuedPropertyId: "",

          activeStartedAt: startAt,
          cooldownEndAt: startAt + intervalNow,

          cancelAfterCooldown: false,
        };

        writeLS(LS_AUTO, next);
        setAutoStore(next);

        tUpdate(tid, "success", `เปิดออโต้แล้ว: ${p.title || `#${pId}`}`);
        if (typeof onDone === "function") onDone();
        return;
      }

      // 2) already active
      if (pId === store.activePropertyId) {
        tUpdate(tid, "info", "โพสนี้กำลังดันอยู่แล้ว");
        return;
      }

      // ✅ กันซ้ำ เผื่อ state เปลี่ยนระหว่างทาง
      if (store.activePropertyId && !store.cancelAfterCooldown) {
        tUpdate(
          tid,
          "warning",
          `ต้องยกเลิกออโต้ของโพส #${store.activePropertyId} ก่อน ถึงจะเลือกโพสอื่นได้`
        );
        return;
      }

      // ✅ NEW: ถ้ามีคิวอยู่แล้ว ห้ามทับ
      if (store.queuedPropertyId && String(store.queuedPropertyId) !== String(pId)) {
        tUpdate(
          tid,
          "warning",
          `ตอนนี้มีโพส #${store.queuedPropertyId} อยู่ในคิวแล้ว — ต้องยกเลิกคิวก่อน ถึงจะเลือกโพสอื่นได้`
        );
        return;
      }

      // 3) set queued (คิวได้ 1 โพส)
      const next = {
        ...store,
        enabled: true,
        packageKey: store.packageKey || effectivePkgKey,
        queuedPropertyId: pId,
      };

      writeLS(LS_AUTO, next);
      setAutoStore(next);

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
          ) : intent.type === "queue" ? (
            <ToneBadge tone="purple">เข้าคิว</ToneBadge>
          ) : intent.type === "queued_same" ? (
            <ToneBadge tone="gray">อยู่ในคิวแล้ว</ToneBadge>
          ) : intent.type === "same" ? (
            <ToneBadge tone="gray">กำลังดันอยู่</ToneBadge>
          ) : intent.type === "blocked_need_cancel" ? (
            <ToneBadge tone="red">ต้องยกเลิกก่อน</ToneBadge>
          ) : intent.type === "blocked_need_cancel_queue" ? (
            <ToneBadge tone="red">ต้องยกเลิกคิวก่อน</ToneBadge>
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

        {hasAct ? (
          <div className="text-muted mt10" style={{ fontSize: 12, lineHeight: 1.6 }}>
            * ตอนนี้มีออโต้กำลังทำงานอยู่ <b>1</b> โพส (Active: <b>#{curActiveId || "-"}</b>)
            {cooldownEndAt ? (
              <>
                {" "}
                · ดันได้อีกครั้งเวลา <b>{nextTimeText}</b>
                {/* TODO: countdown (future use)
                    · รอบถัดไปใน <b>{formatCountdown(remainMs)}</b>
                */}
              </>
            ) : null}
            <br />
            {autoStore?.cancelAfterCooldown ? (
              <>
                * คุณกดยกเลิกแล้ว → เลือกโพสอื่นเข้าคิวได้ <b>1</b> โพส (เริ่มหลังครบเวลา)
                {queuedId ? (
                  <>
                    {" "}
                    · ตอนนี้คิวคือ <b>#{queuedId}</b>
                  </>
                ) : null}
              </>
            ) : (
              <>* ต้องกดยกเลิกออโต้ของโพส Active ก่อน ถึงจะเลือกโพสอื่นได้</>
            )}
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
              {hasAct && curActiveId ? <ToneBadge tone="gray">Active ตอนนี้: #{curActiveId}</ToneBadge> : null}
              {hasAct && queuedId ? <ToneBadge tone="purple">คิว: #{queuedId}</ToneBadge> : null}
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
              : intent.type === "queue"
              ? "กด “ยืนยันออโต้” เพื่อเข้าคิวรอบถัดไป (คิวได้ 1 โพส)"
              : intent.type === "queued_same"
              ? "โพสนี้อยู่ในคิวแล้ว"
              : intent.type === "blocked_need_cancel"
              ? `ต้องยกเลิกออโต้ของโพส #${curActiveId || "-"} ก่อน`
              : intent.type === "blocked_need_cancel_queue"
              ? `ต้องยกเลิกคิวโพส #${queuedId || "-"} ก่อน`
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
              disabled={
                isBusy ||
                !p ||
                !boostable ||
                intent.type === "same" ||
                intent.type === "none" ||
                intent.type === "blocked" ||
                intent.type === "blocked_need_cancel" ||
                intent.type === "blocked_need_cancel_queue" ||
                intent.type === "queued_same"
              }
              title={
                !p
                  ? "ไม่พบทรัพย์"
                  : !boostable
                  ? "ต้องเผยแพร่แล้ว"
                  : intent.type === "same"
                  ? "กำลังดันอยู่แล้ว"
                  : intent.type === "blocked_need_cancel"
                  ? `ต้องยกเลิกออโต้ของโพส #${curActiveId || "-"} ก่อน`
                  : intent.type === "blocked_need_cancel_queue"
                  ? `ต้องยกเลิกคิวโพส #${queuedId || "-"} ก่อน`
                  : intent.type === "queued_same"
                  ? "โพสนี้อยู่ในคิวแล้ว"
                  : ""
              }
            >
              {isBusy ? "กำลังตั้งค่า..." : "ยืนยันออโต้"}
            </button>
          </div>
        </div>
      </StickyBar>
    </Card>
  );
}
