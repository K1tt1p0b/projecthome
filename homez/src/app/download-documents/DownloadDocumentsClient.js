// src/app/download-documents/DownloadDocumentsClient.jsx
"use client";

import { useState } from "react";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/home/home-v10/footer";
import Header from "@/components/home/home-v10/Header";

import {
  Tabs,
  UserDocumentList,
  AgentDocumentList,
} from "@/components/download";

const DownloadDocumentsClient = () => {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <>
      {/* Main Header Nav */}
      <Header />
      {/* End Main Header Nav */}

      {/* Mobile Nav */}
      <MobileMenu />
      {/* End Mobile Nav */}

      {/* Hero / Page Title */}
      <section className="inner-page-hero bgc-f7 pb40 pt40">
        <div className="container">
          <div className="row align-items-center" data-aos="fade-up">
            <div className="col-lg-12">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                <div className="main-title2">
                  <h2 className="title">ดาวน์โหลดเอกสาร</h2>
                  <p className="paragraph mb-0">
                    เอกสารสัญญา แบบฟอร์ม และคู่มือที่เกี่ยวข้องกับการซื้อขาย/เช่าที่ดิน
                    ทั้งสำหรับผู้ใช้ทั่วไปและตัวแทน / นายหน้า
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Hero */}

      {/* Main Content */}
      <section className="pb90 pb20-md">
        <div className="container">
          {/* Tabs */}
          <div className="row" data-aos="fade-up" data-aos-delay="50">
            <div className="col-lg-12">
              <Tabs active={activeTab} onChange={setActiveTab} />
            </div>
          </div>

          {/* Search + Filters */}
          <div
            className="row align-items-center mb30"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="col-md-6 mb-2 mb-md-0">
              <div className="form-group mb-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาชื่อเอกสาร..."
                />
              </div>
            </div>
            <div className="col-md-3 mb-2 mb-md-0">
              <div className="form-group mb-0">
                <select className="form-select">
                  <option value="">ประเภทเอกสาร (ทั้งหมด)</option>
                  <option value="contract">สัญญา</option>
                  <option value="form">แบบฟอร์ม</option>
                  <option value="guide">คู่มือ/แนวทาง</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group mb-0">
                <select className="form-select">
                  <option value="">การใช้งาน (ทั้งหมด)</option>
                  <option value="sale">ซื้อขาย</option>
                  <option value="rent">เช่า</option>
                  <option value="authorize">มอบอำนาจ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Document List ตาม tab */}
          <div data-aos="fade-up" data-aos-delay="150">
            {activeTab === "user" && <UserDocumentList />}
            {activeTab === "agent" && <AgentDocumentList />}
          </div>
        </div>
      </section>

      {/* Footer Style เหมือนหน้า Home_v10 */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default DownloadDocumentsClient;
