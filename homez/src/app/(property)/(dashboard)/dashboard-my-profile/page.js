import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import ChangePasswordForm from "@/components/property/dashboard/dashboard-profile/ChangePasswordForm";
import PersonalInfo from "@/components/property/dashboard/dashboard-profile/PersonalInfo";
import ProfileBox from "@/components/property/dashboard/dashboard-profile/ProfileBox";
import KycBox from "@/components/property/dashboard/dashboard-profile/KycBox";

export const metadata = {
  title: "Dashboard My Profile || Homez - Real Estate NextJS Template",
};

const DashboardMyProfile = () => {
  return (
    <>
      <DashboardHeader />
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

              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>โปรไฟล์ของฉัน</h2>
                    <p className="text">ยินดีต้อนรับกลับมาครับ!</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="col-xl-7">
                      <ProfileBox />
                    </div>

                    <div className="col-lg-12">
                      <PersonalInfo />
                    </div>
                  </div>

                  {/* KYC */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">ยืนยันตัวตน (KYC)</h4>
                    <KycBox />
                  </div>


                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Change password</h4>
                    <ChangePasswordForm />
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

export default DashboardMyProfile;
