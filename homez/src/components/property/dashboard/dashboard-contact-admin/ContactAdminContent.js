"use client";

import React, { useState, useEffect, useRef } from "react";

const ContactAdminContent = () => {
  // State เก็บข้อความ
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "admin",
      text: "สวัสดีครับ 👋 มีปัญหาการใช้งาน หรือต้องการสอบถามเรื่องอะไร แจ้งเจ้าหน้าที่ได้เลยครับ",
      time: "10:00",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isButtonHover, setIsButtonHover] = useState(false);

  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      const { scrollHeight, clientHeight } = chatBodyRef.current;
      chatBodyRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");

    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        sender: "admin",
        text: "ได้รับข้อความแล้วครับ เดี๋ยวเจ้าหน้าที่ตรวจสอบสักครู่นะครับ...",
        time: new Date().toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1500);
  };

  return (
    <div className="row">
      {/* ✅ เปลี่ยนเป็น col-lg-12 เพื่อให้เต็มความกว้าง */}
      <div className="col-lg-12 mb30">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p0 overflow-hidden d-flex flex-column" style={{ height: '700px' }}>

          {/* --- Chat Header (ปรับใหม่) --- */}
          <div className="chat-header bg-white border-bottom p-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
            
            {/* 1. ฝั่งซ้าย: Admin Profile */}
            <div className="d-flex align-items-center">
              <div className="position-relative">
                <img src="https://placehold.co/50x50" alt="admin" className="rounded-circle border" width="50" height="50" />
                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: 12, height: 12 }}></span>
              </div>
              <div className="ms-3">
                <h6 className="mb-0 fw600 fz16">Admin Support</h6>
                <small className="text-success fz13"><i className="fas fa-circle fz10 me-1"></i>กำลังออนไลน์</small>
              </div>
            </div>

            {/* 2. ฝั่งขวา: ช่องทางติดต่ออื่นๆ (ย้ายมาจากด้านซ้าย) */}
            <div className="d-flex align-items-center gap-3 gap-md-4">

                {/* Call */}
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary" style={{ width: 35, height: 35 }}>
                        <i className="fas fa-phone-alt fz16"></i>
                    </div>
                    <div className="d-none d-md-block">
                        <div className="fz12 text-muted lh-1">Call Center</div>
                        <div className="fz13 fw600">02-123-4567</div>
                    </div>
                </div>

                {/* Email */}
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-danger" style={{ width: 35, height: 35 }}>
                        <i className="fas fa-envelope fz16"></i>
                    </div>
                    <div className="d-none d-md-block">
                        <div className="fz12 text-muted lh-1">Email</div>
                        <div className="fz13 fw600">help@homez.com</div>
                    </div>
                </div>

            </div>
          </div>

          {/* Chat Body */}
          <div
            ref={chatBodyRef}
            className="chat-body flex-grow-1 p-4 bg-light overflow-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                {msg.sender === 'admin' && (
                  <div className="me-2 align-self-end">
                    <img src="https://placehold.co/30x30" alt="admin-avatar" className="rounded-circle border" width="35" height="35" />
                  </div>
                )}
                <div style={{ maxWidth: '75%' }}>
                  <div
                    className={`p-3 bdrs12 fz15 shadow-sm ${msg.sender === 'user'
                      ? 'bg-dark text-white rounded-bottom-right-0'
                      : 'bg-white text-dark rounded-bottom-left-0'
                      }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`text-muted fz12 mt-1 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Footer */}
          <div className="chat-footer bg-white border-top p-3">
            <form onSubmit={handleSend} className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-light rounded-circle" title="แนบรูปภาพ" style={{ width: 45, height: 45 }}>
                <i className="fas fa-paperclip text-muted fz18"></i>
              </button>
              <input
                type="text"
                className="form-control border-0 bg-light rounded-pill px-4 py-3"
                placeholder="พิมพ์ข้อความ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="btn rounded-circle d-flex align-items-center justify-content-center"
                onMouseEnter={() => setIsButtonHover(true)}
                onMouseLeave={() => setIsButtonHover(false)}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: isButtonHover ? '#000000' : '#212529',
                  borderColor: isButtonHover ? '#000000' : '#212529',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                disabled={!inputValue.trim()}
              >
                <i className="fas fa-paper-plane fz18"></i>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactAdminContent;