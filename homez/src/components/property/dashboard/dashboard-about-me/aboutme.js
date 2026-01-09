"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import agents from "@/data/agents";

const AboutMe = () => {

  // 1. ดึงข้อมูล (Safety Check)
  // ถ้าหา agents ไม่เจอ หรือ array ว่าง ให้ใช้ object ว่างๆ กัน Error
  const data = (agents && agents.length > 0) ? agents[0] : {};

  // 2. เตรียมข้อมูลสำหรับแสดงผล (Fallback Data)
  // ถ้า data ตัวไหนไม่มี ให้ใช้ค่า Default แทน หน้าจะได้ไม่แหว่ง
  const agent = {
    name: data.name || "ชื่อตัวแทน (Demo Account)",
    position: data.category || "นายหน้ามืออาชีพ",
    city: data.city || "กรุงเทพมหานคร",
    desc: data.desc || "เชี่ยวชาญคอนโดแนวรถไฟฟ้า และบ้านโซนราชพฤกษ์ พร้อมให้คำปรึกษาเรื่องสินเชื่อฟรี ดูแลครบจบในที่เดียว",
    mobile: data.mobile || "081-234-5678",
    email: data.email || "demo@gmail.com",
    // เช็คทั้ง key 'img' และ 'image' เผื่อพิมพ์ผิด และใส่รูป default
    image: data.img || data.image || "/images/team/agent-1.jpg"
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

      <div className="row align-items-center">

        {/* --- ส่วนรูปโปรไฟล์ (Left) --- */}
        <div className="col-xl-3 col-lg-4 text-center mb-4 mb-lg-0">
          <div className="position-relative d-inline-block">
            <div
              className="rounded-circle overflow-hidden border border-3 border-white shadow-sm"
              style={{ width: '150px', height: '150px' }}
            >
              <Image
                src={agent.image}
                alt={agent.name}
                width={150}
                height={150}
                className="w-100 h-100 object-fit-cover"
              />
            </div>

            {/* Verified Badge */}
            <div className="position-absolute bottom-0 end-0">
              <span className="badge bg-success border border-2 border-white rounded-circle p-2" title="Verified Agent">
                <i className="fas fa-check text-white fz14"></i>
              </span>
            </div>
          </div>
        </div>

        {/* --- ส่วนข้อมูล (Right) --- */}
        <div className="col-xl-9 col-lg-8">
          <div className="text-center text-lg-start">

            {/* ชื่อและตำแหน่ง */}
            <div className="mb-3">
              <h3 className="title mb-1 fw600">
                {agent.name}
                <i className="fas fa-check-circle text-primary fz16 ms-2" title="Verified"></i>
              </h3>
              <p className="text-muted fz15 mb-0">
                <i className="fas fa-map-marker-alt me-2 text-thm"></i>
                {agent.position} ({agent.city})
              </p>
            </div>

            {/* Bio Quote */}
            <div className="mb-4">
              <p className="fst-italic text-muted border-start border-3 ps-3 border-thm">
                "{agent.desc}"
              </p>
            </div>

            {/* Stats (สถิติ) */}
            <div className="d-flex justify-content-center justify-content-lg-start gap-5 mb-4 border-top border-bottom py-3">
              <div className="text-center">
                <div className="fw700 fz20 text-thm">50+</div>
                <div className="fz13 text-muted">ปิดการขาย</div>
              </div>
              <div className="text-center">
                <div className="fw700 fz20 text-thm">5 ปี</div>
                <div className="fz13 text-muted">ประสบการณ์</div>
              </div>
              <div className="text-center">
                <div className="fw700 fz20 text-thm">100%</div>
                <div className="fz13 text-muted">ตอบกลับไว</div>
              </div>
            </div>

            {/* --- Contact Info (Text Only / Non-clickable) --- */}
            <div className="d-flex flex-column flex-md-row gap-3 gap-md-4 mt-4">

              {/* 📞 เบอร์โทร (ข้อความธรรมดา) */}
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle me-2" style={{ width: '40px', height: '40px' }}>
                  <i className="fas fa-phone-alt text-thm fz14"></i>
                </div>
                <div>
                  <div className="fz12 text-muted lh-1">เบอร์โทรศัพท์</div>
                  <div className="fw600 text-dark fz15">{agent.mobile}</div>
                </div>
              </div>

              {/* 📧 อีเมล (ข้อความธรรมดา) */}
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle me-2" style={{ width: '40px', height: '40px' }}>
                  <i className="fas fa-envelope text-danger fz14"></i>
                </div>
                <div>
                  <div className="fz12 text-muted lh-1">อีเมล</div>
                  <div className="fw600 text-dark fz15">{agent.email}</div>
                </div>
              </div>

              {/* ส่วนดูประกาศ (อันนี้ยังคงเป็น Link ไว้เพื่อให้กดไปดูงานได้ หรือถ้าอยากปิดด้วยบอกได้ครับ) */}
              <Link href="/agent-single/1" className="d-flex align-items-center text-decoration-none mt-2 mt-md-0 ms-md-auto">
                <span className="text-thm fw600 fz14">ดูประกาศทั้งหมด</span>
                <i className="fal fa-arrow-right-long ms-2 text-thm"></i>
              </Link>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutMe;