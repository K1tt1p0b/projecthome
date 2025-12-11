"use client";

const UserDocumentList = ({ searchTerm, typeFilter, usageFilter }) => {
  const documents = [
    {
      id: 1,
      title: "สัญญาจะซื้อจะขายที่ดิน (ฉบับมาตรฐาน)",
      description: "ตัวอย่างสัญญาใช้สำหรับผู้ซื้อ/ผู้ขายทั่วไป",
      category: "สัญญา",
      usage: "ซื้อขาย",
      updatedAt: "01 ธ.ค. 2568",
      fileType: "PDF",
      previewUrl: "/docs/example1.pdf",
      downloadUrl: "/docs/example1.pdf",
    },
    {
      id: 2,
      title: "สัญญาเช่าที่ดิน",
      description: "ใช้สำหรับกรณีให้เช่าที่ดิน",
      category: "สัญญา",
      usage: "เช่า",
      updatedAt: "15 พ.ย. 2568",
      fileType: "PDF",
      previewUrl: "/docs/example2.pdf",
      downloadUrl: "/docs/example2.pdf",
    },
  ];

  const term = searchTerm.trim().toLowerCase();

  const filteredDocs = documents.filter((doc) => {
    // filter ตามคำค้น
    if (
      term &&
      !`${doc.title} ${doc.description}`.toLowerCase().includes(term)
    ) {
      return false;
    }

    // filter ตามประเภทเอกสาร
    if (typeFilter && doc.category !== typeFilter) {
      return false;
    }

    // filter ตามการใช้งาน
    if (usageFilter && doc.usage !== usageFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="document-list">
      {/* header row */}
      <div className="row fw600 border-bottom py-2 d-none d-md-flex fz14">
        <div className="col-md-3">ชื่อเอกสาร</div>
        <div className="col-md-2">ประเภทเอกสาร</div>
        <div className="col-md-2">การใช้งาน</div>
        <div className="col-md-2">อัปเดตล่าสุด</div>
        <div className="col-md-3 text-md-end">ไฟล์</div>
      </div>

      {filteredDocs.length === 0 && (
        <div className="py-4 text-center text-muted fz14">
          ไม่พบเอกสารตามเงื่อนไขที่เลือก
        </div>
      )}

      {filteredDocs.map((doc) => (
        <div
          key={doc.id}
          className="row align-items-center py-3 border-bottom document-item"
        >
          {/* ชื่อเอกสาร */}
          <div className="col-md-3 mb-2 mb-md-0">
            <div className="d-flex">
              <span className="flaticon-new-tab me-3 mt-1" />
              <div>
                <p className="fw600 mb-1">{doc.title}</p>
                <p className="text-muted fz14 mb-0">{doc.description}</p>
              </div>
            </div>
          </div>

          {/* ประเภท */}
          <div className="col-md-2 mb-1 mb-md-0 fz14">
            <span className="badge bg-light text-dark">{doc.category}</span>
          </div>

          {/* การใช้งาน */}
          <div className="col-md-2 mb-1 mb-md-0 fz14">{doc.usage}</div>

          {/* อัปเดตล่าสุด */}
          <div className="col-md-2 mb-1 mb-md-0 fz14">{doc.updatedAt}</div>

          {/* ปุ่มไฟล์ */}
          <div className="col-md-3 text-md-end">
            <div className="d-flex justify-content-md-end justify-content-start gap-2">
              {/* ดูตัวอย่าง */}
              <a
                href={doc.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ud-btn btn-white"
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  padding: "10px 20px",
                }}
              >
                ดูตัวอย่าง
              </a>

              {/* ดาวน์โหลด */}
              <a
                href={doc.downloadUrl}
                download
                className="ud-btn btn-thm"
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  padding: "10px 20px",
                }}
              >
                ดาวน์โหลด ({doc.fileType})
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDocumentList;
