"use client";
import React, { useState } from "react";
import Image from "next/image";

const UserInboxList = () => {
  // สร้าง State จำลองว่ากำลังเลือกคนไหนอยู่ (Default คนแรก id: 1)
  const [activeId, setActiveId] = useState(1);

  const inboxUsers = [
    { id: 1, name: "Darlene Robertson", msg: "สอบถามเรื่องบ้านเดี่ยว...", time: "35 mins", notif: 2, img: "/images/inbox/ms1.png", online: true },
    { id: 2, name: "Jane Cooper", msg: "ขอบคุณครับ", time: "1 hr", notif: 0, img: "/images/inbox/ms2.png", online: false },
    { id: 3, name: "Arlene McCoy", msg: "นัดดูห้องวันไหนดีคะ?", time: "2 hrs", notif: 5, img: "/images/inbox/ms3.png", online: true },
    { id: 4, name: "Albert Flores", msg: "ราคาลดได้อีกไหมครับ", time: "1 day", notif: 1, img: "/images/inbox/ms4.png", online: false },
  ];

  return (
    <ul className="list-unstyled mb-0 px-3 pt-3"> {/* ✅ เพิ่ม Padding รอบๆ ให้ดูไม่ติดขอบ */}
      {inboxUsers.map((user) => (
        <li
          key={user.id}
          onClick={() => setActiveId(user.id)} // ✅ คลิกแล้วเปลี่ยนสถานะ Active
          className={`d-flex align-items-center p-3 mb-2 rounded-3 position-relative transition-all cursor-pointer ${activeId === user.id
              ? 'bg-light border-start border-4 border-danger shadow-sm' // สไตล์ตอนถูกเลือก (Active)
              : 'hover-bg-f9 bg-white border border-light' // สไตล์ปกติ
            }`}
          style={{
            cursor: 'pointer', // เปลี่ยนเมาส์เป็นรูปมือ
            transition: 'all 0.2s ease'
          }}
        >
          {/* Avatar Area */}
          <div className="position-relative me-3 flex-shrink-0">
            <Image
              width={50}
              height={50}
              className="rounded-circle object-fit-cover"
              src={user.img}
              alt={user.name}
            />
            {/* จุดเขียวบอก Online */}
            {user.online && (
              <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
            )}

            {/* Notification Badge */}
            {user.notif > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white shadow-sm" style={{ fontSize: '10px' }}>
                {user.notif}
              </span>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-grow-1 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className={`mb-0 text-truncate fz14 ${activeId === user.id ? 'fw-bold text-dark' : 'fw-medium'}`}>
                {user.name}
              </h6>
              <small className="text-muted fz11 opacity-75">{user.time}</small>
            </div>
            <p className={`mb-0 text-truncate fz13 ${activeId === user.id ? 'text-dark' : 'text-muted'}`}>
              {user.msg}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserInboxList;