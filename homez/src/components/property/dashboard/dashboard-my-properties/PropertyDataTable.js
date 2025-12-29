"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
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

// ✅ ปรับพาธ 2 อันนี้ให้ตรงกับหน้าที่คุณทำไว้ตอนแรก
const BOOST_URL = (id) => `/dashboard-boost-property/${id}`;
const VIDEO_URL = (id) => `/dashboard-property-video/${id}`;

// skeleton row (ไม่ต้องมี css เพิ่ม ใช้ class เดิมได้)
const SkeletonRow = () => (
  <tr>
    <th scope="row">
      <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
        <div className="list-thumb">
          <div
            style={{
              width: 110,
              height: 94,
              borderRadius: 8,
              background: "#eee",
            }}
          />
        </div>
        <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4 w-100">
          <div
            style={{
              width: "45%",
              height: 14,
              background: "#eee",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              width: "60%",
              height: 12,
              background: "#eee",
              borderRadius: 6,
              marginTop: 10,
            }}
          />
          <div
            style={{
              width: "30%",
              height: 12,
              background: "#eee",
              borderRadius: 6,
              marginTop: 10,
            }}
          />
        </div>
      </div>
    </th>
    <td className="vam">
      <div style={{ width: 90, height: 12, background: "#eee", borderRadius: 6 }} />
    </td>
    <td className="vam">
      <div style={{ width: 110, height: 28, background: "#eee", borderRadius: 999 }} />
    </td>
    <td className="vam">
      <div style={{ width: 60, height: 12, background: "#eee", borderRadius: 6 }} />
    </td>
    <td className="vam">
      <div className="d-flex align-items-center gap-2">
        <div style={{ width: 28, height: 28, background: "#eee", borderRadius: 6 }} />
        <div style={{ width: 28, height: 28, background: "#eee", borderRadius: 6 }} />
      </div>
    </td>
  </tr>
);

const PropertyDataTable = () => {
  const router = useRouter();

  // ✅ loading ตอนโหลดข้อมูลหน้าแรก (คืนมาเหมือนเดิม)
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // ข้อมูล
  const [properties, setProperties] = useState([]);

  // ✅ loading เฉพาะแถว (edit/delete) (คืนมาเหมือนเดิม)
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isRowBusy = (id) => editingId === id || deletingId === id;

  // mock โหลดข้อมูล (เปลี่ยนเป็น API จริงได้เลย)
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      // ---- mock delay ----
      await new Promise((r) => setTimeout(r, 900));

      const data = mockData;
      setProperties(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setLoadError("โหลดข้อมูลไม่สำเร็จ");
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = async (id) => {
    try {
      if (deletingId === id) return;

      setEditingId(id);
      await new Promise((r) => setTimeout(r, 400)); // optional
      router.push(`/dashboard-edit-property/${id}`);
    } catch (e) {
      console.error(e);
      toast.error("ไปหน้าแก้ไขไม่สำเร็จ");
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (editingId === id) return;

    const ok = window.confirm("ยืนยันการลบประกาศนี้ใช่ไหม?");
    if (!ok) return;

    try {
      setDeletingId(id);

      // mock delete (แทน API จริง)
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

  // ✅ action ใหม่
  const handleBoost = (id) => {
    router.push(BOOST_URL(id));
  };

  const handleVideo = (id) => {
    router.push(VIDEO_URL(id));
  };

  const hasData = useMemo(() => properties?.length > 0, [properties]);

  return (
    <>
      {/* แถบเล็กๆ บอกสถานะโหลดด้านบน (เหมือนเดิม) */}
      {isLoading && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <span className="fas fa-spinner fa-spin" />
          <span>กำลังโหลดข้อมูลประกาศของคุณ...</span>
        </div>
      )}

      {/* error state */}
      {loadError && !isLoading && (
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div className="text-danger">{loadError}</div>
          <button type="button" className="ud-btn btn-thm" onClick={fetchProperties}>
            ลองโหลดใหม่
          </button>
        </div>
      )}

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
          {/* loading state: โชว์ skeleton 4 แถว */}
          {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* empty state */}
          {!isLoading && !loadError && !hasData && (
            <tr>
              <td colSpan={5} className="text-center py-5">
                <div className="mb-2 fw-semibold">ยังไม่มีประกาศของคุณ</div>
                <div className="text-muted mb-3">เมื่อคุณสร้างประกาศแล้ว รายการจะแสดงที่นี่</div>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={() => router.push("/dashboard-add-property")}
                >
                  เพิ่มประกาศใหม่
                </button>
              </td>
            </tr>
          )}

          {/* data state */}
          {!isLoading &&
            !loadError &&
            hasData &&
            properties.map((property) => {
              const rowBusy = isRowBusy(property.id);

              // ✅ ถ้ามีวิดีโอ (รองรับหลายชื่อ field)
              const hasVideo =
                Boolean(property?.videoUrl) ||
                Boolean(property?.videoURL) ||
                Boolean(property?.video) ||
                property?.hasVideo === true;

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
                        <div className="h6 list-title d-flex align-items-center gap-2">
                          <Link href={`/single-v1/${property.id}`}>{property.title}</Link>

                          {/* ✅ ไอคอนวิดีโอ + ลิงก์ไปหน้าวิดีโอ (เฉพาะประกาศที่มีวิดีโอ) */}
                          {hasVideo && (
                            <>
                              <button
                                type="button"
                                className="icon"
                                disabled={rowBusy}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  padding: 0,
                                  opacity: rowBusy ? 0.5 : 1,
                                  cursor: rowBusy ? "not-allowed" : "pointer",
                                }}
                                data-tooltip-id={`video-${property.id}`}
                                onClick={() => handleVideo(property.id)}
                                aria-label="video"
                              >
                                <span className="fas fa-video" />
                              </button>
                              <ReactTooltip
                                id={`video-${property.id}`}
                                place="top"
                                content="วิดีโอ"
                              />
                            </>
                          )}
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

                  {/* ✅ แก้เฉพาะเมนูจัดการ: ใช้ "..." dropdown */}
                  <td className="vam">
                    <div className="d-flex align-items-center gap-2">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="icon dropdown-toggle"
                          disabled={rowBusy}
                          style={{
                            border: "none",
                            background: "transparent",
                            opacity: rowBusy ? 0.5 : 1,
                            cursor: rowBusy ? "not-allowed" : "pointer",
                          }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          aria-label="actions"
                        >
                          {/* "ขีดๆ" */}
                          <span className="fas fa-ellipsis-h" />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2"
                              disabled={rowBusy}
                              onClick={() => handleEdit(property.id)}
                            >
                              {editingId === property.id ? (
                                <span className="fas fa-spinner fa-spin" />
                              ) : (
                                <span className="fas fa-pen" />
                              )}
                              แก้ไข
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2"
                              disabled={rowBusy}
                              onClick={() => handleBoost(property.id)}
                            >
                              <span className="fas fa-bolt" />
                              ดันประกาศ
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2"
                              disabled={rowBusy}
                              onClick={() => handleVideo(property.id)}
                            >
                              <span className="fas fa-video" />
                              {hasVideo ? "จัดการวิดีโอ" : "เพิ่มวิดีโอ"}
                            </button>
                          </li>

                          <li>
                            <hr className="dropdown-divider" />
                          </li>

                          <li>
                            <button
                              type="button"
                              className="dropdown-item d-flex align-items-center gap-2 text-danger"
                              disabled={rowBusy}
                              onClick={() => handleDelete(property.id)}
                            >
                              {deletingId === property.id ? (
                                <span className="fas fa-spinner fa-spin" />
                              ) : (
                                <span className="flaticon-bin" />
                              )}
                              ลบ
                            </button>
                          </li>
                        </ul>
                      </div>

                      {/* Tooltip ของปุ่ม ... */}
                      <ReactTooltip
                        id={`actions-${property.id}`}
                        place="top"
                        content="จัดการ"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default PropertyDataTable;
