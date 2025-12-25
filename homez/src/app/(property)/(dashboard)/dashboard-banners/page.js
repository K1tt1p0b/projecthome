import "./dashboard-banners.css";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import BannerDashboardContent from "@/components/property/dashboard/dashboard-banners";

export const metadata = {
  title: "Banners || Homez - Real Estate NextJS Template",
};

const DashboardBannersPage = () => {
  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7 dashboard-bg-fix">
              <div className="dashboard-inner">
                <div className="row pb40 d-block d-lg-none">
                  <div className="col-lg-12">
                    <DboardMobileNavigation />
                  </div>
                </div>

                <div className="row align-items-center pb30">
                  <div className="col-12">
                    <div className="dashboard_title_area">
                      <h2>จัดการแบนเนอร์</h2>
                      <p className="text">
                        สร้าง/แก้ไข/เปิด-ปิดการใช้งานแบนเนอร์เพื่อโปรโมท (เดี๋ยวค่อยต่อ API จริง)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="dashboard-content-max">
                      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 pb30 mb30 overflow-hidden position-relative">
                        <BannerDashboardContent />
                      </div>
                    </div>
                  </div>
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

export default DashboardBannersPage;
