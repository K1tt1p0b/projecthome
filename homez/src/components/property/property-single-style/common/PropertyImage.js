"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGES = [
  "/images/listings/listing-single-1.jpg",
  "/images/listings/listing-single-2.jpg",
  "/images/listings/listing-single-3.jpg",
  "/images/listings/listing-single-4.jpg",
  "/images/listings/listing-single-5.jpg",
  "/images/listings/listing-single-6.jpg",
];

const SHOW_MAX = 6;

export default function PropertyImage({ images }) {
  const list = useMemo(() => {
    if (Array.isArray(images) && images.length > 0) return images;
    return FALLBACK_IMAGES;
  }, [images]);

  const thumbs = useMemo(() => list.slice(0, SHOW_MAX), [list]);
  const extraCount = Math.max(0, list.length - SHOW_MAX);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openViewer = (idx) => {
    setActiveIndex(idx);
    setOpen(true);
  };

  const closeViewer = () => setOpen(false);

  // ESC to close + lock scroll
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") {
        setActiveIndex((p) => Math.min(p + 1, list.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((p) => Math.max(p - 1, 0));
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, list.length]);

  const activeSrc =
    list[Math.max(0, Math.min(activeIndex, Math.max(0, list.length - 1)))];

  return (
    <div className="col-12">
      {/* ✅ Only 6 thumbnails grid */}
      <div className="row g-2">
        {thumbs.map((src, idx) => {
          const isLast = idx === SHOW_MAX - 1;
          const showPlus = isLast && extraCount > 0;

          return (
            <div className="col-4" key={`${src}-${idx}`}>
              <button
                type="button"
                onClick={() => openViewer(idx)}
                className="w-100 p-0 border-0 bg-transparent"
                aria-label={`ดูรูปที่ ${idx + 1}`}
                style={{ outline: "none" }}
              >
                <div
                  className="position-relative bdrs10 overflow-hidden"
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    background: "#f2f2f2",
                    transition: "transform .15s ease",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Property thumbnail ${idx + 1}`}
                    fill
                    sizes="200px"
                    style={{ objectFit: "cover" }}
                  />

                  {/* number badge */}
                  <div
                    className="position-absolute"
                    style={{
                      left: 8,
                      top: 8,
                      padding: "4px 8px",
                      borderRadius: 10,
                      background: "rgba(0,0,0,0.55)",
                      color: "#fff",
                      fontSize: 12,
                      lineHeight: 1,
                      fontWeight: 700,
                      zIndex: 2,
                    }}
                  >
                    {idx + 1}
                  </div>

                  {/* +n overlay on last */}
                  {showPlus && (
                    <div
                      className="position-absolute d-flex align-items-center justify-content-center"
                      style={{
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 22,
                        zIndex: 1,
                      }}
                    >
                      +{extraCount}
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ Lightbox Modal */}
      {open && (
        <div
          className="position-fixed"
          style={{
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.65)",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
        >
          {/* content */}
          <div
            className="position-relative"
            style={{
              width: "min(980px, 100%)",
              maxHeight: "90vh",
              paddingTop: 18, // ✅ กันพื้นที่ให้ปุ่ม X ไม่ชนขอบ
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ close button (แก้ให้ไม่จม) */}
            <button
              type="button"
              onClick={closeViewer}
              aria-label="ปิด"
              className="border-0"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                transform: "translate(35%, -35%)", // ✅ ดันออกมานิด ให้ไม่โดนกรอบรูป
                width: 44,
                height: 44,
                borderRadius: 999,
                background: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                cursor: "pointer",
                zIndex: 5, // ✅ สำคัญ: กันจม
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            {/* image */}
            <div
              className="position-relative bdrs12 overflow-hidden"
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                background: "#111",
                maxHeight: "90vh",
              }}
            >
              <Image
                src={activeSrc}
                alt="Property large"
                fill
                sizes="(max-width: 768px) 100vw, 980px"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
