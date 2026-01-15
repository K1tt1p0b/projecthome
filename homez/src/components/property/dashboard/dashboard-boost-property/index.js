"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import BootManual from "./boot-manual";
import BootAuto from "./boot-auto";
import { propertyData } from "@/data/propertyData";

const toId = (v) => String(v ?? "").trim();

const findPropertyById = (id) => {
  const sid = toId(id);
  return (propertyData || []).find((p) => toId(p?.id) === sid) || null;
};

const parseMode = (m) => {
  const s = String(m || "").toLowerCase().trim();
  return s === "auto" ? "auto" : "manual";
};

const clampStep = (n) => {
  const s = Number(n) || 1;
  if (s < 1) return 1;
  if (s > 2) return 2;
  return s;
};

export default function DashboardBoostProperty() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const properties = useMemo(() => propertyData || [], []);

  const [tab, setTab] = useState("manual");

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

  const [manualStep, setManualStep] = useState(1);
  const [autoStep, setAutoStep] = useState(1);

  // ✅✅ ใช้แพ็กเดียวทั้งระบบ (ต่อไปเปลี่ยนให้ดึงจาก user จริง)
  const PACKAGE_KEY = "pro";

  // manual toggle (ปล่อยให้ boot-manual คุมเองได้)
  const manualToggleOne = (id) => {
    const sid = toId(id);
    setManualSelectedMap((prev) => ({ ...prev, [sid]: !prev?.[sid] }));
  };
  const manualClearSelected = () => setManualSelectedMap({});

  // ✅ auto: toggle multi (BootAuto จะเป็นคนกัน limit ตามแพ็กเอง)
  const autoToggleOne = (id) => {
    const sid = toId(id);
    setAutoSelectedMap((prev) => {
      const next = { ...(prev || {}) };
      if (next[sid]) {
        delete next[sid];
        return next;
      }
      next[sid] = true;
      return next;
    });
  };
  const autoClearSelected = () => setAutoSelectedMap({});

  // ✅ ให้ BootAuto บังคับ selection ให้ตรงกับ store ตอน lock/แสดง active
  const autoSelectOnly = (ids = []) => {
    const arr = Array.isArray(ids) ? ids.map(toId).filter(Boolean) : [];
    const next = {};
    arr.forEach((id) => (next[id] = true));
    setAutoSelectedMap(next);
  };

  useEffect(() => {
    const qid = sp?.get("propertyId");

    const parts = (pathname || "").split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    const pathId = /^\d+$/.test(last) ? last : null;

    const id = qid || pathId;
    if (!id) return;

    const found = findPropertyById(id);
    if (!found) return;

    const modeQ = parseMode(sp?.get("mode"));
    const stepQ = clampStep(sp?.get("step"));

    const pickedId = toId(found.id);
    setTab(modeQ);

    if (modeQ === "auto") {
      setAutoSelectedMap({ [pickedId]: true });
      setManualSelectedMap({});
      setAutoStep(stepQ);
      setManualStep(1);
    } else {
      setManualSelectedMap({ [pickedId]: true });
      setAutoSelectedMap({});
      setManualStep(stepQ);
      setAutoStep(1);
    }

    router.replace("/dashboard-boost-property");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchTab = (next) => setTab(next);
  const goManual = () => switchTab("manual");
  const goAuto = () => switchTab("auto");

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <ul className="nav nav-tabs mb30">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "manual" ? "active" : ""}`}
            type="button"
            onClick={() => switchTab("manual")}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            ดันแบบแมนนวล
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "auto" ? "active" : ""}`}
            type="button"
            onClick={() => switchTab("auto")}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            ดันแบบออโต้
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
          initialStep={manualStep}
          packageKey={PACKAGE_KEY} // ✅ ส่งแพ็กเดียวกัน
        />
      ) : (
        <BootAuto
          properties={properties}
          selectedMap={autoSelectedMap}
          selectedIds={autoSelectedIds}
          selectedList={autoSelectedList}
          toggleOne={autoToggleOne}
          clearSelected={autoClearSelected}
          goManual={goManual}
          initialStep={autoStep}
          packageKey={PACKAGE_KEY} // ✅ ส่งแพ็กเดียวกัน
          selectOnly={autoSelectOnly}
        />
      )}
    </div>
  );
}
