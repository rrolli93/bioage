"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FONT = "'Montserrat', system-ui, sans-serif";

interface TrendDataPoint {
  date: string;
  phenoAge: number;
  chronoAge: number;
  delta: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="p-3 text-xs"
      style={{
        background: "#06064a",
        border: "1px solid rgba(136,119,89,0.3)",
        fontFamily: FONT,
      }}
    >
      <p style={{ color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.06em" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 500 }}>
          {p.name}: {p.value.toFixed(1)}
        </p>
      ))}
    </div>
  );
}

export default function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-40 text-xs"
        style={{
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontFamily: FONT,
          letterSpacing: "0.1em",
        }}
      >
        NO DATA — CALCULATE YOUR FIRST SCORE
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted} margin={{ top: 8, right: 16, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: FONT }}
          axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: FONT }}
          axisLine={false}
          tickLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Chrono age reference */}
        <Line
          type="monotone"
          dataKey="chronoAge"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
          name="Chrono Age"
        />

        {/* PhenoAge line */}
        <Line
          type="monotone"
          dataKey="phenoAge"
          stroke="#887759"
          strokeWidth={2}
          dot={{ fill: "#887759", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#ada03e" }}
          name="Bio Age"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
