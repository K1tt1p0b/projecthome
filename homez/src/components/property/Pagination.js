"use client";
import React from "react";

// รับค่าจากหน้าหลักมาใช้งาน (Props)
// totalItems = จำนวนรายการทั้งหมด (เช่น 50 รายการ)
// pageSize = จำนวนที่แสดงต่อหน้า (เช่น 10 รายการ)
// currentPage = หน้าปัจจุบัน
// setCurrentPage = ฟังก์ชันเปลี่ยนหน้า
const Pagination = ({ 
  totalItems = 0, 
  pageSize = 10, 
  currentPage = 1, 
  setCurrentPage 
}) => {
  
  // 1. คำนวณจำนวนหน้าทั้งหมดจากข้อมูลจริง
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    // ถ้ามีการส่งฟังก์ชันมา ให้เรียกใช้ (เพื่อเปลี่ยนหน้าใน Parent)
    if (setCurrentPage) {
        setCurrentPage(page);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 2. คำนวณเลขรายการที่จะแสดง (เช่น 1-10, 11-20)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const renderPageNumbers = generatePageNumbers().map((page) => (
    <li
      key={page}
      className={`page-item ${page === currentPage ? "active" : ""}`}
    >
      <span
        className="page-link pointer"
        onClick={() => handlePageClick(page)}
      >
        {page}
      </span>
    </li>
  ));

  if (totalItems === 0) return null; // ถ้าไม่มีข้อมูล ไม่ต้องโชว์ Pagination

  return (
    <div className="mbp_pagination text-center">
      <ul className="page_navigation">
        <li className="page-item">
          <span
            className="page-link pointer"
            onClick={() => handlePageClick(currentPage - 1)}
            style={{ 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                opacity: currentPage === 1 ? 0.5 : 1 
            }}
          >
            <span className="fas fa-angle-left" />
          </span>
        </li>
        {renderPageNumbers}
        <li className="page-item pointer">
          <span
            className="page-link"
            onClick={() => handlePageClick(currentPage + 1)}
            style={{ 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                opacity: currentPage === totalPages ? 0.5 : 1 
            }}
          >
            <span className="fas fa-angle-right" />
          </span>
        </li>
      </ul>

      {/* ✅ 3. แสดงข้อความตามจริงที่คำนวณได้ */}
      <p className="mt10 pagination_page_count text-center">
        {startItem} – {endItem} จากทั้งหมด {totalItems} รายการ
      </p>
    </div>
  );
};

export default Pagination;