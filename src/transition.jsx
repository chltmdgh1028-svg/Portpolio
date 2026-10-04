import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { preloadRoute } from "./routes";
import { scrollToSection } from "./ui";

// One transition language for the whole site (see .ov rules in base.css):
//   portal  GATE -> MAIN      circle grows from JOIN and covers the viewport, then fades to reveal MAIN
//   expand  MAIN -> portal    the clicked banner/image grows to the full viewport and becomes the next hero
//   fade    everything else   short dark fade
// Only opacity / transform / clip-path are animated. Reduced motion navigates immediately.

const Ctx = createContext(() => {});
export const useGo = () => useContext(Ctx);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DUR = { portal: [720, 480], expand: [640, 420], fade: [200, 300] };

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [ov, setOv] = useState(null);
  const busy = useRef(false);

  const go = useCallback(
    async (to, opts = {}) => {
      if (busy.current) return;
      if (reduce) {
        navigate(to, { state: opts.state });
        return;
      }
      busy.current = true;
      const kind = opts.kind ?? "fade";
      const [inMs, outMs] = DUR[kind];
      const chunk = preloadRoute(to).catch(() => {});
      document.body.dataset.covering = "1";
      setOv({ ...opts, kind, phase: "in" });
      await Promise.all([sleep(inMs), chunk]);
      navigate(to, { state: opts.state });
      await sleep(kind === "fade" ? 40 : 140);
      delete document.body.dataset.covering;
      setOv((o) => o && { ...o, phase: "out" });
      await sleep(outMs);
      setOv(null);
      busy.current = false;
    },
    [navigate, reduce],
  );

  return (
    <Ctx.Provider value={go}>
      {children}
      <Overlay ov={ov} />
    </Ctx.Provider>
  );
}

function Overlay({ ov }) {
  if (!ov) return null;
  const out = ov.phase === "out";
  if (ov.kind === "portal") {
    const { x, y, R } = ov;
    return (
      <div className={`ov ov-portal${out ? " out" : ""}`} aria-hidden="true">
        <i className="ov-circle" style={{ left: x - R, top: y - R, width: R * 2, height: R * 2 }} />
      </div>
    );
  }
  if (ov.kind === "expand" && ov.rect) {
    const r = ov.rect;
    const vars = {
      "--t": `${Math.max(0, r.top)}px`,
      "--r": `${Math.max(0, window.innerWidth - r.right)}px`,
      "--b": `${Math.max(0, window.innerHeight - r.bottom)}px`,
      "--l": `${Math.max(0, r.left)}px`,
    };
    return (
      <div className={`ov ov-expand tone-${ov.tone ?? "work"}${out ? " out" : ""}`} style={vars} aria-hidden="true">
        {ov.title && (
          <span className="ov-title" style={{ left: r.left + 40, top: Math.max(r.top, 0) + 36 }}>
            {ov.title}
          </span>
        )}
      </div>
    );
  }
  return <div className={`ov ov-fade${out ? " out" : ""}`} aria-hidden="true" />;
}

/** Same-tab internal link. Modified clicks (new tab, etc.) keep native behaviour. */
export function TLink({ to, kind = "fade", tone, title, state, children, onClick, className, ref: extRef, ...rest }) {
  const go = useGo();
  const ref = useRef(null);
  const setRef = (el) => {
    ref.current = el;
    if (typeof extRef === "function") extRef(el);
    else if (extRef) extRef.current = el;
  };
  const warm = () => preloadRoute(to);
  return (
    <a
      ref={setRef}
      href={to}
      className={className}
      onPointerEnter={warm}
      onFocus={warm}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const rect = kind === "expand" ? ref.current.getBoundingClientRect() : undefined;
        go(to, { kind, rect, tone, title, state });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Scroll position: top on new pages, restored on back/forward, #hash targets after the page mounts. */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  const saved = useRef(new Map());
  const lastKey = useRef(key);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const onScroll = () => saved.current.set(lastKey.current, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lastKey.current = key;
    if (hash) {
      const id = hash.slice(1);
      let tries = 0;
      const t = setInterval(() => {
        tries += 1;
        if (scrollToSection(id) || tries > 12) clearInterval(t);
      }, 120);
      return () => clearInterval(t);
    }
    const y = type === "POP" ? saved.current.get(key) ?? 0 : 0;
    window.scrollTo({ top: y, behavior: "instant" });
    // restoring needs the (lazy) page to be tall enough; retry briefly
    if (y > 0) {
      let tries = 0;
      const t = setInterval(() => {
        tries += 1;
        window.scrollTo({ top: y, behavior: "instant" });
        if (Math.abs(window.scrollY - y) < 4 || tries > 15) clearInterval(t);
      }, 100);
      return () => clearInterval(t);
    }
    return undefined;
  }, [pathname, hash, key, type]);

  return null;
}

