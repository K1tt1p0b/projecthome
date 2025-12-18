"use client";
import React, { useState } from "react";
import listings from "@/data/listings";

const PropertyHeader = ({ id }) => {
  const data = listings.filter((elm) => elm.id == id)[0] || listings[0];
  const [showReportModal, setShowReportModal] = useState(false);
  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{data.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {data.location}
            </p>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              For {data.forRent ? 'rent' : 'sale'}
            </a>
            <a
              className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
              href="#"
            >
              <i className="far fa-clock pe-2" />{Number(new Date().getFullYear()) - Number(data.yearBuilding)} years ago
            </a>
            <a className="ff-heading ml10 ml0-sm fz15" href="#">
              <i className="flaticon-fullscreen pe-2 align-text-top" />
              8721
            </a>
          </div>
        </div>
      </div>
      {/* End .col-lg--8 */}

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
              <a className="icon mr10" href="#">
                <span className="flaticon-like" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-new-tab" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-share-1" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-printer" />
              </a>
              <div
                className="icon"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowReportModal(true)}
              >
                <span className="fas fa-flag text-white" />
              </div>
            </div>
            <h3 className="price mb-0">{data.price}</h3>
            <p className="text space fz15">${(Number(data.price.split('$')[1].split(',').join('')) / data.sqft).toFixed(2)}/sq ft</p>
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}

      {/* ✅ 4. ส่วนของหน้ากระดาษเล็กๆ (Modal) - วางไว้ล่างสุดก่อนปิด return */}
      {showReportModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // พื้นหลังสีดำจางๆ
            zIndex: 9999, // อยู่บนสุด
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowReportModal(false)} // กดพื้นที่ว่างเพื่อปิด
        >
          {/* ตัวกระดาษสีขาว */}
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              width: "90%",
              maxWidth: "450px", // ความกว้างสูงสุด (ขนาดกำลังดีเหมือนกระดาษ A5)
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()} // กดที่กระดาษแล้วไม่ปิด
          >
            {/* หัวข้อ */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw600 m-0">รายงานความไม่เหมาะสม</h4>
              <button
                onClick={() => setShowReportModal(false)}
                className="btn btn-sm btn-light rounded-circle"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* เนื้อหาฟอร์ม */}
            <form>
              <div className="mb-3">
                <label className="fw600 mb-2">ระบุเหตุผล:</label>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="reason" id="r1" />
                  <label className="form-check-label" htmlFor="r1">ข้อมูลไม่ถูกต้อง / หลอกลวง</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="reason" id="r2" />
                  <label className="form-check-label" htmlFor="r2">รูปภาพไม่เหมาะสม</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="reason" id="r3" />
                  <label className="form-check-label" htmlFor="r3">นายหน้าติดต่อไม่ได้</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="reason" id="r4" />
                  <label className="form-check-label" htmlFor="r4">อื่นๆ</label>
                </div>
              </div>

              <div className="mb-4">
                <label className="fw600 mb-2">รายละเอียดเพิ่มเติม:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="ช่วยอธิบายเพิ่มเติม..."
                  style={{ backgroundColor: '#f7f7f7', border: '1px solid #eee' }}
                ></textarea>
              </div>

              {/* ปุ่มดำเนินการ */}
              <div className="d-grid gap-2">
                <button type="button" className="ud-btn btn-thm w-100">
                  ส่งรายงาน <i className="fal fa-arrow-right-long" />
                </button>
                <button
                  type="button"
                  className="btn btn-light w-100"
                  onClick={() => setShowReportModal(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default PropertyHeader;
