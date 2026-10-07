import React, { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

// One easing for the whole site (page, charts, reveals) so the motion language stays consistent.
export const EASE = [0.22, 1, 0.36, 1];

// Hangul runs inside tracked (letter-spaced) Latin labels: tracking is a Latin-caps device and makes Korean look loose,
// so each run gets its own element (bdi: no stylesheet rule targets it, unlike span) with letter-spacing 0 (see .ko in base.css). Non-string children pass through.
const HANGUL_RUN = /([ㄱ-ㆎ가-힣]+(?:[  ]+[ㄱ-ㆎ가-힣]+)*)/;
export function Ko({ children }) {
  if (typeof children !== "string") return children;
  return children.split(HANGUL_RUN).map((part, i) => (i % 2 ? <bdi className="ko" key={i}>{part}</bdi> : part));
}

/** Responsive webp: /screens/x.webp has -640w and -1280w siblings next to the 2400w original. */
export function Shot({ src, alt, sizes, className, eager = false, ...rest }) {
  const base = src.replace(/\.webp$/, "");
  return (
    <img
      className={className}
      src={`${base}-1280w.webp`}
      srcSet={`${base}-640w.webp 640w, ${base}-1280w.webp 1280w, ${src} 2400w`}
      sizes={sizes}
      alt={alt}
      width={2400}
      height={1500}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      draggable={false}
      {...rest}
    />
  );
}

export function Reveal({ children, className = "", delay = 0, as = "div", y = 24 }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/** Image/figure reveal: clip + gentle scale, distinct from the text fade-up.
 *  The observed wrapper is not clipped itself (IntersectionObserver ignores fully clipped targets). */
export function ClipReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const show = reduce || inView;
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0 round 18px)", scale: 1.05 }}
        animate={show ? { clipPath: "inset(0 0 0% 0 round 18px)", scale: 1 } : undefined}
        transition={{ duration: 0.95, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function useMedia(query, initial = false) {
  const [match, setMatch] = useState(() => (typeof window === "undefined" ? initial : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** True when a fine pointer with hover exists (desktop). Hover-only effects are skipped otherwise. */
export function useHoverCapable() {
  return useMedia("(hover: hover) and (pointer: fine)");
}

/** Counts from `from` to `to` every time `run` changes (and run > 0). Reduced motion jumps to the end. */
export function useCountUp(to, { run, from = 0, delay = 0, duration = 1, decimals = 0 } = {}) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : from);
  useEffect(() => {
    if (reduce) {
      setValue(to);
      return undefined;
    }
    if (!run) {
      setValue(from);
      return undefined;
    }
    setValue(from);
    const controls = animate(from, to, { duration, delay, ease: EASE, onUpdate: (v) => setValue(v) });
    return () => controls.stop();
  }, [run, to, from, delay, duration, reduce]);
  return decimals ? Number(value.toFixed(decimals)) : Math.round(value);
}

export function CountUp({ to, decimals = 0, duration = 1.1, from = 0, delay = 0, run: runProp }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const value = useCountUp(to, { run: runProp !== undefined ? runProp : inView ? 1 : 0, from, delay, duration, decimals });
  return (
    <span ref={ref}>
      {value.toLocaleString("ko-KR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

/**
 * Drives chart animation. `run` is 0 until the chart should first play, then increments per (re)play.
 * - first play: when the chart enters the viewport (or when `external` flips to true)
 * - replay: pointer enter on desktop, throttled by a cooldown and ignored while a run is still playing
 */
export function useChartPlay({ external, duration = 2400, cooldown = 450 } = {}) {
  const ref = useRef(null);
  const [run, setRun] = useState(0);
  const last = useRef(0);
  const hoverCapable = useHoverCapable();
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const play = useCallback(() => {
    last.current = Date.now();
    setRun((r) => r + 1);
  }, []);

  useEffect(() => {
    if (external === undefined) {
      if (inView) play();
    } else if (external) {
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [external === undefined ? inView : external]);

  const onPointerEnter = useCallback(
    (e) => {
      if (!hoverCapable || e.pointerType === "touch" || run === 0) return;
      const now = Date.now();
      if (now - last.current < Math.max(duration, cooldown)) return;
      play();
    },
    [hoverCapable, run, duration, cooldown, play],
  );

  return { ref, run, onPointerEnter };
}

/** rAF-throttled pointer position for a container, written to CSS variables (-1..1 and px). */
export function usePointerVars(ref, { enabled = true, relative = "center" } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    let frame = 0;
    let nx = 0;
    let ny = 0;
    let px = 0;
    let py = 0;
    const flush = () => {
      frame = 0;
      el.style.setProperty("--mx", nx.toFixed(3));
      el.style.setProperty("--my", ny.toFixed(3));
      el.style.setProperty("--px", `${px}px`);
      el.style.setProperty("--py", `${py}px`);
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      px = Math.round(e.clientX - r.left);
      py = Math.round(e.clientY - r.top);
      nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const onLeave = () => {
      nx = 0;
      ny = 0;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, enabled, relative]);
}

/** Very small magnetic pull toward the pointer (desktop, not reduced-motion). */
export function Magnetic({ children, strength = 6 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !hover) return undefined;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    const flush = () => {
      frame = 0;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * strength * 2;
      ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * strength * 2;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce, hover, strength]);
  return (
    <span className="magnetic" ref={ref}>
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, desc, tone = "light", children }) {
  return (
    <header className={`section-heading tone-${tone}`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {desc && <p className="section-desc">{desc}</p>}
      {children}
    </header>
  );
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  return true;
}

export function useDocTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
