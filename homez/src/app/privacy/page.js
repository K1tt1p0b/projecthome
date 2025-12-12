// ไฟล์: app/privacy/page.jsx
import Footer from "@/components/home/home-v10/footer";
import Header from "@/components/home/home-v10/Header";
import MobileMenu from "@/components/common/mobile-menu";
import PrivacyContent from "@/components/Privacy/privacycontent"; // <-- Import ไฟล์ Content เข้ามา

const Privacy = () => {
  return (
    <>
      {/* --- Global Layout --- */}
      <MobileMenu />
      <Header />

      {/* --- Breadcrumb Section (ส่วนหัวข้อ) --- */}
      <section className="breadcumb-section bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Privacy Policy</h2>
                <div className="breadcumb-list">
                  <a href="/">Home</a>
                  <a href="#">Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Main Content Section (โครงสร้างจัดหน้า) --- */}
      <section className="our-terms pt60 pb60">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              {/* เรียกใช้ Component เนื้อหา Privacy ที่นี่ */}
              <PrivacyContent /> 
            </div>
          </div>
        </div>
      </section>

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default Privacy;