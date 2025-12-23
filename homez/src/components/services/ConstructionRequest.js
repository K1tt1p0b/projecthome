"use client";
import React, { useState } from "react";

const ConstructionRequest = () => {
    const [selectedService, setSelectedService] = useState(null);

    // ข้อมูลบริการ (เน้นงานก่อสร้าง)
    const services = [
        { id: "land-fill", title: "ถมที่ดิน", icon: "fas fa-truck-monster" }, // ใช้รถบรรทุกแทน
        { id: "fencing", title: "ล้อมรั้ว", icon: "fas fa-vector-square" }, // ใช้รูปสี่เหลี่ยมพื้นที่
        { id: "renovate", title: "ต่อเติม", icon: "fas fa-tools" }, // ใช้รูปเครื่องมือ
        { id: "piling", title: "ตอกเสาเข็ม", icon: "fas fa-layer-group" }, // ใช้รูปชั้น
    ];

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="mb-2">บริการงานช่างและก่อสร้าง</h2>
                <p className="text-muted">เลือกบริการที่คุณต้องการ เพื่อประเมินราคาเบื้องต้นฟรี</p>
            </div>

            {/* Step 1: เลือกหมวดงาน (Card Grid) */}
            <div className="row justify-content-center mb-4">
                {services.map((service) => (
                    <div key={service.id} className="col-6 col-md-3 mb-3">
                        <div
                            onClick={() => setSelectedService(service.id)}
                            className={`p-4 text-center rounded border cursor-pointer h-100 ${selectedService === service.id
                                    ? "bg-thm-light border-thm text-thm" // สไตล์ตอนเลือก
                                    : "bg-white hover-shadow"
                                }`}
                            style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                borderColor: selectedService === service.id ? "#eb6753" : "#eee" // สีส้ม Theme
                            }}
                        >
                            {/* ถ้าไม่มี icon flaticon ให้ใช้ emoji แทนชั่วคราวได้ หรือใส่ class icon เดิม */}
                            <i className={`${service.icon} fz40 mb-3 d-block`} />
                            <h6 className="m-0 fw600">{service.title}</h6>
                        </div>
                    </div>
                ))}
            </div>

            {/* Step 2: ฟอร์มคำถามเฉพาะทาง (Specific Form) */}
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="bg-white p-4 p-md-5 shadow-sm rounded-4 border">

                        {/* Case 0: ยังไม่เลือก */}
                        {!selectedService && (
                            <div className="text-center py-5">
                                <i className="flaticon-house fz50 text-muted mb-3 d-block opacity-50"></i>
                                <h5 className="text-muted">กรุณาเลือกประเภทงานด้านบน</h5>
                                <p className="text-light-gray">เราจะแสดงแบบฟอร์มที่ตรงกับงานของคุณ</p>
                            </div>
                        )}

                        {/* Case 1: ถมที่ดิน */}
                        {selectedService === "land-fill" && (
                            <div className="fade-in">
                                <h4 className="mb-4 d-flex align-items-center">
                                    <span className="flaticon-tractor me-2 text-thm"></span>
                                    รายละเอียดงานถมที่ดิน
                                </h4>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw600">ขนาดพื้นที่ (ตร.ว. หรือ ไร่)</label>
                                        <input type="text" className="form-control form-control-lg" placeholder="เช่น 200 ตร.ว." />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw600">ต้องการถมสูง (เมตร)</label>
                                        <select className="form-select form-select-lg">
                                            <option>0.5 เมตร</option>
                                            <option>1.0 เมตร</option>
                                            <option>1.5 เมตร (ระดับถนน)</option>
                                            <option>2.0 เมตร+</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label fw600">ประเภทดิน</label>
                                        <div className="d-flex gap-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="soilType" id="soil1" defaultChecked />
                                                <label className="form-check-label" htmlFor="soil1">ดินถมทั่วไป (สร้างบ้าน)</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="soilType" id="soil2" />
                                                <label className="form-check-label" htmlFor="soil2">ดินดำ (ปลูกต้นไม้)</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Case 2: ล้อมรั้ว */}
                        {selectedService === "fencing" && (
                            <div className="fade-in">
                                <h4 className="mb-4 d-flex align-items-center">
                                    <span className="flaticon-ruler me-2 text-thm"></span>
                                    รายละเอียดงานล้อมรั้ว
                                </h4>
                                <div className="mb-3">
                                    <label className="form-label fw600">ประเภทรั้ว</label>
                                    <select className="form-select form-select-lg">
                                        <option>รั้วลวดหนาม (ราคาประหยัด)</option>
                                        <option>รั้วคอนกรีตสำเร็จรูป (ยอดนิยม)</option>
                                        <option>รั้วเมทัลชีททึบ</option>
                                        <option>กำแพงกันดิน</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw600">ความยาวรอบพื้นที่ (เมตร)</label>
                                    <input type="number" className="form-control form-control-lg" placeholder="เช่น 40 เมตร" />
                                    <div className="form-text text-muted">*วัดความยาวรวมทุกด้านที่ต้องการทำ</div>
                                </div>
                            </div>
                        )}

                        {/* Case 3: ต่อเติม/รีโนเวท */}
                        {selectedService === "renovate" && (
                            <div className="fade-in">
                                <h4 className="mb-4 d-flex align-items-center">
                                    <span className="flaticon-hammer me-2 text-thm"></span>
                                    งานต่อเติม / รีโนเวท
                                </h4>
                                <div className="mb-3">
                                    <label className="form-label fw600">ส่วนที่ต้องการทำ</label>
                                    <div className="row g-2">
                                        {['โรงจอดรถ', 'ห้องครัว', 'ทาสีใหม่', 'ปูมากระเบื้อง', 'งานระบบไฟฟ้า/ประปา', 'อื่นๆ'].map((item) => (
                                            <div className="col-6 col-md-4" key={item}>
                                                <div className="form-check p-2 border rounded bg-light">
                                                    <input className="form-check-input ms-1" type="checkbox" id={`chk-${item}`} />
                                                    <label className="form-check-label ms-2 cursor-pointer" htmlFor={`chk-${item}`}>
                                                        {item}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw600">งบประมาณโดยประมาณ</label>
                                    <select className="form-select form-select-lg">
                                        <option>ไม่เกิน 50,000 บาท</option>
                                        <option>50,000 - 200,000 บาท</option>
                                        <option>200,000 - 500,000 บาท</option>
                                        <option>500,000 บาท ขึ้นไป</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* ส่วนล่าง: ปุ่มกดส่ง */}
                        {selectedService && (
                            <>
                                <hr className="my-4" />
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">เบอร์โทรติดต่อกลับ</label>
                                        <input type="tel" className="form-control" placeholder="08x-xxx-xxxx" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Line ID (ถ้ามี)</label>
                                        <input type="text" className="form-control" placeholder="@username" />
                                    </div>
                                </div>
                                <button className="ud-btn btn-thm w-100 mt-2">
                                    ขอใบเสนอราคา <i className="fal fa-arrow-right-long ms-2"></i>
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConstructionRequest;