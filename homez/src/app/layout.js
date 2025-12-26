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


//  Thai font (Prompt) - ผูกกับ variable ของธีมเดิม
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
        <div className="wrapper ovh">{children}</div>

        <ScrollToTop />

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
