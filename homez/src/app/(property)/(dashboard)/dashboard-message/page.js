import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import ChatDashboardClient from "../../../../components/property/dashboard/dashboard-message/ChatDashboardClient"; // ✅ Import ตัวลูกเข้ามา

export const metadata = {
  title: "ข้อความ | Homez Dashboard",
};

const DashboardMessage = () => {
  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">

              {/* Header Title Area */}
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>ข้อความ</h2>
                    <p className="text">สนทนากับลูกค้าและนายหน้า</p>
                  </div>
                </div>
              </div>

              {/* ✅ เรียกใช้ Client Component ตรงนี้ */}
              <ChatDashboardClient />

            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardMessage;