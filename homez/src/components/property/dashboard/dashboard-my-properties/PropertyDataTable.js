"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { propertyData } from "@/data/propertyData";

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
  const router = useRouter();

  const handleEdit = (id) => {
    router.push(`/dashboard-edit-property/${id}`);
  };

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
                    <Link href={`/single-v1/${property.id}`}>
                      {property.title}
                    </Link>
                  </div>
                  <p className="list-text mb-0">
                    {typeof property.location === "string"
                      ? property.location
                      : property.location.fullText || ""}
                  </p>
                  <div className="list-price">
                    <a href="#">{property.price}</a>
                  </div>
                </div>
              </div>
            </th>

            <td className="vam" style={{ whiteSpace: "nowrap" }}>
              {property.datePublished}
            </td>

            <td className="vam">
              <span
                className={getStatusStyle(property.status)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  minWidth: "110px",
                  textAlign: "center",
                }}
              >
                {property.status}
              </span>
            </td>

            <td className="vam" style={{ whiteSpace: "nowrap" }}>
              {property.datePublished}
            </td>

            <td className="vam">
              <div className="d-flex">
                <button
                  type="button"
                  className="icon"
                  style={{ border: "none", background: "transparent" }}
                  data-tooltip-id={`edit-${property.id}`}
                  onClick={() => handleEdit(property.id)}
                >
                  <span className="fas fa-pen fa" />
                </button>

                <button
                  type="button"
                  className="icon"
                  style={{ border: "none", background: "transparent" }}
                  data-tooltip-id={`delete-${property.id}`}
                >
                  <span className="flaticon-bin" />
                </button>

                <ReactTooltip id={`edit-${property.id}`} place="top" content="แก้ไข" />
                <ReactTooltip id={`delete-${property.id}`} place="top" content="ลบ" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PropertyDataTable;
