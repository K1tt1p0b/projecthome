import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Faq1 from "@/components/pages/faq/Faq1";
import Faq2 from "@/components/pages/faq/Faq2";

export const metadata = {
  title: "คำถามที่พบบ่อย | LandX",
};

const Faq = () => {
  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">คำถามที่พบบ่อย</h2>
                <div className="breadcumb-list">
                  <a href="#">หน้าแรก</a>
                  <a href="#">คำถามที่พบบ่อย</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="our-faq pb90 pt-0">
        <div className="container">
          <div className="row wow fadeInUp" data-wow-delay="300ms">
            <div className="col-lg-12">
              <div className="ui-content">
                <h4 className="title">คำถามเกี่ยวกับการขายที่ดิน</h4>
                <div className="accordion-style1 faq-page mb-4 mb-lg-5">
                  <Faq1 />
                </div>
              </div>

              <div className="ui-content">
                <h4 className="title">คำถามเกี่ยวกับการปล่อยเช่า / ลงประกาศ</h4>
                <div className="accordion-style1 faq-page mb-4 mb-lg-5">
                  <Faq2 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToActions />

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default Faq;
