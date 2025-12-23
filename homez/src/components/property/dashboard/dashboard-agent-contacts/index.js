"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { propertyData } from "@/data/propertyData";

// mock data (เพิ่ม isRead)
const mockAgentContacts = [
  {
    id: "c_1002",
    createdAt: "2025-12-22T10:15:00Z",
    agentId: 1,
    isRead: false,
    contact: {
      name: "ณัฐวุฒิ",
      email: "nut@example.com",
      phone: "0812345678",
      message: "สนใจนัดดูบ้านได้ช่วงเสาร์-อาทิตย์ครับ",
    },
    propertyId: 1,
  },
  {
    id: "c_1001",
    createdAt: "2025-12-22T09:20:00Z",
    agentId: 1,
    isRead: true,
    contact: {
      name: "สมชาย ใจดี",
      email: "somchai@gmail.com",
      phone: "0899999999",
      message: "สนใจบ้านหลังนี้ ขอรายละเอียดเพิ่มครับ",
    },
    propertyId: 2,
  },
  {
    id: "c_1003",
    createdAt: "2025-12-22T10:30:00Z",
    agentId: 1,
    isRead: false,
    contact: {
      name: "กิตติภพ",
      email: "nack@example.com",
      phone: "0815545679",
      message: "สนใจบ้านหลังนี้ ติดต่อกลับด้วยครับ",
    },
    propertyId: 3,
  },
];

const formatDateTimeTH = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const pickLocationText = (p) => {
  if (!p?.location) return "-";
  return (
    p.location.fullText ||
    [
      p.location.address,
      p.location.subdistrict,
      p.location.district,
      p.location.province,
    ]
      .filter(Boolean)
      .join(" ")
  );
};

// mock delay (แทน API)
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AgentContactsContent() {
  // ในของจริง: agentId มาจาก auth/session
  const agentId = 1;

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // เก็บ contacts ใน state เพื่อ mark read ได้
  const [contacts, setContacts] = useState(mockAgentContacts);

  // loading states
  const [loadingSelectId, setLoadingSelectId] = useState(null); // loading เฉพาะแถวที่คลิก
  const [loadingReadAll, setLoadingReadAll] = useState(false); // loading ปุ่มอ่านทั้งหมด

  // นับ unread
  const unreadCount = useMemo(() => {
    return contacts.filter((c) => c.agentId === agentId && !c.isRead).length;
  }, [contacts, agentId]);

  // join + sort
  const contactsWithProperty = useMemo(() => {
    return contacts
      .filter((lead) => lead.agentId === agentId)
      .map((lead) => {
        const p = propertyData.find((x) => x.id === lead.propertyId);
        return {
          ...lead,
          contact: {
            name: lead.contact?.name || "",
            email: lead.contact?.email || "",
            phone: lead.contact?.phone || "",
            message: lead.contact?.message || "",
          },
          property: p ? { ...p } : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [contacts, agentId]);

  // search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contactsWithProperty;

    return contactsWithProperty.filter((item) => {
      const name = (item.contact?.name || "").toLowerCase();
      const email = (item.contact?.email || "").toLowerCase();
      const phone = (item.contact?.phone || "").toLowerCase();
      const title = (item.property?.title || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        title.includes(q)
      );
    });
  }, [contactsWithProperty, search]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return filtered.find((x) => x.id === selectedId) || null;
  }, [filtered, selectedId]);

  // helper: mark read (มี loading)
  const markAsRead = async (id) => {
    // ถ้าอ่านแล้ว ไม่ต้องโหลด
    const target = contacts.find((c) => c.id === id);
    if (target?.isRead) return;

    try {
      setLoadingSelectId(id);
      await wait(350); // mock API latency
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isRead: true } : c))
      );
    } finally {
      setLoadingSelectId(null);
    }
  };

  // helper: read all (มี loading)
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      setLoadingReadAll(true);
      await wait(450); // mock API latency
      setContacts((prev) =>
        prev.map((c) =>
          c.agentId === agentId ? { ...c, isRead: true } : c
        )
      );
    } finally {
      setLoadingReadAll(false);
    }
  };

  return (
    <div className="px-3 pb-4">
      <div className="row g-4">
        {/* ================= Left: List ================= */}
        <div className="col-lg-5">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p-3">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0">ข้อความทั้งหมด</h6>

                {unreadCount > 0 && (
                  <span
                    className="fz12 badge rounded-pill"
                    style={{
                      background: "rgba(255, 90, 95, 0.12)",
                      color: "#ff5a5f",
                      border: "1px solid rgba(255, 90, 95, 0.25)",
                    }}
                    title="ยังไม่อ่าน"
                  >
                    {unreadCount} ใหม่
                  </span>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="fz12 badge rounded-pill text-bg-light">
                  {filtered.length} รายการ
                </span>

                <button
                  type="button"
                  className="btn btn-light btn-sm d-inline-flex align-items-center gap-2"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0 || loadingReadAll}
                  title="ทำเครื่องหมายว่าอ่านแล้วทั้งหมด"
                >
                  {loadingReadAll && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  อ่านแล้วทั้งหมด
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="ค้นหา: ชื่อ / อีเมล / เบอร์ / ชื่อทรัพย์"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="text-center py-5">
                <div className="fz16 fw600 mb-2">ยังไม่มีข้อความติดต่อ</div>
                <div className="text-muted fz14">
                  เมื่อมีคนกรอกฟอร์ม จะมาแสดงที่นี่
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {filtered.map((item) => {
                  const isActive = item.id === selectedId;
                  const isRowLoading = loadingSelectId === item.id;

                  const title = item.property?.title || "ไม่พบข้อมูลทรัพย์";
                  const priceText =
                    item.property?.priceText ||
                    (typeof item.property?.price === "number"
                      ? item.property.price.toLocaleString("th-TH")
                      : "-");

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={async () => {
                        setSelectedId(item.id);
                        await markAsRead(item.id);
                      }}
                      className="w-100 text-start border-0 bg-transparent p-0"
                      disabled={loadingReadAll} // กันกดระหว่างอ่านทั้งหมด
                      style={{ cursor: loadingReadAll ? "not-allowed" : "pointer" }}
                    >
                      <div
                        className="p-3 bdrs12 border"
                        style={{
                          background: isActive
                            ? "rgba(255, 90, 95, 0.08)"
                            : "#fff",
                          borderColor: isActive
                            ? "rgba(255, 90, 95, 0.35)"
                            : "rgba(0,0,0,0.08)",
                          transition: "all .15s ease",
                          opacity: loadingReadAll ? 0.7 : 1,
                        }}
                      >
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div className="min-w-0">
                            <div className="fw600 mb-1 text-truncate d-flex align-items-center gap-2">
                              {item.contact?.name || "-"}

                              {/* จุดแดงถ้ายังไม่อ่าน */}
                              {!item.isRead && !isRowLoading && (
                                <span
                                  style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "#ff5a5f",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    flex: "0 0 auto",
                                  }}
                                  title="ยังไม่อ่าน"
                                />
                              )}

                              {/* spinner ถ้ากำลัง mark read */}
                              {isRowLoading && (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                  title="กำลังอัปเดต..."
                                />
                              )}
                            </div>

                            <div className="fz13 text-muted text-truncate">
                              สนใจ: {title}
                            </div>
                          </div>

                          <div className="text-end">
                            <div className="fz12 text-muted mb-1">
                              {formatDateTimeTH(item.createdAt)}
                            </div>
                            <span
                              className="fz12 badge rounded-pill"
                              style={{
                                background: "rgba(255, 90, 95, 0.12)",
                                color: "#ff5a5f",
                                border: "1px solid rgba(255, 90, 95, 0.25)",
                              }}
                            >
                              ฿{priceText}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 fz14 text-muted">
                          {(item.contact?.message || "").length > 60
                            ? item.contact.message.slice(0, 60) + "..."
                            : item.contact?.message || "-"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= Right: Detail ================= */}
        <div className="col-lg-7">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p-3 h-100">
            {!selected ? (
              <div className="text-center py-5">
                <div className="fz16 fw600 mb-2">
                  เลือกข้อความเพื่อดูรายละเอียด
                </div>
                <div className="text-muted fz14">คลิกจากรายการด้านซ้าย</div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h5 className="mb-1 text-truncate">
                      {selected.contact?.name || "-"}
                    </h5>
                    <div className="fz13 text-muted">
                      ส่งเมื่อ {formatDateTimeTH(selected.createdAt)}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => setSelectedId(null)}
                    disabled={loadingReadAll}
                  >
                    กลับ
                  </button>
                </div>

                {/* Property mini card */}
                <div
                  className="p-3 bdrs12 border mb-3"
                  style={{ borderColor: "rgba(0,0,0,0.08)" }}
                >
                  {selected.property ? (
                    <div className="d-flex gap-3 align-items-center">
                      <div
                        className="bdrs12 overflow-hidden"
                        style={{
                          width: 132,
                          height: 96,
                          position: "relative",
                          flex: "0 0 auto",
                        }}
                      >
                        <Image
                          src={selected.property.imageSrc}
                          alt={selected.property.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      <div className="flex-grow-1 min-w-0">
                        <div className="fw600 mb-1 text-truncate">
                          {selected.property.title}
                        </div>
                        <div className="fz13 text-muted text-truncate mb-2">
                          {pickLocationText(selected.property)}
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="fw600">
                            ฿
                            {selected.property.priceText ||
                              (typeof selected.property.price === "number"
                                ? selected.property.price.toLocaleString("th-TH")
                                : "-")}
                          </span>

                          <span className="fz12 badge rounded-pill text-bg-light">
                            {selected.property.listingType || "-"}
                          </span>

                          <span className="fz12 badge rounded-pill text-bg-light">
                            {selected.property.status || "-"}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/property/${selected.property.id}`}
                        className="ud-btn btn-thm btn-sm"
                      >
                        ดูทรัพย์
                      </Link>
                    </div>
                  ) : (
                    <div className="text-muted fz14">ไม่พบข้อมูลทรัพย์</div>
                  )}
                </div>

                {/* Contact detail */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className="p-3 bdrs12 border h-100"
                      style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                      <div className="fw600 mb-2">ข้อมูลผู้ติดต่อ</div>

                      <div className="fz14">
                        <div className="mb-2">
                          <div className="fz12 text-muted">อีเมล</div>
                          <div className="fw500">{selected.contact?.email || "-"}</div>
                        </div>

                        <div className="mb-2">
                          <div className="fz12 text-muted">เบอร์โทร</div>
                          <div className="fw500">{selected.contact?.phone || "-"}</div>
                        </div>

                        <div
                          className="mt-3 fz12"
                          style={{
                            color: "#ff5a5f",
                            background: "rgba(255, 90, 95, 0.08)",
                            border: "1px solid rgba(255, 90, 95, 0.2)",
                            padding: "10px 12px",
                            borderRadius: 10,
                          }}
                        >
                          *Read-only: Agent ดูได้อย่างเดียว
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="p-3 bdrs12 border h-100"
                      style={{ borderColor: "rgba(0,0,0,0.08)" }}
                    >
                      <div className="fw600 mb-2">ข้อความที่ส่งมา</div>
                      <div
                        className="fz14"
                        style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                      >
                        {selected.contact?.message || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-muted fz13 mt-2">
            หมายเหตุ: ระบบนี้ไม่รองรับการตอบกลับจาก Agent ไปยังผู้ติดต่อ
          </div>
        </div>
      </div>
    </div>
  );
}
