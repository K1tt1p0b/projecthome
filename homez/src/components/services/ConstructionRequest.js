// src/components/service/ConstructionRequest.js
"use client";
import React, { useState } from "react";
// ✅ Import Toast (ถ้าคุณใช้ library อื่น ให้เปลี่ยนตรงนี้ครับ)
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConstructionRequest = () => {
    // --- 1. State สำหรับเก็บค่าต่างๆ ---
    const [selectedService, setSelectedService] = useState(null);
    const [isUnsure, setIsUnsure] = useState(false);

    // เก็บข้อมูลฟอร์ม
    const [formData, setFormData] = useState({
        size: "",
        name: "",
        tel: "",
        details: ""
    });

    // --- 2. ข้อมูลบริการ (Config) ---
    const services = [
        { id: "land-fill", title: "รับถมที่ดิน", icon: "fas fa-truck-monster", unit: "ขนาดพื้นที่ (ตร.ว. / ไร่)" },
        { id: "fencing", title: "รับล้อมรั้ว", icon: "fas fa-vector-square", unit: "ความยาวรอบพื้นที่ (เมตร)" },
        { id: "renovate", title: "ต่อเติม/รีโนเวท", icon: "fas fa-tools", unit: "พื้นที่ใช้สอย (ตร.ม.)" },
        { id: "piling", title: "ตอกเสาเข็ม", icon: "fas fa-layer-group", unit: "จำนวน (ต้น)" },
    ];

    // --- 3. Functions จัดการ Events ---

    // เมื่อพิมพ์ข้อมูล
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // ✅ เพิ่มเงื่อนไข: ถ้าเป็นช่องเบอร์โทร (tel)
        if (name === "tel") {
            // ใช้ Regex ลบทุกตัวอักษรที่ไม่ใช่ 0-9 ทิ้งทันที
            const onlyNums = value.replace(/[^0-9]/g, "");

            // (Option) จำกัดความยาวไม่เกิน 10 หลัก (เบอร์มือถือไทย)
            if (onlyNums.length <= 10) {
                setFormData({ ...formData, [name]: onlyNums });
            }
        } else {
            // ช่องอื่นๆ (ชื่อ, รายละเอียด) พิมพ์ได้ปกติ
            setFormData({ ...formData, [name]: value });
        }
    };

    // เมื่อเลือกบริการ
    const handleServiceSelect = (id) => {
        // เช็คว่ากดตัวเดิมซ้ำหรือเปล่า?
        if (selectedService === id) {
            // 1. ถ้ากดซ้ำ -> ให้ปิด (หุบฟอร์ม)
            setSelectedService(null);
        } else {
            // 2. ถ้ากดตัวใหม่ -> ให้เปิดฟอร์มตามปกติ
            setSelectedService(id);
            setIsUnsure(false); // รีเซ็ตสถานะไม่รู้ขนาด
            setFormData(prev => ({ ...prev, size: "" })); // รีเซ็ตขนาด
        }
    };

    // เมื่อติ๊ก Checkbox ไม่ทราบขนาด
    const handleUnsureChange = (e) => {
        const checked = e.target.checked;
        setIsUnsure(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, size: "" })); // ล้างค่าขนาดออก
        }
    };

    // ✅ เมื่อกดส่งฟอร์ม (Submit Logic)
    const handleSubmit = (e) => {
        e.preventDefault();

        // เช็ค 1: ชื่อและเบอร์โทร (สำคัญสุด)
        if (!formData.name.trim() || !formData.tel.trim()) {
            toast.error("กรุณากรอก ชื่อผู้ติดต่อ และ เบอร์โทรศัพท์");
            return;
        }

        // เช็ค 2: ขนาด (ถ้าไม่ได้ติ๊กไม่รู้ ต้องกรอก)
        if (!isUnsure && !formData.size.trim()) {
            toast.warning('กรุณาระบุขนาด หรือติ๊กช่อง "ยังไม่ทราบขนาด"');
            return;
        }

        // ผ่านทุกด่าน -> ส่งข้อมูล (จำลอง)
        toast.success("ส่งข้อมูลสำเร็จ! เจ้าหน้าที่จะติดต่อกลับใน 24 ชม.");

        // ตรงนี้คือจุดที่คุณจะยิง API ไปหา Admin หรือ Line Notify
        console.log("Payload to Send:", {
            service: selectedService,
            isUnsure: isUnsure,
            ...formData
        });
    };

    return (
        <div className="container">
            {/* ใส่ Container ไว้แสดงผล Toast (ถ้าใน Layout มีแล้ว บรรทัดนี้ลบได้) */}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" // แนะนำให้ใส่ theme="colored" ด้วย จะได้เห็นสีชัดๆ ครับ
            />

            {/* --- ส่วนที่ 1: Grid เลือกบริการ --- */}
            <div className="text-center mb-5 fade-in-animation">
                <h2 className="mb-2">เลือกบริการที่คุณต้องการ</h2>
                <p className="text-muted">เลือกประเภทงานเพื่อประเมินราคาเบื้องต้น หรือนัดดูหน้างานฟรี</p>
            </div>

            <div className="row justify-content-center mb-4">
                {services.map((service) => (
                    <div key={service.id} className="col-6 col-md-3 mb-3">
                        <div
                            onClick={() => handleServiceSelect(service.id)}
                            className={`p-4 text-center rounded-4 border cursor-pointer h-100 position-relative ${selectedService === service.id
                                ? "bg-white border-primary shadow transform-scale" // สไตล์ตอนเลือก
                                : "bg-white border-light hover-shadow" // สไตล์ปกติ
                                }`}
                            style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                borderColor: selectedService === service.id ? "#eb6753" : "#eee",
                                transform: selectedService === service.id ? "translateY(-5px)" : "none"
                            }}
                        >
                            <i className={`${service.icon} fz40 mb-3 d-block ${selectedService === service.id ? "text-thm" : "text-dark"}`} />
                            <h6 className="m-0 fw600">{service.title}</h6>

                            {/* เครื่องหมายถูก */}
                            {selectedService === service.id && (
                                <div className="position-absolute top-0 end-0 m-2 text-success">
                                    <i className="fas fa-check-circle fz20"></i>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ส่วนที่ 2: ฟอร์ม (แสดงเมื่อเลือกบริการแล้ว) --- */}
            {selectedService && (
                <div className="row justify-content-center fade-in-animation">
                    <div className="col-lg-8">
                        <div className="bg-white p-4 p-md-5 shadow-sm rounded-4 border position-relative">

                            <h4 className="mb-4 pb-3 border-bottom d-flex align-items-center">
                                <span className="flaticon-discovery-1 me-2 text-thm"></span>
                                รายละเอียด: {services.find(s => s.id === selectedService)?.title}
                            </h4>

                            <form onSubmit={handleSubmit}>

                                {/* 1. ขนาดพื้นที่ */}
                                <div className="mb-4 bg-light p-4 rounded-3">
                                    <label className="form-label fw600 mb-2">
                                        {services.find(s => s.id === selectedService)?.unit}
                                    </label>

                                    <div className="input-group mb-2">
                                        <input
                                            type="number"
                                            name="size"
                                            value={formData.size}
                                            onChange={handleInputChange}
                                            className="form-control form-control-lg bg-white"
                                            placeholder={isUnsure ? "-" : "ระบุตัวเลขคร่าวๆ"}
                                            disabled={isUnsure} // ปิดการพิมพ์ถ้าไม่รู้
                                        />
                                    </div>

                                    <div className="form-check mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="unsureCheck"
                                            checked={isUnsure}
                                            onChange={handleUnsureChange}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <label className="form-check-label text-muted cursor-pointer user-select-none" htmlFor="unsureCheck">
                                            ยังไม่ทราบขนาด / ต้องการนัดช่างเข้าวัดหน้างาน
                                        </label>
                                    </div>
                                </div>

                                {/* 2. อัปโหลดรูป (UI Only) */}
                                <div className="mb-4">
                                    <label className="form-label fw600">รูปถ่ายหน้างาน / โฉนด (ถ้ามี)</label>
                                    <div
                                        className="p-4 text-center rounded position-relative hover-bg-light transition-all"
                                        style={{ border: '2px dashed #ccc', backgroundColor: '#f9f9f9' }}
                                    >
                                        <i className="fas fa-cloud-upload-alt fz30 text-muted mb-2"></i>
                                        <p className="mb-0 text-muted fz14">คลิกเพื่อเลือกรูปภาพประกอบ</p>
                                        <input
                                            type="file"
                                            className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            multiple
                                        />
                                    </div>
                                </div>

                                {/* 3. ข้อมูลติดต่อ */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw600">ชื่อผู้ติดต่อ <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="ชื่อ-นามสกุล"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw600">เบอร์โทรศัพท์ <span className="text-danger">*</span></label>
                                        <input
                                            type="tel"
                                            name="tel"
                                            value={formData.tel}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="08x-xxx-xxxx"
                                        />
                                    </div>
                                    <div className="col-12 mb-4">
                                        <label className="form-label fw600">รายละเอียดเพิ่มเติม</label>
                                        <textarea
                                            name="details"
                                            value={formData.details}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            rows="3"
                                            placeholder="เช่น ต้องการเริ่มงานด่วน, รถสิบล้อเข้าไม่ได้"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* 4. ปุ่มกดส่ง */}
                                <button type="submit" className="ud-btn btn-thm w-100 btn-lg shadow-sm">
                                    {isUnsure ? (
                                        <>
                                            <i className="fas fa-map-marker-alt me-2"></i> ยืนยันนัดวัดหน้างาน (ฟรี)
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i> ขอใบเสนอราคา
                                        </>
                                    )}
                                </button>

                            </form>

                        </div>
                    </div>
                </div>
            )}

            {/* State ว่าง (ยังไม่เลือก) */}
            {!selectedService && (
                <div className="text-center py-5 opacity-50 fade-in-animation">
                    <i className="fas fa-hand-pointer fz50 mb-3 text-muted"></i>
                    <p>กรุณาเลือกประเภทงานด้านบน เพื่อเริ่มกรอกข้อมูล</p>
                </div>
            )}

        </div>
    );
};

export default ConstructionRequest;