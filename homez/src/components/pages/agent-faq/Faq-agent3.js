import React from "react";

const Faqagent3 = () => {
    const accordionId = "faq-listing-payment";

    const faqItems = [
        {
            question: "ลงประกาศทรัพย์สินใหม่ ต้องทำอย่างไร?",
            answer: "ไปที่เมนู 'ลงประกาศ' หรือ 'จัดการประกาศ' เลือกแพ็กเกจที่ท่านใช้งานอยู่ กรอกข้อมูลทรัพย์สินให้ครบถ้วน อัปโหลดรูปภาพ และปักหมุดทำเล จากนั้นกดบันทึกเพื่อส่งตรวจสอบ",
        },
        {
            question: "สนใจสมัคร/อัปเกรดแพ็กเกจ ต้องทำอย่างไร?",
            answer: "ท่านสามารถเลือกดูรายละเอียดและสมัครแพ็กเกจได้ที่เมนู 'ราคาและแพ็กเกจ' (Pricing) โดยระบบรองรับการชำระเงินทั้งแบบโอนเงินและบัตรเครดิต เมื่อชำระเรียบร้อยแล้ว สิทธิ์การใช้งานจะปรับให้อัตโนมัติทันที",
        },
        {
            question: "แพ็กเกจรายเดือน และ รายปี ต่างกันอย่างไร?",
            answer: "แพ็กเกจรายปีจะมีความคุ้มค่ามากกว่า โดยท่านจะได้รับส่วนลดพิเศษเมื่อเทียบกับการจ่ายรายเดือน และได้รับสิทธิ์การลงประกาศ (Listing Quota) และสิทธิ์การดันประกาศ (Boost) ที่มากกว่า",
        },
        {
            question: "สิทธิ์การลงประกาศ (Quota) มีวันหมดอายุหรือไม่?",
            answer: "สิทธิ์การใช้งานจะอ้างอิงตามระยะเวลาของแพ็กเกจที่ท่านสมัคร (30 วัน หรือ 365 วัน) หากแพ็กเกจหมดอายุ ประกาศของท่านอาจถูกปิดการแสดงผลชั่วคราว จนกว่าจะมีการต่ออายุแพ็กเกจ",
        },
        {
            question: "ต้องการใบเสร็จรับเงิน/ใบกำกับภาษี?",
            answer: "หลังจากชำระค่าแพ็กเกจเรียบร้อยแล้ว ท่านสามารถดาวน์โหลดใบกำกับภาษีเต็มรูปแบบได้ทันทีที่เมนู 'ประวัติการชำระเงิน' (Payment History)",
        },
        {
            question: "ทำไมประกาศถึงไม่อนุมัติ (Rejected)?",
            answer: "สาเหตุหลักคือ: 1. รูปภาพติดลายน้ำเว็บอื่น 2. ใส่เบอร์โทรในช่องรายละเอียด 3. ปักหมุดผิดตำแหน่ง หรือ 4. เป็นประกาศซ้ำ (Duplicate)",
        }
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

export default Faqagent3;