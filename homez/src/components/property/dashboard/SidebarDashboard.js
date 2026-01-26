"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);

  // dropdown
  const [openMicrosite, setOpenMicrosite] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

  /**
   * ✅ ให้เมนู "ทรัพย์สินของฉัน" ติดแท็บดำ (active) เวลาผู้ใช้อยู่ใน flow ที่เกี่ยวกับทรัพย์สิน:
   * - /dashboard-my-properties (หน้ารายการ)
   * - /dashboard-boost-property (หน้าเลือก/ยืนยันดัน)
   * - /dashboard-add-property (หน้าเพิ่ม)
   * - /dashboard-edit-property/[id] (หน้าแก้ไข)
   * - และเผื่อชื่อ route อื่น ๆ ที่คล้าย ๆ กัน
   *
   * usePathname() ไม่รวม query string อยู่แล้ว เลยไม่ต้องเช็ค ?propertyId=...
   */
  const isActive = (href) => {
    if (!href || href === "#") return false;

    // ✅ alias mapping: ถ้า pathname เป็นพวกนี้ ให้ถือว่า active ที่เมนู href นี้ด้วย
    const aliasActiveMap = {
      "/dashboard-my-properties": [
        "/dashboard-boost-property", // boost manual/auto
        "/dashboard-add-property", // add property (กรณีใช้ชื่อนี้)
        "/add-property", // เผื่อ template เดิม
        "/dashboard-create-property", // เผื่อมึงตั้ง route แบบนี้
        "/dashboard-edit-property", // ✅ แก้ไขทรัพย์สิน (ทั้ง /dashboard-edit-property/1 หรือ /dashboard-edit-property/abc)
        "/dashboard-edit-property/", // เผื่อบางเคสมี slash ต่อท้าย
        "/dashboard-my-properties-edit", // เผื่อบางคนตั้งแบบนี้
      ],
    };

    // 1) active ปกติ
    const direct = pathname === href || pathname.startsWith(href + "/");
    if (direct) return true;

    // 2) active แบบ alias
    const aliases = aliasActiveMap[href] || [];
    if (aliases.some((p) => pathname === p || pathname.startsWith(p))) return true;

    return false;
  };

  const micrositeItems = useMemo(
    () => [
      { href: "/dashboard-about-me", icon: "flaticon-user", text: "About me" },
      { href: "/dashboard-gallery", icon: "flaticon-images", text: "แกลเลอรี่" },
      { href: "/dashboard-video-gallery", icon: "flaticon-play", text: "วิดีโอ" },
      { href: "/dashboard-setting-template", icon: "fas fa-cog", text: "ตั้งค่า" },
    ],
    []
  );

  const supportItems = useMemo(
    () => [
      { href: "/agent-faq", icon: "fas fa-circle-question", text: "คำถามที่พบบ่อย (FAQ)" },
      { href: "/dashboard-contact-admin", icon: "flaticon-call", text: "ติดต่อเจ้าหน้าที่" },
    ],
    []
  );

  const isMicrositeActive = useMemo(() => micrositeItems.some((it) => isActive(it.href)), [micrositeItems, pathname]);
  const isSupportActive = useMemo(() => supportItems.some((it) => isActive(it.href)), [supportItems, pathname]);

  useEffect(() => {
    if (isMicrositeActive) setOpenMicrosite(true);
  }, [isMicrositeActive]);

  useEffect(() => {
    if (isSupportActive) setOpenSupport(true);
  }, [isSupportActive]);

  const sidebarItems = [
    {
      title: "เมนูหลัก",
      items: [
        { href: "/dashboard-home", icon: "flaticon-discovery", text: "หน้าแดชบอร์ด" },
        { href: "/dashboard-my-profile", icon: "flaticon-user", text: "โปรไฟล์ของฉัน" },
        { href: "/dashboard-message", icon: "flaticon-chat-1", unreadCount: 5, text: "ข้อความ" },
        { href: "/dashboard-agent-contacts", icon: "flaticon-chat", unreadCount: 2, text: "รายการผู้ติดต่อ" },

        // ✅ Microsite dropdown
        { type: "dropdown", key: "microsite", icon: "fas fa-layer-group", text: "Microsite", children: micrositeItems },
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
        { href: "/dashboard-banners", icon: "flaticon-house-price", text: "โฆษณาทรัพย์สิน" },
        { href: "/dashboard-my-construction", icon: "fas fa-hard-hat", text: "งานบริการของฉัน" },
        { href: "/dashboard-my-course", icon: "fas fa-book", text: "คอร์สเรียนของฉัน" },
      ],
    },
    {
      title: "การตั้งค่าบัญชี",
      items: [
        { href: "/pricing", icon: "flaticon-protection", text: "แพ็กเกจสมาชิก" },
        { href: "/dashboard-my-package", icon: "flaticon-review", text: "ประวัติการชำระเงิน" },

        // ✅ Support dropdown
        { type: "dropdown", key: "support", icon: "fas fa-headset", text: "ช่วยเหลือ", children: supportItems },

        { href: "/login", icon: "flaticon-logout", text: "ออกจากระบบ" },
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
    const isOpen = item.key === "support" ? openSupport : openMicrosite;
    const setIsOpen = item.key === "support" ? setOpenSupport : setOpenMicrosite;

    const isHover = hovered === key;
    const groupActive = item.key === "support" ? isSupportActive : isMicrositeActive;
    const highlight = groupActive || isHover;

    return (
      <div key={key}>
        <div className="sidebar_list_item">
          <button
            type="button"
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
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
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .15s ease",
                color: highlight ? "#fff" : "",
              }}
            />
          </button>
        </div>

        <div
          style={{
            maxHeight: isOpen ? 500 : 0,
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
            <p className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"}`}>{section.title}</p>

            {section.items.map((item, itemIndex) => {
              const key = `${sectionIndex}-${itemIndex}`;
              if (item.type === "dropdown") return renderDropdownItem(item, key);
              return renderLinkItem(item, key);
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
