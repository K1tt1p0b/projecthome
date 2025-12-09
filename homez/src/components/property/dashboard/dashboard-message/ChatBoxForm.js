"use client";
import React, { useState, useEffect } from "react";

const ChatBoxForm = () => {
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    // ข้อมูลจำลอง (ภาษาไทย)
    const mockData = [
      { id: 1, title: "บ้านเดี่ยวสไตล์คันทรี", price: "$14,000/เดือน", image: "/images/listings/list-1.jpg" },
      { id: 2, title: "วิลล่าหรู ย่านรีโกพาร์ค", price: "$14,000/เดือน", image: "/images/listings/list-2.jpg" },
      { id: 3, title: "วิลล่า บนถนนฮอลลีวูด", price: "$14,000/เดือน", image: "/images/listings/list-3.jpg" },
      { id: 4, title: "บ้านเดี่ยว พระราม 9", price: "12 MB", image: "/images/listings/list-4.jpg" },
    ];
    setMyListings(mockData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("ส่งข้อความ:", message);
    setMessage("");
  };

  const handleSelectListing = (listing) => {
    const textToSend = `ขออนุญาตเสนอทรัพย์ครับ: ${listing.title} ราคา ${listing.price} (รหัส: ${listing.id})`;
    setMessage(textToSend);
    setShowModal(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      
      {/* ⚠️ Form: ใช้ Inline Style บังคับ Layout แบบ Flexbox */}
      <form 
        onSubmit={handleSubmit}
        style={{ 
           display: "flex",              // บังคับ Flex
           alignItems: "center",         // จัดกึ่งกลางแนวตั้ง
           justifyContent: "space-between", 
           border: "1px solid #ddd", 
           borderRadius: "50px", 
           padding: "5px",
           backgroundColor: "#fff",
           width: "100%",                // กว้างเต็มพื้นที่
           boxSizing: "border-box"       // นับรวมขอบ
        }}
      >
        
        {/* 1. ปุ่มบ้าน (ซ้าย) */}
        <button
          type="button"
          style={{ 
             width: "40px", 
             height: "40px", 
             minWidth: "40px",      // ⚠️ ห้ามหดเด็ดขาด
             border: "none", 
             background: "transparent", 
             borderRadius: "50%",
             cursor: "pointer",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             marginRight: "5px"
          }}
          onClick={() => setShowModal(!showModal)}
          title="แนบประกาศ"
        >
          <span className="flaticon-home" style={{ fontSize: "20px", color: "#eb6753" }} />
        </button>

        {/* 2. ช่องพิมพ์ (กลาง) */}
        <div style={{ flex: 1, display: "flex" }}> {/* Wrapper เพื่อคุม input */}
            <input
              className="form-control shadow-none"
              type="search"
              placeholder="พิมพ์ข้อความ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ 
                border: "none", 
                background: "transparent", 
                height: "40px", 
                width: "100%",     // ยืดเต็ม Wrapper
                padding: "0 10px",
                fontSize: "14px",
                outline: "none",
                boxShadow: "none"
              }}
            />
        </div>
        
        {/* 3. ปุ่มส่ง (ขวา) */}
        <button 
           type="submit" 
           style={{ 
             width: "40px", 
             height: "40px", 
             minWidth: "40px",      // ⚠️ ห้ามหดเด็ดขาด
             borderRadius: "50%",
             background: "#eb6753", 
             border: "none",
             cursor: "pointer",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             marginLeft: "5px",
             color: "#fff"
           }}
        >
          <i className="fal fa-arrow-right-long" />
        </button>
      </form>

      {/* --- Popup (Modal) --- */}
      {showModal && (
        <div 
          className="shadow-lg bg-white border"
          style={{
            position: "absolute",
            bottom: "60px",
            left: "0",
            right: "0",
            borderRadius: "12px",
            zIndex: 9999,
            overflow: "hidden"
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
            <h6 className="m-0 fw-bold" style={{fontSize:'14px'}}>เลือกประกาศของคุณ</h6>
            <button type="button" className="btn-close" style={{fontSize: '10px'}} onClick={() => setShowModal(false)}></button>
          </div>

          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {myListings.map((item) => (
              <div 
                key={item.id}
                className="d-flex align-items-center p-2 border-bottom"
                style={{ cursor: "pointer", transition: "0.2s" }}
                onClick={() => handleSelectListing(item)}
              >
                <div style={{ width: "40px", height: "40px", background: "#eee", borderRadius: "6px", marginRight: "10px", overflow: "hidden" }}>
                    <img src={item.image} alt="prop" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div className="text-truncate" style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: "#eb6753" }}>{item.price}</div>
                </div>
                <span className="badge bg-light text-dark border ms-2">เลือก</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatBoxForm;