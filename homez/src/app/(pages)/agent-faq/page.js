"use client";

import React from "react";
import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";

// ✅ Import ของเดิมที่คุณต้องการเก็บไว้
import Footer from "@/components/property/dashboard/Footer";
import FaqAgent1 from "@/components/pages/agent-faq/Faq-agent1";
import FaqAgent2 from "@/components/pages/agent-faq/Faq-agent2";
import Faqagent3 from "@/components/pages/agent-faq/Faq-agent3";

const Agentfaq = () => {
    return (
        <>
            {/* 1. Header & Mobile Menu */}
            <DashboardHeader />
            <MobileMenu />

            {/* 2. Wrapper หลักของ Dashboard */}
            <div className="dashboard_content_wrapper">
                <div className="dashboard dashboard_wrapper pr30 pr0-md">

                    {/* 3. Sidebar (เมนูซ้าย) */}
                    <SidebarDashboard />

                    {/* 4. เนื้อหาหลัก (ขวา) */}
                    <div className="dashboard__main pl0-md">
                        <div className="dashboard__content bg-light pt30 pb30">

                            {/* --- ส่วนหัวข้อ (Breadcrumb) --- */}
                            <div className="row align-items-center pb40">
                                <div className="col-lg-12">
                                    <div className="dashboard_title_area">
                                        <h2 className="fw700">คำถามที่พบบ่อย</h2>
                                        <p className="text-muted">รวมคำถามและคำตอบเกี่ยวกับการใช้งานระบบ</p>
                                    </div>
                                </div>
                            </div>

                            {/* --- เนื้อหา FAQ (ของคุณ) --- */}
                            <div className="row">
                                <div className="col-lg-12">

                                    {/* FAQ 1 */}
                                    <div className="ui-content mb30">
                                        <h4 className="title mb15">คำถามทั่วไป</h4>
                                        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden">
                                            <div className="accordion-style1 faq-page">
                                                <FaqAgent1 />
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAQ 2 */}
                                    <div className="ui-content mb30">
                                        <h4 className="title mb15">บัญชี & การใช้งาน</h4>
                                        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden">
                                            <div className="accordion-style1 faq-page">
                                                <FaqAgent2 />
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAQ 3 */}
                                    <div className="ui-content mb30">
                                        <h4 className="title mb15">การลงประกาศ & การเงิน</h4>
                                        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden">
                                            <div className="accordion-style1 faq-page">
                                                <Faqagent3 />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* ✅ 6. Footer (ที่คุณไม่อยากให้ตัดออก) */}
                            <Footer />

                    </div>
                </div>
            </div>
        </>
    );
};

export default Agentfaq;