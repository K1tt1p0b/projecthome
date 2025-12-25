"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const SidebarDashboard = () => {
  const pathname = usePathname();

  // เพิ่ม: active แบบรองรับ /dashboard-banners/new ด้วย
  const isActive = (href) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarItems = [
    {
      title: "เมนูหลัก",
      items: [
        {
          href: "/dashboard-home",
          icon: "flaticon-discovery",
          text: "หน้าแดชบอร์ด",
        },
        {
          href: "/dashboard-my-profile",
          icon: "flaticon-user",
          text: "โปรไฟล์ของฉัน",
        },
        {
          href: "/dashboard-message",
          icon: "flaticon-chat-1",
          unreadCount: 5,
          text: "ข้อความ",
        },
        {
          href: "/dashboard-agent-contacts",
          icon: "flaticon-chat",
          unreadCount: 2,
          text: "ข้อความจากผู้สนใจ",
        },
      ],
    },
    {
      title: "การจัดการทรัพย์สิน",
      items: [
        {
          href: "/dashboard-add-property",
          icon: "flaticon-new-tab",
          text: "เพิ่มทรัพย์ใหม่",
        },
        {
          href: "/dashboard-my-properties",
          icon: "flaticon-home",
          text: "ทรัพย์สินของฉัน",
        },
        {
          href: "/dashboard-banners",
          icon: "flaticon-images",
          text: "โฆษณาทรัพย์สิน",
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
          href: "/dashboard-my-package",
          icon: "flaticon-review",
          text: "ประวัติพอยต์",
        },
        {
          href: "/login",
          icon: "flaticon-logout",
          text: "ออกจากระบบ",
        },
      ],
    },
  ];

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      <div className="dashboard_sidebar_list">
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p
              className={`fz15 fw400 ff-heading ${
                sectionIndex === 0 ? "mt-0" : "mt30"
              }`}
            >
              {section.title}
            </p>

            {section.items.map((item, itemIndex) => {
              const active = isActive(item.href);

              return (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center ${active ? "-is-active" : ""}`}
                    // ปรับ: ถ้า active ให้พื้นหลังดำแบบรูป
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      backgroundColor: active ? "#0f1115" : "transparent",
                      color: active ? "#fff" : "inherit",
                      transition: "all .15s ease",
                    }}
                  >
                    {/* กลุ่มก้อน ไอคอน + ชื่อเมนู */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <i
                        className={`${item.icon} mr15`}
                        style={{
                          opacity: item.icon.includes("bullhorn") ? 0.9 : 1,
                          fontSize: item.icon.includes("bullhorn")
                            ? "14px"
                            : "",
                          color: active ? "#fff" : "", // เพิ่ม: icon ขาวเมื่อ active
                        }}
                      />
                      <span style={{ color: active ? "#fff" : "" }}>
                        {item.text}
                      </span>
                    </div>

                    {/* เลขแจ้งเตือน */}
                    {item.unreadCount > 0 && (
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: "#ff5a5f",
                          color: "white",
                          fontSize: "12px",
                          padding: "4px 10px",
                          fontWeight: "500",
                        }}
                      >
                        {item.unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
