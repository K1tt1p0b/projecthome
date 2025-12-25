"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import Footer from "@/components/property/dashboard/Footer";
import MobileMenu from "@/components/common/mobile-menu";
import Pricing from "@/components/pages/pricing/Pricing";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";

const PricingPlan = () => {
  return (
    <>
      {/* 1. Header & Mobile Menu */}
      <DashboardHeader />
      <MobileMenu />

      {/* 2. Wrapper หลัก (ชั้นเดียวพอ) */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          
          {/* ✅ Sidebar วางตรงนี้เลย (ไม่ต้องมี div ครอบซ้อน) */}
          <SidebarDashboard />

          {/* 3. เนื้อหาหลัก ด้านขวา */}
          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bg-light pt30 pb30">

              {/* หัวข้อหน้า */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2 className="fw700">Membership Plans</h2>
                    <p className="text-muted">เลือกแพ็กเกจที่เหมาะกับคุณ</p>
                  </div>
                </div>
              </div>

              {/* ตารางราคา Pricing */}
              <div className="row">
                <div className="col-xl-12">
                  <Pricing />
                </div>
              </div>

            </div>
            
            {/* Footer อยู่ในส่วน Main ด้านล่างสุด */}
            <Footer />
            
          </div>
          {/* จบส่วนเนื้อหาหลัก */}

        </div>
      </div>
    </>
  );
};

export default PricingPlan;