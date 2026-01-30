"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const pathname = usePathname();

  // =================================================================
  // 🔔 ส่วนที่เพิ่มใหม่: Logic การแจ้งเตือน (Notification)
  // =================================================================
  const [notifs, setNotifs] = useState([]);

  // 1. ฟังก์ชันโหลดข้อมูลจาก LocalStorage
  const loadNotifs = () => {
    try {
      let saved = JSON.parse(localStorage.getItem('my_notifications') || "[]");

      // ------------------------------------------------------------------
      // 🛠️ [TEST MODE] ส่วนนี้เพิ่มมาเพื่อการเทส: ถ้าไม่มีข้อมูล ให้สร้างข้อมูลจำลองขึ้นมา
      // ------------------------------------------------------------------
      if (saved.length === 0) {
        saved = [
          {
            id: 1,
            title: "Darlene Robertson",
            message: "ส่งคำขอ Co-broke ทรัพย์ Rhythm...",
            time: new Date().toISOString(),
            type: "cobroke",
            isRead: false,
            // ลิ้งค์ไปหน้าแชทพร้อมส่ง ID ทรัพย์และประเภท
            url: "/dashboard-message?interest_property=101&type=cobroke"
          },
          {
            id: 2,
            title: "Jane Cooper",
            message: "สนใจคอนโด Life Ladprao ครับ...",
            time: new Date().toISOString(),
            type: "buyer",
            isRead: false,
            // ลิ้งค์ไปหน้าแชทแบบลูกค้าทั่วไป
            url: "/dashboard-message?interest_property=102&type=buyer"
          }
        ];
        // บันทึกลงเครื่องเพื่อให้กดอ่านแล้วสถานะเปลี่ยนจริง
        localStorage.setItem('my_notifications', JSON.stringify(saved));
      }
      // ------------------------------------------------------------------

      setNotifs(saved);
    } catch (e) {
      console.error("Error loading notifications", e);
    }
  };

  // 2. ทำงานเมื่อโหลดหน้าเว็บ + เฝ้าฟัง Event
  useEffect(() => {
    loadNotifs(); // โหลดครั้งแรก

    // ✅ ตั้งหูรอฟังเสียง "storage_update" จาก Sidebar
    window.addEventListener("storage_update", loadNotifs);
    // ฟังเผื่อเปิดหลาย Tab
    window.addEventListener("storage", loadNotifs);

    return () => {
      window.removeEventListener("storage_update", loadNotifs);
      window.removeEventListener("storage", loadNotifs);
    };
  }, []);

  // 3. นับจำนวนที่ยังไม่อ่าน (isRead = false)
  const unreadCount = notifs.filter(n => !n.isRead).length;

  // 4. ฟังก์ชันกดกระดิ่ง (เคลียร์เลขแจ้งเตือน)
  const handleRead = () => {
    // หน่วงเวลานิดนึงเพื่อให้คนเห็นตัวเลขก่อนหาย (Option) หรือเคลียร์เลยก็ได้
    if (unreadCount > 0) {
      const readAll = notifs.map(n => ({ ...n, isRead: true }));
      setNotifs(readAll);
      localStorage.setItem('my_notifications', JSON.stringify(readAll));
    }
  };

  // 5. ฟังก์ชันแปลงเวลา
  const timeAgo = (dateString) => {
    if (!dateString) return "";
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return "เมื่อสักครู่";
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชม. ที่แล้ว`;
    return "นานมาแล้ว";
  };
  // =================================================================


  const menuItems = [
    {
      title: "เมนูหลัก",
      items: [
        {
          icon: "flaticon-discovery",
          text: "หน้าแดชบอร์ด",
          href: "/dashboard-home",
        },
        {
          icon: "flaticon-user",
          text: "โปรไฟล์ของฉัน",
          href: "/dashboard-my-profile",
        },
        {
          icon: "flaticon-chat-1",
          text: "ข้อความ",
          href: "/dashboard-message",
        },
      ],
    },
    {
      title: "การจัดการทรัพย์สิน",
      items: [
        {
          icon: "flaticon-new-tab",
          text: "เพิ่มที่อยู่ทรัพย์",
          href: "/dashboard-add-property",
        },
        {
          icon: "flaticon-home",
          text: "ทรัพย์สินของฉัน",
          href: "/dashboard-my-properties",
        },
      ],
    },
    {
      title: "การตั้งค่าบัญชี",
      items: [
        {
          href: "/pricing",
          icon: "flaticon-protection",
          text: "แพ็กเกจสมาชิก",
        },
        {
          href: "/dashboard-points/promote",
          icon: "far fa-bullhorn",
          text: "โปรโมทประกาศ",
        },
        {
          icon: "flaticon-review",
          text: "ประวัติพอยต์",
          href: "/dashboard-my-package",
        },
        {
          icon: "flaticon-logout",
          text: "ออกจากระบบ",
          href: "/login",
        },
      ],
    },
  ];

  return (
    <>
      <header className="header-nav nav-homepage-style light-header position-fixed menu-home4 main-menu">
        <nav className="posr">
          <div className="container-fluid pr30 pr15-xs pl30 posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-start d-flex align-items-center">
                  <div className="dashboard_header_logo position-relative me-2 me-xl-5">
                    <Link className="logo" href="/">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Header Logo"
                      />
                    </Link>
                  </div>
                  {/* End Logo */}

                  <a
                    className="dashboard_sidebar_toggle_icon text-thm1 vam"
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
                    aria-controls="SidebarPanelLabel"
                  >
                    <Image
                      width={25}
                      height={9}
                      className="img-1"
                      src="/images/dark-nav-icon.svg"
                      alt="humberger menu"
                    />
                  </a>
                </div>
              </div>
              {/* End .col-auto */}

              <div className="d-none d-lg-block col-lg-auto">
                <MainMenu />
                {/* End Main Menu */}
              </div>
              {/* End d-none d-lg-block */}

              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-end header_right_widgets">
                  <ul className="mb0 d-flex justify-content-center justify-content-sm-end p-0">

                    {/* 🎯 กระดิ่งแจ้งเตือน (Updated Logic) */}
                    <li className="d-none d-sm-block">
                      <div className="dropdown">
                        <a
                          className="text-center mr20 notif position-relative"
                          href="#"
                          data-bs-toggle="dropdown"
                          onClick={handleRead} // ✅ กดปุ๊บ ตัวเลขหาย (เพราะ set isRead = true)
                        >
                          <span
                            className="flaticon-bell"
                            style={{ fontSize: "22px" }}
                          />

                          {/* ✅ โชว์เลขเฉพาะตอนมีข้อความใหม่ */}
                          {unreadCount > 0 && (
                            <span
                              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                              style={{ fontSize: "10px", marginTop: "5px" }}
                            >
                              {unreadCount}
                            </span>
                          )}
                        </a>

                        <div
                          className="dropdown-menu dropdown-menu-end shadow border-0 p-0"
                          style={{
                            width: "400px",
                            minWidth: "400px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            marginTop: "10px",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white border-bottom">
                            <h6
                              className="m-0 fw-bold text-dark"
                              style={{ fontSize: "16px" }}
                            >
                              การแจ้งเตือน
                            </h6>
                            <Link
                              href="/dashboard-message"
                              className="text-primary text-decoration-none me-3"
                              style={{
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "500",
                                whiteSpace: "nowrap",
                              }}
                            >
                              อ่านทั้งหมด
                            </Link>
                          </div>

                          <div style={{ maxHeight: "350px", overflowY: "auto" }}>

                            {/* ✅ วนลูปแสดงข้อมูลจริง */}
                            {notifs.length === 0 ? (
                              <div className="p-4 text-center text-muted fz14">ไม่มีการแจ้งเตือนใหม่</div>
                            ) : (
                              notifs.map((item) => (
                                <Link
                                  key={item.id}
                                  // ✅✅ แก้ไขตรงนี้: ใช้ item.url ที่เราสร้างไว้ใน Mock Data
                                  href={item.url || "/dashboard-message"}
                                  className="dropdown-item border-bottom"
                                  style={{
                                    height: "auto",
                                    width: "100%",
                                    lineHeight: "normal",
                                    whiteSpace: "normal",
                                    padding: "15px 20px",
                                    display: "block",
                                    // ถ้ายังไม่อ่าน ให้พื้นหลังเป็นสีฟ้าอ่อน
                                    backgroundColor: item.isRead ? "#fff" : "#f0f9ff",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      width: "100%",
                                    }}
                                  >
                                    {/* ไอคอนเปลี่ยนสีตามประเภท */}
                                    <div
                                      style={{
                                        flexShrink: 0,
                                        width: "45px",
                                        height: "45px",
                                        // ถ้าเป็น cobroke สีส้ม, ถ้าไม่ใช่ สีน้ำเงิน
                                        backgroundColor: item.type === 'cobroke' ? "#fff7ed" : "#eef2ff",
                                        color: item.type === 'cobroke' ? "#f97316" : "#4f46e5",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "15px",
                                      }}
                                    >
                                      <i
                                        className={item.type === 'cobroke' ? "fas fa-handshake" : "flaticon-chat"}
                                        style={{ fontSize: "20px" }}
                                      />
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "baseline",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                            color: "#333",
                                          }}
                                        >
                                          {item.title}
                                        </span>
                                        <span
                                          style={{
                                            fontSize: "11px",
                                            color: "#999",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {timeAgo(item.time)}
                                        </span>
                                      </div>

                                      <p
                                        style={{
                                          fontSize: "13px",
                                          lineHeight: "1.6",
                                          color: "#666",
                                          margin: 0,
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {item.message}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              ))
                            )}

                          </div>

                          <div className="p-3 text-center border-top bg-white">
                            <Link
                              href="/dashboard-message"
                              className="text-decoration-none text-primary fw-bold"
                              style={{
                                fontSize: "14px",
                                height: "auto",
                                width: "auto",
                                lineHeight: "normal",
                              }}
                            >
                              ดูการแจ้งเตือนทั้งหมด
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    {/* End notification icon */}

                    {/* เมนูโปรไฟล์ผู้ใช้ */}
                    <li className="user_setting">
                      <div className="dropdown">
                        <a className="btn" href="#" data-bs-toggle="dropdown">
                          <Image
                            width={44}
                            height={44}
                            src="/images/resource/user.png"
                            alt="user.png"
                          />
                        </a>
                        <div className="dropdown-menu">
                          <div className="user_setting_content">
                            {menuItems.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <p
                                  className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mb20" : "mt30"
                                    }`}
                                >
                                  {section.title}
                                </p>
                                {section.items.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    className={`dropdown-item ${pathname === item.href ? "-is-active" : ""
                                      } `}
                                    href={item.href}
                                  >
                                    <i className={`${item.icon} mr10`} />
                                    {item.text}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </li>
                    {/* End avatar dropdown */}
                  </ul>
                </div>
              </div>
              {/* End .col-6 */}
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>

      {/* Sidebar Panel (offcanvas) */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="SidebarPanel"
        aria-labelledby="SidebarPanelLabel"
      >
        <SidebarPanel />
      </div>
    </>
  );
};

export default DashboardHeader;