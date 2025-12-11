import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import BuyPointsPage from "@/components/property/dashboard/points/BuyPage";

export const metadata = {
  title: "Dashboard Buy Points || Homez - Real Estate NextJS Template",
};

const DashboardBuyPoints = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* Mobile Nav */}
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              {/* Header หน้า */}
              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>ซื้อพอยต์</h2>
                    <p className="text">เลือกแพ็กเกจพอยต์ที่ต้องการเติม</p>
                  </div>
                </div>
              </div>

              {/* เนื้อหา */}
              <div className="row">
                <div className="col-xl-12">
                  <BuyPointsPage />
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

export default DashboardBuyPoints;
