import React from "react";

const PropertyFeaturesAminites = () => {
  const featuresAmenitiesData = [
    ["เครื่องปรับอากาศ", "เตาบาร์บีคิว", "เครื่องอบผ้า", "ฟิตเนส"],
    ["สนามหญ้า", "ไมโครเวฟ", "ฝักบัวกลางแจ้ง", "ตู้เย็น"],
    ["สระว่ายน้ำ", "เคเบิลทีวี", "เครื่องซักผ้า", "WiFi 6"],
  ];

  return (
    <>
      {featuresAmenitiesData.map((row, rowIndex) => (
        <div key={rowIndex} className="col-sm-6 col-md-4">
          <div className="pd-list">
            {row.map((item, index) => (
              <p key={index} className="text mb10">
                <i className="fas fa-circle fz6 align-middle pe-2" />
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyFeaturesAminites;
