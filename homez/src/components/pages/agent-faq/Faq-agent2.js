import React from "react";

const FaqAgent2 = () => {
    const accordionId = "faq-account-general"; // ID ต้องไม่ซ้ำกับไฟล์แรก

    const faqItems = [
        {
            question: "วิธีขอเครื่องหมาย 'นายหน้ายืนยันตัวตน' (Verified)?",
            answer: "อัปโหลดเอกสารยืนยันตัวตน (บัตรประชาชน/บัตรนายหน้า) ที่เมนู 'ตั้งค่าบัญชี' > 'ยืนยันตัวตน' ทีมงานจะตรวจสอบภายใน 24 ชม. เพื่อติดป้าย Verified ให้โปรไฟล์ของท่าน",
        },
        {
            question: "จะรู้ได้อย่างไรว่ามีลูกค้าสนใจ (Leads)?",
            answer: (
                <div>
                    เมื่อลูกค้ากดติดต่อ ระบบจะแจ้งเตือนผ่านช่องทางดังนี้:
                    <ul className="mt-2 mb-0 ps-3 list-unstyled">
                        <li className="mb-1">
                            1. <strong>Notification</strong> บนหน้าเว็บ (เมนูข้อความจากผู้สนใจ)
                        </li>
                        <li className="mb-1">
                            2. <strong>อีเมล</strong> ที่ท่านลงทะเบียนไว้
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            question: "ลืมรหัสผ่าน ต้องทำอย่างไร?",
            answer: "กดที่ปุ่ม 'ลืมรหัสผ่าน' ในหน้าเข้าสู่ระบบ ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปทางอีเมลที่ท่านลงทะเบียนไว้",
        },
        {
            question: "ต้องการเปลี่ยนเบอร์โทรศัพท์ในระบบ?",
            answer: "เพื่อความปลอดภัยของบัญชี หากต้องการเปลี่ยนเบอร์โทรหลัก กรุณาติดต่อทีมงาน Support หรือแจ้งผ่าน Line Official ของเรา",
        },
        {
            question: "เจอเบอร์โทรแปลกๆ หรือมิจฉาชีพ?",
            answer: "หากสงสัยว่าเป็นมิจฉาชีพ ห้ามโอนเงินหรือให้ข้อมูลส่วนตัวเด็ดขาด และกรุณากดปุ่ม 'รายงานผู้ใช้' (Report) เพื่อให้ทีมงานตรวจสอบทันที",
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

export default FaqAgent2;