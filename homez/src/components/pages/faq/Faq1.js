const Faq1 = () => {
  const accordionId = "accordionSelling";

  const faqItems = [
    {
      question: "ที่ดินสามารถลดมูลค่าได้หรือไม่?",
      answer:
        "โดยทั่วไปที่ดินมักเพิ่มมูลค่าตามกาลเวลา แต่ขึ้นอยู่กับทำเล การพัฒนาเมือง และสภาพแวดล้อม หากอยู่ในพื้นที่ที่ขาดการพัฒนา มูลค่าอาจไม่เพิ่มได้",
    },
    {
      question: "ซื้อที่ดินเก่า / ยังไม่ถมดีหรือไม่?",
      answer:
        "ที่ดินเก่าหรือที่ยังไม่ถมมักมีราคาถูกกว่า แต่ควรคำนึงถึงค่าถมดิน ค่าปรับพื้นที่ รวมถึงความเสี่ยงเรื่องน้ำท่วมก่อนตัดสินใจ",
    },
    {
      question: "นายหน้าคืออะไร และช่วยอะไรได้บ้าง?",
      answer:
        "นายหน้าช่วยอำนวยความสะดวกในการซื้อขาย เช่น หาทำเล ประเมินราคา ประสานงานผู้ซื้อ–ผู้ขาย และจัดการเอกสารต่าง ๆ",
    },
    {
      question: "สามารถโอนกรรมสิทธิ์เองโดยไม่ผ่านนายหน้าได้ไหม?",
      answer:
        "สามารถทำได้ ผู้ซื้อและผู้ขายสามารถไปดำเนินการที่สำนักงานที่ดินด้วยตนเอง แต่หากไม่สะดวก อาจใช้นายหน้าช่วยดูแลขั้นตอนต่าง ๆ",
    },
  ];

  return (
    <div className="accordion" id={accordionId}>
      {faqItems.map((item, index) => {
        const headingId = `${accordionId}-heading-${index}`;
        const collapseId = `${accordionId}-collapse-${index}`;
        const isFirst = index === 0; // ให้อันแรกเปิดอยู่ตอนโหลดหน้า

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

export default Faq1;
