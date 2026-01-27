"use client";

import React, { useState } from "react";
import { AgentDocumentList } from "@/components/download";

const DashboardDowloadDocumentsAgentsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [usageFilter, setUsageFilter] = useState("");

  const clearAll = () => {
    setSearchTerm("");
    setTypeFilter("");
    setUsageFilter("");
  };

  return (
    <>
      {/* Filters */}
      <div className="row align-items-center mb30">
        <div className="col-md-4 mb-2 mb-md-0">
          <input
            className="form-control"
            placeholder="ค้นหาชื่อเอกสาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

        <div className="col-md-2">
          <button
            className="ud-btn btn-light w-100"
            onClick={clearAll}
          >
            <i className="far fa-trash-alt me-2" />
            ล้างตัวกรอง
          </button>
        </div>
      </div>

      {/* List */}
      <AgentDocumentList
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        usageFilter={usageFilter}
      />
    </>
  );
};

export default DashboardDowloadDocumentsAgentsContent;
