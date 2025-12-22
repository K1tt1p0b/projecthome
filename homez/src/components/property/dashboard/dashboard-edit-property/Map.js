// Map.jsx
import React from "react";

const Map = ({ lat = 13.9869, lng = 100.6184, zoom = 14 }) => {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=${zoom}&output=embed&iwloc=near`;

  return (
    <iframe
      className="h550 w-100"
      loading="lazy"
      src={src}
      title={`Location ${lat}, ${lng}`}
      aria-label={`Location ${lat}, ${lng}`}
      style={{ border: 0 }}
    />
  );
};

export default Map;
