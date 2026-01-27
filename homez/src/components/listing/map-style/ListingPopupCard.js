"use client";

import Image from "next/image";
import Link from "next/link";

// ===== helpers =====
const toFixed6 = (v) =>
  Number.isFinite(Number(v)) ? Number(v).toFixed(6) : "";

const googleMapUrl = (lat, lng) =>
  lat != null && lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${toFixed6(lat)},${toFixed6(lng)}`
      )}`
    : "";

export default function ListingPopupCard({ item }) {
  if (!item) return null;

  const beds = item?.details?.bedrooms ?? null;
  const baths = item?.details?.bathrooms ?? null;
  const usableArea = item?.details?.usableArea ?? null;

  // ✅ ดึง lat / lng จาก item (โครงสร้างที่ใช้จริงในโปรเจกต์)
  const lat = item?.location?.latitude ?? item?.lat ?? null;
  const lng = item?.location?.longitude ?? item?.lng ?? null;

  const mapsUrl = googleMapUrl(lat, lng);
  const hasMaps = !!mapsUrl;

  return (
    <div className="listing-style1 map-card">
      <div className="list-thumb small">
        <Image
          width={260}
          height={160}
          className="w-100 cover"
          src={item.imageSrc}
          alt={item.title || "listing"}
          priority={false}
        />

        <div className="list-price small">
          {item.priceText || item.price}
          {item?.listingTypes?.includes("rent") ? <span> /mo</span> : null}
        </div>
      </div>

      <div className="list-content p-2">
        <h6 className="list-title fz14 mb-1">
          <Link href={`/single-v1/${item.id}`}>{item.title}</Link>
        </h6>

        <p className="list-text fz12 mb-2">
          {(item?.location?.district || item?.location?.subdistrict || "")}
          {item?.location?.province ? ` · ${item.location.province}` : ""}
        </p>

        <div className="list-meta d-flex gap-2 fz12 mb-2">
          {beds != null && (
            <span className="map-meta-item">
              <i className="flaticon-bed" /> {beds}
            </span>
          )}
          {baths != null && (
            <span className="map-meta-item">
              <i className="flaticon-shower" /> {baths}
            </span>
          )}
          {usableArea != null && (
            <span className="map-meta-item">
              <i className="flaticon-expand" /> {usableArea}㎡
            </span>
          )}
        </div>

        {/* ✅ ปุ่ม Google Maps (เฉพาะถ้ามีพิกัด) */}
        {hasMaps && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="ud-btn btn-light"
            style={{
              width: "100%",
              padding: "6px 10px",
              fontSize: 12,
              borderRadius: 10,
              textAlign: "center",
            }}
            title="เปิดตำแหน่งนี้ใน Google Maps"
          >
            ไป Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
