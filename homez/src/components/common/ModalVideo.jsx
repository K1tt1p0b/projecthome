"use client";

const ModalVideo = ({ videoId, isOpen, setIsOpen, src }) => {
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div
        style={{
          ...overlayStyle,
          visibility: isOpen ? "visible" : "hidden",
          opacity: isOpen ? 1 : 0,
        }}
        onClick={closeModal}
      >
        {/* ✅ 1. ย้ายปุ่มมาไว้ตรงนี้ (นอกกล่องวิดีโอ) เพื่อให้ลอยมุมขวาบนจอ */}
        <button onClick={closeModal} style={closeButtonStyle}>
           &times; {/* ใช้สัญลักษณ์ทางคณิตศาสตร์ให้ X สวยๆ */}
        </button>

        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={responsiveIframeContainerStyle}>
            {isOpen && (
              <iframe
                src={
                  src
                    ? src
                    : `https://www.youtube.com/embed/${videoId}?autoplay=1`
                }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={iframeStyle}
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Styles

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.9)", // ดำเข้ม 90%
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999, // อยู่บนสุด
  transition: "0.4s",
};

const modalStyle = {
  position: "relative",
  width: "90%",
  maxWidth: "1100px",
  backgroundColor: "#000",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0px 20px 50px rgba(0, 0, 0, 0.5)",
  // ❌ ลบ padding/relative ออก เพื่อให้วิดีโอเต็มกรอบ
};

const closeButtonStyle = {
  // ✅ 2. ปรับสไตล์ปุ่มให้เป็นแบบลอยมุมขวาบน
  position: "absolute",
  top: "30px",    // ห่างจากขอบบนจอ
  right: "30px",  // ห่างจากขอบขวาจอ
  background: "transparent", // พื้นหลังใส
  border: "none",            // ไม่มีขอบ
  color: "#fff",             // สีขาว
  fontSize: "50px",          // ตัวใหญ่สะใจ
  fontWeight: "300",         // ตัวบางๆ ดูแพง
  cursor: "pointer",
  zIndex: 100001,            // สูงกว่าทุกอย่าง
  lineHeight: "1",
  padding: "0",
  transition: "transform 0.2s ease", // เพิ่มลูกเล่นตอนชี้เม้าส์นิดนึง
};

const responsiveIframeContainerStyle = {
  position: "relative",
  paddingBottom: "56.25%", // 16:9 aspect ratio
  height: 0,
  overflow: "hidden",
};

const iframeStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: "none",
};

export default ModalVideo;