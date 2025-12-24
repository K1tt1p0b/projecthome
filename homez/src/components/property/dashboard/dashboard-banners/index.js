"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import s from "./banner.module.css";

import { loadBanners, updateBanner, removeBanner } from "./storage";

const statusBadgeClass = (status) =>
  status === "active" ? "pending-style style2" : "pending-style style1";

const statusText = (status) => (status === "active" ? "ใช้งานอยู่" : "พักไว้");

const rangeText = (a, b) => (!a && !b ? "-" : `${a || "-"} • ${b || "-"}`);

const FALLBACK_IMG = "/images/listings/list-1.jpg"; // ✅ ต้องมีอยู่ใน public

export default function BannerDashboardContent() {
  const router = useRouter();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [pos, setPos] = useState("");
  const [tab, setTab] = useState("all"); // all | active | paused

  useEffect(() => {
    setLoading(true);
    const data = loadBanners();
    setBanners(data);
    setLoading(false);
  }, []);

  const positions = useMemo(() => {
    const set = new Set(banners.map((b) => b.position).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [banners]);

  const stats = useMemo(() => {
    const total = banners.length;
    const active = banners.filter((b) => b.status === "active").length;
    const paused = banners.filter((b) => b.status === "paused").length;
    return { total, active, paused };
  }, [banners]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return banners.filter((b) => {
      const matchTab = tab === "all" ? true : b.status === tab;
      const matchPos = !pos || b.position === pos;

      const matchQ =
        !query ||
        (b.title || "").toLowerCase().includes(query) ||
        (b.position || "").toLowerCase().includes(query) ||
        (b.linkUrl || "").toLowerCase().includes(query);

      return matchTab && matchPos && matchQ;
    });
  }, [banners, q, pos, tab]);

  const goCreate = () => router.push("/dashboard-banners/new");

  const refresh = () => setBanners(loadBanners());

  const toggle = (b) => {
    const next = b.status === "active" ? "paused" : "active";
    const ok = confirm(`${next === "paused" ? "พัก" : "เปิด"}แบนเนอร์ "${b.title}" ?`);
    if (!ok) return;

    updateBanner(b.id, { status: next });
    refresh();
  };

  const remove = (b) => {
    const ok = confirm(`ลบแบนเนอร์ "${b.title}" ?`);
    if (!ok) return;

    removeBanner(b.id);
    refresh();
  };

  return (
    <div className={s.wrap}>
      {/* Top */}
      <div className={s.top}>
        <div className={s.brand}>
          <span className={s.icon}>
            <i className="flaticon-diamond" />
          </span>
          <div>
            <div className={s.h1}>Banner Manager</div>
            <div className={s.sub}>จัดการแบนเนอร์เพื่อโปรโมท (สไตล์ Homez)</div>
          </div>
        </div>

        <button className="ud-btn btn-thm" onClick={goCreate} type="button">
          <i className="flaticon-new-tab" style={{ marginRight: 8 }} />
          เพิ่มแบนเนอร์
        </button>
      </div>

      {/* Summary + Tabs */}
      <div className={s.summaryRow}>
        <div className={s.summary}>
          <div className={s.sum}>
            <div className={s.sumIc}>
              <i className="flaticon-images" />
            </div>
            <div>
              <div className={s.sumLbl}>ทั้งหมด</div>
              <div className={s.sumVal}>{stats.total}</div>
            </div>
          </div>

          <div className={s.sum}>
            <div className={`${s.sumIc} ${s.dim}`}>
              <i className="flaticon-like" />
            </div>
            <div>
              <div className={s.sumLbl}>ใช้งาน</div>
              <div className={s.sumVal}>{stats.active}</div>
            </div>
          </div>

          <div className={s.sum}>
            <div className={`${s.sumIc} ${s.dim}`}>
              <i className="flaticon-clock" />
            </div>
            <div>
              <div className={s.sumLbl}>พักไว้</div>
              <div className={s.sumVal}>{stats.paused}</div>
            </div>
          </div>
        </div>

        <div className={s.tabs}>
          {[
            ["all", "ทั้งหมด"],
            ["active", "ใช้งาน"],
            ["paused", "พักไว้"],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={`${s.tab} ${tab === k ? s.active : ""}`}
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={s.filters}>
        <div className={s.filterGrid}>
          <div>
            <label className={s.label}>ค้นหา</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="flaticon-search" />
              </span>
              <input
                className="form-control"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ชื่อ/ตำแหน่ง/ลิงก์..."
              />
            </div>
          </div>

          <div>
            <label className={s.label}>ตำแหน่ง</label>
            <select className="form-control" value={pos} onChange={(e) => setPos(e.target.value)}>
              <option value="">ทั้งหมด</option>
              {positions
                .filter(Boolean)
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
          </div>

          <div className={s.filterActions}>
            <button
              className="ud-btn btn-white2 w-100"
              type="button"
              onClick={() => {
                setQ("");
                setPos("");
                setTab("all");
              }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>

        <div className={s.foot}>
          แสดงผล <b>{list.length}</b> รายการ
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={s.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${s.card} ${s.skel}`}>
              <div className={s.cover} />
              <div className={s.body}>
                <div className={s.line} />
                <div className={`${s.line} ${s.line2}`} />
                <div className={s.pill} />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIc}>
            <i className="flaticon-images" />
          </div>
          <div className={s.emptyTitle}>ยังไม่มีแบนเนอร์</div>
          <div className={s.emptySub}>กด “เพิ่มแบนเนอร์” เพื่อเริ่มสร้างได้เลย</div>
          <div style={{ marginTop: 12 }}>
            <button className="ud-btn btn-thm" onClick={goCreate} type="button">
              <i className="flaticon-new-tab" style={{ marginRight: 8 }} />
              เพิ่มแบนเนอร์
            </button>
          </div>
        </div>
      ) : (
        <div className={s.grid}>
          {list.map((b) => {
            const src = b?.image?.dataUrl || FALLBACK_IMG;

            return (
              <div key={b.id} className={s.card}>
                <div className={s.coverWrap}>
                  <Image
                    src={src}
                    alt={b.title || "banner"}
                    width={1200}
                    height={600}
                    className={s.coverImg}
                    unoptimized={src.startsWith("data:")}
                  />
                  <div className={s.ov} />
                  <div className={s.badges}>
                    <span className={statusBadgeClass(b.status)}>{statusText(b.status)}</span>
                    <span className={s.chip}>
                      <i className="flaticon-location" /> {b.position}
                    </span>
                  </div>
                </div>

                <div className={s.body}>
                  <div className={s.titleRow}>
                    <div className={s.title} title={b.title}>
                      {b.title}
                    </div>

                    <div className={s.quick}>
                      <button
                        className={s.qbtn}
                        onClick={() =>
                          alert("ถ้าจะทำหน้าแก้ไข แนะนำทำ route /dashboard-banners/[id]/edit")
                        }
                        type="button"
                        title="แก้ไข"
                      >
                        <i className="flaticon-review" />
                      </button>

                      <button
                        className={s.qbtn}
                        onClick={() => toggle(b)}
                        type="button"
                        title={b.status === "active" ? "พัก" : "เปิด"}
                      >
                        <i className="flaticon-settings" />
                      </button>

                      <button
                        className={`${s.qbtn} ${s.danger}`}
                        onClick={() => remove(b)}
                        type="button"
                        title="ลบ"
                      >
                        <i className="flaticon-bin" />
                      </button>
                    </div>
                  </div>

                  <div className={s.meta}>
                    <div>
                      <i className="flaticon-clock" /> {rangeText(b.startAt, b.endAt)}
                    </div>
                    <div>
                      <i className="flaticon-share" />{" "}
                      <Link href={b.linkUrl} className={s.link} title={b.linkUrl}>
                        {b.linkUrl}
                      </Link>
                    </div>
                  </div>

                  <div className={s.stats}>
                    <div>
                      <div className={s.k}>Views</div>
                      <div className={s.v}>{b.views}</div>
                    </div>
                    <div>
                      <div className={s.k}>Clicks</div>
                      <div className={s.v}>{b.clicks}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
