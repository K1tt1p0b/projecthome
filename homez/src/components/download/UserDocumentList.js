"use client";

const UserDocumentList = () => {
  const documents = [
    {
      id: 1,
      title: "สัญญาจะซื้อจะขายที่ดิน (ฉบับมาตรฐาน)",
      description: "ตัวอย่างสัญญาใช้สำหรับผู้ซื้อ/ผู้ขายทั่วไป",
      category: "สัญญา",
      usage: "ซื้อขาย",
      updatedAt: "01 ธ.ค. 2568",
      fileType: "PDF",
    },
    {
      id: 2,
      title: "สัญญาเช่าที่ดิน",
      description: "ใช้สำหรับกรณีให้เช่าที่ดิน",
      category: "สัญญา",
      usage: "เช่า",
      updatedAt: "15 พ.ย. 2568",
      fileType: "PDF",
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

export default UserDocumentList;
