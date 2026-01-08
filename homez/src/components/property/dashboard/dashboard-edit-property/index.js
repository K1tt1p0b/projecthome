"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { propertyData } from "@/data/propertyData";

import PropertyDescription from "@/components/property/dashboard/dashboard-add-property/property-description";
import LocationField from "@/components/property/dashboard/dashboard-add-property/LocationField";
import DetailsFiled from "@/components/property/dashboard/dashboard-add-property/details-field";
import UploadMedia from "@/components/property/dashboard/dashboard-add-property/upload-media";
import UploadMediaVideoStep from "@/components/property/dashboard/dashboard-add-property/upload-media-video";
import Checkdetailsandconfirm from "@/components/property/dashboard/dashboard-add-property/check-details-and-confirm";

import announcerStatusOptions from "@/components/property/dashboard/dashboard-add-property/property-description/announcerStatusOptions.json";
import listingTypeOptions from "@/components/property/dashboard/dashboard-add-property/property-description/listingTypeOptions.json";
import propertyConditionOptions from "@/components/property/dashboard/dashboard-add-property/property-description/propertyConditionOptions.json";
import propertyTypeOptions from "@/components/property/dashboard/dashboard-add-property/property-description/propertyTypeOptions.json";

/* ---------------------------------------
  Helpers
--------------------------------------- */
const pickValue = (v) => (v && typeof v === "object" ? v.value : v);

const findLabel = (options, value) => {
  if (!value) return "";
  return options?.find((o) => String(o.value) === String(value))?.label ?? value;
};

// map propertyType ไทยเก่า -> value ใหม่
const mapPropertyTypeToValue = (raw) => {
  const v = String(raw ?? "").trim();
  if (!v) return "";

  if (["house-and-land", "land", "condo", "room-rent", "business"].includes(v))
    return v;

  if (v === "บ้านพร้อมที่ดิน" || v === "บ้านและที่ดิน") return "house-and-land";
  if (v === "ที่ดินเปล่า" || v === "ที่ดิน") return "land";
  if (v === "คอนโด" || v === "คอนโดมิเนียม") return "condo";
  if (v === "ห้องเช่า" || v === "เช่าห้อง" || v === "หอพัก") return "room-rent";

  return v;
};

const normalizeListingTypes = (raw) => {
  const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const values = arr.map((x) => pickValue(x)).filter(Boolean);

  return values.map((value) => ({
    value,
    label: findLabel(listingTypeOptions, value) || value,
  }));
};

const normalizeCondition = (raw) => {
  const value = pickValue(raw);
  if (!value) return null;
  return { value, label: findLabel(propertyConditionOptions, value) || value };
};

const normalizePropertyType = (raw) => {
  const value = mapPropertyTypeToValue(pickValue(raw));
  if (!value) return null;
  return { value, label: findLabel(propertyTypeOptions, value) || value };
};

const normalizeAnnouncerStatus = (rawValue, rawLabel) => {
  const v = pickValue(rawValue) || pickValue(rawLabel);
  if (!v) return null;

  const byValue = announcerStatusOptions.find((o) => String(o.value) === String(v));
  if (byValue) return byValue;

  const byLabel = announcerStatusOptions.find((o) => String(o.label) === String(v));
  if (byLabel) return byLabel;

  return { value: v, label: findLabel(announcerStatusOptions, v) || v };
};

const normalizeDetails = (detailsRaw = {}) => {
  const d = detailsRaw || {};
  return {
    amenities: Array.isArray(d.amenities) ? d.amenities : [],
    note: d.note ?? "",

    // บ้านและที่ดิน
    bedrooms: d.bedrooms ?? null,
    bathrooms: d.bathrooms ?? null,
    floors: d.floors ?? d.floor ?? "",
    parking: d.parking ?? null,
    usableArea: d.usableArea ?? "",
    landSqw: d.landSqw ?? d.landSize ?? "",
    frontage: d.frontage ?? "",
    depth: d.depth ?? "",
    roadWidth: d.roadWidth ?? "",

    // เอกสารสิทธิ
    deedNumber: d.deedNumber ?? d.titleDeed ?? "",
    titleDeed: d.titleDeed ?? d.deedNumber ?? "",
    titleDeedImage: d.titleDeedImage ?? null,
    titleDeedImageName: d.titleDeedImageName ?? d.titleDeedImage?.name ?? "",
    titleDeedImages: Array.isArray(d.titleDeedImages)
      ? d.titleDeedImages
      : d.titleDeedImage
      ? [d.titleDeedImage]
      : [],

    // ที่ดินเปล่า
    landFillStatus: d.landFillStatus ?? "",
    zoningColor: d.zoningColor ?? "",

    // คอนโด/ห้องเช่า
    projectName: d.projectName ?? "",
    building: d.building ?? "",
    unitFloor: d.unitFloor ?? d.rentFloor ?? "",
    roomArea: d.roomArea ?? d.roomAreaRent ?? "",
    roomType: d.roomType ?? "",
    condoParking: d.condoParking ?? "",

    // ห้องเช่า legacy
    roomAreaRent: d.roomAreaRent ?? "",
    rentFloor: d.rentFloor ?? "",
    bathroomPrivate: d.bathroomPrivate ?? true,
    internetIncluded: d.internetIncluded ?? false,

    // ค่าน้ำ/ไฟ/ส่วนกลาง
    waterFee: d.waterFee ?? d.waterRate ?? "",
    electricFee: d.electricFee ?? d.electricRate ?? "",
    commonFee: d.commonFee ?? "",
  };
};

const normalizeLocation = (loc) => {
  const l = loc || {};
  const zipcode = l.zipcode ?? l.zipCode ?? l.zip_code ?? "";

  return {
    address: l.address ?? "",
    province: l.province ?? "",
    district: l.district ?? "",
    subdistrict: l.subdistrict ?? "",
    zipCode: zipcode,
    zipcode: zipcode,
    neighborhood: l.neighborhood ?? l.village ?? "",
    latitude: l.lat ?? l.latitude ?? "",
    longitude: l.lng ?? l.longitude ?? "",
    note: l.note ?? "",
  };
};

const normalizeMedia = (p) => {
  const cover = p?.imageSrc || p?.cover || "";
  const gallery = Array.isArray(p?.gallery)
    ? p.gallery
    : Array.isArray(p?.images)
    ? p.images
    : [];
  const images = [cover, ...gallery].filter(Boolean);
  return { cover, gallery, images };
};

const buildLocationSummary = (locationForm) => {
  if (!locationForm) return undefined;
  return {
    address: locationForm.address,
    province: locationForm.province,
    district: locationForm.district,
    subdistrict: locationForm.subdistrict,
    zipCode: locationForm.zipCode ?? locationForm.zipcode ?? "",
    neighborhood: locationForm.neighborhood ?? "",
    latitude: locationForm.latitude,
    longitude: locationForm.longitude,
    note: locationForm.note,
  };
};

/* ---------------------------------------
  Component
--------------------------------------- */
export default function DashboardEditPropertyPage({ propertyId }) {
  const router = useRouter();
  const params = useParams();
  const id = propertyId ?? params?.id;

  // tabs refs (ให้เหมือนหน้าเพิ่ม: 1..6)
  const tabBasicRef = useRef(null);
  const tabLocationRef = useRef(null);
  const tabDetailsRef = useRef(null);
  const tabMediaRef = useRef(null);
  const tabVideoRef = useRef(null);

  const goBasic = () => tabBasicRef.current?.click();
  const goLocation = () => tabLocationRef.current?.click();
  const goDetails = () => tabDetailsRef.current?.click();
  const goMedia = () => tabMediaRef.current?.click();
  const goVideo = () => tabVideoRef.current?.click();
  const goConfirm = () => document.getElementById("nav-item6-tab")?.click();

  // forms state
  const [basicInfoForm, setBasicInfoForm] = useState(null);
  const [locationForm, setLocationForm] = useState(null);
  const [detailsForm, setDetailsForm] = useState(null);
  const [mediaForm, setMediaForm] = useState(null);

  // ✅ เพิ่ม: วิดีโอเหมือนหน้า add
  const [videoForm, setVideoForm] = useState({ urls: [] });

  // cache รายละเอียดตามประเภท
  const detailsCacheRef = useRef({});
  const prevTypeRef = useRef(null);

  // remount keys
  const [basicKey, setBasicKey] = useState(0);
  const [locationKey, setLocationKey] = useState(0);
  const [detailsKey, setDetailsKey] = useState(0);
  const [mediaKey, setMediaKey] = useState(0);

  const [loading, setLoading] = useState(true);

  const listingTypeValues = useMemo(() => {
    const raw = basicInfoForm?.listingTypes ?? [];
    return raw.map((x) => pickValue(x)).filter(Boolean);
  }, [basicInfoForm]);

  const propertyTypeValue = useMemo(
    () => pickValue(basicInfoForm?.propertyType),
    [basicInfoForm]
  );

  // initial load
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const found = propertyData?.find((p) => String(p.id) === String(id));
    if (!found) {
      toast.error("ไม่พบทรัพย์ที่ต้องการแก้ไข");
      setLoading(false);
      return;
    }

    const announcerOpt = normalizeAnnouncerStatus(
      found.announcerStatus,
      found.announcerStatus_label
    );

    const basic = {
      title: found.title ?? "",
      description: found.description ?? "",
      price: found.price ?? "",
      price_text: found.priceText ?? found.price_text ?? "",
      showPrice: found.showPrice ?? (found.price > 0 || !!found.priceText),
      approxPrice: found.approxPrice ?? null,
      approxPrice_label: found.approxPrice_label ?? null,

      announcerStatus: announcerOpt,
      announcerStatus_label: announcerOpt?.label ?? found.announcerStatus_label ?? null,

      listingTypes: normalizeListingTypes(found.listingType ?? found.listingTypes ?? []),
      propertyType: normalizePropertyType(found.propertyType),
      condition: normalizeCondition(found.details?.condition ?? found.condition),
    };

    const loc = normalizeLocation(found.location);

    const ptVal = pickValue(basic.propertyType);
    const det = normalizeDetails(found.details || {});
    const med = normalizeMedia(found);

    setBasicInfoForm(basic);
    setLocationForm(loc);
    setDetailsForm(det);
    setMediaForm(med);

    // ✅ ถ้าคุณมี field วิดีโอใน found จริง ๆ ให้ map ตรงนี้
    // ตัวอย่าง: found.videos = ["url1","url2"]
    const initialVideoUrls = Array.isArray(found?.videos) ? found.videos : [];
    setVideoForm({ urls: initialVideoUrls });

    detailsCacheRef.current = { ...(detailsCacheRef.current || {}), [ptVal]: det };
    prevTypeRef.current = ptVal;

    setBasicKey((k) => k + 1);
    setLocationKey((k) => k + 1);
    setDetailsKey((k) => k + 1);
    setMediaKey((k) => k + 1);

    setLoading(false);
    setTimeout(() => goBasic(), 0);
  }, [id]);

  // ✅ summary แบบเดียวกับหน้า add (ส่งข้อมูลดิบ)
  const basicInfoSummary = basicInfoForm;
  const locationSummary = useMemo(() => buildLocationSummary(locationForm), [locationForm]);
  const detailsSummary = detailsForm;
  const imagesSummary = useMemo(() => {
    if (mediaForm?.images?.length) return mediaForm.images;
    const cover = mediaForm?.cover;
    const gallery = Array.isArray(mediaForm?.gallery) ? mediaForm.gallery : [];
    return [cover, ...gallery].filter(Boolean);
  }, [mediaForm]);

  if (loading) {
    return (
      <div className="ps-widget bgc-white bdrs12 p30">
        <p className="mb0">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <div className="d-flex justify-content-between align-items-center mb20">
        <h3 className="ff-heading fw600 mb0">แก้ไขข้อมูลทรัพย์</h3>
        <button type="button" className="ud-btn btn-light" onClick={() => router.back()}>
          กลับ
        </button>
      </div>

      {/* ✅ Tabs (เรียงเหมือนหน้าเพิ่ม: 1..6) */}
      <nav>
        <div className="nav nav-tabs" id="nav-tab2" role="tablist">
          <button
            ref={tabBasicRef}
            className="nav-link active fw600 ms-3"
            id="nav-item1-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item1"
            type="button"
            role="tab"
            aria-controls="nav-item1"
            aria-selected="true"
          >
            1. หัวข้อทรัพย์
          </button>

          <button
            ref={tabLocationRef}
            className="nav-link fw600"
            id="nav-item2-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item2"
            type="button"
            role="tab"
            aria-controls="nav-item2"
            aria-selected="false"
          >
            2. ที่อยู่ทรัพย์
          </button>

          <button
            ref={tabDetailsRef}
            className="nav-link fw600"
            id="nav-item3-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item3"
            type="button"
            role="tab"
            aria-controls="nav-item3"
            aria-selected="false"
          >
            3. รายละเอียดทรัพย์
          </button>

          <button
            ref={tabMediaRef}
            className="nav-link fw600"
            id="nav-item4-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item4"
            type="button"
            role="tab"
            aria-controls="nav-item4"
            aria-selected="false"
          >
            4. เพิ่มรูปทรัพย์
          </button>

          <button
            ref={tabVideoRef}
            className="nav-link fw600"
            id="nav-item5-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item5"
            type="button"
            role="tab"
            aria-controls="nav-item5"
            aria-selected="false"
          >
            5. วิดีโอทรัพย์สิน
          </button>

          <button
            className="nav-link fw600"
            id="nav-item6-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item6"
            type="button"
            role="tab"
            aria-controls="nav-item6"
            aria-selected="false"
          >
            6. ยืนยัน
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="tab-content" id="nav-tabContent">
        {/* 1 */}
        <div className="tab-pane fade show active" id="nav-item1" role="tabpanel">
          <div className="pt20">
            <PropertyDescription
              key={basicKey}
              initialValue={basicInfoForm}
              onNext={(data) => {
                const prevType = prevTypeRef.current || pickValue(basicInfoForm?.propertyType);
                const nextType = pickValue(data?.propertyType);

                // ถ้าเปลี่ยนประเภท: cache ของเดิมไว้ แล้ว restore ของประเภทใหม่ถ้ามี
                if (prevType && nextType && prevType !== nextType) {
                  if (detailsForm) {
                    detailsCacheRef.current = {
                      ...detailsCacheRef.current,
                      [prevType]: detailsForm,
                    };
                  }

                  const restored = detailsCacheRef.current?.[nextType] ?? null;
                  setDetailsForm(restored);
                  setDetailsKey((k) => k + 1);

                  prevTypeRef.current = nextType;

                  toast.info(
                    restored
                      ? "เปลี่ยนประเภททรัพย์แล้ว: ดึงข้อมูลรายละเอียดเดิม"
                      : "เปลี่ยนประเภททรัพย์แล้ว: ไปกรอก/ตรวจสอบรายละเอียดทรัพย์อีกครั้ง"
                  );

                  setBasicInfoForm(data);

                  // เปลี่ยนประเภทแล้วเด้งไป step 3
                  setTimeout(() => goDetails(), 0);
                  return;
                }

                setBasicInfoForm(data);
                prevTypeRef.current = nextType || prevType;
                goLocation();
              }}
              onSaveDraft={(data) => {
                setBasicInfoForm(data);
                toast.success("บันทึกร่าง (หัวข้อทรัพย์) แล้ว");
              }}
            />
          </div>
        </div>

        {/* 2 */}
        <div className="tab-pane fade" id="nav-item2" role="tabpanel">
          <div className="pt20">
            <LocationField
              key={locationKey}
              propertyType={propertyTypeValue}
              listingTypes={listingTypeValues}
              initialValue={locationForm}
              onBack={goBasic}
              onNext={(data) => {
                setLocationForm(data);
                goDetails();
              }}
              onSaveDraft={(data) => {
                setLocationForm(data);
                toast.success("บันทึกร่าง (ที่อยู่) แล้ว");
              }}
            />
          </div>
        </div>

        {/* 3 */}
        <div className="tab-pane fade" id="nav-item3" role="tabpanel">
          <div className="pt20">
            <DetailsFiled
              key={detailsKey}
              propertyType={propertyTypeValue}
              listingTypes={listingTypeValues}
              initialValue={detailsForm}
              onBack={goLocation}
              onNext={(data) => {
                const t = propertyTypeValue;
                if (t) {
                  detailsCacheRef.current = {
                    ...detailsCacheRef.current,
                    [t]: data,
                  };
                }

                setDetailsForm(data);
                goMedia();
              }}
              onSaveDraft={(data) => {
                const t = propertyTypeValue;
                if (t) {
                  detailsCacheRef.current = {
                    ...detailsCacheRef.current,
                    [t]: data,
                  };
                }
                setDetailsForm(data);
                toast.success("บันทึกร่าง (รายละเอียด) แล้ว");
              }}
            />
          </div>
        </div>

        {/* 4 */}
        <div className="tab-pane fade" id="nav-item4" role="tabpanel">
          <div className="pt20">
            <UploadMedia
              key={mediaKey}
              initialValue={mediaForm}
              onBack={goDetails}
              onNext={(data) => {
                setMediaForm(data);
                goVideo(); // ✅ ไป step 5
              }}
              onSaveDraft={(data) => {
                setMediaForm(data);
                toast.success("บันทึกร่าง (รูปภาพ) แล้ว");
              }}
            />
          </div>
        </div>

        {/* 5 */}
        <div className="tab-pane fade" id="nav-item5" role="tabpanel">
          <div className="pt20">
            <UploadMediaVideoStep
              initialValue={{
                ...(basicInfoForm || {}),
                ...(locationForm || {}),
                ...(detailsForm || {}),
                ...(mediaForm || {}),
                videoUrls: videoForm?.urls || [],
              }}
              onBack={goMedia}
              onNext={(data) => {
                setVideoForm(data || { urls: [] });
                goConfirm(); // ✅ ไป step 6
              }}
              onSaveDraft={(data) => {
                if (data?.urls) setVideoForm(data);
              }}
            />
          </div>
        </div>

        {/* 6 */}
        <div className="tab-pane fade" id="nav-item6" role="tabpanel">
          <div className="pt20">
            <Checkdetailsandconfirm
              basicInfo={basicInfoSummary}
              location={locationSummary}
              details={detailsSummary}
              images={imagesSummary}
              videos={videoForm?.urls || []} // ✅ ส่งวิดีโอจริง
              onEditBasic={goBasic}
              onEditLocation={goLocation}
              onEditDetails={goDetails}
              onEditImages={goMedia}
              onEditVideo={goVideo} // ✅ แก้ไขวิดีโอ
              onSaveDraft={(payload) => {
                console.log("draft edit:", payload);
                toast.success("บันทึกร่างทั้งหมดแล้ว (mock)");
              }}
              onSubmit={(payload) => {
                console.log("submit edit:", payload);
                toast.success("บันทึกการแก้ไขแล้ว (mock)");
                // TODO: call API update
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
