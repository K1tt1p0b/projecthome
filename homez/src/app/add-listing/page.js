"use client";
import React, { useState } from "react";
import DashboardHeader from "@/components/common/DashboardHeader";
import Footer from "@/components/property/dashboard/Footer";
import MobileMenu from "@/components/common/mobile-menu";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import AddListingForm from "@/components/property/dashboard/dashboard-addlistingform/AddListingForm";

const AddListingPage = () => {
    return (
        <>
            {/* ส่วน Layout หลัก */}
            <DashboardHeader />
            <MobileMenu />

            <div className="dashboard_content_wrapper">
                <div className="dashboard dashboard_wrapper pr30 pr0-md">

                    {/* Sidebar */}
                    <div className="dashboard_content_wrapper">
                        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
                            <SidebarDashboard />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="dashboard__main pl0-md">
                        <div className="dashboard__content bg-light pt30 pb30">

                            <div className="row align-items-center pb40">
                                <div className="col-lg-12">
                                    <div className="dashboard_title_area">
                                        <h2 className="fw700">ลงประกาศใหม่</h2>
                                        <p className="text-muted">กรอกข้อมูลให้ครบถ้วนเพื่อเริ่มขาย</p>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ 2. เรียกใช้ Component ไส้ใน (Logic อยู่ในนี้หมด) */}
                            <div className="row">
                                <div className="col-xl-12">
                                    <AddListingForm />
                                </div>
                            </div>

                            <div className="row mt-5">
                                <div className="col-lg-12">
                                    <Footer />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddListingPage;