"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import s from "./template-setting.module.css";

// ✅ Templates 6 อัน (Mock) + รูปในสไลด์หลายรูป
const TEMPLATES = [
  {
    id: "sellpage-a",
    name: "Sellpage Template A",
    desc: "โครงหน้าเน้นความน่าเชื่อถือ (Mock)",
    cover: "/images/template/a-cover.jpg",
    slides: ["/images/template/a-1.jpg", "/images/template/a-2.jpg", "/images/template/a-3.jpg"],
  },
  {
    id: "sellpage-b",
    name: "Sellpage Template B",
    desc: "โครงหน้าเน้นปิดการขาย/Conversion (Mock)",
    cover: "/images/template/b-cover.jpg",
    slides: ["/images/template/b-1.jpg", "/images/template/b-2.jpg", "/images/template/b-3.jpg"],
  },
  {
    id: "sellpage-c",
    name: "Sellpage Template C",
    desc: "โครงหน้าสายครีเอเตอร์/ภาพเด่น (Mock)",
    cover: "/images/template/c-cover.jpg",
    slides: ["/images/template/c-1.jpg", "/images/template/c-2.jpg", "/images/template/c-3.jpg"],
  },
  {
    id: "sellpage-d",
    name: "Sellpage Template D",
    desc: "โครงหน้า Minimal/Modern (Mock)",
    cover: "/images/template/d-cover.jpg",
    slides: ["/images/template/d-1.jpg", "/images/template/d-2.jpg", "/images/template/d-3.jpg"],
  },
  {
    id: "sellpage-e",
    name: "Sellpage Template E",
    desc: "โครงหน้าแนว Luxury / Premium (Mock)",
    cover: "/images/template/e-cover.jpg",
    slides: ["/images/template/e-1.jpg", "/images/template/e-2.jpg", "/images/template/e-3.jpg"],
  },
  {
    id: "sellpage-f",
    name: "Sellpage Template F",
    desc: "โครงหน้าแนว Listing / Card-heavy (Mock)",
    cover: "/images/template/f-cover.jpg",
    slides: ["/images/template/f-1.jpg", "/images/template/f-2.jpg", "/images/template/f-3.jpg"],
  },
];

// ✅ Sections (Mock) — ตัด contact + property_map ออก
// ✅ เพิ่ม href ให้แต่ละอันเพื่อทำเป็นลิงก์ใต้ description
const SECTIONS = [
  { key: "about", title: "เกี่ยวกับฉัน", desc: "แนะนำตัว/ประสบการณ์/บริษัท", icon: "flaticon-user", href: "/dashboard-about-me" },
  { key: "properties", title: "ทรัพย์สินของฉัน", desc: "รายการทรัพย์ (ขาย/เช่า/แนะนำ)", icon: "flaticon-home", href: "/dashboard-my-properties" },
  { key: "services", title: "งานบริการของฉัน", desc: "ฝากขาย/ประเมินราคา/ปรึกษาสินเชื่อ", icon: "fas fa-hard-hat", href: "dashboard-my-construction" },
  { key: "courses", title: "คอร์สเรียนของฉัน", desc: "คอร์ส/คอร์สออนไลน์", icon: "fas fa-book", href: "/dashboard-my-course" },
  { key: "gallery", title: "แกลเลอรี่", desc: "รูปภาพแกลเลอรี่/ผลงาน/บรรยากาศ", icon: "flaticon-images", href: "/dashboard-gallery" },
  { key: "video", title: "วิดีโอ", desc: "วิดีโอแนะนำ/พาชมทรัพย์", icon: "flaticon-play", href: "/dashboard-video-gallery" },
];

const LS_KEY = "microsite_template_setting_v1";
const DEFAULT_TEMPLATE_ID = "sellpage-a";

/**
 * เก็บค่าใน localStorage:
 * {
 *   selectedTemplateId: string | null,
 *   hasEverVisited: boolean,
 *   enabledSections: Record<string, boolean>
 * }
 */

export default function TemplateSettingClient() {
  const initialSections = useMemo(
    () => ({
      properties: false,
      services: false,
      courses: false,
      about: false,
      video: false,
      gallery: false,
    }),
    []
  );

  // ✅ เลือกได้/ไม่เลือกก็ได้
  const [selectedTemplate, setSelectedTemplate] = useState(null); // string | null
  const [enabledSections, setEnabledSections] = useState(initialSections);

  // ใช้ไว้โชว์ว่า default เพราะ “เข้าครั้งแรก”
  const [isFirstTimeDefault, setIsFirstTimeDefault] = useState(false);

  // ===== Load from localStorage (ครั้งแรกให้ default) =====
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        // ✅ เข้าครั้งแรก → ให้ default ไปก่อน
        setSelectedTemplate(DEFAULT_TEMPLATE_ID);
        setEnabledSections(initialSections);
        setIsFirstTimeDefault(true);

        localStorage.setItem(
          LS_KEY,
          JSON.stringify({
            selectedTemplateId: DEFAULT_TEMPLATE_ID,
            hasEverVisited: true,
            enabledSections: initialSections,
          })
        );
        return;
      }

      const parsed = JSON.parse(raw);
      const tplId = parsed?.selectedTemplateId ?? null;
      const sec = parsed?.enabledSections ?? initialSections;

      setSelectedTemplate(tplId);
      setEnabledSections(sec);
      setIsFirstTimeDefault(false);
    } catch {
      // ถ้า parse พัง ให้ fallback เป็น default
      setSelectedTemplate(DEFAULT_TEMPLATE_ID);
      setEnabledSections(initialSections);
      setIsFirstTimeDefault(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (next) => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          selectedTemplateId: next.selectedTemplateId ?? null,
          hasEverVisited: true,
          enabledSections: next.enabledSections ?? enabledSections,
        })
      );
    } catch {
      // ignore
    }
  };

  const currentTpl = useMemo(() => {
    if (!selectedTemplate) return null;
    return TEMPLATES.find((t) => t.id === selectedTemplate) || null;
  }, [selectedTemplate]);

  const enabledCount = Object.values(enabledSections).filter(Boolean).length;

  const toggleSection = (key) => {
    setEnabledSections((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persist({ selectedTemplateId: selectedTemplate, enabledSections: next });
      return next;
    });
  };

  // ===== Slider state (อยู่ด้านบน) =====
  const slides = useMemo(() => {
    if (!currentTpl) return [];
    const arr = Array.isArray(currentTpl.slides) && currentTpl.slides.length ? currentTpl.slides : [currentTpl.cover];
    return arr.filter(Boolean);
  }, [currentTpl]);

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [selectedTemplate]);

  const canPrev = slideIndex > 0;
  const canNext = slideIndex < slides.length - 1;

  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));
  const next = () => setSlideIndex((i) => Math.min(slides.length - 1, i + 1));

  const pickTemplate = (tplId) => {
    setIsFirstTimeDefault(false);

    // ✅ คลิกอันเดิมซ้ำ = ยกเลิกเลือก (ตามที่อยากให้ไม่เลือกได้)
    setSelectedTemplate((prevId) => {
      const nextId = prevId === tplId ? null : tplId;
      persist({ selectedTemplateId: nextId, enabledSections });
      return nextId;
    });
  };

  const clearTemplate = () => {
    setIsFirstTimeDefault(false);
    setSelectedTemplate(null);
    persist({ selectedTemplateId: null, enabledSections });
    toast.info("ยกเลิกการเลือกเทมเพลตแล้ว");
  };

  const resetAll = () => {
    setSelectedTemplate(DEFAULT_TEMPLATE_ID);
    setEnabledSections(initialSections);
    setIsFirstTimeDefault(true);
    setSlideIndex(0);

    persist({ selectedTemplateId: DEFAULT_TEMPLATE_ID, enabledSections: initialSections });
    toast.info("รีเซ็ตค่า (Mock)");
  };

  const saveMock = () => {
    // บันทึก mock: ณ จุดนี้เราก็ persist ไว้แล้วระหว่างทาง
    toast.success("บันทึกการตั้งค่า (Mock)");
  };

  return (
    <div className={s.wrap}>
      {/* Header */}
      <div className={s.head}>
        <div>
          <h2 className={s.title}>ตั้งค่า Microsite Template</h2>
          <p className={s.sub}>หน้าเดียว: เลือกเทมเพลต (เลือก/ไม่เลือกก็ได้) + เลือกข้อมูล (Mock UI)</p>
        </div>

        <div className={s.summary}>
          <div className={s.pill}>
            เทมเพลตตอนนี้: <b>{currentTpl ? currentTpl.name : "ยังไม่เลือก"}</b>
            {isFirstTimeDefault && currentTpl?.id === DEFAULT_TEMPLATE_ID ? (
              <span style={{ marginLeft: 8, fontWeight: 700 }}>• (ค่าเริ่มต้น)</span>
            ) : null}
          </div>
          <div className={s.pill}>
            Section ที่เปิด: <b>{enabledCount}</b> / {SECTIONS.length}
          </div>
        </div>
      </div>

      {/* ================= PREVIEW (อยู่บนสุด) ================= */}
      <div className={s.block}>
        <div className={s.blockTitle}>
          <h4>ตัวอย่าง Template</h4>
          <span className={s.miniHint}>เลือกเทมเพลตด้านล่างเพื่อดูตัวอย่าง · สามารถ “ไม่เลือก” ได้</span>
        </div>

        {/* ✅ ถ้ายังไม่เลือก ให้เป็น placeholder ข้อความ */}
        {!currentTpl ? (
          <div
            className={s.sliderWrap}
            style={{
              padding: 18,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "var(--orange-border)",
              background: "var(--orange-soft)",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6, color: "var(--orange-text)" }}>
              นี่คือพื้นที่ตัวอย่างของ Template
            </div>
            <div style={{ opacity: 0.85 }}>โปรดเลือก template ด้านล่างเพื่อแสดงตัวอย่าง</div>
          </div>
        ) : (
          <div className={s.sliderWrap}>
            <div className={s.sliderHead}>
              <div>
                <h4 className={s.sliderTitle}>{currentTpl.name}</h4>
                <p className={s.sliderSub}>ตัวอย่างรูป (Mock)</p>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div className={s.sliderCount}>
                  รูป <b>{Math.min(slideIndex + 1, slides.length || 1)}</b> / {slides.length || 1}
                </div>

                <button type="button" className={s.btnGhost} onClick={clearTemplate}>
                  ไม่เลือกเทมเพลต
                </button>
              </div>
            </div>

            <div className={s.sliderStage}>
              <button
                type="button"
                className={`${s.sliderBtn} ${!canPrev ? s.sliderBtnDisabled : ""}`}
                onClick={prev}
                disabled={!canPrev}
                aria-label="Previous"
              >
                ‹
              </button>

              <div className={s.sliderImageWrap}>
                <Image
                  src={slides[slideIndex] || currentTpl.cover}
                  alt={`${currentTpl.name} slide ${slideIndex + 1}`}
                  fill
                  className={s.sliderImage}
                  sizes="(max-width: 1200px) 100vw, 900px"
                  priority
                />
                <span className={s.badge} style={{ right: 12, left: "auto" }}>
                  ตัวอย่าง
                </span>
              </div>

              <button
                type="button"
                className={`${s.sliderBtn} ${!canNext ? s.sliderBtnDisabled : ""}`}
                onClick={next}
                disabled={!canNext}
                aria-label="Next"
              >
                ›
              </button>
            </div>

            <div className={s.thumbs}>
              {slides.map((src, idx) => {
                const on = idx === slideIndex;
                return (
                  <button
                    key={`${currentTpl.id}_thumb_${idx}`}
                    type="button"
                    className={`${s.thumb} ${on ? s.thumbOn : ""}`}
                    onClick={() => setSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span className={s.thumbImgWrap}>
                      <Image src={src} alt="" fill className={s.thumbImg} sizes="120px" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= TEMPLATE GRID ================= */}
      <div className={s.block}>
        <div className={s.blockTitle}>
          <h4>เลือกเทมเพลต microsite</h4>
          <span className={s.miniHint}>แถวละ 3 (รวม 6 อัน) · คลิกซ้ำเพื่อ “ยกเลิกเลือก”</span>
        </div>

        <div className={s.grid}>
          {TEMPLATES.map((tpl) => {
            const active = tpl.id === selectedTemplate;

            return (
              <div
                key={tpl.id}
                className={`${s.card} ${active ? s.active : ""}`}
                onClick={() => pickTemplate(tpl.id)}
                role="button"
                tabIndex={0}
              >
                <div className={s.preview}>
                  <Image
                    src={tpl.cover || tpl.slides?.[0]}
                    alt={tpl.name}
                    fill
                    className={s.image}
                    sizes="(max-width: 1200px) 50vw, 33vw"
                  />
                  {active && <span className={s.badge}>เลือกอยู่</span>}
                </div>

                <div className={s.cardBody}>
                  <h5 className={s.cardTitle}>{tpl.name}</h5>
                  <p className={s.cardDesc}>{tpl.desc}</p>

                  <div className={s.cardActions}>
                    <button
                      type="button"
                      className={active ? s.btnGhost : s.btnPick}
                      onClick={(e) => {
                        e.stopPropagation();
                        pickTemplate(tpl.id);
                        toast.success(active ? "ยกเลิกเลือกเทมเพลตแล้ว (Mock)" : "เลือกเทมเพลตแล้ว (Mock)");
                      }}
                    >
                      {active ? "ยกเลิกเลือก" : "เลือกเทมเพลต"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SECTIONS ================= */}
      <div className={s.block}>
        <div className={s.blockTitle}>
          <h4>เลือกข้อมูลที่จะแสดงบน microsite</h4>
          <span className={s.miniHint}>ตัด “ช่องทางติดต่อ” และ “แผนที่ทรัพย์” ออกแล้ว</span>
        </div>

        <div className={s.sectionGrid}>
          {SECTIONS.map((sec) => {
            const on = !!enabledSections[sec.key];

            return (
              <div
                key={sec.key}
                className={`${s.sectionCard} ${on ? s.sectionOn : ""}`}
                onClick={() => toggleSection(sec.key)}
                role="button"
                tabIndex={0}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className={s.icon}>
                    <i className={sec.icon} />
                  </div>

                  <div>
                    <h5 className={s.sectionTitle}>{sec.title}</h5>
                    <p className={s.sectionDesc}>{sec.desc}</p>

                    {/* ✅ ลิงก์ใต้ description */}
                    {sec.href ? (
                      <Link
                        href={sec.href}
                        onClick={(e) => e.stopPropagation()} // ✅ กันไม่ให้ toggle ตอนกดลิงก์
                        className={s.sectionLink}
                      >
                        ไปยังหน้าเมนูนี้ →
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className={s.sectionRight}>
                  <span className={`${s.statePill} ${on ? s.stateOn : s.stateOff}`}>{on ? "แสดง" : "ซ่อน"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className={s.footerActions}>
          <button type="button" className={s.btnGhost} onClick={resetAll}>
            รีเซ็ต
          </button>

          <button type="button" className={s.btnSave} onClick={saveMock}>
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
}
