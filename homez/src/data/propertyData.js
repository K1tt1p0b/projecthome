export const propertyData = [
  // ======================
  // OWNER_A (ไว้โชว์ใน map-v1)
  // ======================

  {
    id: 1,
    ownerId: "owner_a",
    agentId: "agent_a",
    placeId: "house_pathum_khlong4_001",

    title: "บ้านเดี่ยวสไตล์คันทรี",
    description: "บ้านเดี่ยวบรรยากาศดี เงียบสงบ ใกล้ถนนใหญ่",
    price: 14000000,
    priceText: "14,000,000",
    listingTypes: ["sell"],
    propertyType: "house-and-land",

    // 🔥 เพิ่ม Co-Broke
    acceptCoBroke: true,
    commissionType: "percent",
    commissionValue: 3,

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 120,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg", "/images/listings/list-2.jpg"],

    location: {
      address: "คลอง 4",
      province: "ปทุมธานี",
      district: "ธัญบุรี",
      subdistrict: "ประชาธิปัตย์",
      zipCode: "12130",
      latitude: 14.021,
      longitude: 100.732,
      fullText: "คลอง 4 ธัญบุรี ปทุมธานี",
      neighborhood: "หมู่บ้านฟิวเจอร์วิลล์",
    },

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

    videos: [],
  },

  {
    id: 2,
    ownerId: "owner_a",
    agentId: "agent_a",
    placeId: "house_bkk_ladprao_018_001",

    title: "วิลล่าหรู ย่านรีโกพาร์ค",
    description: "วิลล่าหรู ใจกลางเมือง เดินทางสะดวก",
    price: 28000000,
    priceText: "28,000,000",
    listingTypes: ["sell"],
    propertyType: "house-and-land",

    // 🔥 เพิ่ม Co-Broke
    acceptCoBroke: true,
    commissionType: "amount",
    commissionValue: 100000,

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
    ownerId: "owner_a",
    agentId: "agent_a",
    placeId: "house_chonburi_beach_001",

    title: "วิลล่า บนถนนฮอลลีวูด",
    description: "วิลล่าติดทะเล เหมาะสำหรับพักผ่อน",
    price: 18000000,
    priceText: "18,000,000",
    listingTypes: ["rent"],
    propertyType: "house-and-land",

    // ไม่รับ Co-Broke
    acceptCoBroke: false,

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "ไม่อนุมัติ",
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

    videos: [],
  },

  // ===== Condo: ซ้ำพิกัด (placeId เดียว) แต่คนละห้อง =====
  {
    id: 5,
    ownerId: "owner_a",
    agentId: "agent_a",
    placeId: "condo_mrt_ladprao_A",
    buildingId: "condoA",
    unitNo: "12A-01",
    floor: 12,

    title: "คอนโดติด MRT ลาดพร้าว (ห้อง 12A-01)",
    description: "วิวเมือง ชั้นสูง",
    price: 35000,
    priceText: "35,000",
    listingTypes: ["rent"],
    propertyType: "condo",

    // 🔥 เพิ่ม Co-Broke
    acceptCoBroke: true,
    commissionType: "amount",
    commissionValue: 35000,

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 210,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "รัชดา-ลาดพร้าว",
      province: "กรุงเทพมหานคร",
      district: "ลาดพร้าว",
      subdistrict: "จอมพล",
      zipCode: "10900",
      latitude: 13.8039,
      longitude: 100.5737,
      fullText: "จอมพล ลาดพร้าว กรุงเทพมหานคร",
      neighborhood: "",
    },

    details: {
      condition: "ใหม่",
      landSqw: 0,
      usableArea: 38,
      bedrooms: 1,
      bathrooms: 1,
      parking: 1,
      floors: 1,
      titleDeed: "อาคารชุด",
      titleDeedImage: null,
      amenities: ["ฟิตเนส", "สระว่ายน้ำ"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  {
    id: 13,
    ownerId: "owner_a",
    agentId: "agent_a",
    placeId: "condo_mrt_ladprao_A",
    buildingId: "condoA",
    unitNo: "15B-02",
    floor: 15,

    title: "คอนโดติด MRT ลาดพร้าว (ห้อง 15B-02)",
    description: "ตึกเดียวกันคนละห้อง (mock ซ้ำพิกัด)",
    price: 38000,
    priceText: "38,000",
    listingTypes: ["rent"],
    propertyType: "condo",

    acceptCoBroke: false,

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 90,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-2.jpg",
    gallery: ["/images/listings/list-2.jpg"],

    location: {
      address: "รัชดา-ลาดพร้าว",
      province: "กรุงเทพมหานคร",
      district: "ลาดพร้าว",
      subdistrict: "จอมพล",
      zipCode: "10900",
      latitude: 13.8039, 
      longitude: 100.5737,
      fullText: "จอมพล ลาดพร้าว กรุงเทพมหานคร",
      neighborhood: "",
    },

    details: {
      condition: "ใหม่",
      landSqw: 0,
      usableArea: 34,
      bedrooms: 1,
      bathrooms: 1,
      parking: 1,
      floors: 1,
      titleDeed: "อาคารชุด",
      titleDeedImage: null,
      amenities: ["ฟิตเนส"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  // ===== Room rent: ซ้ำพิกัดได้ (หอเดียวหลายห้อง) =====
  {
    id: 12,
    ownerId: "owner_a",
    agentId: "agent_a",
    placeId: "dorm_pattaya_central_01",
    buildingId: "dorm01",
    unitNo: "305",
    floor: 3,

    title: "ห้องเช่า พัทยา ใจกลางเมือง (ห้อง 305)",
    description: "ใกล้ห้าง เดินทางง่าย",
    price: 18000,
    priceText: "18,000",
    listingTypes: ["rent"],
    propertyType: "room-rent",

    // 🔥 เพิ่ม Co-Broke
    acceptCoBroke: true,
    commissionType: "percent",
    commissionValue: 10,

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 40,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "พัทยากลาง",
      province: "ชลบุรี",
      district: "บางละมุง",
      subdistrict: "หนองปรือ",
      zipCode: "20150",
      latitude: 12.931,
      longitude: 100.882,
      fullText: "หนองปรือ บางละมุง ชลบุรี",
      neighborhood: "",
    },

    details: {
      condition: "มือสอง",
      landSqw: 0,
      usableArea: 28,
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      floors: 1,
      titleDeed: "อาคารชุด",
      titleDeedImage: null,
      amenities: ["แอร์"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  {
    id: 14,
    ownerId: "owner_a",
    agentId: "agent_a",
    placeId: "dorm_pattaya_central_01",
    buildingId: "dorm01",
    unitNo: "405",
    floor: 4,

    title: "ห้องเช่า พัทยา ใจกลางเมือง (ห้อง 405)",
    description: "หอเดียวกันคนละห้อง (mock ซ้ำพิกัด)",
    price: 19500,
    priceText: "19,500",
    listingTypes: ["rent"],
    propertyType: "room-rent",

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 22,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-3.jpg",
    gallery: ["/images/listings/list-3.jpg"],

    location: {
      address: "พัทยากลาง",
      province: "ชลบุรี",
      district: "บางละมุง",
      subdistrict: "หนองปรือ",
      zipCode: "20150",
      latitude: 12.931, // ✅ ซ้ำ
      longitude: 100.882,
      fullText: "หนองปรือ บางละมุง ชลบุรี",
      neighborhood: "",
    },

    details: {
      condition: "มือสอง",
      landSqw: 0,
      usableArea: 30,
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      floors: 1,
      titleDeed: "อาคารชุด",
      titleDeedImage: null,
      amenities: ["แอร์"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  // ======================
  // คนอื่น ๆ (ไว้ให้ home เห็นว่าซ้ำได้หลายคน)
  // ======================

  {
    id: 4,
    ownerId: "owner_b",
    agentId: "agent_b",
    placeId: "house_bkk_ladprao_015_001",

    title: "ทาวน์โฮมใกล้ BTS ลาดพร้าว",
    description: "เดินทางสะดวก ใกล้รถไฟฟ้า",
    price: 6900000,
    priceText: "6,900,000",
    listingTypes: ["sell"],
    propertyType: "house-and-land",

    announcerStatus: "agent",
    announcerStatus_label: "นายหน้า",
    status: "เผยแพร่แล้ว",
    views: 77,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "ลาดพร้าว 15",
      province: "กรุงเทพมหานคร",
      district: "ลาดพร้าว",
      subdistrict: "ลาดพร้าว",
      zipCode: "10230",
      latitude: 13.8056,
      longitude: 100.5752,
      fullText: "ลาดพร้าว ลาดพร้าว กรุงเทพมหานคร",
      neighborhood: "",
    },

    details: {
      condition: "มือสอง",
      landSqw: 22,
      usableArea: 120,
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      floors: 2,
      titleDeed: "โฉนด",
      titleDeedImage: null,
      amenities: ["ที่จอดรถ", "แอร์"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  {
    id: 7,
    ownerId: "owner_c",
    agentId: "agent_c",
    placeId: "land_pathum_futurepark_001",

    title: "ที่ดินเปล่า ใกล้ฟิวเจอร์พาร์ค",
    description: "เหมาะลงทุน/ปลูกบ้าน",
    price: 4800000,
    priceText: "4,800,000",
    listingTypes: ["sell"],
    propertyType: "land",

    announcerStatus: "agent",
    announcerStatus_label: "นายหน้า",
    status: "เผยแพร่แล้ว",
    views: 33,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "รังสิต",
      province: "ปทุมธานี",
      district: "ธัญบุรี",
      subdistrict: "รังสิต",
      zipCode: "12110",
      latitude: 14.036,
      longitude: 100.733,
      fullText: "รังสิต ธัญบุรี ปทุมธานี",
      neighborhood: "",
    },

    details: {
      condition: "มือสอง",
      landSqw: 200,
      usableArea: 0,
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      floors: 0,
      titleDeed: "โฉนด",
      titleDeedImage: null,
      amenities: [],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  {
    id: 9,
    ownerId: "owner_d",
    agentId: "agent_d",
    placeId: "condo_chiangmai_nimman_01",
    buildingId: "cm-condo-01",
    unitNo: "8-12",
    floor: 8,

    title: "คอนโด เมืองเชียงใหม่",
    description: "ใกล้มหาวิทยาลัย",
    price: 23000,
    priceText: "23,000",
    listingTypes: ["rent"],
    propertyType: "condo",

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 45,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "นิมมาน",
      province: "เชียงใหม่",
      district: "เมืองเชียงใหม่",
      subdistrict: "สุเทพ",
      zipCode: "50200",
      latitude: 18.794,
      longitude: 98.967,
      fullText: "สุเทพ เมืองเชียงใหม่ เชียงใหม่",
      neighborhood: "",
    },

    details: {
      condition: "ใหม่",
      landSqw: 0,
      usableArea: 34,
      bedrooms: 1,
      bathrooms: 1,
      parking: 1,
      floors: 1,
      titleDeed: "อาคารชุด",
      titleDeedImage: null,
      amenities: ["ฟิตเนส"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  {
    id: 11,
    ownerId: "owner_e",
    agentId: "agent_e",
    placeId: "house_phuket_patong_01",

    title: "พูลวิลล่า ภูเก็ต ใกล้หาด",
    description: "เหมาะลงทุนปล่อยเช่า",
    price: 35000000,
    priceText: "35,000,000",
    listingTypes: ["sell"],
    propertyType: "house-and-land",

    announcerStatus: "agent",
    announcerStatus_label: "นายหน้า",
    status: "เผยแพร่แล้ว",
    views: 120,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "ป่าตอง",
      province: "ภูเก็ต",
      district: "กะทู้",
      subdistrict: "ป่าตอง",
      zipCode: "83150",
      latitude: 7.89,
      longitude: 98.3,
      fullText: "ป่าตอง กะทู้ ภูเก็ต",
      neighborhood: "",
    },

    details: {
      condition: "ใหม่",
      landSqw: 130,
      usableArea: 260,
      bedrooms: 4,
      bathrooms: 4,
      parking: 2,
      floors: 2,
      titleDeed: "โฉนด",
      titleDeedImage: null,
      amenities: ["สระว่ายน้ำ", "ระบบรักษาความปลอดภัย"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  {
    id: 8,
    ownerId: "owner_f",
    agentId: "agent_f",
    placeId: "house_chonburi_pattaya_02",

    title: "พูลวิลล่า พัทยา เพิ่มอีกหลัง",
    description: "ใกล้ทะเล เหมาะปล่อยเช่า",
    price: 22000000,
    priceText: "22,000,000",
    listingTypes: ["sell"],
    propertyType: "house-and-land",

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 91,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "นาเกลือ",
      province: "ชลบุรี",
      district: "บางละมุง",
      subdistrict: "นาเกลือ",
      zipCode: "20150",
      latitude: 12.9536,
      longitude: 100.8905,
      fullText: "นาเกลือ บางละมุง ชลบุรี",
      neighborhood: "",
    },

    details: {
      condition: "มือสอง",
      landSqw: 110,
      usableArea: 210,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      floors: 2,
      titleDeed: "โฉนด",
      titleDeedImage: null,
      amenities: ["สระว่ายน้ำ", "ที่จอดรถ"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },

  {
    id: 10,
    ownerId: "owner_g",
    agentId: "agent_g",
    placeId: "house_khonkaen_city_01",

    title: "บ้านเดี่ยว ขอนแก่น โซนในเมือง",
    description: "เงียบสงบ ใกล้โรงพยาบาล",
    price: 7900000,
    priceText: "7,900,000",
    listingTypes: ["sell"],
    propertyType: "house-and-land",

    announcerStatus: "owner",
    announcerStatus_label: "เจ้าของทรัพย์",
    status: "เผยแพร่แล้ว",
    views: 60,
    datePublished: "31 ธันวาคม 2022",

    imageSrc: "/images/listings/list-1.jpg",
    gallery: ["/images/listings/list-1.jpg"],

    location: {
      address: "ศิลา",
      province: "ขอนแก่น",
      district: "เมืองขอนแก่น",
      subdistrict: "ศิลา",
      zipCode: "40000",
      latitude: 16.46,
      longitude: 102.83,
      fullText: "ศิลา เมืองขอนแก่น ขอนแก่น",
      neighborhood: "",
    },

    details: {
      condition: "มือสอง",
      landSqw: 60,
      usableArea: 140,
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      floors: 2,
      titleDeed: "โฉนด",
      titleDeedImage: null,
      amenities: ["ที่จอดรถ"],
      note: "",
      frontage: "",
      depth: "",
      roadWidth: "",
    },

    videos: [],
  },
];

export default propertyData;