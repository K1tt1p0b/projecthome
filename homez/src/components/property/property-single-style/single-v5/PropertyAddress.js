import ListingMap1 from "@/components/listing/map-style/ListingMap1";
import React from "react";

const PropertyAddress = () => {
  const addressData = {
    address: "10425 ถนนสุขุมวิท",
    city: "เขตวัฒนา",
    state: "กรุงเทพมหานคร",
    zipCode: "10110",
    country: "ไทย",
  };

  const propertyLat = 13.7309;
  const propertyLng = 100.5696;

  const popupData = {
    title: "ตำแหน่งทรัพย์สิน",
    subtitle: `${addressData.city}, ${addressData.state}`,
    extraLines: [
      addressData.address,
      `รหัสไปรษณีย์ ${addressData.zipCode} · ${addressData.country}`,
    ],
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">ที่อยู่</span>
              <span className="text-black">{addressData.address}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">อำเภอ/เขต</span>
              <span className="text-black">{addressData.city}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">จังหวัด</span>
              <span className="text-black">{addressData.state}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">รหัสไปรษณีย์</span>
              <span className="text-black">{addressData.zipCode}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span className="fw600 dark-color">ประเทศ</span>
              <span className="text-black">{addressData.country}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 h-500 mt30" style={{ height: "400px" }}>
        <ListingMap1
          lat={propertyLat}
          lng={propertyLng}
          zoom={16}
          height={400}
          displayOnly={true}
          hideAttribution={true}
          enableSearch={false}
          showOverlay={false}
          enableGPS={false}
          enableNearMe={false}
          markerPopupData={popupData}
          scrollWheelZoom={true}
        />
      </div>
    </>
  );
};

export default PropertyAddress;
