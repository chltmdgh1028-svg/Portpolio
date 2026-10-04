import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { screens } from "./data";
import { preloadRoute } from "./routes";
import { useGo } from "./transition";
import { Shot, useHoverCapable, useDocTitle, usePointerVars } from "./ui";
import "./gate.css";

// UI fragments (sanitized demo screenshots, cropped): each sits on its own depth plane.
const FRAGMENTS = [
  { key: "ops", cls: "f-ops", src: screens.oneOps, name: "ONE OPS", tag: "EXPAND OPERATIONS", alt: "One Ops 화면 일부 (mock data)" },
  { key: "dash", cls: "f-dash", src: screens.dashboard, name: "OPERATIONS DASHBOARD", tag: "MONITOR & DECIDE", alt: "Inspection Operations Dashboard 화면 일부 (sanitized demo data)", eager: true },
  { key: "app", cls: "f-app", src: screens.inspectionApp, name: "INSPECTION APP", tag: "FIELD OPERATIONS", alt: "Inspection App 화면 일부 (sanitized demo data)" },
  { key: "report", cls: "f-report", src: screens.reportGenerator, name: "REPORT GENERATOR", tag: "AUTOMATED REPORTING", alt: "Report Generator 화면 일부 (sanitized demo data)" },
];

export default function Gate() {
  const root = useRef(null);
  const joinRef = useRef(null);
  const go = useGo();
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const [hot, setHot] = useState("");
  const [joining, setJoining] = useState(false);
  useDocTitle("Seungho Choi — Product · Operations · Retail · Automation");
  usePointerVars(root, { enabled: hover && !reduce });

  // JOIN: subtle magnetic pull only when the cursor is within ~100px
  useEffect(() => {
    const el = joinRef.current;
    if (!el || !hover || reduce) return undefined;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    let near = false;
    const apply = () => {
      frame = 0;
      el.style.setProperty("--jx", `${tx.toFixed(1)}px`);
      el.style.setProperty("--jy", `${ty.toFixed(1)}px`);
      el.classList.toggle("near", near);
      root.current?.style.setProperty("--glow", near ? "1" : "0");
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      // distance to the button's box, not its centre
      const ex = Math.max(Math.abs(dx) - r.width / 2, 0);
      const ey = Math.max(Math.abs(dy) - r.height / 2, 0);
      const d = Math.hypot(ex, ey);
      near = d < 90;
      if (near) {
        tx = Math.max(-8, Math.min(8, dx * 0.1));
        ty = Math.max(-6, Math.min(6, dy * 0.14));
      } else {
        tx = 0;
        ty = 0;
      }
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
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
      </div>

      <p className="gate-foot rise" style={{ "--i": 8 }}>SELECTED WORK · 2026</p>
      <p className="gate-note rise" style={{ "--i": 8 }}>SANITIZED DEMO DATA</p>
    </main>
  );
}
