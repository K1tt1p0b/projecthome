import React from "react";
import ConstructionRequest from "@/components/services/ConstructionRequest";
import Footer from "@/components/home/home-v10/footer";
import Header from "@/components/home/home-v10/Header";

// ฟังก์ชันนี้จะดึงค่า category จาก URL ให้อัตโนมัติครับ
// 1. เติมคำว่า async หน้า function
export default async function ServiceCategoryPage({ params }) {
  
  // 2. เพิ่มบรรทัดนี้เพื่อรอรับค่า params (สำคัญ!)
  const { category } = await params;
    return (
        <>
            <Header />
            {/* ส่งค่าหมวดหมู่ (เช่น land-fill) ไปเป็นค่าเริ่มต้น */}
            <ConstructionRequest initialCategory={category} />
            <section className="footer-style1 pt60 pb-0">
                <Footer />
            </section>
        </>
    );
}

// (Optional) ถ้าต้องการทำ Static Site Generation (SSG) เพื่อความเร็วสูงสุด
export async function generateStaticParams() {
    return [
        { category: "land-fill" },
        { category: "fencing" },
        { category: "renovate" },
        { category: "piling" },
    ];
}