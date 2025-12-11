"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const pathname = usePathname();


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
        }
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
          icon: "flaticon-review",
          text: "ประวัติพอยต์",
          href: "/dashboard-my-package",
        },
        {
          icon: "flaticon-user",
          text: "โปรไฟล์ของฉัน",
          href: "/dashboard-my-profile",
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

                  {/* ปุ่มเปิด Sidebar Panel (มือถือ) */}
                  <a
                    className="dashboard_sidebar_toggle_icon text-thm1 vam"
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
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

              {/* เมนูหลักบน Desktop */}
              <div className="d-none d-lg-block col-lg-auto">
                <MainMenu />
              </div>

              {/* ส่วนไอคอนด้านขวา */}
              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-end header_right_widgets">
                  <ul className="mb0 d-flex justify-content-center justify-content-sm-end p-0">

                    {/* ไอคอนข้อความ */}
                    <li className="d-none d-sm-block">
                      <Link className="text-center mr15" href="/dashboard-message">
                        <span className="flaticon-email" />
                      </Link>
                    </li>

                    {/* 🌟 กระดิ่งแจ้งเตือน — (ปรับแล้ว) */}
                    <li className="d-none d-sm-block">
                      <div className="dropdown">
                        <a
                          className="text-center mr20 notif position-relative"
                          href="#"
                          data-bs-toggle="dropdown"
                        >
                          <span className="flaticon-bell" style={{ fontSize: "22px" }} />
                          <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: "10px", marginTop: "5px" }}
                          >
                            2
                          </span>
                        </a>

                        {/* Dropdown รายการแจ้งเตือน */}
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
                            <h6 className="m-0 fw-bold text-dark">การแจ้งเตือน</h6>
                            <span className="text-primary" style={{ cursor: "pointer" }}>
                              อ่านทั้งหมด
                            </span>
                          </div>

                          <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                            {/* รายการแจ้งเตือนตัวอย่าง */}
                            <Link href="/dashboard-message" className="dropdown-item" style={{
                              height: "auto",
                              padding: "15px 20px",
                              display: "block",
                              backgroundColor: "#fff",
                              whiteSpace: "normal"
                            }}>
                              <div style={{ display: "flex" }}>
                                <div style={{
                                  width: "45px",
                                  height: "45px",
                                  backgroundColor: "#eef2ff",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "15px"
                                }}>
                                  <i className="flaticon-chat-1" />
                                </div>

                                <div>
                                  <div className="fw-bold">มีข้อความใหม่!</div>
                                  <p className="mb-0 text-muted">ลูกค้าสนใจบ้านพระราม 9</p>
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div className="p-3 text-center border-top bg-white">
                            <Link href="/dashboard-message" className="fw-bold text-primary">
                              ดูทั้งหมด
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* เมนู User */}
                    <li className="user_setting">
                      <div className="dropdown">
                        <a className="btn" href="#" data-bs-toggle="dropdown">
                          <Image
                            width={44}
                            height={44}
                            src="/images/resource/user.png"
                            alt="user"
                          />
                        </a>

                        <div className="dropdown-menu">
                          <div className="user_setting_content">
                            {menuItems.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <p className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mb20" : "mt30"}`}>
                                  {section.title}
                                </p>

                                {section.items.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    className={`dropdown-item ${pathname === item.href ? "-is-active" : ""}`}
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

                  </ul>
                </div>
              </div>

            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar Panel สำหรับมือถือ */}
      <div className="offcanvas offcanvas-end" id="SidebarPanel">
        <SidebarPanel />
      </div>
    </>
  );
};

export default DashboardHeader;
