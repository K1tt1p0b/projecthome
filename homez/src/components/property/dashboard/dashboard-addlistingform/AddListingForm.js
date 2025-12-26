"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Select from "react-select";
import geographyData from "@/components/property/dashboard/dashboard-add-property/LocationField/geography.json";

const AddListingForm = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    provinces: [],
    description: "",
    type: "service", // ✅ ฟิกค่าเป็น service ไปเลย
  });
  const [imagePreview, setImagePreview] = useState(null);

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
    console.log("Submitting Service:", formData);
  };

  return (
    <div className="ps-widget bg-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

      {/* ❌ ลบปุ่ม Tab Switch ออกแล้ว ใส่หัวข้อแทน */}
      <h4 className="mb-4"><i className="fas fa-tools me-2"></i>ลงประกาศงานช่าง/บริการ</h4>

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
                // ✅ ลบเงื่อนไข ternary operator ออก
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
                {/* ✅ เหลือเฉพาะหมวดหมู่งานช่าง */}
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
              <label className="heading-color ff-heading fw600 mb10">รูปภาพผลงาน</label>
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
                    <p className="mb-2 fw600">คลิกเพื่ออัปโหลดรูปภาพ</p>
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