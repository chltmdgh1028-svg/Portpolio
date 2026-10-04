import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { projectPath, projectStory, projects } from "./data";
import { TLink } from "./transition";
import { ClipReveal, Reveal, Shot, useHoverCapable, usePointerVars } from "./ui";

function WorkItem({ project, index }) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);
  usePointerVars(frameRef, { enabled: hover && !reduce });
  const next = projectStory[index + 1];

  return (
    <article ref={ref} className={`work-item${index % 2 ? " flip" : ""}`} style={{ "--accent": project.accent }} id={`work-${project.id}`}>
      <div className="work-copy">
        <Reveal className="work-no" y={14}>
          <span>{project.no}</span>
          <i aria-hidden="true" />
          <b>{project.kicker}</b>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="work-name">{project.english}</p>
          <h3 className="work-headline">
            {project.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h3>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="work-one">{project.oneLine}</p>
          <div className="work-metric">
            <small>{project.resultLabel}</small>
            <strong>{project.resultValue}</strong>
          </div>
          <p className="work-meta">
            <span className="status-badge" style={{ "--badge": project.accent }}>
              <i /> {project.statusLabel}
            </span>
            <span className="work-role">{project.role}</span>
          </p>
        </Reveal>
        <Reveal delay={0.15} className="work-cta">
          <TLink className="cta-link" to={projectPath(project.id)} kind="expand" tone="work">
            EXPLORE CASE STUDY <ArrowRight size={16} />
          </TLink>
          {project.demoUrl && (
            <a className="cta-demo" href={project.demoUrl} target="_blank" rel="noreferrer">
              VIEW DEMO <ArrowUpRight size={15} />
            </a>
          )}
          {!project.demoUrl && project.demoNote && (
            <span className="demo-note">
              <Lock size={13} aria-hidden="true" /> {project.demoNote}
            </span>
          )}
        </Reveal>
      </div>

      <div className="work-visual">
        <ClipReveal>
          <motion.div style={{ y }} className="work-parallax">
            <TLink ref={frameRef} className="work-frame" to={projectPath(project.id)} kind="expand" tone="work" aria-label={`${project.english} 케이스 스터디 보기`}>
              <span className="win-bar light">
                <i />
                <i />
                <i />
                <b>{project.english}</b>
              </span>
              <Shot src={project.image} alt={project.imageAlt} sizes="(min-width: 1280px) 720px, 92vw" />
              <span className="spot" aria-hidden="true" />
            </TLink>
          </motion.div>
        </ClipReveal>
        {project.imageNote && <span className="image-note">{project.imageNote}</span>}
      </div>

      {next && (
        <p className="handoff" aria-label="다음 프로젝트로 이어지는 흐름">
          <i aria-hidden="true" />
          <span>{project.handoff}</span>
          <b>
            {next.step} {next.name}
          </b>
        </p>
      )}
    </article>
  );
}

export function WorkList() {
  return (
    <div className="work-list">
      {projects.map((project, index) => (
        <WorkItem key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
