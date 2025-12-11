import React from "react";
import packageData from "./packageData.json"; // หรือ path ตามที่เก็บจริง

const PackageDataTable = () => {
  return (
    <table className="table-style3 table">
      <thead className="t-head">
        <tr>
          <th scope="col">แพ็กเกจปัจจุบัน</th>
          <th scope="col">ลงประกาศได้อีก</th>
          <th scope="col">โควตาประกาศแนะนำ</th>
          <th scope="col">สิทธิ์ต่ออายุ</th>
          <th scope="col">พื้นที่จัดเก็บ</th>
          <th scope="col">วันหมดอายุ</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {packageData.map((packageItem, index) => (
          <tr key={index}>
            <th scope="row">{packageItem.type}</th>
            <td>{packageItem.propertiesRemaining}</td>
            <td>{packageItem.featuredRemaining}</td>
            <td>{packageItem.renewalRemaining}</td>
            <td>{packageItem.storageSpace}</td>
            <td>{packageItem.expiryDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PackageDataTable;
