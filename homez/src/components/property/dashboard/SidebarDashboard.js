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
      { href: "/microsite/gallery", icon: "flaticon-images", text: "แกลเลอรี่" },
      { href: "/microsite/videos", icon: "flaticon-play", text: "วิดีโอ" },
      { href: "/microsite/about-me", icon: "flaticon-user", text: "About me" },
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

        // ✅ Microsite dropdown อยู่ในเมนูหลัก
        {
          type: "dropdown",
          key: "microsite",
          icon: "fas fa-layer-group",
          text: "อื่นๆ",
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
          href: "/add-listing",
          icon: "fas fa-plus-circle",
          text: "เพิ่มบริการเพิ่มเติม",
        },
        {
          href: "/add-course",
          icon: "fas fa-bullhorn",
          text: "ลงประกาศงานบริการ",
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
    const isHover = hovered === key;
    const highlight = isMicrositeActive || isHover;

    return (
      <div key={key}>
        <div className="sidebar_list_item">
          <button
            type="button"
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setOpenMicrosite((v) => !v)}
            aria-expanded={openMicrosite}
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
                transform: openMicrosite ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .15s ease",
                color: highlight ? "#fff" : "",
              }}
            />
          </button>
        </div>

        <div
          style={{
            maxHeight: openMicrosite ? 500 : 0,
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
