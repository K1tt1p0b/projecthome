
import Footer from "@/components/home/home-v10/footer";
import Header from "@/components/home/home-v10/Header";
import MobileMenu from "@/components/common/mobile-menu";
import Image from "next/image";
import ConstructionRequest from "@/components/services/ConstructionRequest"; // Import มาใช้

export const metadata = {
    title: "บริการงานก่อสร้าง | Your Website Name",
    description: "ประเมินราคางานถมที่ รั้ว และต่อเติมบ้าน ฟรี",
};

const ServicePage = () => {
    return (
        <>
            <MobileMenu />
            <Header />
            {/* 🛠️ ส่วนที่ 1: Hero Banner (แก้หน้าโล่งด้วยรูปใหญ่ๆ) */}
            <section
                className="hero-service-section position-relative d-flex align-items-center justify-content-center"
                style={{
                    height: '400px',
                    background: 'url(/images/about/1.jpg) center center/cover no-repeat', // หารูปงานก่อสร้างสวยๆ มาใส่ตรงนี้
                }}
            >
                {/* Overlay สีดำจางๆ เพื่อให้อ่านตัวหนังสือออก */}
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

                <div className="container position-relative z-1 text-center text-white">
                    <h1 className="text-white fw700 fz50 mb20">บริการงานช่างและก่อสร้าง</h1>
                    <p className="fz18 text-white-50">
                        ดูแลโดยทีมวิศวกรและช่างมืออาชีพ มาตรฐานสูง งบไม่บานปลาย
                    </p>
                </div>
            </section>

            {/* 🛠️ ส่วนที่ 2: ขั้นตอนการทำงาน (How it works) - เพิ่มความมั่นใจ */}
            <section className="pt80 pb50 bgc-f7">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <div className="main-title text-center">
                                <h2>ขั้นตอนการใช้บริการ</h2>
                                <p>ง่ายๆ สะดวก และตรวจสอบได้ทุกขั้นตอน</p>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">

                        {/* Step 1: ไอคอนแว่นขยาย */}
                        <div className="col-sm-6 col-lg-4">
                            <div className="iconbox-style1 text-center">
                                <div
                                    className="icon"
                                    // ✅ เพิ่ม Style ชุดนี้เพื่อจัดกึ่งกลางและล็อคขนาดวงกลม
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '90px',      // กำหนดความกว้างวงกลม (ปรับเลขได้)
                                        height: '90px',     // กำหนดความสูง (ต้องเท่าความกว้างถึงจะกลม)
                                        margin: '0 auto',   // จัดตัววงกลมให้อยู่กลางกล่อง
                                        padding: 0          // ลบ padding เดิมของธีมออกเพื่อไม่ให้เบี้ยว
                                    }}
                                >
                                    <i
                                        className="fas fa-search text-thm"
                                        // ✅ ปรับขนาดไอคอนให้พอดี (ประมาณ 40% ของวงกลมกำลังสวย)
                                        style={{ fontSize: '32px' }}
                                    ></i>
                                </div>
                                <div className="details mt20">
                                    <h4 className="title">1. เลือกบริการ & ส่งข้อมูล</h4>
                                    <p className="text">เลือกประเภทงานที่ต้องการ และกรอกรายละเอียดเบื้องต้นผ่านหน้าเว็บ</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: ไอคอนแชท */}
                        <div className="col-sm-6 col-lg-4">
                            <div className="iconbox-style1 text-center">
                                <div
                                    className="icon"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '90px',
                                        height: '90px',
                                        margin: '0 auto',
                                        padding: 0
                                    }}
                                >
                                    <i
                                        className="fas fa-comments text-thm"
                                        style={{ fontSize: '32px' }} // ขนาดเท่ากันทุกอัน
                                    ></i>
                                </div>
                                <div className="details mt20">
                                    <h4 className="title">2. เจ้าหน้าที่ติดต่อกลับ</h4>
                                    <p className="text">ทีมงานจะติดต่อเพื่อประเมินหน้างาน และเสนอราคาภายใน 24 ชม.</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: ไอคอนบ้าน (ที่เคยหายไป) */}
                        <div className="col-sm-6 col-lg-4">
                            <div className="iconbox-style1 text-center">
                                <div
                                    className="icon"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '90px',
                                        height: '90px',
                                        margin: '0 auto',
                                        padding: 0
                                    }}
                                >
                                    {/* ใช้ fas fa-home แทน flaticon เพื่อความชัวร์ */}
                                    <i
                                        className="fas fa-home text-thm"
                                        style={{ fontSize: '32px' }}
                                    ></i>
                                </div>
                                <div className="details mt20">
                                    <h4 className="title">3. เริ่มดำเนินงาน</h4>
                                    <p className="text">ทำสัญญาและเริ่มงานทันที ควบคุมงานโดยวิศวกรมืออาชีพ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🛠️ ส่วนที่ 3: แบบฟอร์ม (พระเอกของเรา) */}
            <section className="our-service pb90 pt90">
                {/* เรียกใช้ Component ฟอร์มเดิมที่คุณมี */}
                <ConstructionRequest />
            </section>

            {/* 🛠️ ส่วนที่ 4: ตัวอย่างผลงาน (Portfolio) - ปิดท้ายความมั่นใจ */}
            <section className="pb90 bg-white">
                <div className="container">
                    <div className="row mb30">
                        <div className="col-lg-12">
                            <div className="main-title text-center">
                                <h2>ผลงานที่ผ่านมาของเรา</h2>
                                <p>ความไว้วางใจจากลูกค้ากว่า 100+ ราย</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* รูปที่ 1 */}
                        <div className="col-md-4 mb30">
                            <div className="listing-style1">
                                <div className="list-thumb">
                                    {/* หารูปงานจริงมาใส่ หรือใช้รูป Placeholer */}
                                    <Image
                                        width={400} height={300}
                                        className="w-100 h-100 object-fit-cover rounded"
                                        src="" // เปลี่ยน path รูปให้ถูกต้อง
                                        alt="งานถมที่ดิน"
                                    />
                                </div>
                                <div className="list-content text-center pt-3">
                                    <h6 className="list-title">งานถมที่ดิน ปทุมธานี (5 ไร่)</h6>
                                </div>
                            </div>
                        </div>
                        {/* รูปที่ 2 */}
                        <div className="col-md-4 mb30">
                            <div className="listing-style1">
                                <div className="list-thumb">
                                    <Image
                                        width={400} height={300}
                                        className="w-100 h-100 object-fit-cover rounded"
                                        src="/images/listings/g1-2.jpg"
                                        alt="งานล้อมรั้ว"
                                    />
                                </div>
                                <div className="list-content text-center pt-3">
                                    <h6 className="list-title">งานล้อมรั้วคอนกรีต บางนา</h6>
                                </div>
                            </div>
                        </div>
                        {/* รูปที่ 3 */}
                        <div className="col-md-4 mb30">
                            <div className="listing-style1">
                                <div className="list-thumb">
                                    <Image
                                        width={400} height={300}
                                        className="w-100 h-100 object-fit-cover rounded"
                                        src="/images/listings/g1-3.jpg"
                                        alt="งานต่อเติมครัว"
                                    />
                                </div>
                                <div className="list-content text-center pt-3">
                                    <h6 className="list-title">งานต่อเติมครัวหลังบ้าน พระราม 2</h6>
                                </div>
                            </div>
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

export default ServicePage;