"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

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
      className="p-3 rounded-sm border text-xs"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
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
        className="flex items-center justify-center h-40 rounded-sm border text-sm"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-inter)",
        }}
      >
        No data yet — calculate your first score
      </div>
    );
  }

  // Format dates for X axis
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-inter)" }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-inter)" }}
          axisLine={false}
          tickLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Chrono age reference */}
        <Line
          type="monotone"
          dataKey="chronoAge"
          stroke="var(--text-muted)"
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
          name="Chrono Age"
        />

        {/* PhenoAge line */}
        <Line
          type="monotone"
          dataKey="phenoAge"
          stroke="var(--accent)"
          strokeWidth={2}
          dot={{ fill: "var(--accent)", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "var(--accent)" }}
          name="Bio Age"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
