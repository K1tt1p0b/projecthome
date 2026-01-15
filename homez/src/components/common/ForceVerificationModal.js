"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const ForceVerificationModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // 1. ✅ ปรับสถานะจำลอง
  const verificationStatus = 'verified'; // ลองเปลี่ยนเป็น 'rejected' เพื่อเทส
  const rejectionReason = "";

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  // 2. ✅ ถ้าผ่านแล้ว ปล่อยผ่าน
  if (verificationStatus === 'verified') return null;

  // 3. ✅ ข้อยกเว้น: ถ้าอยู่หน้า Verification แล้ว ให้แสดงเนื้อหาปกติ (ไม่ต้องบัง)
  // *** ตรวจสอบ path ให้ตรงกับไฟล์ page.js ของคุณ ***
  if (pathname === "/dashboard-verification") {
    return null;
  }

  // ------------------------------------------
  // ส่วนแสดงผล Modal (Rejected Case)
  // ------------------------------------------
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
             คุณไม่สามารถใช้งานส่วนอื่นได้ จนกว่าจะแก้ไขข้อมูลให้ถูกต้อง
          </p>

          {/* กล่องแสดงเหตุผล */}
          <div className="alert alert-danger border-danger text-start p-3 mb-4 bdrs12 bg-danger-subtle">
             <div className="d-flex align-items-center gap-2 mb-1">
                <i className="fas fa-info-circle text-danger" style={{ fontSize: '18px' }}></i>
                <h6 className="text-danger fw-bold fz15 mb-0" style={{ lineHeight: '1' }}>
                  สาเหตุที่ไม่อนุมัติ:
                </h6>
             </div>
             <div className="ms-4">
               <p className="mb-0 text-dark fz14" style={{ lineHeight: '1.5' }}>
                 {rejectionReason}
               </p>
             </div>
          </div>

          <button
            className="ud-btn btn-thm w-100"
            onClick={() => router.push("/dashboard-verification")}
          >
            ไปหน้าแก้ไขข้อมูล <i className="fal fa-arrow-right-long ms-2"></i>
          </button>

          <div className="mt-3">
            <button className="btn btn-link text-muted fz13" onClick={() => router.push("/")}>
              ออกจากระบบ
            </button>
          </div>

        </div>
      </div>
    );
  }

  // กรณีอื่นๆ (เช่น Pending หรือ Unverified แบบทั่วไป) อาจจะ return null หรือหน้าจอล็อคแบบเดิมก็ได้
  return null; 
};

export default ForceVerificationModal;