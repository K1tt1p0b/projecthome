"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import BootManual from "./boot-manual";
import BootAuto from "./boot-auto";

// ตัวอย่าง: ดึงจาก mock ในโปรเจกต์คุณ
import { propertyData } from "@/data/propertyData";

const toId = (v) => String(v ?? "").trim();

const findPropertyById = (id) => {
  const sid = toId(id);
  return (propertyData || []).find((p) => toId(p?.id) === sid) || null;
};

const parseMode = (m) => {
  const s = String(m || "").toLowerCase().trim();
  if (s === "auto") return "auto";
  return "manual";
};

export default function DashboardBoostProperty() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const properties = useMemo(() => propertyData || [], []);

  // -----------------------------
  // ✅ Tabs
  // -----------------------------
  const [tab, setTab] = useState("manual"); // "manual" | "auto"

  // -----------------------------
  // ✅ Separate selection states
  // -----------------------------
  const [manualSelectedMap, setManualSelectedMap] = useState({});
  const [autoSelectedMap, setAutoSelectedMap] = useState({});

  const manualSelectedIds = useMemo(
    () => Object.keys(manualSelectedMap).filter((k) => !!manualSelectedMap[k]),
    [manualSelectedMap]
  );
  const autoSelectedIds = useMemo(
    () => Object.keys(autoSelectedMap).filter((k) => !!autoSelectedMap[k]),
    [autoSelectedMap]
  );

  const manualSelectedList = useMemo(() => {
    const ids = new Set(manualSelectedIds);
    return (properties || []).filter((p) => ids.has(toId(p.id)));
  }, [properties, manualSelectedIds]);

  const autoSelectedList = useMemo(() => {
    const ids = new Set(autoSelectedIds);
    return (properties || []).filter((p) => ids.has(toId(p.id)));
  }, [properties, autoSelectedIds]);

  // -----------------------------
  // ✅ Actions: manual (เลือกได้ 1 หรือหลายก็ได้ แต่โดย UX แมนนวลคุณใช้ 1)
  // ถ้าแมนนวลต้องการ 1 รายการจริง ๆ ให้ทำแบบ single ก็ได้เหมือน auto
  // -----------------------------
  const manualToggleOne = (id) => {
    const sid = toId(id);
    setManualSelectedMap((prev) => ({ ...prev, [sid]: !prev?.[sid] }));
  };
  const manualClearSelected = () => setManualSelectedMap({});

  // -----------------------------
  // ✅ Actions: auto (ทำเป็น SINGLE-SELECT กัน multi)
  // - คลิกตัวเดิม: จะไม่ทำอะไร (หรือจะให้ unselect ก็ได้ แล้วแต่)
  // - คลิกตัวใหม่: เคลียร์เก่า แล้วเลือกตัวใหม่
  // -----------------------------
  const autoToggleOne = (id) => {
    const sid = toId(id);
    setAutoSelectedMap((prev) => {
      const already = !!prev?.[sid];
      if (already) return prev; // ถ้าอยากให้กดซ้ำแล้วเอาออก เปลี่ยนเป็น {}
      return { [sid]: true };
    });
  };
  const autoClearSelected = () => setAutoSelectedMap({});

  // -----------------------------
  // ✅ Deep-link:
  // 1) /dashboard-boost-property/2
  // 2) /dashboard-boost-property?propertyId=2
  // + รองรับ mode:
  // ?mode=manual | auto
  //
  // Behavior:
  // - ถ้ามี propertyId → เปิดแท็บตาม mode และ select ให้แท็บนั้น (แบบ 1 รายการ)
  // - แล้ว clean URL
  // -----------------------------
  useEffect(() => {
    // query
    const qid = sp?.get("propertyId");
    const modeQ = parseMode(sp?.get("mode"));

    // path /dashboard-boost-property/2
    const parts = (pathname || "").split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    const pathId = /^\d+$/.test(last) ? last : null;

    const id = qid || pathId;
    if (!id) return;

    const found = findPropertyById(id);
    if (!found) return;

    const pickedId = toId(found.id);

    // ✅ เลือกแท็บตาม mode
    setTab(modeQ);

    // ✅ set selection ให้ถูกแท็บ + เคลียร์อีกฝั่งกันงง
    if (modeQ === "auto") {
      setAutoSelectedMap({ [pickedId]: true });
      setManualSelectedMap({});
    } else {
      setManualSelectedMap({ [pickedId]: true });
      setAutoSelectedMap({});
    }

    // ✅ clean url
    router.replace("/dashboard-boost-property");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // ✅ Optional UX: clear selection when switching tab
  // - ถ้าอยากให้สลับแท็บแล้วไม่ค้าง ให้เปิดเคลียร์ได้
  // -----------------------------
  const switchTab = (next) => {
    setTab(next);

    // ถ้าอยาก “ไม่ค้าง” เวลาเปลี่ยนแท็บ ให้เปิด 2 บรรทัดนี้:
    // if (next === "manual") autoClearSelected();
    // if (next === "auto") manualClearSelected();
  };

  const goManual = () => switchTab("manual");
  const goAuto = () => switchTab("auto");

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      {/* Tabs header (bootstrap-ish) */}
      <ul className="nav nav-tabs mb30">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "manual" ? "active" : ""}`}
            type="button"
            onClick={() => switchTab("manual")}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            ⚡ ดันแบบแมนนวล
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "auto" ? "active" : ""}`}
            type="button"
            onClick={() => switchTab("auto")}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            🤖 ดันแบบออโต้
          </button>
        </li>
      </ul>

      {tab === "manual" ? (
        <BootManual
          properties={properties}
          selectedMap={manualSelectedMap}
          selectedIds={manualSelectedIds}
          selectedList={manualSelectedList}
          toggleOne={manualToggleOne}
          clearSelected={manualClearSelected}
          goAuto={goAuto}
        />
      ) : (
        <BootAuto
          properties={properties}
          selectedMap={autoSelectedMap}
          selectedIds={autoSelectedIds}
          selectedList={autoSelectedList}
          toggleOne={autoToggleOne}          // ✅ auto เป็น single-select แล้ว
          clearSelected={autoClearSelected}
          goManual={goManual}
        />
      )}
    </div>
  );
}
