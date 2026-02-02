export const homeItems = [];

export const listingItems = [
  {
    title: "สินทรัพย์",
    submenu: [
      { label: "ทั้งหมด", href: "/grid-full-3-col" },
      { label: "บ้านพร้อมที่ดิน", href: "/grid-full-3-col?category=house-and-land" },
      { label: "คอนโด", href: "/grid-full-3-col?category=condo" },
      { label: "ที่ดินเปล่า", href: "/grid-full-3-col?category=land" },
      { label: "ห้องเช่า", href: "/grid-full-3-col?category=room-rent" },
    ],
  },
  {
    title: "บริการเพิ่มเติม",
    submenu: [
      { label: "รับถมที่ดิน", href: "/services/land-fill" },
      { label: "รับล้อมรั้ว", href: "/services/fencing" },
      { label: "ต่อเติม/รีโนเวท", href: "/services/renovate" },
      { label: "ตอกเสาเข็ม", href: "/services/piling" },
    ],
  },
  {
    title: "คอร์สเรียน",
    submenu: [{ label: "คอร์สเรียน", href: "/courses" }],
  },
];

export const propertyItems = [
  {
    label: "Agents",
    subMenuItems: [
      { label: "Agents", href: "/agents" },
      { label: "Agent Single", href: "/agent-single/1" },
      { label: "Agency", href: "/agency" },
      { label: "Agency Single", href: "/agency-single/1" },
    ],
  },

  {
    label: "Single Style",
    subMenuItems: [
      { label: "Single V1", href: "/single-v1/1" },
      { label: "Single V2", href: "/single-v2/1" },
      { label: "Single V3", href: "/single-v3/1" },
      { label: "Single V4", href: "/single-v4/1" },
      { label: "Single V5", href: "/single-v5/1" },
      { label: "Single V6", href: "/single-v6/1" },
      { label: "Single V7", href: "/single-v7/1" },
      { label: "Single V8", href: "/single-v8/1" },
      { label: "Single V9", href: "/single-v9/1" },
      { label: "Single V10", href: "/single-v10/1" },
    ],
  },
  {
    label: "Dashboard",
    subMenuItems: [
      { label: "Dashboard Home", href: "/dashboard-home" },
      { label: "Message", href: "/dashboard-message" },
      { label: "New Property", href: "/dashboard-add-property" },
      { label: "My Properties", href: "/dashboard-my-properties" },
      { label: "My Favorites", href: "/dashboard-my-favourites" },
      { label: "Saved Search", href: "/dashboard-saved-search" },
      { href: "/pricing", label: "Pricing" },
      { label: "My Package", href: "/dashboard-my-package" },
      { label: "My Profile", href: "/dashboard-my-profile" },
    ],
  },
];

export const blogItems = [
  { href: "/blog-list-v1", label: "Blog List V1" },
  { href: "/blog-list-v2", label: "Blog List V2" },
  { href: "/blog-list-v3", label: "Blog List V3" },
  { href: "/blogs/2", label: "Blog Single" },
];

export const pageItems = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/compare", label: "Compate" },
  { href: "/faq", label: "FAQ" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/not-found", label: "404" },
  { href: "/invoice", label: "Invoice" },
  { href: "/download-documents", label: "ดาวน์โหลดเอกสาร" },
];

export const faqItems = [
  { href: "/faq", label: "FAQ" },
  { href: "/faq-single", label: "FAQ Single" },
];
