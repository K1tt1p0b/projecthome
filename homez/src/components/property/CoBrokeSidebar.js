"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CoBrokeSidebar = ({
  property,
  userRole,      // 1. รับค่า Role จริง
  verifyStatus   // 2. ✅ รับค่าสถานะยืนยันตัวตนจริง (เช่น 'verified', 'pending', 'unverified')
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // =========================================================
  // 🛠️ โซน Config (ปรับตรงนี้เพื่อเทส)
  // =========================================================

  // --- 1. จำลอง Role ---
  const currentRole = "guest";
  // const currentRole = userRole; // 👈 (จุดที่ 1) ถ้าใช้จริง ให้เปิดบรรทัดนี้

  // --- 2. จำลองสถานะยืนยันตัวตน ---
  // ลองเปลี่ยนเป็น 'unverified' หรือ 'pending' ดูครับ กล่องจะหายไป
  const currentVerify = "verified";
  // const currentVerify = verifyStatus; // 👈 (จุดที่ 2) ถ้าใช้จริง ให้เปิดบรรทัดนี้

  // --- 3. จำลองการรับ Co-broke ---
  // ลองเปลี่ยนเป็น true/false เพื่อดูสีส้ม/สีฟ้า
  const isAccept = false;
  // const isAccept = property?.acceptCoBroke === true || String(property?.acceptCoBroke) === "true"; // 👈 (จุดที่ 3) ถ้าใช้จริง ให้เปิดบรรทัดนี้

  // =========================================================

  // 🔥🔥🔥 SECURITY CHECK 🔥🔥🔥
  // เช็ค 2 เด้ง: ต้องเป็น Agent AND ต้อง Verified แล้วเท่านั้น
  if (currentRole !== "agent" || currentVerify !== "verified") {
    return null; // ซ่อนทันที ถ้าเงื่อนไขไม่ครบ
  }

  // ฟังก์ชันกดปุ่ม
  const handleContact = (contactType) => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/dashboard-message?interest_property=${property?.id}&type=${contactType}`);
      setLoading(false);
    }, 500);
  };

  // เตรียมค่าตัวเลข
  const commType = property?.commissionType === 'amount' ? 'บาท' : '%';
  const commValue = property?.commissionValue ? parseInt(property?.commissionValue).toLocaleString() : '-';

  // -----------------------------------------------------------
  // 🟧 CASE 1: รับ Co-broke (สีส้ม)
  // -----------------------------------------------------------
  if (isAccept) {
    return (
      <div className="sidebar-widget p-4 bg-white border rounded-4 mb-4 shadow-sm" style={{ borderTop: '5px solid #eb6753' }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 45, height: 45, backgroundColor: '#eb675320', color: '#eb6753' }}>
            <i className="fas fa-handshake" style={{ fontSize: '20px' }}></i>
          </div>
          <div>
            <h6 className="title mb-0 fw-bold" style={{ fontSize: '16px' }}>ยินดีรับ Co-Broker</h6>
            <small className="text-muted" style={{ fontSize: '12px' }}>ช่วยขายทรัพย์นี้รับทันที</small>
          </div>
        </div>

        <div className="p-3 rounded-3 mb-3 text-center" style={{ backgroundColor: '#f9f9f9', border: '1px dashed #eb6753' }}>
          <span className="d-block text-muted mb-1" style={{ fontSize: '13px' }}>ค่าตอบแทน / คอมมิชชั่น</span>
          <h4 className="fw-bold m-0" style={{ color: '#eb6753' }}>{commValue} {commType}</h4>
        </div>

        <div className="d-grid gap-2">
          <button
            className="ud-btn w-100 d-flex justify-content-center align-items-center gap-2"
            style={{ backgroundColor: '#eb6753', color: 'white', border: 'none' }}
            onClick={() => handleContact('cobroke')}
            disabled={loading}
          >
            {loading ? 'กำลังเชื่อมต่อ...' : (
              <> <i className="far fa-comment-dots"></i> ส่งลิงก์สนใจช่วยขาย (แชท) </>
            )}
          </button>
        </div>

        <div className="mt-3 text-center">
          <small className="text-muted" style={{ fontSize: '11px' }}>
            <i className="fas fa-shield-alt me-1 text-success"></i>
            ระบบจะส่งข้อมูลทรัพย์นี้ไปที่ห้องแชททันที
          </small>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // 🟦 CASE 2: ไม่รับ Co-broke (สีฟ้า)
  // -----------------------------------------------------------
  return (
    <div className="sidebar-widget p-4 bg-white border rounded-4 mb-4 shadow-sm" style={{ borderTop: '5px solid #0d6efd' }}>
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 45, height: 45, backgroundColor: '#0d6efd20', color: '#0d6efd' }}>
          <i className="fas fa-user-tie" style={{ fontSize: '20px' }}></i>
        </div>
        <div>
          <h6 className="title mb-0 fw-bold" style={{ fontSize: '16px' }}>ติดต่อเจ้าของทรัพย์</h6>
          <small className="text-muted" style={{ fontSize: '12px' }}>สอบถามข้อมูลเพิ่มเติม (Agent Only)</small>
        </div>
      </div>

      <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#f0f7ff', border: '1px solid #cce5ff' }}>
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted fz13">Status:</span>
          <span className="badge bg-secondary fw-normal">ไม่ได้รับ Co-broke</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted fz13">Owner:</span>
          <span className="text-dark fw-bold fz13">{property?.ownerName || 'Verified Owner'}</span>
        </div>
      </div>

      <div className="d-grid gap-2">
        <button
          className="ud-btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
          onClick={() => handleContact('agent_inquiry')}
          disabled={loading}
        >
          {loading ? 'กำลังเชื่อมต่อ...' : (
            <> <i className="far fa-comment-alt"></i> ทักแชทสอบถาม (Chat) </>
          )}
        </button>
      </div>

      <div className="mt-3 text-center">
        <small className="text-muted" style={{ fontSize: '11px' }}>
          <i className="far fa-eye-slash me-1"></i>
          เห็นเฉพาะ User ที่เป็น Agent เท่านั้น
        </small>
      </div>
    </div>
  );
};

export default CoBrokeSidebar;