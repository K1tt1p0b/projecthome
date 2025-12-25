const KEY = "mock_banners_v1";

export const defaultBanners = [
  {
    id: "bn_1001",
    title: "Hero Banner หน้าแรก",
    position: "หน้าแรก",
    status: "active",
    linkUrl: "/listing",
    startAt: "2025-12-20",
    endAt: "2026-01-15",
    imageUrl: "/images/listings/list-1.jpg",
    clicks: 83,
    views: 1240,
  },
  {
    id: "bn_1002",
    title: "แบนเนอร์แพ็กเกจสมาชิก",
    position: "Pricing",
    status: "paused",
    linkUrl: "/pricing",
    startAt: "2025-12-01",
    endAt: "2026-02-01",
    imageUrl: "/images/listings/list-2.jpg",
    clicks: 12,
    views: 410,
  },
];

export function loadBanners() {
  if (typeof window === "undefined") return defaultBanners;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultBanners));
      return defaultBanners;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultBanners;
    return parsed;
  } catch {
    return defaultBanners;
  }
}

export function saveBanners(next) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function addBanner(payload) {
  const current = loadBanners();
  const created = {
    ...payload,
    id: `bn_${Math.floor(1000 + Math.random() * 9000)}`,
    clicks: 0,
    views: 0,
  };
  const next = [created, ...current];
  saveBanners(next);
  return created;
}

export function updateBanner(id, patch) {
  const current = loadBanners();
  const next = current.map((b) => (b.id === id ? { ...b, ...patch, id } : b));
  saveBanners(next);
  return next.find((b) => b.id === id);
}

export function removeBanner(id) {
  const current = loadBanners();
  const next = current.filter((b) => b.id !== id);
  saveBanners(next);
  return true;
}
