"use client";

import { useEffect } from "react";
import "./edit.css";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";

import BannerEditClient from "@/components/property/dashboard/dashboard-banners/BannerEditClient";

export default function DashboardBannersEditPage() {
  useEffect(() => {
    document.body.classList.add("banner-edit-page");
    return () => {
      document.body.classList.remove("banner-edit-page");
    };
  }, []);

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

                <div className="dashboard-content-max">
                  <BannerEditClient />
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
