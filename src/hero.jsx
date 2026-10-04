import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { projects, showreel } from "./data";
import { CountUp, Magnetic, Shot, scrollToSection, useHoverCapable, useMedia, usePointerVars } from "./ui";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

/* ---------- hero ---------- */

function HeroWindow({ projectId, src, label, className, alt, eager }) {
  return (
    <div className={`layer ${className}`}>
      <Link className="win" to={`/projects/${projectId}`} aria-label={`${label} 케이스 스터디 보기`}>
        <span className="win-bar">
          <i />
          <i />
          <i />
          <b>{label}</b>
        </span>
        <Shot src={src} alt={alt} sizes="(min-width: 1280px) 760px, 90vw" eager={eager} />
      </Link>
    </div>
  );
}

function HeroScene() {
  return (
    <div className="scene" role="group" aria-label="Inspection App, Inspection Operations Dashboard, Report Generator, One Ops 제품 화면 (sanitized demo data)">
      <div className="scene-tilt">
        <HeroWindow className="l-ops" projectId="one-ops" label="One Ops" src={projects[3].image} alt="One Ops 본사 통합 현황 화면 (mock data)" />
        <HeroWindow className="l-dash" projectId="inspection-dashboard" label="Operations Dashboard" src={projects[1].image} alt="Inspection Operations Dashboard 화면 (sanitized demo data)" eager />
        <HeroWindow className="l-report" projectId="report-generator" label="Report Generator" src={projects[2].image} alt="Report Generator 화면 (sanitized demo data)" />
        <HeroWindow className="l-app" projectId="inspection-app" label="Inspection App" src={projects[0].image} alt="Inspection App 화면 (sanitized demo data)" />
      </div>
      <span className="scene-note">SANITIZED DEMO DATA · UI SHOWN WITH MOCK DATA</span>
    </div>
  );
}

export function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  usePointerVars(ref, { enabled: hover && !reduce });

  return (
    <section className="hero dark" id="home" ref={ref}>
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
              <button className="btn primary" onClick={() => scrollToSection("work")}>
                VIEW SELECTED WORK <ChevronRight size={18} />
              </button>
            </Magnetic>
            <button className="btn ghost" onClick={() => scrollToSection("about")}>
              ABOUT ME
            </button>
          </div>
        </div>
        <HeroScene />
      </div>
      <HeroKpi />
    </section>
  );
}

function HeroKpi() {
  return (
    <div className="wrap hero-kpi-wrap">
      <dl className="hero-kpi rise" style={{ "--i": 7 }}>
        <div className="kpi-item">
          <dt>검품률 향상</dt>
          <dd className="kpi-value">
            <span>3~5%</span>
            <ArrowRight size={20} className="kpi-arrow" aria-hidden="true" />
            <span className="blue">6~8%</span>
          </dd>
        </div>
        <div className="kpi-item">
          <dt>업무시간 절감</dt>
          <dd className="kpi-value">
            <span>일</span>{" "}
            <span className="blue"><CountUp to={4} /></span>
            <span className="unit">시간</span>
          </dd>
        </div>
        <div className="kpi-item">
          <dt>리테일 경력</dt>
          <dd className="kpi-value">
            <span><CountUp to={8} /></span>
            <span className="unit">년+</span>
          </dd>
        </div>
        <div className="kpi-item">
          <dt>직접 구축 제품</dt>
          <dd className="kpi-value">
            <span>4</span>
            <span className="unit">개</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ---------- showreel ---------- */

const TILT = [-5, 0, 4, -3, 3, -4, 2];

function ReelTile({ item, index, clone }) {
  const project = byId[item.projectId];
  return (
    <li className={`reel-tile size-${item.size}`} style={{ "--ry": `${TILT[index % TILT.length]}deg` }} aria-hidden={clone || undefined}>
      <Link
        className="reel-link"
        to={`/projects/${project.id}`}
        tabIndex={clone ? -1 : undefined}
        aria-label={`${project.english} — ${item.caption}. 케이스 스터디 보기`}
      >
        <Shot src={item.src} alt={clone ? "" : `${project.english} 화면 — ${item.caption} (sanitized demo data)`} sizes="(min-width: 1280px) 660px, 70vw" />
        <span className="reel-cap">
          <small>{project.storyStep}</small>
          <strong>{project.english}</strong>
          <em>{project.oneLine}</em>
          <b>
            EXPLORE CASE STUDY <ArrowRight size={14} />
          </b>
        </span>
      </Link>
      {project.demoUrl && (
        <a className="reel-demo" href={project.demoUrl} target="_blank" rel="noreferrer" tabIndex={clone ? -1 : undefined}>
          DEMO <ArrowUpRight size={12} />
        </a>
      )}
    </li>
  );
}

/** Slow auto-drift for the touch rail. Pauses while the user touches/scrolls, resumes after a short idle. */
function useAutoDrift(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    let raf = 0;
    let pos = el.scrollLeft;
    let last = performance.now();
    let paused = false;
    let visible = true;
    let timer = 0;
    const hold = () => {
      paused = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        pos = el.scrollLeft;
        paused = false;
      }, 2600);
    };
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const tick = (t) => {
      const dt = Math.min(t - last, 64);
      last = t;
      if (!paused && visible) {
        pos += dt * 0.016;
        const half = el.scrollWidth / 2;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    el.addEventListener("touchstart", hold, { passive: true });
    el.addEventListener("pointerdown", hold);
    el.addEventListener("wheel", hold, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      io.disconnect();
      el.removeEventListener("touchstart", hold);
      el.removeEventListener("pointerdown", hold);
      el.removeEventListener("wheel", hold);
    };
  }, [ref, enabled]);
}

function ReelRow({ items, reverse, drift, label }) {
  const ref = useRef(null);
  useAutoDrift(ref, drift);
  const list = [...items, ...items]; // two copies -> seamless -50% loop
  return (
    <div className={`reel-row${reverse ? " reverse" : ""}`} ref={ref} role="region" aria-label={label}>
      <ul className="reel-track">
        {list.map((item, i) => (
          <ReelTile key={`${item.src}-${i}`} item={item} index={i % items.length} clone={i >= items.length} />
        ))}
      </ul>
    </div>
  );
}

export function Showreel() {
  const mobile = useMedia("(max-width: 720px)");
  const rowA = [showreel[0], showreel[1], showreel[2], showreel[3]];
  const rowB = [showreel[4], showreel[5], showreel[6], showreel[0]];
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="showreel dark" id="showreel" aria-label="프로젝트 화면 쇼릴">
      <div className="wrap reel-head">
        <p className="section-eyebrow">Selected Screens</p>
        <p className="reel-lead">
          직접 만든 네 가지 제품의 실제 화면입니다. <span>화면을 누르면 Case Study로 이동합니다.</span>
        </p>
      </div>
      <div className="reel">
        {mobile ? (
          <ReelRow items={[...rowA, ...rowB.slice(0, 3)]} drift={mounted} label="제품 화면 모음 (스와이프)" />
        ) : (
          <>
            <ReelRow items={rowA} label="제품 화면 1열" />
            <ReelRow items={rowB} reverse label="제품 화면 2열" />
          </>
        )}
      </div>
      <p className="wrap reel-note">SANITIZED DEMO DATA · UI SHOWN WITH MOCK DATA — 실제 운영 데이터와 운영 서비스 주소는 공개하지 않습니다.</p>
    </section>
  );
}
