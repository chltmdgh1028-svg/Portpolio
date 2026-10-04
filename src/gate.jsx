import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { contacts, screens } from "./data";
import { preloadRoute } from "./routes";
import { useGo } from "./transition";
import { Shot, useDocTitle, useHoverCapable, usePointerVars } from "./ui";
import "./gate.css";

// UI fragments (sanitized demo screenshots, cropped): each sits on its own depth plane.
const FRAGMENTS = [
  { key: "ops", cls: "f-ops", src: screens.oneOps, name: "ONE OPS", tag: "EXPAND OPERATIONS" },
  { key: "dash", cls: "f-dash", src: screens.dashboard, name: "OPERATIONS DASHBOARD", tag: "MONITOR & DECIDE", eager: true },
  { key: "app", cls: "f-app", src: screens.inspectionApp, name: "INSPECTION APP", tag: "FIELD OPERATIONS" },
  { key: "report", cls: "f-report", src: screens.reportGenerator, name: "REPORT GENERATOR", tag: "AUTOMATED REPORTING" },
];

// Ambient typography floating in the empty space around the hero.
//   x/y: desktop position (% of the viewport), mx/my: mobile position (omit -> hidden on mobile)
//   d: parallax depth (px), dur: drift duration (s), dx/dy/r: drift travel (px / deg), op: resting opacity
const AMBIENT = [
  { t: "MONITOR", x: 88, y: 6, fs: 13, op: 0.35, d: 8, dur: 15, dx: 7, dy: -6, r: 1.2, accent: true },
  { t: "4 PRODUCTS", x: 45, y: 7, fs: 19, op: 0.18, d: 3, dur: 18, dx: 6, dy: 5, r: -0.8 },
  { t: "FIELD OPERATIONS", x: 3, y: 29, fs: 10, op: 0.3, d: 3, dur: 13, dx: -5, dy: 6, r: 1 },
  { t: "CAPTURE", x: 8, y: 44, fs: 13, op: 0.35, d: 8, dur: 16, dx: -7, dy: 8, r: -1.4, mx: 7, my: 11, accent: true },
  { t: "EXPAND", x: 15, y: 62, fs: 12, op: 0.3, d: 5, dur: 12, dx: 8, dy: -5, r: 1.6, mx: 7, my: 77 },
  { t: "AUTOMATION", x: 35, y: 80, fs: 11, op: 0.3, d: 5, dur: 17, dx: 6, dy: 7, r: -1.1 },
  { t: "8+ YEARS", x: 32, y: 88, fs: 22, op: 0.17, d: 3, dur: 9, dx: -5, dy: -6, r: 0.9 },
  { t: "REPORT", x: 87, y: 66, fs: 13, op: 0.33, d: 8, dur: 14, dx: 6, dy: 7, r: -1.2, mx: 71, my: 77 },
  { t: "FIELD → DATA → DECISION", x: 66, y: 74, fs: 10.5, op: 0.34, d: 5, dur: 11, dx: -6, dy: -5, r: 1.1, accent: true },
  { t: "FIELD OPERATIONS", x: 7, y: 17.5, fs: 10, op: 0.3, d: 3, dur: 13, dx: -4, dy: 5, r: 1, mx: 7, my: 17.5, mobileOnly: true },
];

function GateContact({ className }) {
  return (
    <nav className={`gate-contact ${className}`} aria-label="연락처">
      <p className="gc-title">CONTACT</p>
      <a href={`mailto:${contacts.email}`}>
        <small>EMAIL</small>
        <span>{contacts.email}</span>
        <ArrowUpRight size={12} aria-hidden="true" />
      </a>
      <a href={contacts.phoneHref}>
        <small>PHONE</small>
        <span>{contacts.phone}</span>
        <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    </nav>
  );
}

export default function Gate() {
  const root = useRef(null);
  const joinRef = useRef(null);
  const ambRef = useRef(null);
  const go = useGo();
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const [hot, setHot] = useState("");
  const [joining, setJoining] = useState(false);
  useDocTitle("Seungho Choi — Product · Operations · Retail · Automation");
  usePointerVars(root, { enabled: hover && !reduce });

  // One pointer handler / one rAF: JOIN magnetic pull (cursor within ~90px) and the faint
  // proximity lift of the ambient words (cursor within ~240px, +0.12 opacity at most).
  useEffect(() => {
    const el = joinRef.current;
    const amb = ambRef.current;
    if (!el || !hover || reduce) return undefined;
    let frame = 0;
    let px = -9999;
    let py = -9999;
    let centers = [];
    const measure = () => {
      centers = [...(amb?.children ?? [])].map((n) => ({ n, x: n.offsetLeft + n.offsetWidth / 2, y: n.offsetTop + n.offsetHeight / 2 }));
    };
    measure();
    const apply = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const ex = Math.max(Math.abs(dx) - r.width / 2, 0);
      const ey = Math.max(Math.abs(dy) - r.height / 2, 0);
      const near = Math.hypot(ex, ey) < 90;
      el.style.setProperty("--jx", `${near ? Math.max(-8, Math.min(8, dx * 0.1)).toFixed(1) : 0}px`);
      el.style.setProperty("--jy", `${near ? Math.max(-6, Math.min(6, dy * 0.14)).toFixed(1) : 0}px`);
      el.classList.toggle("near", near);
      root.current?.style.setProperty("--glow", near ? "1" : "0");
      for (const c of centers) {
        const d = Math.hypot(px - c.x, py - c.y);
        c.n.style.setProperty("--near", Math.max(0, 1 - d / 240).toFixed(2));
      }
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [hover, reduce]);

  const warm = () => preloadRoute("/main");

  const join = () => {
    if (joining) return;
    const r = joinRef.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 40;
    warm();
    setJoining(true);
    go("/main", { kind: "portal", x, y, R, state: { from: "gate" } });
  };

  return (
    <main ref={root} className={`gate${joining ? " joining" : ""}`} data-hot={hot} aria-label="Seungho Choi 포트폴리오 입구">
      <div className="gate-bg" aria-hidden="true">
        <i className="aurora a1" />
        <i className="aurora a2" />
        <i className="aurora a3" />
        <div className="grid-bg" />
        <div className="noise" />
      </div>

      <div className="gate-world" aria-hidden="true">
        {FRAGMENTS.map((f, i) => (
          <figure
            key={f.key}
            className={`frag ${f.cls}`}
            data-k={f.key}
            style={{ "--i": i }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHot(f.key)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setHot("")}
          >
            <div className="frag-in">
              <Shot src={f.src} alt="" sizes="(min-width: 900px) 52vw, 86vw" eager={f.eager} />
              <figcaption className="frag-tag">
                <b>{f.name}</b>
                <small>{f.tag}</small>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      <div className="gate-spot" aria-hidden="true" />

      <div className="gate-amb" aria-hidden="true" ref={ambRef}>
        {AMBIENT.map((a, i) => (
          <span
            key={`${a.t}-${i}`}
            className={`amb${a.mx != null ? " m" : ""}${a.mobileOnly ? " mo" : ""}${a.accent ? " accent" : ""}`}
            style={{
              "--x": `${a.x}%`,
              "--y": `${a.y}%`,
              "--x2": `${a.mx ?? a.x}%`,
              "--y2": `${a.my ?? a.y}%`,
              "--fs": `${a.fs}px`,
              "--op": a.op,
              "--d": a.d,
              "--dur": `${a.dur}s`,
              "--dx": `${a.dx}px`,
              "--dy": `${a.dy}px`,
              "--r": `${a.r}deg`,
              "--ox": a.x < 50 ? -1 : 1,
              "--oy": a.y < 50 ? -1 : 1,
              "--delay": `${-i * 1.9}s`,
              "--i": i,
            }}
          >
            <i>{a.t}</i>
          </span>
        ))}
      </div>

      <div className="gate-veil" aria-hidden="true" />

      <p className="gate-name rise" style={{ "--i": 0 }}>SEUNGHO CHOI</p>

      <div className="gate-copy">
        <div className="gate-text">
          <p className="gate-eyebrow rise" style={{ "--i": 1 }}>
            Product · Operations · Retail · Automation
          </p>
          <h1>
            <span className="line"><span className="rise" style={{ "--i": 2 }}>현장의 문제를</span></span>
            <span className="line"><span className="rise accent" style={{ "--i": 3 }}>데이터와 제품으로</span></span>
            <span className="line"><span className="rise" style={{ "--i": 4 }}>해결합니다.</span></span>
          </h1>
        </div>
        <div className="gate-cta rise" style={{ "--i": 6 }}>
          <button ref={joinRef} type="button" className="join" onClick={join} onPointerEnter={warm} onFocus={warm}>
            <span className="join-glow" aria-hidden="true" />
            <span className="join-ring" aria-hidden="true" />
            <span className="join-core">
              <span className="join-label">JOIN</span>
              <ArrowRight size={20} aria-hidden="true" />
            </span>
          </button>
        </div>
        <GateContact className="inline rise" />
      </div>

      <GateContact className="dock rise" />

      <p className="gate-foot rise" style={{ "--i": 8 }}>SELECTED WORK · 2026</p>
      <p className="gate-corner rise" style={{ "--i": 8 }}>
        <span>PRODUCT / OPERATIONS</span>
        <small>SANITIZED DEMO DATA</small>
      </p>
    </main>
  );
}
