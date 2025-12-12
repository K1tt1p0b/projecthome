import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/home/home-v10/footer";
import ApartmentType from "@/components/home/home-v10/ApartmentType";
import WhyChoose from "@/components/home/home-v10/why-choose";
import Blog from "@/components/common/Blog";
import Link from "next/link";
import Map from "@/components/home/home-v10/Map";
import Header from "@/components/home/home-v10/Header";
import FilterWithProperties from "@/components/home/home-v10/filter-with-property";
import Explore from "@/components/common/Explore";
import FeaturedListings from "@/components/home/home-v10/FeatuerdListings";
import FunFact from "@/components/home/home-v10/FunFact";
import PropertiesByCities from "@/components/home/home-v10/PropertiesByCities";
import Testimonial from "@/components/home/home-v10/Testimonial";
import Agents from "@/components/home/home-v10/Agents";
import BannerSlider from "@/components/home/home-v10/BannerSlider";

export const metadata = {
  title: "Home v10 || Homez - Real Estate NextJS Template",
};

const Home_V10 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <Header />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Hero map finder */}
      <section className="p-0">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="home10-map">
                <Map />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Hero map finder */}

      {/* Featured Listings */}
      <section className="pb50-md bgc-f7">
        <div className="container">
          <div className="row align-items-center" data-aos="fade-up">
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">สินทรัพย์ที่นายหน้าได้ประกาศ</h2>
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-start text-lg-end mb-3">
                <Link className="ud-btn2" href="/grid-full-3-col">
                  ดูสินทรัพย์ทั้งหมด
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
          {/* End header */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-listing-slider">
                <FeaturedListings />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Featured Listings */}

      {/* Explore property-city */}
      <section className="pb50-md">
        <div className="container">
          <div
            className="row align-items-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">ตัวแทน / นายหน้า</h2>
                
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p>
              </div>
            </div>
            {/* End col-lg-9 */}

            <div className="col-lg-3">
              <div className="text-start text-lg-end mb-3">
                <Link className="ud-btn2" href="/agents">
                  ดูเอเจนต์ทั้งหมด
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
            {/* End col-lg-3 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              <div className="property-city-slider position-relative">
                <Agents />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* End Explore property-city */}


      {/* Explore Blog */}
      <section className="pt-0 pb90 pb20-md">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-9"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="main-title text-start">
                <h2 className="title">บทความ</h2>
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p>
              </div>
            </div>
            <div className="col-lg-3" data-aos="fade-up" data-aos-delay="100">
              <div className="text-start text-lg-end mb-3">
                <Link className="ud-btn2" href="/blog-list-v1">
                  ดูบทความทั้งหมด
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <Blog />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Explore Blog */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default Home_V10;
