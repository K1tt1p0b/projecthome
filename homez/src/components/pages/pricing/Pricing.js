"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link"; // เปลี่ยนจาก a เป็น Link เพื่อประสิทธิภาพที่ดีกว่า

const Pricing = () => {
  const pricingPackages = [
    {
      packageTitle: "Starter",
      price: "ฟรี",
      pricePerMonth: "ตลอดชีพ",
      priceIcon: "/images/icon/pricing-icon-2.svg",
      features: [
        "ลงประกาศฟรี 1 รายการ",
        "อัปโหลดรูปได้ 5 รูป/ประกาศ",
        "ระบบจัดการประกาศพื้นฐาน",
        "ไม่มีป้าย Verified",
        "ไม่มีเครดิตพอยต์รายเดือน",
        "การสนับสนุนทางอีเมล",
      ],
    },
    {
      packageTitle: "Pro Agent",
      price: "฿590",
      pricePerMonth: "/ เดือน",
      priceIcon: "/images/icon/pricing-icon-1.svg",
      uniqueClass: "unique-class", // คง class เดิมไว้ตามเทมเพลต
      features: [
        "รับทันที 800 พอยต์/เดือน",
        "✅ ได้รับป้าย Verified Agent",
        "อัปโหลดรูปได้ 15 รูป/ประกาศ",
        "ดันประกาศฟรี 1 ครั้ง/วัน",
        "ส่วนลดซื้อพอยต์เพิ่ม 10%",
        "การสนับสนุนแบบ Priority (ตอบไว)",
      ],
    },
    {
      packageTitle: "Business",
      price: "฿1,590",
      pricePerMonth: "/ เดือน",
      priceIcon: "/images/icon/pricing-icon-3.svg",
      features: [
        "รับทันที 2,500 พอยต์/เดือน",
        "🏆 ได้รับป้าย Premium Agency",
        "อัปโหลดรูปไม่จำกัด",
        "ดันประกาศฟรี 3 ครั้ง/วัน",
        "ดูเบอร์โทรลูกค้าที่กดสนใจได้",
        "ผู้ดูแลบัญชีส่วนตัว (Account Manager)",
      ],
    },
  ];

  const [isYearlyBilling, setIsYearlyBilling] = useState(false);

  const handleBillingToggle = () => {
    setIsYearlyBilling((prevIsYearlyBilling) => !prevIsYearlyBilling);
  };

  return (
    <>
      <div className="row" data-aos="fade-up" data-aos-delay="200">
        <div className="col-lg-12">
          <div className="pricing_packages_top d-flex align-items-center justify-content-center mb60">
            <div className="toggle-btn">
              <span className="pricing_save1 ff-heading">จ่ายรายเดือน</span>
              <label className="switch">
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={isYearlyBilling}
                  onChange={handleBillingToggle}
                />
                <span className="pricing_table_switch_slide round" />
              </label>
              <span className="pricing_save2 ff-heading">จ่ายรายปี</span>
              <span className="pricing_save3">ลด 20%</span>
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}

      <div className="row" data-aos="fade-up" data-aos-delay="300">
        {pricingPackages.map((item, index) => (
          <div className="col-md-6 col-xl-4" key={index}>
            <div className={`pricing_packages ${index === 1 ? "active" : ""}`}>
              <div className="heading mb60">
                <h4 className={`package_title ${item.uniqueClass || ""}`}>
                  {item.packageTitle}
                </h4>
                <h1 className="text2">
                  {isYearlyBilling
                    ? index === 0
                      ? "ฟรี" // ตัวแรก (Starter)
                      : index === 1
                      ? "฿5,660" // ตัวที่สอง (Pro Agent รายปี)
                      : "฿15,260" // ตัวที่สาม (Business รายปี)
                    : item.price}
                </h1>
                <p className="text">
                    {isYearlyBilling && index !== 0 ? "/ ปี" : item.pricePerMonth}
                </p>
                <Image
                  width={70}
                  height={70}
                  className="price-icon"
                  src={item.priceIcon}
                  alt="icon"
                />
              </div>
              <div className="details">
                <p className="text mb35">
                  {item.features[0]} {/* Display the first feature */}
                </p>
                <div className="list-style1 mb40">
                  <ul>
                    {item.features.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <i className="far fa-check text-white bgc-dark fz15" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-grid">
                  <Link href="/register" className="ud-btn btn-thm-border text-thm">
                    สมัครสมาชิก
                    <i className="fal fa-arrow-right-long" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* End .row */}
    </>
  );
};

export default Pricing;