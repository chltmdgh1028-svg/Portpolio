import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { emartData, gsData } from "./data";

// Recharts is the heaviest dependency, so every chart lives in this file and is loaded on demand.
const BLUE = "#2f7bff";
const BLUE_SOFT = "#cfe0ff";
const axisTick = { fill: "#5b6b82", fontSize: 13, fontWeight: 600 };

export function InspectionRateChart() {
  return (
    <div className="chart-box" role="img" aria-label="검품률 Before 3~5%, After 6~8%">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={gsData.inspectionRate} margin={{ top: 28, right: 12, left: -8, bottom: 0 }} barCategoryGap="34%">
          <CartesianGrid stroke="#e3eaf5" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTick} />
          <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} tick={{ ...axisTick, fontSize: 12 }} width={44} />
          <Tooltip cursor={{ fill: "rgba(47,123,255,.06)" }} formatter={(_, __, item) => [item.payload.label, "검품률"]} />
          <Bar dataKey="range" radius={[10, 10, 10, 10]} animationDuration={900}>
            <Cell fill={BLUE_SOFT} />
            <Cell fill={BLUE} />
            <LabelList dataKey="label" position="top" style={{ fill: "#0b1423", fontSize: 18, fontWeight: 800 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RingStat({ value, label, caption }) {
  const data = [{ name: label, value }];
  return (
    <div className="ring-stat">
      <div className="ring" role="img" aria-label={`${label} ${value}%`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} innerRadius="74%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={12}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
            <RadialBar dataKey="value" cornerRadius={8} fill={BLUE} background={{ fill: "#e4ecf8" }} animationDuration={1000} />
          </RadialBarChart>
        </ResponsiveContainer>
        <strong>{value}%</strong>
      </div>
      <div>
        <span>{label}</span>
        <p>{caption}</p>
      </div>
    </div>
  );
}

export function SalesChart() {
  return (
    <div className="chart-box" role="img" aria-label="즉석조리 일매출 Before 0.5억, After 0.7억">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={emartData.sales} margin={{ top: 28, right: 12, left: -8, bottom: 0 }} barCategoryGap="34%">
          <CartesianGrid stroke="#e3eaf5" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTick} />
          <YAxis domain={[0, 0.8]} ticks={[0, 0.2, 0.4, 0.6, 0.8]} tickFormatter={(v) => `${v}억`} axisLine={false} tickLine={false} tick={{ ...axisTick, fontSize: 12 }} width={44} />
          <Tooltip cursor={{ fill: "rgba(47,123,255,.06)" }} formatter={(v) => [`${v}억`, "일매출"]} />
          <Bar dataKey="value" radius={[10, 10, 0, 0]} animationDuration={900}>
            <Cell fill={BLUE_SOFT} />
            <Cell fill={BLUE} />
            <LabelList dataKey="label" position="top" style={{ fill: "#0b1423", fontSize: 18, fontWeight: 800 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
