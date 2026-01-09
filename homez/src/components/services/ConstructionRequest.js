// src/components/service/ConstructionRequest.js
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import agents from "@/data/agents";

export const constructionServices = [ 
    { id: "land-fill", title: "รับถมที่ดิน", icon: "fas fa-truck-monster" },
    { id: "fencing", title: "รับล้อมรั้ว", icon: "fas fa-vector-square" },
    { id: "renovate", title: "ต่อเติม/รีโนเวท", icon: "fas fa-tools" },
    { id: "piling", title: "ตอกเสาเข็ม", icon: "fas fa-layer-group" },
];

const ConstructionRequest = ({ initialCategory }) => {

    const services = constructionServices;
    // ใช้ค่าจาก URL เป็นค่าเริ่มต้น
    const [selectedService, setSelectedService] = useState(initialCategory || null);

    useEffect(() => {
        if (initialCategory) {
            setSelectedService(initialCategory);
        }
    }, [initialCategory]);

    // กรองรายชื่อช่าง
    const filteredAgents = selectedService 
        ? agents.filter(agent => agent.tags && agent.tags.includes(selectedService))
        : [];

    return (
        <div className="container pb-5 mb-5">
            <ToastContainer position="top-center" autoClose={3000} theme="colored" />
            
            {/* ส่วนเลือกบริการแบบปุ่มใหญ่ (ซ่อนถ้าเข้ามาผ่าน URL เจาะจง) */}
            {!initialCategory && (
                <>
                    <div className="text-center mb-5 fade-in-animation pt-5">
                        <h2 className="mb-2">เลือกบริการที่คุณต้องการ</h2>
                        <p className="text-muted">เลือกประเภทงานเพื่อดูรายชื่อช่างในหมวดหมู่นั้น</p>
                    </div>

                    <div className="row justify-content-center mb-4">
                        {services.map((service) => (
                            <div key={service.id} className="col-6 col-md-3 mb-3">
                                <Link href={`/services/${service.id}`} className="text-decoration-none">
                                    <div
                                        className={`p-4 text-center rounded-4 border cursor-pointer h-100 position-relative bg-white border-light hover-shadow`}
                                        style={{ transition: "all 0.3s ease" }}
                                    >
                                        <i className={`${service.icon} fz40 mb-3 d-block text-dark`} />
                                        <h6 className="m-0 fw600 text-muted">{service.title}</h6>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* --- ส่วนที่ 2: แสดงรายชื่อช่าง --- */}
            {selectedService ? (
                <div className="fade-in-animation" style={{ marginTop: "-230px" }}>
                    
                    {/* ✅✅✅ เพิ่มส่วน Header หัวข้อตรงนี้ครับ ✅✅✅ */}
                    <div className="row align-items-end mb-5 mt-4">
                        <div className="col-lg-9">
                            <div className="d-flex align-items-center">
                                {/* ไอคอนวงกลมสีส้มจางๆ */}
                                <div className="p-3 rounded-circle bg-opacity-10 me-4 d-none d-md-block" 
                                     style={{backgroundColor: '#eb675320', color: '#eb6753'}}>
                                    <i className={`${services.find(s => s.id === selectedService)?.icon} fz30`}></i>
                                </div>
                                
                                <div>
                                    {/* Breadcrumb (เส้นทาง) */}
                                    <p className="text-muted fz14 mb-1">
                                        <Link href="/" className="text-decoration-none text-muted">หน้าแรก</Link> 
                                        <span className="mx-2">/</span>
                                        <Link href="/services" className="text-decoration-none text-muted">บริการ</Link> 
                                        <span className="mx-2">/</span>
                                        <span className="text-thm">{services.find(s => s.id === selectedService)?.title}</span>
                                    </p>
                                    
                                    {/* ชื่อหัวข้อหลัก */}
                                    <h2 className="fw700 mb-1">
                                        บริการ{services.find(s => s.id === selectedService)?.title}
                                    </h2>
                                    <p className="text-muted mb-0">
                                        รวบรวมช่างและผู้รับเหมามืออาชีพ ที่ผ่านการตรวจสอบแล้วในพื้นที่ของคุณ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ✅ จบส่วน Header */}

                    {/* แสดงจำนวนที่พบ */}
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h5 className="fw600 mb-0">
                             พบช่างทั้งหมด <span className="text-thm">{filteredAgents.length}</span> ราย
                        </h5>
                    </div>

                    {/* Grid แสดงการ์ดช่าง */}
                    {filteredAgents.length > 0 ? (
                        <div className="row">
                            {filteredAgents.map((agent) => (
                                <div key={agent.id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="bg-white p-4 rounded-4 shadow-sm border h-100 position-relative hover-card-up">
                                        {agent.verified && (
                                            <span className="position-absolute top-0 end-0 m-3 badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                                                <i className="fas fa-certificate me-1"></i> Verified
                                            </span>
                                        )}
                                        
                                        <div className="d-flex align-items-center mb-3">
                                            <Link href={`/agent-single/${agent.id}`}>
                                                <img 
                                                    src={agent.image} 
                                                    className="rounded-circle object-fit-cover border shadow-sm cursor-pointer" 
                                                    width="70" height="70" 
                                                    alt={agent.name} 
                                                />
                                            </Link>
                                            <div className="ms-3">
                                                <Link href={`/agent-single/${agent.id}`} className="text-decoration-none text-dark">
                                                    <h6 className="fw700 mb-1 hover-text-thm cursor-pointer">{agent.name}</h6>
                                                </Link>
                                                <p className="text-muted fz12 mb-0">{agent.category}</p>
                                            </div>
                                        </div>

                                        <p className="text-muted fz14 mb-3">
                                            <i className="fas fa-map-marker-alt me-2 text-thm"></i>
                                            พื้นที่: {agent.location}
                                        </p>

                                        <div className="d-grid gap-2 mt-4">
                                            <Link href={`/agent-single/${agent.id}`} className="btn btn-light rounded-pill fw600 text-thm border-0 bg-opacity-10" style={{backgroundColor: '#eb675320'}}>
                                                ดูรายละเอียด
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 bg-light rounded-4 border border-dashed">
                            <i className="fas fa-tools fz50 text-muted mb-3 opacity-50"></i>
                            <h5>ยังไม่มีช่างในหมวดหมู่นี้</h5>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default ConstructionRequest;