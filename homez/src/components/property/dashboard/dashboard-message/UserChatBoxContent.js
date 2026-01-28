"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// --- Mock Data ---
const mockPropertiesDB = [
  { id: 101, title: "Rhythm Ratchada (Co-broke)", price: "5.5 MB", image: "/images/listings/list-1.jpg", location: "รัชดา, กทม.", commission: "3%" },
  { id: 102, title: "Life Ladprao (Buyer)", price: "4.2 MB", image: "/images/listings/list-2.jpg", location: "ลาดพร้าว, กทม." }
];

const ChatMessage = ({ message }) => {

  // 🎨 ฟังก์ชันกำหนดสีและไอคอน (ใช้ FontAwesome Class)
  const getCardStyle = (intent) => {
    if (intent === 'cobroke') {
      return {
        borderColor: '#fd7e14', // ส้ม (Co-broke)
        headerBg: 'bg-warning bg-opacity-10',
        textColor: 'text-dark',

        iconClass: 'fa-handshake', // 🤝 Icon จับมือ
        badgeText: 'Co-broke Request',
      };
    } else {
      return {
        borderColor: '#0d6efd', // น้ำเงิน (Customer)
        headerBg: 'bg-primary bg-opacity-10',
        textColor: 'text-primary',

        iconClass: 'fa-user-circle', // 👤 Icon คน
        badgeText: 'Customer Inquiry',
      };
    }
  };

  const style = message.type === 'listing' ? getCardStyle(message.intent) : {};

  return (
    <li className={message.className}>
      <div className={`d-flex align-items-center ${message.className === "sent float-start" ? "mb15" : "justify-content-end mb15"}`}>
        {/* Avatar */}
        {message.className === "sent float-start" && (
          <Image width={50} height={50} className="img-fluid rounded-circle align-self-start mr10" src={message.imageUrl} alt="profile" />
        )}

        {/* ชื่อ + เวลา */}
        <div className={`title fz14 ${message.className === "reply float-end" ? "mr10" : "ml10"}`}>
          {message.className === "reply float-end" ? <small>{message.time}</small> : <>{message.name} <small className="ml10">{message.time}</small></>}
        </div>
      </div>

      {/* --- ส่วนแสดงข้อความ หรือ การ์ด --- */}
      {message.type === "listing" ? (

        // 🔥🔥 CARD แบบ Embed + Icon FontAwesome 🔥🔥
        <div
          className="listing-card-wrapper shadow-sm"
          style={{
            maxWidth: '350px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: `1px solid ${style.borderColor}`, // ขอบสีตามประเภท
            marginLeft: message.className.includes('reply') ? 'auto' : '0'
          }}
        >
          {/* 1. Header Card: ใช้ Icon แทน Emoji */}
          <div className={`${style.headerBg} p-2 px-3 d-flex align-items-center justify-content-between border-bottom`} style={{ borderColor: style.borderColor }}>
            <div className={`fw-bold fz14 ${style.textColor} d-flex align-items-center`}>
              {/* ✅ ICON อยู่ตรงนี้ */}
              <i className={`fas ${style.iconClass} fz16 me-2`}></i>
              <span>{style.badgeText}</span>
            </div>
            {message.intent === 'cobroke' && (
              <span className="badge bg-white text-dark border shadow-sm" style={{ fontSize: '11px' }}>
                Com: {message.listing.commission}
              </span>
            )}
          </div>

          {/* 2. เนื้อหาทรัพย์ */}
          <div className="d-flex p-3 gap-3">
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <Image fill src={message.listing.image} alt="listing" className="rounded" style={{ objectFit: 'cover' }} />
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold text-truncate" style={{ maxWidth: '180px' }}>{message.listing.title}</h6>
              <div className="text-primary fw-bold mb-1">{message.listing.price}</div>
              <div className="text-muted fz12"><i className="fas fa-map-marker-alt me-1"></i> {message.listing.location}</div>
            </div>
          </div>

          {/* 3. ปุ่ม Action (เปลี่ยนตามบริบท) */}
          <div className="p-2 bg-light border-top d-grid">
            <Link href={`/single-v5/${message.listing.id}`} className="btn w-100 d-block btn-white border fw-bold text-dark" style={{ fontSize: '13px', padding: '8px 0' }}>
              ดูประกาศฉบับเต็ม <i className="fas fa-external-link-alt ms-1"></i>
            </Link>
          </div>
        </div>

      ) : (
        // ข้อความปกติ
        <div
          className={`p-3 rounded-3 ${message.className.includes('reply') ? 'bg-dark text-white' : 'bg-light text-dark'}`}
          style={{
            maxWidth: '70%',
            marginLeft: message.className.includes('reply') ? 'auto' : '0',
            borderRadius: '15px',
            borderBottomRightRadius: message.className.includes('reply') ? '0' : '15px', // หางลูกโป่ง
            borderBottomLeftRadius: message.className.includes('reply') ? '15px' : '0'
          }}
        >
          {message.message}
        </div>
      )}
    </li>
  );
};

const UserChatBoxContent = () => {
  const searchParams = useSearchParams();
  const interestId = searchParams.get('interest_property');
  const type = searchParams.get('type'); // รับค่า type (cobroke / buyer)

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (interestId) {
      const foundProperty = mockPropertiesDB.find(p => String(p.id) === String(interestId)) || mockPropertiesDB[0];
      const intent = type === 'cobroke' ? 'cobroke' : 'buyer';

      setMessages([
        {
          className: "reply float-end",
          imageUrl: "/images/inbox/ms3.png",
          name: "You",
          time: "Now",
          type: "listing",
          intent: intent,
          listing: foundProperty
        },
        {
          className: "reply float-end",
          imageUrl: "/images/inbox/ms3.png",
          name: "You",
          time: "Now",
          type: "text",
          message: intent === 'cobroke'
            ? "สวัสดีครับ สนใจ Co-broke ทรัพย์นี้ครับ ยังรับอยู่ไหมครับ?"
            : "สวัสดีครับ สนใจทรัพย์นี้ครับ นัดดูห้องได้วันไหนบ้างครับ?"
        }
      ]);
    } else {
      setMessages([
        { className: "sent float-start", imageUrl: "/images/inbox/ms4.png", name: "User", time: "10:00", type: "text", message: "สวัสดีครับ" }
      ]);
    }
  }, [interestId, type]);

  return (
    <div className="inbox_chatting_box" style={{ height: '600px', overflowY: 'auto', padding: '20px' }}>
      <ul className="mb0">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </ul>
    </div>
  );
};

export default UserChatBoxContent;