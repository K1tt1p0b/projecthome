export function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function readLS(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  const parsed = raw ? safeParse(raw) : null;
  return parsed && typeof parsed === "object" ? parsed : fallback;
}

export function writeLS(key, val) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(val ?? {}));
}

export function pad2(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function formatCountdown(ms) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}ชม ${pad2(m)}น ${pad2(s)}วิ`;
  return `${m}น ${pad2(s)}วิ`;
}

export function getEnabledIds(store) {
  return Object.keys(store?.items || {});
}
