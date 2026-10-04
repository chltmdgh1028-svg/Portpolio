import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Github,
  Lock,
  Mail,
  Menu,
  Phone,
  Trophy,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./styles.css";
import {
  aboutSteps,
  careers,
  certifications,
  contacts,
  emartData,
  gsData,
  navItems,
  projectStory,
  projects,
  screens,
  sectionToNav,
  skillGroups,
  strengths,
} from "./data";
import { EASE, Reveal } from "./ui";

// Heavy, below-the-fold or route-level code is split out of the first bundle.
const loadCharts = () => import("./charts");
const InspectionRateChart = lazy(() => loadCharts().then((m) => ({ default: m.InspectionRateChart })));
const SalesChart = lazy(() => loadCharts().then((m) => ({ default: m.SalesChart })));
const loadDetail = () => import("./ProjectDetail");
const ProjectDetail = lazy(loadDetail);

/* ---------- shared helpers ---------- */

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Mounts children (lazy charts) only when the block is near the viewport, keeping its height reserved. */
function Deferred({ height, children }) {
  const ref = useRef(null);
  const near = useInView(ref, { once: true, margin: "400px 0px" });
  return (
    <div ref={ref} className="deferred" style={{ minHeight: height }}>
      {near ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}

function CountUp({ to, decimals = 0, duration = 1.1 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) return setValue(to);
    if (!inView) return undefined;
    const controls = animate(0, to, { duration, ease: "easeOut", onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("ko-KR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

function SectionHeading({ eyebrow, title, desc, tone = "light" }) {
  return (
    <header className={`section-heading ${tone}`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {desc && <p className="section-desc">{desc}</p>}
    </header>
  );
}

/* ---------- header ---------- */

function useActiveSection(enabled) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (!enabled) return undefined;
    const ids = ["home", "projects", "gs-story", "emart-story", "experience", "about", "skills", "contact"];
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.35;
      let current = "home";
      for (const id of ids) {
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
      navigate("/");
      setTimeout(() => scrollToSection(id), 120);
    } else {
      scrollToSection(id);
    }
  };

  const solid = scrolled || !onHome || open;

  return (
    <header className={`site-header${solid ? " solid" : ""}${open ? " open" : ""}`}>
      <div className="header-inner">
        <button className="brand" onClick={() => goTo("home")} aria-label="홈으로 이동">
          SEUNGHO CHOI
        </button>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={onHome && active === item.id ? "active" : ""}
              aria-current={onHome && active === item.id ? "true" : undefined}
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <a className="resume-button" href={contacts.resume} download>
            RESUME <span className="resume-ko">/ 소개서</span> <Download size={15} />
          </a>
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
            <a href={contacts.resume} download>RESUME / 소개서</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">Product · Operations · Retail · Developer</p>
          <h1>
            <span>현장의 문제를</span>
            <span className="accent">데이터와 제품으로</span>
            <span>해결합니다.</span>
          </h1>
          <p className="hero-sub">
            리테일 현장에서 발견한 비효율을 그냥 두지 않고,{" "}
            <br />
            직접 시스템을 만들어 운영까지 연결해온 최승호입니다.
          </p>
          <div className="hero-cta">
            <button className="btn primary" onClick={() => scrollToSection("projects")}>
              PROJECTS <ChevronRight size={18} />
            </button>
            <button className="btn ghost" onClick={() => scrollToSection("about")}>ABOUT ME</button>
          </div>
        </div>
        <HeroMockup />
      </div>
      <HeroKpi />
    </section>
  );
}

function BrowserFrame({ className, label, src, alt, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className={`browser-frame ${className}`}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <figcaption className="frame-bar">
        <i /><i /><i />
        <span>{label}</span>
      </figcaption>
      <img src={src} alt={alt} decoding="async" />
    </motion.figure>
  );
}

function HeroMockup() {
  return (
    <div className="hero-mockup" role="group" aria-label="Inspection App, Inspection Dashboard, Report Generator 화면 (샘플 데이터)">
      <BrowserFrame className="frame-dashboard" label="Operations Dashboard" src={screens.dashboard} alt="Inspection Operations Dashboard 샘플 데이터 화면" delay={0.1} />
      <BrowserFrame className="frame-report" label="Report Generator" src={screens.reportGenerator} alt="Report Generator 샘플 데이터 화면" delay={0.25} />
      <BrowserFrame className="frame-app" label="Inspection App" src={screens.inspectionApp} alt="Inspection App 샘플 데이터 화면" delay={0.4} />
    </div>
  );
}

function HeroKpi() {
  return (
    <div className="wrap hero-kpi-wrap">
      <dl className="hero-kpi">
        <div className="kpi-item">
          <dt>검품률 향상</dt>
          <dd className="kpi-value">
            <span>3~5%</span>
            <ArrowRight size={22} className="kpi-arrow" aria-hidden="true" />
            <span className="blue">6~8%</span>
          </dd>
        </div>
        <div className="kpi-item">
          <dt>업무시간 절감</dt>
          <dd className="kpi-value">
            <span>일</span> <span className="blue"><CountUp to={4} /></span>
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
            <small>Inspection App · Dashboard<br />Report Generator · One Ops</small>
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ---------- projects ---------- */

function ProjectsSection() {
  return (
    <section className="section projects-section" id="projects">
      <div className="wrap">
        <SectionHeading eyebrow="Featured Projects" title="현장 문제에서 운영 시스템으로" desc="현장에서 데이터를 만들고, 모니터링하고, 보고하고, 더 넓은 운영으로 확장해온 네 가지 제품입니다." />
        <ol className="project-story" aria-label="프로젝트 연결 흐름">
          {projectStory.map((item, i) => (
            <Reveal as="li" key={item.id} className="story-node" delay={i * 0.06}>
              <span className="story-node-no">{item.step}</span>
              <strong>{item.name}</strong>
              <p>{item.role}</p>
            </Reveal>
          ))}
        </ol>
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <Reveal className="project-card" delay={(index % 2) * 0.08}>
      <Link className="project-shot" to={`/projects/${project.id}`} aria-label={`${project.title} 상세 보기`}>
        <div className="shot-frame">
          <div className="frame-bar light"><i /><i /><i /><span>{project.english}</span></div>
          <img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" />
        </div>
        {project.imageNote && <span className="image-note">{project.imageNote}</span>}
      </Link>
      <div className="project-body">
        <div className="badge-row">
          <span className="status-badge" style={{ "--badge": project.accent }}>
            <i /> {project.statusLabel}
          </span>
          <span className="story-step">{project.storyStep}</span>
        </div>
        <div className="project-head">
          <div>
            <h3>{project.title}</h3>
            <p className="english">{project.english}</p>
          </div>
          <span className="project-result" style={{ "--badge": project.accent }}>{project.result}</span>
        </div>
        <p className="one-line">{project.oneLine}</p>
        <p className="focus-line">{project.focus.slice(0, 4).join(" · ")}</p>
        <dl className="project-facts">
          <div><dt>Problem</dt><dd>{project.problem}</dd></div>
          <div><dt>Purpose</dt><dd>{project.purpose}</dd></div>
        </dl>
        <ul className="tech-stack">{project.tech.map((t) => <li key={t}>{t}</li>)}</ul>
        <div className="card-actions">
          {project.demoUrl && (
            <a className="btn dark" href={project.demoUrl} target="_blank" rel="noreferrer">
              VIEW DEMO <ExternalLink size={15} />
            </a>
          )}
          <Link className="btn outline" to={`/projects/${project.id}`} onPointerEnter={loadDetail}>Case Study <ArrowRight size={15} /></Link>
          {!project.demoUrl && project.demoNote && (
            <span className="demo-note"><Lock size={13} aria-hidden="true" /> {project.demoNote}</span>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- charts ---------- */

function GSDataStorySection() {
  return (
    <section className="section data-story gs-story" id="gs-story">
      <div className="wrap">
        <SectionHeading eyebrow="GS Retail · Data Story" title="현장 문제에서 수치 개선까지" desc="GS리테일 신선강화지원팀에서 검품 운영을 제품으로 바꾼 과정입니다." />

        <ol className="story-flow">
          {gsData.flow.map((item, i) => (
            <Reveal as="li" key={item.step} className={`flow-step${i === gsData.flow.length - 1 ? " last" : ""}`} delay={i * 0.07}>
              <span className="flow-no">{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </ol>

        <div className="story-grid gs-grid">
          <Reveal className="story-card span-5">
            <div className="story-head">
              <span>검품률 · Before / After</span>
              <strong>3~5% <ArrowRight size={22} /> <em>6~8%</em></strong>
            </div>
            <Deferred height={250}><InspectionRateChart /></Deferred>
            <p className="story-note">구간(범위)으로 표기한 운영 수치입니다.</p>
          </Reveal>

          <Reveal className="story-card span-3 time-card" delay={0.08}>
            <div className="story-head">
              <span>업무시간 절감</span>
              <strong><em>일 <CountUp to={gsData.hoursSaved} />시간</em></strong>
            </div>
            <div className="time-flow" aria-label="수기 취합에서 자동 보고서 생성으로">
              <div className="time-node before">
                <small>Before</small>
                <b>수기 취합 · 서식 정리</b>
              </div>
              <div className="time-arrow"><span>−<CountUp to={gsData.hoursSaved} />h / day</span></div>
              <div className="time-node after">
                <small>After</small>
                <b>Report Generator 자동 생성</b>
              </div>
            </div>
          </Reveal>

          <Reveal className="story-card span-4" delay={0.16}>
            <div className="story-head">
              <span>직접 구축한 범위</span>
              <strong>제품 3 <small>+</small> 장비 연동 1</strong>
            </div>
            <ol className="scope-list">
              {gsData.scope.map((item, i) => (
                <li key={item.name}>
                  <span className="scope-no">{i + 1}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.desc}</small>
                  </div>
                </li>
              ))}
            </ol>
            <p className="story-note">제품 화면의 운영 수치는 공개하지 않고, 성과는 위 지표로만 보여드립니다.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function RankTrack() {
  const { from, to, total } = emartData.rank;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const ranks = Array.from({ length: total }, (_, i) => total - i); // 21 ... 1 (left → right)
  return (
    <div className="rank-track" ref={ref} role="img" aria-label={`피자 구독권 순위 ${from}위에서 ${to}위로 상승`}>
      <div className="rank-line">
        <motion.span
          className="rank-fill"
          initial={reduce ? false : { scaleX: 0 }}
          animate={inView || reduce ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        {ranks.map((r) => (
          <i key={r} className={r === from ? "dot start" : r === to ? "dot end" : "dot"} />
        ))}
      </div>
      <div className="rank-labels">
        <span><small>Before</small><b>{from}위</b></span>
        <span className="end"><Trophy size={18} aria-hidden="true" /><small>After</small><b>{to}위</b></span>
      </div>
    </div>
  );
}

function OpeningTimeline() {
  return (
    <ol className="open-timeline">
      {emartData.openings.map((item, i) => (
        <li key={item.store}>
          <span className="node">{i + 1}</span>
          <strong>{item.store}</strong>
          <small>{item.note}</small>
        </li>
      ))}
    </ol>
  );
}

function EmartStorySection() {
  const increase = Math.round(((0.7 - 0.5) / 0.5) * 100);
  return (
    <section className="section data-story emart-story" id="emart-story">
      <div className="wrap">
        <SectionHeading eyebrow="Emart Traders · Results" title="7년 4개월 현장에서 만든 성과" desc="매출 활성화, 프로모션 순위 상승, 신규점 오픈 경험을 GS리테일 성과와 분리해 보여드립니다." />
        <div className="story-grid emart-grid">
          <Reveal className="story-card span-5">
            <div className="story-head">
              <span>즉석조리 일매출</span>
              <strong>0.5억 <ArrowRight size={22} /> <em>0.7억</em></strong>
            </div>
            <Deferred height={250}><SalesChart /></Deferred>
            <p className="story-note"><b className="pill">+{increase}%</b> 즉석조리 일매출 상승폭</p>
          </Reveal>

          <Reveal className="story-card span-4" delay={0.08}>
            <div className="story-head">
              <span>피자 구독권 순위</span>
              <strong>21위 <ArrowRight size={22} /> <em>1위</em></strong>
            </div>
            <RankTrack />
            <p className="story-note">화서점 피자 구독권 실적 순위를 21단계 끌어올렸습니다.</p>
          </Reveal>

          <Reveal className="story-card span-3" delay={0.16}>
            <div className="story-head">
              <span>신규점 오픈</span>
              <strong><em>3</em>개점</strong>
            </div>
            <OpeningTimeline />
            <p className="story-note">구월 · 화서 · 안성 오픈 경험</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- experience / about / skills / contact ---------- */

function ExperienceSection() {
  return (
    <section className="section experience-section" id="experience">
      <div className="wrap">
        <SectionHeading eyebrow="Experience" title="역할과 성과로 읽는 경력" desc="무엇을 맡았고, 무엇을 만들었고, 어떤 결과를 냈는지를 함께 정리했습니다." />
        <div className="career-grid">
          {careers.map((career, i) => (
            <Reveal className={`career-card ${career.key}`} key={career.key} delay={i * 0.08}>
              <div className="career-top">
                <span className="career-mark">{career.mark}</span>
                <div>
                  <h3>{career.company}</h3>
                  <p>{career.meta.join(" · ")}</p>
                </div>
              </div>
              <p className="career-summary">{career.summary}</p>
              <ul className="impact-row">
                {career.impacts.map((impact) => (
                  <li key={impact.label}>
                    <strong>{impact.value}</strong>
                    <span>{impact.label}</span>
                  </li>
                ))}
              </ul>
              <div className="career-cols">
                <div>
                  <h4>Role</h4>
                  <ul className="chip-list">{career.role.map((r) => <li key={r}>{r}</li>)}</ul>
                  <h4>Built / Owned</h4>
                  <ul className="chip-list outline">{career.built.map((b) => <li key={b}>{b}</li>)}</ul>
                </div>
                <ul className="check-list">
                  {career.bullets.map((b) => (
                    <li key={b}><Check size={16} aria-hidden="true" />{b}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-band" id="about">
      <div className="wrap about-inner">
        <div className="about-copy">
          <p className="section-eyebrow">About Me</p>
          <blockquote>
            “저는 현장에서 불편한 걸
            <br />
            그냥 두고 못 보는 사람입니다.”
          </blockquote>
          <p>
            현장의 불편을 관찰하고, 당연한 절차를 의심하고, 데이터를 확인한 뒤 직접 구현해 운영에서 검증합니다.
            리테일 운영 경험과 개발 역량을 함께 사용해 문제를 끝까지 개선합니다.
          </p>
        </div>
        <ol className="process-line">
          {aboutSteps.map((step, i) => (
            <Reveal as="li" className="process-step" key={step.title} delay={i * 0.07}>
              <span className="step-no">0{i + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className="section skills-section" id="skills">
      <div className="wrap">
        <SectionHeading eyebrow="Skills & Strengths" title="운영, 데이터, AI, 개발을 함께" desc="현장에서 문제를 찾는 능력과 직접 해결하는 기술 역량을 함께 갖추고 있습니다." />
        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <Reveal className={`skill-card ${group.key}`} key={group.key} delay={i * 0.06}>
              <span className="skill-index">0{i + 1}</span>
              <h3>{group.title}</h3>
              <p>{group.desc}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.name}>
                    {item.name}
                    {item.level && <em>{item.level}</em>}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <h3 className="sub-heading">Strengths</h3>
        <div className="strengths-grid">
          {strengths.map((item, i) => (
            <Reveal className="strength-card" key={item.title} delay={(i % 3) * 0.06}>
              <span className="strength-no">0{i + 1}</span>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="cert-row">
          <h3 className="sub-heading">Certifications</h3>
          <ul>
            {certifications.map((cert) => (
              <li key={cert}><Check size={16} aria-hidden="true" /> {cert}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const items = [
    { icon: Mail, label: "Email", value: contacts.email, href: `mailto:${contacts.email}` },
    { icon: Phone, label: "Phone", value: contacts.phone, href: contacts.phoneHref },
    { icon: Github, label: "GitHub", value: contacts.github.replace("https://", ""), href: contacts.github, external: true },
    { icon: FileText, label: "Resume / 소개서", value: "소개서 다운로드", href: contacts.resume, download: true },
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact-inner">
        <div>
          <p className="section-eyebrow">Contact</p>
          <h2>현장의 문제를 제품으로 바꾸는 일을 함께하고 싶습니다.</h2>
          <p>새로운 도전과 협업의 기회를 열어두고 있습니다.</p>
          <p className="contact-name"><strong>{contacts.name}</strong> / {contacts.nameEn}</p>
        </div>
        <div className="contact-grid">
          {items.map(({ icon: Icon, label, value, href, download, external }) => (
            <a key={label} href={href} {...(download ? { download: true } : external ? { target: "_blank", rel: "noreferrer" } : {})}>
              <Icon size={22} aria-hidden="true" />
              <span>{label}</span>
              <strong>{value}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main>
      <Hero />
      <ProjectsSection />
      <GSDataStorySection />
      <EmartStorySection />
      <ExperienceSection />
      <AboutSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
}

/* ---------- project detail ---------- */

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/projects/:id"
          element={
            <Suspense fallback={<div className="detail-page" aria-busy="true" />}>
              <ProjectDetail />
            </Suspense>
          }
        />
      </Routes>
      <footer className="site-footer">
        <div className="wrap">
          <span>SEUNGHO CHOI</span>
          <p>© 2026 Seungho Choi. Portfolio Website.</p>
        </div>
      </footer>
      <Toaster richColors position="bottom-right" />
    </HashRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
