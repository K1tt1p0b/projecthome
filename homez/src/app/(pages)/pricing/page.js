"use client"; // อย่าลืมบรรทัดนี้ถ้าใช้ Next.js 13+ (App Router)

import CallToActions from "@/components/common/CallToActions";
import DashboardHeader from "@/components/common/DashboardHeader";
import Footer from "@/components/property/dashboard/Footer";
import MobileMenu from "@/components/common/mobile-menu";
import Pricing from "@/components/pages/pricing/Pricing";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";

const PricingPlan = () => {
  return (
    <>
      {/* 1. Header ของ Dashboard */}
      <DashboardHeader />

      {/* 2. Mobile Menu (สำหรับมือถือ) */}
      <MobileMenu />

      {/* 3. โครงสร้าง Layout ของ Dashboard */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">

          {/* --- Sidebar ด้านซ้าย --- */}
          <div className="dashboard_content_wrapper">
            <div className="dashboard dashboard_wrapper pr30 pr0-xl">
              <SidebarDashboard />
            </div>
          </div>

          {/* --- เนื้อหาหลัก ด้านขวา --- */}
          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bg-light pt30 pb30">

              {/* หัวข้อหน้า (Breadcrumb & Title) */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2 className="fw700">Membership Plans</h2>
                    <p className="text-muted">เลือกแพ็กเกจที่เหมาะกับคุณ</p>
                  </div>
                </div>
              </div>

              {/* ส่วนแสดงตารางราคา (Pricing Component) */}
              <div className="row">
                <div className="col-xl-12">
                  {/* เรียกใช้ Component Pricing ที่คุณเตรียมไว้ */}
                  <Pricing />
                </div>
              </div>



            </div>
                      <Footer />
          </div>

        </div>
      </div>
    </>
  );
};

export default PricingPlan;