"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// --- Mock Data: ทรัพย์ทั้งหมดในระบบ ---
const mockPropertiesDB = [
  {
    id: 1, 
    title: "บ้านเดี่ยวสไตล์คันทรี (Mock)",
    price: "14.0 MB",
    image: "/images/listings/list-1.jpg", 
    location: "ปทุมธานี"
  },
  {
    id: 102, // ตัวอย่างเดิม
    title: "บ้านเดี่ยว 2 ชั้น พระราม 9 (แต่งครบ)",
    price: "8.9 MB",
    image: "/images/listings/list-2.jpg",
    location: "ห้วยขวาง, กรุงเทพฯ"
  }
];

// ข้อความแชทปกติ (กรณีเข้าหน้าแชทเฉยๆ ไม่ได้กดมาจากบ้านไหน)
const defaultChatHistory = [
  {
    className: "sent float-start",
    imageUrl: "/images/inbox/ms4.png",
    name: "Albert Flores",
    time: "เมื่อวาน",
    type: "text",
    message: "สวัสดีครับ สอบถามเรื่องคอนโดหน่อยครับ",
  },
  {
    className: "reply float-end",
    imageUrl: "/images/inbox/ms3.png",
    name: "You",
    time: "เมื่อวาน",
    type: "text",
    message: "ยินดีครับ สอบถามได้เลยครับ",
  }
];

const ChatMessage = ({ message }) => {
  return (
    <li className={message.className}>
      <div className={`d-flex align-items-center ${message.className === "sent float-start" ? "mb15" : "justify-content-end mb15"}`}>
        {/* Avatar ซ้าย */}
        {message.className === "sent float-start" && (
          <Image width={50} height={50} className="img-fluid rounded-circle align-self-start mr10" src={message.imageUrl} alt="profile" />
        )}
        
        <div className={`title fz14 ${message.className === "reply float-end" ? "mr10" : "ml10"}`}>
          {message.className === "reply float-end" ? <small>{message.time}</small> : <>{message.name} <small className="ml10">{message.time}</small></>}
        </div>

        {/* Avatar ขวา */}
        {message.className === "reply float-end" && (
          <Image width={50} height={50} className="img-fluid rounded-circle align-self-end ml10" src={message.imageUrl} alt="profile" />
        )}
      </div>

      {/* --- เนื้อหาข้อความ --- */}
      {message.type === "listing" ? (
        // การ์ดประกาศ (Listing Card) ที่แนบมาในแชท
        <div
          className="listing-card-wrapper"
          style={{
            maxWidth: '320px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            overflow: 'hidden',
            marginLeft: message.className.includes('reply') ? 'auto' : '0',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '160px' }}>
            <Image
              fill
              src={message.listing.image}
              alt="listing"
              style={{ objectFit: 'cover' }}
            />
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">สนใจทรัพย์นี้</span>
          </div>
          <div className="p-3">
            <h6 className="mb-1 text-truncate" style={{ fontSize: '14px' }}>{message.listing.title}</h6>
            <p className="mb-2 text-muted" style={{ fontSize: '12px' }}>
              <i className="flaticon-placeholder me-1"></i> {message.listing.location}
            </p>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-primary fw-bold" style={{ fontSize: '15px' }}>{message.listing.price}</span>
              <Link href={`/single-v5/${message.listing.id}`} className="btn btn-sm btn-light border rounded-pill" style={{fontSize: '11px'}}>
                ดูรายละเอียด
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <p className="mb-0">{message.message}</p>
      )}
    </li>
  );
};

const UserChatBoxContent = () => {
  const searchParams = useSearchParams();
  const interestId = searchParams.get('interest_property');
  
  // State เก็บรายการแชท
  const [messages, setMessages] = useState(defaultChatHistory);

  useEffect(() => {
    if (interestId) {
        // 1. หาข้อมูลทรัพย์
        const foundProperty = mockPropertiesDB.find(p => String(p.id) === String(interestId));
        
        if (foundProperty) {
            // 2. 🔥 สร้าง "ห้องแชทใหม่" (New Chat)
            // โดยการเคลียร์ข้อความเก่าทิ้ง แล้วใส่ข้อความทักทายใหม่เข้าไปแทน
            setMessages([
                // ข้อความที่ 1: แนบการ์ดประกาศที่เราสนใจ
                {
                    className: "reply float-end", // เราเป็นคนส่ง
                    imageUrl: "/images/inbox/ms3.png", // รูปเรา
                    name: "You",
                    time: "เมื่อสักครู่",
                    type: "listing",
                    listing: foundProperty
                },
                // ข้อความที่ 2: ข้อความทักทายอัตโนมัติ
                {
                    className: "reply float-end",
                    imageUrl: "/images/inbox/ms3.png",
                    name: "You",
                    time: "เมื่อสักครู่",
                    type: "text",
                    message: `สวัสดีครับ ผมสนใจทรัพย์ "${foundProperty.title}" รหัส ${foundProperty.id} ที่คุณลงประกาศไว้ สะดวกคุยรายละเอียดไหมครับ?`
                }
            ]);
        }
    } else {
        // ถ้าไม่มี ID มา ให้โชว์ประวัติแชทปกติ (Default)
        setMessages(defaultChatHistory);
    }
  }, [interestId]);

  return (
    <>
      {/* วนลูปแสดงข้อความ */}
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </>
  );
};

export default UserChatBoxContent;