export const PACKAGES = {
  starter: {
    label: "Starter",
    manualFreeText: "ดันฟรี 1 ครั้ง/วัน",
    autoMaxPosts: 1,
    intervalMs: 24 * 60 * 60 * 1000,
    intervalLabel: "1 ครั้ง/วัน",
  },
  pro: {
    label: "Pro",
    manualFreeText: "ดันฟรีทุก 5 ชม.",
    autoMaxPosts: 1,
    intervalMs: 5 * 60 * 60 * 1000,
    intervalLabel: "ทุก 5 ชั่วโมง",
  },
  business: {
    label: "Business",
    manualFreeText: "ดันฟรีทุก 3 ชม.",
    autoMaxPosts: 5,
    intervalMs: 3 * 60 * 60 * 1000,
    intervalLabel: "ทุก 3 ชั่วโมง",
  },
};

export const getPackage = (key = "pro") => PACKAGES[key] || PACKAGES.pro;
