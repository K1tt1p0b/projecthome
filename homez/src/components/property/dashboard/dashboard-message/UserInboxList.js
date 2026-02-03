import React from "react";
import Image from "next/image";

// ✅ 1. รับ Props จากตัวแม่ (ChatDashboardClient)
const UserInboxList = ({ data, activeUser, setActiveUser }) => {

  // กันเหนียว: ถ้าไม่มีข้อมูลส่งมา ให้ไม่แสดงอะไรเลย (ป้องกัน Error)
  if (!data) return null;

  return (
    <ul className="list-unstyled mb-0 px-3 pt-3">
      {/* ✅ 2. วนลูปจาก data ที่ส่งมาจากตัวแม่ */}
      {data.map((user) => (
        <li
          key={user.id}
          // ✅ 3. เมื่อคลิก ให้สั่งตัวแม่ว่า "เลือกคนนี้นะ"
          onClick={() => setActiveUser(user)}

          className={`d-flex align-items-center p-3 mb-2 rounded-3 position-relative transition-all cursor-pointer ${
            // ✅ 4. เช็คว่าคนนี้คือคนปัจจุบันหรือไม่ (เทียบ ID)
            activeUser?.id === user.id
              ? 'bg-light border-start border-4 border-danger shadow-sm' // สไตล์ตอนถูกเลือก
              : 'hover-bg-f9 bg-white border border-light' // สไตล์ปกติ
            }`}
          style={{
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {/* Avatar Area */}
          <div className="position-relative me-3 flex-shrink-0">
            <Image
              width={50}
              height={50}
              className="rounded-circle object-fit-cover"
              src={user.image || "/images/inbox/ms1.png"} // กันภาพแตก ใส่ภาพสำรองไว้
              alt={user.name}
            />

            {/* จุดเขียวบอก Online */}
            {user.status === 'online' && (
              <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
            )}

            {/* Notification Badge (ถ้ามี field notif ส่งมา) */}
            {user.notif > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white shadow-sm" style={{ fontSize: '10px' }}>
                {user.notif}
              </span>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-grow-1 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className={`mb-0 text-truncate fz14 ${activeUser?.id === user.id ? 'fw-bold text-dark' : 'fw-medium'}`}>
                {user.name}
              </h6>
              <small className="text-muted fz11 opacity-75">{user.time}</small>
            </div>
            <p className={`mb-0 text-truncate fz13 ${activeUser?.id === user.id ? 'text-dark' : 'text-muted'}`}>
              {user.message}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserInboxList;