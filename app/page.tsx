"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import TrendChart from "@/components/TrendChart";
import ProtocolPill from "@/components/ProtocolPill";

interface BioAgeEntry {
  id: string;
  date: string;
  chronoAge: number;
  phenoAge: number;
  delta: number;
  metabolicAge?: number;
  immuneAge?: number;
  inflammatoryAge?: number;
  hematologicalAge?: number;
}

interface ProtocolEntry {
  id: string;
  compound: string;
  dose: string;
  category: string;
  route: string;
  active: boolean;
  startDate: string;
}

function computeStreak(entries: BioAgeEntry[]): number {
  if (entries.length === 0) return 0;

  // Sort ascending by date
  const sorted = [...entries]
    .map((e) => new Date(e.date).toISOString().slice(0, 10))
    .sort()
    .reverse(); // newest first

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Streak must start today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<BioAgeEntry[]>([]);
  const [protocols, setProtocols] = useState<ProtocolEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/entries").then((r) => r.json()),
      fetch("/api/protocol").then((r) => r.json()),
    ])
      .then(([e, p]) => {
        setEntries(Array.isArray(e) ? e : []);
        setProtocols(Array.isArray(p) ? p : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const latest = entries[0];
  const activeProtocols = protocols.filter((p) => p.active);
  const streak = computeStreak(entries);

  const trendData = [...entries]
    .reverse()
    .map((e) => ({
      date: e.date,
      phenoAge: e.phenoAge,
      chronoAge: e.chronoAge,
      delta: e.delta,
    }));

  return (
    <div className="min-h-screen transition-colors" style={{ background: "var(--background)" }}>
      <Nav />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}
            >
              Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)", fontSize: "13px" }}>
              Biological age tracking &amp; protocol management
            </p>
          </div>

          {/* Streak badge */}
          {streak > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-sm border"
              style={{
                background: "var(--accent-bg)",
                borderColor: "var(--accent)",
                boxShadow: "0 0 12px var(--accent-glow)",
              }}
            >
              <span style={{ fontSize: "22px", lineHeight: 1 }}>🔥</span>
              <div>
                <p
                  className="text-xl font-bold leading-none"
                  style={{ color: "var(--accent)", fontFamily: "var(--font-inter)" }}
                >
                  {streak}
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    fontFamily: "var(--font-inter)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  day streak
                </p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)", fontSize: "13px" }}>
              Loading...
            </p>
          </div>
        ) : (
          <>
            {/* Latest score or CTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {latest ? (
                <>
                  {/* Bio age hero */}
                  <div
                    className="col-span-1 p-6 rounded-sm border"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }}
                  >
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                    >
                      Latest Bio Age
                    </p>
                    <p
                      className="text-5xl font-bold mb-1"
                      style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}
                    >
                      {latest.phenoAge.toFixed(1)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-inter)" }}>
                        chrono {latest.chronoAge.toFixed(0)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-sm"
                        style={{
                          background: latest.delta < 0 ? "var(--accent-bg)" : "#1a1525",
                          color: latest.delta < 0 ? "var(--accent)" : "#a78bfa",
                          fontFamily: "var(--font-inter)",
                          boxShadow: latest.delta < 0 ? "0 0 8px var(--accent-glow)" : "none",
                        }}
                      >
                        {latest.delta < 0 ? "" : "+"}
                        {latest.delta.toFixed(1)} yrs
                      </span>
                    </div>
                    <p
                      className="text-xs mt-2"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                    >
                      {new Date(latest.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Organ sub-scores */}
                  <div
                    className="col-span-1 md:col-span-2 p-6 rounded-sm border"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }}
                  >
                    <p
                      className="text-xs uppercase tracking-widest mb-4"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                    >
                      Organ Sub-Scores
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Metabolic", value: latest.metabolicAge, color: "#f4a261" },
                        { label: "Immune", value: latest.immuneAge, color: "var(--accent)" },
                        { label: "Inflammatory", value: latest.inflammatoryAge, color: "#7b5ea7" },
                        { label: "Hematological", value: latest.hematologicalAge, color: "#4cc9f0" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                          <div>
                            <p style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                              {label}
                            </p>
                            <p style={{ color, fontSize: "18px", fontFamily: "var(--font-inter)", fontWeight: "600" }}>
                              {value != null ? value.toFixed(1) : "—"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* No data CTA */
                <div
                  className="col-span-3 p-8 rounded-sm border text-center"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <p
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}
                  >
                    No scores yet
                  </p>
                  <p
                    className="text-sm mb-5"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                  >
                    Calculate your first biological age score from your bloodwork.
                  </p>
                  <Link
                    href="/calculate"
                    className="inline-block px-5 py-2.5 rounded-sm text-sm font-medium transition-opacity hover:opacity-80"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    Calculate Bio Age →
                  </Link>
                </div>
              )}
            </div>

            {/* Trend chart */}
            <div
              className="p-6 rounded-sm border mb-8"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                >
                  Bio Age Trend
                </p>
                <Link
                  href="/calculate"
                  className="text-xs px-3 py-1 rounded-sm transition-colors hover:opacity-80"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-inter)",
                    border: "1px solid var(--accent-glow)",
                  }}
                >
                  + New Score
                </Link>
              </div>
              <TrendChart data={trendData} />
            </div>

            {/* Active protocols */}
            <div
              className="p-6 rounded-sm border mb-8"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                >
                  Active Protocols ({activeProtocols.length})
                </p>
                <Link
                  href="/protocol"
                  className="text-xs"
                  style={{ color: "var(--accent)", fontFamily: "var(--font-inter)" }}
                >
                  Manage →
                </Link>
              </div>

              {activeProtocols.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-inter)" }}>
                  No active protocols.{" "}
                  <Link href="/protocol" style={{ color: "var(--accent)" }}>
                    Add one →
                  </Link>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {activeProtocols.map((p) => (
                    <ProtocolPill
                      key={p.id}
                      compound={p.compound}
                      dose={p.dose}
                      category={p.category}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <Link
                href="/calculate"
                className="px-5 py-2.5 rounded-sm text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Calculate New Score
              </Link>
              <Link
                href="/card"
                className="px-5 py-2.5 rounded-sm text-sm border transition-colors hover:opacity-80"
                style={{
                  background: "transparent",
                  color: "var(--text-secondary)",
                  borderColor: "var(--border)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Generate Card
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
