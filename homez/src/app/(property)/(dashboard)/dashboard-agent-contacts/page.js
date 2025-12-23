import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";

import AgentContactsContent from "@/components/property/dashboard/dashboard-agent-contacts";

export const metadata = {
  title: "Agent Contacts || Homez - Real Estate NextJS Template",
};

const DashboardAgentContacts = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav */}
      <MobileMenu />
      {/* End Mobile Nav */}

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7">
              <div className="row pb40 d-block d-lg-none">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>ข้อความจากผู้สนใจ</h2>
                    <p className="text">
                      ผู้ใช้ที่ติดต่อจากฟอร์ม Contact Us ของ Agent (ดูได้อย่างเดียว)
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 pb30 mb30 overflow-hidden position-relative">
                    <AgentContactsContent />
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* dashboard_content_wrapper */}
    </>
  );
};

export default DashboardAgentContacts;
