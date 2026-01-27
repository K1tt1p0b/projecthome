"use client";

import React, { useMemo } from "react";

export default function MarkerPopupCard({
  title,
  subtitle,
  extraLines = [],
  lat,
  lng,
  buttonText = "เปิดใน Google Maps",
}) {
  const mapsUrl = useMemo(() => {
    const la = Number(lat);
    const lo = Number(lng);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
    return `https://www.google.com/maps?q=${la},${lo}`;
  }, [lat, lng]);

  return (
    <div style={{ minWidth: 220, maxWidth: 300 }}>
      {title ? (
        <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
          {title}
        </div>
      ) : null}

      {subtitle ? (
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
          {subtitle}
        </div>
      ) : null}

      {Array.isArray(extraLines) && extraLines.length > 0 ? (
        <div style={{ fontSize: 12, marginBottom: 10 }}>
          {extraLines.map((t, i) => (
            <div key={i} style={{ opacity: 0.85 }}>
              {t}
            </div>
          ))}
        </div>
      ) : null}

      {(lat != null && lng != null) ? (
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            padding: "6px 8px",
            borderRadius: 10,
            background: "#f6f7f8",
            border: "1px solid #eee",
            marginBottom: 10,
          }}
          title={`${lat}, ${lng}`}
        >
          {String(lat)}, {String(lng)}
        </div>
      ) : null}

      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="ud-btn btn-thm"
          style={{
            width: "100%",
            textAlign: "center",
            padding: "9px 10px",
            borderRadius: 12,
            fontSize: 12,
            display: "inline-block",
          }}
        >
          {buttonText}
        </a>
      ) : null}
    </div>
  );
}
