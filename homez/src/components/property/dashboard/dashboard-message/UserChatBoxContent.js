"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ChatBoxForm from "./ChatBoxForm";

const ChatMessage = ({ message }) => {
  const isMe = message.className.includes('reply');

  return (
    <li className={`d-flex mb-4 ${isMe ? 'justify-content-end' : 'justify-content-start'}`} style={{ width: '100%' }}>
      {!isMe && (
        <Image width={35} height={35} className="rounded-circle me-2 align-self-end mb-2" src={message.imageUrl} alt="profile" style={{ objectFit: 'cover' }} />
      )}
      <div style={{ maxWidth: '75%' }}>
        {message.type === "listing_card" ? (
          <div className="card border-0 shadow-sm overflow-hidden rounded-4 bg-white" style={{ minWidth: '240px' }}>
            <div className="position-relative" style={{ height: '150px', width: '100%' }}>
              <Image fill src={message.listing.image} alt="listing" style={{ objectFit: 'cover' }} />
              <span className="position-absolute top-0 start-0 m-2 badge bg-dark shadow-sm opacity-75">{message.listing.price}</span>
              {message.isCoBroke ? (
                <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark shadow-sm border border-white"><i className="flaticon-handshake me-1"></i> Co-broke Request</span>
              ) : (
                <span className="position-absolute top-0 end-0 m-2 badge bg-primary shadow-sm border border-white">For Sale</span>
              )}
            </div>
            <div className="p-3">
              <h6 className="mb-1 text-truncate fw-bold fz15 text-dark" style={{ maxWidth: '220px' }}>{message.listing.title}</h6>
              <p className="mb-3 text-muted fz13"><i className="flaticon-placeholder me-1"></i>{message.listing.location || "ทำเลดี, กรุงเทพฯ"}</p>
              <Link href={`/single-v5/${message.listing.id}`} className={`btn btn-sm w-100 rounded-pill fz12 fw-bold ${message.isCoBroke ? 'btn-outline-warning text-dark' : 'btn-outline-primary'}`} target="_blank">
                ดูรายละเอียดทรัพย์ <i className="flaticon-right-arrow ms-1 fz10"></i>
              </Link>
            </div>
          </div>
        ) : (
          <div className={`px-3 py-2 shadow-sm ${isMe ? 'text-white' : 'bg-white text-dark'}`}
            style={{ backgroundColor: isMe ? '#eb6753' : '#fff', borderRadius: '18px', borderBottomRightRadius: isMe ? '4px' : '18px', borderBottomLeftRadius: !isMe ? '4px' : '18px' }}>
            {message.message}
          </div>
        )}
        <div className={`mt-1 fz10 text-muted opacity-75 ${isMe ? 'text-end' : 'text-start'}`}>{message.time}</div>
      </div>
    </li>
  );
};

const UserChatBoxContent = () => {
  const searchParams = useSearchParams();
  const interestId = searchParams.get('interest_property');
  const type = searchParams.get('type');

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const mockPropertiesDB = [{ id: 101, title: "Rhythm Ratchada", price: "5.5 MB", image: "/images/listings/list-1.jpg" }];

  useEffect(() => {
    if (interestId) {
      const foundProperty = mockPropertiesDB.find(p => String(p.id) === String(interestId)) || { id: interestId, title: "ทรัพย์รหัส " + interestId, price: "-", image: "/images/listings/list-1.jpg" };
      const isCoBrokeRequest = type === 'cobroke';
      const initialMsg = isCoBrokeRequest ? "สวัสดีครับ สนใจขอ Co-broke ทรัพย์รายการนี้ครับ..." : "สวัสดีครับ สนใจทรัพย์รายการนี้ครับ...";

      setMessages([
        { className: "reply", imageUrl: "/images/inbox/ms3.png", name: "You", time: "Now", type: "listing_card", listing: foundProperty, isCoBroke: isCoBrokeRequest },
        { className: "reply", imageUrl: "/images/inbox/ms3.png", name: "You", time: "Now", type: "text", message: initialMsg }
      ]);
    } else {
      setMessages([{ className: "sent", imageUrl: "/images/inbox/ms4.png", name: "Agent A", time: "10:00", type: "text", message: "สวัสดีครับ มีอะไรให้ช่วยไหมครับ?" }]);
    }
  }, [interestId, type]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSendMessage = (content) => {
    let newMessage = {};
    if (typeof content === 'string') {
      newMessage = { className: "reply", imageUrl: "/images/inbox/ms3.png", name: "You", time: "Now", type: "text", message: content };
    } else if (content.type === 'listing_card') {
      newMessage = { className: "reply", imageUrl: "/images/inbox/ms3.png", name: "You", time: "Now", type: "listing_card", listing: content.data, isCoBroke: false };
    }
    setMessages(prev => [...prev, newMessage]);
  };

  // =========================================================
  // 🛠️ ฟังก์ชันทดสอบ: จำลองคนอื่นทักมา (Simulator)
  // =========================================================
  const simulateIncoming = (simType) => {
    // 1. สร้างข้อความที่จะเด้งเข้าแชท
    const incomingMsg = simType === 'cobroke'
      ? "สวัสดีครับ ผมมีลูกค้าสนใจทรัพย์ของคุณ รับ Co-broke ไหมครับ? (Test)"
      : "สนใจห้องนี้ครับ ลดราคาได้อีกไหมครับ? (Test)";

    const senderName = simType === 'cobroke' ? "Broker John" : "Customer Tom";
    const senderImg = simType === 'cobroke' ? "/images/inbox/ms5.png" : "/images/inbox/ms2.png";

    // เพิ่มข้อความเข้าแชท (ฝั่งซ้าย - sent)
    setMessages(prev => [...prev, {
      className: "sent",
      imageUrl: senderImg,
      name: senderName,
      time: "Just Now",
      type: "text",
      message: incomingMsg
    }]);

    // 2. 🔥 ยิงแจ้งเตือนไปที่กระดิ่งทันที 🔥
    const newNotif = {
      id: Date.now(),
      title: senderName,
      message: incomingMsg,
      time: new Date().toISOString(),
      type: simType, // 'cobroke' หรือ 'buyer'
      isRead: false,
      url: "/dashboard-message"
    };

    const currentNotifs = JSON.parse(localStorage.getItem('my_notifications') || "[]");
    localStorage.setItem('my_notifications', JSON.stringify([newNotif, ...currentNotifs]));
    window.dispatchEvent(new Event("storage_update")); // สั่งกระดิ่งให้รีเฟรช
  };

  return (
    <div className="d-flex flex-column h-100 position-relative">

      {/* Header */}
      <div className="px-4 py-3 bg-white border-bottom d-flex justify-content-between align-items-center shadow-sm pe-5">
        <div className="d-flex align-items-center">
          <div className="position-relative me-3">
            <Image width={48} height={48} className="rounded-circle border" src="/images/inbox/ms3.png" alt="user" />
            <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
          </div>
          <div>
            <h5 className="mb-0 fw-bold fz16">Arlene McCoy</h5>
            <small className="text-success fz12"><i className="fas fa-circle fz8 me-1"></i> Active Now</small>
          </div>
        </div>
        <button className="btn btn-light btn-sm text-danger rounded-pill px-3"><i className="flaticon-delete me-1"></i> ลบแชท</button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow-1 p-4" ref={scrollRef} style={{ overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
        <ul className="list-unstyled mb-0 w-100 d-flex flex-column justify-content-end" style={{ minHeight: '100%' }}>
          {messages.map((message, index) => <ChatMessage key={index} message={message} />)}
        </ul>
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-top">
        <ChatBoxForm onSendMessage={handleSendMessage} />
      </div>

      {/* 🎮🎮 ปุ่มทดสอบลอย (Dev Tools) - แสดงเฉพาะตอนเทส */}
      <div style={{ position: 'absolute', bottom: '100px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => simulateIncoming('buyer')} className="btn btn-primary btn-sm shadow-sm rounded-pill border border-white">
          👤 จำลองลูกค้าทัก
        </button>
        <button onClick={() => simulateIncoming('cobroke')} className="btn btn-warning btn-sm shadow-sm rounded-pill border border-white">
          🤝 จำลอง Co-broke
        </button>
      </div>

    </div>
  );
};

export default UserChatBoxContent;