"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";

// ✅ ใช้ไฟล์ config เดียวกับ auto
import { PACKAGES, getPackage } from "./boost/config/boostPackages";
import { LS_MANUAL } from "./boost/config/boostStorage";
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

const PropertyPickRow = ({
  p,
  checked,
  onPick,
  noteRight,
  disabledAll,
  disabledReason,
  badgeText,
  badgeTone,
}) => {
  const boostable = canBoost(p);
  const disabled = disabledAll || !boostable || !!disabledReason;

  const finalBadgeText =
    badgeText || (!boostable ? "ดันไม่ได้" : checked ? "เลือกแล้ว" : "ดันได้");
  const finalBadgeTone =
    badgeTone || (!boostable ? "red" : checked ? "purple" : disabled ? "gray" : "green");

  return (
    <button
      type="button"
      className="btn text-start"
      onClick={!disabled ? onPick : undefined}
      style={{
        width: "100%",
        borderRadius: 14,
        padding: 12,
        border: checked ? "2px solid #0d6efd" : "1px solid #eee",
        background: checked ? "#F5F9FF" : "#fff",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      title={
        !boostable
          ? "ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)"
          : disabledReason
          ? disabledReason
          : "กดเพื่อเลือก"
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
          <ToneBadge tone={finalBadgeTone}>{finalBadgeText}</ToneBadge>
        </div>
      </div>
    </button>
  );
};

export default function BootManual({
  properties,
  selectedMap,
  selectedIds,
  selectedList,
  toggleOne,
  clearSelected,
  goAuto,
  initialStep = 1,
  packageKey = "business", // ✅ แนะนำให้ใช้แพ็กเดียวกับ auto
}) {
  const pkg = getPackage?.(packageKey) || PACKAGES?.[packageKey] || PACKAGES.business;

  // ✅ manual ใช้คูลดาวน์ = interval ของแพ็ก (หรือถ้าคุณอยากแยก ก็ใส่ cooldownMs ใน package ได้)
  const COOLDOWN_MS = Number(pkg.cooldownMs || pkg.intervalMs || 0) || 0;

  const [step, setStep] = useState(() => clampStep(initialStep));
  const [q, setQ] = useState("");
  const [now, setNow] = useState(Date.now());
  const [isBusy, setIsBusy] = useState(false);

  // ✅ เก็บ store ไว้ใน state แล้ว sync เป็นระยะ (ไม่ต้อง readLS ทุกวินาทีใน useMemo)
  const [manualStore, setManualStore] = useState(() => readLS(LS_MANUAL, {}));

  const syncManualStore = useCallback(() => {
    const s = readLS(LS_MANUAL, {});
    setManualStore(s && typeof s === "object" ? s : {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    syncManualStore();
  }, [syncManualStore]);

  // step sync
  useEffect(() => {
    const next = clampStep(initialStep);
    setStep(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStep]);

  // ✅ เลือกได้ทีละ 1 อันเสมอ
  const pickedBoostable = useMemo(() => selectedList.filter(canBoost)[0] || null, [selectedList]);
  const pickedCount = pickedBoostable ? 1 : 0;

  const pickedSummary = useMemo(() => {
    if (!pickedBoostable) return null;
    return {
      id: String(pickedBoostable.id),
      title: pickedBoostable.title || `ประกาศ #${pickedBoostable.id}`,
      location: pickLocationText(pickedBoostable),
    };
  }, [pickedBoostable]);

  // ถ้า step 2 แต่ไม่มีที่เลือก -> เด้งกลับ
  useEffect(() => {
    if (step === 2 && !pickedBoostable) setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedBoostable]);

  // ===== สถานะคูลดาวน์ของแต่ละโพส =====
  const cooldownInfoById = useMemo(() => {
    const m = {};
    (properties || []).forEach((p) => {
      const id = String(p.id);
      const last = manualStore?.[id]?.lastBoostAt || 0;
      const nextAt = last ? last + COOLDOWN_MS : 0;
      const remain = nextAt ? Math.max(0, nextAt - now) : 0;
      m[id] = { lastBoostAt: last, nextAt, remain };
    });
    return m;
  }, [properties, manualStore, COOLDOWN_MS, now]);

  const manualRunningList = useMemo(() => {
    const arr = (properties || [])
      .map((p) => {
        const id = String(p.id);
        const info = cooldownInfoById[id] || {};
        return {
          id,
          title: p.title,
          lastBoostAt: info.lastBoostAt || 0,
          remain: info.remain || 0,
        };
      })
      .filter((x) => x.lastBoostAt > 0 && x.remain > 0)
      .sort((a, b) => (a.remain || 0) - (b.remain || 0))
      .slice(0, 10);

    return arr;
  }, [properties, cooldownInfoById]);

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

  // ===== pick behavior =====
  const handlePickOne = (id, p) => {
    if (isBusy) return;
    if (!canBoost(p)) return;

    const sid = String(id);
    const already = selectedIds.includes(sid);

    if (already) {
      clearSelected();
      return;
    }

    clearSelected();
    toggleOne(sid);
  };

  // ===== picked cooldown =====
  const pickedCooldown = useMemo(() => {
    if (!pickedBoostable) return { remain: 0, ready: false };
    const id = String(pickedBoostable.id);
    const info = cooldownInfoById[id] || { remain: 0 };
    const remain = Number(info.remain || 0);
    const ready = canBoost(pickedBoostable) && remain === 0;
    return { remain, ready };
  }, [pickedBoostable, cooldownInfoById]);

  // ===== step nav =====
  const goNext = () => {
    if (step !== 1) return;
    if (!pickedBoostable) return toast.warn("กรุณาเลือกประกาศที่เผยแพร่แล้ว 1 รายการ");
    if (!pickedCooldown.ready) return toast.warn(`ยังดันซ้ำไม่ได้ ต้องรออีก ${formatCountdown(pickedCooldown.remain)}`);
    setStep(2);
  };

  const goBack = () => setStep(1);

  // ===== submit =====
  const submit = async () => {
    if (isBusy) return;
    if (!pickedBoostable) return toast.warn("กรุณาเลือกประกาศที่เผยแพร่แล้ว 1 รายการ");
    if (!pickedCooldown.ready) return toast.warn(`ยังดันซ้ำไม่ได้ ต้องรออีก ${formatCountdown(pickedCooldown.remain)}`);

    setIsBusy(true);
    const tid = tLoading("กำลังดันแมนนวล...");

    try {
      await new Promise((r) => setTimeout(r, 250));

      const id = String(pickedBoostable.id);
      const store = readLS(LS_MANUAL, {});
      const nextStore = store && typeof store === "object" ? store : {};
      nextStore[id] = { lastBoostAt: Date.now() };

      writeLS(LS_MANUAL, nextStore);
      setManualStore(nextStore);

      clearSelected();
      setStep(1);
      tUpdate(tid, "success", `ดันแมนนวลสำเร็จ: ${pickedBoostable.title}`);
    } catch (e) {
      tUpdate(tid, "error", "ดันแมนนวลไม่สำเร็จ");
    } finally {
      setIsBusy(false);
    }
  };

  // ===== Header =====
  const descText =
    `${pkg.label}: ` +
    `Auto ได้ ${pkg.autoMaxPosts} โพส · ` +
    `ออโต้ดัน ${pkg.intervalLabel} · ` +
    `Manual: ${pkg.manualFreeText}`;

  return (
    <Card
      title="ดันขึ้นฟีด (แมนนวล)"
      desc={descText}
      right={
        <div className="d-flex gap-2 flex-wrap justify-content-end">
          <ToneBadge tone="gray">เลือกแล้ว {pickedCount}/1</ToneBadge>
          <button
            type="button"
            className="ud-btn btn-white2"
            style={{ height: 44, padding: "0 14px", borderRadius: 12 }}
            onClick={goAuto}
            disabled={isBusy}
          >
            ไปแท็บออโต้
          </button>
        </div>
      }
    >
      <div className="d-flex gap-2 flex-wrap mb20">
        <StepPill active={step === 1} done={!!pickedBoostable} onClick={() => setStep(1)} disabled={false}>
          1) เลือกประกาศ
        </StepPill>
        <StepPill active={step === 2} done={false} onClick={() => setStep(2)} disabled={!pickedBoostable}>
          2) ยืนยัน
        </StepPill>
      </div>

      {/* ===== กล่องรายการติดคูลดาวน์ ===== */}
      <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }} className="mb20">
        <div className="fw700">รายการกำลังดันอยู่ (แมนนวล)</div>

        {manualRunningList.length === 0 ? (
          <div className="text-muted mt10" style={{ fontSize: 13 }}>
            ยังไม่มีรายการที่ติดคูลดาวน์
          </div>
        ) : (
          <div className="mt10" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {manualRunningList.map((x) => (
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
                    รหัส: {x.id} · ดันล่าสุด: {new Date(x.lastBoostAt).toLocaleString()}
                  </div>
                </div>

                <ToneBadge tone="red">ดันได้อีกใน {formatCountdown(x.remain)}</ToneBadge>
              </div>
            ))}
          </div>
        )}

        <div className="text-muted mt10" style={{ fontSize: 12 }}>
          * Manual: หลังจากกดดัน จะติดคูลดาวน์ตามแพ็กเกจ แล้วนับถอยหลังจนกดซ้ำได้
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
                ล้างที่เลือก {pickedCount ? "(1)" : ""}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div className="text-center text-muted py-4">ไม่พบประกาศตามเงื่อนไข</div>
            ) : (
              filtered.map((p) => {
                const id = String(p.id);

                const info = cooldownInfoById[id] || {};
                const remain = Number(info.remain || 0);

                const isCoolingDown = canBoost(p) && remain > 0;

                const disabledReason = !canBoost(p)
                  ? "ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)"
                  : isCoolingDown
                  ? `กำลังดันอยู่ — ดันได้อีกใน ${formatCountdown(remain)}`
                  : "";

                return (
                  <PropertyPickRow
                    key={id}
                    p={p}
                    checked={!!selectedMap?.[id]}
                    disabledAll={isBusy || isCoolingDown}
                    disabledReason={disabledReason}
                    noteRight={isCoolingDown ? <ToneBadge tone="red">{formatCountdown(remain)}</ToneBadge> : null}
                    badgeText={isCoolingDown ? "กำลังดัน" : undefined}
                    badgeTone={isCoolingDown ? "blue" : undefined}
                    onPick={() => handlePickOne(id, p)}
                  />
                );
              })
            )}
          </div>

          <StickyBar>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="text-muted" style={{ fontSize: 13 }}>
                {pickedBoostable ? (
                  pickedCooldown.ready ? (
                    <>
                      พร้อมดัน: <b>{pickedSummary?.title}</b> · <span>{pickedSummary?.location}</span>
                    </>
                  ) : (
                    <>
                      โพสนี้ดันได้อีกใน <b>{formatCountdown(pickedCooldown.remain)}</b>
                    </>
                  )
                ) : (
                  "เลือกประกาศที่ “เผยแพร่แล้ว” เพื่อดันขึ้นฟีด"
                )}
              </div>

              <button
                type="button"
                className="ud-btn btn-thme"
                style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
                onClick={goNext}
                disabled={isBusy || !pickedBoostable || !pickedCooldown.ready}
                title={!pickedBoostable ? "กรุณาเลือกประกาศ" : !pickedCooldown.ready ? "ยังติดคูลดาวน์" : ""}
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
            <div className="fw700 mb10">ยืนยันการดัน (แมนนวล)</div>

            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12, background: "#fff" }}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="fw700">สรุป</div>
                <ToneBadge tone="purple">{pkg.label}</ToneBadge>
              </div>

              <div className="mt10" style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                <div className="fw700" style={{ marginBottom: 6 }}>
                  {pickedSummary?.title || "-"}
                </div>
                <div className="text-muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
                  รหัส: <b>{pickedSummary?.id || "-"}</b>
                  <br />
                  ทำเล: <b>{pickedSummary?.location || "-"}</b>
                </div>
              </div>

              <div className="text-muted mt10" style={{ fontSize: 13, lineHeight: 1.7 }}>
                - Manual: <b>{pkg.manualFreeText}</b>
                <br />
                - สถานะตอนนี้:{" "}
                {pickedCooldown.ready ? (
                  <b style={{ color: "#0A7A3B" }}>พร้อมดัน</b>
                ) : (
                  <b style={{ color: "#374151" }}>รออีก {formatCountdown(pickedCooldown.remain)}</b>
                )}
              </div>
            </div>
          </div>

          <StickyBar>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="text-muted" style={{ fontSize: 13 }}>
                {pickedCooldown.ready
                  ? "กด “ยืนยันดัน” เพื่อดันขึ้นฟีดทันที"
                  : `ยังดันซ้ำไม่ได้ ต้องรออีก ${formatCountdown(pickedCooldown.remain)}`}
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
                  onClick={submit}
                  disabled={isBusy || !pickedBoostable || !pickedCooldown.ready}
                >
                  {isBusy ? "กำลังดัน..." : "ยืนยันดัน"}
                </button>
              </div>
            </div>
          </StickyBar>
        </>
      ) : null}
    </Card>
  );
}
