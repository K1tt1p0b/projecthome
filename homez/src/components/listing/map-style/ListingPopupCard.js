"use client";

import Image from "next/image";
import Link from "next/link";

export default function ListingPopupCard({ item }) {
  if (!item) return null;

  const beds = item?.details?.bedrooms ?? null;
  const baths = item?.details?.bathrooms ?? null;
  const usableArea = item?.details?.usableArea ?? null;

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

        <div className="list-meta d-flex gap-2 fz12">
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
      </div>
    </div>
  );
}
