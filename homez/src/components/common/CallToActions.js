"use client"; // 👈 1. ต้องมีบรรทัดนี้เสมอถ้าใช้ useEffect

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react"; // 👈 2. import useEffect
import AOS from "aos"; // 👈 3. import AOS
import "aos/dist/aos.css"; // 👈 4. import CSS ของ AOS

const CallToActions = () => {
  
  // 👈 5. สั่งให้ AOS ทำงานตอนโหลดหน้าเสร็จ
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <section className="our-cta pt0">
      <div className="cta-banner bgc-f7 mx-auto maxw1600 pt120 pt60-md pb120 pb60-md bdrs12 position-relative mx20-lg">
        <div className="img-box-5">
          <Image
            width={193}
            height={193}
            className="img-1 spin-right"
            src="/images/about/element-1.png"
            alt="spinner"
          />
        </div>
        <div className="img-box-6">
          <Image
            width={193}
            height={193}
            className="img-1 spin-left"
            src="/images/about/element-1.png"
            alt="spinner"
          />
        </div>
        {/* End image spinner */}

        <div className="container">
          <div className="row align-items-center">
            
            {/* 👇 แก้จุดที่ 1: ใส่ suppressHydrationWarning={true} ที่ div นี้ */}
            <div 
                className="col-lg-7 col-xl-6" 
                data-aos="fade-right"
                suppressHydrationWarning={true} 
            >
              <div className="cta-style1">
                <h2 className="cta-title">ต้องการความช่วยเหลือ? ปรึกษาผู้เชี่ยวชาญของเรา</h2>
                <p className="cta-text mb-0">
                  พูดคุยกับทีมงานมืออาชีพ หรือเลือกชมอสังหาริมทรัพย์รายการอื่นๆ เพิ่มเติม
                </p>
              </div>
            </div>
            {/* End .col-lg-7 */}

            {/* 👇 จุดที่ 2: อันนี้มีอยู่แล้ว ถูกต้องครับ */}
            <div 
                className="col-lg-5 col-xl-6" 
                data-aos="fade-left" 
                suppressHydrationWarning={true} 
            >
              <div className="cta-btns-style1 d-block d-sm-flex align-items-center justify-content-lg-end">
                <Link
                  href="/contact"
                  className="ud-btn btn-transparent mr30 mr0-xs"
                >
                  ติดต่อเรา
                  <i className="fal fa-arrow-right-long" />
                </Link>
                <Link href="/contact" className="ud-btn btn-dark">
                  <span className="flaticon-call vam pe-2" />
                  02-XXX-XXXX
                </Link>
              </div>
            </div>
            {/* End col-lg-5 */}

          </div>
          {/* End .row */}
        </div>
      </div>
    </section>
  );
};

export default CallToActions;