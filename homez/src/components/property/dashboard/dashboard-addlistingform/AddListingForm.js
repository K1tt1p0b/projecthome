"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Select from "react-select"; // 1. ✅ อย่าลืมลง npm install react-select
import geographyData from "@/components/property/dashboard/dashboard-add-property/LocationField/geography.json"; // 2. ✅ อย่าลืมเอาไฟล์ json มาวางไว้ที่เดียวกับไฟล์นี้นะครับ

const AddListingForm = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    provinces: [], // ✅ เปลี่ยนจาก price เป็น provinces (เก็บเป็น Array)
    description: "",
    type: "service",
  });
  const [imagePreview, setImagePreview] = useState(null);

  // --- Logic กรองจังหวัดไม่ให้ซ้ำ (ใช้ useMemo เพื่อความลื่น) ---
  const provinceOptions = useMemo(() => {
    // ดึงเฉพาะชื่อจังหวัดออกมา และใช้ Set เพื่อตัดตัวซ้ำทิ้ง
    const uniqueProvinces = [
      ...new Set(geographyData.map((item) => item.provinceNameTh)),
    ];

    // เรียงลำดับ ก-ฮ และแปลงเป็น format ที่ Dropdown ต้องการ
    return uniqueProvinces.sort().map((provinceName) => ({
      value: provinceName,
      label: provinceName,
    }));
  }, []);

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
    console.log("Submitting:", formData);
  };

  return (
    <div className="ps-widget bg-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      
      {/* Tab Switch */}
      <div className="d-flex justify-content-center mb-4 border-bottom pb-4">
        <div className="bg-light p-1 rounded-pill d-inline-flex">
          <button 
            type="button"
            onClick={() => setFormData({...formData, type: 'service'})}
            className={`btn rounded-pill px-4 fw600 ${formData.type === 'service' ? 'btn-dark' : 'text-muted'}`}
            style={{transition: 'all 0.3s'}}
          >
            <i className="fas fa-tools me-2"></i> งานช่าง/บริการ
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, type: 'course'})}
            className={`btn rounded-pill px-4 fw600 ${formData.type === 'course' ? 'btn-dark' : 'text-muted'}`}
            style={{transition: 'all 0.3s'}}
          >
            <i className="fas fa-graduation-cap me-2"></i> คอร์สเรียน
          </button>
        </div>
      </div>

      {/* Form */}
      <form className="form-style1" onSubmit={handleSubmit}>
        <div className="row">
          
          <div className="col-sm-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">หัวข้อประกาศ</label>
              <input 
                type="text" 
                name="title"
                className="form-control" 
                placeholder={formData.type === 'service' ? "เช่น รับถมที่ดิน..." : "เช่น คอร์สสอนขับ..."}
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ✅✅✅ ส่วนที่แก้: ลบราคาออก ใส่ Dropdown จังหวัดแทน */}
          <div className="col-sm-6 col-xl-6">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                พื้นที่ให้บริการ (เลือกได้หลายจังหวัด)
              </label>
              <Select
                isMulti
                name="provinces"
                options={provinceOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="ค้นหาจังหวัด..."
                noOptionsMessage={() => "ไม่พบจังหวัดที่ค้นหา"}
                
                // Logic การเก็บค่า
                onChange={(selectedOptions) => {
                    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                    setFormData({ ...formData, provinces: values }); 
                }}
                
                // Logic การแสดงค่าปัจจุบัน
                value={provinceOptions.filter(option => 
                    formData.provinces?.includes(option.value)
                )}

                // แต่ง Style ให้เหมือน Theme
                styles={{
                    control: (base) => ({
                        ...base,
                        borderRadius: '8px',
                        borderColor: '#ebebeb',
                        padding: '2px',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#eb6753' }
                    })
                }}
              />
            </div>
          </div>

          <div className="col-sm-6 col-xl-6">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">หมวดหมู่</label>
              <select className="form-select" name="category" onChange={handleChange} value={formData.category}>
                <option value="">เลือกหมวดหมู่...</option>
                {formData.type === 'service' ? (
                  <>
                    <option value="piling">ตอกเสาเข็ม</option>
                    <option value="land-fill">ถมที่ดิน</option>
                    <option value="renovate">รีโนเวท</option>
                  </>
                ) : (
                  <>
                    <option value="real-estate">อสังหาริมทรัพย์</option>
                    <option value="machine">เครื่องจักรหนัก</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="col-md-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">รายละเอียด</label>
              <textarea 
                cols="30" 
                rows="5" 
                name="description"
                className="form-control"
                placeholder="อธิบายรายละเอียดงานของคุณ..." 
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="col-md-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">รูปภาพปก</label>
              <div className="upload-field text-center p-4 border border-dashed rounded-3 bg-light position-relative">
                {imagePreview ? (
                  <div className="position-relative d-inline-block">
                    <Image src={imagePreview} width={300} height={200} alt="preview" className="rounded-3 object-fit-cover shadow-sm"/>
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
                    <p className="mb-2 fw600">ลากไฟล์มาวาง หรือ คลิกเพื่ออัปโหลด</p>
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
                ลงประกาศทันที <i className="fal fa-arrow-right-long ms-2"></i>
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddListingForm;