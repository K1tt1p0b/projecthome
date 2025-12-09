import ForgotPassword from "@/components/common/login-signup-modal/ForgotPassword";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Forgot Password || LandX",
};

const ForgotPasswordPage = () => {
  return (
    <section className="our-compare pt60 pb60">
      <Image
        width={1012}
        height={519}
        src="/images/icon/login-page-icon.svg"
        alt="logo"
        className="login-bg-icon contain"
        data-aos="fade-right"
        data-aos-delay="300"
      />

      <div className="container">
        <div className="row" data-aos="fade-left" data-aos-delay="300">
          <div className="col-lg-6">
            <div className="log-reg-form form-style1 bgc-white p50 p30-sm default-box-shadow2 bdrs12">

              <div className="text-center mb40">
                <Link href="/">
                  <Image
                    width={138}
                    height={44}
                    className="mb25"
                    src="/images/header-logo2.svg"
                    alt="logo"
                  />
                </Link>
                <h2 className="mb10">Forgot Password</h2>
                <p className="text">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* ForgotPassword เป็น client component ได้ */}
              <ForgotPassword />

            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ForgotPasswordPage;
