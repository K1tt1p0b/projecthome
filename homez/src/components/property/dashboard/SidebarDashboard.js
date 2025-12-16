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
          href: "/dashboard-my-profile",
          icon: "flaticon-user",
          text: "โปรไฟล์ของฉัน",
        },
        {
          href: "/dashboard-home",
          icon: "flaticon-discovery",
          text: "หน้าแดชบอร์ด",
        },
        {
          href: "/dashboard-message",
          icon: "flaticon-chat-1",
          text: "ข้อความ",
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
          href: "/dashboard-points",
          icon: "flaticon-like",
          text: "เติมพอยต์",
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
                >
                  <i
                    className={`${item.icon} mr15`}
                    style={{
                      // ถ้าเป็นโทรโข่ง ให้ปรับจางลงเหลือ 70%
                      opacity: item.icon.includes('bullhorn') ? 0.9 : 1,
                      // หรือปรับขนาดลงนิดนึงให้ดูไม่แน่น
                      fontSize: item.icon.includes('bullhorn') ? '14px' : ''
                    }}
                  />
                  {item.text}
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
