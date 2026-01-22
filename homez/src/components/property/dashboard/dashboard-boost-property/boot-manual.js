"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { PACKAGES, getPackage } from "./boost/config/boostPackages";
import { LS_MANUAL } from "./boost/config/boostStorage";
import { readLS, writeLS, formatCountdown } from "./boost/utils/boostUtils";

// ✅ (fallback) ถ้าหน้านี้ไม่ได้รับ props รายการทรัพย์มา ให้ดึงจาก mock ได้
import { propertyData as mockData } from "@/data/propertyData";

// ✅ ให้หน้า "ทรัพย์สินของฉัน" อ่านออก (manual legacy store)
const BOOST_STORE_KEY = "landx_boost_state_v1";

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

const pickListingType = (p) =>
  p?.listingTypeLabel ||
  p?.listingTypeName ||
  p?.listingType ||
  p?.for ||
  p?.listingStatus ||
  p?.listing_status ||
  "-";

const pickPropertyType = (p) =>
  p?.propertyTypeLabel ||
  p?.propertyTypeName ||
  p?.propertyType ||
  p?.type ||
  p?.category ||
  "-";

// ===== boost_state_v1 helpers =====
function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
function readBoostStateV1() {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(BOOST_STORE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return parsed && typeof parsed === "object" ? parsed : {};
}
function writeBoostStateV1(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BOOST_STORE_KEY, JSON.stringify(store ?? {}));
}

// ===== Toast helpers =====
const tLoading = (msg) => toast.loading(msg);
const tUpdate = (id, type, msg) =>
  toast.update(id, { render: msg, type, isLoading: false, autoClose: 1600, closeButton: true });

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

function formatThaiDateTime(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String((d.getFullYear() + 543) % 100).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${min} น.`;
}

/**
 * ✅ BootManual (Confirm-only)
 *
 * แก้ปัญหา “กดดันแล้วไม่ดึงข้อมูล”:
 * - หน้านี้จะอ่าน propertyId จาก querystring (propertyId / id)
 * - ถ้า props ไม่ถูกส่งมา ก็ยังหา property จาก mockData ได้
 *
 * รองรับการเรียกแบบ:
 * /dashboard-boost-property?propertyId=123&mode=manual
 */
export default function BootManual({
  // optional จากหน้าอื่น (ถ้ามี)
  property, // ✅ ถ้าหน้าแม่ส่งมาให้โดยตรง ก็ใช้ตัวนี้
  properties,
  selectedIds,
  selectedList,

  clearSelected,

  packageKey = "pro",
  backTo = "/dashboard-my-properties",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===== time tick =====
  const [now, setNow] = useState(Date.now());
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // ===== package =====
  const pkg = useMemo(
    () => getPackage?.(packageKey) || PACKAGES?.[packageKey] || PACKAGES.pro,
    [packageKey]
  );

  const COOLDOWN_MS = Number(pkg.intervalMs || 0) || 0;
  const COOLDOWN_HOURS = COOLDOWN_MS ? COOLDOWN_MS / 3600000 : 0;

  // ===== get propertyId from URL first =====
  const queryId = useMemo(() => {
    const a = searchParams?.get("propertyId");
    const b = searchParams?.get("id");
    const c = searchParams?.get("pid");
    return String(a || b || c || "").trim();
  }, [searchParams]);

  // ===== resolve pickedId =====
  const pickedId = useMemo(() => {
    // priority: prop.property -> query -> selectedIds
    if (property?.id != null) return String(property.id);
    if (queryId) return queryId;
    const sid = String(selectedIds?.[0] || "").trim();
    return sid;
  }, [property, queryId, selectedIds]);

  // ===== resolve picked property =====
  const picked = useMemo(() => {
    // 1) if property prop given
    if (property && String(property?.id ?? "") === String(pickedId || "")) return property;

    // 2) from selectedList
    const fromSelected =
      (selectedList || []).find((p) => String(p?.id) === String(pickedId)) || selectedList?.[0] || null;
    if (fromSelected) return fromSelected;

    // 3) from properties prop
    const fromProps = (properties || []).find((p) => String(p?.id) === String(pickedId)) || null;
    if (fromProps) return fromProps;

    // 4) fallback mock
    const list = Array.isArray(mockData) ? mockData : [];
    return list.find((p) => String(p?.id) === String(pickedId)) || null;
  }, [property, selectedList, properties, pickedId]);

  // ===== summary =====
  const summary = useMemo(() => {
    if (!picked) return null;
    return {
      id: String(picked.id),
      title: safeText(picked.title, `ประกาศ #${picked.id}`),
      location: pickLocationText(picked),
      img: pickImage(picked),
      listingType: pickListingType(picked),
      propertyType: pickPropertyType(picked),
      status: safeText(picked.status),
    };
  }, [picked]);

  const boostable = useMemo(() => !!picked && canBoost(picked), [picked]);

  // ===== cooldown check =====
  const cooldown = useMemo(() => {
    if (!pickedId) return { lastBoostAt: 0, remain: 0, ready: false, nextAt: 0 };
    const store = readLS(LS_MANUAL, {});
    const last = Number(store?.[pickedId]?.lastBoostAt || 0);
    const nextAt = last ? last + COOLDOWN_MS : 0;
    const remain = nextAt ? Math.max(0, nextAt - now) : 0;
    return { lastBoostAt: last, nextAt, remain, ready: boostable && remain === 0 };
  }, [pickedId, COOLDOWN_MS, now, boostable]);

  const descText = useMemo(
    () => `${pkg.label}: Manual: ${pkg.manualFreeText} · คูลดาวน์ ${pkg.intervalLabel || "ตามแพ็ก"}`,
    [pkg]
  );

  // ===== submit =====
  const submit = async () => {
    if (isBusy) return;

    if (!pickedId) return toast.warn("ไม่พบ ID ของประกาศ");
    if (!picked) return toast.warn("ไม่พบประกาศที่เลือก");
    if (!boostable) return toast.warn("ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)");
    if (!cooldown.ready) return toast.warn(`ยังดันซ้ำไม่ได้ ต้องรออีก ${formatCountdown(cooldown.remain)}`);

    setIsBusy(true);
    const tid = tLoading("กำลังดันแมนนวล...");

    try {
      await new Promise((r) => setTimeout(r, 200));
      const ts = Date.now();

      // 1) ✅ store ของหน้า boost (manual)
      const manual = readLS(LS_MANUAL, {});
      const nextManual = manual && typeof manual === "object" ? manual : {};
      nextManual[pickedId] = { lastBoostAt: ts };
      writeLS(LS_MANUAL, nextManual);

      // 2) ✅ store ของหน้า "ทรัพย์สินของฉัน" (legacy/manual tag)
      const boostV1 = readBoostStateV1();
      boostV1[pickedId] = {
        ...(boostV1?.[pickedId] || {}),
        mode: "manual",
        lastBoostAt: ts,
        cooldownHours: COOLDOWN_HOURS || 0,
      };
      writeBoostStateV1(boostV1);

      tUpdate(tid, "success", `ดันแมนนวลสำเร็จ: ${summary?.title || `#${pickedId}`}`);

      clearSelected?.();
      router.push(backTo);
    } catch (e) {
      console.error(e);
      tUpdate(tid, "error", "ดันแมนนวลไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  // ===== UI badges =====
  const rightBadges = (
    <div className="d-flex gap-2 flex-wrap justify-content-end">
      <ToneBadge tone="purple">{pkg.label}</ToneBadge>

      {!picked ? (
        <ToneBadge tone="gray">ไม่พบประกาศ</ToneBadge>
      ) : boostable ? (
        cooldown.ready ? (
          <ToneBadge tone="green">พร้อมดัน</ToneBadge>
        ) : (
          <ToneBadge tone="red">รออีก {formatCountdown(cooldown.remain)}</ToneBadge>
        )
      ) : (
        <ToneBadge tone="red">ดันไม่ได้</ToneBadge>
      )}
    </div>
  );

  return (
    <Card title="ยืนยันการดันขึ้นฟีด (แมนนวล)" desc={descText} right={rightBadges}>
      {/* ===== Package info ===== */}
      <div
        style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }}
        className="mb20"
      >
        <div className="fw700 mb10">สิทธิ์แพ็กเกจของคุณ</div>
        <InfoRow label="แพ็กเกจ" value={safeText(pkg.label)} />
        <InfoRow label="Manual" value={safeText(pkg.manualFreeText)} />
        <InfoRow label="คูลดาวน์" value={safeText(pkg.intervalLabel || "-")} />
        <div className="text-muted mt10" style={{ fontSize: 12 }}>
          * หลังจากกดดัน จะติดคูลดาวน์ตามแพ็ก แล้วถึงจะดันซ้ำได้
        </div>
      </div>

      {/* ===== Property info ===== */}
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
              {summary?.img ? (
                <img src={summary.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                "ไม่มีรูป"
              )}
            </div>

            <div style={{ minWidth: 0, flex: "1 1 260px" }}>
              <div
                className="fw700"
                style={{
                  fontSize: 15,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {summary?.title || "-"}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: 12, lineHeight: 1.6 }}>
                รหัส: <b>{summary?.id || pickedId || "-"}</b> <br />
                ทำเล: <b>{summary?.location || "-"}</b>
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap justify-content-end" style={{ flex: "0 0 auto" }}>
              <ToneBadge tone={boostable ? "green" : "red"}>
                {picked ? (boostable ? "เผยแพร่แล้ว" : "ยังไม่เผยแพร่") : "ไม่พบประกาศ"}
              </ToneBadge>

              {cooldown.lastBoostAt ? (
                <ToneBadge tone="gray">ดันล่าสุด: {formatThaiDateTime(cooldown.lastBoostAt)}</ToneBadge>
              ) : null}
            </div>
          </div>

          <div className="mt12">
            <InfoRow label="ประเภทประกาศ" value={safeText(summary?.listingType)} />
            <InfoRow label="ประเภททรัพย์" value={safeText(summary?.propertyType)} />
            <InfoRow label="สถานะ" value={safeText(summary?.status)} />
            <InfoRow label="ID (อ้างอิง)" value={summary?.id || pickedId || "-"} />
          </div>
        </div>
      </div>

      <StickyBar>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="text-muted" style={{ fontSize: 13 }}>
            {!picked
              ? "ไม่พบประกาศ (เช็คว่ามี propertyId ใน URL หรือไม่)"
              : cooldown.ready
              ? "กด “ยืนยันดัน” เพื่อดันขึ้นฟีดทันที"
              : cooldown.remain > 0
              ? `ยังดันซ้ำไม่ได้ ต้องรออีก ${formatCountdown(cooldown.remain)}`
              : "ไม่สามารถดันได้"}
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="ud-btn btn-white2"
              style={{ height: 46, padding: "0 16px", borderRadius: 12 }}
              onClick={() => router.push(backTo)}
              disabled={isBusy}
            >
              ย้อนกลับ
            </button>

            <button
              type="button"
              className="ud-btn btn-thme"
              style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
              onClick={submit}
              disabled={isBusy || !picked || !cooldown.ready}
              title={!picked ? "ไม่พบทรัพย์" : !cooldown.ready ? "ยังติดคูลดาวน์/ดันไม่ได้" : ""}
            >
              {isBusy ? "กำลังดัน..." : "ยืนยันดัน"}
            </button>
          </div>
        </div>
      </StickyBar>
    </Card>
  );
}
