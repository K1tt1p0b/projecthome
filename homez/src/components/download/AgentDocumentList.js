"use client";

const AgentDocumentList = () => {
  const documents = [
    {
      id: 1,
      title: "สัญญาแต่งตั้งนายหน้า (Exclusive)",
      description: "ใช้เมื่อเจ้าของแต่งตั้งนายหน้าแต่เพียงผู้เดียว",
      category: "สัญญา",
      usage: "ซื้อขาย",
      updatedAt: "10 ธ.ค. 2568",
      fileType: "PDF",
    },
    {
      id: 2,
      title: "แบบฟอร์มบันทึกข้อมูลผู้ซื้อ/ผู้ขาย",
      description: "ใช้เก็บข้อมูลลูกค้าสำหรับ Agent",
      category: "แบบฟอร์ม",
      usage: "ทั่วไป",
      updatedAt: "18 พ.ย. 2568",
      fileType: "XLSX",
    },
  ];

  return (
    <div className="document-list">
      <div className="row fw600 border-bottom py-2 d-none d-md-flex fz14">
        <div className="col-md-4">ชื่อเอกสาร</div>
        <div className="col-md-2">ประเภทเอกสาร</div>
        <div className="col-md-2">การใช้งาน</div>
        <div className="col-md-2">อัปเดตล่าสุด</div>
        <div className="col-md-2 text-md-end">ไฟล์</div>
      </div>

      {documents.map((doc) => (
        <div
          key={doc.id}
          className="row align-items-center py-3 border-bottom document-item"
        >
          <div className="col-md-4">
            <div className="d-flex">
              <span className="flaticon-new-tab me-3 mt-1" />
              <div>
                <p className="fw600 mb-1">{doc.title}</p>
                <p className="text-muted fz14 mb-0">{doc.description}</p>
              </div>
            </div>
          </div>

          <div className="col-md-2 fz14">
            <span className="badge bg-light text-dark">{doc.category}</span>
          </div>

          <div className="col-md-2 fz14">{doc.usage}</div>

          <div className="col-md-2 fz14">{doc.updatedAt}</div>

          <div className="col-md-2 text-md-end">
            <button className="ud-btn btn-thm">
              ดาวน์โหลด ({doc.fileType})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentDocumentList;
