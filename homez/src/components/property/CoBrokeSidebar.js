"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CoBrokeSidebar = ({
  property,
  userRole // รับค่าจากหน้าหลัก (แต่เราจะแกล้งๆ เมินมันเพื่อทดสอบ)
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // =========================================================
  // 🛠️🛠️ โซนทดสอบ (Testing Zone) 🛠️🛠️
  // วิธีใช้: อยากเป็นอะไร ให้แก้ตัวแปร 'currentRole' ด้านล่างนี้

  const currentRole = "agent";  // 👈 ลองเปิดบรรทัดนี้: จะเห็นกล่อง (Agent)
  // const currentRole = "user";   // 👈 ลองเปิดบรรทัดนี้: กล่องจะหายไป (User)

  //const currentRole = userRole; // 👈 (ค่าจริง) ใช้ตัวนี้เมื่อเทสเสร็จแล้ว!!
  // =========================================================


  // 1. เช็คว่าทรัพย์นี้เปิดรับ Co-Broke ไหม?
  const isAccept = property?.acceptCoBroke === true || String(property?.acceptCoBroke) === "true";

  // 🔥🔥🔥 เงื่อนไขการซ่อน (เช็คจาก currentRole ที่เรากำหนดข้างบน) 🔥🔥🔥
  if (!isAccept || currentRole !== "agent") {
    return null; // หายวับไปกับตา
  }

  // --- ถ้าผ่านลงมาได้ แปลว่าเป็น Agent ---

  const type = property?.commissionType === 'amount' ? 'บาท' : '%';
  // แปลงเป็นจำนวนเต็ม
  const value = property?.commissionValue
    ? parseInt(property?.commissionValue).toLocaleString()
    : '-';

  const handleContact = () => {
    setLoading(true);
    setTimeout(() => {
      // ✅✅ แก้ Path ตรงนี้ให้แล้วครับ (/dashboard-message)
      router.push(`/dashboard-message?interest_property=${property?.id}`);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="sidebar-widget p-4 bg-white border rounded-4 mb-4 shadow-sm" style={{ borderTop: '4px solid #eb6753' }}>

      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 45, height: 45, backgroundColor: '#eb675320', color: '#eb6753' }}>
          <i className="fas fa-handshake" style={{ fontSize: '20px' }}></i>
        </div>
        <div>
          <h6 className="title mb-0 fw-bold" style={{ fontSize: '16px' }}>ยินดีรับ Co-Broker</h6>
          <small className="text-muted" style={{ fontSize: '12px' }}>ช่วยขายทรัพย์นี้รับทันที</small>
        </div>
      </div>

      {/* Commission */}
      <div className="p-3 rounded-3 mb-3 text-center" style={{ backgroundColor: '#f9f9f9', border: '1px dashed #ddd' }}>
        <span className="d-block text-muted mb-1" style={{ fontSize: '13px' }}>ค่าตอบแทน / คอมมิชชั่น</span>
        <h4 className="fw-bold m-0" style={{ color: '#eb6753' }}>{value} {type}</h4>
      </div>

      {/* Button */}
      <div className="d-grid gap-2">
        <button
          className="ud-btn btn-thm w-100 d-flex justify-content-center align-items-center gap-2"
          onClick={handleContact}
          disabled={loading}
        >
          {loading ? 'กำลังเชื่อมต่อ...' : (
            <>
              <i className="far fa-comment-dots"></i>
              ส่งลิงก์สนใจช่วยขายทรัพย์นี้ (แชท)
            </>
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
};

export default CoBrokeSidebar;