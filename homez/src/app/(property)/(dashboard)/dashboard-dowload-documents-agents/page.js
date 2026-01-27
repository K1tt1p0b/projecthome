"use client";

import React from "react";
import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import Footer from "@/components/property/dashboard/Footer";

import DashboardDowloadDocumentsAgentsContent from "@/components/property/dashboard/dashboard-dowload-documents-agents";

const DashboardDowloadDocumentsAgentsPage = () => {
  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />

          {/* ✅ ทำให้ main เป็น flex column + สูงขั้นต่ำเต็มจอ */}
          <div className="dashboard__main pl0-md d-flex flex-column min-vh-100">
            
            {/* ✅ content กินพื้นที่ที่เหลือ */}
            <div className="dashboard__content bg-light pt30 pb30 flex-grow-1">
              {/* Header Title */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2 className="fw700">ดาวน์โหลดเอกสาร (Agent)</h2>
                    <p className="text-muted">
                      เอกสารสัญญา แบบฟอร์ม และคู่มือสำหรับตัวแทน/นายหน้า
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <DashboardDowloadDocumentsAgentsContent />
            </div>

            {/* ✅ footer จะถูกดันไปล่างสุดอัตโนมัติ */}
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardDowloadDocumentsAgentsPage;
