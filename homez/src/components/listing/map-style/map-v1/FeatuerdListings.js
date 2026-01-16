import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/listings/list-1.jpg";

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getImageSrc(listing) {
  // รองรับ schema เดิม: listing.image
  const legacy = listing?.image;

  // รองรับ schema ใหม่: imageSrc / gallery[]
  const modern =
    listing?.imageSrc ||
    (Array.isArray(listing?.gallery) ? listing.gallery[0] : null);

  const src = modern || legacy;

  // กัน empty string / undefined
  if (!src || String(src).trim() === "") return FALLBACK_IMAGE;
  return src;
}

function getLocationText(listing) {
  const loc = listing?.location;

  // schema เดิม: location เป็น string
  if (typeof loc === "string") return loc || "—";

  // schema ใหม่: location เป็น object
  const fullText = loc?.fullText;
  if (typeof fullText === "string" && fullText.trim()) return fullText;

  // fallback ประกอบข้อความเอง
  const composed = [loc?.address, loc?.district, loc?.province]
    .filter(Boolean)
    .join(" ");
  return composed || "—";
}

function getBedsBathSqft(listing) {
  // schema เดิม: bed/bath/sqft อยู่ top-level
  const bedLegacy = listing?.bed;
  const bathLegacy = listing?.bath;
  const sqftLegacy = listing?.sqft;

  // schema ใหม่: details.bedrooms / bathrooms / usableArea
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
  // schema เดิม: price เป็น string เช่น "$14,000"
  const p = listing?.price;

  if (typeof p === "string" && p.trim()) {
    // ถ้าเป็นของเก่าเอามาใช้เลย
    return p;
  }

  // schema ใหม่: price เป็น number + priceText
  if (listing?.priceText) return `฿${listing.priceText}`;
  const n = toNumber(listing?.price, 0);
  return `฿${n.toLocaleString()}`;
}

function isForRent(listing) {
  // schema เดิม: forRent boolean
  if (typeof listing?.forRent === "boolean") return listing.forRent;

  // schema ใหม่: listingTypes: ["rent"] | ["sell"]
  const types = listing?.listingTypes;
  if (Array.isArray(types)) return types.includes("rent");

  return false;
}

function getForWhatLabel(listing) {
  const rent = isForRent(listing);
  return rent ? "ให้เช่า" : "ขาย";
}

const FeaturedListings = ({ data = [], colstyle }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <>
      {safeData.map((listing) => {
        const imgSrc = getImageSrc(listing);
        const locText = getLocationText(listing);
        const { bed, bath, sqft } = getBedsBathSqft(listing);
        const priceText = getPriceText(listing);
        const forRent = isForRent(listing);

        return (
          <div
            className={`${colstyle ? "col-sm-12" : "col-sm-6"}`}
            key={listing?.id ?? `${imgSrc}-${locText}`}
          >
            <div
              className={
                colstyle
                  ? "listing-style1 listCustom listing-type"
                  : "listing-style1"
              }
            >
              <div className="list-thumb">
                <Image
                  width={382}
                  height={248}
                  className="w-100 cover"
                  src={imgSrc}
                  style={{ height: "240px" }}
                  alt={listing?.title || "listing"}
                />
                {/*
                
                <div className="sale-sticker-wrap">
                  {!forRent && (
                    <div className="list-tag fz12">
                      <span className="flaticon-electricity me-2" />
                      FEATURED
                    </div>
                  )}
                </div>

                */}
                <div className="list-price">
                  {priceText}{" "}
                  {forRent ? (
                    <>
                      / <span>เดือน</span>
                    </>
                  ) : null}
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
                  <a href="#">
                    <span className="flaticon-bed" /> {bed} ห้องนอน
                  </a>
                  <a href="#">
                    <span className="flaticon-shower" /> {bath} ห้องน้ำ
                  </a>
                  <a href="#">
                    <span className="flaticon-expand" /> {sqft} ตร.ม.
                  </a>
                </div>

                <hr className="mt-2 mb-2" />

                <div className="list-meta2 d-flex justify-content-between align-items-center">
                  <span className="for-what">{getForWhatLabel(listing)}</span>
                  <div className="icons d-flex align-items-center">
                    <a href="#">
                      <span className="flaticon-fullscreen" />
                    </a>
                    <a href="#">
                      <span className="flaticon-new-tab" />
                    </a>
                    <a href="#">
                      <span className="flaticon-like" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FeaturedListings;
