import React from "react";
// Import Layout หลักของ Dashboard
import DashboardHeader from "@/components/common/DashboardHeader";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/property/dashboard/Footer";

// ✅ Import ฟอร์มคอร์สออนไลน์ที่เราเพิ่งทำ
import AddCourseForm from "@/components/property/dashboard/dashboard-add-course/AddCourseForm";

export const metadata = {
  title: "ลงประกาศคอร์สเรียน || Homez Dashboard",
  description: "หน้าสำหรับลงประกาศคอร์สเรียนออนไลน์",
};

const AddCoursePage = () => {
  return (
    <>
      {/* ส่วนหัวและเมนูมือถือ */}
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">

          {/* Sidebar ด้านซ้าย */}
          <div className="dashboard_content_wrapper">
            <div className="dashboard dashboard_wrapper pr30 pr0-xl">
              <SidebarDashboard />
            </div>
          </div>

          {/* เนื้อหาหลัก ด้านขวา */}
          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bg-light pt30 pb30">

              {/* หัวข้อหน้า */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2 className="fw700">ลงประกาศคอร์สเรียน</h2>
                    <p className="text-muted">สร้างคอร์สออนไลน์ของคุณได้ง่ายๆ ที่นี่</p>
                  </div>
                </div>
              </div>

              {/* ✅ เรียกใช้ฟอร์ม (Form) ตรงนี้ */}
              <div className="row">
                <div className="col-xl-12">
                  <AddCourseForm />
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

export default AddCoursePage;