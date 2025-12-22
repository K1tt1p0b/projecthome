"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertyData } from "@/data/propertyData";
import { toast } from "react-toastify";

import geography from "@/components/property/dashboard/dashboard-add-property/LocationField/geography.json";
import AmenitiesEdit from "./AmenitiesEdit";
import Map from "./Map";

const CONDITION_OPTIONS = [
  { value: "ใหม่", label: "ใหม่" },
  { value: "เหมือนใหม่", label: "เหมือนใหม่" },
  { value: "ปรับปรุงใหม่", label: "ปรับปรุงใหม่" },
  { value: "มือสอง", label: "มือสอง" },
];

// normalize geography.json ให้เป็น { provinceTh: { districtTh: { subdistrictTh: zipcode } } }
function normalizeGeography(raw) {
  const out = {};
  if (!Array.isArray(raw)) return out;

  raw.forEach((r) => {
    const province = r.provinceNameTh;
    const district = r.districtNameTh;
    const subdistrict = r.subdistrictNameTh;
    const zipcode = r.postalCode ? String(r.postalCode) : "";

    if (!province || !district || !subdistrict) return;

    if (!out[province]) out[province] = {};
    if (!out[province][district]) out[province][district] = {};
    out[province][district][subdistrict] = zipcode;
  });

  return out;
}

// ---------- media helper ----------
const readAsURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });

const DashboardEditProperty = () => {
  const router = useRouter();
  const params = useParams();

  const GEO = useMemo(() => normalizeGeography(geography), []);

  const id = useMemo(() => {
    const raw = params?.id;
    const val = Array.isArray(raw) ? raw[0] : raw;
    if (val == null) return null;

    // รองรับ id เป็นทั้ง "1" หรือ 1
    const num = Number(val);
    return Number.isFinite(num) ? num : String(val);
  }, [params]);

  // หาแบบชัวร์: กัน id string vs number
  const found = useMemo(() => {
    if (id == null) return null;
    return propertyData.find((p) => String(p.id) === String(id)) ?? null;
  }, [id]);

  const [form, setForm] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [galleryPreview, setGalleryPreview] = useState([]);

  // loading ปุ่มล่าง (บันทึก/ยกเลิก)
  const [saving, setSaving] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!found) return;

    // รองรับ found.location เป็น string หรือ object
    const locationObj =
      typeof found.location === "string"
        ? {
            province: "",
            district: "",
            subdistrict: "",
            address: found.location,
            zipcode: "",
            latitude: "",
            longitude: "",
            fullText: found.location,
          }
        : {
            province: found.location?.province ?? "",
            district: found.location?.district ?? "",
            subdistrict: found.location?.subdistrict ?? "",
            address: found.location?.address ?? "",
            zipcode: found.location?.zipcode ?? found.location?.postalCode ?? "",
            fullText: found.location?.fullText ?? "",
            latitude: found.location?.latitude ?? "",
            longitude: found.location?.longitude ?? "",
          };

    const detailsObj = found.details ?? {
      landSize: "",
      usableArea: "",
      bedrooms: "",
      bathrooms: "",
      parking: "",
      floor: "",
      condition: "",
    };

    const next = {
      id: found.id,

      // basic
      title: found.title ?? "",
      propertyType: found.propertyType ?? "",
      listingType: found.listingType ?? "",
      price: found.price ?? "",
      status: found.status ?? "",
      description: found.description ?? "",

      // location
      location: locationObj,

      // details
      details: {
        landSize: detailsObj.landSize ?? "",
        usableArea: detailsObj.usableArea ?? "",
        bedrooms: detailsObj.bedrooms ?? "",
        bathrooms: detailsObj.bathrooms ?? "",
        parking: detailsObj.parking ?? "",
        floor: detailsObj.floor ?? "",
        condition: detailsObj.condition ?? "",
      },

      // media
      imageSrc: found.imageSrc ?? "",
      gallery: found.gallery ?? [],

      // amenities (string[])
      amenities: found.amenities ?? [],
    };

    // auto-fill zipcode ตอนเข้า page (ถ้ามีจังหวัด/เขต/แขวงครบ แต่ zipcode ยังว่าง)
    const p = next.location?.province;
    const d = next.location?.district;
    const s = next.location?.subdistrict;
    if (p && d && s && !next.location?.zipcode) {
      const z = GEO?.[p]?.[d]?.[s] ?? "";
      if (z) next.location.zipcode = z;
    }

    setForm(next);
    setCoverPreview(next.imageSrc || "");
    setGalleryPreview(next.gallery || []);
  }, [found, GEO]);

  // ===== update helper =====
  const update = (path, value) => {
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      let ref = next;

      for (let i = 0; i < path.length - 1; i++) {
        ref[path[i]] = { ...ref[path[i]] };
        ref = ref[path[i]];
      }

      ref[path[path.length - 1]] = value;
      return next;
    });
  };

  // ===== geography selects =====
  const provinces = useMemo(() => Object.keys(GEO || {}), [GEO]);

  const districts = useMemo(() => {
    const p = form?.location?.province;
    if (!p) return [];
    const obj = GEO[p];
    return obj ? Object.keys(obj) : [];
  }, [form?.location?.province, GEO]);

  const subdistricts = useMemo(() => {
    const p = form?.location?.province;
    const d = form?.location?.district;
    if (!p || !d) return [];
    const obj = GEO[p]?.[d];
    return obj ? Object.keys(obj) : [];
  }, [form?.location?.province, form?.location?.district, GEO]);

  const syncZipcode = (p, d, s) => {
    const z = GEO?.[p]?.[d]?.[s] ?? "";
    update(["location", "zipcode"], z);
  };

  const onProvinceChange = (p) => {
    update(["location", "province"], p);
    update(["location", "district"], "");
    update(["location", "subdistrict"], "");
    update(["location", "zipcode"], "");
  };

  const onDistrictChange = (d) => {
    update(["location", "district"], d);
    update(["location", "subdistrict"], "");
    update(["location", "zipcode"], "");
  };

  const onSubdistrictChange = (s) => {
    update(["location", "subdistrict"], s);
    // กันกรณี form ยัง null ช่วงแรก
    const p = form?.location?.province || "";
    const d = form?.location?.district || "";
    if (p && d) syncZipcode(p, d, s);
  };

  // ===== media =====
  const onCoverFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readAsURL(file);
    setCoverPreview(url);
    update(["imageSrc"], url);
  };

  const onGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await Promise.all(files.map(readAsURL));
    setGalleryPreview((prev) => [...prev, ...urls]);
    update(["gallery"], [...(form.gallery || []), ...urls]);
  };

  const removeGalleryAt = (idx) => {
    setGalleryPreview((prev) => prev.filter((_, i) => i !== idx));
    update(
      ["gallery"],
      (form.gallery || []).filter((_, i) => i !== idx)
    );
  };

  // ===== map =====
  const latNum = Number(form?.location?.latitude);
  const lngNum = Number(form?.location?.longitude);
  const hasLatLng = Number.isFinite(latNum) && Number.isFinite(lngNum);

  // Property Type Config (ต้องตรงกับ propertyData)
  const PROPERTY_TYPE_CONFIG = useMemo(
    () => ({
      "บ้านพร้อมที่ดิน": {
        fields: [
          "landSize",
          "usableArea",
          "bedrooms",
          "bathrooms",
          "parking",
          "floor",
          "condition",
        ],
      },
      "ที่ดินเปล่า": { fields: ["landSize"] },
      "คอนโด": {
        fields: ["usableArea", "bedrooms", "bathrooms", "floor", "condition"],
      },
      "ห้องเช่า": { fields: ["usableArea", "bedrooms", "bathrooms", "floor"] },
    }),
    []
  );

  const PROPERTY_TYPE_OPTIONS = useMemo(
    () => Object.keys(PROPERTY_TYPE_CONFIG),
    [PROPERTY_TYPE_CONFIG]
  );

  const selectedConfig = form?.propertyType
    ? PROPERTY_TYPE_CONFIG[form.propertyType]
    : null;

  // ใช้สำหรับ disable ปุ่ม
  const isFormComplete = useMemo(() => {
    if (!form) return false;

    // required: basic
    if (!String(form.propertyType || "").trim()) return false;
    if (!String(form.listingType || "").trim()) return false;
    if (!String(form.details?.condition || "").trim()) return false;

    if (!String(form.title || "").trim()) return false;
    if (!String(form.price || "").trim()) return false;

    // required: location
    const loc = form.location || {};
    if (!String(loc.province || "").trim()) return false;
    if (!String(loc.district || "").trim()) return false;
    if (!String(loc.subdistrict || "").trim()) return false;
    if (!String(loc.address || "").trim()) return false;

    // required: media (บังคับรูปหน้าปก)
    if (!String(form.imageSrc || "").trim()) return false;

    // required: details ตามประเภท
    if (selectedConfig?.fields?.length) {
      for (const f of selectedConfig.fields) {
        if (!String(form.details?.[f] || "").trim()) return false;
      }
    }

    return true;
  }, [form, selectedConfig]);

  // validate แล้ว toast.warn
  const validateWithToast = () => {
    if (!String(form?.propertyType || "").trim())
      return toast.warn("กรุณาเลือกประเภททรัพย์ *"), false;
    if (!String(form?.listingType || "").trim())
      return toast.warn("กรุณาเลือกประเภทประกาศ *"), false;
    if (!String(form?.details?.condition || "").trim())
      return toast.warn("กรุณาเลือกสภาพทรัพย์ *"), false;

    if (!String(form?.title || "").trim())
      return toast.warn("กรุณากรอกชื่อประกาศ *"), false;
    if (!String(form?.price || "").trim())
      return toast.warn("กรุณากรอกราคา *"), false;

    const loc = form?.location || {};
    if (!String(loc.province || "").trim())
      return toast.warn("กรุณาเลือกจังหวัด *"), false;
    if (!String(loc.district || "").trim())
      return toast.warn("กรุณาเลือกอำเภอ/เขต *"), false;
    if (!String(loc.subdistrict || "").trim())
      return toast.warn("กรุณาเลือกตำบล/แขวง *"), false;
    if (!String(loc.address || "").trim())
      return toast.warn("กรุณากรอกที่อยู่ *"), false;

    if (!String(form?.imageSrc || "").trim())
      return toast.warn("กรุณาอัปโหลดรูปหน้าปก *"), false;

    if (selectedConfig?.fields?.length) {
      for (const f of selectedConfig.fields) {
        if (!String(form?.details?.[f] || "").trim()) {
          return (
            toast.warn("กรุณากรอกรายละเอียดทรัพย์ให้ครบตามประเภททรัพย์ *"),
            false
          );
        }
      }
    }

    return true;
  };

  //  handle submit + loading
  const handleSubmit = async () => {
    if (!validateWithToast()) return;

    try {
      setSaving(true);

      // mock save (ถ้ามี API จริง เปลี่ยนตรงนี้เป็น fetch/axios ได้เลย)
      await new Promise((r) => setTimeout(r, 700));

      console.log("UPDATED DATA:", form);

      toast.success("บันทึกการแก้ไขเรียบร้อย");
      router.back();
    } catch (e) {
      console.error(e);
      toast.error("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="p-4">
        <h5>ไม่พบข้อมูลประกาศ</h5>
        <button
          className="btn btn-outline-secondary"
          onClick={() => router.back()}
        >
          ย้อนกลับ
        </button>
      </div>
    );
  }

  const busy = saving || canceling;

  return (
    <form
      className="p-3 p-md-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        await handleSubmit();
      }}
    >
      {/* ===== ข้อมูลพื้นฐาน ===== */}
      <h5 className="mb-3">ข้อมูลพื้นฐาน</h5>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">ประเภททรัพย์ *</label>
          <select
            className="form-select"
            value={form.propertyType || ""}
            onChange={(e) => update(["propertyType"], e.target.value)}
            disabled={busy}
          >
            <option value="">-- เลือก --</option>
            {PROPERTY_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">ประเภทประกาศ *</label>
          <select
            className="form-select"
            value={form.listingType || ""}
            onChange={(e) => update(["listingType"], e.target.value)}
            disabled={busy}
          >
            <option value="">-- เลือก --</option>
            <option value="ขาย">ขาย</option>
            <option value="เช่า">เช่า</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">สภาพทรัพย์ *</label>
          <select
            className="form-select"
            value={form.details.condition || ""}
            onChange={(e) => update(["details", "condition"], e.target.value)}
            disabled={busy}
          >
            <option value="">-- เลือก --</option>
            {CONDITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">สถานะ (แอดมินเป็นผู้อนุมัติ)</label>
          <input
            className="form-control"
            value={form.status || ""}
            disabled
            readOnly
          />
          <div className="text-muted small mt-1" style={{ fontSize: 13 }}>
            สถานะประกาศจะถูกกำหนดโดยแอดมินหลังจากตรวจสอบข้อมูล
          </div>
        </div>

        <div className="col-12">
          <label className="form-label">ชื่อประกาศ *</label>
          <input
            className="form-control"
            value={form.title || ""}
            onChange={(e) => update(["title"], e.target.value)}
            disabled={busy}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ราคา *</label>
          <input
            className="form-control"
            value={form.price || ""}
            onChange={(e) => update(["price"], e.target.value)}
            disabled={busy}
          />
        </div>

        <div className="col-12">
          <label className="form-label">รายละเอียด *</label>
          <textarea
            className="form-control"
            rows={4}
            value={form.description || ""}
            onChange={(e) => update(["description"], e.target.value)}
            disabled={busy}
          />
        </div>
      </div>

      {/* ===== ที่ตั้งทรัพย์ ===== */}
      <h5 className="mb-3">ที่ตั้งทรัพย์</h5>
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">จังหวัด *</label>
          <select
            className="form-select"
            value={form.location.province || ""}
            onChange={(e) => onProvinceChange(e.target.value)}
            disabled={busy}
          >
            <option value="">-- เลือกจังหวัด --</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">อำเภอ/เขต *</label>
          <select
            className="form-select"
            value={form.location.district || ""}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={busy || !form.location.province}
          >
            <option value="">-- เลือกอำเภอ/เขต --</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">ตำบล/แขวง *</label>
          <select
            className="form-select"
            value={form.location.subdistrict || ""}
            onChange={(e) => onSubdistrictChange(e.target.value)}
            disabled={busy || !form.location.district}
          >
            <option value="">-- เลือกตำบล/แขวง --</option>
            {subdistricts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">รหัสไปรษณีย์</label>
          <input
            className="form-control"
            value={form.location.zipcode || ""}
            onChange={(e) => update(["location", "zipcode"], e.target.value)}
            disabled={busy}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ที่อยู่ *</label>
          <input
            className="form-control"
            value={form.location.address || ""}
            onChange={(e) => update(["location", "address"], e.target.value)}
            disabled={busy}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Latitude</label>
          <input
            className="form-control"
            value={form.location.latitude || ""}
            onChange={(e) => update(["location", "latitude"], e.target.value)}
            disabled={busy}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Longitude</label>
          <input
            className="form-control"
            value={form.location.longitude || ""}
            onChange={(e) => update(["location", "longitude"], e.target.value)}
            disabled={busy}
          />
        </div>
      </div>

      <div className="mb-4" style={{ borderRadius: 12, overflow: "hidden" }}>
        <Map
          lat={hasLatLng ? latNum : 13.9869}
          lng={hasLatLng ? lngNum : 100.6184}
          zoom={14}
        />
      </div>

      {/* ===== รูปภาพ ===== */}
      <h5 className="mb-3">รูปภาพ</h5>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">รูปหน้าปก *</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={onCoverFile}
            disabled={busy}
          />
          {(coverPreview || form.imageSrc) && (
            <div className="mt-2">
              <img
                src={coverPreview || form.imageSrc}
                alt="cover"
                style={{
                  width: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">แกลเลอรี่รูป</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            multiple
            onChange={onGalleryFiles}
            disabled={busy}
          />

          {galleryPreview?.length > 0 && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {galleryPreview.map((src, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={src}
                    alt={`gallery-${idx}`}
                    style={{
                      width: 120,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      padding: "2px 6px",
                      lineHeight: 1,
                    }}
                    onClick={() => removeGalleryAt(idx)}
                    disabled={busy}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== รายละเอียดทรัพย์ ===== */}
      <h5 className="mb-3">รายละเอียดทรัพย์</h5>

      {!form?.propertyType && (
        <div className="alert alert-warning">
          กรุณาเลือกประเภททรัพย์ก่อนเพื่อแสดงฟิลด์รายละเอียดที่เกี่ยวข้อง
        </div>
      )}

      {form?.propertyType && !selectedConfig && (
        <div className="alert alert-danger">
          ประเภททรัพย์นี้ไม่มีการตั้งค่าฟิลด์: <b>{form.propertyType}</b>
          <br />
          กรุณาตรวจสอบ <code>PROPERTY_TYPE_CONFIG</code> ให้ตรงกับข้อมูลใน{" "}
          <code>propertyData</code>
        </div>
      )}

      {selectedConfig && (
        <div className="row g-3 mb-4" key={form.propertyType}>
          {selectedConfig.fields.includes("landSize") && (
            <div className="col-md-3">
              <label className="form-label">ขนาดที่ดิน (ตร.ว.) *</label>
              <input
                className="form-control"
                value={form.details.landSize || ""}
                onChange={(e) =>
                  update(["details", "landSize"], e.target.value)
                }
                disabled={busy}
              />
            </div>
          )}

          {selectedConfig.fields.includes("usableArea") && (
            <div className="col-md-3">
              <label className="form-label">พื้นที่ใช้สอย (ตร.ม.) *</label>
              <input
                className="form-control"
                value={form.details.usableArea || ""}
                onChange={(e) =>
                  update(["details", "usableArea"], e.target.value)
                }
                disabled={busy}
              />
            </div>
          )}

          {selectedConfig.fields.includes("bedrooms") && (
            <div className="col-md-2">
              <label className="form-label">ห้องนอน *</label>
              <input
                className="form-control"
                value={form.details.bedrooms || ""}
                onChange={(e) =>
                  update(["details", "bedrooms"], e.target.value)
                }
                disabled={busy}
              />
            </div>
          )}

          {selectedConfig.fields.includes("bathrooms") && (
            <div className="col-md-2">
              <label className="form-label">ห้องน้ำ *</label>
              <input
                className="form-control"
                value={form.details.bathrooms || ""}
                onChange={(e) =>
                  update(["details", "bathrooms"], e.target.value)
                }
                disabled={busy}
              />
            </div>
          )}

          {selectedConfig.fields.includes("parking") && (
            <div className="col-md-2">
              <label className="form-label">ที่จอดรถ *</label>
              <input
                className="form-control"
                value={form.details.parking || ""}
                onChange={(e) =>
                  update(["details", "parking"], e.target.value)
                }
                disabled={busy}
              />
            </div>
          )}

          {selectedConfig.fields.includes("floor") && (
            <div className="col-md-2">
              <label className="form-label">ชั้น *</label>
              <input
                className="form-control"
                value={form.details.floor || ""}
                onChange={(e) => update(["details", "floor"], e.target.value)}
                disabled={busy}
              />
            </div>
          )}
        </div>
      )}

      {/* ===== Amenities ===== */}
      <h5 className="mb-3">สิ่งอำนวยความสะดวก</h5>
      <AmenitiesEdit
        value={form.amenities || []}
        onChange={(newValue) => update(["amenities"], newValue)}
      />

      {/* ===== Buttons ===== */}
      <div className="d-flex justify-content-end gap-3 mt-5">
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={busy}
          onClick={async () => {
            try {
              setCanceling(true);
              // mock เล็กน้อยให้เห็น spinner (optional)
              await new Promise((r) => setTimeout(r, 300));
              router.back();
            } finally {
              setCanceling(false);
            }
          }}
          style={{
            border: "1px solid #EB6753",
            color: "#EB6753",
            backgroundColor: "#fff",
            padding: "10px 22px",
            borderRadius: 12,
            fontWeight: 500,
            transition: "all .2s ease",
            opacity: busy ? 0.6 : 1,
            cursor: busy ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (busy) return;
            e.currentTarget.style.backgroundColor = "#EB6753";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            if (busy) return;
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.color = "#EB6753";
          }}
        >
          {canceling ? <span className="fas fa-spinner fa-spin me-2" /> : null}
          ยกเลิก
        </button>

        {/* wrapper เพื่อให้คลิกแล้วเตือนได้ “แน่นอน” แม้ปุ่ม disabled */}
        <div
          onClick={() => {
            if (busy) return;
            if (!isFormComplete)
              toast.warn("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน");
          }}
          style={{ display: "inline-block" }}
        >
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!isFormComplete || busy}
            style={{
              backgroundColor: "#EB6753",
              color: "#fff",
              padding: "10px 26px",
              borderRadius: 12,
              fontWeight: 600,
              border: "none",
              boxShadow:
                !isFormComplete || busy
                  ? "none"
                  : "0 6px 16px rgba(235,103,83,.35)",
              transition: "all .2s ease",
              opacity: !isFormComplete || busy ? 0.6 : 1,
              cursor: !isFormComplete || busy ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isFormComplete || busy) return;
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(235,103,83,.45)";
            }}
            onMouseLeave={(e) => {
              if (!isFormComplete || busy) return;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(235,103,83,.35)";
            }}
          >
            {saving ? <span className="fas fa-spinner fa-spin me-2" /> : null}
            บันทึกการแก้ไข
          </button>
        </div>
      </div>
    </form>
  );
};

export default DashboardEditProperty;
