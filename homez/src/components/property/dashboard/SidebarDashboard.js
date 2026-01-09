"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);

  // dropdown
  const [openMicrosite, setOpenMicrosite] = useState(false);

  const isActive = (href) => {
    if (!href || href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const micrositeItems = useMemo(
    () => [
      { href: "/dashboard-about-me", icon: "flaticon-user", text: "About me" },
      { href: "/dashboard-gallery", icon: "flaticon-images", text: "แกลเลอรี่" },
      { href: "/dashboard-video-gallery", icon: "flaticon-play", text: "วิดีโอ" },
      { href: "/microsite/settings", icon: "fas fa-cog", text: "ตั้งค่า" },
    ],
    []
  );

  const isMicrositeActive = useMemo(() => {
    return micrositeItems.some((it) => isActive(it.href));
  }, [micrositeItems, pathname]);

  useEffect(() => {
    if (isMicrositeActive) setOpenMicrosite(true);
  }, [isMicrositeActive]);

  // --- 1. รายการเมนูในกลุ่ม Support ---
  const supportItems = useMemo(
    () => [
      { href: "/agent-faq", icon: "fas fa-circle-question", text: "คำถามที่พบบ่อย (FAQ)" },
      { href: "/dashboard-contact-admin", icon: "flaticon-call", text: "ติดต่อเจ้าหน้าที่" },
    ],
    []
  );

  // --- 2. เช็คว่าเปิดหน้า Support อยู่ไหม ---
  const isSupportActive = useMemo(() => {
    return supportItems.some((it) => isActive(it.href));
  }, [supportItems, pathname]);

  // --- 3. State เปิด/ปิด ---
  const [openSupport, setOpenSupport] = useState(false);

  useEffect(() => {
    if (isSupportActive) setOpenSupport(true);
  }, [isSupportActive]);

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
          text: "รายการผู้ติดต่อ",
        },

        // ✅ Microsite dropdown อยู่ในเมนูหลัก
        {
          type: "dropdown",
          key: "microsite",
          icon: "fas fa-layer-group",
          text: "Microsite",
          children: micrositeItems,
        },
      ],
    },
    {
      title: "การจัดการทรัพย์สิน",
      items: [
        {
          href: "/dashboard-my-properties",
          icon: "flaticon-home",
          text: "ทรัพย์สินของฉัน",
        },
        {
          href: "/dashboard-banners",
          icon: "flaticon-house-price",
          text: "โฆษณาทรัพย์สิน",
        },
        {
          href: "/dashboard-my-construction",
          icon: "fas fa-hard-hat",
          text: "งานรับเหมาของฉัน",
        },
        {
          href: "/dashboard-my-course",
          icon: "fas fa-book",
          text: "คอร์สเรียนของฉัน",
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
          href: "/dashboard-my-package",
          icon: "flaticon-review",
          text: "ประวัติการชำระเงิน",
        },
        {
          type: "dropdown",
          key: "support",       // Key ห้ามซ้ำกับอันอื่น
          icon: "fas fa-headset", // ไอคอนรูปหูฟัง/เครื่องหมายคำถาม
          text: "ช่วยเหลือ",      // ชื่อเมนู
          children: supportItems, // เอาลูกๆ มาใส่ตรงนี้
        },
        {
          href: "/login",
          icon: "flaticon-logout",
          text: "ออกจากระบบ",
        },
      ],
    },
  ];

  const rowStyle = (highlight) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "14px",
    backgroundColor: highlight ? "#0f1115" : "transparent",
    color: highlight ? "#fff" : "inherit",
    transition: "all .15s ease",
    cursor: "pointer",
    width: "100%",
    textDecoration: "none",
  });

  const renderLinkItem = (item, key) => {
    const active = isActive(item.href);
    const isHover = hovered === key;
    const highlight = active || isHover;

    return (
      <div key={key} className="sidebar_list_item">
        <Link
          href={item.href}
          onMouseEnter={() => setHovered(key)}
          onMouseLeave={() => setHovered(null)}
          className={`items-center ${active ? "-is-active" : ""}`}
          style={rowStyle(highlight)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i className={`${item.icon} mr15`} style={{ color: highlight ? "#fff" : "" }} />
            <span style={{ color: highlight ? "#fff" : "" }}>{item.text}</span>
          </div>

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
  };

const renderDropdownItem = (item, key) => {
    // 1. เช็คว่าเป็นเมนูไหน เพื่อเลือกใช้ State ให้ถูกตัว
    // ถ้าเป็น support ให้ใช้ openSupport, ถ้าไม่ใช่ให้ใช้ openMicrosite
    const isOpen = item.key === "support" ? openSupport : openMicrosite;
    const setIsOpen = item.key === "support" ? setOpenSupport : setOpenMicrosite;

    const isHover = hovered === key;
    // เช็ค highlight: ถ้าเมนูย่อยเปิดอยู่ หรือ เมาส์ชี้อยู่
    const highlight = (item.key === "support" ? isSupportActive : isMicrositeActive) || isHover;

    return (
      <div key={key}>
        <div className="sidebar_list_item">
          <button
            type="button"
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            // ✅ แก้ตรงนี้: ใส่ e.preventDefault() กันหน้าเด้ง และใช้ setIsOpen ตามคีย์
            onClick={(e) => {
              e.preventDefault(); 
              setIsOpen((v) => !v);
            }}
            aria-expanded={isOpen}
            style={{
              ...rowStyle(highlight),
              border: "none",
              outline: "none",
              background: highlight ? "#0f1115" : "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className={`${item.icon} mr15`} style={{ color: highlight ? "#fff" : "" }} />
              <span style={{ color: highlight ? "#fff" : "" }}>{item.text}</span>
            </div>

            <i
              className="fas fa-chevron-down"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", // ✅ ใช้ isOpen ที่เช็คมาแล้ว
                transition: "transform .15s ease",
                color: highlight ? "#fff" : "",
              }}
            />
          </button>
        </div>

        <div
          style={{
            maxHeight: isOpen ? 500 : 0, // ✅ ใช้ isOpen ที่เช็คมาแล้ว
            overflow: "hidden",
            transition: "max-height .2s ease",
          }}
        >
          <div style={{ paddingLeft: 14, marginTop: 6 }}>
            {item.children.map((child, idx) => {
              const childKey = `${key}-${idx}`;
              const active = isActive(child.href);
              const isHover2 = hovered === childKey;
              const highlight2 = active || isHover2;

              return (
                <div key={child.href} className="sidebar_list_item" style={{ marginTop: 6 }}>
                  <Link
                    href={child.href}
                    onMouseEnter={() => setHovered(childKey)}
                    onMouseLeave={() => setHovered(null)}
                    className={`items-center ${active ? "-is-active" : ""}`}
                    style={{
                      ...rowStyle(highlight2),
                      padding: "10px 12px",
                      borderRadius: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <i className={`${child.icon} mr15`} style={{ color: highlight2 ? "#fff" : "" }} />
                      <span style={{ color: highlight2 ? "#fff" : "" }}>{child.text}</span>
                    </div>
                    <span />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      <div className="dashboard_sidebar_list">
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"}`}>
              {section.title}
            </p>

            {section.items.map((item, itemIndex) => {
              const key = `${sectionIndex}-${itemIndex}`;

              if (item.type === "dropdown") {
                return renderDropdownItem(item, key);
              }

              return renderLinkItem(item, key);
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
