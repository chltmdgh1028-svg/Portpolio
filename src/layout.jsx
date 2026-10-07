import React, { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { contacts, documents, navItems } from "./data";
import { TLink, useGo } from "./transition";
import { scrollToSection } from "./ui";

export function DocButton({ doc, className = "" }) {
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

function NavLinks({ pathname, onNavigate, className }) {
  const go = useGo();
  return navItems.map((item) => {
    const active = !item.contact && (item.end ? pathname.replace(/\/$/, "") === item.to : pathname.startsWith(item.to));
    const props = { className: active ? `${className ?? ""} active`.trim() : className, "aria-current": active ? "page" : undefined };
    if (item.contact) {
      return (
        <a
          key={item.label}
          href={item.to}
          {...props}
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.();
            if (pathname.replace(/\/$/, "") === "/main") scrollToSection("contact");
            else go(item.to, { kind: "fade" });
          }}
        >
          {item.label}
        </a>
      );
    }
    return (
      <TLink key={item.label} to={item.to} {...props} onClick={onNavigate}>
        {item.label}
      </TLink>
    );
  });
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Escape closes the mobile menu and returns focus to its button
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled || open ? " solid" : ""}${open ? " open" : ""}`}>
      <div className="header-inner">
        <TLink className="brand" to="/main" aria-label="MAIN으로 이동">
          SEUNGHO CHOI
        </TLink>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="header-actions">
          <DocButton doc={documents.resume} />
          <DocButton doc={documents.portfolio} />
          <button ref={menuRef} className="menu-button" onClick={() => setOpen((v) => !v)} aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
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

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <span className="footer-brand">SEUNGHO CHOI</span>
        <ul className="footer-links" aria-label="연락처">
          <li><a href={`mailto:${contacts.email}`}>{contacts.email}</a></li>
          <li><a href={contacts.phoneHref}>{contacts.phone}</a></li>
          <li>
            {documents.resume.file ? <a href={documents.resume.file} download={documents.resume.filename}>RESUME ↓</a> : <span className="off">RESUME · 준비 중</span>}
          </li>
          <li>
            {documents.portfolio.file ? <a href={documents.portfolio.file} download={documents.portfolio.filename}>PORTFOLIO PDF ↓</a> : <span className="off">PORTFOLIO PDF · 준비 중</span>}
          </li>
        </ul>
        <p>© 2026 Seungho Choi. Portfolio Website.</p>
      </div>
    </footer>
  );
}

export function SiteLayout() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
        <Outlet />
      </Suspense>
      <SiteFooter />
    </>
  );
}
