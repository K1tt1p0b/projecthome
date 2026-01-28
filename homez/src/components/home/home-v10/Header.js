"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";

/**
 * Unified Site Header
 *
 * Props:
 * - loginMode: "link" | "modal"   (default: "link")
 * - showAddProperty: boolean      (default: false)
 * - addPropertyHref: string       (default: "/dashboard-add-property")
 * - enableSticky: boolean         (default: true)
 * - containerClassName: string    (default: "container maxw1600 posr menu_bdrt1")
 */
const Header = ({
  loginMode = "link",
  showAddProperty = false,
  addPropertyHref = "/dashboard-add-property",
  enableSticky = true,
  containerClassName = "container maxw1600 posr menu_bdrt1",
}) => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = useCallback(() => {
    if (!enableSticky) return;
    setNavbar(window.scrollY >= 10);
  }, [enableSticky]);

  useEffect(() => {
    if (!enableSticky) return;

    // init
    changeBackground();

    window.addEventListener("scroll", changeBackground, { passive: true });
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, [changeBackground, enableSticky]);

  const onDummyLinkClick = (e) => {
    e.preventDefault();
  };

  const isStickyOn = enableSticky && navbar;

  return (
    <>
      <header
        className={`header-nav nav-homepage-style light-header menu-home4 main-menu ${
          isStickyOn ? "sticky slideInDown animated" : ""
        }`}
      >
        <nav className="posr">
          <div className={containerClassName}>
            <div className="row align-items-center justify-content-between">
              {/* Left: Logo + MainMenu */}
              <div className="col-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos mr40">
                    <Link className="header-logo logo1" href="/">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Header Logo"
                      />
                    </Link>
                    <Link className="header-logo logo2" href="/">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Header Logo"
                      />
                    </Link>
                  </div>

                  <MainMenu />
                </div>
              </div>

              {/* Right: actions */}
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  {/* Login */}
                  {loginMode === "modal" ? (
                    <a
                      href="#"
                      onClick={onDummyLinkClick}
                      className="login-info d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#loginSignupModal"
                      role="button"
                    >
                      <i className="far fa-user-circle fz16 me-2" />
                      <span className="d-none d-xl-block">
                        เข้าสู่ระบบ/สมัคร
                      </span>
                    </a>
                  ) : (
                    <Link
                      href="/login"
                      className="login-info d-flex align-items-center"
                    >
                      <i className="far fa-user-circle fz16 me-2" />
                      <span className="d-none d-xl-block">
                        เข้าสู่ระบบ/สมัคร
                      </span>
                    </Link>
                  )}

                  {/* Add Property (optional) */}
                  {showAddProperty && (
                    <Link
                      className="ud-btn btn-white add-property bdrs60 mx-2 mx-xl-4"
                      href={addPropertyHref}
                    >
                      Add Property
                      <i className="fal fa-arrow-right-long" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
