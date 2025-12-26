"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// 📦 ข้อมูลจำลอง (เอา rating กับ students ออกแล้ว)
const allCourses = [
  { id: 1, title: "P01: พื้นฐานนายหน้าอสังหาฯ", price: "2,990", fullPrice: "5,900", image: "/images/listings/g1-1.jpg", tag: "Best Seller", instructor: "โค้ชพี่ทอม" },
  { id: 2, title: "M02: ยิงแอดอสังหาฯ ขั้นเทพ", price: "1,590", fullPrice: "3,500", image: "/images/listings/g1-2.jpg", tag: "New", instructor: "คุณเจน Digital" },
  { id: 3, title: "L03: กฎหมายที่ดินฉบับนายหน้า", price: "990", fullPrice: "1,990", image: "/images/listings/g1-3.jpg", tag: "Recommended", instructor: "ทนายวิชัย" },
  { id: 4, title: "S04: เทคนิคถ่ายภาพบ้านให้แพง", price: "1,290", fullPrice: "2,500", image: "/images/listings/g1-4.jpg", tag: "Hot", instructor: "ช่างภาพเอก" },
  { id: 5, title: "P05: ปิดการขายทางโทรศัพท์", price: "890", fullPrice: "1,500", image: "/images/listings/g1-1.jpg", tag: "Popular", instructor: "โค้ชพี่ทอม" },
  { id: 6, title: "M06: TikTok Marketing 2024", price: "2,500", fullPrice: "4,900", image: "/images/listings/g1-2.jpg", tag: "New", instructor: "คุณเจน Digital" },
  { id: 7, title: "L07: สัญญาจะซื้อจะขาย", price: "590", fullPrice: "990", image: "/images/listings/g1-3.jpg", tag: "Basic", instructor: "ทนายวิชัย" },
  { id: 8, title: "inv08: ลงทุนคอนโดเงินเหลือ", price: "3,900", fullPrice: "7,900", image: "/images/listings/g1-4.jpg", tag: "Premium", instructor: "โค้ชรวย" },
];

const CourseLanding = () => {
  // ⚙️ ระบบ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // คำนวณตัดข้อมูล
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = allCourses.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allCourses.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-5 mb-5">
      {/* Header */}
      <div className="row mb-5 mt-4">
        <div className="col-lg-8 offset-lg-2 text-center">
          <div className="d-inline-block p-3 rounded-circle bg-opacity-10 mb-3" style={{ backgroundColor: '#eb675320', color: '#eb6753' }}>
            <i className="fas fa-graduation-cap fz30"></i>
          </div>
          <h2 className="fw700">คอร์สเรียนอสังหาฯ ทั้งหมด</h2>
          <p className="text-muted fz16">อัพสกิลความรู้ สู่การเป็นนายหน้ามืออาชีพ</p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="row">
        {currentCourses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            <Link href={`/courses/${course.id}`} className="text-decoration-none text-dark">
              <motion.div
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                whileHover={{ y: -10, boxShadow: "0px 10px 30px rgba(0,0,0,0.15)", borderColor: "#eb6753" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ backgroundColor: '#fff', border: '1px solid transparent' }}
              >
                <div className="position-relative" style={{ height: '220px' }}>
                  <Image src={course.image} fill className="object-fit-cover" alt={course.title} />
                  <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm rounded-pill px-3 py-2 fw500">{course.tag}</span>
                </div>

                <div className="card-body p-4 d-flex flex-column">
                  {/* ชื่อผู้สอน */}
                  <div className="d-flex justify-content-between text-muted fz13 mb-2">
                    <span><i className="fas fa-user-tie me-1"></i> {course.instructor}</span>
                  </div>
                  
                  {/* ชื่อคอร์ส */}
                  <motion.h5 
                    className="card-title fw700 mb-3 flex-grow-1" 
                    style={{ lineHeight: '1.4' }}
                    whileHover={{ color: "#eb6753" }}
                  >
                    {course.title}
                  </motion.h5>

                  {/* ✅ ส่วนราคา (ตัดรีวิวออกแล้ว) */}
                  <div className="border-top pt-3 mt-auto d-flex justify-content-end align-items-center">
                    <div>
                      <span className="fw700 text-thm fz18">฿{course.price}</span>
                      <span className="text-decoration-line-through text-muted fz12 ms-2">฿{course.fullPrice}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="mbp_pagination text-center">
              <ul className="page_navigation list-inline">
                
                <li className="list-inline-item">
                  <button 
                    className="page-link rounded-circle border-0"
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    style={{ width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li className="list-inline-item" key={index}>
                    <button 
                      className={`page-link rounded-circle border-0 ${currentPage === index + 1 ? "active" : ""}`}
                      onClick={() => paginate(index + 1)}
                      style={{ 
                        width:'40px', height:'40px', 
                        backgroundColor: currentPage === index + 1 ? '#eb6753' : '#f7f7f7',
                        color: currentPage === index + 1 ? '#fff' : '#000'
                      }}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className="list-inline-item">
                  <button 
                    className="page-link rounded-circle border-0"
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    style={{ width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                </li>

              </ul>
              <p className="mt-3 text-muted fz14">หน้า {currentPage} จาก {totalPages}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLanding;