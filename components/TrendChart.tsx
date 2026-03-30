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
        background: "#111111",
        borderColor: "#1e1e1e",
        fontFamily: "var(--font-playfair)",
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
          borderColor: "#1e1e1e",
          color: "#444",
          fontFamily: "var(--font-playfair)",
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
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-playfair)" }}
          axisLine={{ stroke: "#1e1e1e" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-playfair)" }}
          axisLine={false}
          tickLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Chrono age reference */}
        <Line
          type="monotone"
          dataKey="chronoAge"
          stroke="#333"
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
          name="Chrono Age"
        />

        {/* PhenoAge line */}
        <Line
          type="monotone"
          dataKey="phenoAge"
          stroke="#52b788"
          strokeWidth={2}
          dot={{ fill: "#52b788", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#52b788" }}
          name="Bio Age"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
