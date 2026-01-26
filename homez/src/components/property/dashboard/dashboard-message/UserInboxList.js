"use client";
import Image from "next/image";
import React from "react";

// ✅ 1. เพิ่มข้อมูลจำลอง "property" เข้าไปใน users
const users = [
  {
    name: "Darlene Robertson",
    position: "Agent",
    imageUrl: "/images/inbox/ms1.png",
    notificationStatus: "online",
    time: "35 mins",
    property: {
      title: "บ้านเดี่ยว ลาดพร้าว 71 (Renovate)",
      price: "5.9 MB",
    },
  },
  {
    name: "Jane Cooper",
    position: "Owner",
    imageUrl: "/images/inbox/ms2.png",
    notificationStatus: "none",
    time: "1 hr",
    property: {
      title: "คอนโดติด BTS จตุจักร",
      price: "3.2 MB",
    },
  },
  {
    name: "Arlene McCoy",
    position: "Buyer",
    imageUrl: "/images/inbox/ms3.png",
    notificationStatus: "away",
    time: "2 hrs",
    property: {
      title: "ทาวน์โฮม รามอินทรา",
      price: "2.8 MB",
    },
  },
  {
    name: "Albert Flores",
    position: "Agent",
    imageUrl: "/images/inbox/ms4.png",
    notificationStatus: "busy",
    time: "1 day",
    property: {
      title: "ที่ดินเปล่า นครนายก",
      price: "1.5 MB",
    },
  },
  // ... (ข้อมูลอื่นๆ ถ้ามีก็ใส่ property เพิ่มเข้าไปแบบด้านบนครับ)
];

const UserItem = ({ user }) => {
  return (
    <div className="list-item">
      <a href="#">
        <div className="d-flex align-items-start position-relative">
          {/* Avatar */}
          <Image
            width={50}
            height={50}
            className="img-fluid float-start rounded-circle mr10"
            src={user.imageUrl}
            alt={`${user.name}'s profile`}
          />

          <div className="d-flex w-100 justify-content-between">
            {/* ข้อมูลชื่อและทรัพย์ */}
            <div className="d-inline-block overflow-hidden" style={{ maxWidth: "160px" }}>
              <div className="fz14 fw600 dark-color ff-heading mb-0 text-truncate">
                {user.name}
              </div>

              {/* ✅ 2. แสดงชื่อทรัพย์และราคาแทนตำแหน่งงาน */}
              {user.property ? (
                <>
                  <div className="d-flex align-items-center gap-1 mt-1">
                    <i className="fas fa-home text-danger" style={{ fontSize: "10px" }}></i>
                    <small
                      className="text-dark text-truncate fw-bold"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      {user.property.title}
                    </small>
                  </div>
                  <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                    ราคา: {user.property.price}
                  </small>
                </>
              ) : (
                <p className="preview">{user.position}</p> // Fallback ถ้าไม่มีข้อมูลทรัพย์
              )}
            </div>

            {/* Notification & Time */}
            <div className="iul_notific text-end">
              <small>{user.time || "Now"}</small>
              {user.notificationStatus !== undefined && user.notificationStatus !== "none" && (
                <div className={`m_notif ${user.notificationStatus}`}>2</div>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

const UserInboxList = () => {
  return (
    <>
      {users.map((user, index) => (
        <UserItem key={index} user={user} />
      ))}
    </>
  );
};

export default UserInboxList;