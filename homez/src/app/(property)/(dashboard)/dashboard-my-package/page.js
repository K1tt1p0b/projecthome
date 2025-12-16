import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import PackageDataTable from "@/components/property/dashboard/dashboard-package/PackageDataTable";

export const metadata = {
  title: "Dashboard My Package || Homez - Real Estate NextJS Template",
};

const DashboardMyPackage = () => {
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

              {/* 🟢 ส่วนที่ 1: Header Title (เก็บไว้ได้ครับ) */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>Points & Credits</h2>
                    <p className="text">ดูพอยต์คงเหลือ และประวัติการใช้งานของคุณ</p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              {/* 🔴 ส่วนที่ 2: Component ตาราง (ต้องแก้ตรงนี้) */}
              <div className="row">
                <div className="col-xl-12">
                  
                  {/* ❌ ลบ div ที่ชื่อ ps-widget bgc-white... ทิ้งไปครับ */}
                  {/* เพราะตัว Component ข้างในมันมีกล่องขาวของมันเองอยู่แล้ว */}
                  
                  <PackageDataTable /> 

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

export default DashboardMyPackage;