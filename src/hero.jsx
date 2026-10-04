import React, { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projectPath, projects, showreel } from "./data";
import { TLink } from "./transition";
import { useReducedMotion } from "framer-motion";
import { Shot } from "./ui";

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
// One continuous product-showcase rail. There is no native scrolling at all (so no scrollbar):
// a single rAF loop moves the track with transform, and auto-flow, arrows, drag/swipe, wheel and
// keyboard focus all feed the same position, so nothing ever jumps. Items are doubled, so the rail is infinite.

const TILT = [-4, 0, 3, -3, 2, -2, 4];
const RAIL = [0, 1, 2, 3, 5, 4, 6]; // order in data.showreel: featured frames alternate with normal ones

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
        draggable={false}
        aria-label={`${project.english} — ${item.caption}. 케이스 스터디 보기`}
      >
        <Shot
          src={item.src}
          alt={clone ? "" : `${project.english} 화면 — ${item.caption} (sanitized demo data)`}
          sizes="(min-width: 1700px) 800px, (min-width: 1280px) 720px, 78vw"
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
        <a className="reel-demo" href={project.demoUrl} target="_blank" rel="noreferrer" tabIndex={clone ? -1 : undefined} draggable={false}>
          DEMO <ArrowUpRight size={12} />
        </a>
      )}
    </li>
  );
}

const AUTO_DESKTOP = 44; // px/s -> a full 1440px screen every ~33s
const AUTO_MOBILE = 16;

function useRail(frameRef, rowRef, trackRef, reduce) {
  const api = useRef({ nudge: () => {} });

  useEffect(() => {
    const frame = frameRef.current;
    const row = rowRef.current;
    const track = trackRef.current;
    if (!frame || !row || !track) return undefined;
    const tiles = [...track.children];
    const n = tiles.length / 2;
    let setW = 0;
    let pitch = 0;
    const measure = () => {
      setW = tiles[n].offsetLeft - tiles[0].offsetLeft;
      pitch = setW / n;
    };
    measure();

    let pos = 0; // rendered offset
    let target = 0; // where the spring is heading (arrows / glide / focus add to it)
    let speed = 1; // eased auto-flow factor: 0 while hovering, dragging or settling a manual move
    let hovering = false;
    let dragging = false;
    let visible = true;
    let last = performance.now();
    let raf = 0;

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (!visible || !setW) return;
      const settling = Math.abs(target - pos) > 2;
      const wantAuto = !reduce && !hovering && !dragging && !settling;
      speed += ((wantAuto ? 1 : 0) - speed) * (1 - Math.exp(-dt * 5));
      const auto = (window.innerWidth <= 720 ? AUTO_MOBILE : AUTO_DESKTOP) * speed * dt;
      pos += auto;
      target += auto;
      if (!dragging) {
        const diff = target - pos;
        if (Math.abs(diff) < 0.05) pos = target;
        else pos += diff * (1 - Math.exp(-dt * (reduce ? 26 : 5.5)));
      }
      const k = Math.floor(pos / setW);
      if (k) {
        pos -= k * setW;
        target -= k * setW;
      }
      track.style.transform = `translate3d(${(-pos).toFixed(2)}px,0,0)`;
    };
    raf = requestAnimationFrame(tick);

    api.current.nudge = (dir) => {
      // clicking repeatedly just extends the target, the spring keeps gliding (capped to 3 cards ahead)
      const next = target + dir * pitch;
      target = Math.max(pos - 3 * pitch, Math.min(pos + 3 * pitch, next));
    };

    /* hover / focus pause (also covers the arrow buttons) */
    const enter = (e) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const leave = (e) => {
      if (e.pointerType === "mouse") hovering = false;
    };
    const focusIn = (e) => {
      hovering = true;
      const tile = e.target.closest ? e.target.closest(".reel-tile") : null;
      if (!tile || !e.target.matches || !e.target.matches(":focus-visible")) return;
      // keyboard focus on a frame that is out of view: bring it to the middle by the shortest way round
      const want = tile.offsetLeft + tile.offsetWidth / 2 - row.clientWidth / 2;
      let d = want - target;
      d -= Math.round(d / setW) * setW;
      if (Math.abs(d) > 8) target += d;
    };
    const focusOut = () => {
      hovering = false;
    };
    frame.addEventListener("pointerenter", enter);
    frame.addEventListener("pointerleave", leave);
    frame.addEventListener("focusin", focusIn);
    frame.addEventListener("focusout", focusOut);

    /* drag / swipe (mouse + touch). Vertical page scroll is left to the browser via touch-action: pan-y. */
    let down = false;
    let moved = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let swallow = false;
    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      moved = 0;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
    };
    const onMove = (e) => {
      if (!down) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      moved += Math.abs(dx);
      if (!dragging && moved > 6) {
        dragging = true;
        row.classList.add("dragging");
        try {
          row.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      if (dragging) {
        pos -= dx;
        target -= dx;
        const dtm = Math.max(now - lastT, 1) / 1000;
        vel = vel * 0.7 + (-dx / dtm) * 0.3;
      }
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = (e) => {
      if (!down) return;
      down = false;
      if (dragging) {
        dragging = false;
        row.classList.remove("dragging");
        swallow = true;
        setTimeout(() => (swallow = false), 0);
        try {
          row.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        target = pos + Math.max(-1400, Math.min(1400, vel)) * 0.22; // glide on release
      }
    };
    const onClickCapture = (e) => {
      if (swallow) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    row.addEventListener("pointerdown", onDown);
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerup", onUp);
    row.addEventListener("pointercancel", onUp);
    row.addEventListener("click", onClickCapture, true);

    /* horizontal wheel / trackpad */
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      pos += e.deltaX;
      target += e.deltaX;
    };
    row.addEventListener("wheel", onWheel, { passive: false });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });
    io.observe(frame);
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      frame.removeEventListener("pointerenter", enter);
      frame.removeEventListener("pointerleave", leave);
      frame.removeEventListener("focusin", focusIn);
      frame.removeEventListener("focusout", focusOut);
      row.removeEventListener("pointerdown", onDown);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerup", onUp);
      row.removeEventListener("pointercancel", onUp);
      row.removeEventListener("click", onClickCapture, true);
      row.removeEventListener("wheel", onWheel);
    };
  }, [frameRef, rowRef, trackRef, reduce]);

  return api;
}

/** Cursor depth on the hovered frame (rAF throttled, transform only). */
function useFrameDepth(rowRef) {
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
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
    const onLeave = () => {
      reset();
      hovered = null;
    };
    row.addEventListener("pointermove", onMove, { passive: true });
    row.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
    };
  }, [rowRef]);
}

export function Showreel() {
  const reduce = useReducedMotion();
  const frameRef = useRef(null);
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const rail = useRail(frameRef, rowRef, trackRef, reduce);
  useFrameDepth(rowRef);
  const items = RAIL.map((i) => showreel[i]);
  const list = [...items, ...items]; // two copies -> seamless loop

  return (
    <section className="showreel dark" id="showreel" aria-label="프로젝트 화면 쇼릴">
      <div className="wrap reel-head">
        <p className="section-eyebrow">Selected Screens</p>
        <p className="reel-lead">
          직접 만든 네 가지 제품의 실제 화면입니다. <span>화면을 누르면 Case Study로 이동합니다.</span>
        </p>
      </div>
      <div className="reel" ref={frameRef}>
        <div className="reel-row" ref={rowRef} role="region" aria-roledescription="carousel" aria-label="제품 화면 모음">
          <ul className="reel-track" ref={trackRef}>
            {list.map((item, i) => (
              <ReelTile key={`${item.src}-${i}`} item={item} index={i % items.length} clone={i >= items.length} />
            ))}
          </ul>
        </div>
        <button type="button" className="reel-arrow prev" aria-label="이전 화면" onClick={() => rail.current.nudge(-1)}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span aria-hidden="true">이전 화면</span>
        </button>
        <button type="button" className="reel-arrow next" aria-label="다음 화면" onClick={() => rail.current.nudge(1)}>
          <span aria-hidden="true">다음 화면</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="wrap reel-note">SANITIZED DEMO DATA · UI SHOWN WITH MOCK DATA — 실제 운영 데이터와 운영 서비스 주소는 공개하지 않습니다.</p>
    </section>
  );
}
