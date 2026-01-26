"use client";

import React from "react";
import dynamic from "next/dynamic";

// ✅ Import CSS (ถ้าใช้ตัวเก่า react-quill ให้แก้ path เป็น 'react-quill/dist/quill.snow.css')
import "react-quill-new/dist/quill.snow.css"; 

// ✅ Dynamic Import เพื่อปิด SSR (สำคัญมาก ไม่งั้นจะ Error document is not defined)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const RichTextEditor = ({ value, onChange, placeholder }) => {
  // ตั้งค่าปุ่มใน Toolbar (อยากเพิ่มอะไรใส่ตรงนี้)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"], // ตัวหนา, เอียง, ขีดเส้น
      [{ list: "ordered" }, { list: "bullet" }], // ลิสต์รายการ
      ["link", "clean"], // ลิงก์, ล้าง format
    ],
  };

  return (
    <div className="rich-text-custom">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        style={{
            height: "200px", // ความสูงของพื้นที่พิมพ์
            marginBottom: "50px" // เว้นที่ให้ Toolbar ด้านล่างไม่ทับ
        }} 
      />
      
      {/* CSS แต่งขอบให้มนๆ สวยงาม */}
      <style jsx global>{`
        .rich-text-custom .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: #ddd;
          font-family: inherit;
          font-size: 15px;
        }
        .rich-text-custom .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: #ddd;
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;