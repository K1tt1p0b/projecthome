import Image from "next/image";
import Link from "next/link";
import React from "react";

const chatMessages = [
  {
    className: "sent float-start",
    imageUrl: "/images/inbox/ms4.png",
    name: "Albert Flores",
    time: "35 mins",
    type: "text",
    message: "สนใจบ้านเดี่ยวโซนพระราม 9 มีแนะนำไหมครับ?",
  },
  {
    className: "reply float-end",
    imageUrl: "/images/inbox/ms3.png",
    name: "You",
    time: "35 mins",
    type: "text",
    message: "สวัสดีครับ มีน่าสนใจอยู่หลังนึงครับ ลองดูนะครับ",
  },
  // --- ตัวอย่าง: ข้อความแบบ "การ์ดประกาศ" (Listing) ---
  {
    className: "reply float-end",
    imageUrl: "/images/inbox/ms3.png",
    name: "You",
    time: "34 mins",
    type: "listing", // กำหนดประเภทเป็น listing
    listing: {
      id: 102,
      title: "บ้านเดี่ยว 2 ชั้น พระราม 9 (แต่งครบ)",
      price: "8.9 MB",
      image: "/images/listings/list-2.jpg",
      location: "ห้วยขวาง, กรุงเทพฯ"
    }
  },
  {
    className: "sent float-start",
    imageUrl: "/images/inbox/ms4.png",
    name: "Albert Flores",
    time: "35 mins",
    type: "text",
    message: "โอ้โห สวยมากครับ ขอนัดดูได้ไหม?",
  },
];

const ChatMessage = ({ message }) => {
  return (
    <li className={message.className}>
      <div
        className={`d-flex align-items-center ${message.className === "sent float-start"
            ? "mb15"
            : "justify-content-end mb15"
          }`}
      >
        {/* Avatar ฝั่งซ้าย (คนอื่นส่ง) */}
        {message.className === "sent float-start" ? (
          <Image
            width={50}
            height={50}
            className="img-fluid rounded-circle align-self-start mr10"
            src={message.imageUrl}
            alt={`${message.name}'s profile`}
          />
        ) : null}

        {/* ชื่อและเวลา */}
        <div
          className={`title fz14 ${message.className === "reply float-end" ? "mr10" : "ml10"
            }`}
        >
          {message.className === "reply float-end" ? (
            <small>{message.time}</small>
          ) : (
            <>
              {message.name} <small className="ml10">{message.time}</small>
            </>
          )}
        </div>

        {/* Avatar ฝั่งขวา (เราส่ง) */}
        {message.className === "reply float-end" ? (
          <Image
            width={50}
            height={50}
            className="img-fluid rounded-circle align-self-end ml10"
            src={message.imageUrl}
            alt={`${message.name}'s profile`}
          />
        ) : null}
      </div>

      {/* --- ส่วนแสดงเนื้อหา (แยกประเภท) --- */}
      {message.type === "listing" ? (
        // กรณีเป็น "การ์ดประกาศ"
        <div
          className="listing-card-wrapper"
          style={{
            maxWidth: '350px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            overflow: 'hidden',
            marginLeft: message.className.includes('reply') ? 'auto' : '0', // ชิดขวาถ้าเราส่ง
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          {/* รูปภาพปก */}
          <div style={{ position: 'relative', width: '100%', height: '180px' }}>
            <Image
              fill
              src={message.listing.image}
              alt="listing"
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* รายละเอียด */}
          <div className="p-3">
            <h6 className="mb-1" style={{ fontSize: '15px' }}>{message.listing.title}</h6>
            <p className="mb-2 text-muted" style={{ fontSize: '13px' }}>
              <i className="flaticon-placeholder me-1"></i> {message.listing.location}
            </p>

            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-primary fw-bold" style={{ fontSize: '16px' }}>
                {message.listing.price}
              </span>
              <Link
                href={`/single-v1/${message.listing.id}`}
                className="btn btn-sm btn-dark"
                style={{ borderRadius: '20px', fontSize: '12px', padding: '5px 15px' }}
              >
                ดูรายละเอียด
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // กรณีเป็น "ข้อความปกติ" (ใช้ Style เดิมของ Template)
        <p>{message.message}</p>
      )}

    </li>
  );
};

const UserChatBoxContent = () => {
  return (
    <>
      {chatMessages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </>
  );
};

export default UserChatBoxContent;