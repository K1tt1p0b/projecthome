"use client";

import React, { useState, useRef } from "react";
import Select from "react-select";

const ContactAdminContent = () => {
  const [view, setView] = useState("list");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetail, setTicketDetail] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const tickets = [
    { id: "#TK-8852", subject: "สอบถามเรื่องการลงประกาศ", category: "General", date: "22/01/2024", status: "Replied", detail: "อยากทราบว่าลงประกาศฟรีได้กี่รายการครับ?" },
    { id: "#TK-9931", subject: "แจ้งปัญหาอัปโหลดรูปภาพไม่ได้", category: "Technical", date: "25/01/2024", status: "Resolved", detail: "พอกดอัปโหลดแล้วหมุนติ้วๆ ไม่ไปไหนเลยครับ ช่วยดูหน่อย" },
    { id: "#TK-9945", subject: "ขอใบกำกับภาษีย้อนหลัง", category: "Billing", date: "26/01/2024", status: "Pending", detail: "ต้องการขอใบกำกับภาษีของเดือนธันวาคมครับ" },
  ];

  const categoryOptions = [
    { value: 'general', label: 'สอบถามข้อมูลทั่วไป (General Inquiry)' },
    { value: 'technical', label: 'แจ้งปัญหาการใช้งานระบบ (Technical Support)' },
    { value: 'billing', label: 'แจ้งชำระเงิน / ใบกำกับภาษี (Billing & Invoice)' },
    { value: 'account', label: 'จัดการบัญชีผู้ใช้ (Account Management)' },
    { value: 'complaint', label: 'ข้อเสนอแนะ / ร้องเรียน (Feedback & Complaint)' },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#f8f9fa',
      border: '1px solid #ced4da',
      borderRadius: '8px',
      padding: '6px',
      boxShadow: 'none',
      cursor: 'pointer',
      '&:hover': { borderColor: '#a8b3c4' }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '12px',
      overflow: 'hidden',
      zIndex: 9999,
      marginTop: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px',
      padding: '0',
      '::-webkit-scrollbar': { width: '6px' },
      '::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '3px' }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#212529' : state.isFocused ? '#e9ecef' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '15px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#212529',
      fontWeight: '500'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6c757d',
    })
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">Pending</span>;
      case "Replied":
        return <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">Replied</span>;
      case "Resolved":
        return <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Resolved</span>;
      default:
        return <span className="badge bg-light text-dark px-3 py-2 rounded-pill">Unknown</span>;
    }
  };

  // ✅✅ ฟังก์ชันตรวจสอบไฟล์ (กันคนเลือกไฟล์มั่ว) ✅✅
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const newValidFiles = [];
    let hasError = false;

    files.forEach(file => {
      // 1. เช็คประเภทไฟล์ (ต้องเป็นรูปเท่านั้น)
      if (!validImageTypes.includes(file.type)) {
        alert(`ไฟล์ "${file.name}" ไม่ใช่รูปภาพ (รองรับเฉพาะ JPG, PNG)`);
        hasError = true;
        return;
      }
      // 2. เช็คขนาดไฟล์ (กันไฟล์ใหญ่เกิน)
      if (file.size > maxFileSize) {
        alert(`ไฟล์ "${file.name}" ใหญ่เกิน 5MB`);
        hasError = true;
        return;
      }
      newValidFiles.push(file);
    });

    if (hasError && fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setSelectedFiles(prev => [...prev, ...newValidFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setView("detail");
  };

  return (
    <div className="row">
      <div className="col-lg-12 mb30">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p0 overflow-hidden d-flex flex-column" style={{ minHeight: '600px' }}>

          <div className="chat-header bg-white border-bottom p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center">
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary me-3" style={{ width: 50, height: 50 }}>
                <i className="fas fa-ticket-alt fz20"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">Support Tickets</h4>
                <p className="text-muted mb-0 fz14">ติดตามสถานะและแจ้งปัญหาการใช้งาน</p>
              </div>
            </div>
            <div>
              {view === 'list' ? (
                <button onClick={() => setView('create')} className="ud-btn btn-dark" style={{ padding: '10px 25px', borderRadius: '30px' }}>
                  <i className="fas fa-plus me-2"></i> สร้างรายการใหม่
                </button>
              ) : (
                <button onClick={() => setView('list')} className="btn btn-outline-secondary" style={{ padding: '10px 25px', borderRadius: '30px' }}>
                  <i className="fas fa-arrow-left me-2"></i> ย้อนกลับ
                </button>
              )}
            </div>
          </div>

          {/* ✅ แก้จุดที่ 1: บังคับปิด overflow-x และเปิด overflow-y */}
          <div
            className="chat-body flex-grow-1 p-4 bg-light"
            style={{ overflowY: 'auto', overflowX: 'hidden' }}
          >

            {view === 'list' && (
              <div className="bg-white bdrs12 shadow-sm border-0 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle" style={{ tableLayout: 'fixed', minWidth: '800px' }}>

                    {/* --- หัวตาราง (Modern Style) --- */}
                    <thead style={{ backgroundColor: '#f9f9f9' }}>
                      <tr>
                        <th className="py-4 ps-4 text-secondary text-uppercase fz12 fw-bold" style={{ width: '15%', letterSpacing: '0.5px' }}>TICKET ID</th>
                        <th className="py-4 text-secondary text-uppercase fz12 fw-bold" style={{ width: '30%', letterSpacing: '0.5px' }}>หัวข้อเรื่อง</th>
                        <th className="py-4 text-secondary text-uppercase fz12 fw-bold" style={{ width: '15%', letterSpacing: '0.5px' }}>หมวดหมู่</th>
                        <th className="py-4 text-secondary text-uppercase fz12 fw-bold" style={{ width: '15%', letterSpacing: '0.5px' }}>วันที่แจ้ง</th>
                        <th className="py-4 text-center text-secondary text-uppercase fz12 fw-bold" style={{ width: '10%', letterSpacing: '0.5px' }}>สถานะ</th>
                        <th className="py-4 text-end pe-4 text-secondary text-uppercase fz12 fw-bold" style={{ width: '15%', letterSpacing: '0.5px' }}>จัดการ</th>
                      </tr>
                    </thead>

                    {/* --- เนื้อหา --- */}
                    <tbody>
                      {tickets.map((t, index) => (
                        <tr
                          key={index}
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                          onClick={() => handleViewTicket(t)}
                          className="border-bottom"
                        >

                          {/* ID: เน้นสีหลัก */}
                          <td className="ps-4 py-4">
                            <span className="fw-bold text-primary fz15">{t.id}</span>
                          </td>

                          {/* Subject: ตัวหนา สีเข้ม */}
                          <td className="py-4">
                            <div className="text-dark fw-bold text-truncate" style={{ maxWidth: '95%' }} title={t.subject}>
                              {t.subject}
                            </div>
                          </td>

                          {/* Category: Soft Badge (พาสเทล) */}
                          <td className="py-4">
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border-0 fw-normal px-3 py-2 rounded-pill">
                              {t.category}
                            </span>
                          </td>

                          {/* Date: สีเทา */}
                          <td className="py-4">
                            <div className="text-muted fz14 d-flex align-items-center">
                              <i className="far fa-clock me-2 fz12"></i> {t.date}
                            </div>
                          </td>

                          {/* Status: ตรงกลาง */}
                          <td className="text-center py-4">
                            {getStatusBadge(t.status)}
                          </td>

                          {/* Action Button: มีเงาเล็กน้อยเมื่อ Hover */}
                          <td className="text-end pe-4 py-4">
                            <button
                              className="btn btn-sm btn-light rounded-circle border"
                              style={{ width: 38, height: 38 }}
                            >
                              <i className="far fa-eye text-primary"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === 'create' && (
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="bg-white bdrs12 p-4 shadow-sm">
                    <h5 className="mb-4 fw-bold"><i className="far fa-edit me-2"></i>กรอกรายละเอียดปัญหา</h5>
                    <form>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label className="form-label fw600">หัวข้อเรื่อง (Subject)</label>
                          <input type="text" className="form-control form-control-lg bg-light" placeholder="ระบุหัวข้อเรื่อง..." />
                        </div>

                        <div className="col-md-flex mb-3">
                          <label className="form-label fw600">หมวดหมู่ (Category)</label>
                          <Select
                            options={categoryOptions}
                            styles={customStyles}
                            placeholder="-- กรุณาเลือกหมวดหมู่ --"
                            instanceId="category-select"
                            isSearchable={false}
                            maxMenuHeight={200}
                          />
                        </div>

                        <div className="col-md-12 mb-4">
                          <label className="form-label fw600">รายละเอียด</label>
                          <textarea
                            className="form-control bg-light"
                            rows="6"
                            placeholder="อธิบายรายละเอียดปัญหา หรือสิ่งที่ต้องการให้ช่วยเหลือ..."
                            value={ticketDetail}
                            onChange={(e) => setTicketDetail(e.target.value)}
                            style={{ resize: 'none', borderRadius: '8px' }}
                          ></textarea>
                        </div>

                        {/* ✅✅ ส่วนอัปโหลดรูปภาพ (ปรับปรุงใหม่) ✅✅ */}
                        <div className="col-md-12 mb-4">
                          <label className="form-label fw600">แนบรูปภาพ (Attachments)</label>
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control bg-light"
                              id="inputGroupFile01"
                              multiple
                              accept=".jpg, .jpeg, .png" // 🔒 ล็อกนามสกุลในหน้าต่างเลือกไฟล์
                              ref={fileInputRef}
                              onChange={handleFileUpload} // 🔒 เช็คซ้ำด้วย JS
                              style={{ borderRadius: '8px', padding: '10px' }}
                            />
                          </div>
                          <div className="form-text text-muted ps-1 mt-1">รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 5MB)</div>

                          {/* แสดงรายการไฟล์ที่เลือก (Preview) */}
                          {selectedFiles.length > 0 && (
                            <div className="mt-3 d-flex flex-wrap gap-2">
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="position-relative d-inline-block border rounded p-1 bg-white">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle rounded-circle p-0 d-flex align-items-center justify-content-center"
                                    style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="col-md-12 text-end">
                          <button type="button" onClick={() => setView('list')} className="ud-btn btn-light btn-lg me-2 rounded-3 border-0 ">ยกเลิก</button>
                          <button type="button" className="ud-btn btn-thm btn-lg rounded-3 ">ส่งข้อมูล (Submit)</button>
                        </div>

                        {/* ✅ แก้จุดที่ 2: ใส่กล่องเปล่าๆ ดันพื้นที่สุดท้ายไว้เลย กันเหนียว */}
                        <div style={{ height: '50px', width: '100%' }}></div>

                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {view === 'detail' && selectedTicket && (
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="bg-white bdrs12 p-4 shadow-sm">
                    <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="text-primary fw-bold fz18">{selectedTicket.id}</span>
                          {getStatusBadge(selectedTicket.status)}
                        </div>
                        <h4 className="fw-bold mb-1">{selectedTicket.subject}</h4>
                        <p className="text-muted mb-0 fz14"><i className="far fa-calendar-alt me-1"></i> {selectedTicket.date} • {selectedTicket.category}</p>
                      </div>
                      <div className="text-end">
                        <div className="text-muted fz13 mb-1">ความเร่งด่วน</div>
                        <span className={`fw-bold ${selectedTicket.priority === 'High' ? 'text-danger' : 'text-success'}`}>{selectedTicket.priority}</span>
                      </div>
                    </div>

                    <div className="ticket-content mb-5">
                      <h6 className="fw-bold mb-3">รายละเอียด:</h6>
                      <p className="text-dark bg-light p-3 rounded-3" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedTicket.detail}
                      </p>
                    </div>

                    {selectedTicket.status === 'Closed' && (
                      <div className="admin-reply p-3 rounded-3" style={{ backgroundColor: '#e9ecef' }}>
                        <div className="d-flex align-items-center mb-2">
                          <img src="https://placehold.co/30x30" className="rounded-circle me-2" alt="admin" />
                          <span className="fw-bold">Admin Support</span>
                          <span className="text-muted ms-2 fz12">ตอบกลับเมื่อ 23/01/2024</span>
                        </div>
                        <p className="mb-0 text-dark">ดำเนินการแก้ไขให้เรียบร้อยแล้วครับ ขอบคุณที่แจ้งเข้ามาครับ</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdminContent;