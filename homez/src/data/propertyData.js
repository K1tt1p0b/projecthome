export const propertyData = [
  {
    id: 1,

    // ===== ข้อมูลพื้นฐาน (อิงของเดิม) =====
    title: "บ้านเดี่ยวสไตล์คันทรี",
    price: 14000000,
    priceText: "14,000,000",
    listingType: "ขาย",
    propertyType: "บ้านพร้อมที่ดิน",
    status: "รอตรวจสอบ",
    views: 120,

    // ===== รูป =====
    imageSrc: "/images/listings/list-1.jpg",
    gallery: [
      "/images/listings/list-1.jpg",
      "/images/listings/list-2.jpg",
    ],

    // ===== ที่ตั้ง (แตกจาก location string เดิม) =====
    location: {
      province: "ปทุมธานี",
      district: "ธัญบุรี",
      subdistrict: "ประชาธิปัตย์",
      address: "คลอง 4",
      latitude: 14.021,
      longitude: 100.732,
      fullText: "คลอง 4 ธัญบุรี ปทุมธานี",
    },

    // ===== รายละเอียดทรัพย์ =====
    details: {
      landSize: 100, // ตร.ว.
      usableArea: 180, // ตร.ม.
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      floor: 2,
      condition: "มือสอง",
    },

    // ===== สิ่งอำนวยความสะดวก =====
    amenities: ["ที่จอดรถ", "แอร์", "กล้องวงจรปิด"],

    // ===== อื่น ๆ =====
    description: "บ้านเดี่ยวบรรยากาศดี เงียบสงบ ใกล้ถนนใหญ่",
    datePublished: "31 ธันวาคม 2022",
  },

  {
    id: 2,
    title: "วิลล่าหรู ย่านรีโกพาร์ค",
    price: 28000000,
    priceText: "28,000,000",
    listingType: "ขาย",
    propertyType: "บ้านพร้อมที่ดิน",
    status: "เผยแพร่แล้ว",
    views: 532,

    imageSrc: "/images/listings/list-2.jpg",
    gallery: ["/images/listings/list-2.jpg"],

    location: {
      province: "กรุงเทพมหานคร",
      district: "ลาดพร้าว",
      subdistrict: "ลาดพร้าว",
      address: "ซอยลาดพร้าว 18",
      latitude: 13.806,
      longitude: 100.574,
      fullText: "ลาดพร้าว กรุงเทพฯ",
    },

    details: {
      landSize: 120,
      usableArea: 250,
      bedrooms: 4,
      bathrooms: 4,
      parking: 3,
      floor: 2,
      condition: "ใหม่",
    },

    amenities: ["สระว่ายน้ำ", "ฟิตเนส", "CCTV", "ระบบรักษาความปลอดภัย"],

    description: "วิลล่าหรู ใจกลางเมือง เดินทางสะดวก",
    datePublished: "31 ธันวาคม 2022",
  },

  {
    id: 3,
    title: "วิลล่า บนถนนฮอลลีวูด",
    price: 18000000,
    priceText: "18,000,000",
    listingType: "เช่า",
    propertyType: "บ้านพร้อมที่ดิน",
    status: "กำลังดำเนินการ",
    views: 88,

    imageSrc: "/images/listings/list-3.jpg",
    gallery: ["/images/listings/list-3.jpg"],

    location: {
      province: "ชลบุรี",
      district: "บางละมุง",
      subdistrict: "นาเกลือ",
      address: "ถนนเลียบชายหาด",
      latitude: 12.954,
      longitude: 100.889,
      fullText: "บางละมุง ชลบุรี",
    },

    details: {
      landSize: 90,
      usableArea: 160,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      floor: 1,
      condition: "มือสอง",
    },

    amenities: ["วิวทะเล", "ที่จอดรถ"],

    description: "วิลล่าติดทะเล เหมาะสำหรับพักผ่อน",
    datePublished: "31 ธันวาคม 2022",
  },
];
