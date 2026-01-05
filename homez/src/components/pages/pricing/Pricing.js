"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link"; 

const Pricing = () => {
  const pricingPackages = [
    {
      packageTitle: "Starter",
      price: "ฟรี",
      pricePerMonth: "ตลอดชีพ",
      priceIcon: "/images/icon/pricing-icon-2.svg",
      features: [
        "ลงประกาศฟรี 5 รายการ",
        "ดันประกาศฟรี 1 ครั้ง/วัน",
        "หน้าเว็บส่วนตัว (Map Page)",
      ],
    },
    {
      packageTitle: "Pro Agent",
      price: "฿99",          // ราคาเดือน
      priceYearly: "฿1,080", // ราคาปี (ตาม Data)
      pricePerMonth: "/ เดือน",
      pricePerYear: "/ ปี (ตกเดือนละ 90 บ.)",
      priceIcon: "/images/icon/pricing-icon-1.svg",
      uniqueClass: "unique-class",
      features: [
        "✅ ได้รับป้าย Verified Agent",
        "ลงประกาศฟรี 10 โพส",
        "ดันทุก 5 ชม. (Auto 1 โพส)",
        "เพิ่มบริการเสริมได้ 5 ประเภท",
        "หน้าเว็บ + โดเมนส่วนตัว",
        "ระบบ Lead + ลงคอร์สได้ 5 คอร์ส",
        "แกลลอรี่ 20 รูป (เฉลี่ย 3 บ./วัน)",
      ],
    },
    {
      packageTitle: "Business",
      price: "฿159",          // ราคาเดือน
      priceYearly: "฿1,800",  // ราคาปี (ตาม Data)
      pricePerMonth: "/ เดือน",
      pricePerYear: "/ ปี (ตกเดือนละ 150 บ.)",
      priceIcon: "/images/icon/pricing-icon-3.svg",
      features: [
        "🏆 ได้รับป้าย Premium Agency",
        "ลงประกาศฟรี 30 โพส",
        "ดันทุก 3 ชม. (Auto 5 โพส)",
        "เพิ่มบริการเสริมได้ครบทุกข้อ",
        "หน้าเว็บ + โดเมนส่วนตัว",
        "ระบบ Lead + ลงคอร์สได้ 10 คอร์ส",
        "แกลลอรี่ 20 รูป (เฉลี่ย 5 บ./วัน)",
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
        {pricingPackages.map((item, index) => {
          
          // ✅ 1. คำนวณราคาที่จะแสดงและส่งไป (Refactor Logic เดิมของคุณมาไว้ตรงนี้)
          let displayPrice = item.price; // ค่าเริ่มต้น (รายเดือน)
          
          if (isYearlyBilling) {
             // Logic คำนวณราคารายปี (อิงตามโค้ดเดิมของคุณ)
             if (index === 0) displayPrice = "ฟรี";
             else if (index === 1) displayPrice = "฿5,660"; // Hardcode ตามเดิม
             else if (index === 2) displayPrice = "฿15,260"; // Hardcode ตามเดิม
             // หมายเหตุ: ถ้าอยากใช้ค่าจริงจาก Data ให้แก้เป็น displayPrice = item.priceYearly
          }

          return (
            <div className="col-md-6 col-xl-4" key={index}>
              <div className={`pricing_packages ${index === 1 ? "active" : ""}`}>
                <div className="heading mb60">
                  <h4 className={`package_title ${item.uniqueClass || ""}`}>
                    {item.packageTitle}
                  </h4>
                  
                  {/* ✅ ใช้ตัวแปร displayPrice ที่คำนวณแล้ว */}
                  <h1 className="text2">{displayPrice}</h1>
                  
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
                    {/* ✅ 2. ใส่ Link ที่ส่งข้อมูล dynamic ไปหน้าจ่ายเงิน */}
                    <Link 
                        href={{
                            pathname: '/dashboard-points/buy', // ชื่อไฟล์หน้าจ่ายเงิน
                            query: { 
                                package: item.packageTitle,
                                price: displayPrice, // ส่งราคาที่โชว์อยู่ไป
                                cycle: isYearlyBilling ? 'yearly' : 'monthly'
                            }
                        }}
                        className="ud-btn btn-thm-border text-thm"
                    >
                      สมัครสมาชิก
                      <i className="fal fa-arrow-right-long" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* End .row */}
    </>
  );
};

export default Pricing;