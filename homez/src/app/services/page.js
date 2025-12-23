"use client";
import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/home/home-v10/footer";
import Header from "@/components/home/home-v10/Header";
import ConstructionRequest from "@/components/services/ConstructionRequest";
import CourseLanding from "@/components/services/CourseLanding";

const ServicePage = () => {
    // สร้างตัวแปรเก็บสถานะว่าเลือก Tab ไหนอยู่ (ค่าเริ่มต้นเป็น 'service')
    const [activeTab, setActiveTab] = useState("service");

    return (
        <>
            <Header />
            {/* 1. Hero Banner: เปลี่ยนรูปและข้อความให้ดูรวมๆ */}
            <section
                className="hero-service-section position-relative d-flex align-items-center justify-content-center"
                style={{
                    height: '350px',
                    background: 'url(/images/about/1.jpg) center center/cover no-repeat', // หารูปที่ดูเป็น Business หน่อย
                    backgroundColor: '#1d293e',
                }}
            >
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                <div className="container position-relative z-1 text-center text-white">
                    <h1 className="text-white fw700 fz50 mb20">Services & Academy</h1>
                    <p className="fz18 text-white-50">
                        ศูนย์รวมบริการงานก่อสร้าง และหลักสูตรปั้นนายหน้ามืออาชีพ
                    </p>
                </div>
            </section>

            {/* 2. Tabs Menu (ตัวกดสลับ) */}
            <section className="pt40 pb0 bgc-f7">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <div className="navtab-style1 p-3 bg-white rounded-pill shadow-sm d-flex gap-3">

                                {/* ปุ่ม Tab 1: บริการงานช่าง */}
                                <button
                                    onClick={() => setActiveTab("service")}
                                    className={`btn rounded-pill px-4 py-2 fw600 transition-all ${activeTab === "service"
                                        ? "btn-dark text-white shadow" // สีตอนถูกเลือก
                                        : "btn-light text-dark bg-transparent border-0" // สีตอนไม่เลือก
                                        }`}
                                    style={{ transition: "0.3s" }}
                                >
                                    <i className="fas fa-hammer me-2"></i> บริการงานช่าง
                                </button>

                                {/* ปุ่ม Tab 2: คอร์สนายหน้า */}
                                <button
                                    onClick={() => setActiveTab("course")}
                                    className={`btn rounded-pill px-4 py-2 fw600 transition-all ${activeTab === "course"
                                        ? "btn-thm text-white shadow" // สีส้ม Theme ตอนถูกเลือก
                                        : "btn-light text-dark bg-transparent border-0"
                                        }`}
                                    style={{ transition: "0.3s" }}
                                >
                                    <i className="fas fa-graduation-cap me-2"></i> คอร์สนายหน้า
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Content Area (แสดงผลตาม Tab ที่เลือก) */}
            <div className="min-vh-100 bgc-f7">

                {/* === CASE 1: ถ้าเลือกงานช่าง === */}
                {activeTab === "service" && (
                    <div className="fade-in-animation">
                        {/* ใส่ Component ก่อสร้างที่เราเคยทำไว้ */}
                        <section className="pt50 pb90">
                            <ConstructionRequest />
                        </section>

                        {/* แถม Portfolio งานก่อสร้างไว้ข้างล่าง (เฉพาะหน้านี้) */}
                        <section className="pb90">
                            <div className="container">
                                <div className="row mb30">
                                    <div className="col-lg-12 text-center">
                                        <h4>ผลงานจากพาร์ทเนอร์ก่อสร้าง</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb30">
                                        <div className="listing-style1 bg-white p-3 rounded shadow-sm">
                                            <Image width={400} height={250} className="w-100 rounded object-fit-cover" src="/images/listings/g1-1.jpg" alt="Work 1" />
                                            <h6 className="mt-3 mb-0 text-center">งานถมที่ดิน 5 ไร่</h6>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb30">
                                        <div className="listing-style1 bg-white p-3 rounded shadow-sm">
                                            <Image width={400} height={250} className="w-100 rounded object-fit-cover" src="/images/listings/g1-2.jpg" alt="Work 2" />
                                            <h6 className="mt-3 mb-0 text-center">งานรั้วคอนกรีต</h6>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb30">
                                        <div className="listing-style1 bg-white p-3 rounded shadow-sm">
                                            <Image width={400} height={250} className="w-100 rounded object-fit-cover" src="/images/listings/g1-3.jpg" alt="Work 3" />
                                            <h6 className="mt-3 mb-0 text-center">งานต่อเติมครัว</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* === CASE 2: ถ้าเลือกคอร์สเรียน === */}
                {activeTab === "course" && (
                    <div className="fade-in-animation">
                        {/* ใส่ Component ขายคอร์สที่เราเคยทำไว้ */}
                        <section className="pt50 pb90">
                            <CourseLanding />
                        </section>
                    </div>
                )}


            </div>
            <section className="footer-style1 pt60 pb-0">
                <Footer />
            </section>
        </>
    );
};

export default ServicePage;