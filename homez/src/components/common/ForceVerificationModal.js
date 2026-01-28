"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const ForceVerificationModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // const user = { name: "Test User" };
  const user = null;

  // 1. ✅ ปรับสถานะจำลอง (ลองเปลี่ยนเล่นดูครับ: 'unverified', 'pending', 'rejected', 'verified')
  const verificationStatus = 'unverified';
  const rejectionReason = "";

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  if (!user) return null;

  // 2. ✅ ถ้าผ่านแล้ว (verified) ไม่ต้องทำอะไร ปล่อยผ่าน
  if (verificationStatus === 'verified') return null;

  // 3. ✅ ข้อยกเว้น: ถ้า user อยู่หน้ายืนยันตัวตนอยู่แล้ว ไม่ต้องแสดง Modal บัง
  // (เพื่อให้เขาดูสถานะ หรือกรอกข้อมูลได้)
  if (pathname === "/dashboard-verification") {
    return null;
  }

  // ==========================================
  // 🕒 CASE 1: Pending (กำลังตรวจสอบ)
  // ==========================================
  if (verificationStatus === 'pending') {
    return (
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(5px)",
          zIndex: 99999,
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <div className="bg-white p-5 bdrs12 text-center shadow-lg animate-up-1" style={{ maxWidth: '500px', width: '90%' }}>

          <div className="mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning-subtle text-warning" style={{ width: 80, height: 80 }}>
              <i className="fas fa-clock fz30"></i>
            </div>
          </div>

          <h3 className="mb-2 fw700">กำลังตรวจสอบเอกสาร</h3>
          <p className="text-muted mb-4">
            เราได้รับข้อมูลของคุณแล้ว เจ้าหน้าที่กำลังดำเนินการตรวจสอบ<br />
            (ใช้เวลาประมาณ 1-2 วันทำการ)
          </p>

          <button
            className="ud-btn btn-dark w-100"
            onClick={() => router.push("/dashboard-verification")}
          >
            ดูสถานะการตรวจสอบ <i className="fal fa-arrow-right-long ms-2"></i>
          </button>

          <div className="mt-3">
            <button className="btn btn-link text-muted fz13" onClick={() => router.push("/")}>
              กลับหน้าหลัก / ออกจากระบบ
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ❌ CASE 2: Rejected (ไม่ผ่านการอนุมัติ)
  // ==========================================
  if (verificationStatus === 'rejected') {
    return (
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(5px)",
          zIndex: 99999,
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <div className="bg-white p-5 bdrs12 text-center shadow-lg animate-up-1" style={{ maxWidth: '500px', width: '90%' }}>

          <div className="mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger" style={{ width: 80, height: 80 }}>
              <i className="fas fa-times fz30"></i>
            </div>
          </div>

          <h3 className="mb-2 fw700">เอกสารไม่ผ่านการอนุมัติ</h3>
          <p className="text-muted mb-4">
            กรุณาแก้ไขข้อมูลตามที่เจ้าหน้าที่แจ้งเพื่อเปิดใช้งานบัญชี
          </p>

          {/* กล่องแสดงเหตุผล */}
          <div className="alert alert-danger border-danger text-start p-3 mb-4 bdrs12 bg-danger-subtle">
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="fas fa-info-circle text-danger" style={{ fontSize: '18px' }}></i>
              <h6 className="text-danger fw-bold fz15 mb-0" style={{ lineHeight: '1' }}>
                สาเหตุ:
              </h6>
            </div>
            <div className="ms-4">
              <p className="mb-0 text-dark fz14" style={{ lineHeight: '1.5' }}>
                {rejectionReason || "เอกสารไม่ชัดเจน"}
              </p>
            </div>
          </div>

          <button
            className="ud-btn btn-thm w-100"
            onClick={() => router.push("/dashboard-verification")}
          >
            แก้ไขข้อมูลยืนยันตัวตน <i className="fal fa-arrow-right-long ms-2"></i>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // ⚠️ CASE 3: Unverified (ยังไม่เคยส่งเลย / ค่าเริ่มต้น)
  // ==========================================
  if (verificationStatus === 'unverified') { // หรือเช็คว่า !verificationStatus
    return (
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(5px)",
          zIndex: 99999,
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <div className="bg-white p-5 bdrs12 text-center shadow-lg animate-up-1" style={{ maxWidth: '500px', width: '90%' }}>

          <div className="mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary" style={{ width: 80, height: 80 }}>
              <i className="fas fa-shield-alt fz30"></i>
            </div>
          </div>

          <h3 className="mb-2 fw700">ยืนยันตัวตนเพื่อเริ่มใช้งาน</h3>
          <p className="text-muted mb-4">
            เพื่อความปลอดภัยและความน่าเชื่อถือ<br />กรุณายืนยันตัวตนก่อนเข้าใช้งาน Dashboard
          </p>

          <button
            className="ud-btn btn-thm w-100"
            onClick={() => router.push("/dashboard-verification")}
          >
            เริ่มยืนยันตัวตน (KYC) <i className="fal fa-arrow-right-long ms-2"></i>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ForceVerificationModal;