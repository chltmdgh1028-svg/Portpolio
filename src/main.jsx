import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Github,
  LineChart,
  Mail,
  Menu,
  MonitorSmartphone,
  PackageCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./styles.css";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const screenshots = {
  inspection: "/screens/inspection-app-main.png",
  summary: "/screens/inspection-summary-kpi.png",
  dashboard: "/screens/inspection-dashboard.png",
  report: "/screens/report-generator.png",
  oneOps: "/screens/one-ops.png",
};

const projects = [
  {
    id: "inspection-app",
    title: "신선상품 검품 시스템",
    english: "Inspection App",
    status: "운영중",
    category: "검품 운영",
    problem: "검품 기준과 수량, 사진 기록이 흩어져 담당자별 편차가 발생했습니다.",
    description: "수량 확인, 바코드 기반 검품, 사진 기록, 기준안 연결을 모바일 흐름으로 통합한 현장형 검품 시스템입니다.",
    tech: ["React", "Vite", "Apps Script", "Ably"],
    image: screenshots.inspection,
    accent: "#2f8cff",
    result: "검품률 3~5% → 6~8%",
    metrics: ["SKU 검품 범위 확대", "사진/수량 기록 통합", "현장 검증 루프 구축"],
  },
  {
    id: "inspection-dashboard",
    title: "검품 Dashboard",
    english: "Inspection Dashboard",
    status: "운영중",
    category: "검품 운영",
    problem: "검품 데이터가 쌓여도 당일 운영 판단에 바로 쓰기 어려웠습니다.",
    description: "센터, 협력사, SKU 커버리지와 검품량을 실시간으로 확인하는 운영 대시보드입니다.",
    tech: ["React", "Recharts", "Vercel", "Sheets"],
    image: screenshots.dashboard,
    accent: "#5b6cff",
    result: "검품 SKU 2,150개 추적",
    metrics: ["협력사별 수행 수준", "구간별 점수 시각화", "운영 리듬 단축"],
  },
  {
    id: "report-generator",
    title: "보고서 자동 생성기",
    english: "Report Generator",
    status: "운영중",
    category: "업무 효율화",
    problem: "매일 반복되는 보고서 정리와 공유에 많은 시간이 소요됐습니다.",
    description: "검품 데이터를 협력사와 파트너 보고서 형태로 자동 정리해 반복 보고 업무를 줄인 도구입니다.",
    tech: ["Apps Script", "PPT", "Sheets", "Vercel"],
    image: screenshots.report,
    accent: "#15a76d",
    result: "일 4시간 절감",
    metrics: ["반복 보고 자동화", "파트너 공유 속도 개선", "표준 템플릿 정착"],
  },
  {
    id: "one-ops",
    title: "One Ops",
    english: "One Ops",
    status: "기획중",
    category: "업무 효율화",
    problem: "정포, 센터, 영업서, 본사를 잇는 운영 맥락이 여러 채널로 분산됐습니다.",
    description: "통합 운영 팔로업과 액션 로그를 한 곳에서 관리하는 현장 운영 플랫폼 콘셉트입니다.",
    tech: ["React19", "TypeScript", "Supabase", "Tailwind"],
    image: screenshots.oneOps,
    accent: "#7c5cff",
    result: "운영 맥락 통합",
    metrics: ["액션 로그", "이슈 추적", "협업 히스토리"],
  },
];

const impactCards = [
  { icon: PackageCheck, label: "검품률", before: "3~5%", after: "6~8%", note: "신선상품 검품 커버리지 확대" },
  { icon: Clock3, label: "업무 시간", before: "반복 수작업", after: "일 4시간 절감", note: "보고서 자동화 및 데이터 통합" },
  { icon: BarChart3, label: "즉석조리 일매출", before: "0.5억", after: "0.7억", note: "안성점 매장 동선 개선" },
  { icon: Trophy, label: "피자 구독권", before: "21위", after: "1위", note: "화서점 프로모션 기획 및 운영" },
];

const skillGroups = [
  { title: "Product / Operations", items: ["Process Improvement", "Product Planning", "Data Analysis", "Field Operations"] },
  { title: "Frontend", items: ["React", "TypeScript", "Vite", "Tailwind"] },
  { title: "Backend / Data", items: ["Apps Script", "Google Sheets", "Supabase", "SQL"] },
  { title: "Tools", items: ["Git", "GitHub", "Vercel", "Figma", "Notion"] },
];

function useCountUp(value, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, active]);
  return count;
}

function Header() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") {
      setActive("");
      return;
    }
    const observers = navItems.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-36% 0px -55% 0px", threshold: 0.01 },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [location.pathname]);

  const goTo = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="site-header">
      <button className="brand" onClick={() => goTo("home")} aria-label="홈으로 이동">
        SEUNGHO CHOI
      </button>
      <nav className="desktop-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={active === item.id ? "active" : ""}
            onClick={() => goTo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <a className="resume-button" href="/seungho-choi-resume.txt" download>
          이력서 다운로드 <Download size={16} />
        </a>
        <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="메뉴 열기">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => goTo(item.id)}>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function KpiNumber({ target, suffix = "" }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useCountUp(target, inView);
  return <span ref={ref}>{count}{suffix}</span>;
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Product · Operations · Retail · Developer</p>
          <h1>
            현장의 문제를
            <strong>데이터와 제품</strong>으로
            해결합니다.
          </h1>
          <p className="hero-sub">
            리테일 현장에서 발견한 비효율을 그냥 두지 않고, 직접 시스템을 만들어 운영까지 연결해온 최승호입니다.
          </p>
          <div className="hero-cta">
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
              프로젝트 둘러보기 <ChevronRight size={18} />
            </button>
            <a href="/seungho-choi-resume.txt" download>
              소개서 보기 <FileText size={18} />
            </a>
          </div>
        </div>
        <div className="device-stage" aria-label="Inspection App 프로젝트 화면 미리보기">
          <div className="laptop-frame">
            <div className="frame-dots"><span /><span /><span /></div>
            <img src={screenshots.dashboard} alt="Inspection Dashboard 화면" />
          </div>
          <div className="phone-frame">
            <div className="phone-notch" />
            <img src={screenshots.inspection} alt="Inspection App 모바일 화면" />
          </div>
          <div className="floating-note">
            <Sparkles size={18} />
            <span>더 나은 운영 현장을 위해, 오늘도 개선합니다.</span>
          </div>
        </div>
      </div>
      <HeroKpi />
    </section>
  );
}

function HeroKpi() {
  const items = [
    { label: "검품률 향상", value: "3~5% → 6~8%", icon: LineChart },
    { label: "업무시간 절감", value: "일 4시간", icon: Clock3 },
    { label: "리테일 경력", value: "8년+", icon: CircleUserRound },
    { label: "직접 구축한 제품", value: "검품앱 · 대시보드 · 보고서 · One Ops", icon: MonitorSmartphone },
  ];
  return (
    <div className="hero-kpi">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div className="hero-kpi-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <Icon size={27} />
          </div>
        );
      })}
    </div>
  );
}

function SectionHeading({ eyebrow, title, desc, dark = false }) {
  return (
    <div className={`section-heading ${dark ? "dark" : ""}`}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {desc && <span>{desc}</span>}
    </div>
  );
}

function ProjectsSection() {
  const filters = ["전체", "검품 운영", "업무 효율화"];
  const [filter, setFilter] = useState("전체");
  const filtered = filter === "전체" ? projects : projects.filter((project) => project.category === filter);
  return (
    <section className="section projects-section" id="projects">
      <SectionHeading eyebrow="Featured Projects" title="주요 프로젝트" desc="현장의 실제 문제를 해결한 제품들입니다." />
      <div className="filter-row">
        {filters.map((item) => (
          <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
      <motion.div className="project-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.article className="project-card" layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
      <Link className="project-image" to={`/projects/${project.id}`} aria-label={`${project.title} 상세 보기`}>
        <span className="status-badge" style={{ "--badge": project.accent }}>{project.status}</span>
        <img src={project.image} alt={`${project.title} 스크린샷`} />
      </Link>
      <div className="project-body">
        <div>
          <h3>{project.title}</h3>
          <p className="english">{project.english}</p>
        </div>
        <p className="problem">{project.problem}</p>
        <p>{project.description}</p>
        <div className="tech-stack">
          {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
        </div>
        <div className="card-actions">
          <button onClick={() => toast.info("데모 URL이 연결되면 이 버튼에서 바로 열 수 있습니다.")}>
            Live Demo <ExternalLink size={15} />
          </button>
          <Link to={`/projects/${project.id}`}>
            Case Study
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function ImpactSection() {
  return (
    <section className="section impact-section">
      <SectionHeading eyebrow="Results / Impact" title="주요 성과" desc="Before → After가 바로 읽히도록 숫자로 정리했습니다." />
      <div className="impact-grid">
        {impactCards.map((card) => {
          const Icon = card.icon;
          return (
            <Reveal className="impact-card" key={card.label}>
              <Icon size={28} />
              <div>
                <p>{card.label}</p>
                <strong><span>{card.before}</span> → <b>{card.after}</b></strong>
                <small>{card.note}</small>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ExperienceSection() {
  const careers = [
    {
      company: "GS리테일",
      period: "2024.02 - 현재",
      logo: "GS",
      image: screenshots.summary,
      bullets: ["신선강화지원팀", "검품 시스템 구축 및 기준안 수립", "검품률 3~5% → 6~8%, 일 4시간 절감", "대시보드/보고서 생성기 운영", "H-100F 비파괴 당도계 연동"],
    },
    {
      company: "이마트 트레이더스",
      period: "2016 - 2023",
      logo: "emart",
      image: screenshots.dashboard,
      bullets: ["8년+ 리테일 현장 경험", "3개점 신규 오픈 참여", "화서점 피자 구독권 21위 → 1위", "안성점 즉석조리 일매출 0.5억 → 0.7억", "매출, 재고, 동선, 프로모션 개선"],
    },
  ];
  return (
    <section className="section experience-section" id="experience">
      <SectionHeading eyebrow="Experience" title="경력 및 주요 경험" desc="직책보다 문제를 발견하고 해결한 흐름을 중심으로 정리했습니다." />
      <div className="career-grid">
        {careers.map((career) => (
          <Reveal className="career-card" key={career.company}>
            <div className="career-main">
              <div className="career-logo">{career.logo}</div>
              <div>
                <h3>{career.company}</h3>
                <p>{career.period}</p>
                <ul>
                  {career.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </div>
            </div>
            <img src={career.image} alt={`${career.company} 관련 프로젝트 화면`} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  const steps = ["관찰", "의심", "데이터 확인", "직접 구현", "현장 검증"];
  return (
    <section className="about-band" id="about">
      <div className="about-copy">
        <p className="eyebrow">About Me</p>
        <h2>저는 현장에서 불편한 걸<br />그냥 두고 못 보는 사람입니다.</h2>
        <p>
          관행하고, 의심하고, 데이터를 확인하고, 직접 구현해 현장에서 검증하는 것을 좋아합니다.
          리테일 운영 경험과 개발 역량을 결합해 지속적으로 개선하는 것이 저의 일하는 방식입니다.
        </p>
      </div>
      <div className="process-line">
        {steps.map((step, index) => (
          <Reveal className="process-step" key={step}>
            <span>0{index + 1}</span>
            <strong>{step}</strong>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className="section skills-section" id="skills">
      <SectionHeading eyebrow="Skills" title="더 나은 경험을 만들기 위한 꾸준한 성장" desc="현장 운영과 제품 구현을 함께 다룰 수 있도록 역량을 넓혀왔습니다." />
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <Reveal className="skill-card" key={group.title}>
            <h3>{group.title}</h3>
            <div>
              {group.items.map((item) => <span key={item}>{item}</span>)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const contacts = [
    { icon: Mail, label: "Email", value: "seungho.choi@example.com" },
    { icon: Github, label: "GitHub", value: "github.com/chltmdgh1028-svg" },
    { icon: BriefcaseBusiness, label: "LinkedIn", value: "linkedin.com/in/seungho-choi" },
    { icon: FileText, label: "Notion", value: "notion.so/seungho-choi" },
  ];
  return (
    <section className="contact-section" id="contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>현장의 문제를 제품으로 바꾸는 일을 함께하고 싶습니다.</h2>
        <p>새로운 도전과 협업의 기회를 언제나 열어두고 있습니다. 편하게 연락주세요.</p>
      </div>
      <div className="contact-grid">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <button key={contact.label} onClick={() => toast.info(`${contact.label} 링크를 실제 주소로 교체하면 바로 연결됩니다.`)}>
              <Icon size={22} />
              <span>{contact.label}</span>
              <strong>{contact.value}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsSection />
      <ImpactSection />
      <ExperienceSection />
      <AboutSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const gallery = useMemo(() => [
    { src: project.image },
    { src: screenshots.summary },
    { src: screenshots.dashboard },
  ], [project.image]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  return (
    <main className="detail-page">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} /> 목록으로 돌아가기
      </button>
      <section className="detail-hero">
        <div>
          <span className="status-badge" style={{ "--badge": project.accent }}>{project.status}</span>
          <h1>{project.title}</h1>
          <p>{project.english}</p>
          <strong>{project.result}</strong>
        </div>
        <button className="detail-shot" onClick={() => setLightboxOpen(true)} aria-label="스크린샷 확대">
          <img src={project.image} alt={`${project.title} 대표 스크린샷`} />
        </button>
      </section>
      <section className="case-grid">
        {[
          ["Problem", project.problem],
          ["Why", "현장 운영의 문제는 작은 불편에서 시작되지만, 반복되면 비용과 품질 편차로 커집니다."],
          ["Solution", project.description],
          ["Process", "현장 관찰, 데이터 기준 정의, 빠른 프로토타입, 담당자 피드백, 운영 적용 순서로 진행했습니다."],
          ["Architecture", `${project.tech.join(" · ")} 기반으로 입력, 저장, 분석, 보고 흐름을 나눠 설계했습니다.`],
          ["Result", project.metrics.join(" · ")],
        ].map(([title, body]) => (
          <Reveal className="case-card" key={title}>
            <span>{title}</span>
            <p>{body}</p>
          </Reveal>
        ))}
      </section>
      <section className="detail-gallery">
        <h2>Screenshots</h2>
        <div>
          {gallery.map((item, index) => (
            <button key={item.src} onClick={() => setLightboxOpen(true)}>
              <img src={item.src} alt={`${project.title} 갤러리 ${index + 1}`} />
            </button>
          ))}
        </div>
      </section>
      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={gallery} />
    </main>
  );
}

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
      <footer className="site-footer">
        <span>SEUNGHO CHOI</span>
        <p>© 2026 Seungho Choi. Portfolio Website.</p>
      </footer>
      <Toaster richColors position="bottom-right" />
    </HashRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
