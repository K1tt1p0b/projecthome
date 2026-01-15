"use client";
import ScrollToTop from "@/components/common/ScrollTop";
import Aos from "aos";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "aos/dist/aos.css";
import "../../public/scss/main.scss";
import "rc-slider/assets/index.css";
import { Prompt } from "next/font/google";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

// Thai font (Prompt)
const promptBody = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--body-font-family",
  display: "swap",
});

const promptTitle = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--title-font-family",
  display: "swap",
});

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") import("bootstrap");
  }, []);

  useEffect(() => {
    Aos.init({ duration: 1200, once: true });
  }, []);

  return (
    <html lang="th">
      <body
        className={`body ${promptBody.variable} ${promptTitle.variable}`}
        cz-shortcut-listen="false"
      >
        {/* ✅ Fix: ธีมบางตัวให้ wrapper/section padding แปลก ๆ */}
        <style jsx global>{`
          /* Toastify root เป็น <section class="Toastify"> */
          section.Toastify {
            padding: 0 !important;
            margin: 0 !important;
            height: 0 !important; /* กันมันดันความสูงหน้า */
            min-height: 0 !important;
          }

          /* container ของ toast จริง ๆ */
          .Toastify__toast-container {
            padding: 0 !important;
            margin: 0 !important;
          }

          /* กัน rule global ของธีมที่เล่นกับ section ทั่วไป */
          section.Toastify * {
            box-sizing: border-box;
          }
        `}</style>

        <div className="wrapper ovh">{children}</div>

        <ScrollToTop />

        {/* ✅ ใช้ ToastContainer ตามปกติ ไม่ต้องไป override position เอง */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
