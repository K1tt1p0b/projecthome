"use client";

import React from "react";

// Mock Data
const mockPaymentData = [
  {
    id: "INV-2024001",
    date: "12 ต.ค. 2023",
    item: "แพ็กเกจ Business (รายปี)",
    method: "บัตรเครดิต",
    amount: 15900,
    status: "success", 
    statusLabel: "ชำระแล้ว",
  },
  {
    id: "INV-2024002",
    date: "05 พ.ย. 2023",
    item: "ซื้อพอยต์เพิ่ม 500 พอยต์",
    method: "QR PromptPay",
    amount: 500,
    status: "success",
    statusLabel: "ชำระแล้ว",
  },
  {
    id: "INV-2024003",
    date: "28 พ.ย. 2023",
    item: "บริการดันประกาศ (Boost)",
    method: "ตัดจากพอยต์",
    amount: 0,
    status: "success",
    statusLabel: "สำเร็จ",
  },
  {
    id: "INV-2024004",
    date: "01 ธ.ค. 2023",
    item: "แพ็กเกจ Pro Agent (รายเดือน)",
    method: "โอนผ่านธนาคาร",
    amount: 590,
    status: "pending",
    statusLabel: "รอตรวจสอบ",
  },
];

const PaymentHistoryTable = () => {

  const getStatusBadge = (status) => {
    switch (status) {
      case "success": return "bg-success text-white";
      case "pending": return "bg-warning text-dark";
      case "failed": return "bg-danger text-white";
      default: return "bg-light text-dark";
    }
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      
      {/* ส่วนหัวตาราง */}
      <div className="d-flex justify-content-between align-items-center mb30">
          <h4 className="fw600 m-0">ประวัติการชำระเงิน</h4>
          <button className="btn btn-sm btn-light rounded-pill px-3 border">
              <i className="fas fa-download me-1"></i> Export CSV
          </button>
      </div>

      {/* ตารางข้อมูล */}
      <div className="table-responsive">
        <table className="table-style3 table table-hover">
          <thead className="t-head bg-light">
            <tr>
              <th scope="col">เลขที่ใบเสร็จ</th>
              <th scope="col">วันที่</th>
              <th scope="col">รายการ</th>
              <th scope="col">ช่องทางชำระ</th>
              <th scope="col" className="text-end" style={{ whiteSpace: 'nowrap' }}>จำนวนเงิน</th>
              <th scope="col" className="text-center">สถานะ</th>
              <th scope="col" className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="t-body">
            {mockPaymentData.map((item, index) => (
              <tr key={index}>
                <td className="vam fw600 text-primary">{item.id}</td>
                <td className="vam text-muted fz14">{item.date}</td>
                <td className="vam fw500">{item.item}</td>
                <td className="vam fz14">{item.method}</td>
                <td className="vam fw600 text-end">
                  ฿{item.amount.toLocaleString()}
                </td>
                <td className="vam text-center">
                  <span className={`badge rounded-pill px-3 py-2 fw500 ${getStatusBadge(item.status)}`}>
                      {item.statusLabel}
                  </span>
                </td>
                <td className="vam text-center">
                  <button 
                    className="btn btn-sm border-0 bg-transparent text-primary p-0" 
                    title="ดูใบเสร็จ"
                    style={{ boxShadow: 'none' }}
                  >
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-circle hover-bg-light transition-all"
                        style={{ width: '35px', height: '35px' }}
                      >
                         <i className="fas fa-file-invoice fz16"></i>
                      </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default PaymentHistoryTable;