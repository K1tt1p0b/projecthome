"use client";
import React, { useState, useEffect } from "react";

const ChatBoxForm = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    // Mock Data ทรัพย์สินที่จะเลือกส่ง
    setMyListings([
      { id: 1, title: "บ้านเดี่ยวสไตล์คันทรี", price: "$14,000/เดือน", image: "/images/listings/list-1.jpg", location: "ลาดพร้าว 71" },
      { id: 2, title: "วิลล่าหรู ย่านรีโกพาร์ค", price: "$14,000/เดือน", image: "/images/listings/list-2.jpg", location: "พระราม 9" },
      { id: 3, title: "คอนโดหรู ติด BTS", price: "5.5 MB", image: "/images/listings/list-3.jpg", location: "สุขุมวิท 24" },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // กรณีพิมพ์ข้อความปกติ
    if (onSendMessage) onSendMessage(message);
    setMessage("");
  };

  const handleSelectListing = (listing) => {
    // ✅ ส่งเป็น Object ข้อมูลทรัพย์ (Rich Card Data)
    if (onSendMessage) {
      onSendMessage({
        type: 'listing_card',
        data: listing
      });
    }
    setShowModal(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Form Input Design */}
      <form onSubmit={handleSubmit} className="d-flex align-items-center bg-light rounded-pill px-2 py-1 border">
        <button
          type="button"
          onClick={() => setShowModal(!showModal)}
          className="btn btn-link text-decoration-none text-secondary p-0 mx-2"
          title="แนบรายการทรัพย์สิน"
        >
          <i className="flaticon-home fz20"></i>
        </button>
        <input
          className="form-control border-0 bg-transparent shadow-none"
          type="text"
          placeholder="พิมพ์ข้อความ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ height: '45px' }}
        />
        <button type="submit" className="btn btn-primary rounded-circle p-0 mx-1 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#eb6753', border: 'none' }}>
          <i className="flaticon-send text-white fz14"></i>
        </button>
      </form>

      {/* Modal Popup เลือกทรัพย์ */}
      {showModal && (
        <div className="shadow-lg bg-white border rounded-3 overflow-hidden position-absolute" style={{ bottom: '60px', left: 0, width: '100%', maxWidth: '300px', zIndex: 100 }}>
          <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-light">
            <span className="fw-bold fz14">เลือกทรัพย์ที่จะส่ง</span>
            <button type="button" className="btn-close fz10" onClick={() => setShowModal(false)}></button>
          </div>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {myListings.map(item => (
              <div key={item.id} className="d-flex align-items-center p-2 border-bottom cursor-pointer hover-bg-light" onClick={() => handleSelectListing(item)} style={{ cursor: 'pointer' }}>
                <img src={item.image} width={50} height={50} className="rounded object-fit-cover me-2" alt="prop" />
                <div className="lh-sm overflow-hidden">
                  <div className="fz13 fw-bold text-truncate">{item.title}</div>
                  <div className="fz12 text-primary">{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxForm;