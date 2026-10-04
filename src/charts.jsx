import React, { useId, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import { emartData } from "./data";
import { useChartPlay, useCountUp } from "./ui";

// Every chart shares one motion language (see .chart rules in story.css):
//   grid/axis fade -> Before draws -> After draws -> value labels -> delta / result emphasis
// Animations are CSS transform/opacity only. A chart is (re)played by remounting its animated subtree (key = run).
// Replay on desktop hover is throttled inside useChartPlay; reduced-motion shows the final state immediately.

/* ---------- tooltip ---------- */

function Tip({ tip, align = "center" }) {
  const last = useRef(tip);
  if (tip) last.current = tip;
  const t = tip ?? last.current;
  if (!t) return null;
  return (
    <div
      className={`ctip ${align}${tip ? " on" : ""}`}
      style={{ left: t.left, top: t.top }}
      role="status"
      aria-live="polite"
    >
      <span className={`ctip-tag ${t.tone ?? ""}`}>{t.tag}</span>
      <strong>{t.title}</strong>
      <b className="ctip-value">{t.value}</b>
      {t.lines?.map((line) => (
        <small key={line}>{line}</small>
      ))}
    </div>
  );
}

/* ---------- column chart (range or single value) ---------- */

const W = 560;
const H = 360;
const PAD = { l: 58, r: 24, t: 64, b: 48 };
const Y0 = H - PAD.b;
const PLOT_H = H - PAD.t - PAD.b;
const CW = 132;
const CX = { before: 170, after: 370 };

function roundedTop(x, y, w, h, r) {
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

function ColValue({ col, x, y, run, delay, decimals, suffix, range }) {
  const a = useCountUp(col.lo, { run, delay, duration: 0.8, decimals });
  const b = useCountUp(col.hi, { run, delay, duration: 0.8, decimals });
  const text = range ? `${a.toFixed(decimals)}~${b.toFixed(decimals)}${suffix}` : `${a.toFixed(decimals)}${suffix}`;
  return (
    <text className="vlabel" x={x} y={y} textAnchor="middle" style={{ "--d": `${delay}s` }}>
      {text}
    </text>
  );
}

/**
 * cols: [{ key: "before"|"after", name, lo, hi }]  (lo === hi for a single value)
 * range: draw lo..hi as a distinct, hatched band on top of a lighter 0..lo fill so a range never reads as a single value.
 */
export function ColumnChart({ cols, yMax, ticks, fmtTick, ariaLabel, range = false, decimals = 0, suffix = "", delta, tipFor, tone = "light", external }) {
  const uid = useId().replace(/:/g, "");
  const { ref, run, onPointerEnter } = useChartPlay({ external });
  const [active, setActive] = useState(null);
  const pointer = useRef("mouse");
  const y = (v) => Y0 - (v / yMax) * PLOT_H;
  const colIndex = { before: 0, after: 1 };

  const tip = (() => {
    if (!active) return null;
    const c = cols.find((item) => item.key === active);
    const content = tipFor(c);
    return { ...content, left: `${(CX[c.key] / W) * 100}%`, top: `${((y(c.hi) - 4) / H) * 100}%` };
  })();

  const bx = CX.after + CW / 2 + 16; // bracket x
  const ghostFrom = CX.before + CW / 2;

  return (
    <div className="chart" data-tone={tone} data-hover={active ?? ""} data-state={run ? "play" : "idle"} ref={ref} onPointerEnter={onPointerEnter} onClick={() => setActive(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} focusable="false">
        <defs>
          <pattern id={`hatch-${uid}`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="9" className="hatch-line" />
          </pattern>
          <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="grad-a" />
            <stop offset="1" className="grad-b" />
          </linearGradient>
          {cols.map((c) => (
            <clipPath id={`clip-${uid}-${c.key}`} key={c.key}>
              <path d={roundedTop(CX[c.key] - CW / 2, y(c.hi), CW, Y0 - y(c.hi), 16)} />
            </clipPath>
          ))}
        </defs>

        <g key={run} className="chart-body">
          <g className="grid-group">
            {ticks.map((t) => (
              <g key={t}>
                <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
                <text className="tick" x={PAD.l - 12} y={y(t) + 4} textAnchor="end">
                  {fmtTick(t)}
                </text>
              </g>
            ))}
          </g>

          {cols.map((c) => {
            const x = CX[c.key] - CW / 2;
            const delay = 0.25 + colIndex[c.key] * 0.3;
            return (
              <g
                key={c.key}
                className={`col ${c.key}`}
                tabIndex={0}
                role="group"
                aria-label={`${c.name} ${c.label}`}
                onPointerDown={(e) => (pointer.current = e.pointerType)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(c.key)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                onFocus={() => setActive(c.key)}
                onBlur={() => setActive(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (pointer.current === "mouse" ? c.key : a === c.key ? null : c.key));
                }}
              >
                <rect className="hit" x={x - 10} y={y(c.hi) - 40} width={CW + 20} height={Y0 - y(c.hi) + 40} />
                <g className="col-body" style={{ "--d": `${delay}s` }}>
                  <g clipPath={`url(#clip-${uid}-${c.key})`}>
                    <rect className="seg-base" x={x} y={y(c.lo)} width={CW} height={Y0 - y(c.lo)} />
                    {range ? (
                      <>
                        <rect className="seg-range" x={x} y={y(c.hi)} width={CW} height={y(c.lo) - y(c.hi)} fill={c.key === "after" ? `url(#grad-${uid})` : undefined} />
                        <rect className="seg-hatch" x={x} y={y(c.hi)} width={CW} height={y(c.lo) - y(c.hi)} fill={`url(#hatch-${uid})`} />
                        <line className="seg-edge" x1={x} x2={x + CW} y1={y(c.lo)} y2={y(c.lo)} />
                      </>
                    ) : (
                      <rect className="seg-range" x={x} y={y(c.hi)} width={CW} height={Y0 - y(c.hi)} fill={c.key === "after" ? `url(#grad-${uid})` : undefined} />
                    )}
                  </g>
                </g>
                <ColValue col={c} x={CX[c.key]} y={y(c.hi) - 16} run={run} delay={0.95 + colIndex[c.key] * 0.25} decimals={decimals} suffix={suffix} range={range} />
                <text className="xlabel" x={CX[c.key]} y={Y0 + 30} textAnchor="middle">
                  {c.name.toUpperCase()}
                </text>
              </g>
            );
          })}

          {delta && (
            <g className="delta" aria-hidden="true">
              <path className="ghost" d={`M${ghostFrom},${y(delta.from)} H${bx + 8}`} pathLength="1" />
              <path className="bracket" d={`M${bx},${y(delta.from)} h8 V${y(delta.to)} h-8`} pathLength="1" />
              <text className="delta-text" x={bx + 16} y={(y(delta.from) + y(delta.to)) / 2 + 2}>
                {delta.text}
              </text>
              <text className="delta-note" x={bx + 16} y={(y(delta.from) + y(delta.to)) / 2 + 20}>
                {delta.note}
              </text>
            </g>
          )}
        </g>
      </svg>
      <Tip tip={tip} />
    </div>
  );
}

/* ---------- ready-made charts ---------- */

export function InspectionRateChart({ cols, tone, external }) {
  return (
    <ColumnChart
      cols={cols}
      yMax={10}
      ticks={[0, 2, 4, 6, 8, 10]}
      fmtTick={(v) => `${v}%`}
      range
      suffix="%"
      tone={tone}
      external={external}
      ariaLabel="검품률 Before 3~5%, After 6~8%. 구간(범위) 수치이며 하한과 상한 모두 3%p 높아졌습니다."
      delta={{ from: 5, to: 8, text: "+3%p", note: "구간 기준" }}
      tipFor={(c) =>
        c.key === "after"
          ? { tag: "AFTER", tone: "after", title: "검품률", value: c.label, lines: ["구간 기준 +3%p", "하한 3→6% · 상한 5→8%"] }
          : { tag: "BEFORE", tone: "before", title: "검품률", value: c.label, lines: ["구간(범위)으로 표기한 운영 수치"] }
      }
    />
  );
}

export function SalesChart({ cols, tone, external }) {
  const [before, after] = cols;
  const gain = Math.round((after.hi - before.hi) * 10) / 10;
  const pct = Math.round((gain / before.hi) * 100);
  return (
    <ColumnChart
      cols={cols}
      yMax={0.8}
      ticks={[0, 0.2, 0.4, 0.6, 0.8]}
      fmtTick={(v) => (v === 0 ? "0" : `${v}억`)}
      decimals={1}
      suffix="억"
      tone={tone}
      external={external}
      ariaLabel={`즉석조리 일매출 Before ${before.label}, After ${after.label}`}
      delta={{ from: before.hi, to: after.hi, text: `+${gain}억`, note: `+${pct}%` }}
      tipFor={(c) =>
        c.key === "after"
          ? { tag: "AFTER", tone: "after", title: "즉석조리 일매출", value: c.label, lines: [`+${gain}억 (+${pct}%)`] }
          : { tag: "BEFORE", tone: "before", title: "즉석조리 일매출", value: c.label }
      }
    />
  );
}

/* ---------- rank (21 -> 1) ---------- */

export function RankChart({ tone }) {
  const { from, to, total } = emartData.rank;
  const { ref, run, onPointerEnter } = useChartPlay();
  const [active, setActive] = useState(null);
  const count = useCountUp(to, { run, from, delay: 0.35, duration: 1.1 });
  const dots = Array.from({ length: total }, (_, i) => total - i); // 21 ... 1, left -> right
  const tip =
    active === "before"
      ? { tag: "BEFORE", tone: "before", title: "피자 구독권 순위", value: `${from}위`, lines: ["화서점 실적 기준"], left: "0%", top: "0%" }
      : active === "after"
        ? { tag: "AFTER", tone: "after", title: "피자 구독권 순위", value: `${to}위`, lines: [`${from - to}단계 상승`], left: "100%", top: "0%" }
        : null;

  return (
    <div className="chart rank" data-tone={tone} data-hover={active ?? ""} data-state={run ? "play" : "idle"} ref={ref} onPointerEnter={onPointerEnter} onClick={() => setActive(null)} role="img" aria-label={`피자 구독권 순위 ${from}위에서 ${to}위로 상승`}>
      <div className="rank-now" aria-hidden="true">
        <small>RANK</small>
        <strong>
          {count}
          <span>위</span>
        </strong>
      </div>
      <div className="rank-stage" key={run}>
        <div className="rank-line">
          <span className="rank-rail" />
          <span className="rank-fill" />
          {dots.map((r, i) => (
            <i key={r} className={r === from ? "dot start" : r === to ? "dot end" : "dot"} style={{ "--i": i }} />
          ))}
        </div>
        <button
          type="button"
          className="rank-hit start"
          onPointerEnter={(e) => e.pointerType === "mouse" && setActive("before")}
          onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          onClick={(e) => {
            e.stopPropagation();
            setActive((a) => (a === "before" ? null : "before"));
          }}
          onFocus={() => setActive("before")}
          onBlur={() => setActive(null)}
        >
          <small>Before</small>
          <b>{from}위</b>
        </button>
        <button
          type="button"
          className="rank-hit end"
          onPointerEnter={(e) => e.pointerType === "mouse" && setActive("after")}
          onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          onClick={(e) => {
            e.stopPropagation();
            setActive((a) => (a === "after" ? null : "after"));
          }}
          onFocus={() => setActive("after")}
          onBlur={() => setActive(null)}
        >
          <small>After</small>
          <b>
            <Trophy size={20} aria-hidden="true" /> {to}위
          </b>
        </button>
      </div>
      <Tip tip={tip} align={active === "after" ? "end" : "start"} />
    </div>
  );
}

/* ---------- openings (3 connected nodes) ---------- */

export function OpeningNodes({ tone }) {
  const { ref, run, onPointerEnter } = useChartPlay();
  const [active, setActive] = useState(null);
  return (
    <div className="chart openings" data-tone={tone} data-hover={active ?? ""} data-state={run ? "play" : "idle"} ref={ref} onPointerEnter={onPointerEnter}>
      <ol key={run} aria-label="신규 오픈 3개점">
        {emartData.openings.map((item, i) => (
          <li
            key={item.store}
            className={active === item.store ? "on" : ""}
            style={{ "--i": i }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(item.store)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          >
            <span className="node">{i + 1}</span>
            <strong>{item.store}</strong>
            <small>{item.note}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- hours saved ---------- */

export function SavedHours({ hours, tone, external }) {
  const { ref, run, onPointerEnter } = useChartPlay({ external });
  const [on, setOn] = useState(false);
  const count = useCountUp(hours, { run, delay: 0.3, duration: 1.0 });
  return (
    <div className="chart saved" data-tone={tone} data-state={run ? "play" : "idle"} ref={ref} onPointerEnter={onPointerEnter} onPointerLeave={() => setOn(false)} onPointerOver={() => setOn(true)}>
      <div className="saved-top">
        <strong aria-label={`하루 ${hours}시간 절감`}>
          −{count}
          <span>h / day</span>
        </strong>
        <small>일 {hours}시간 업무시간 절감</small>
      </div>
      <div className="saved-blocks" key={run} role="img" aria-label={`업무시간 하루 ${hours}시간 절감`}>
        {Array.from({ length: hours }, (_, i) => (
          <span key={i} style={{ "--i": i }}>
            <i />
            <em>{i + 1}h</em>
          </span>
        ))}
      </div>
      <div className="saved-flow">
        <span>
          <small>Before</small>
          수기 취합 · 서식 정리
        </span>
        <span className="saved-arrow" aria-hidden="true" />
        <span className="after">
          <small>After</small>
          Report Generator 자동 생성
        </span>
      </div>
      <p className={`saved-tip${on ? " on" : ""}`} aria-hidden="true">반복되던 보고서 정리 시간이 줄었습니다.</p>
    </div>
  );
}
