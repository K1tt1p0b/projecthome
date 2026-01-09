"use client";

import React from "react";
import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import Footer from "@/components/property/dashboard/Footer";

// ✅ Import Component ที่เราแยกไปตะกี้เข้ามา
import ContactAdminContent from "@/components/property/dashboard/dashboard-contact-admin/ContactAdminContent";

const ContactAdminPage = () => {
  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bg-light pt30 pb30">
              
              {/* Header Title */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2 className="fw700">ติดต่อเจ้าหน้าที่ (Support Chat)</h2>
                    <p className="text-muted">สอบถามปัญหา แจ้งเรื่องร้องเรียน หรือขอความช่วยเหลือ</p>
                  </div>
                </div>
              </div>

              {/* ✅ เรียกใช้ Component เนื้อหาตรงนี้ */}
              <ContactAdminContent />

            </div>
            <Footer/>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactAdminPage;