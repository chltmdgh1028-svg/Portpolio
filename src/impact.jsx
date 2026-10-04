import React from "react";
import { ArrowRight } from "lucide-react";
import { emartData, gsData } from "./data";
import { InspectionRateChart, OpeningNodes, RankChart, SalesChart, SavedHours } from "./charts";
import { PortalHero } from "./pagehero";
import { Reveal, useDocTitle } from "./ui";
import "./story.css";

// Charts keep their full behaviour: first-view draw, desktop hover replay (throttled), custom tooltips,
// touch tap, reduced-motion final state. IMPACT just gives each result its own stage.

function Stage({ no, kicker, tone, flip, big, label, text, extra, children }) {
  return (
    <section className={`imp ${tone}`} id={kicker.toLowerCase()}>
      <div className="wrap">
        <div className={`imp-grid${flip ? " flip" : ""}`}>
          <Reveal className="imp-copy">
            <p className="imp-no">
              <span>{no}</span>
              <i aria-hidden="true" />
              <b>{kicker}</b>
            </p>
            <h2 className="imp-big">{big}</h2>
            <p className="imp-label">{label}</p>
            <p className="imp-text">{text}</p>
            {extra}
          </Reveal>
          <Reveal className="imp-visual" delay={0.08}>
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function ImpactPage() {
  useDocTitle("Impact — Seungho Choi");
  return (
    <main className="page page-impact">
      <PortalHero
        no="02"
        title="IMPACT"
        headline="Results, not just features."
        sub="제품을 만든 것보다 운영이 어떻게 달라졌는지를 보여줍니다."
        tone="impact"
      />

      <Stage
        no="01"
        kicker="QUALITY"
        tone="dark"
        big={
          <>
            3~5% <ArrowRight size={34} aria-hidden="true" /> <em>6~8%</em>
          </>
        }
        label="검품률 · Before / After"
        text="검품 기준이 하나로 통일되고, 현황 확인과 보고서 작성이 자동화되면서 검품률이 3~5%에서 6~8% 구간으로 올라갔습니다. 구간(범위)으로 표기한 운영 수치입니다."
        extra={
          <ol className="imp-flow" aria-label="개선 과정">
            {gsData.flow.map((s) => (
              <li key={s.step}>
                <span>{s.step}</span>
                {s.title}
              </li>
            ))}
          </ol>
        }
      >
        <div className="imp-card">
          <InspectionRateChart cols={gsData.inspectionRate} tone="dark" />
        </div>
      </Stage>

      <Stage
        no="02"
        kicker="EFFICIENCY"
        tone="light"
        flip
        big={
          <>
            −<em>4</em> HOURS / DAY
          </>
        }
        label="업무시간 절감"
        text="수기 취합과 서식 정리에 쓰던 반복 업무를 Report Generator의 자동 생성으로 바꿔 하루 4시간을 줄였습니다."
      >
        <div className="imp-card">
          <SavedHours hours={gsData.hoursSaved} tone="light" />
        </div>
      </Stage>

      <Stage
        no="03"
        kicker="SALES"
        tone="dark"
        big={
          <>
            0.5억 <ArrowRight size={34} aria-hidden="true" /> <em>0.7억</em>
          </>
        }
        label="즉석조리 일매출 · 이마트 트레이더스"
        text="즉석조리 일매출을 0.5억에서 0.7억으로 높였습니다. 재고·소비기한 관리와 매장 동선 개선에도 참여했습니다."
      >
        <div className="imp-card">
          <SalesChart cols={emartData.sales} tone="dark" />
        </div>
      </Stage>

      <Stage
        no="04"
        kicker="PERFORMANCE"
        tone="light"
        flip
        big={
          <>
            21위 <ArrowRight size={34} aria-hidden="true" /> <em>1위</em>
          </>
        }
        label="피자 구독권 순위 · 화서점"
        text="화서점 피자 구독권 실적 순위를 21위에서 1위로 끌어올렸습니다."
      >
        <div className="imp-card">
          <RankChart tone="light" />
        </div>
      </Stage>

      <Stage
        no="05"
        kicker="OPENINGS"
        tone="dark"
        big={
          <>
            <em>3</em>개점
          </>
        }
        label="신규 오픈 · 구월 · 화서 · 안성"
        text="구월 · 화서 · 안성, 세 곳의 신규점 오픈을 경험했습니다."
      >
        <div className="imp-card">
          <OpeningNodes tone="dark" />
        </div>
      </Stage>
    </main>
  );
}
