"use client";

import { useEffect, useMemo, useState } from "react";
import agents from "@/data/agents";
import Image from "next/image";
import Link from "next/link";

const Agents = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc | name-desc
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 12; // จำนวน agent ต่อหน้า

  const filteredAgents = useMemo(() => {
    let list = [...agents];

    // ค้นหาตามชื่อ / id
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((agent) => {
        return (
          agent.name.toLowerCase().includes(q) ||
          String(agent.id).toLowerCase().includes(q)
        );
      });
    }

    // เรียงตามชื่อ A→Z หรือ Z→A
    list.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name, "th");
      } else {
        return b.name.localeCompare(a.name, "th");
      }
    });

    return list;
  }, [search, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAgents.length / PER_PAGE)
  );
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedAgents = useMemo(() => {
    const start = (currentPageSafe - 1) * PER_PAGE;
    return filteredAgents.slice(start, start + PER_PAGE);
  }, [filteredAgents, currentPageSafe]);

  // เวลาเปลี่ยน search / sort ให้เด้งกลับมาหน้า 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  return (
    <section className="our-agent pt-0">
      {/* แถบค้นหา + sort */}
      <div className="row align-items-center mb20">
        <div className="col-md-6">
          <p className="text-muted mb-0 fz14">
            พบ {filteredAgents.length} คน • หน้า {currentPageSafe} /{" "}
            {totalPages}
          </p>
        </div>

        <div className="col-md-6">
          <div className="d-flex gap-2 justify-content-md-end mt-3 mt-md-0">
            {/* ช่องค้นหา */}
            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาชื่อนายหน้า หรือรหัส..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* เลือกการเรียง */}
            <select
              className="form-select"
              style={{ maxWidth: 180 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">ชื่อ A → Z</option>
              <option value="name-desc">ชื่อ Z → A</option>
            </select>
          </div>
        </div>
      </div>

      {/* กริดรายการ Agent */}
      <div className="row">
        {paginatedAgents.map((agent) => (
          <div
            key={agent.id}
            className="col-6 col-sm-4 col-md-3 col-xl-2 mb30"
          >
            <Link
              href={`/agent-single/${agent.id}`}
              className="text-decoration-none"
            >
              <div className="team-style1 h-100">
                <div className="team-img">
                  <Image
                    width={217}
                    height={248}
                    className="w-100 h-100 cover"
                    src={agent.image}
                    alt={agent.name}
                  />
                </div>
                <div className="team-content pt15 text-center">
                  <h6 className="name mb-1 text-truncate">{agent.name}</h6>
                  <p className="text fz13 mb-0">{agent.city}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {!paginatedAgents.length && (
          <div className="col-12">
            <p className="text-center text-muted mt-3">
              ไม่พบนายหน้าที่ตรงกับคำค้นหา
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="row mt20">
          <div className="col-12 d-flex align-items-center justify-content-center">
            {/* Prev */}
            <button
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: 32, height: 32 }}
              onClick={() =>
                setCurrentPage((p) => (p > 1 ? p - 1 : p))
              }
              disabled={currentPageSafe === 1}
            >
              <i className="fa-regular fa-chevron-left" />
            </button>

            {/* ตัวเลขหน้า */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = page === currentPageSafe;
              return (
                <button
                  key={page}
                  className={`btn rounded-circle me-1 ${
                    isActive ? "text-white" : "btn-light"
                  }`}
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    background: isActive ? "#E95E4A" : undefined,
                  }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center ms-1"
              style={{ width: 32, height: 32 }}
              onClick={() =>
                setCurrentPage((p) =>
                  p < totalPages ? p + 1 : p
                )
              }
              disabled={currentPageSafe === totalPages}
            >
              <i className="fa-regular fa-chevron-right" />
            </button>
          </div>
        </div>
      )}
      {/* END PAGINATION */}
    </section>
  );
};

export default Agents;
