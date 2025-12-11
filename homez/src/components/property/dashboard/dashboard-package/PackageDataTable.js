import React from "react";
import Link from "next/link";
import pointHistoryData from "./pointHistory.json";

const PointHistoryTable = () => {
  const history = pointHistoryData.history || pointHistoryData;

  // ถ้า JSON มี pointsBalance ให้ใช้, ถ้าไม่ให้ใช้ balanceAfter ของรายการแรก
  const pointsBalance =
    pointHistoryData.pointsBalance ??
    (history.length > 0 ? history[0].balanceAfter : 0);

  return (
    <div>
      {/* ปุ่มไปหน้าเติมพอยต์ */}
      <div className="d-flex justify-content-end mb-3">
        <Link href="/dashboard-points" className="ud-btn btn-thm">
          เติม/จัดการพอยต์
          <i className="fal fa-arrow-right-long" />
        </Link>
      </div>

      {/* การ์ดแสดงพอยต์คงเหลือ */}
      <div className="ps-widget bgc-white bdrs12 p20 mb20 default-box-shadow2">
        <h4 className="fw600 mb5">พอยต์คงเหลือปัจจุบัน</h4>
        <div className="d-inline-block px-3 py-2 bgc-f7 bdrs12 fw600 text-thm">
          ⭐ {pointsBalance.toLocaleString()} พอยต์
        </div>
      </div>

      {/* ตารางประวัติพอยต์ */}
      <table className="table-style3 table">
        <thead className="t-head">
          <tr>
            <th scope="col">วันที่</th>
            <th scope="col">รายการ</th>
            <th scope="col">รายละเอียด</th>
            <th scope="col">พอยต์ที่เปลี่ยนแปลง</th>
            <th scope="col">พอยต์คงเหลือหลังรายการ</th>
            <th scope="col">หมายเหตุ</th>
          </tr>
        </thead>

        <tbody className="t-body">
          {history.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.type}</td>
              <td>{item.detail}</td>

              {/* สีเขียว = เพิ่มพอยต์ / สีแดง = ลดพอยต์ */}
              <td
                style={{
                  color: item.pointsChange > 0 ? "green" : "red",
                  fontWeight: 600,
                }}
              >
                {item.pointsChange > 0
                  ? `+${item.pointsChange}`
                  : item.pointsChange}
              </td>

              <td>{item.balanceAfter}</td>
              <td>{item.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointHistoryTable;
