"use client";

import ForceVerificationModal from "@/components/common/ForceVerificationModal";

export default function DashboardLayout({ children }) {
  return (
    <>
      {/* 1. ใส่ตัวคุมกฎ (Modal บังคับ) ไว้ตรงนี้ */}
      <ForceVerificationModal />

      {/* 2. เนื้อหาของหน้า Dashboard ต่างๆ จะถูกแสดงตรง children นี้ */}
      {children}
    </>
  );
}