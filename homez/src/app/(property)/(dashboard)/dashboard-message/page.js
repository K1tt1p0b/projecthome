import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import SearchBox from "@/components/property/dashboard/dashboard-message/SearchBox";
import UserInboxList from "@/components/property/dashboard/dashboard-message/UserInboxList";
import UserChatBoxContent from "@/components/property/dashboard/dashboard-message/UserChatBoxContent";

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

              {/* ✅✅ REDESIGN: แยกเป็น 2 กล่อง (ซ้าย/ขวา) เว้นห่างกัน */}
              <div className="row mb40">

                {/* 👈 กล่องซ้าย: รายชื่อ (Sidebar) */}
                <div className="col-lg-5 col-xl-4">
                  <div className="bg-white border rounded-4 shadow-sm overflow-hidden d-flex flex-column h-100" style={{ maxHeight: '80vh', minHeight: '600px' }}>
                    <div className="p-3 border-bottom bg-white">
                      <h4 className="mb-3 fw-bold">Chats</h4>
                      <SearchBox />
                    </div>
                    <div className="flex-grow-1 overflow-auto custom-scrollbar">
                      <UserInboxList />
                    </div>
                  </div>
                </div>

                {/* 👉 กล่องขวา: ห้องแชท (Chat Room) */}
                <div className="col-lg-7 col-xl-8">
                  <div className="bg-white border rounded-4 shadow-sm overflow-hidden h-100" style={{ maxHeight: '80vh', minHeight: '600px' }}>
                    <UserChatBoxContent />
                  </div>
                </div>

              </div>
              {/* END REDESIGN */}

            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardMessage;