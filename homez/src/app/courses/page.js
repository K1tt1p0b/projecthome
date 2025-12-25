import Footer from "@/components/home/home-v10/footer";
import Header from "@/components/home/home-v10/Header";
import React from "react";
import CourseLanding from "@/components/services/CourseLanding";

export const metadata = {
    title: "คอร์สเรียนอสังหาฯ | Real Estate Courses",
    description: "รวมคอร์สเรียนนายหน้าอสังหาฯ ออนไลน์ สอนโดยผู้เชี่ยวชาญ",
};

const CoursesPage = () => {
    return (
        <>
            <Header />

            <CourseLanding />
            
            <section className="footer-style1 pt60 pb-0">
                <Footer />
            </section>
        </>
    );
};

export default CoursesPage;