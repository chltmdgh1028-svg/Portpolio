import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Lock } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { projects } from "./data";
import { ClipReveal, Reveal, Shot, scrollToSection } from "./ui";
import "./detail.css";

const CHAPTERS = [
  { key: "problem", title: "THE PROBLEM", ko: "문제" },
  { key: "constraints", title: "CONSTRAINTS", ko: "제약" },
  { key: "approach", title: "APPROACH", ko: "접근" },
  { key: "product", title: "PRODUCT", ko: "제품" },
  { key: "decisions", title: "KEY DECISIONS", ko: "핵심 판단" },
  { key: "result", title: "RESULT", ko: "결과" },
  { key: "iteration", title: "ITERATION", ko: "개선" },
];

function List({ items, marker = "check" }) {
  return (
    <ul className={`cs-list ${marker}`}>
      {items.map((item) => (
        <li key={item}>
          {marker === "check" ? <Check size={16} aria-hidden="true" /> : <i aria-hidden="true" />}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function useActiveChapter(keys) {
  const [active, setActive] = useState(keys[0]);
  useEffect(() => {
    const els = keys.map((k) => document.getElementById(`ch-${k}`)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.key));
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [keys]);
  return active;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const index = Math.max(0, projects.findIndex((item) => item.id === id));
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const slides = useMemo(() => project.gallery.map((src) => ({ src })), [project]);
  const story = project.story;

  const chapters = useMemo(() => CHAPTERS.filter((c) => (c.key === "result" ? true : story[c.key])), [story]);
  const keys = useMemo(() => chapters.map((c) => c.key), [chapters]);
  const active = useActiveChapter(keys);
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLightboxIndex(-1);
    document.title = `${project.english} — Seungho Choi`;
  }, [id, project.english]);

  const renderChapter = (key) => {
    switch (key) {
      case "problem":
        return story.problem.map((text, i) => (
          <p key={text} className={i === 0 ? "lead" : undefined}>
            {text}
          </p>
        ));
      case "constraints":
        return <List items={story.constraints} marker="dot" />;
      case "approach":
        return (
          <>
            <p className="lead">{story.approach}</p>
            <ol className="cs-flow" aria-label="프로젝트 진행 흐름">
              {project.caseStudy.flow.map((step, i) => (
                <li key={step}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </>
        );
      case "product":
        return (
          <>
            <List items={story.product} />
            <div className="cs-shots">
              {project.gallery.map((src, i) => (
                <figure key={src}>
                  <button type="button" onClick={() => setLightboxIndex(i)} aria-label={`${project.captions[i]} 확대`}>
                    <Shot src={src} alt={`${project.english} — ${project.captions[i]} (sanitized demo data)`} sizes="(min-width: 1100px) 760px, 92vw" />
                  </button>
                  <figcaption>
                    <b>{String(i + 1).padStart(2, "0")}</b> {project.captions[i]}
                    {project.imageNote && <em>{project.imageNote}</em>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        );
      case "decisions":
        return <List items={story.decisions} marker="dot" />;
      case "result":
        return (
          <>
            <p className="cs-metric">
              <small>{project.resultLabel}</small>
              <strong>{project.resultValue}</strong>
            </p>
            <List items={project.metrics} />
          </>
        );
      case "iteration":
        return <p className="lead">{story.iteration}</p>;
      default:
        return null;
    }
  };

  return (
    <main className="detail-page" style={{ "--accent": project.accent }}>
      <header className="cs-hero dark" ref={heroRef}>
        <div className="story-bg" aria-hidden="true">
          <i className="aurora a1 tinted" />
          <i className="aurora a3" />
          <div className="grid-bg" />
          <div className="noise" />
        </div>
        <div className="wrap cs-hero-inner">
          <div className="cs-copy">
            <button className="cs-back" onClick={() => navigate("/", { state: { scrollTo: `work-${project.id}` } })}>
              <ArrowLeft size={16} /> ALL WORK
            </button>
            <p className="cs-kicker rise" style={{ "--i": 0 }}>
              <span>No. {project.no}</span>
              <i aria-hidden="true" />
              <span>{project.kicker}</span>
            </p>
            <h1 className="rise" style={{ "--i": 1 }}>{project.title}</h1>
            <p className="cs-en rise" style={{ "--i": 2 }}>{project.english}</p>
            <p className="cs-one rise" style={{ "--i": 3 }}>{project.oneLine}</p>
            <dl className="cs-meta rise" style={{ "--i": 4 }}>
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className="status-badge" style={{ "--badge": project.accent }}>
                    <i /> {project.statusLabel}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{project.tech.join(" · ")}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd className="cs-result">{project.result}</dd>
              </div>
            </dl>
            <div className="cs-cta rise" style={{ "--i": 5 }}>
              {project.demoUrl && (
                <a className="btn primary" href={project.demoUrl} target="_blank" rel="noreferrer">
                  VIEW DEMO <ArrowUpRight size={16} />
                </a>
              )}
              {!project.demoUrl && project.demoNote && (
                <p className="demo-note">
                  <Lock size={14} aria-hidden="true" /> {project.demoNote}
                </p>
              )}
              <ul className="focus-chips">{project.focus.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
          </div>
          <div className="cs-shot">
            <button type="button" onClick={() => setLightboxIndex(0)} aria-label="스크린샷 확대">
              <Shot src={project.image} alt={project.imageAlt} sizes="(min-width: 1100px) 700px, 92vw" eager />
            </button>
            {project.imageNote && <span className="image-note">{project.imageNote}</span>}
          </div>
        </div>
      </header>

      <div className="cs-body light">
        <div className="wrap cs-layout">
          <nav className="cs-nav" aria-label="Case Study 목차">
            <ol>
              {chapters.map((c, i) => (
                <li key={c.key}>
                  <button type="button" className={active === c.key ? "on" : ""} aria-current={active === c.key ? "true" : undefined} onClick={() => scrollToSection(`ch-${c.key}`)}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {c.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="cs-chapters">
            {chapters.map((c, i) => (
              <Reveal key={c.key} className="cs-chapter" y={18}>
                <section id={`ch-${c.key}`} data-key={c.key}>
                  <header>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <h2>
                      {c.title} <small>{c.ko}</small>
                    </h2>
                  </header>
                  <div className="cs-ch-body">{renderChapter(c.key)}</div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <section className="cs-next dark" style={{ "--accent": next.accent }}>
        <div className="wrap">
          <p className="section-eyebrow">Next Case Study</p>
          <Link className="cs-next-link" to={`/projects/${next.id}`}>
            <span>
              <small>
                {next.no} · {next.kicker}
              </small>
              <strong>{next.english}</strong>
              <em>{next.headline.join(" ")}</em>
              <b>
                EXPLORE CASE STUDY <ArrowRight size={16} />
              </b>
            </span>
            <ClipReveal className="cs-next-shot">
              <Shot src={next.image} alt="" sizes="(min-width: 1100px) 520px, 80vw" />
            </ClipReveal>
          </Link>
        </div>
      </section>

      <Lightbox open={lightboxIndex >= 0} index={Math.max(lightboxIndex, 0)} close={() => setLightboxIndex(-1)} slides={slides} />
    </main>
  );
}
