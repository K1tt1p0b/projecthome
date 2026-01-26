"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CoBrokeSidebar = ({ 
  property,
  userRole // 👈 รับค่า Role เข้ามาตรวจสอบ (ค่าที่เป็นไปได้: "agent", "user", null)
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. เช็คว่าทรัพย์นี้เปิดรับ Co-Broke ไหม?
  const isAccept = property?.acceptCoBroke === true || String(property?.acceptCoBroke) === "true";
  
  // 🔥🔥🔥 จุดสำคัญ: เงื่อนไขการซ่อน 🔥🔥🔥
  // ถ้าทรัพย์ไม่รับ Co-Broke  OR  คนดูไม่ใช่ Agent (รวมถึงไม่ได้ Login)
  // ให้ return null (คือไม่แสดงผลอะไรเลย หายไปดื้อๆ)
  if (!isAccept || userRole !== "agent") {
      return null;
  }

  // --- ถ้าผ่านเงื่อนไขข้างบนมาได้ แปลว่าเป็น Agent แน่นอน ก็จะแสดงผลด้านล่างนี้ ---

  // ดึงค่าคอมมิชชั่น
  const type = property?.commissionType === 'amount' ? 'บาท' : '%';
  const value = property?.commissionValue ? Number(property?.commissionValue).toLocaleString() : '-';

  const handleContact = () => {
    setLoading(true);
    setTimeout(() => {
        router.push(`/dashboard/message?interest_property=${property?.id}`);
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

      {/* แสดงค่าคอมมิชชั่น (เห็นเฉพาะ Agent) */}
      <div className="p-3 rounded-3 mb-3 text-center" style={{ backgroundColor: '#f9f9f9', border: '1px dashed #ddd' }}>
         <span className="d-block text-muted mb-1" style={{ fontSize: '13px' }}>ค่าตอบแทน / คอมมิชชั่น</span>
         <h4 className="fw-bold m-0" style={{ color: '#eb6753' }}>{value} {type}</h4>
      </div>

      {/* ปุ่มกดส่งลิงก์เข้าแชท */}
      <div className="d-grid gap-2">
         <button 
            className="ud-btn btn-thm w-100 d-flex justify-content-center align-items-center gap-2" 
            onClick={handleContact}
            disabled={loading}
         >
            {loading ? (
                'กำลังเชื่อมต่อ...' 
            ) : (
                <>
                    <i className="far fa-comment-dots"></i> 
                    ส่งลิงก์สนใจทรัพย์นี้ (แชท)
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