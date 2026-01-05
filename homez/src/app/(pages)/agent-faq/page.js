import Footer from "@/components/common/default-footer";
import DashboardHeader from "@/components/common/DashboardHeader";
import FaqAgent1 from "@/components/pages/agent-faq/Faq-agent1";
import CallToActions from "@/components/common/CallToActions";
import FaqAgent2 from "@/components/pages/agent-faq/Faq-agent2";
import Faqagent3 from "@/components/pages/agent-faq/Faq-agent3";

const Agentfaq = () => {

    return (
        <>
            <DashboardHeader />


            <div style={{ height: '88px' }}></div>
            <section className="breadcumb-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcumb-style1">
                                <h2 className="title">คำถามที่พบบ่อย</h2>
                                <div className="breadcumb-list">
                                    <a href="/dashboard-home">หน้าแรก</a>
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
                                <h4 className="title">คำถามที่พบบ่อย</h4>
                                <div className="accordion-style1 faq-page mb-4 mb-lg-5">
                                    <FaqAgent1 />
                                </div>
                            </div>

                            <div className="ui-content">
                                <h4 className="title">บัญชี & การใช้งาน</h4>
                                <div className="accordion-style1 faq-page mb-4 mb-lg-5">
                                    <FaqAgent2 />
                                </div>
                            </div>

                            <div className="ui-content">
                                <h4 className="title">การลงประกาศ & การเงิน</h4>
                                <div className="accordion-style1 faq-page mb-4 mb-lg-5">
                                    <Faqagent3 />
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
export default Agentfaq;