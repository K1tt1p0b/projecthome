import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import PromotePage from "@/components/property/dashboard/points/PromotePage";

export const metadata = {
  title: "Dashboard Promote Listing || Homez - Real Estate NextJS Template",
};

const DashboardPromotePoints = () => {
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
                    <h2>โปรโมตประกาศ</h2>
                    <p className="text">
                      เลือกแพ็กเกจโปรโมตประกาศด้วยพอยต์หรือเครดิตของคุณ
                    </p>
                  </div>
                </div>
              </div>

              {/* เนื้อหา */}
              <div className="row">
                <div className="col-xl-12">
                  <PromotePage />
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

export default DashboardPromotePoints;
