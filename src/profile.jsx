import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Check, Download, FileText, Mail, Phone } from "lucide-react";
import { aboutSteps, careers, certifications, contacts, documents, skillGroups, strengths } from "./data";
import { Reveal, SectionHeading } from "./ui";
import "./profile.css";

/* ---------- experience ---------- */

export function ExperienceSection() {
  return (
    <section className="profile experience light" id="experience">
      <div className="wrap">
        <SectionHeading eyebrow="Experience" title="역할과 성과로 읽는 경력" desc="무엇을 맡았고, 무엇을 만들었고, 어떤 결과를 냈는지를 함께 정리했습니다." />
        <div className="career-list">
          {careers.map((career) => (
            <Reveal className={`career ${career.key}`} key={career.key}>
              <div className="career-id">
                <span className="career-logo">
                  <img src={career.logo.src} alt={career.logo.alt} width={career.logo.w} height={career.logo.h} loading="lazy" decoding="async" />
                </span>
                <h3>{career.company}</h3>
                <p>{career.meta.join(" · ")}</p>
              </div>
              <div className="career-main">
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
  );
}

/* ---------- about ---------- */

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  return (
    <section className="profile about dark" id="about">
      <div className="story-bg" aria-hidden="true">
        <i className="aurora a2" />
        <div className="noise" />
      </div>
      <div className="wrap about-inner">
        <div className="about-copy">
          <p className="section-eyebrow">About Me</p>
          <Reveal as="blockquote">
            “저는 현장에서 불편한 걸
            <br />
            그냥 두고 못 보는 사람입니다.”
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              현장의 불편을 관찰하고, 당연한 절차를 의심하고, 데이터를 확인한 뒤 직접 구현해 운영에서 검증합니다. 리테일 운영 경험과 개발 역량을 함께 사용해 문제를 끝까지 개선합니다.
            </p>
          </Reveal>
        </div>
        <ol className={`process-line${inView ? " play" : ""}`} ref={ref}>
          {aboutSteps.map((step, i) => (
            <li className="process-step" key={step.title} style={{ "--i": i }}>
              <span className="step-no">0{i + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- skills ---------- */

export function SkillsSection() {
  return (
    <section className="profile skills light" id="skills">
      <div className="wrap">
        <SectionHeading eyebrow="Skills & Strengths" title="운영, 데이터, AI, 개발을 함께" desc="현장에서 문제를 찾는 능력과 직접 해결하는 기술 역량을 함께 갖추고 있습니다." />
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

/* ---------- contact ---------- */

function ContactTile({ icon: Icon, label, value, href, filename, disabled, hint }) {
  const body = (
    <>
      <Icon size={22} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </>
  );
  if (disabled) {
    return (
      <span className="contact-tile disabled" aria-disabled="true" title="최종 PDF가 준비되는 대로 연결됩니다">
        {body}
      </span>
    );
  }
  return (
    <a className="contact-tile" href={href} {...(filename ? { download: filename } : {})}>
      {body}
    </a>
  );
}

export function ContactSection() {
  const { resume, portfolio } = documents;
  return (
    <section className="profile contact dark" id="contact">
      <div className="story-bg" aria-hidden="true">
        <i className="aurora a1" />
        <div className="grid-bg" />
        <div className="noise" />
      </div>
      <div className="wrap contact-inner">
        <div>
          <p className="section-eyebrow">Contact</p>
          <h2>현장의 문제를 제품으로 바꾸는 일을 함께하고 싶습니다.</h2>
          <p>새로운 도전과 협업의 기회를 열어두고 있습니다.</p>
          <p className="contact-name">
            <strong>{contacts.name}</strong> / {contacts.nameEn}
          </p>
        </div>
        <div className="contact-grid">
          <ContactTile icon={Mail} label="Email" value={contacts.email} href={`mailto:${contacts.email}`} />
          <ContactTile icon={Phone} label="Phone" value={contacts.phone} href={contacts.phoneHref} />
          <ContactTile icon={FileText} label="Resume Download" value={resume.file ? "이력서 다운로드" : "PDF 준비 중"} href={resume.file} filename={resume.filename} disabled={!resume.file} />
          <ContactTile icon={Download} label="Portfolio Download" value={portfolio.file ? "포트폴리오 다운로드" : "PDF 준비 중"} href={portfolio.file} filename={portfolio.filename} disabled={!portfolio.file} />
        </div>
      </div>
    </section>
  );
}
