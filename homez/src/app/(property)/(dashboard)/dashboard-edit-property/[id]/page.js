import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";

import DashboardEditPropertyContent from "@/components/property/dashboard/dashboard-edit-property";

export const metadata = {
  title: "Dashboard Edit Property || Homez - Real Estate NextJS Template",
};

export default async function DashboardEditProperty({ params }) {
  // Next 15: params อาจเป็น Promise ต้อง await ก่อน
  const { id: propertyId } = await params;

  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />

      {/* Mobile Nav */}
      <MobileMenu />

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />

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
                    <h2>แก้ไขประกาศ</h2>
                    <p className="text">Update your property details</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
                    <div className="navtab-style1">
                      {/* ส่ง id เข้า component */}
                      <DashboardEditPropertyContent propertyId={propertyId} />
                    </div>
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
}
