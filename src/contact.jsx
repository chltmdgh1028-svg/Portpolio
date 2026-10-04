import React from "react";
import { Download, FileText, Mail, Phone } from "lucide-react";
import { contacts, documents } from "./data";
import "./profile.css";

function ContactTile({ icon: Icon, label, value, href, filename, disabled }) {
  const body = (
    <>
      <Icon size={22} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
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

export function ContactBlock() {
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
