import React from "react";
import ListingContent from "@/components/listing/grid-view/grid-full-3-col/ListingContent";

// ✅ 1. Metadata สามารถใช้งานได้แล้ว (Server Component)
export const metadata = {
  title: "ค้นหาอสังหาริมทรัพย์ || LandX",
  description: "รวมบ้าน คอนโด ที่ดิน คุณภาพดี",
};

const GridFull3ColPage = () => {
  return (
    <>
      {/* ✅ 2. เรียกใช้ Client Component ที่เราแยกไว้ */}
      <ListingContent />
    </>
  );
};

export default GridFull3ColPage;