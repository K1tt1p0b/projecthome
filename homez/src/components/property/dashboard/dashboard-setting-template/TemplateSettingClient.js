"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
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
const SECTIONS = [
  { key: "properties", title: "ทรัพย์สินของฉัน", desc: "รายการทรัพย์ (ขาย/เช่า/แนะนำ)", icon: "flaticon-home" },
  { key: "services", title: "งานบริการของฉัน", desc: "ฝากขาย/ประเมินราคา/ปรึกษาสินเชื่อ", icon: "fas fa-hard-hat" },
  { key: "courses", title: "คอร์สเรียนของฉัน", desc: "คอร์ส/คอร์สออนไลน์", icon: "fas fa-book" },
  { key: "about", title: "เกี่ยวกับฉัน", desc: "แนะนำตัว/ประสบการณ์/บริษัท", icon: "flaticon-user" },
  { key: "video", title: "วิดีโอ", desc: "วิดีโอแนะนำ/พาชมทรัพย์", icon: "flaticon-play" },
  { key: "gallery", title: "แกลเลอรี่", desc: "รูปภาพแกลเลอรี่/ผลงาน/บรรยากาศ", icon: "flaticon-images" },
];

export default function TemplateSettingClient() {
  // ✅ เปลี่ยนจาก tab เป็น step
  const [step, setStep] = useState(1); // 1=เลือก Template, 2=เลือกข้อมูล
  const [selectedTemplate, setSelectedTemplate] = useState("sellpage-a");

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

  const [enabledSections, setEnabledSections] = useState(initialSections);

  const currentTpl = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0],
    [selectedTemplate]
  );

  const enabledCount = Object.values(enabledSections).filter(Boolean).length;

  const toggleSection = (key) => {
    setEnabledSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ===== Slider state =====
  const slides = Array.isArray(currentTpl.slides) && currentTpl.slides.length ? currentTpl.slides : [currentTpl.cover];
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [selectedTemplate]);

  const canPrev = slideIndex > 0;
  const canNext = slideIndex < slides.length - 1;

  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));
  const next = () => setSlideIndex((i) => Math.min(slides.length - 1, i + 1));

  const goNextStep = () => {
    if (!selectedTemplate) {
      toast.info("กรุณาเลือกเทมเพลตก่อน");
      return;
    }
    setStep(2);
    // เลื่อนให้เห็น step 2 ทันที
    setTimeout(() => {
      const el = document.getElementById("step-2");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const goPrevStep = () => {
    setStep(1);
    setTimeout(() => {
      const el = document.getElementById("step-1");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const resetAll = () => {
    setSelectedTemplate("sellpage-a");
    setEnabledSections(initialSections);
    setStep(1);
    toast.info("รีเซ็ตค่า (Mock)");
  };

  const saveMock = () => {
    toast.success("บันทึกการตั้งค่า (Mock)");
  };

  return (
    <div className={s.wrap}>
      {/* Header */}
      <div className={s.head}>
        <div>
          <h2 className={s.title}>ตั้งค่า Microsite Template</h2>
          <p className={s.sub}>ทำเป็น Step: 1) เลือกเทมเพลต → กดถัดไป → 2) เลือกข้อมูล (Mock UI)</p>
        </div>

        <div className={s.summary}>
          <div className={s.pill}>
            เทมเพลตที่เลือก: <b>{currentTpl.name}</b>
          </div>
          <div className={s.pill}>
            Section ที่เปิด: <b>{enabledCount}</b> / {SECTIONS.length}
          </div>
        </div>
      </div>

      {/* Step indicator (ใช้ pill เดิมให้เข้าธีม) */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div
          className={s.pill}
          style={{
            borderColor: step === 1 ? "var(--orange-border)" : undefined,
            background: step === 1 ? "var(--orange-soft)" : undefined,
            color: step === 1 ? "var(--orange-text)" : undefined,
            fontWeight: 800,
          }}
        >
          Step 1: เลือก Template
        </div>
        <div
          className={s.pill}
          style={{
            borderColor: step === 2 ? "var(--orange-border)" : undefined,
            background: step === 2 ? "var(--orange-soft)" : undefined,
            color: step === 2 ? "var(--orange-text)" : undefined,
            fontWeight: 800,
          }}
        >
          Step 2: เลือกข้อมูล
        </div>
      </div>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div id="step-1" className={s.block}>
          <div className={s.blockTitle}>
            <h4>1) เลือกเทมเพลต microsite</h4>
            <span className={s.miniHint}>แถวละ 3 (รวม 6 อัน) · เลือกแล้วกด “ถัดไป”</span>
          </div>

          <div className={s.grid}>
            {TEMPLATES.map((tpl) => {
              const active = tpl.id === selectedTemplate;

              return (
                <div
                  key={tpl.id}
                  className={`${s.card} ${active ? s.active : ""}`}
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                  }}
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
                        className={s.btnGhost}
                        onClick={(e) => {
                          e.stopPropagation();
                          const el = document.getElementById("tpl-slider");
                          el?.scrollIntoView({ behavior: "smooth", block: "start" });
                          toast.info("เลื่อนลงไปดูสไลด์ตัวอย่าง");
                        }}
                      >
                        ดูตัวอย่าง
                      </button>

                      <button
                        type="button"
                        className={s.btnPick}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(tpl.id);
                          toast.success("เลือกเทมเพลตแล้ว (Mock)");
                        }}
                      >
                        เลือกเทมเพลต
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Slider preview */}
          <div id="tpl-slider" className={s.sliderWrap}>
            <div className={s.sliderHead}>
              <div>
                <h4 className={s.sliderTitle}>ตัวอย่าง: {currentTpl.name}</h4>
                <p className={s.sliderSub}>แสดงเป็นสไลด์รูป (Mock)</p>
              </div>
              <div className={s.sliderCount}>
                รูป <b>{slideIndex + 1}</b> / {slides.length}
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
                  src={slides[slideIndex]}
                  alt={`${currentTpl.name} slide ${slideIndex + 1}`}
                  fill
                  className={s.sliderImage}
                  sizes="(max-width: 1200px) 100vw, 900px"
                  priority
                />
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

          {/* ✅ Step 1 actions */}
          <div className={s.footerActions}>
            <button type="button" className={s.btnGhost} onClick={resetAll}>
              รีเซ็ต
            </button>

            <button
              type="button"
              className={s.btnPick}
              onClick={goNextStep}
              disabled={!selectedTemplate}
              style={{ opacity: selectedTemplate ? 1 : 0.5 }}
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div id="step-2" className={s.block}>
          <div className={s.blockTitle}>
            <h4>2) เลือกข้อมูลที่จะแสดงบน microsite</h4>
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
                    </div>
                  </div>

                  <div className={s.sectionRight}>
                    <span className={`${s.statePill} ${on ? s.stateOn : s.stateOff}`}>{on ? "แสดง" : "ซ่อน"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Step 2 actions */}
          <div className={s.footerActions}>
            <button type="button" className={s.btnGhost} onClick={goPrevStep}>
              ย้อนกลับ
            </button>

            <button type="button" className={s.btnGhost} onClick={resetAll}>
              รีเซ็ต
            </button>

            <button type="button" className={s.btnSave} onClick={saveMock}>
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
