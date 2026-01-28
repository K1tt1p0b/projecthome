import ForgotPassword from "@/components/common/login-signup-modal/ForgotPassword";
import Link from "next/link";

export const metadata = {
  title: "Forgot Password | Homez",
};

const ForgotPasswordPage = () => {
  return (
    <section className="our-compare pt60 pb60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="log-reg-form form-style1 bgc-white p50 p30-sm default-box-shadow2 bdrs12">
              <div className="text-center mb40">
                <Link href="/" className="fw700 fz24 d-block mb10">
                  LandX
                </Link>

                <h2 className="mb10">ลืมรหัสผ่าน</h2>
                <p className="text-muted">
                  โปรดกรอกอีเมลของคุณ และเราจะส่งลิงก์รีเซ็ตรหัสผ่านไปที่นั่น
                </p>
              </div>

              {/* ForgotPassword เป็น client component */}
              <ForgotPassword />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
