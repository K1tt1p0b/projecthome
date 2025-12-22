"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { propertyData as mockData } from "@/data/propertyData";
import { toast } from "react-toastify";

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
  const [properties, setProperties] = useState(mockData);

  // ✅ loading เฉพาะแถว
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleEdit = async (id) => {
    try {
      setEditingId(id);

      // mock งานก่อนเปลี่ยนหน้า (optional)
      await new Promise((r) => setTimeout(r, 400));

      router.push(`/dashboard-edit-property/${id}`);
      // ปกติไม่ต้อง setEditingId(null) เพราะเปลี่ยนหน้าแล้ว
    } catch (e) {
      console.error(e);
      toast.error("ไปหน้าแก้ไขไม่สำเร็จ");
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("ยืนยันการลบประกาศนี้ใช่ไหม?");
    if (!ok) return;

    try {
      setDeletingId(id);

      // mock ลบ (ถ้ามี API จริง ค่อยเปลี่ยนเป็น fetch/axios)
      await new Promise((r) => setTimeout(r, 500));

      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success("ลบประกาศเรียบร้อยแล้ว");
    } catch (e) {
      console.error(e);
      toast.error("ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  const isRowBusy = (id) => editingId === id || deletingId === id;

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
        {properties.map((property) => {
          const rowBusy = isRowBusy(property.id);

          return (
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
                {property.views}
              </td>

              <td className="vam">
                <div className="d-flex align-items-center gap-2">
                  {/* ✏️ edit (loading แบบเดียวกับที่คุณทำ) */}
                  <button
                    type="button"
                    className="icon"
                    disabled={rowBusy}
                    style={{
                      border: "none",
                      background: "transparent",
                      opacity: rowBusy ? 0.5 : 1,
                      cursor: rowBusy ? "not-allowed" : "pointer",
                    }}
                    data-tooltip-id={`edit-${property.id}`}
                    onClick={() => handleEdit(property.id)}
                  >
                    {editingId === property.id ? (
                      <span className="fas fa-spinner fa-spin" />
                    ) : (
                      <span className="fas fa-pen fa" />
                    )}
                  </button>

                  {/* 🗑 delete (ทำ loading ให้เหมือนกัน) */}
                  <button
                    type="button"
                    className="icon"
                    disabled={rowBusy}
                    style={{
                      border: "none",
                      background: "transparent",
                      opacity: rowBusy ? 0.5 : 1,
                      cursor: rowBusy ? "not-allowed" : "pointer",
                    }}
                    data-tooltip-id={`delete-${property.id}`}
                    onClick={() => handleDelete(property.id)}
                  >
                    {deletingId === property.id ? (
                      <span className="fas fa-spinner fa-spin" />
                    ) : (
                      <span className="flaticon-bin" />
                    )}
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
          );
        })}
      </tbody>
    </table>
  );
};

export default PropertyDataTable;
