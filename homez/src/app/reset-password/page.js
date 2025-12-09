import ResetPassword from "@/components/common/login-signup-modal/ResetPassword";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Reset Password || LandX",
};

const ResetPasswordPage = () => {
  return (
    <section className="our-compare pt60 pb60">
      {/* icon พื้นหลัง เหมือนหน้า login/register */}
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
              {/* Header */}
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
                <h2 className="mb10">Reset Password</h2>
                <p className="text">
                  Please set your new password to access your account.
                </p>
              </div>

              {/* ฟอร์ม Reset Password */}
              <ResetPassword />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
