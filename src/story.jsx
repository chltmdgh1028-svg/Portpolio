import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { emartData, gsData, projects, screens } from "./data";
import { InspectionRateChart, OpeningNodes, RankChart, SalesChart, SavedHours } from "./charts";
import { Reveal, SectionHeading, Shot, useMedia } from "./ui";
import "./story.css";

/* ---------- GS Retail: scroll narrative ---------- */

function Win({ src, label, alt, className = "" }) {
  return (
    <figure className={`s-win ${className}`}>
      <figcaption className="win-bar">
        <i />
        <i />
        <i />
        <b>{label}</b>
      </figcaption>
      <Shot src={src} alt={alt} sizes="(min-width: 1024px) 640px, 92vw" />
    </figure>
  );
}

function ProblemVisual() {
  const chips = ["검품 기준", "수량 기록", "사진 기록", "협력사별 진행", "담당자 메모"];
  return (
    <div className="s-problem" role="img" aria-label="흩어진 검품 기준, 수량, 사진 기록">
      {chips.map((c, i) => (
        <span key={c} className={`chip c${i + 1}`}>
          {c}
        </span>
      ))}
      <p>
        <b>담당자별 편차 · 누락</b>
        <small>기준과 기록이 흩어져 있었습니다</small>
      </p>
    </div>
  );
}

function AppVisual() {
  const p = projects[0];
  return (
    <div className="s-stack one">
      <Win src={screens.inspectionApp} label="Inspection App" alt={p.imageAlt} />
      <Link className="s-link" to={`/projects/${p.id}`}>
        Case Study <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function OpsVisual() {
  return (
    <div className="s-stack two">
      <Win className="back" src={screens.dashboard} label="Operations Dashboard" alt={projects[1].imageAlt} />
      <Win className="front" src={screens.reportGenerator} label="Report Generator" alt={projects[2].imageAlt} />
    </div>
  );
}

function ResultVisual({ external }) {
  return (
    <div className="s-result">
      <div className="s-result-head">
        <span>검품률 · Before / After</span>
        <strong>
          3~5% <ArrowRight size={18} aria-hidden="true" /> <em>6~8%</em>
        </strong>
      </div>
      <InspectionRateChart cols={gsData.inspectionRate} tone="dark" external={external} />
      <SavedHours hours={gsData.hoursSaved} tone="dark" external={external} />
    </div>
  );
}

function StepVisual({ kind, external }) {
  if (kind === "problem") return <ProblemVisual />;
  if (kind === "app") return <AppVisual />;
  if (kind === "ops") return <OpsVisual />;
  return <ResultVisual external={external} />;
}

function useActiveStep(enabled) {
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.i)));
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return [active, refs];
}

export function GSDataStory() {
  const wide = useMedia("(min-width: 1024px)");
  const [active, refs] = useActiveStep(wide);
  const steps = gsData.flow;

  return (
    <section className="story gs dark" id="gs-story">
      <div className="story-bg" aria-hidden="true">
        <i className="aurora a1" />
        <div className="grid-bg" />
        <div className="noise" />
      </div>
      <div className="wrap">
        <SectionHeading tone="dark" eyebrow="GS Retail · Data Story" title="현장 문제에서 수치 개선까지" desc="GS리테일 신선강화지원팀에서 검품 운영을 제품으로 바꾼 과정입니다. 스크롤하며 문제가 어떻게 숫자로 바뀌는지 확인해보세요." />

        <div className="gs-layout">
          {wide && (
            <div className="gs-stage-col">
              <div className="gs-stage" aria-live="polite">
                <p className="stage-label">
                  <b>{steps[active].step}</b> / 04 · {steps[active].title}
                </p>
                {steps.map((s, i) => (
                  <div key={s.step} className={`stage-pane${active === i ? " on" : ""}`} aria-hidden={active !== i}>
                    <StepVisual kind={s.visual} external={s.visual === "result" ? active === i : undefined} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <ol className="gs-steps">
            {steps.map((s, i) => (
              <li key={s.step} data-i={i} ref={(el) => (refs.current[i] = el)} className={`gs-step${wide && active === i ? " on" : ""}`}>
                <div className="gs-step-text">
                  <span className="step-no">{s.step}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                {!wide && (
                  <div className="gs-step-visual">
                    <StepVisual kind={s.visual} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Emart Traders ---------- */

function EmartRow({ no, tag, title, big, text, flip, children }) {
  return (
    <div className={`emart-row${flip ? " flip" : ""}`}>
      <Reveal className="emart-copy">
        <p className="emart-no">
          <span>{no}</span>
          <i aria-hidden="true" />
          <b>{tag}</b>
        </p>
        <h3>{title}</h3>
        <p className="emart-big">{big}</p>
        <p className="emart-text">{text}</p>
      </Reveal>
      <Reveal className="emart-visual" delay={0.08}>
        {children}
      </Reveal>
    </div>
  );
}

export function EmartStory() {
  return (
    <section className="story emart light" id="emart-story">
      <div className="wrap">
        <SectionHeading eyebrow="Emart Traders · Results" title="7년 4개월 현장에서 만든 성과" desc={emartData.intro} />
        <div className="emart-rows">
          <EmartRow no="01" tag="매출" title="즉석조리 일매출" big={<>0.5억 <ArrowRight size={26} aria-hidden="true" /> <em>0.7억</em></>} text="즉석조리 일매출을 0.5억에서 0.7억으로 높였습니다. 재고·소비기한 관리와 매장 동선 개선에도 참여했습니다.">
            <SalesChart cols={emartData.sales} tone="light" />
          </EmartRow>
          <EmartRow no="02" tag="프로모션" title="피자 구독권 순위" flip big={<>21위 <ArrowRight size={26} aria-hidden="true" /> <em>1위</em></>} text="화서점 피자 구독권 실적 순위를 21위에서 1위로 끌어올렸습니다.">
            <RankChart tone="light" />
          </EmartRow>
          <EmartRow no="03" tag="신규점 오픈" title="3개점 신규 오픈" big={<><em>3</em>개점</>} text="구월 · 화서 · 안성 신규 오픈을 경험했습니다.">
            <OpeningNodes tone="light" />
          </EmartRow>
        </div>
      </div>
    </section>
  );
}
