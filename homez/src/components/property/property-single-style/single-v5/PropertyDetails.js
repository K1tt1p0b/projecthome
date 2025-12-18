import listings from "@/data/listings";
import React from "react";

const PropertyDetails = ({id}) => {
  const data = listings.filter((elm) => elm.id == id)[0] || listings[0];
  const columns = [
 [
      {
        label: "รหัสทรัพย์สิน",
        value: "RT48",
      },
      {
        label: "ราคา",
        value: data.price,
      },
      {
        label: "ขนาดพื้นที่",
        value: `${data.sqft} ตร.ฟุต`,
      },
      {
        label: "ห้องน้ำ",
        value: data.bath,
      },
      {
        label: "ห้องนอน",
        value: data.bed,
      },
    ],
    [
      {
        label: "โรงจอดรถ",
        value: "2",
      },
      {
        label: "ขนาดโรงจอดรถ",
        value: "200 ตร.ฟุต",
      },
      {
        label: "ปีที่สร้าง",
        value: data.yearBuilding,
      },
      {
        label: "ประเภททรัพย์สิน",
        value: data.propertyType,
      },
      {
        label: "สถานะ",
        value: `สำหรับ${data.forRent ? 'เช่า' : 'ขาย'}`,
      },
    ],
  ];

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="col-md-6 col-xl-6">
          {column.map((detail, index) => (
            <div key={index} className="d-flex justify-content-between">
              <div className="pd-list">
                <p className="fw600 mb10 ff-heading dark-color">
                  {detail.label}
                </p>
              </div>
              <div className="pd-list">
                <p className="text mb10">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;
