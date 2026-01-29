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
  const [submenu, setSubmenu] = useState("");

  // ✅ groups
  const assetsGroup = useMemo(() => getGroup("สินทรัพย์"), []);
  const servicesGroup = useMemo(() => getGroup("บริการเพิ่มเติม"), []);
  const coursesGroup = useMemo(() => getGroup("คอร์สเรียน"), []);

  // ✅ บทความ: ใช้ blog list v3
  const articleLink = useMemo(() => {
    const v3 = (blogItems || []).find((b) => b?.href === "/blog-list-v3");
    return v3?.href || "/blog-list-v3";
  }, []);

  // ✅ FAQ: แยกเป็นเมนูบนสุด
  const faqLink = useMemo(() => {
    const faq =
      (pageItems || []).find((x) => x?.href === "/faq") || { href: "/faq" };
    return faq.href || "/faq";
  }, []);

  // ✅ ข้อมูลเพิ่มเติม: เอา FAQ ออก
  const infoItems = useMemo(() => {
    const docs =
      (pageItems || []).find((x) => x?.href === "/download-documents") || {
        href: "/download-documents",
        label: "ดาวน์โหลดเอกสาร",
      };

    const about =
      (pageItems || []).find((x) => x?.href === "/about") || {
        href: "/about",
        label: "เกี่ยวกับเรา",
      };

    const article = { href: articleLink, label: "บทความ" };

    return [docs, article, about];
  }, [articleLink]);

  useEffect(() => {
    const sameRoot = (href) =>
      String(href || "").split("/")[1] === pathname.split("/")[1];

    let nextTop = "";

    if (pathname === "/" || pathname === "") nextTop = "home";
    else if ((assetsGroup.submenu || []).some((i) => sameRoot(i?.href))) {
      nextTop = "assets";
      setSubmenu("สินทรัพย์");
    } else if (
      (servicesGroup.submenu || []).some((i) => sameRoot(i?.href)) ||
      (coursesGroup.submenu || []).some((i) => sameRoot(i?.href))
    ) {
      nextTop = "services";
      setSubmenu("บริการเพิ่มเติม");
    } else if (sameRoot(faqLink)) {
      nextTop = "faq";
      setSubmenu("");
    } else if (infoItems.some((i) => sameRoot(i?.href))) {
      nextTop = "info";
      setSubmenu("ข้อมูลเพิ่มเติม");
    }

    setTopMenu(nextTop);
  }, [pathname, assetsGroup, servicesGroup, coursesGroup, infoItems, faqLink]);

  const handleActive = (link) => {
    if (link === pathname) return "menuActive";
    return "";
  };

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

      {/* ✅ บริการเพิ่มเติม (ใช้ megamenu style แบบเดิม เพื่อให้ “ประเภทบริการ” โผล่เหมือนรูป 2) */}
      <li className="megamenu_style dropitem">
        <a className="list-item" href="#">
          <span
            className={topMenu === "services" ? "title menuActive" : "title"}
          >
            บริการเพิ่มเติม
          </span>
          <span className="arrow"></span>
        </a>

        {/* ✅ 2 คอลัมน์: ซ้าย=บริการ, ขวา=คอร์สเรียน */}
        <ul className="row dropdown-megamenu sub-menu">
          {/* ซ้าย: ประเภทบริการเพิ่มเติม */}
          <li className="col mega_menu_list">
            <h4 className="title">บริการเพิ่มเติม</h4>
            <ul className="sub-menu">
              {(servicesGroup.submenu || []).map((item, idx) => (
                <li key={idx}>
                  <Link
                    className={handleActive(item.href)}
                    href={item.href || "/"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* ขวา: คอร์สเรียน */}
          <li className="col mega_menu_list">
            <h4 className="title">คอร์สเรียน</h4>
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
        </ul>
      </li>

      {/* ✅ FAQ แยกเป็นเมนูบนสุด */}
      <li className="visible_list dropitem">
        <Link className="list-item" href={faqLink}>
          <span className={topMenu === "faq" ? "title menuActive" : "title"}>
            FAQ
          </span>
        </Link>
      </li>

      {/* ข้อมูลเพิ่มเติม */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "info" ? "title menuActive" : "title"}>
            อื่นๆ
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
