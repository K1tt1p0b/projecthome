import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import EnergyClass from "@/components/property/property-single-style/common/EnergyClass";
import FloorPlans from "@/components/property/property-single-style/common/FloorPlans";
import InfoWithForm from "@/components/property/property-single-style/common/more-info";
import NearbySimilarProperty from "@/components/property/property-single-style/common/NearbySimilarProperty";
import OverView from "@/components/property/property-single-style/common/OverView";
import PropertyAddress from "@/components/property/property-single-style/single-v5/PropertyAddress";
import PropertyDetails from "@/components/property/property-single-style/single-v5/PropertyDetails";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyHeader from "@/components/property/property-single-style/single-v5/PropertyHeader";
import PropertyNearby from "@/components/property/property-single-style/common/PropertyNearby";
import PropertyVideo from "@/components/property/property-single-style/common/PropertyVideo";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
import PropertyGallery from "@/components/property/property-single-style/single-v5/property-gallery";

export const metadata = {
  title: "Property Single V5 || Homez - Real Estate NextJS Template",
};

const SingleV5 = async props => {
  const params = await props.params;
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Top Gallery */}
      <section className="p-0 bgc-white">
        <PropertyGallery id={params.id} />
      </section>

      {/* Property Content */}
      <section className="pt30 pb90 bgc-f7">
        <div className="container">

          {/* Header */}
          <div className="row sp-v5-property-details">
            <PropertyHeader id={params.id} />
          </div>

          {/* ✅ เอา gx-5 ออก เพื่อคืนพื้นที่ให้คอลัมน์ */}
          <div className="row mt50 mt30-lg">

            {/* ================================================= */}
            {/* 🟢 ฝั่งซ้าย: ปรับลดเหลือ col-lg-7 (เพื่อให้ฝั่งขวาขยายได้) */}
            {/* ================================================= */}
            <div className="col-lg-6"> 

              {/* Overview */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Overview</h4>
                <div className="row">
                  <OverView id={params.id} />
                </div>
              </div>

              {/* Description & Details */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Property Description</h4>
                <ProperytyDescriptions />

                <h4 className="title fz17 mb30 mt50">Property Details</h4>
                <div className="row">
                  <PropertyDetails id={params.id} />
                </div>
              </div>

              {/* Features */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Features &amp; Amenities</h4>
                <div className="row">
                  <PropertyFeaturesAminites />
                </div>
              </div>

              {/* Video Only */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Property Video</h4>
                <div className="row">
                  <PropertyVideo />
                </div>
              </div>

            </div>
            {/* ปิด col-lg-7 */}


            {/* ================================================= */}
            {/* 🟢 ฝั่งขวา: ขยายเป็น col-lg-5 (กว้างขึ้น ใส่รูป Agent ได้สบาย) */}
            {/* ================================================= */}
            <div className="col-lg-6"> 
              <div className="column">

                {/* Address (Map) */}
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">Address</h4>
                  <div className="row">
                    <PropertyAddress />
                  </div>
                </div>

                {/* Agent Profile (ตัวปัญหาที่กินที่เยอะ) */}
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">Get More Information</h4>
                  <InfoWithForm />
                </div>

                {/* Nearby */}
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">What&apos;s Nearby?</h4>
                  <div className="row">
                    <PropertyNearby />
                  </div>
                </div>

              </div>
            </div>
            {/* End Right Column */}

          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>

      {/* Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>

    </>
  );
};

export default SingleV5;