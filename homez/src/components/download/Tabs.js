"use client";

const Tabs = ({ active, onChange }) => {
  return (
    <ul className="nav document-tabs gap-2 mb30">
      <li className="nav-item">
        <button
          type="button"
          className={
            active === "user"
              ? "ud-btn btn-thm"      // ปุ่มสีส้มแบบดาวน์โหลด
              : "ud-btn btn-white"    // ปุ่มเรียบ ไม่มีกรอบดำ
          }
          onClick={() => onChange("user")}
        >
          ผู้ใช้ทั่วไป
        </button>
      </li>

      <li className="nav-item">
        <button
          type="button"
          className={
            active === "agent"
              ? "ud-btn btn-thm"
              : "ud-btn btn-white"   // ปุ่มเรียบ ไม่มีกรอบ
          }
          onClick={() => onChange("agent")}
        >
          ตัวแทน / นายหน้า
        </button>
      </li>
    </ul>
  );
};

export default Tabs;
