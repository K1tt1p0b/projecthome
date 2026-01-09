import React from "react";
import AboutMe from "@/components/property/dashboard/dashboard-about-me/aboutme";
import DashboardHeader from "@/components/common/DashboardHeader";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import MobileMenu from "@/components/common/mobile-menu"; // ✅ ควรเพิ่มตัวนี้เข้ามาด้วยครับ

const MicroSheetPage = () => {
  return (
    <>
      {/* 1. ส่วน Header & Mobile Menu */}
      <DashboardHeader />
      <MobileMenu /> 

      {/* 2. Wrapper หลักของ Dashboard (สำคัญมาก ขาดไม่ได้) */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          
          {/* 3. Sidebar (เมนูซ้าย) */}
          <SidebarDashboard />

          {/* 4. ส่วนเนื้อหาหลัก (ขวา) */}
          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bg-light pt30 pb30">
              
              {/* --- Title (ใส่หรือไม่ใส่ก็ได้) --- */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2 className="fw700">เกี่ยวกับฉัน</h2>
                    <p className="text-muted">หน้าแสดงผลข้อมูลนามบัตรดิจิทัลของคุณ</p>
                  </div>
                </div>
              </div>

              {/* --- Content Area --- */}
              <div className="row">
                <div className="col-xl-12"> 
                   {/* เรียกใช้ Component AboutMe */}
                   <AboutMe />
                </div>
              </div>

            </div>

            {/* 5. Footer (ใส่ไว้ใน dashboard__main เพื่อให้ขยับตามเนื้อหา) */}
            <Footer />
            
          </div>
        </div>
      </div>
    </>
  );
};

export default MicroSheetPage;