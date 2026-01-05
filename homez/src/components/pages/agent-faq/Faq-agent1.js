import React from "react";

const FaqAgent1 = () => {
  // เปลี่ยน ID ให้ไม่ซ้ำกับ FAQ ตัวอื่นในหน้าเว็บ
  const accordionId = "accordionAgent";

  const faqItems = [
    {
      question: "ลงประกาศทรัพย์สินใหม่ ต้องทำอย่างไร?",
      answer:
        "ท่านสามารถลงประกาศได้ที่เมนู 'ลงประกาศฟรี' หรือ 'จัดการประกาศ' โดยกรอกรายละเอียด รูปภาพ และปักหมุดทำเลให้ครบถ้วน จากนั้นกดบันทึก ประกาศจะถูกส่งให้ทีมงานตรวจสอบความเรียบร้อยก่อนออนไลน์",
    },
    {
      question: "ทำไมประกาศของฉันถึงยังไม่ขึ้นโชว์ (สถานะรอตรวจสอบ)?",
      answer:
        "เพื่อรักษาคุณภาพของเว็บไซต์ ทีมงานจะใช้เวลาตรวจสอบข้อมูลไม่เกิน 24 ชั่วโมง หากข้อมูลครบถ้วนและไม่ผิดกฎ ประกาศของท่านจะออนไลน์ทันที",
    },
    {
      question: "การ 'ดันประกาศ' (Boost) ช่วยอะไรได้บ้าง?",
      answer:
        "การดันประกาศจะช่วยเลื่อนทรัพย์ของท่านขึ้นไปอยู่อันดับแรกๆ ในหน้าผลการค้นหา ทำให้ลูกค้าเห็นเป็นอันดับแรก เพิ่มโอกาสในการขายได้มากขึ้น โดยจะใช้แพกเกตในการกดดันประกาศแต่ละครั้ง",
    },
    {
      question: "จะดูเบอร์โทรหรือข้อความจากลูกค้าที่สนใจได้ที่ไหน?",
      answer:
        "เมื่อมีลูกค้ากดสนใจ ระบบจะแจ้งเตือนไปที่เมนู 'ข้อความจากผู้สนใจ' ท่านสามารถเข้าไปดูชื่อและเบอร์โทรติดต่อกลับลูกค้าได้ที่นั่น",
    },
  ];

  return (
    <div className="accordion" id={accordionId}>
      {faqItems.map((item, index) => {
        const headingId = `${accordionId}-heading-${index}`;
        const collapseId = `${accordionId}-collapse-${index}`;
        // อันนี้ไม่ต้องเปิดข้อแรก (false) จะได้ดูไม่รก
        const isExpanded = false;

        return (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={headingId}>
              <button
                className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${collapseId}`}
                aria-expanded={isExpanded}
                aria-controls={collapseId}
              >
                {item.question}
              </button>
            </h2>
            <div
              id={collapseId}
              className={`accordion-collapse collapse ${isExpanded ? "show" : ""}`}
              aria-labelledby={headingId}
              data-bs-parent={`#${accordionId}`}
            >
              <div className="accordion-body">
                <div className="mb-0">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAgent1;