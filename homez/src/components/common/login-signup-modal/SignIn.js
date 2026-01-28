"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const THEME_COLOR = "#eb6753";

// =========================
// ✅ CAPTCHA Helpers (UI only)
// =========================
function randomCaptchaText(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ตัด O/0/I/1 ออกกันสับสน
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function CaptchaSVG({ text }) {
  const lines = Array.from({ length: 5 }).map((_, i) => {
    const x1 = Math.floor(Math.random() * 30);
    const y1 = Math.floor(Math.random() * 56);
    const x2 = 170 + Math.floor(Math.random() * 30);
    const y2 = Math.floor(Math.random() * 56);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="2"
      />
    );
  });

  const chars = String(text || "").split("");

  return (
    <svg width="200" height="56" viewBox="0 0 200 56" role="img" aria-label="captcha">
      <rect x="0" y="0" width="200" height="56" rx="10" fill="#f7f7f7" />
      {lines}
      <g opacity="0.25">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.floor(Math.random() * 200)}
            cy={Math.floor(Math.random() * 56)}
            r={Math.floor(Math.random() * 2) + 1}
            fill="#000"
          />
        ))}
      </g>

      <g>
        {chars.map((ch, idx) => {
          const x = 18 + idx * 28;
          const y = 36 + (Math.random() * 6 - 3);
          const rotate = Math.random() * 18 - 9;
          return (
            <text
              key={idx}
              x={x}
              y={y}
              fontSize="26"
              fontWeight="700"
              fill="#111"
              style={{ userSelect: "none" }}
              transform={`rotate(${rotate} ${x} ${y})`}
            >
              {ch}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

// =========================

const SignIn = ({ onForgotPassword, onGoRegister }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: "" }
  const [loading, setLoading] = useState(false);

  const [overlay, setOverlay] = useState({
    open: false,
    text: "กำลังดำเนินการ...",
  });

  const openOverlay = (text) =>
    setOverlay({ open: true, text: text || "กำลังดำเนินการ..." });

  const closeOverlay = () =>
    setOverlay((prev) => ({ ...prev, open: false }));

  const disabled = loading || overlay.open;

  // =========================
  // ✅ CAPTCHA (Text in Image, UI-only)
  // =========================
  const [captchaText, setCaptchaText] = useState(() => randomCaptchaText(6));
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaTouched, setCaptchaTouched] = useState(false);

  const refreshCaptcha = () => {
    setCaptchaText(randomCaptchaText(6));
    setCaptchaInput("");
    setCaptchaTouched(false);
    setErrors((prev) => ({ ...prev, captcha: "" }));
    setMessage(null);
  };

  const captchaOk = useMemo(() => {
    return (
      String(captchaInput).trim().toUpperCase() ===
      String(captchaText).toUpperCase()
    );
  }, [captchaInput, captchaText]);

  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!form.password) newErrors.password = "กรุณากรอกรหัสผ่าน";

    const capVal = String(captchaInput).trim();
    if (!capVal) newErrors.captcha = "กรุณากรอกตัวอักษรในภาพ";
    else if (!captchaOk) newErrors.captcha = "Captcha ไม่ถูกต้อง กรุณาลองใหม่";

    setErrors(newErrors);
    return { ok: Object.keys(newErrors).length === 0, newErrors };
  };

  const routeWithLoading = (path, text) => {
    openOverlay(text);
    setTimeout(() => router.push(path), 250);
  };

  const callWithLoading = (fn, text) => {
    openOverlay(text);
    setTimeout(() => {
      fn?.();
      closeOverlay();
    }, 250);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (disabled) return;

    const { ok, newErrors } = validate();

    if (!ok) {
      // ให้โชว์ error ใต้ captcha ทันที
      setCaptchaTouched(true);

      // กล่องแจ้งเตือนด้านบนแบบในรูป (เอาแบบสั้นๆ)
      // ถ้าอยากให้เฉพาะ captcha ก็เปลี่ยน text ตรงนี้ได้
      const topText =
        newErrors?.captcha || "กรุณาตรวจสอบข้อมูลให้ถูกต้อง";

      setMessage({ type: "error", text: topText });
      return;
    }

    setLoading(true);
    openOverlay("กำลังเข้าสู่ระบบ...");

    try {
      await new Promise((r) => setTimeout(r, 600));

      // reset captcha หลัง submit
      refreshCaptcha();

      openOverlay("กำลังพาไปหน้า Dashboard...");
      setTimeout(() => router.replace("/dashboard-verification"), 600);
    } catch {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาด" });
      closeOverlay();
      setLoading(false);
      refreshCaptcha();
    }
  };

  // ✅ ปุ่มเข้าสู่ระบบกดได้เสมอ (disable เฉพาะตอนกำลังโหลด/overlay)
  const submitDisabled = disabled;

  return (
    <>
      {/* Overlay Loader */}
      {overlay.open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(255,255,255,0.85)", zIndex: 9999 }}
        >
          <div className="text-center">
            <div
              className="spinner-border mb15"
              style={{
                width: 48,
                height: 48,
                color: THEME_COLOR,
                borderWidth: 3,
              }}
            />
            <div className="fw600 text-dark">{overlay.text}</div>
          </div>
        </div>
      )}

      <form className="form-style1" onSubmit={handleSignIn}>
        {/* ✅ แจ้งเตือนแบบในรูป */}
        {message && (
          <div
            className={`alert ${
              message.type === "error" ? "alert-danger" : "alert-success"
            } mb20`}
            style={{
              background: message.type === "error" ? "#f8d7da" : undefined,
              borderColor: message.type === "error" ? "#f5c2c7" : undefined,
              color: message.type === "error" ? "#842029" : undefined,
              borderRadius: 6,
              padding: "16px 18px",
            }}
          >
            {message.text}
          </div>
        )}

        <div className="mb25">
          <label className="form-label fw600">อีเมล</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            disabled={disabled}
            placeholder="กรุณากรอกอีเมลของคุณ"
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        <div className="mb15">
          <label className="form-label fw600">รหัสผ่าน</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            disabled={disabled}
            placeholder="กรุณากรอกรหัสผ่านของคุณ"
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}
        </div>

        {/* ✅ CAPTCHA (Text) */}
        <div className="mb15">
          <label className="form-label fw600 d-flex align-items-center justify-content-between">
            <span>ยืนยันว่าไม่ใช่บอท</span>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={refreshCaptcha}
              disabled={disabled}
            >
              เปลี่ยนภาพ
            </button>
          </label>

          <div className="d-flex align-items-center gap-2">
            <div style={{ flex: "0 0 auto" }}>
              <CaptchaSVG text={captchaText} />
            </div>

            <input
              className="form-control"
              placeholder="พิมพ์ตามตัวอักษรในภาพ"
              value={captchaInput}
              onChange={(e) => {
                setCaptchaInput(e.target.value);
                setCaptchaTouched(true);
                setErrors((prev) => ({ ...prev, captcha: "" }));
                setMessage(null);
              }}
              onBlur={() => setCaptchaTouched(true)}
              disabled={disabled}
              autoComplete="off"
            />
          </div>

          {(errors.captcha ||
            (captchaTouched &&
              !captchaOk &&
              captchaInput.trim() !== "")) && (
            <small className="text-danger d-block mt5">
              {errors.captcha || "Captcha ไม่ถูกต้อง"}
            </small>
          )}

          {captchaOk && captchaInput.trim() !== "" && (
            <small className="text-success d-block mt5">Captcha ถูกต้อง</small>
          )}
        </div>

        <div className="checkbox-style1 d-flex justify-content-between mb10">
          <label className="custom_checkbox">
            จำรหัสผ่าน
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              disabled={disabled}
            />
            <span className="checkmark" />
          </label>

          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              typeof onForgotPassword === "function"
                ? callWithLoading(onForgotPassword, "กำลังเปิดหน้าลืมรหัสผ่าน...")
                : routeWithLoading(
                    "/forgot-password",
                    "กำลังพาไปหน้าลืมรหัสผ่าน..."
                  )
            }
            disabled={disabled}
          >
            ลืมรหัสผ่าน?
          </button>
        </div>

        <div className="d-grid mb20">
          <button className="ud-btn btn-thm" type="submit" disabled={submitDisabled}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>

        <p className="text-center">
          ยังไม่ได้เป็นสมาชิก?{" "}
          <button
            type="button"
            className="btn btn-link p-0 fw600"
            onClick={() =>
              typeof onGoRegister === "function"
                ? callWithLoading(onGoRegister, "กำลังเปิดหน้าสมัครสมาชิก...")
                : routeWithLoading("/register", "กำลังพาไปหน้าสมัครสมาชิก...")
            }
            disabled={disabled}
          >
            สร้างบัญชี
          </button>
        </p>
      </form>
    </>
  );
};

export default SignIn;
