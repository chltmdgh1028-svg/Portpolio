import React, { useEffect, useState } from "react";
import { projects } from "./data";
import { PortalHero } from "./pagehero";
import { Showreel } from "./hero";
import { WorkList } from "./work";
import { scrollToSection, useDocTitle } from "./ui";
import "./hero.css";
import "./work.css";

/** Sticky CAPTURE / MONITOR / REPORT / EXPAND navigation with active state. */
function ProjectNav() {
  const [active, setActive] = useState(projects[0].id);
  useEffect(() => {
    const els = projects.map((p) => document.getElementById(`work-${p.id}`)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("work-", "")));
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <nav className="project-nav" aria-label="프로젝트 바로가기">
      <div className="wrap">
        <ol>
          {projects.map((p) => (
            <li key={p.id}>
              <button type="button" className={active === p.id ? "on" : ""} aria-current={active === p.id ? "true" : undefined} onClick={() => scrollToSection(`work-${p.id}`)}>
                <span>{p.no}</span>
                {p.kicker}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export default function WorkPage() {
  useDocTitle("Work — Seungho Choi");
  return (
    <main className="page page-work">
      <PortalHero
        no="01"
        title="WORK"
        headline="Products built from real operations."
        sub="현장에서 데이터를 만들고, 모니터링하고, 보고하고, 더 넓은 운영으로 확장해온 네 가지 제품입니다."
        tone="work"
      >
        <ol className="phero-steps rise" style={{ "--i": 6 }} aria-label="프로젝트 흐름">
          {projects.map((p) => (
            <li key={p.id}>
              <span>{p.no}</span>
              {p.kicker}
            </li>
          ))}
        </ol>
      </PortalHero>
      <Showreel />
      <section className="work light" id="work">
        <ProjectNav />
        <div className="wrap">
          <WorkList />
        </div>
      </section>
    </main>
  );
}
