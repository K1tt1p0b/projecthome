import Header from "@/components/home/home-v10/Header";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";

import FormContact from "@/components/property/FormContact";
import InfoWithForm from "@/components/property/property-single-style/common/more-info";
import OverView from "@/components/property/property-single-style/common/OverView";
import PropertyAddress from "@/components/property/property-single-style/single-v5/PropertyAddress";
import PropertyDetails from "@/components/property/property-single-style/single-v5/PropertyDetails";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyHeader from "@/components/property/property-single-style/single-v5/PropertyHeader";
import PropertyVideo from "@/components/property/property-single-style/common/PropertyVideo";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
import PropertyGallery from "@/components/property/property-single-style/single-v5/property-gallery";

// ✅ เพิ่มตัวนี้
import PropertyImage from "@/components/property/property-single-style/common/PropertyImage";

// ✅ 1. Import Widget เข้ามา
import CoBrokeSidebar from "@/components/property/CoBrokeSidebar";

export const metadata = {
  title: "Property Single V5 || Homez - Real Estate NextJS Template",
};

const SingleV5 = async (props) => {
  const params = await props.params;
  const id = params.id;

  // 🔥🔥🔥 MOCK DATA: สร้างข้อมูลจำลองตรงนี้เลย ไม่กระทบไฟล์อื่น 🔥🔥🔥
  const allMockData = [
    {
      id: 1,
      title: "บ้านเดี่ยวสไตล์คันทรี (Mock)",
      price: 14000000,

      // ✅✅ ค่า Co-Broke ที่ต้องการเทส ✅✅
      acceptCoBroke: true,       // เปิดรับ
      commissionType: "percent", // เปอร์เซ็นต์
      commissionValue: 10,       // 3%
    },
    {
      id: 2,
      title: "วิลล่าหรู (Mock)",
      price: 28000000,

      acceptCoBroke: true,
      commissionType: "amount",
      commissionValue: 50000,
    },
  ];

  // ✅ ดึงข้อมูลจาก Mock (ถ้าหาไม่เจอ ให้ใช้ตัวแรกเป็น Default)
  const data =
    allMockData.find((item) => String(item.id) === String(id)) || allMockData[0];

  return (
    <>
      <Header />
      <MobileMenu />

      <section className="p-0 bgc-white">
        {/* Gallery ยังใช้ id เดิมไปก่อน */}
        <PropertyGallery id={id} />
      </section>

      <section className="pt30 pb90 bgc-f7">
        <div className="container">
          <div className="row sp-v5-property-details">
            <PropertyHeader id={id} />
          </div>

          <div className="row mt50 mt30-lg">
            {/* ================================================= */}
            {/* 🟢 ฝั่งซ้าย */}
            {/* ================================================= */}
            <div className="col-lg-6">
              {/* Description & Details */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">รายละเอียด</h4>
                <ProperytyDescriptions />

                <h4 className="title fz17 mb30 mt50">ข้อมูลเพิ่มเติม</h4>
                <div className="row">
                  <PropertyDetails id={id} />
                </div>
              </div>

              {/* Overview */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">ภาพรวม</h4>
                <div className="row">
                  <OverView id={id} />
                </div>
              </div>

              {/* Features */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">สิ่งอำนวยความสะดวก</h4>
                <div className="row">
                  <PropertyFeaturesAminites />
                </div>
              </div>

              {/* Video */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">วิดีโอแนะนำ</h4>
                <div className="row">
                  <PropertyVideo />
                </div>
              </div>

              {/* ✅ Images (ใต้ Video) */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">รูปภาพทรัพย์สิน</h4>
                <div className="row">
                  <PropertyImage />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* 🟢 ฝั่งขวา (Sidebar) */}
            {/* ================================================= */}
            <div className="col-lg-6">
              <div className="column">
                {/* ✅✅ 2. ส่ง Mock Data เข้าไปใน Widget ✅✅ */}
                <div className="mb30">
                  <CoBrokeSidebar property={data} />
                </div>

                {/* ===== Address / Map ===== */}
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">ที่ตั้ง</h4>
                  <div className="row">
                    <PropertyAddress />
                  </div>
                </div>

                {/* ===== ของเดิม ===== */}
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">ติดต่อสอบถาม</h4>
                  <InfoWithForm />
                </div>

                {/* ===== Contact Form ===== */}
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">ติดต่อผู้ประกาศ</h4>
                  <FormContact />
                </div>
              </div>
            </div>
            {/* End Right Column */}
          </div>
        </div>
      </section>

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default SingleV5;