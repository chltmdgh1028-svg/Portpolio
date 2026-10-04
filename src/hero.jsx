import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projectPath, projects, showreel } from "./data";
import { TLink } from "./transition";
import { useReducedMotion } from "framer-motion";
import { Shot, useMedia } from "./ui";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

/* ---------- hero ---------- */

function HeroWindow({ projectId, src, label, className, alt, eager }) {
  return (
    <div className={`layer ${className}`}>
      <TLink className="win" to={projectPath(projectId)} kind="expand" tone="work" aria-label={`${label} 케이스 스터디 보기`}>
        <span className="win-bar">
          <i />
          <i />
          <i />
          <b>{label}</b>
        </span>
        <Shot src={src} alt={alt} sizes="(min-width: 1280px) 760px, 90vw" eager={eager} />
      </TLink>
    </div>
  );
}

export function HeroScene({ compact = false }) {
  return (
    <div className={`scene${compact ? " compact" : ""}`} role="group" aria-label="Inspection App, Inspection Operations Dashboard, Report Generator, One Ops 제품 화면 (sanitized demo data)">
      <div className="scene-tilt">
        {!compact && <HeroWindow className="l-ops" projectId="one-ops" label="One Ops" src={projects[3].image} alt="One Ops 본사 통합 현황 화면 (mock data)" />}
        <HeroWindow className="l-dash" projectId="inspection-dashboard" label="Operations Dashboard" src={projects[1].image} alt="Inspection Operations Dashboard 화면 (sanitized demo data)" eager />
        <HeroWindow className="l-report" projectId="report-generator" label="Report Generator" src={projects[2].image} alt="Report Generator 화면 (sanitized demo data)" />
        <HeroWindow className="l-app" projectId="inspection-app" label="Inspection App" src={projects[0].image} alt="Inspection App 화면 (sanitized demo data)" />
      </div>
      <span className="scene-note">SANITIZED DEMO DATA · UI SHOWN WITH MOCK DATA</span>
    </div>
  );
}

/* ---------- showreel ---------- */
// A single product-showcase rail: every frame shares one 16:10 box (only the width has a little rhythm),
// the track is moved with a CSS transform animation, and hovering eases the rail to a stop (and back).

const TILT = [-4, 0, 3, -3, 2, -2, 4];

function ReelTile({ item, index, clone }) {
  const project = byId[item.projectId];
  return (
    <li className={`reel-tile size-${item.size}`} style={{ "--ry": `${TILT[index % TILT.length]}deg` }} aria-hidden={clone || undefined}>
      <TLink
        className="reel-link"
        to={projectPath(project.id)}
        kind="expand"
        tone="work"
        tabIndex={clone ? -1 : undefined}
        aria-label={`${project.english} — ${item.caption}. 케이스 스터디 보기`}
      >
        <Shot
          src={item.src}
          alt={clone ? "" : `${project.english} 화면 — ${item.caption} (sanitized demo data)`}
          sizes="(min-width: 1700px) 850px, (min-width: 1280px) 720px, 78vw"
          style={{ objectPosition: item.pos }}
        />
        <span className="reel-cap">
          <small>{project.storyStep}</small>
          <strong>{project.english}</strong>
          <em>{project.oneLine}</em>
          <b>
            EXPLORE CASE STUDY <ArrowRight size={14} />
          </b>
        </span>
      </TLink>
      {project.demoUrl && (
        <a className="reel-demo" href={project.demoUrl} target="_blank" rel="noreferrer" tabIndex={clone ? -1 : undefined}>
          DEMO <ArrowUpRight size={12} />
        </a>
      )}
    </li>
  );
}

/** Touch rail: slow auto-drift that yields to the user's swipe (scrollbar is hidden in CSS). */
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
        pos += dt * 0.014;
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

/** Eases the CSS animation's playbackRate to 0 on hover/focus and back to 1 on leave (no jump, no per-frame React state). */
function useRailEase(rowRef, trackRef, enabled) {
  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track || !enabled) return undefined;
    let rate = 1;
    let target = 1;
    let raf = 0;
    const step = () => {
      raf = 0;
      const anim = track.getAnimations()[0];
      if (!anim) return;
      rate += (target - rate) * 0.1;
      if (Math.abs(target - rate) < 0.01) rate = target;
      if (anim.updatePlaybackRate) anim.updatePlaybackRate(rate);
      else anim.playbackRate = rate;
      if (rate !== target) raf = requestAnimationFrame(step);
    };
    const set = (t) => {
      target = t;
      if (!raf) raf = requestAnimationFrame(step);
    };

    // cursor depth on the hovered frame (rAF throttled, transform only)
    let hovered = null;
    let frame = 0;
    let hx = 0;
    let hy = 0;
    const reset = () => {
      if (!hovered) return;
      hovered.style.setProperty("--hx", "0");
      hovered.style.setProperty("--hy", "0");
    };
    const apply = () => {
      frame = 0;
      if (!hovered) return;
      hovered.style.setProperty("--hx", hx.toFixed(3));
      hovered.style.setProperty("--hy", hy.toFixed(3));
    };
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const link = e.target.closest ? e.target.closest(".reel-link") : null;
      if (link !== hovered) {
        reset();
        hovered = link;
      }
      if (!hovered) return;
      const r = hovered.getBoundingClientRect();
      hx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      hy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const enter = (e) => {
      if (e.pointerType === "mouse") set(0);
    };
    const leave = (e) => {
      if (e.pointerType !== "mouse") return;
      set(1);
      reset();
      hovered = null;
    };
    const focusIn = () => set(0);
    const focusOut = () => set(1);
    row.addEventListener("pointerenter", enter);
    row.addEventListener("pointerleave", leave);
    row.addEventListener("pointermove", onMove, { passive: true });
    row.addEventListener("focusin", focusIn);
    row.addEventListener("focusout", focusOut);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (frame) cancelAnimationFrame(frame);
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("pointerleave", leave);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("focusin", focusIn);
      row.removeEventListener("focusout", focusOut);
    };
  }, [rowRef, trackRef, enabled]);
}

function ReelRow({ items, reverse, drift, ease, label }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  useAutoDrift(ref, drift);
  useRailEase(ref, trackRef, ease);
  const list = [...items, ...items]; // two copies -> seamless -50% loop
  return (
    <div className={`reel-row${reverse ? " reverse" : ""}`} ref={ref} role="region" aria-label={label}>
      <ul className="reel-track" ref={trackRef}>
        {list.map((item, i) => (
          <ReelTile key={`${item.src}-${i}`} item={item} index={i % items.length} clone={i >= items.length} />
        ))}
      </ul>
    </div>
  );
}

export function Showreel() {
  const mobile = useMedia("(max-width: 720px)");
  const reduce = useReducedMotion();
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
          <ReelRow items={[...rowA, ...rowB.slice(0, 3)]} drift={mounted && !reduce} label="제품 화면 모음 (스와이프)" />
        ) : (
          <>
            <ReelRow items={rowA} ease={!reduce} label="제품 화면 1열" />
            <ReelRow items={rowB} reverse ease={!reduce} label="제품 화면 2열" />
          </>
        )}
      </div>
      <p className="wrap reel-note">SANITIZED DEMO DATA · UI SHOWN WITH MOCK DATA — 실제 운영 데이터와 운영 서비스 주소는 공개하지 않습니다.</p>
    </section>
  );
}
