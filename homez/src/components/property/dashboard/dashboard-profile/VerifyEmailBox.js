"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

// รับค่า email และสถานะ isVerified มาจาก Parent Component
const VerifyEmailBox = ({ email = "user@example.com", isVerified = false }) => {
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0); // เวลานับถอยหลัง (วินาที)

  const handleResend = async () => {
    if (isVerified) return;
    
    setSending(true);
    // --- จำลองการยิง API ส่งอีเมล ---
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success(`ส่งลิงก์ยืนยันใหม่ไปที่ ${email} แล้ว!`);
    setSending(false);

    // เริ่มนับถอยหลัง 60 วินาที กันกดรัว
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      
      {/* Header & Status */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb20 gap-2">
        <h4 className="title fz17 mb0">ยืนยันอีเมล (Verify Email)</h4>
        
        {isVerified ? (
            <span className="badge bg-success-subtle text-success border-0 px-3 py-2 rounded-pill fz13 fw600">
                <i className="fas fa-check-circle me-1"></i> ยืนยันแล้ว
            </span>
        ) : (
            <span className="badge bg-warning-subtle text-warning border-0 px-3 py-2 rounded-pill fz13 fw600">
                <i className="fas fa-exclamation-circle me-1"></i> รอการยืนยัน
            </span>
        )}
      </div>

      {/* Content Box */}
      <div className="p-3 bg-light rounded-3 border d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
         
         {/* ส่วนโชว์อีเมล */}
         <div className="d-flex align-items-center gap-3 w-100">
            <div className="bg-white p-3 rounded-circle shadow-sm text-thm flex-shrink-0">
                <i className="fas fa-envelope fz24"></i>
            </div>
            <div className="overflow-hidden">
                <p className="mb-0 text-muted fz13">อีเมลของคุณ</p>
                <h5 className="mb-0 fw600 text-dark text-truncate" title={email}>
                    {email}
                </h5>
            </div>
         </div>

         {/* ปุ่มกดส่งอีกครั้ง (โชว์เฉพาะตอนยังไม่ยืนยัน) */}
         {!isVerified && (
             <button 
                className={`ud-btn btn-dark btn-sm flex-shrink-0 ${cooldown > 0 ? 'disabled' : ''}`} 
                onClick={handleResend}
                disabled={sending || cooldown > 0}
                style={{ minWidth: '160px' }}
             >
                {sending ? (
                    <><i className="fas fa-spinner fa-spin me-2"></i> กำลังส่ง...</>
                ) : cooldown > 0 ? (
                    <><i className="fas fa-clock me-2"></i> รอ {cooldown} วินาที</>
                ) : (
                    <><i className="fas fa-paper-plane me-2"></i> ส่งลิงก์อีกครั้ง</>
                )}
             </button>
         )}
      </div>
      
      {!isVerified && (
        <p className="text-muted fz13 mt-3 mb-0">
            <i className="fas fa-info-circle me-1"></i> หากไม่ได้รับอีเมลภายใน 5 นาที กรุณาตรวจสอบในกล่องจดหมายขยะ (Spam/Junk) หรือกดปุ่มส่งอีกครั้ง
        </p>
      )}

    </div>
  );
};

export default VerifyEmailBox;