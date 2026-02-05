"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

const Pricing = () => {
  // Config ปุ่มตัวเลือก
  const cycles = [
    { id: "monthly", label: "รายเดือน" },
    { id: "quarterly", label: "3 เดือน" },
    { id: "semiannually", label: "6 เดือน" },
    { id: "yearly", label: "รายปี (คุ้มสุด)" },
  ];

  const [billingCycle, setBillingCycle] = useState("monthly");
  const [hoveredCycle, setHoveredCycle] = useState(null); // ✅ เพิ่ม State เช็ค Hover เอง

  const pricingPackages = [
    {
      packageTitle: "Starter",
      prices: {
        monthly: "ฟรี",
        quarterly: "ฟรี",
        semiannually: "ฟรี",
        yearly: "ฟรี",
      },
      pricePerMonth: "ตลอดชีพ",
      priceIcon: "/images/icon/pricing-icon-2.svg",
      features: [
        "Not Verified Agent",
        "ลงประกาศฟรี 12 รายการ",
        "ดันประกาศฟรี 1 ครั้ง/วัน (ต่อโพส)",
        "Map Page (แผนที่ของฉัน)",
      ],
    },
    {
      packageTitle: "Pro Agent",
      prices: {
        monthly: "฿99",
        quarterly: "฿280",
        semiannually: "฿550",
        yearly: "฿1,080",
      },
      pricePerMonth: "/ รอบบิล",
      priceIcon: "/images/icon/pricing-icon-1.svg",
      uniqueClass: "unique-class",
      features: [
        "ได้รับป้าย Pro Agent",
        "ลงประกาศฟรี 24 โพส",
        "ดันทุก 5 ชม. (Auto 1 โพส)",
        "Map Page (แผนที่ของฉัน)",
        "เพิ่มบริการเสริมได้ 5 ประเภท",
        "Microsite",
        "รองรับโดเมนส่วนตัว",
        "ลงขายคอร์สเรียนได้ 5 คอร์ส",
        "แกลเลอรี่ 20 รูป",
      ],
    },
    {
      packageTitle: "Business",
      prices: {
        monthly: "฿159",
        quarterly: "฿450",
        semiannually: "฿850",
        yearly: "฿1,800",
      },
      pricePerMonth: "/ รอบบิล",
      priceIcon: "/images/icon/pricing-icon-3.svg",
      features: [
        "ได้รับป้าย Business",
        "ลงประกาศฟรี 50 โพส",
        "ดันทุก 3 ชม. (Auto 5 โพส)",
        "Map Page (แผนที่ของฉัน)",
        "เพิ่มบริการเสริมได้ครบทุกข้อ",
        "Microsite",
        "รองรับโดเมนส่วนตัว",
        "ลงขายคอร์สเรียนได้ 10 คอร์ส",
        "แกลเลอรี่ 20 รูป",
      ],
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-lg-12">

          {/* ✅✅✅ กล่องขาว (บังคับทับแถบแดง) ✅✅✅ */}
          <div className="d-flex justify-content-center mb-5 mt-4" style={{ position: 'relative', zIndex: 1 }}>

            <div
              className="bg-white p-2 rounded-pill shadow-sm border d-inline-flex gap-2"
              style={{ backgroundColor: '#ffffff !important' }} // บังคับสีขาว
            >
              {cycles.map((cycle) => {
                const isActive = billingCycle === cycle.id;
                const isHovered = hoveredCycle === cycle.id;

                return (
                  <button
                    key={cycle.id}
                    onClick={() => setBillingCycle(cycle.id)}
                    onMouseEnter={() => setHoveredCycle(cycle.id)}
                    onMouseLeave={() => setHoveredCycle(null)}
                    // ✅ ใช้ Style กำหนดเอง ไม่พึ่ง Class Bootstrap/Theme
                    style={{
                      minWidth: '100px',
                      padding: '8px 20px',
                      borderRadius: '50px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      // Logic สีปุ่ม: ถ้าเลือก = ดำ, ถ้าชี้ = เทาอ่อน, ปกติ = ขาว
                      backgroundColor: isActive ? '#111' : isHovered ? '#f0f0f0' : '#fff',
                      color: isActive ? '#fff' : '#666',
                      boxShadow: 'none' // ลบเงาที่อาจจะติดมา
                    }}
                  >
                    {cycle.label}
                  </button>
                )
              })}
            </div>

          </div>
          {/* ✅✅✅ จบส่วนแก้ไข ✅✅✅ */}

        </div>
      </div>

      <div className="row" data-aos="fade-up" data-aos-delay="300">
        {pricingPackages.map((item, index) => {

          const displayPrice = item.prices[billingCycle];
          const cycleLabel = cycles.find(c => c.id === billingCycle)?.label;

          return (
            <div className="col-md-6 col-xl-4" key={index}>
              <div className={`pricing_packages h-100 d-flex flex-column ${index === 1 ? "active" : ""}`}>
                <div className="heading mb60">
                  <h4 className={`package_title ${item.uniqueClass || ""}`}>
                    {item.packageTitle}
                  </h4>

                  <h1 className="text2">{displayPrice}</h1>

                  <p className="text">
                    {index === 0 ? "ตลอดชีพ" : `จ่าย${cycleLabel}`}
                  </p>

                  <Image
                    width={70}
                    height={70}
                    className="price-icon"
                    src={item.priceIcon}
                    alt="icon"
                  />
                </div>

                <div className="details flex-grow-1 d-flex flex-column">
                  <p className="text mb35">{item.features[0]}</p>

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

                  <div className="d-grid mt-auto">
                    <Link
                      href={{
                        pathname: '/dashboard-points/buy',
                        query: {
                          package: item.packageTitle,
                          price: displayPrice,
                          cycle: cycleLabel,
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
    </>
  );
};

export default Pricing;