// LocationField/data.js
import geography from "./geography.json";

// ---------- PROVINCE OPTIONS ----------
export const provinceOptions = Array.from(
  new Map(
    geography.map((row) => [
      row.provinceNameTh,
      { value: row.provinceNameTh, label: row.provinceNameTh },
    ])
  ).values()
).sort((a, b) => a.label.localeCompare(b.label, "th"));

// ---------- DISTRICT OPTIONS (provinceNameTh -> [districts]) ----------
export const districtOptions = geography.reduce((acc, row) => {
  const province = row.provinceNameTh;
  const district = row.districtNameTh;

  if (!acc[province]) acc[province] = [];

  if (!acc[province].some((d) => d.value === district)) {
    acc[province].push({ value: district, label: district });
  }

  return acc;
}, {});

// ---------- SUBDISTRICT OPTIONS (districtNameTh -> [subdistricts]) ----------
export const subdistrictOptions = geography.reduce((acc, row) => {
  const district = row.districtNameTh;
  const subdistrict = row.subdistrictNameTh;

  if (!acc[district]) acc[district] = [];

  if (!acc[district].some((s) => s.value === subdistrict)) {
    acc[district].push({ value: subdistrict, label: subdistrict });
  }

  return acc;
}, {});

// ---------- ZIP MAP (subdistrictNameTh -> postalCode) ----------
export const zipBySubdistrict = geography.reduce((acc, row) => {
  const subdistrict = row.subdistrictNameTh;
  const zip = row.postalCode?.toString() || "";

  // ถ้าชื่อซ้ำหลายแถว ใช้อันแรกพอ
  if (!acc[subdistrict]) {
    acc[subdistrict] = zip;
  }

  return acc;
}, {});
