import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Pagination from "@/components/property/Pagination";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import CourseDataTable from "@/components/services/courseListing";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Courses || Homez - Real Estate NextJS Template",
};

const DashboardMyCourses = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
                {/* End .col-12 */}
              </div>
              {/* End .row */}

              <div className="row align-items-center pb40">
                <div className="col-xxl-3">
                  <div className="dashboard_title_area">
                    {/* ✅ 2. เปลี่ยนหัวข้อ */}
                    <h2>คอร์สเรียนของฉัน</h2>
                    <p className="text">ยินดีต้อนรับกลับมาครับ!</p>
                  </div>
                </div>
                <div className="col-xxl-9">
                  <div className="dashboard_search_meta d-md-flex align-items-center justify-content-xxl-end">

                    {/* 1. ช่องค้นหา */}
                    <div className="item1 mb15-md">
                      <div className="search_area">
                        <input
                          type="text"
                          className="form-control bdrs12"
                          placeholder="ค้นหาคอร์สเรียน..."
                        />
                        <label>
                          <span className="flaticon-search" />
                        </label>
                      </div>
                    </div>

                    {/* 2. ปุ่มลงประกาศใหม่ (สำหรับคอร์ส) */}
                    <div className="item2 ms-md-3">
                      <Link
                        href="/add-course" // 👈 ✅ 3. ลิงก์ไปหน้าเพิ่มคอร์ส
                        className="ud-btn btn-thm"
                      >
                        <i className="flaticon-new-tab me-2" />
                        ลงประกาศคอร์สใหม่
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      
                      {/* ✅ 4. เรียกใช้ตารางคอร์สเรียน */}
                      <CourseDataTable />

                      <div className="mt30">
                        <Pagination />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .dashboard__content */}

            <Footer />
          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* dashboard_content_wrapper */}
    </>
  );
};

export default DashboardMyCourses;