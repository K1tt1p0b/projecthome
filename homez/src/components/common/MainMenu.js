import { listingItems, pageItems, blogItems } from "@/data/navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const getGroup = (title) =>
  listingItems.find((x) => String(x?.title || "").trim() === title) || {
    title,
    submenu: [],
  };

const MainMenu = () => {
  const pathname = usePathname();
  const [topMenu, setTopMenu] = useState("");

  // ✅ กลุ่มหลัก
  const assetsGroup = useMemo(() => getGroup("สินทรัพย์"), []);
  const servicesGroup = useMemo(() => getGroup("บริการเพิ่มเติม"), []);
  const coursesGroup = useMemo(() => getGroup("คอร์สเรียน"), []);

  // ✅ หา blog-list-v3 เพื่อเอามาใช้เป็น “บทความ”
  const articleLink = useMemo(() => {
    const v3 = (blogItems || []).find((b) => b?.href === "/blog-list-v3");
    return v3?.href || "/blog-list-v3";
  }, []);

  // ✅ “ข้อมูลเพิ่มเติม” (กำหนดเองตามที่บอก)
  const infoItems = useMemo(() => {
    // ดาวน์โหลดเอกสาร
    const docs =
      (pageItems || []).find((x) => x?.href === "/download-documents") || {
        href: "/download-documents",
        label: "ดาวน์โหลดเอกสาร",
      };

    // FAQ (ในรูปคุณใช้ Faq)
    const faq =
      (pageItems || []).find((x) => x?.href === "/faq") || {
        href: "/faq",
        label: "Faq",
      };

    // เกี่ยวกับเรา
    const about =
      (pageItems || []).find((x) => x?.href === "/about") || {
        href: "/about",
        label: "เกี่ยวกับเรา",
      };

    // บทความ (ใช้ blog list v3)
    const article = {
      href: articleLink,
      label: "บทความ",
    };

    return [docs, faq, article, about];
  }, [articleLink]);

  useEffect(() => {
    const sameRoot = (href) =>
      String(href || "").split("/")[1] === pathname.split("/")[1];

    let nextTop = "";

    if (pathname === "/" || pathname === "") nextTop = "home";
    else if ((assetsGroup.submenu || []).some((i) => sameRoot(i?.href)))
      nextTop = "assets";
    else if ((servicesGroup.submenu || []).some((i) => sameRoot(i?.href)))
      nextTop = "services";
    else if ((coursesGroup.submenu || []).some((i) => sameRoot(i?.href)))
      nextTop = "courses";
    else if (infoItems.some((i) => sameRoot(i?.href))) nextTop = "info";

    setTopMenu(nextTop);
  }, [pathname, assetsGroup, servicesGroup, coursesGroup, infoItems]);

  const handleActive = (href) => (href === pathname ? "menuActive" : "");

  return (
    <ul className="ace-responsive-menu">
      {/* หน้าแรก */}
      <li className="visible_list dropitem">
        <Link className="list-item" href="/">
          <span className={topMenu === "home" ? "title menuActive" : "title"}>
            หน้าแรก
          </span>
        </Link>
      </li>

      {/* สินทรัพย์ */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "assets" ? "title menuActive" : "title"}>
            สินทรัพย์
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {(assetsGroup.submenu || []).map((item, idx) => (
            <li key={idx}>
              <Link className={handleActive(item.href)} href={item.href || "/"}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      {/* บริการเพิ่มเติม */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span
            className={topMenu === "services" ? "title menuActive" : "title"}
          >
            บริการเพิ่มเติม
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {(servicesGroup.submenu || []).map((item, idx) => (
            <li key={idx}>
              <Link className={handleActive(item.href)} href={item.href || "/"}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      {/* คอสเรียน (แสดงตามที่อยากให้โชว์) */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span
            className={topMenu === "courses" ? "title menuActive" : "title"}
          >
            คอสเรียน
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {(coursesGroup.submenu || []).map((item, idx) => (
            <li key={idx}>
              <Link
                className={handleActive(item.href)}
                href={item.href || "/courses"}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      {/* ข้อมูลเพิ่มเติม */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "info" ? "title menuActive" : "title"}>
            ข้อมูลเพิ่มเติม
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {infoItems.map((item, idx) => (
            <li key={idx}>
              <Link className={handleActive(item.href)} href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

export default MainMenu;
