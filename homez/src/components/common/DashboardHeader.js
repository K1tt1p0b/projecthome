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

  const [currentPackage, setCurrentPackage] = useState("Starter");

  // 2. ทำงานเมื่อโหลดหน้าเว็บ + เฝ้าฟัง Event
  useEffect(() => {
    loadNotifs(); // โหลดครั้งแรก

    // ✅ ตั้งหูรอฟังเสียง "storage_update" จาก Sidebar
    window.addEventListener("storage_update", loadNotifs);
    // ฟังเผื่อเปิดหลาย Tab
    window.addEventListener("storage", loadNotifs);

    // ✅ ดึงข้อมูลแพ็กเกจจากเครื่อง
    const savedRank = localStorage.getItem("my_agent_rank");
    if (savedRank) {
      // แปลงตัวอักษรแรกเป็นพิมพ์ใหญ่ (pro -> Pro)
      setCurrentPackage(savedRank.charAt(0).toUpperCase() + savedRank.slice(1));
    }

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

                    {/* 👤 เมนูโปรไฟล์ผู้ใช้ (ส่วนที่แก้ไข UI) */}
                    <li className="user_setting">
                      <div className="dropdown">
                        <a className="btn position-relative" href="#" data-bs-toggle="dropdown">
                          <Image width={44} height={44} src="/images/resource/user.png" alt="user.png" />
                          {currentPackage !== 'Starter' && (
                            <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle"></span>
                          )}
                        </a>

                        {/* ✅ กล่อง Dropdown ดีไซน์ใหม่ (แก้บัคสีส้ม + ปุ่มดำ) */}
                        <div className="dropdown-menu shadow-lg border-0"
                          style={{
                            minWidth: '300px',
                            marginTop: '15px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            maxHeight: '75vh',
                            overflowY: 'auto',
                            padding: 0
                          }}>

                          {/* ส่วนหัว: แสดงแพ็กเกจ */}
                          <div className="package-header p-4 text-center"
                            style={{
                              backgroundColor: '#f7f7f7',
                              borderBottom: '1px solid #eee'
                            }}>
                            <p className="text-muted fz12 mb-1 text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Current Plan</p>

                            <h4 className="title text-dark fw-bold mb-3" style={{ fontSize: '20px' }}>
                              {currentPackage === 'Business' && <i className="fas fa-crown text-warning me-2"></i>}
                              {currentPackage === 'Pro' && <i className="fas fa-check-circle text-success me-2"></i>}
                              {currentPackage}
                            </h4>

                            {currentPackage !== 'Business' ? (
                              <Link
                                href="/pricing"
                                // ✅ ใช้ Inline Style ล้วนๆ เพื่อแก้บัคปุ่มดำ
                                className="d-flex align-items-center justify-content-center w-100 rounded-pill text-decoration-none"
                                style={{
                                  backgroundColor: '#212529',
                                  color: '#fff',
                                  padding: '10px 20px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  transition: '0.3s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#000'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#212529'}
                              >
                                <i className="fas fa-arrow-up me-2"></i>อัปเกรดตอนนี้
                              </Link>
                            ) : (
                              <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                <i className="fas fa-star me-1"></i> สูงสุดแล้ว
                              </div>
                            )}
                          </div>

                          {/* ส่วนรายการเมนู */}
                          <div className="user_setting_content p-3"
                            style={{ backgroundColor: '#fff', maxHeight: 'calc(100vh-200px)', overflowY: 'auto' }}>
                            {menuItems.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="mb-3">
                                <p className="fz12 text-uppercase fw-bold text-muted mb-2 px-2">
                                  {section.title}
                                </p>
                                {section.items.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    // ✅ ลบ class 'dropdown-item' ออกไปเลย เพื่อไม่ให้ style ของธีมมาตีกัน
                                    // ✅ ใช้ class พื้นฐานจัด layout แทน
                                    className="d-flex align-items-center rounded-2 px-3 py-2 text-decoration-none"
                                    href={item.href}
                                    style={{
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      // ถ้าเป็นหน้าปัจจุบัน ให้พื้นหลังสีส้มอ่อน ตัวหนังสือสีส้ม
                                      backgroundColor: pathname === item.href ? '#fff0ec' : 'transparent',
                                      color: pathname === item.href ? '#eb6753' : '#333',
                                      transition: 'all 0.2s',
                                      cursor: 'pointer'
                                    }}
                                    // ✅ ใช้ Event ควบคุมสีตอน Hover เอง ไม่พึ่ง CSS
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#fff0ec'; // พื้นหลังสีส้มอ่อน
                                      e.currentTarget.style.color = '#eb6753'; // ตัวหนังสือสีส้ม
                                    }}
                                    onMouseLeave={(e) => {
                                      // ถ้าไม่ใช่หน้าปัจจุบัน ให้กลับเป็นสีเดิม
                                      if (pathname !== item.href) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#333';
                                      } else {
                                        // ถ้าเป็นหน้าปัจจุบัน ให้คงสี Active ไว้
                                        e.currentTarget.style.backgroundColor = '#fff0ec';
                                        e.currentTarget.style.color = '#eb6753';
                                      }
                                    }}
                                  >
                                    <i className={`${item.icon} me-3 fz16 opacity-75`} style={{ width: '20px', textAlign: 'center' }} />
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