"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function DashboardBoostProperty() {
  const router = useRouter();
  const sp = useSearchParams();

  // ✅ เปลี่ยนแพ็กตรงนี้ที่เดียว
  const PACKAGE_KEY = "pro"; // starter | pro | business

  const qPropertyId = toId(sp?.get("propertyId"));
  const qMode = parseMode(sp?.get("mode"));

  const [mode, setMode] = useState("manual");
  const [property, setProperty] = useState(null);

  // ===== load property จาก query =====
  useEffect(() => {
    if (!qPropertyId) return;

    const found = findPropertyById(qPropertyId);
    if (!found) {
      setProperty(null);
      setMode("manual");
      return;
    }

    setProperty(found);
    setMode(qMode);
  }, [qPropertyId, qMode]);

  // ===== หลังยืนยัน กลับหน้าทรัพย์สินของฉัน =====
  const goBack = () => {
    router.push("/dashboard-my-properties");
  };

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      {mode === "manual" ? (
        <BootManual
          property={property}
          packageKey={PACKAGE_KEY}
          onDone={goBack}
          onCancel={goBack}
        />
      ) : (
        <BootAuto
          property={property}
          packageKey={PACKAGE_KEY}
          onDone={goBack}
          onCancel={goBack}
        />
      )}
    </div>
  );
}
