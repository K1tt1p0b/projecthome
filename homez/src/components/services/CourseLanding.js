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
      image: "/images/listings/g1-1.jpg",
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
      image: "/images/listings/g1-2.jpg",
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
      image: "/images/listings/g1-3.jpg",
      tag: "Recommended",
      desc: "รู้เรื่องภาษีโอน ค่าธรรมเนียม ไม่โดนกรมที่ดินหลอก"
    },
  ];

  // ==========================================
  // 🟢 ส่วนที่ 1: หน้าแสดงเนื้อหาคอร์ส (Detail View)
  // ==========================================
  if (selectedCourse) {
    return (
      // ❌ แก้จุดที่ 1: เอา fade-in-animation ออกจากตรงนี้
      <div className="container py-5 mb-5">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => setSelectedCourse(null)}
          className="btn btn-link text-dark text-decoration-none mb-4 pl-0 fw600"
        >
          <i className="fas fa-arrow-left me-2"></i> กลับไปหน้ารวมคอร์ส
        </button>

        <div className="row">
          {/* ✅ แก้จุดที่ 2: เอา fade-in-animation มาใส่ตรงนี้แทน (เนื้อหาซ้าย) */}
          <div className="col-lg-8 fade-in-animation">
            <div className="mb-4">
              <span className="badge bg-primary mb-2 px-3 py-2 rounded-pill">{selectedCourse.tag}</span>
              <h2 className="fw700 mt-2">{selectedCourse.title}</h2>
              <p className="text-muted fz16 mt-3">{selectedCourse.desc}</p>

              <div className="d-flex align-items-center mt-3 border-bottom pb-4">
                <div className="d-flex text-warning me-2 fz14">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(selectedCourse.rating) ? "" : "text-black-50"}`}></i>
                  ))}
                </div>
                <span className="text-muted fz14">({selectedCourse.rating} คะแนน | {selectedCourse.students} ผู้เรียน)</span>
              </div>
            </div>

            {/* ส่วนแสดง Video/Image Preview */}
            <div className="course-video mb-5 position-relative rounded-4 overflow-hidden shadow-sm">
              <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                <Image
                  src={selectedCourse.image}
                  fill
                  className="object-fit-cover"
                  alt={selectedCourse.title}
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '70px', height: '70px', cursor: 'pointer' }}>
                    <i className="fas fa-play text-thm fz24 ms-1"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* เนื้อหาคอร์ส */}
            <div className="bg-white p-4 rounded-4 border">
              <h4 className="fw700 mb-3">สิ่งที่คุณจะได้เรียนรู้</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="fas fa-check text-success me-2"></i> พื้นฐานการทำงานนายหน้าแบบมืออาชีพ</li>
                <li className="mb-2"><i className="fas fa-check text-success me-2"></i> เทคนิคการเจรจาต่อรองและปิดการขาย</li>
                <li className="mb-2"><i className="fas fa-check text-success me-2"></i> เอกสารสัญญาที่จำเป็นต้องใช้</li>
                <li><i className="fas fa-check text-success me-2"></i> การทำการตลาดออนไลน์และออฟไลน์</li>
              </ul>
            </div>
          </div>

          {/* ✅ แก้จุดที่ 3: เอา fade-in-animation มาใส่ตรงนี้แทน (Sidebar ขวา) */}
          <div className="col-lg-4 fade-in-animation">
            <div
              className="card border-0 shadow-sm rounded-4 p-4 bg-white"
              style={{
                position: 'sticky', // สั่ง Sticky เอง
                top: '300px',       // ระยะห่างจากด้านบน 120px (ไม่ชน Header)
                zIndex: 0
              }}          
            >
              <div className="text-center mb-3">
                <h2 className="text-thm fw700 mb-0">฿{selectedCourse.price}</h2>
                <p className="text-decoration-line-through text-muted fz14">จากราคาปกติ ฿{selectedCourse.fullPrice}</p>
              </div>

              <button className="ud-btn btn-thm w-100 btn-lg mb-3 rounded-pill">สมัครเรียนทันที</button>
              <button className="btn btn-outline-dark w-100 rounded-pill mb-4"><i className="far fa-heart me-2"></i> เพิ่มในรายการโปรด</button>

              <div className="d-flex align-items-center justify-content-center p-3 bg-light rounded-3">
                <div className="me-3">
                  <div className="rounded-circle bg-white d-flex align-items-center justify-content-center border" style={{ width: '50px', height: '50px' }}>
                    <i className="fas fa-user-tie fz20 text-dark"></i>
                  </div>
                </div>
                <div>
                  <p className="mb-0 fz12 text-muted">ผู้สอน</p>
                  <h6 className="mb-0 fw600">{selectedCourse.instructor}</h6>
                </div>
              </div>
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
    <div className="container py-5 mb-5">
      <div className="row mb-5 mt-4">
        <div className="col-lg-8 offset-lg-2 text-center">
          <div className="d-inline-block p-3 rounded-circle bg-opacity-10 mb-3" style={{ backgroundColor: '#eb675320', color: '#eb6753' }}>
            <i className="fas fa-graduation-cap fz30"></i>
          </div>
          <h2 className="fw700">คอร์สเรียนอสังหาฯ ทั้งหมด</h2>
          <p className="text-muted fz16">อัพสกิลความรู้ สู่การเป็นนายหน้ามืออาชีพ ด้วยหลักสูตรที่ผ่านการคัดสรรจากผู้เชี่ยวชาญตัวจริง</p>
        </div>
      </div>

      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden cursor-pointer hover-card-up"
              onClick={() => setSelectedCourse(course)}
              style={{ transition: 'all 0.3s ease' }}
            >
              <div className="position-relative" style={{ height: '220px' }}>
                <Image
                  src={course.image}
                  fill
                  className="object-fit-cover"
                  alt={course.title}
                />
                <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm rounded-pill px-3 py-2 fw500">
                  {course.tag}
                </span>
              </div>

              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between text-muted fz13 mb-2">
                  <span><i className="fas fa-user-tie me-1"></i> {course.instructor}</span>
                </div>

                <h5 className="card-title fw700 mb-3 flex-grow-1 hover-text-thm" style={{ lineHeight: '1.4' }}>
                  {course.title}
                </h5>

                <div className="border-top pt-3 mt-auto d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className="text-warning fz12 me-1"><i className="fas fa-star"></i></span>
                    <span className="fw600 fz14">{course.rating}</span>
                    <span className="text-muted fz13 ms-1">({course.students})</span>
                  </div>
                  <div>
                    <span className="fw700 text-thm fz18">฿{course.price}</span>
                    <span className="text-decoration-line-through text-muted fz12 ms-2">฿{course.fullPrice}</span>
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