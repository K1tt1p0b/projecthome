const Faq2 = () => {
  const accordionId = "accordionRenting";

  const faqItems = [
    {
      question: "ต้องสมัครสมาชิกก่อนถึงจะลงประกาศได้ไหม?",
      answer:
        "ผู้ใช้ต้องสมัครสมาชิกและยืนยันตัวตนก่อน เพื่อความน่าเชื่อถือของประกาศและความปลอดภัยของผู้ใช้งานคนอื่น",
    },
    {
      question: "ประกาศต้องรออนุมัติก่อนขึ้นหน้าเว็บหรือไม่?",
      answer:
        "ใช่ ทุกประกาศจะผ่านการตรวจสอบความถูกต้องและความเหมาะสมของเนื้อหา ก่อนแสดงผลบนหน้าเว็บ",
    },
    {
      question: "ระบบแนะนำที่ดินใกล้ฉันทำงานอย่างไร?",
      answer:
        "ระบบจะใช้ตำแหน่ง GPS ของผู้ใช้ (เมื่อได้รับอนุญาต) เพื่อค้นหาประกาศที่อยู่ในระยะใกล้เคียง โดยไม่เก็บข้อมูลตำแหน่งถาวรเพื่อความเป็นส่วนตัว",
    },
    {
      question: "สามารถแก้ไขข้อมูลประกาศหลังโพสต์ได้ไหม?",
      answer:
        "สามารถแก้ไขข้อมูล รายละเอียด ราคา และรูปภาพของประกาศได้ แต่บางครั้งอาจต้องผ่านการตรวจสอบใหม่ก่อนแสดงผลอีกครั้ง",
    },
  ];

  return (
    <div className="accordion" id={accordionId}>
      {faqItems.map((item, index) => {
        const headingId = `${accordionId}-heading-${index}`;
        const collapseId = `${accordionId}-collapse-${index}`;
        const isFirst = index === 0;

        return (
          <div className="accordion-item" key={collapseId}>
            <h2 className="accordion-header" id={headingId}>
              <button
                className={`accordion-button ${isFirst ? "" : "collapsed"} fw-semibold`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${collapseId}`}
                aria-expanded={isFirst ? "true" : "false"}
                aria-controls={collapseId}
              >
                {item.question}
              </button>
            </h2>

            <div
              id={collapseId}
              className={`accordion-collapse collapse ${isFirst ? "show" : ""}`}
              aria-labelledby={headingId}
              data-bs-parent={`#${accordionId}`}
            >
              <div className="accordion-body">
                <p className="mb-0">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Faq2;
