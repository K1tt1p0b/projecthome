"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import s from "./template-setting.module.css";

// ✅ Microsite Templates (Mock)
const TEMPLATES = [
  {
    id: "sellpage-a",
    name: "Sellpage Template A",
    desc: "โครงหน้าเน้นความน่าเชื่อถือ (Mock)",
    preview: "/images/template/template-1.jpg",
  },
  {
    id: "sellpage-b",
    name: "Sellpage Template B",
    desc: "โครงหน้าเน้นปิดการขาย/Conversion (Mock)",
    preview: "/images/template/template-2.jpg",
  },
  {
    id: "sellpage-c",
    name: "Sellpage Template C",
    desc: "โครงหน้าสายครีเอเตอร์/ภาพเด่น (Mock)",
    preview: "/images/template/template-3.jpg",
  },
  {
    id: "sellpage-d",
    name: "Sellpage Template D",
    desc: "โครงหน้า Minimal/Modern (Mock)",
    preview: "/images/template/template-4.jpg",
  },
];

// ✅ Sections (Mock) — ใช้ flaticon แทนอิโมจิ
const SECTIONS = [
  {
    key: "properties",
    title: "ทรัพย์สินของฉัน",
    desc: "รายการทรัพย์ (ขาย/เช่า/แนะนำ)",
    icon: "flaticon-home",
  },
  {
    key: "services",
    title: "งานบริการของฉัน",
    desc: "ฝากขาย/ประเมินราคา/ปรึกษาสินเชื่อ",
    icon: "fas fa-hard-hat",
  },
  {
    key: "courses",
    title: "คอร์สเรียนของฉัน",
    desc: "คอร์ส/คอร์สออนไลน์",
    icon: "fas fa-book",
  },
  {
    key: "about",
    title: "เกี่ยวกับฉัน",
    desc: "แนะนำตัว/ประสบการณ์/บริษัท",
    icon: "flaticon-user",
  },
  {
    key: "contact",
    title: "ช่องทางติดต่อ",
    desc: "โทร/Line/โซเชียล",
    icon: "flaticon-call",
  },
  {
    key: "video",
    title: "วิดีโอ",
    desc: "วิดีโอแนะนำ/พาชมทรัพย์",
    icon: "flaticon-play",
  },
  {
    key: "gallery",
    title: "แกลเลอรี่",
    desc: "รูปภาพแกลเลอรี่/ผลงาน/บรรยากาศ",
    icon: "flaticon-images",
  },
  {
    key: "property_map",
    title: "แผนที่ทรัพย์สิน",
    desc: "แผนที่รวมทรัพย์สิน",
    icon: "flaticon-map",
  },
];

export default function TemplateSettingClient() {
  const [selectedTemplate, setSelectedTemplate] = useState("sellpage-a");

  // ✅ mock ค่าเริ่มต้น
  const initialSections = useMemo(
    () => ({
      properties: false,
      services: false,
      courses: false,
      about: false,
      contact: false,
      video: false,
      gallery: false,
      property_map: false,
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

  return (
    <div className={s.wrap}>
      {/* Header */}
      <div className={s.head}>
        <div>
          <h2 className={s.title}>ตั้งค่า Microsite Template</h2>
          <p className={s.sub}>
            เลือกเทมเพลตและเลือกข้อมูลที่ต้องการให้แสดงบน microsite (Mock UI ยังไม่บันทึกจริง)
          </p>
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

      {/* 1) Template */}
      <div className={s.block}>
        <div className={s.blockTitle}>
          <h4>1) เลือกเทมเพลต microsite</h4>
          <span className={s.miniHint}>คลิกการ์ดเพื่อเลือก (Mock)</span>
        </div>

        <div className={s.grid}>
          {TEMPLATES.map((tpl) => {
            const active = tpl.id === selectedTemplate;

            return (
              <div
                key={tpl.id}
                className={`${s.card} ${active ? s.active : ""}`}
                onClick={() => setSelectedTemplate(tpl.id)}
                role="button"
                tabIndex={0}
              >
                <div className={s.preview}>
                  <Image
                    src={tpl.preview}
                    alt={tpl.name}
                    fill
                    className={s.image}
                    sizes="(max-width: 1200px) 50vw, 25vw"
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
                        toast.info("ดูตัวอย่าง (Mock)");
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
      </div>

      {/* 2) Sections */}
      <div className={s.block}>
        <div className={s.blockTitle}>
          <h4>2) เลือกข้อมูลที่จะแสดงบน microsite</h4>
          <span className={s.miniHint}>คลิกการ์ดเพื่อเปิด/ปิด (Mock)</span>
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
                <div className={s.sectionLeft}>
                  <div className={s.icon}>
                    <i className={sec.icon} />
                  </div>
                  <div>
                    <h5 className={s.sectionTitle}>{sec.title}</h5>
                    <p className={s.sectionDesc}>{sec.desc}</p>
                  </div>
                </div>

                <div className={s.sectionRight}>
                  <span className={`${s.statePill} ${on ? s.stateOn : s.stateOff}`}>
                    {on ? "แสดง" : "ซ่อน"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer actions */}
      <div className={s.footerActions}>
        <button
          type="button"
          className={s.btnGhost}
          onClick={() => {
            setSelectedTemplate("sellpage-a");
            setEnabledSections(initialSections);
            toast.info("รีเซ็ตค่า (Mock)");
          }}
        >
          รีเซ็ต
        </button>

        <button
          type="button"
          className={s.btnSave}
          onClick={() => toast.success("บันทึกการตั้งค่า (Mock)")}
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
