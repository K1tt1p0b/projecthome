import React from "react";

const ProperytyDescriptions = () => {
  return (
    <>
      <p className="text mb10">
        บ้านเดี่ยว 3 ห้องนอน พร้อมชั้นลอยและ 2 ห้องน้ำ ในโครงการหมู่บ้าน The Hideout 
        ที่ตอบโจทย์ทุกความต้องการ ด้วยผังบ้านแบบเปิดโล่ง (Open plan) 
        และช่องแสงขนาดใหญ่ที่เปิดรับแสงธรรมชาติ ทำให้บ้านหลังนี้เหมาะอย่างยิ่งสำหรับการสังสรรค์ 
        ห้องนั่งเล่นและห้องรับประทานอาหารโดดเด่นด้วยเพดานสูงโปร่ง (Vaulted ceilings) 
        และเตาผิงที่สวยงาม คุณจะหลงรักช่วงเวลาพักผ่อนบนระเบียงเพื่อชมวิวทิวทัศน์ 
        ส่วนห้องครัวมาพร้อมเครื่องใช้ไฟฟ้าสแตนเลส ผนังกันเปื้อนปูกระเบื้อง และบาร์สำหรับรับประทานอาหารเช้า
      </p>
      <div className="agent-single-accordion">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
              style={{}}
            >
              <div className="accordion-body p-0">
                <p className="text">
                  {/* ผมเปลี่ยนข้อความ Placeholder เดิมที่เป็นเรื่อง Mac ให้เป็นเรื่องบ้านแทนครับ */}
                  เนื้อหาเพิ่มเติมสำหรับส่วนขยายนี้ เพื่อแสดงรายละเอียดทรัพย์สินที่ครบถ้วน 
                  นอกจากนี้บ้านยังมาพร้อมกับระบบระบายอากาศที่ดีเยี่ยม 
                  พื้นที่สวนรอบบ้านที่ได้รับการดูแลอย่างดี และสิ่งอำนวยความสะดวกครบครันในโครงการ 
                  ไม่ว่าจะเป็นคลับเฮาส์ สระว่ายน้ำ และระบบรักษาความปลอดภัยตลอด 24 ชั่วโมง 
                  เพื่อให้คุณและครอบครัวได้ใช้ชีวิตอย่างสมบูรณ์แบบ
                </p>
              </div>
            </div>
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button p-0 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                แสดงเพิ่มเติม
              </button>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProperytyDescriptions;