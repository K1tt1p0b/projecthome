"use client";
import React, { useState } from "react";
import Image from "next/image";

const CourseLanding = () => {
  // state สำหรับเก็บว่า "กำลังดูคอร์สไหนอยู่" (ถ้า null แปลว่าดูหน้ารวม)
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 📦 ข้อมูลจำลองของคอร์ส (Database Mockup)
  const courses = [
    {
      id: 1,
      title: "P01: ปูพื้นฐานนายหน้าอสังหาฯ จับมือทำรุ่นที่ 5",
      instructor: "โค้ชพี่ทอม (Top Agent)",
      price: "2,990",
      fullPrice: "5,900",
      rating: 4.8,
      students: 500,

      tag: "Best Seller",
      desc: "เหมาะสำหรับมือใหม่ เริ่มต้นจากศูนย์ สอนดูโฉนด ประเมินราคา"
    },
    {
      id: 2,
      title: "M02: ยิงแอดอสังหาฯ ขั้นเทพ (Facebook & TikTok)",
      instructor: "คุณเจน Digital Marketing",
      price: "1,590",
      fullPrice: "3,500",
      rating: 4.9,
      students: 230,

      tag: "New",
      desc: "เจาะลึกการยิงแอดหาลูกค้าคนรวย ปิดการขายทางแชท"
    },
    {
      id: 3,
      title: "L03: กฎหมายและภาษีที่ดิน ฉบับนายหน้า",
      instructor: "ทนายวิชัย",
      price: "990",
      fullPrice: "1,990",
      rating: 4.7,
      students: 120,
      
      tag: "Recommended",
      desc: "รู้เรื่องภาษีโอน ค่าธรรมเนียม ไม่โดนกรมที่ดินหลอก"
    },
  ];

  // ==========================================
  // 🟢 ส่วนที่ 1: หน้าแสดงเนื้อหาคอร์ส (Detail View)
  // ==========================================
  if (selectedCourse) {
    return (
      <div className="container py-4">
        {/* ปุ่มย้อนกลับ */}
        <button 
            onClick={() => setSelectedCourse(null)} 
            className="btn btn-link text-dark text-decoration-none mb-4 pl-0"
        >
            <i className="fas fa-arrow-left me-2"></i> กลับไปหน้ารวมคอร์ส
        </button>

        <div className="row fade-in-animation">
          {/* เนื้อหาซ้าย */}
          <div className="col-lg-8">
            <div className="mb-4">
              <span className="badge bg-primary mb-2">{selectedCourse.tag}</span>
              <h2 className="fw700">{selectedCourse.title}</h2>
              <p className="text-muted fz16">{selectedCourse.desc}</p>
              <div className="d-flex align-items-center mt-3">
                <div className="d-flex text-warning me-2">
                   {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(selectedCourse.rating) ? "" : "text-black-50"}`}></i>
                   ))}
                </div>
                <span className="text-muted">({selectedCourse.rating}/5 คะแนน)</span>
              </div>
            </div>

            <div className="course-video mb-5 position-relative rounded overflow-hidden">
               <Image 
                  src={selectedCourse.image} 
                  width={800} height={450} 
                  className="w-100 h-100 object-fit-cover"
                  alt="Preview"
               />
            </div>
            {/* ... (เนื้อหา Detail อื่นๆ ใส่เพิ่มตรงนี้ได้ตามโค้ดเดิม) ... */}
          </div>

          {/* Sidebar ขวา */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{top: '100px'}}>
                <h3 className="text-thm fw700">฿{selectedCourse.price}</h3>
                <p className="text-decoration-line-through text-muted">฿{selectedCourse.fullPrice}</p>
                <button className="ud-btn btn-thm w-100 btn-lg mb-3">สมัครเรียนทันที</button>
                <p className="text-center text-muted fz14">สอนโดย: {selectedCourse.instructor}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🔵 ส่วนที่ 2: หน้ารวมคอร์สแบบการ์ด (Grid View)
  // ==========================================
  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-lg-12 text-center">
            <h2 className="fw700">คอร์สเรียนอสังหาฯ ทั้งหมด</h2>
            <p className="text-muted">อัพสกิลความรู้ สู่การเป็นนายหน้ามืออาชีพ</p>
        </div>
      </div>

      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            
            {/* 🃏 ตัวการ์ด (Card) */}
            <div 
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden cursor-pointer hover-card"
                onClick={() => setSelectedCourse(course)} // กดแล้วไปหน้า Detail
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            >
              {/* รูปภาพ */}
              <div className="position-relative" style={{height: '200px'}}>
                <Image 
                    src={course.image} 
                    fill 
                    className="object-fit-cover"
                    alt={course.title}
                />
                <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm">
                    {course.tag}
                </span>
              </div>

              {/* เนื้อหาการ์ด */}
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between text-muted fz14 mb-2">
                    <span><i className="fas fa-user-tie me-1"></i> {course.instructor}</span>
                </div>
                
                <h5 className="card-title fw600 mb-3 flex-grow-1" style={{lineHeight: '1.4'}}>
                    {course.title}
                </h5>

                <div className="border-top pt-3 mt-auto d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-warning fz14"><i className="fas fa-star"></i> {course.rating}</span>
                        <span className="text-muted fz14 ms-1">({course.students})</span>
                    </div>
                    <div>
                        <span className="fw700 text-thm fz18">฿{course.price}</span>
                    </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseLanding;