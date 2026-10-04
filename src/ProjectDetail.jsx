import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { projects } from "./data";
import { Reveal } from "./ui";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const slides = useMemo(() => project.gallery.map((src) => ({ src })), [project]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const cases = [
    ["Problem", project.problem],
    ["Why", project.caseStudy.why],
    ["Solution", project.purpose],
    ["Process", project.caseStudy.process],
    ["Stack", `${project.tech.join(" · ")} 기반으로 입력, 저장, 분석, 보고 흐름을 나눠 구성했습니다.`],
    ["Result", project.metrics.join(" · ")],
  ];

  return (
    <main className="detail-page">
      <div className="wrap">
        <button className="btn outline back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={18} /> 목록으로 돌아가기
        </button>
        <section className="detail-hero">
          <div>
            <span className="status-badge static" style={{ "--badge": project.accent }}><i /> {project.statusLabel}</span>
            <h1>{project.title}</h1>
            <p className="detail-english">{project.english}</p>
            <strong className="detail-result">{project.result}</strong>
            <p className="detail-one">{project.oneLine}</p>
            <ul className="focus-chips">{project.focus.map((f) => <li key={f}>{f}</li>)}</ul>
            {project.demoUrl && (
              <a className="btn primary" href={project.demoUrl} target="_blank" rel="noreferrer">VIEW DEMO <ExternalLink size={15} /></a>
            )}
            {!project.demoUrl && project.demoNote && <p className="detail-note"><Lock size={14} /> {project.demoNote}</p>}
          </div>
          <div className="detail-shot-wrap">
            <button className="detail-shot" onClick={() => setLightboxIndex(0)} aria-label="스크린샷 확대">
              <img src={project.image} alt={project.imageAlt} />
            </button>
            {project.imageNote && <span className="image-note static">{project.imageNote}</span>}
          </div>
        </section>

        {project.caseStudy.flow && (
          <ol className="case-flow" aria-label="프로젝트 진행 흐름">
            {project.caseStudy.flow.map((step, i) => (
              <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>
            ))}
          </ol>
        )}

        <section className="case-grid">
          {cases.map(([title, body]) => (
            <Reveal className="case-card" key={title}>
              <span>{title}</span>
              <p>{body}</p>
            </Reveal>
          ))}
        </section>

        {project.gallery.length > 1 && (
        <section className="detail-gallery">
          <h2>Screenshots</h2>
          <div>
            {project.gallery.map((src, index) => (
              <button key={src} onClick={() => setLightboxIndex(index)} aria-label={`스크린샷 ${index + 1} 확대`}>
                <img src={src} alt={`${project.title} 스크린샷 ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </section>
        )}
        <Lightbox open={lightboxIndex >= 0} index={Math.max(lightboxIndex, 0)} close={() => setLightboxIndex(-1)} slides={slides} />
      </div>
    </main>
  );
}
