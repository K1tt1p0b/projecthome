"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const SidebarDashboard = () => {
  const pathname = usePathname();

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
          text: "เพิ่มที่อยู่ทรัพย์",
        },
        {
          href: "/dashboard-my-properties",
          icon: "flaticon-home",
          text: "ทรัพย์สินของฉัน",
        }
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
              className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"
                }`}
            >
              {section.title}
            </p>
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="sidebar_list_item">
                <Link
                  href={item.href}
                  className={`items-center ${pathname === item.href ? "-is-active" : ""
                    }`}
                  // ✅ เพิ่ม justify-content-between เพื่อให้ไอคอน+ชื่อ อยู่ซ้าย และเลขแจ้งเตือน อยู่ขวา
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {/* กลุ่มก้อน ไอคอน + ชื่อเมนู */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i
                      className={`${item.icon} mr15`}
                      style={{
                        opacity: item.icon.includes("bullhorn") ? 0.9 : 1,
                        fontSize: item.icon.includes("bullhorn") ? "14px" : "",
                      }}
                    />
                    {item.text}
                  </div>

                  {/* ✅ ส่วนที่เพิ่ม: แสดงเลขแจ้งเตือน (ถ้ามีข้อมูล unreadCount) */}
                  {item.unreadCount > 0 && (
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: '#ff5a5f', // สีแดงธีม
                        color: 'white',
                        fontSize: '12px',
                        padding: '4px 10px',
                        fontWeight: '500',
                        // ถ้าต้องการให้วงกลมเป๊ะๆ อาจกำหนด minWidth เพิ่ม
                      }}
                    >
                      {item.unreadCount}
                    </span>
                  )}

                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
