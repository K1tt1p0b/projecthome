import React from "react";
import Link from "next/link";

import ConstructionRequest from "@/components/services/ConstructionRequest";
import Footer from "@/components/home/home-v10/footer";
import Header from "@/components/home/home-v10/Header";
import MobileMenu from "@/components/common/mobile-menu";

export default async function ServiceCategoryPage({ params }) {
  const { category } = await params;

  return (
    <>
      <Header />
      <MobileMenu />

      {/* ✅ ตัวนี้คือ "กันซ้อน" แบบชัวร์สุด */}
      <div style={{ height: 110 }} />
      
      <ConstructionRequest initialCategory={category} />

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
}

export async function generateStaticParams() {
  return [
    { category: "land-fill" },
    { category: "fencing" },
    { category: "renovate" },
    { category: "piling" },
  ];
}
