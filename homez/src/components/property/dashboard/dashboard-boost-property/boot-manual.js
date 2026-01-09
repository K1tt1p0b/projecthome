"use client";

import React, { useMemo, useState } from "react";

const canBoost = (p) => String(p?.status || "") === "เผยแพร่แล้ว";

const pickLocationText = (p) => {
  const full = p?.location?.fullText;
  if (full) return full;
  const province = p?.location?.province || "";
  const district = p?.location?.district || "";
  const sub = p?.location?.subdistrict || "";
  return [sub, district, province].filter(Boolean).join(" · ") || "-";
};

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

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const PropertyPickRow = ({ p, checked, onPick }) => {
  const boostable = canBoost(p);
  return (
    <button
      type="button"
      className="btn text-start"
      onClick={boostable ? onPick : undefined}
      style={{
        width: "100%",
        borderRadius: 14,
        padding: 12,
        border: checked ? "2px solid #0d6efd" : "1px solid #eee",
        background: checked ? "#F5F9FF" : "#fff",
        opacity: boostable ? 1 : 0.55,
        cursor: boostable ? "pointer" : "not-allowed",
      }}
      title={boostable ? "กดเพื่อเลือก" : "ดันไม่ได้ (ต้องเป็นสถานะเผยแพร่แล้ว)"}
    >
      <div className="d-flex align-items-center justify-content-between gap-2">
        <div style={{ minWidth: 0 }}>
          <div className="fw700">{p.title}</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            รหัส: {p.id} · {pickLocationText(p)}
          </div>
        </div>
        <ToneBadge tone={boostable ? "green" : "red"}>{boostable ? "ดันได้" : "ดันไม่ได้"}</ToneBadge>
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
}) {
  const [step, setStep] = useState(1);
  const [q, setQ] = useState("");

  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());

  const pickedBoostable = useMemo(() => selectedList.filter(canBoost)[0] || null, [selectedList]);
  const pickedCount = pickedBoostable ? 1 : 0;

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

  const handlePickOne = (id, p) => {
    if (!canBoost(p)) return;

    const sid = String(id);
    const already = selectedIds.includes(sid);

    // ✅ manual เลือกได้ 1: ถ้ากดตัวเดิม = ยกเลิก, ถ้ากดตัวใหม่ = clear แล้วเลือกใหม่
    if (already) {
      clearSelected();
      return;
    }

    clearSelected();
    toggleOne(sid);
  };

  const validateDate = () => {
    if (!startDate || !endDate) return "กรุณาเลือกวันที่เริ่มและวันที่จบ";
    if (endDate < startDate) return "วันที่จบต้องไม่น้อยกว่าวันที่เริ่ม";
    return "";
  };

  const goNext = () => {
    if (step === 1) {
      if (!pickedBoostable) return alert("กรุณาเลือกประกาศที่เผยแพร่แล้ว 1 รายการ");
      setStep(2);
      return;
    }
    if (step === 2) {
      const err = validateDate();
      if (err) return alert(err);
      setStep(3);
    }
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    if (!pickedBoostable) return alert("กรุณาเลือกประกาศที่เผยแพร่แล้ว 1 รายการ");
    const err = validateDate();
    if (err) return alert(err);

    alert(
      `ยืนยันดันแมนนวล (จำลอง)\n` +
        `- ประกาศ: ${pickedBoostable.title} (รหัส ${pickedBoostable.id})\n` +
        `- ช่วงวัน: ${startDate} ถึง ${endDate}`
    );

    clearSelected();
    setStep(1);
  };

  const stepDone1 = !!pickedBoostable;
  const stepDone2 = !validateDate();

  return (
    <Card
      title="ดันขึ้นฟีด (แมนนวล)"
      desc="เลือก 1 ประกาศ → เลือกช่วงวัน → ยืนยัน"
      right={
        <div className="d-flex gap-2 flex-wrap justify-content-end">
          <ToneBadge tone="gray">เลือกแล้ว {pickedCount}/1</ToneBadge>
          <button
            type="button"
            className="ud-btn btn-white2"
            style={{ height: 44, padding: "0 14px", borderRadius: 12 }}
            onClick={goAuto}
          >
            ไปแท็บออโต้
          </button>
        </div>
      }
    >
      <div className="d-flex gap-2 flex-wrap mb20">
        <StepPill active={step === 1} done={stepDone1} onClick={() => setStep(1)}>
          1) เลือกประกาศ
        </StepPill>
        <StepPill active={step === 2} done={stepDone2} onClick={() => setStep(2)} disabled={!stepDone1}>
          2) เลือกช่วงวัน
        </StepPill>
        <StepPill active={step === 3} done={false} onClick={() => setStep(3)} disabled={!stepDone1}>
          3) ยืนยัน
        </StepPill>
      </div>

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
              />
            </div>

            <div className="col-lg-4 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="ud-btn btn-white2"
                style={{ height: 48, borderRadius: 12, padding: "0 14px" }}
                onClick={clearSelected}
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
                return (
                  <PropertyPickRow
                    key={id}
                    p={p}
                    checked={!!selectedMap?.[id]}
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
                  <>
                    เลือกแล้ว: <b>{pickedBoostable.title}</b> (รหัส <b>{pickedBoostable.id}</b>)
                  </>
                ) : (
                  "เลือกประกาศที่ “เผยแพร่แล้ว” เพื่อดันขึ้นฟีด"
                )}
              </div>

              <button
                type="button"
                className="ud-btn btn-thme"
                style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
                onClick={goNext}
                disabled={!pickedBoostable}
              >
                ถัดไป
              </button>
            </div>
          </StickyBar>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }}>
            <div className="fw700 mb10">เลือกช่วงวันที่ต้องการดันขึ้นฟีด</div>

            <div className="row g-3">
              <div className="col-lg-6">
                <label className="form-label fw600">วันที่เริ่ม</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  min={todayISO()}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ height: 48, borderRadius: 12 }}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label fw600">วันที่จบ</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  min={startDate || todayISO()}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ height: 48, borderRadius: 12 }}
                />
              </div>
            </div>

            {validateDate() ? (
              <div className="mt10" style={{ color: "#A40000", fontSize: 13 }}>
                *{validateDate()}
              </div>
            ) : null}
          </div>

          <StickyBar>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <ToneBadge tone="green">เลือก 1 รายการ</ToneBadge>
                <ToneBadge tone="blue">
                  {startDate} → {endDate}
                </ToneBadge>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  style={{ height: 46, padding: "0 16px", borderRadius: 12 }}
                  onClick={goBack}
                >
                  ย้อนกลับ
                </button>

                <button
                  type="button"
                  className="ud-btn btn-thme"
                  style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
                  onClick={goNext}
                  disabled={!!validateDate()}
                >
                  ไปยืนยัน
                </button>
              </div>
            </div>
          </StickyBar>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, background: "#fafafa" }}>
            <div className="fw700 mb10">ตรวจสอบก่อนยืนยัน</div>

            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12, background: "#fff" }}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="fw700">สรุปการดันแมนนวล</div>
                <ToneBadge tone="purple">ดันขึ้นฟีด</ToneBadge>
              </div>

              <div className="text-muted mt10" style={{ fontSize: 13, lineHeight: 1.7 }}>
                - ประกาศ: <b>{pickedBoostable?.title || "-"}</b> (รหัส <b>{pickedBoostable?.id || "-"}</b>) <br />
                - ช่วงวัน: <b>{startDate}</b> ถึง <b>{endDate}</b>
              </div>
            </div>
          </div>

          <StickyBar>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="text-muted" style={{ fontSize: 13 }}>
                พร้อมยืนยันดันแมนนวล: <b>{pickedBoostable?.id || "-"}</b> · {startDate} → {endDate}
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  style={{ height: 46, padding: "0 16px", borderRadius: 12 }}
                  onClick={goBack}
                >
                  ย้อนกลับ
                </button>

                <button
                  type="button"
                  className="ud-btn btn-thme"
                  style={{ height: 46, padding: "0 18px", borderRadius: 12 }}
                  onClick={submit}
                  disabled={!pickedBoostable || !!validateDate()}
                >
                  ยืนยันดัน
                </button>
              </div>
            </div>
          </StickyBar>
        </>
      ) : null}
    </Card>
  );
}
