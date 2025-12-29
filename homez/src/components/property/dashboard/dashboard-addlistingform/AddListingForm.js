"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Select from "react-select";
import geographyData from "@/components/property/dashboard/dashboard-add-property/LocationField/geography.json";

// ✅ 1. Import จาก react-toastify แทน
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ⚠️ สำคัญ: ต้องมีบรรทัดนี้ CSS ถึงจะขึ้น

const AddListingForm = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    provinces: [],
    description: "",
    type: "service",
  });
  const [images, setImages] = useState([]);

  // ✅ Handle รูปภาพ
  const handleImageUpload = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      // ❌ เปลี่ยนเป็น toast.error ของ toastify
      toast.error("อัปโหลดได้สูงสุดรวมกันไม่เกิน 5 รูปครับ");
      e.target.value = ""; 
      return;
    }

    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    try {
      const newImages = await Promise.all(fileReaders);
      setImages((prevImages) => [...prevImages, ...newImages]); 
      
      // ✅ Toast สีเขียว
      toast.success(`อัปโหลดเพิ่ม ${newImages.length} รูปเรียบร้อย`);
    } catch (error) {
      console.error("Error reading files:", error);
      toast.error("เกิดข้อผิดพลาดในการอ่านไฟล์");
    }

    e.target.value = ""; 
  };

  // ✅ Handle ลบรูปภาพ
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    toast.success("ลบรูปภาพแล้ว");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
        toast.error("กรุณากรอกหัวข้อประกาศ");
        return;
    }

    if (images.length < 3) {
      toast.error("กรุณาอัปโหลดรูปภาพอย่างน้อย 3 รูปครับ");
      return;
    }
    
    console.log("Submitting:", { ...formData, images });
    toast.success("ลงประกาศเรียบร้อยแล้ว!");
  };

  // --- Logic กรองจังหวัด ---
  const provinceOptions = useMemo(() => {
    const uniqueProvinces = [
      ...new Set(geographyData.map((item) => item.provinceNameTh)),
    ];
    return uniqueProvinces.sort().map((provinceName) => ({
      value: provinceName,
      label: provinceName,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  return (
    <div className="ps-widget bg-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

      <h4 className="mb-4"><i className="fas fa-tools me-2"></i>ลงประกาศงานช่าง/บริการ</h4>

      <form className="form-style1" onSubmit={handleSubmit}>
        <div className="row">
          {/* ... (ส่วน Input เหมือนเดิมเป๊ะ ไม่ต้องแก้ครับ) ... */}
          
          <div className="col-sm-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">หัวข้อประกาศ</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="เช่น รับถมที่ดิน ปรับพื้นที่..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-sm-6 col-xl-6">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                พื้นที่ให้บริการ (เลือกได้หลายจังหวัด)
              </label>
              <Select
                instanceId="provinces-select"
                isMulti
                name="provinces"
                options={provinceOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="ค้นหาจังหวัด..."
                noOptionsMessage={() => "ไม่พบจังหวัดที่ค้นหา"}
                onChange={(selectedOptions) => {
                  const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                  setFormData({ ...formData, provinces: values });
                }}
                value={provinceOptions.filter(option =>
                  formData.provinces?.includes(option.value)
                )}
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
                <option value="piling">ตอกเสาเข็ม</option>
                <option value="land-fill">ถมที่ดิน</option>
                <option value="renovate">รีโนเวท</option>
                <option value="construction">รับเหมาก่อสร้าง</option>
                <option value="electrician">ช่างไฟ</option>
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
                placeholder="อธิบายรายละเอียดงานของคุณ ประสบการณ์ เครื่องจักรที่มี..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="col-md-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                รูปภาพผลงาน (อย่างน้อย 3 รูป, สูงสุด 5 รูป)
              </label>
              
              <div className="upload-field p-4 border border-dashed rounded-3 bg-light position-relative">
                {images.length > 0 && (
                  <div className="row mb-3 g-3">
                    {images.map((imgSrc, index) => (
                      <div key={index} className="col-6 col-sm-4 col-md-3 position-relative">
                        <div className="position-relative" style={{ aspectRatio: '4/3' }}>
                          <Image src={imgSrc} fill alt={`preview-${index}`} className="rounded-3 object-fit-cover shadow-sm" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle shadow p-0 d-flex align-items-center justify-content-center"
                            style={{ width: '24px', height: '24px', zIndex: 10 }}
                          >
                            <i className="fas fa-times fz10"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {images.length < 5 ? (
                  <div className="text-center position-relative py-4 hover-bg-gray" style={{ cursor: 'pointer' }}>
                    <div className="mb-3"><i className="fas fa-cloud-upload-alt fz40 text-thm"></i></div>
                    <p className="mb-2 fw600">คลิกเพื่ออัปโหลดรูปภาพเพิ่ม</p>
                    <p className="text-muted fz14 mb-0">(ตอนนี้มี {images.length} / 5 รูป)</p>
                    {images.length > 0 && images.length < 3 && (
                       <p className="text-danger fz12 mt-1">* ต้องเพิ่มอีก {3 - images.length} รูป</p>
                    )}
                    <input type="file" multiple accept="image/*" className="position-absolute top-0 start-0 w-100 h-100 opacity-0" style={{ cursor: 'pointer', zIndex: 5 }} onChange={handleImageUpload} />
                  </div>
                ) : (
                  <div className="text-center py-3 text-success">
                     <i className="fas fa-check-circle fz30 mb-2"></i>
                     <p className="mb-0 fw600">อัปโหลดครบ 5 รูปแล้ว</p>
                     <p className="text-muted fz12">ลบรูปบางส่วนออกหากต้องการเพิ่มใหม่</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-12">
            <div className="d-grid mt-3">
              <button className="ud-btn btn-thm btn-lg rounded-3" type="submit">
                ลงประกาศงานบริการ <i className="fal fa-arrow-right-long ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddListingForm;