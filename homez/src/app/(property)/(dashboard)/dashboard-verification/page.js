"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import VerifyEmailBox from "@/components/property/dashboard/dashboard-profile/VerifyEmailBox";
import KycBox from "@/components/property/dashboard/dashboard-profile/KycBox";

const VerificationPage = () => {
  return (
    <>
      {/* 1. ส่วนหัวและเมนูมือถือ */}
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr2 pr0-xl">
          
          {/* 2. Sidebar ด้านซ้าย */}
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              
              {/* เมนูมือถือ (ซ่อนใน Desktop) */}
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              {/* หัวข้อหน้า */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>ศูนย์ยืนยันตัวตน (Verification Center)</h2>
                    <p className="text">กรุณาดำเนินการให้ครบทั้ง 2 ขั้นตอน เพื่อเปิดใช้งานระบบเต็มรูปแบบ</p>
                  </div>
                </div>
              </div>

              {/* --- เนื้อหาหลัก --- */}
              <div className="row">
                <div className="col-xl-12">
                  
                  {/* Step 1: ยืนยันอีเมล */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="d-flex align-items-center mb20">
                       <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{width: 35, height: 35}}>1</div>
                       <h4 className="title fz17 mb0">ยืนยันอีเมล (Email Verification)</h4>
                    </div>
                    {/* กล่องอีเมลแบบใหม่ (ที่มีปุ่มส่งอีกครั้ง) */}
                    <VerifyEmailBox email="user@example.com" isVerified={false} />
                  </div>

                  {/* Step 2: KYC */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="d-flex align-items-center mb20">
                       <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{width: 35, height: 35}}>2</div>
                       <h4 className="title fz17 mb0">ยืนยันตัวตน (KYC)</h4>
                    </div>
                    <p className="text-muted mb20 ms-0 ms-md-5">อัปโหลดภาพถ่ายบัตรประชาชนเพื่อยืนยันตัวตน</p>
                    <div className="ms-0 ms-md-5">
                       <KycBox />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 3. Footer */}
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationPage;