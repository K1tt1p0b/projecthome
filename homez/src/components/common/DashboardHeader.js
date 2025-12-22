"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const pathname = usePathname();

  // 🔥 ปรับให้ตรงกับ SidebarDashboard (ภาษาไทย + ลิงก์ตรงกัน)
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
          icon: "flaticon-like",
          text: "เติมพอยต์",
          href: "/dashboard-points",
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
                    <li className="d-none d-sm-block">
                      <Link className="text-center mr15" href="/login">
                        <span className="flaticon-email" />
                      </Link>
                    </li>
                    {/* End email box */}

                    {/* 🎯 กระดิ่งแจ้งเตือน — คงไว้เหมือนเดิมทุกอย่าง */}
                    <li className="d-none d-sm-block">
                      <div className="dropdown">
                        <a
                          className="text-center mr20 notif position-relative"
                          href="#"
                          data-bs-toggle="dropdown"
                        >
                          <span
                            className="flaticon-bell"
                            style={{ fontSize: "22px" }}
                          />
                          <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: "10px", marginTop: "5px" }}
                          >
                            2
                          </span>
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
                              className="text-primary text-decoration-none me-3" // เพิ่ม text-decoration-none ไม่ให้มีขีดเส้นใต้
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

                          <div
                            style={{ maxHeight: "350px", overflowY: "auto" }}
                          >
                            <Link
                              href="/dashboard-message"
                              className="dropdown-item border-bottom"
                              style={{
                                height: "auto",
                                width: "100%",
                                lineHeight: "normal",
                                whiteSpace: "normal",
                                padding: "15px 20px",
                                display: "block",
                                backgroundColor: "#fff",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  width: "100%",
                                }}
                              >
                                <div
                                  style={{
                                    flexShrink: 0,
                                    width: "45px",
                                    height: "45px",
                                    backgroundColor: "#eef2ff",
                                    color: "#4f46e5",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "15px",
                                  }}
                                >
                                  <i
                                    className="flaticon-chat-1"
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
                                      มีข้อความใหม่!
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "#999",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      2 นาที
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
                                    ลูกค้าสนใจบ้านเดี่ยว พระราม 9 (ติดต่อด่วน)
                                  </p>
                                </div>
                              </div>
                            </Link>

                            <Link
                              href="/dashboard-my-properties"
                              className="dropdown-item"
                              style={{
                                height: "auto",
                                width: "100%",
                                lineHeight: "normal",
                                whiteSpace: "normal",
                                padding: "15px 20px",
                                display: "block",
                                backgroundColor: "#fff",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  width: "100%",
                                }}
                              >
                                <div
                                  style={{
                                    flexShrink: 0,
                                    width: "45px",
                                    height: "45px",
                                    backgroundColor: "#ecfdf5",
                                    color: "#10b981",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "15px",
                                  }}
                                >
                                  <i
                                    className="flaticon-home"
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
                                      อนุมัติประกาศแล้ว
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "#999",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      1 ชม.
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
                                    คอนโด สุขุมวิท 24 ออนไลน์แล้ว
                                  </p>
                                </div>
                              </div>
                            </Link>
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
