"use client";
import React, { useState } from "react";
import Image from "next/image";

const AddCourseForm = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    category: "",
    description: "",
    type: "course", // ฟิกไว้ว่าเป็นคอร์ส
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Handle ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle รูปภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Online Course:", formData);
    // ยิง API บันทึกข้อมูลตรงนี้
  };

  // 1. ตัวเลือก Dropdown
  const courseTypeOptions = [
    { value: 'hybrid', label: 'ผสมผสาน (Hybrid)' },
    { value: 'online', label: 'เรียนออนไลน์ (Online)' },
    { value: 'onsite', label: 'เรียนออนไซต์ (On-site)' }
  ];

  // 2. ฟังก์ชันเมื่อกดเลือก
  const handleDropdownSelect = (value) => {
    setFormData({ ...formData, courseType: value });
  };

  // 3. ฟังก์ชันดึงชื่อมาโชว์ (ตัวที่ Error อยู่) ✅
  const getCurrentLabel = () => {
    const selected = courseTypeOptions.find(opt => opt.value === formData.courseType);
    return selected ? selected.label : "เลือกรูปแบบ...";
  };

  return (
    <div className="row">
      {/* --- ฝั่งซ้าย: ฟอร์มกรอกข้อมูล --- */}
      <div className="col-lg-12">
        <div className="ps-widget bg-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
          <h4 className="mb-4"><i className="fas fa-laptop-code me-2"></i>ลงประกาศคอร์สออนไลน์</h4>

          <form className="form-style1" onSubmit={handleSubmit}>
            <div className="row">

              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">ชื่อคอร์สเรียน</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="เช่น สอนยิงแอด Facebook รวยด้วยมือถือ..."
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ✅ ส่วน Dropdown เลือกรูปแบบการเรียน */}
              <div className="col-sm-12 col-xl-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">รูปแบบการเรียน</label>

                  <div className="dropdown">
                    {/* ปุ่มกด */}
                    <button
                      className="btn btn-white w-100 text-start border d-flex justify-content-between align-items-center"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        height: '55px',
                        borderRadius: '8px',
                        borderColor: '#ebebeb',
                        color: formData.courseType ? '#222' : '#777'
                      }}
                    >
                      <span>{getCurrentLabel()}</span>
                      <i className="fas fa-chevron-down fz12"></i>
                    </button>

                    {/* รายการเมนู */}
                    <ul className="dropdown-menu w-100 p-2 shadow border-0" style={{ borderRadius: '8px', marginTop: '5px' }}>
                      {courseTypeOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            type="button"
                            className={`dropdown-item rounded-2 py-2 ${formData.courseType === option.value ? 'active' : ''}`}
                            onClick={() => handleDropdownSelect(option.value)}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: formData.courseType === option.value ? '#eb6753' : 'transparent',
                              color: formData.courseType === option.value ? '#fff' : '#222'
                            }}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>


              {/* ✅ เพิ่ม: ชื่อผู้สอน */}
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">ชื่อผู้สอน (Instructor)</label>
                  <input type="text" name="instructor" className="form-control" placeholder="เช่น โค้ชพี่ทอม, คุณเจน Digital..." value={formData.instructor} onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">รายละเอียดบทเรียน</label>
                  <textarea
                    cols="30"
                    rows="6"
                    name="description"
                    className="form-control"
                    placeholder="รายละเอียดสิ่งที่จะได้รับ, เนื้อหาที่สอน, ช่องทางการเรียน (เช่น Facebook Group, Website)..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="col-md-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">รูปภาพปกคอร์ส</label>
                  <div className="upload-field text-center p-4 border border-dashed rounded-3 bg-light position-relative">
                    {imagePreview ? (
                      <div className="position-relative d-inline-block">
                        <Image src={imagePreview} width={300} height={200} alt="preview" className="rounded-3 object-fit-cover shadow-sm" />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-3">
                          <i className="fas fa-cloud-upload-alt fz40 text-thm"></i>
                        </div>
                        <p className="mb-2 fw600">คลิกเพื่ออัปโหลดรูปปก</p>
                        <input
                          type="file"
                          className="form-control w-50 mx-auto mt-3 opacity-0 position-absolute top-0 start-0 h-100 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="d-grid mt-3">
                  <button className="ud-btn btn-thm btn-lg rounded-3" type="submit">
                    ลงประกาศขายคอร์ส <i className="fal fa-arrow-right-long ms-2"></i>
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>


    </div>
  );
};

export default AddCourseForm;