import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { aboutSteps, certifications, contacts, documents, skillGroups, strengths } from "./data";
import { DocButton } from "./layout";
import { PortalHero } from "./pagehero";
import { Reveal, SectionHeading, useDocTitle } from "./ui";
import "./profile.css";

/** OBSERVE / QUESTION / MEASURE / BUILD / VALIDATE: each word fills in as it reaches the middle of the viewport. */
function Words() {
  const refs = useRef([]);
  const [seen, setSeen] = useState({});
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSeen((s) => ({ ...s, [e.target.dataset.i]: true }));
        });
      },
      { rootMargin: "0px 0px -22% 0px", threshold: 0.35 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="pwords dark" aria-label="일하는 방식">
      <div className="story-bg" aria-hidden="true">
        <i className="aurora a2" />
        <div className="noise" />
      </div>
      <div className="wrap">
        <ol>
          {aboutSteps.map((step, i) => (
            <li key={step.word} data-i={i} ref={(el) => (refs.current[i] = el)} className={`pw-row${seen[i] ? " in" : ""}`}>
              <span className="pw-no">0{i + 1}</span>
              <span className="pw-word">
                <span>{step.word}.</span>
              </span>
              <span className="pw-desc">
                <b>{step.title}</b>
                {step.body}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="profile pabout light" id="about">
      <div className="wrap">
        <p className="section-eyebrow">About</p>
        <Reveal as="blockquote" className="pabout-quote">
          “저는 현장에서 불편한 걸
          <br />
          그냥 두고 못 보는 사람입니다.”
        </Reveal>
        <Reveal delay={0.08}>
          <p className="pabout-text">
            현장의 불편을 관찰하고, 당연한 절차를 의심하고, 데이터를 확인한 뒤 직접 구현해 운영에서 검증합니다. 리테일 운영 경험과 개발 역량을 함께 사용해 문제를 끝까지 개선합니다.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="profile skills-page light" id="skills">
      <div className="wrap">
        <SectionHeading eyebrow="Strengths & Skills" title="운영, 데이터, AI, 개발을 함께" desc="현장에서 문제를 찾는 능력과 직접 해결하는 기술 역량을 함께 갖추고 있습니다." />

        <h3 className="sub-heading">Strengths</h3>
        <div className="strengths-grid">
          {strengths.map((item, i) => (
            <Reveal className="strength" key={item.title} delay={(i % 3) * 0.05}>
              <span className="strength-no">0{i + 1}</span>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <h3 className="sub-heading">Skills</h3>
        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <Reveal className={`skill ${group.key}`} key={group.key} delay={i * 0.05}>
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

        <div className="cert-row">
          <h3 className="sub-heading">Certifications</h3>
          <ul>
            {certifications.map((cert) => (
              <li key={cert}>
                <Check size={16} aria-hidden="true" /> {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DocsCta() {
  return (
    <section className="docs-cta dark" id="documents">
      <div className="wrap docs-inner">
        <div>
          <p className="section-eyebrow">Documents</p>
          <h2>자세한 이력은 문서로 확인하실 수 있습니다.</h2>
          <p>{documents.resume.file || documents.portfolio.file ? "아래에서 바로 내려받을 수 있습니다." : "최종 PDF가 준비되는 대로 이곳에 연결됩니다."}</p>
        </div>
        <div className="docs-actions">
          <DocButton doc={documents.resume} className="big" />
          <DocButton doc={documents.portfolio} className="big" />
          <a className="docs-mail" href={`mailto:${contacts.email}`}>
            {contacts.email}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  useDocTitle("Profile — Seungho Choi");
  return (
    <main className="page page-profile">
      <PortalHero no="04" title="PROFILE" headline="Observe. Question. Measure. Build. Validate." sub="현장에서 문제를 발견하고, 데이터로 확인하고, 직접 만들어 검증하는 방식입니다." tone="profile" />
      <Words />
      <About />
      <Skills />
      <DocsCta />
    </main>
  );
}

