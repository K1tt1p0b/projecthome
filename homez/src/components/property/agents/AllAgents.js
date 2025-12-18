import agents from "@/data/agents";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AllAgents = ({ data }) => {
  
  // ✅ 1. สร้าง Mock Data จังหวัดเตรียมไว้ (เพิ่มลดได้ตามใจชอบ)
  const mockProvinces = [
    "กรุงเทพมหานคร",
    "เชียงใหม่",
    "ภูเก็ต",
    "ชลบุรี",
    "ขอนแก่น",
    "นครราชสีมา",
    "ประจวบคีรีขันธ์",
    "สุราษฎร์ธานี"
  ];

  return (
    <>
      {/* ✅ 2. เพิ่ม index เข้ามาใน map เพื่อใช้เลือกจังหวัด */}
      {data.map((agent, index) => {
        
        // ✅ 3. Logic เลือกจังหวัด: 
        // ถ้ามีข้อมูลจริง (agent.province) ให้ใช้ข้อมูลจริง
        // ถ้าไม่มี ให้วนหยิบจาก mockProvinces ตามลำดับ index
        const displayProvince = agent.province || mockProvinces[index % mockProvinces.length];

        return (
          <div className="col" key={agent.id}>
            <div className="feature-style2 mb30">
              <div className="feature-img">
                <Link href={`/agent-single/${agent.id}`}>
                  <Image
                    width={210}
                    height={240}
                    className="bdrs12 w-100 h-100 cover"
                    src={agent.image}
                    alt="agents"
                  />
                </Link>
              </div>
              <div className="feature-content pt20">
                <h6 className="title mb-1">
                  <Link href={`/agent-single/${agent.id}`}>{agent.name}</Link>
                </h6>
                
                {/* ✅ 4. แสดงผลจังหวัดแทน Broker */}
                <p className="text fz15">
                  {/* ผมแถมไอคอนหมุดแผนที่ให้ด้วย จะได้ดูสื่อความหมายครับ */}
                  <i className="fas fa-map-marker-alt me-2" style={{ color: '#eb6753' }} /> 
                  {displayProvince}
                </p>
                
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AllAgents;