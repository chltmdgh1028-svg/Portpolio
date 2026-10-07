import React, { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { careers, projects } from "./data";
import { ContactBlock } from "./contact";
import { HeroScene } from "./hero";
import { TLink } from "./transition";
import { CountUp, Ko, Magnetic, Reveal, Shot, useDocTitle, useHoverCapable, usePointerVars } from "./ui";
import "./hero.css";
import "./hub.css";

/* ---------- compact hero ---------- */

function MainHero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  usePointerVars(ref, { enabled: hover && !reduce });
  return (
    <section className="hero compact dark" id="home" ref={ref}>
      <div className="hero-bg" aria-hidden="true">
        <i className="aurora a1" />
        <i className="aurora a2" />
        <i className="aurora a3" />
        <div className="grid-bg" />
        <div className="noise" />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow rise" style={{ "--i": 0 }}>
            Product · Operations · Retail · Automation
          </p>
          <h1>
            <span className="line"><span className="rise" style={{ "--i": 1 }}>현장의 문제를</span></span>
            <span className="line"><span className="rise accent" style={{ "--i": 2 }}>데이터와 제품으로</span></span>
            <span className="line"><span className="rise" style={{ "--i": 3 }}>해결합니다.</span></span>
          </h1>
          <p className="hero-sub rise" style={{ "--i": 4 }}>
            리테일 현장에서 발견한 비효율을 그냥 두지 않고,
            <br />
            직접 시스템을 만들어 운영까지 연결해온 최승호입니다.
          </p>
          <div className="hero-cta rise" style={{ "--i": 5 }}>
            <Magnetic>
              <TLink className="btn primary" to="/main/work" kind="expand" tone="work" title="WORK">
                EXPLORE WORK <ChevronRight size={18} />
              </TLink>
            </Magnetic>
            <TLink className="btn ghost" to="/main/profile" kind="expand" tone="profile" title="PROFILE">
              ABOUT ME
            </TLink>
          </div>
        </div>
        <HeroScene compact />
      </div>
    </section>
  );
}

/* ---------- key impact (proof only; details live on IMPACT) ---------- */

function KeyImpact() {
  return (
    <section className="key-impact dark" aria-label="Key Impact">
      <div className="wrap">
        <dl className="hero-kpi">
          <div className="kpi-item">
            <dt><Ko>검품률</Ko></dt>
            <dd className="kpi-value">
              <span>3~5%</span>
              <ArrowRight size={20} className="kpi-arrow" aria-hidden="true" />
              <span className="blue">6~8%</span>
            </dd>
          </div>
          <div className="kpi-item">
            <dt><Ko>업무시간 절감</Ko></dt>
            <dd className="kpi-value">
              <span>−</span>
              <span className="blue"><CountUp to={4} /></span>
              <span className="unit">h / day</span>
            </dd>
          </div>
          <div className="kpi-item">
            <dt>Retail Operations</dt>
            <dd className="kpi-value">
              <span><CountUp to={8} />+</span>
              <span className="unit">YEARS</span>
            </dd>
          </div>
          <div className="kpi-item">
            <dt>Built &amp; Operated</dt>
            <dd className="kpi-value">
              <span><CountUp to={4} /></span>
              <span className="unit">PRODUCTS</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ---------- portal banners ---------- */

function WorkArt() {
  const picks = [projects[1], projects[0], projects[2], projects[3]];
  return (
    <span className="art art-work">
      {picks.map((p, i) => (
        <span key={p.id} className={`wa wa${i + 1}`}>
          <Shot src={p.image} alt="" sizes="(min-width: 1100px) 360px, 70vw" />
        </span>
      ))}
    </span>
  );
}

function ImpactArt({ play }) {
  return (
    <span className="art art-impact" data-play={play ? "1" : "0"} aria-hidden="true">
      <svg viewBox="0 0 520 320" focusable="false">
        {[60, 120, 180, 240].map((y) => (
          <line key={y} className="ia-grid" x1="20" x2="500" y1={y} y2={y} />
        ))}
        <g className="ia-bar b1">
          <rect x="70" y="170" width="74" height="70" rx="12" className="ia-pale" />
          <rect x="70" y="150" width="74" height="22" rx="10" className="ia-pale2" />
        </g>
        <g className="ia-bar b2">
          <rect x="190" y="104" width="74" height="136" rx="12" className="ia-blue-soft" />
          <rect x="190" y="84" width="74" height="40" rx="12" className="ia-blue" />
        </g>
        <path className="ia-line" pathLength="1" d="M320 232 C 360 220, 380 150, 420 132 S 480 70, 500 44" />
        <g className="ia-dots">
          {[320, 360, 400, 440, 480].map((x, i) => (
            <circle key={x} cx={x} cy={232 - i * 40 * 0.9} r={i === 4 ? 9 : 5} style={{ "--i": i }} />
          ))}
        </g>
        <g className="ia-hours">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={320 + i * 44} y="272" width="36" height="14" rx="5" style={{ "--i": i }} />
          ))}
        </g>
      </svg>
    </span>
  );
}

function ExperienceArt() {
  return (
    <span className="art art-exp" aria-hidden="true">
      <span className="ea-line" />
      <span className="ea-item e1">
        <small>2026 — PRESENT</small>
        <span className="ea-logo">
          <img src={careers[0].logo.src} alt="" width={careers[0].logo.w} height={careers[0].logo.h} loading="lazy" decoding="async" />
        </span>
      </span>
      <span className="ea-item e2">
        <small>7Y 4M</small>
        <span className="ea-logo traders">
          <img src={careers[1].logo.src} alt="" width={careers[1].logo.w} height={careers[1].logo.h} loading="lazy" decoding="async" />
        </span>
      </span>
    </span>
  );
}

function ProfileArt() {
  return (
    <span className="art art-profile" aria-hidden="true">
      {["OBSERVE", "QUESTION", "MEASURE", "BUILD", "VALIDATE"].map((w, i) => (
        <span key={w} style={{ "--i": i }}>
          {w}
        </span>
      ))}
    </span>
  );
}

const PORTALS = [
  { key: "work", no: "01", title: "WORK", sub: "Products built from real operations.", to: "/main/work", cta: "EXPLORE WORK", meta: ["4 PRODUCTS", "CAPTURE → MONITOR → REPORT → EXPAND"], accent: "#2f7bff" },
  { key: "impact", no: "02", title: "IMPACT", sub: "Results, not just features.", to: "/main/impact", cta: "VIEW IMPACT", meta: ["3~5% → 6~8%", "−4h/day", "0.5억 → 0.7억", "21위 → 1위"], accent: "#2aa8ff" },
  { key: "experience", no: "03", title: "EXPERIENCE", sub: "8+ years in retail operations.", to: "/main/experience", cta: "VIEW EXPERIENCE", meta: ["GS RETAIL", "EMART TRADERS"], accent: "#7f93ff" },
  { key: "profile", no: "04", title: "PROFILE", sub: "Observe. Question. Measure. Build. Validate.", to: "/main/profile", cta: "EXPLORE PROFILE", meta: ["ABOUT", "STRENGTHS", "SKILLS"], accent: "#8b6bff" },
];

function Portal({ p }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const seen = useInView(ref, { once: true, amount: 0.35 });
  usePointerVars(ref, { enabled: hover && !reduce });
  const art = { work: <WorkArt />, impact: <ImpactArt play={seen} />, experience: <ExperienceArt />, profile: <ProfileArt /> }[p.key];
  return (
    <Reveal y={34}>
      <TLink ref={ref} className={`portal p-${p.key}`} style={{ "--accent": p.accent }} to={p.to} kind="expand" tone={p.key} title={p.title} aria-label={`${p.title} — ${p.sub}`}>
        <span className="portal-bg" aria-hidden="true">
          {art}
        </span>
        <span className="portal-spot" aria-hidden="true" />
        <span className="portal-copy">
          <small>
            {p.no} <i aria-hidden="true" /> WORLD
          </small>
          <strong>{p.title}</strong>
          <em>{p.sub}</em>
          <span className="portal-meta">
            {p.meta.map((m) => (
              <b key={m}><Ko>{m}</Ko></b>
            ))}
          </span>
          <span className="portal-cta">
            {p.cta} <ArrowRight size={18} aria-hidden="true" />
          </span>
        </span>
      </TLink>
    </Reveal>
  );
}

function Portals() {
  return (
    <section className="portals dark" id="portals" aria-label="Portfolio 공간">
      <div className="story-bg" aria-hidden="true">
        <i className="aurora a2" />
        <div className="noise" />
      </div>
      <div className="wrap">
        <p className="section-eyebrow">Enter</p>
        <div className="portal-list">
          {PORTALS.map((p) => (
            <Portal key={p.key} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Hub() {
  useDocTitle("Main — Seungho Choi");
  return (
    <main className="hub">
      <MainHero />
      <KeyImpact />
      <Portals />
      <ContactBlock />
    </main>
  );
}
