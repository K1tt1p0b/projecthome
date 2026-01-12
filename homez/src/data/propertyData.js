export const propertyData = [
  {
    id: 1,

    // ===== ข้อมูลพื้นฐาน (Step 1) =====
    title: "บ้านเดี่ยวสไตล์คันทรี",
    description: "บ้านเดี่ยวบรรยากาศดี เงียบสงบ ใกล้ถนนใหญ่",

    price: 14000000,
    priceText: "14,000,000",

    // ประเภทการประกาศ
    listingTypes: ["sell"],

    // ประเภททรัพย์ (value ใหม่)
    propertyType: "house-and-land",

    // สถานะผู้ประกาศ (Step 1)
    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",

    status: "เผยแพร่แล้ว",
    views: 120,
    datePublished: "31 ธันวาคม 2022",

    // ===== รูป =====
    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg", "/images/listings/list-2.jpg"],

    // ===== ที่ตั้ง (Step 2) =====
    location: {
      address: "คลอง 4",
      province: "ปทุมธานี",
      district: "ธัญบุรี",
      subdistrict: "ประชาธิปัตย์",
      zipCode: "12130",

      latitude: 14.021,
      longitude: 100.732,
      fullText: "คลอง 4 ธัญบุรี ปทุมธานี",

      // หมู่บ้าน / โครงการ
      neighborhood: "หมู่บ้านฟิวเจอร์วิลล์",
    },

    // ===== รายละเอียดทรัพย์ (Step 3) =====
    details: {
      condition: "มือสอง",

      landSqw: 100,
      usableArea: 180,

      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      floors: 2,

      titleDeed: "โฉนด",
      titleDeedImage: "/images/listings/list-2.jpg",

      amenities: ["ที่จอดรถ", "แอร์", "กล้องวงจรปิด"],

      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    // ✅ mock: ไม่มีวิดีโอ
    videos: [],
  },

  {
    id: 2,
    title: "วิลล่าหรู ย่านรีโกพาร์ค",
    description: "วิลล่าหรู ใจกลางเมือง เดินทางสะดวก",

    price: 28000000,
    priceText: "28,000,000",

    listingTypes: ["sell"],
    propertyType: "house-and-land",

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",

    status: "เผยแพร่แล้ว",
    views: 532,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-2.jpg",
    gallery: ["/images/listings/list-2.jpg"],

    location: {
      address: "ซอยลาดพร้าว 18",
      province: "กรุงเทพมหานคร",
      district: "ลาดพร้าว",
      subdistrict: "ลาดพร้าว",
      zipCode: "10230",

      latitude: 13.806,
      longitude: 100.574,
      fullText: "ลาดพร้าว กรุงเทพฯ",

      neighborhood: "Regent Home ลาดพร้าว",
    },

    details: {
      condition: "ใหม่",

      landSqw: 120,
      usableArea: 250,

      bedrooms: 4,
      bathrooms: 4,
      parking: 3,
      floors: 2,

      titleDeed: "โฉนด",
      titleDeedImage: null,

      amenities: ["สระว่ายน้ำ", "ฟิตเนส", "CCTV", "ระบบรักษาความปลอดภัย"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    // ✅ mock: ให้มีวิดีโอแค่โพสต์เดียว (id:2)
    videos: [
      {
        url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        provider: "youtube",
        category: "ทั่วไป",
        createdAt: "2026-01-05T00:00:00.000Z",
      },
    ],
  },

  {
    id: 3,
    title: "วิลล่า บนถนนฮอลลีวูด",
    description: "วิลล่าติดทะเล เหมาะสำหรับพักผ่อน",

    price: 18000000,
    priceText: "18,000,000",

    listingTypes: ["rent"],
    propertyType: "house-and-land",

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",

    status: "กำลังดำเนินการ",
    views: 88,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-3.jpg",
    gallery: ["/images/listings/list-3.jpg"],

    location: {
      address: "ถนนเลียบชายหาด",
      province: "ชลบุรี",
      district: "บางละมุง",
      subdistrict: "นาเกลือ",
      zipCode: "20150",

      latitude: 12.954,
      longitude: 100.889,
      fullText: "บางละมุง ชลบุรี",

      neighborhood: "Hollywood Beach Villa",
    },

    details: {
      condition: "มือสอง",

      landSqw: 90,
      usableArea: 160,

      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      floors: 1,

      titleDeed: "โฉนด",
      titleDeedImage: null,

      amenities: ["วิวทะเล", "ที่จอดรถ"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    // ✅ mock: ไม่มีวิดีโอ
    videos: [],
  },
];
