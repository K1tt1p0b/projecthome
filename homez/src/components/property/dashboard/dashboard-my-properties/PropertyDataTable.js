"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const propertyData = [
  {
    id: 1,
    title: "บ้านเดี่ยวสไตล์คันทรี",
    imageSrc: "/images/listings/list-1.jpg",
    location: "แคลิฟอร์เนีย, สหรัฐอเมริกา",
    price: "$14,000/เดือน",
    datePublished: "31 ธันวาคม 2022",
    status: "รอตรวจสอบ",
  },
  {
    id: 2,
    title: "วิลล่าหรู ย่านรีโกพาร์ค",
    imageSrc: "/images/listings/list-2.jpg",
    location: "แคลิฟอร์เนีย, สหรัฐอเมริกา",
    price: "$14,000/เดือน",
    datePublished: "31 ธันวาคม 2022",
    status: "เผยแพร่แล้ว",
  },
  {
    id: 3,
    title: "วิลล่า บนถนนฮอลลีวูด",
    imageSrc: "/images/listings/list-3.jpg",
    location: "แคลิฟอร์เนีย, สหรัฐอเมริกา",
    price: "$14,000/เดือน",
    datePublished: "31 ธันวาคม 2022",
    status: "กำลังดำเนินการ",
  },
  {
    id: 4,
    title: "บ้านเดี่ยวสไตล์คันทรี",
    imageSrc: "/images/listings/list-4.jpg",
    location: "แคลิฟอร์เนีย, สหรัฐอเมริกา",
    price: "$14,000/เดือน",
    datePublished: "31 ธันวาคม 2022",
    status: "รอตรวจสอบ",
  },
  {
    id: 5,
    title: "วิลล่าหรู ย่านรีโกพาร์ค",
    imageSrc: "/images/listings/list-5.jpg",
    location: "แคลิฟอร์เนีย, สหรัฐอเมริกา",
    price: "$14,000/เดือน",
    datePublished: "31 ธันวาคม 2022",
    status: "เผยแพร่แล้ว",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "รอตรวจสอบ":
      return "pending-style style1";
    case "เผยแพร่แล้ว":
      return "pending-style style2";
    case "กำลังดำเนินการ":
      return "pending-style style3";
    default:
      return "";
  }
};

const PropertyDataTable = () => {
  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">ชื่อประกาศ</th>
          <th scope="col">วันที่ลงประกาศ</th>
          <th scope="col">สถานะ</th>
          <th scope="col">ยอดเข้าชม</th>
          <th scope="col">จัดการ</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {propertyData.map((property) => (
          <tr key={property.id}>
            <th scope="row">
              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                <div className="list-thumb">
                  <Image
                    width={110}
                    height={94}
                    className="w-100"
                    src={property.imageSrc}
                    alt="property"
                  />
                </div>
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    <Link href={`/single-v1/${property.id}`}>{property.title}</Link>
                  </div>
                  <p className="list-text mb-0">{property.location}</p>
                  <div className="list-price">
                    <a href="#">{property.price}</a>
                  </div>
                </div>
              </div>
            </th>
            <td className="vam"style={{ whiteSpace: "nowrap" }} >{property.datePublished}</td>
            <td className="vam">
              <span className={getStatusStyle(property.status)}
              style={{
                    padding: "8px 16px",        // ระยะห่างในปุ่ม
                    borderRadius: "20px",       // ความมน
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "inline-block",    // ให้เป็นก้อน
                    whiteSpace: "nowrap",       // ห้ามตัดคำ!
                    minWidth: "110px",          // ความกว้างขั้นต่ำ
                    textAlign: "center"
                  }}
              >
                {property.status}
              </span>
            </td>
            <td className="vam" style={{ whiteSpace: "nowrap" }} >{property.datePublished}</td>
            <td className="vam">
              <div className="d-flex">
                <button
                  className="icon"
                  style={{ border: "none" }}
                  data-tooltip-id={`edit-${property.id}`}
                >
                  <span className="fas fa-pen fa" />
                </button>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  data-tooltip-id={`delete-${property.id}`}
                >
                  <span className="flaticon-bin" />
                </button>

                <ReactTooltip
                  id={`edit-${property.id}`}
                  place="top"
                  content="แก้ไข"
                />
                <ReactTooltip
                  id={`delete-${property.id}`}
                  place="top"
                  content="ลบ"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PropertyDataTable;
