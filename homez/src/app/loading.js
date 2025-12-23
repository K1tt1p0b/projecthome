"use client";
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      
      {/* CSS แบบบ้านๆ แต่อยากให้สวยใช้ Tailwind ก็ได้ครับ */}
      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh; /* เต็มจอ */
          width: 100%;
          background-color: #ffffff; /* หรือสีพื้นหลังเว็บคุณ */
          z-index: 9999;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #eb6753; /* สีส้มธีมคุณ */
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}