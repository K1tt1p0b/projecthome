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
  const modern = listing?.imageSrc || (Array.isArray(listing?.gallery) ? listing.gallery[0] : null);
  const src = modern || legacy;
  if (!src || String(src).trim() === "") return FALLBACK_IMAGE;
  return src;
}

function getLocationText(listing) {
  const loc = listing?.location;
  if (typeof loc === "string") return loc || "—";

  const fullText = loc?.fullText;
  if (typeof fullText === "string" && fullText.trim()) return fullText;

  const composed = [loc?.address, loc?.district, loc?.province].filter(Boolean).join(" ");
  return composed || "—";
}

function getBedsBathSqft(listing) {
  const bedLegacy = listing?.bed;
  const bathLegacy = listing?.bath;
  const sqftLegacy = listing?.sqft;

  const bedModern = listing?.details?.bedrooms;
  const bathModern = listing?.details?.bathrooms;
  const sqftModern = listing?.details?.usableArea;

  return {
    bed: toNumber(bedModern ?? bedLegacy, 0),
    bath: toNumber(bathModern ?? bathLegacy, 0),
    sqft: toNumber(sqftModern ?? sqftLegacy, 0),
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
        const id = String(listing?.id ?? `${imgSrc}-${locText}`);
        const isActive = activeSet.has(id);

        const colClass = isList ? "col-12" : "col-12 col-sm-6 col-lg-6";
        const cardClass = isList ? "listing-style1 listCustom listing-type" : "listing-style1";

        return (
          <div className={colClass} key={id}>
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

                {/* ✅ ราคา + ป้ายขาย/เช่า */}
                <div className="list-price lx-pricewrap">
                  <span className="lx-price">{priceText}</span>

                  <span className="lx-forwhat">{getForWhatLabel(listing)}</span>

                  {forRent ? <span className="lx-rent-unit">/ เดือน</span> : null}
                </div>
              </div>

              <div className="list-content">
                <h6 className="list-title">
                  <Link href={`/single-v5/${listing?.id ?? ""}`}>{listing?.title || "—"}</Link>
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

                <hr className="mt-2 mb-2" />

                <div className="list-meta2 d-flex justify-content-end align-items-center">
                  <div className="icons d-flex align-items-center">
                    <button type="button" className="lx-icon-btn" aria-label="fullscreen">
                      <span className="flaticon-fullscreen" />
                    </button>
                    <button type="button" className="lx-icon-btn" aria-label="open">
                      <span className="flaticon-new-tab" />
                    </button>
                    <button type="button" className="lx-icon-btn" aria-label="like">
                      <span className="flaticon-like" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
