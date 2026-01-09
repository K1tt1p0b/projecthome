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

    // 1. เปลี่ยนชื่อ Ref ให้ชัดเจนว่าจับที่กล่องแชท (Container)
    const chatBodyRef = useRef(null);

    // 2. แก้ฟังก์ชันเลื่อนจอ: เลื่อนแค่ scrollTop ของกล่อง ไม่ยุ่งกับหน้าหลัก
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
            {/* --- Contact Info ด้านซ้าย --- */}
            <div className="col-lg-4 mb30">
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 h-100">
                    <h4 className="title fz17 mb30">ช่องทางอื่นๆ</h4>

                    <div className="d-flex align-items-center mb20">
                        <div className="icon-wrapper bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 50, height: 50 }}>
                            <i className="fab fa-line fz20 text-success"></i>
                        </div>
                        <div>
                            <div className="fw600">Line Official</div>
                            <div className="text-muted fz14">@homez_support</div>
                        </div>
                    </div>
                    {/* ... (ส่วนอื่นๆ เหมือนเดิม) ... */}
                    <div className="d-flex align-items-center mb20">
                        <div className="icon-wrapper bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 50, height: 50 }}>
                            <i className="fas fa-phone-alt fz20 text-primary"></i>
                        </div>
                        <div>
                            <div className="fw600">Call Center</div>
                            <div className="text-muted fz14">02-123-4567</div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="icon-wrapper bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 50, height: 50 }}>
                            <i className="fas fa-envelope fz20 text-danger"></i>
                        </div>
                        <div>
                            <div className="fw600">Email</div>
                            <div className="text-muted fz14">support@homez.com</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- Chat Box Area ด้านขวา --- */}
            <div className="col-lg-8 mb30">
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p0 overflow-hidden d-flex flex-column" style={{ height: '600px' }}>

                    {/* Chat Header */}
                    <div className="chat-header bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div className="position-relative">
                                <img src="https://placehold.co/50x50" alt="admin" className="rounded-circle border" width="45" height="45" />
                                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: 12, height: 12 }}></span>
                            </div>
                            <div className="ms-3">
                                <h6 className="mb-0 fw600">Admin Support</h6>
                                <small className="text-success fz12">กำลังออนไลน์</small>
                            </div>
                        </div>
                    </div>

                    {/* Chat Body */}
                    {/* ✅ 3. ใส่ ref={chatBodyRef} ที่ div นี้แทน */}
                    <div
                        ref={chatBodyRef}
                        className="chat-body flex-grow-1 p-4 bg-light overflow-auto"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {messages.map((msg) => (
                            <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                {msg.sender === 'admin' && (
                                    <div className="me-2 align-self-end">
                                        <img src="https://placehold.co/30x30" alt="admin-avatar" className="rounded-circle border" width="30" height="30" />
                                    </div>
                                )}
                                <div style={{ maxWidth: '70%' }}>
                                    <div
                                        className={`p-3 bdrs12 fz15 shadow-sm ${msg.sender === 'user'
                                            ? 'bg-dark text-white rounded-bottom-right-0'
                                            : 'bg-white text-dark rounded-bottom-left-0'
                                            }`}
                                        style={{
                                            borderTopRightRadius: '12px',
                                            borderTopLeftRadius: '12px',
                                            borderBottomLeftRadius: msg.sender === 'user' ? '12px' : '0',
                                            borderBottomRightRadius: msg.sender === 'user' ? '0' : '12px',
                                        }}
                                    >
                                        {msg.text}
                                    </div>
                                    <div className={`text-muted fz11 mt-1 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* ลบ div ref={messagesEndRef} อันเก่าออกได้เลยครับ ไม่ต้องใช้แล้ว */}
                    </div>

                    {/* Chat Footer */}
                    <div className="chat-footer bg-white border-top p-3">
                        <form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                            <button type="button" className="btn btn-light rounded-circle" title="แนบรูปภาพ">
                                <i className="fas fa-paperclip text-muted"></i>
                            </button>
                            <input
                                type="text"
                                className="form-control border-0 bg-light rounded-pill px-3 py-2"
                                placeholder="พิมพ์ข้อความ..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn rounded-circle"
                                onMouseEnter={() => setIsButtonHover(true)}  // เมาส์เข้า -> เปลี่ยน state
                                onMouseLeave={() => setIsButtonHover(false)} // เมาส์ออก -> เปลี่ยน state กลับ
                                style={{
                                    width: 45,
                                    height: 45,
                                    // ถ้า Hover ให้สีดำเข้มขึ้น (#000) ถ้าปกติใช้สีเทา (#212529)
                                    backgroundColor: isButtonHover ? '#000000' : '#212529',
                                    borderColor: isButtonHover ? '#000000' : '#212529',
                                    color: 'white',
                                    transition: 'all 0.2s ease' // เพิ่ม transition ให้นุ่มนวล
                                }}
                                disabled={!inputValue.trim()}
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactAdminContent;