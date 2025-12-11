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

  // state สำหรับค้นหา + filter
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");  // category
  const [usageFilter, setUsageFilter] = useState(""); // usage

  return (
    <>
      {/* Main Header */}
      <Header />
      <MobileMenu />

      {/* Page Title */}
      <section className="inner-page-hero bgc-f7 pb40 pt40">
        <div className="container">
          <div className="row align-items-center" data-aos="fade-up">
            <div className="col-lg-12">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                <div className="main-title2">
                  <h2 className="title">ดาวน์โหลดเอกสาร</h2>
                  <p className="paragraph mb-0">
                    เอกสารสัญญา แบบฟอร์ม และคู่มือที่เกี่ยวข้องกับการซื้อขาย/เช่าที่ดิน
                    ทั้งผู้ใช้ทั่วไปและตัวแทน/นายหน้า
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb90 pb20-md">
        <div className="container">

          {/* Tabs */}
          <div className="row" data-aos="fade-up" data-aos-delay="50">
            <div className="col-lg-12">
              <Tabs active={activeTab} onChange={setActiveTab} />
            </div>
          </div>

          {/* Search + Filters + Clear Button */}
          <div
            className="row align-items-center mb30"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Search */}
            <div className="col-md-4 mb-2 mb-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาชื่อเอกสาร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* ประเภทเอกสาร */}
            <div className="col-md-3 mb-2 mb-md-0">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">ประเภทเอกสาร (ทั้งหมด)</option>
                <option value="สัญญา">สัญญา</option>
                <option value="แบบฟอร์ม">แบบฟอร์ม</option>
                <option value="คู่มือ">คู่มือ</option>
              </select>
            </div>

            {/* การใช้งาน */}
            <div className="col-md-3 mb-2 mb-md-0">
              <select
                className="form-select"
                value={usageFilter}
                onChange={(e) => setUsageFilter(e.target.value)}
              >
                <option value="">การใช้งาน (ทั้งหมด)</option>
                <option value="ซื้อขาย">ซื้อขาย</option>
                <option value="เช่า">เช่า</option>
                <option value="ทั่วไป">ทั่วไป</option>
                <option value="รับทรัพย์">รับทรัพย์</option>
              </select>
            </div>

            {/* Clear button */}
            <div className="col-md-2 text-md-end mt-2 mt-md-0">
              <button
                className="ud-btn btn-light"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("");
                  setUsageFilter("");
                }}
                style={{
                  padding: "8px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <i className="far fa-trash-alt me-2"></i> ล้างตัวกรอง
              </button>
            </div>
          </div>

          {/* Document List */}
          <div data-aos="fade-up" data-aos-delay="150">
            {activeTab === "user" && (
              <UserDocumentList
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                usageFilter={usageFilter}
              />
            )}

            {activeTab === "agent" && (
              <AgentDocumentList
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                usageFilter={usageFilter}
              />
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default DownloadDocumentsClient;
