import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./base.css";
import "./hero.css";
import "./work.css";
import { documents, navItems, sectionToNav } from "./data";
import { Hero, Showreel } from "./hero";
import { SelectedWork } from "./work";
import { scrollToSection } from "./ui";

// Everything below the showreel + work list is split out: story (with charts) and profile sections load on idle
// (or when they approach the viewport), and the case-study page loads on demand.
const loadStory = () => import("./story");
const GSDataStory = lazy(() => loadStory().then((m) => ({ default: m.GSDataStory })));
const EmartStory = lazy(() => loadStory().then((m) => ({ default: m.EmartStory })));
const loadProfile = () => import("./profile");
const ExperienceSection = lazy(() => loadProfile().then((m) => ({ default: m.ExperienceSection })));
const AboutSection = lazy(() => loadProfile().then((m) => ({ default: m.AboutSection })));
const SkillsSection = lazy(() => loadProfile().then((m) => ({ default: m.SkillsSection })));
const ContactSection = lazy(() => loadProfile().then((m) => ({ default: m.ContactSection })));
const ProjectDetail = lazy(() => import("./ProjectDetail"));

/** Reserves height, then mounts its (lazy) children once the page is idle or the slot nears the viewport. */
function LazySlot({ minHeight, children }) {
  const ref = useRef(null);
  const near = useInView(ref, { once: true, margin: "1400px 0px" });
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = 0;
    const arm = () => {
      timer = window.setTimeout(() => setIdle(true), 1800);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    const force = () => setIdle(true);
    window.addEventListener("portfolio:mount-all", force);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", arm);
      window.removeEventListener("portfolio:mount-all", force);
    };
  }, []);

  return (
    <div ref={ref} className="lazy-slot" style={{ minHeight: idle || near ? undefined : minHeight }}>
      {idle || near ? <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense> : null}
    </div>
  );
}

/* ---------- header ---------- */

const SECTION_IDS = ["home", "showreel", "work", "gs-story", "emart-story", "experience", "about", "skills", "contact"];

function useActiveSection(enabled) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (!enabled) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.35;
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = "contact";
      setActive(sectionToNav[current] ?? current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);
  return active;
}

function DocButton({ doc, className = "" }) {
  const ready = Boolean(doc.file);
  const body = (
    <>
      {doc.label} <Download size={14} aria-hidden="true" />
    </>
  );
  if (!ready) {
    return (
      <button type="button" className={`doc-btn disabled ${className}`} aria-disabled="true" data-hint="PDF 준비 중" onClick={(e) => e.preventDefault()}>
        {body}
      </button>
    );
  }
  return (
    <a className={`doc-btn ${className}`} href={doc.file} download={doc.filename}>
      {body}
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";
  const active = useActiveSection(onHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const goTo = (id) => {
    setOpen(false);
    if (!onHome) {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    if (!scrollToSection(id)) {
      window.dispatchEvent(new Event("portfolio:mount-all"));
      setTimeout(() => scrollToSection(id), 500);
    } else {
      // lazily mounted sections above the target can shift layout after the first scroll; settle once more
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el && Math.abs(el.getBoundingClientRect().top) > 80) scrollToSection(id);
      }, 700);
    }
  };

  return (
    <header className={`site-header${scrolled || !onHome || open ? " solid" : ""}${open ? " open" : ""}`}>
      <div className="header-inner">
        <button className="brand" onClick={() => (onHome ? scrollToSection("home") : navigate("/"))} aria-label="홈으로 이동">
          SEUNGHO CHOI
        </button>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <button key={item.id} className={onHome && active === item.id ? "active" : ""} aria-current={onHome && active === item.id ? "true" : undefined} onClick={() => goTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <DocButton doc={documents.resume} />
          <DocButton doc={documents.portfolio} />
          <button className="menu-button" onClick={() => setOpen((v) => !v)} aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            {navItems.map((item) => (
              <button key={item.id} className={onHome && active === item.id ? "active" : ""} onClick={() => goTo(item.id)}>
                {item.label}
              </button>
            ))}
            <div className="mobile-docs">
              <DocButton doc={documents.resume} />
              <DocButton doc={documents.portfolio} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- pages ---------- */

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Seungho Choi — Product · Operations · Retail · Automation";
    const target = location.state?.scrollTo;
    if (!target) return undefined;
    // returning from a case study / header click on a detail page: jump to the section without animation
    window.dispatchEvent(new Event("portfolio:mount-all"));
    const go = () => document.getElementById(target)?.scrollIntoView({ block: target.startsWith("work-") ? "center" : "start" });
    const t1 = setTimeout(go, 60);
    const t2 = setTimeout(go, 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location.state]);

  return (
    <main>
      <Hero />
      <Showreel />
      <SelectedWork />
      <LazySlot minHeight={2400}>
        <GSDataStory />
      </LazySlot>
      <LazySlot minHeight={1500}>
        <EmartStory />
      </LazySlot>
      <LazySlot minHeight={900}>
        <ExperienceSection />
      </LazySlot>
      <LazySlot minHeight={700}>
        <AboutSection />
      </LazySlot>
      <LazySlot minHeight={1200}>
        <SkillsSection />
      </LazySlot>
      <LazySlot minHeight={600}>
        <ContactSection />
      </LazySlot>
    </main>
  );
}

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/projects/:id"
          element={
            <Suspense fallback={<div className="detail-page" aria-busy="true" style={{ minHeight: "100vh" }} />}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <footer className="site-footer">
        <div className="wrap">
          <span>SEUNGHO CHOI</span>
          <p>© 2026 Seungho Choi. Portfolio Website.</p>
        </div>
      </footer>
    </HashRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
