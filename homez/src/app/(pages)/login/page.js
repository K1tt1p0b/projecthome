import SignIn from "@/components/common/login-signup-modal/SignIn";
import Link from "next/link";

export const metadata = {
  title: "Login | Homez",
};

const Login = () => {
  return (
    <section className="our-compare pt60 pb60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="log-reg-form bgc-white p50 p30-sm default-box-shadow2 bdrs12">
              <div className="text-center mb40">
                <Link href="/" className="fw700 fz24 d-block mb10">
                  Homez
                </Link>
                <h2>เข้าสู่ระบบ</h2>
                <p className="text-muted">
                  เข้าสู่ระบบด้วยบัญชีนี้ในเว็บไซต์ต่อไปนี้
                </p>
              </div>

              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
