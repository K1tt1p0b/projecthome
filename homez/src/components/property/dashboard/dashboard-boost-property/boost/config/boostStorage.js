export const LS_AUTO = "landx_boost_auto_v1";
export const LS_MANUAL = "landx_boost_manual_v1";

// =====================
// AUTO (ดันทันทีต่อเนื่อง)
// =====================
// - activePropertyId   : โพสที่กำลังดันอยู่
// - queuedPropertyId   : โพสในคิว (ได้ 1)
// - activeStartedAt    : เวลาเริ่มดัน
// - cooldownEndAt      : เวลาที่จะดันรอบถัดไป
// - cancelAfterCooldown: กดยกเลิกแล้ว (รอจบรอบ)
// - packageKey         : แพ็กที่ใช้
//
export const AUTO_FALLBACK = {
  enabled: false,
  packageKey: "",
  activePropertyId: "",
  queuedPropertyId: "",
  activeStartedAt: 0,
  cooldownEndAt: 0,
  cancelAfterCooldown: false,
  items: {},
  queue: [],
  order: [],
};

// =====================
// Helpers
// =====================

/**
 * อ่าน LocalStorage แบบ safe
 */
export const readLS = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

/**
 * เขียน LocalStorage
 */
export const writeLS = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/**
 * ล้าง AUTO ทั้งหมด (ใช้ตอน logout / reset)
 */
export const clearAutoBoost = () => {
  writeLS(LS_AUTO, { ...AUTO_FALLBACK });
};

/**
 * ยกเลิกดันต่อเนื่อง
 * - ถ้า force = true → หยุดทันที
 * - ถ้า force = false → หยุดหลังจบรอบ
 */
export const cancelAutoBoost = ({ force = false } = {}) => {
  const raw = readLS(LS_AUTO, AUTO_FALLBACK);

  if (!raw?.activePropertyId) return raw;

  // ยกเลิกทันที
  if (force) {
    const next = {
      ...AUTO_FALLBACK,
      enabled: false,
    };
    writeLS(LS_AUTO, next);
    return next;
  }

  // ยกเลิกหลังจบรอบ
  const next = {
    ...raw,
    cancelAfterCooldown: true,
  };

  writeLS(LS_AUTO, next);
  return next;
};

/**
 * เมื่อถึงเวลา cooldown
 * (เรียกจาก worker / interval)
 *
 * - ถ้ามี queue → สลับ Active
 * - ถ้าไม่มี queue → ดัน Active เดิมต่อ
 * - ถ้า cancelAfterCooldown → หยุด
 */
export const runAutoCycle = ({ now = Date.now(), intervalMs = 0 } = {}) => {
  const raw = readLS(LS_AUTO, AUTO_FALLBACK);

  if (!raw?.enabled || !raw?.activePropertyId) return raw;
  if (raw.cooldownEndAt && now < raw.cooldownEndAt) return raw;

  // ถ้ากดยกเลิกไว้ → หยุด
  if (raw.cancelAfterCooldown) {
    const next = {
      ...AUTO_FALLBACK,
      enabled: false,
    };
    writeLS(LS_AUTO, next);
    return next;
  }

  // มีคิว → สลับ
  if (raw.queuedPropertyId) {
    const next = {
      enabled: true,
      packageKey: raw.packageKey,

      activePropertyId: raw.queuedPropertyId,
      queuedPropertyId: "",

      activeStartedAt: now,
      cooldownEndAt: now + intervalMs,

      cancelAfterCooldown: false,
    };

    writeLS(LS_AUTO, next);
    return next;
  }

  // ดันโพสเดิมต่อ
  const next = {
    ...raw,
    cooldownEndAt: now + intervalMs,
  };

  writeLS(LS_AUTO, next);
  return next;
};
