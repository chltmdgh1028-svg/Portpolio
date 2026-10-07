import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { careers } from "./data";
import { PortalHero } from "./pagehero";
import { Reveal, useDocTitle } from "./ui";
import "./profile.css";

const WHEN = { gs: "2026 — PRESENT", emart: "7Y 4M" };

export default function ExperiencePage() {
  useDocTitle("Experience — Seungho Choi");
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <main className="page page-exp">
      <PortalHero no="03" title="EXPERIENCE" headline="8+ years in retail operations." sub="매출 개선, 프로모션 성과, 신규점 오픈을 통해 7년 4개월간 리테일 현장 운영 역량을 쌓았습니다. 지금은 현장 문제를 제품과 자동화로 전환하고 있습니다." tone="experience" />

      <section className="exp light" ref={ref}>
        <div className="wrap">
          <div className="exp-body">
          <div className="exp-rail" aria-hidden="true">
            <i className="exp-track" />
            <motion.i className="exp-fill" style={{ scaleY: reduce ? 1 : fill }} />
          </div>
          {careers.map((career) => (
            <Reveal className={`exp-entry ${career.key}`} key={career.key}>
              <span className="exp-node" aria-hidden="true" />
              <p className="exp-when">{WHEN[career.key]}</p>
              <div className="exp-card">
                <div className="exp-head">
                  <span className="career-logo">
                    <img src={career.logo.src} alt={career.logo.alt} width={career.logo.w} height={career.logo.h} loading="lazy" decoding="async" />
                  </span>
                  <div>
                    <h2>{career.company}</h2>
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
                    <h4 aria-level={3}>Role</h4>
                    <ul className="chip-list">{career.role.map((r) => <li key={r}>{r}</li>)}</ul>
                    <h4 aria-level={3}>Built / Owned</h4>
                    <ul className="chip-list outline">{career.built.map((b) => <li key={b}>{b}</li>)}</ul>
                  </div>
                  <ul className="check-list">
                    {career.bullets.map((b) => (
                      <li key={b}>
                        <Check size={16} aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
          </div>
        </div>
      </section>
    </main>
  );
}
