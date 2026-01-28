"use client";

import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/listings/list-1.jpg";

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getImageSrc(listing) {
  const legacy = listing?.image;
  const modern =
    listing?.imageSrc || (Array.isArray(listing?.gallery) ? listing.gallery[0] : null);
  const src = modern || legacy;
  if (!src || String(src).trim() === "") return FALLBACK_IMAGE;
  return src;
}

function getLocationText(listing) {
  const loc = listing?.location;
  if (typeof loc === "string") return loc || "—";

  const fullText = loc?.fullText;
  if (typeof fullText === "string" && fullText.trim()) return fullText;

  const composed = [loc?.address, loc?.district, loc?.province]
    .filter(Boolean)
    .join(" ");
  return composed || "—";
}

function getBedsBathSqft(listing) {
  const bedModern = listing?.details?.bedrooms;
  const bathModern = listing?.details?.bathrooms;
  const sqftModern = listing?.details?.usableArea;

  return {
    bed: toNumber(bedModern, 0),
    bath: toNumber(bathModern, 0),
    sqft: toNumber(sqftModern, 0),
  };
}

function getPriceText(listing) {
  const p = listing?.price;
  if (typeof p === "string" && p.trim()) return p;
  if (listing?.priceText) return `฿${listing.priceText}`;
  const n = toNumber(listing?.price, 0);
  return `฿${n.toLocaleString()}`;
}

function isForRent(listing) {
  if (typeof listing?.forRent === "boolean") return listing.forRent;
  const types = listing?.listingTypes;
  if (Array.isArray(types)) return types.includes("rent");
  return false;
}

function getForWhatLabel(listing) {
  return isForRent(listing) ? "ให้เช่า" : "ขาย";
}

// ===== Google Maps helpers =====
const toFixed6 = (v) => (Number.isFinite(Number(v)) ? Number(v).toFixed(6) : "");

function getLatLng(listing) {
  // รองรับหลายโครงสร้าง
  const lat = listing?.location?.latitude ?? listing?.lat ?? listing?.latitude ?? null;
  const lng = listing?.location?.longitude ?? listing?.lng ?? listing?.longitude ?? null;

  const la = Number(lat);
  const lo = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;

  return { lat: la, lng: lo };
}

function buildGoogleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${toFixed6(lat)},${toFixed6(lng)}`
  )}`;
}

export default function FeaturedListings({ data = [], colstyle, activeIds = [] }) {
  const safeData = Array.isArray(data) ? data : [];
  const isList = !!colstyle;
  const activeSet = new Set((activeIds || []).map(String));

  return (
    <>
      {safeData.map((listing) => {
        const imgSrc = getImageSrc(listing);
        const locText = getLocationText(listing);
        const { bed, bath, sqft } = getBedsBathSqft(listing);
        const priceText = getPriceText(listing);
        const forRent = isForRent(listing);
        const id = String(listing?.id ?? "");

        const colClass = isList ? "col-12" : "col-12 col-sm-6 col-lg-6";
        const cardClass = isList
          ? "listing-style1 listCustom listing-type"
          : "listing-style1";

        const isActive = activeSet.has(id);

        // ✅ (เพิ่ม) maps url ถ้ามีพิกัด
        const ll = getLatLng(listing);
        const mapsUrl = ll ? buildGoogleMapsUrl(ll.lat, ll.lng) : "";

        return (
          <div className={colClass} key={id || `${imgSrc}-${locText}`}>
            <div className={`${cardClass} ${isActive ? "lx-card-active" : ""}`}>
              <div className="list-thumb">
                <Image
                  width={382}
                  height={248}
                  className="w-100 cover"
                  src={imgSrc}
                  alt={listing?.title || "listing"}
                  style={{ height: isList ? "200px" : "240px" }}
                />

                {/* ✅ ราคา + ป้ายขาย/ให้เช่า อยู่ข้างกัน */}
                <div className="list-price lx-price-row">
                  <span className="lx-price-text">
                    {priceText}
                    {forRent ? (
                      <>
                        {" "}
                        / <span>เดือน</span>
                      </>
                    ) : null}
                  </span>

                  <span className="for-what lx-for-what-badge">
                    {getForWhatLabel(listing)}
                  </span>
                </div>
              </div>

              <div className="list-content">
                <h6 className="list-title">
                  <Link href={`/single-v5/${listing?.id ?? ""}`}>
                    {listing?.title || "—"}
                  </Link>
                </h6>

                <p className="list-text">{locText}</p>

                <div className="list-meta d-flex align-items-center">
                  <span>
                    <span className="flaticon-bed" /> {bed} ห้องนอน
                  </span>
                  <span>
                    <span className="flaticon-shower" /> {bath} ห้องน้ำ
                  </span>
                  <span>
                    <span className="flaticon-expand" /> {sqft} ตร.ม.
                  </span>
                </div>

                {/* ✅ (เพิ่ม) ปุ่มไป Google Maps */}
                {mapsUrl ? (
                  <div style={{ marginTop: 10 }}>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ud-btn btn-light"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 10,
                        fontSize: 12,
                        textAlign: "center",
                      }}
                      title="เปิดพิกัดนี้ใน Google Maps"
                    >
                      ไป Google Maps
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
