import ResetPassword from "@/components/common/login-signup-modal/ResetPassword";
import Link from "next/link";

export const metadata = {
  title: "Reset Password | Homez",
};

const ResetPasswordPage = () => {
  return (
    <section className="our-compare pt60 pb60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="log-reg-form form-style1 bgc-white p50 p30-sm default-box-shadow2 bdrs12">
              {/* Header */}
              <div className="text-center mb40">
                <Link href="/" className="fw700 fz24 d-block mb10">
                  LandX
                </Link>

                <h2 className="mb10">รีเซ็ตรหัสผ่าน</h2>
                <p className="text-muted">
                  ตั้งรหัสผ่านใหม่เพื่อเข้าสู่ระบบ
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
