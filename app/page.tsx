"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import TrendChart from "@/components/TrendChart";
import ProtocolPill from "@/components/ProtocolPill";

const FONT = "'Montserrat', system-ui, sans-serif";

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

  const sorted = [...entries]
    .map((e) => new Date(e.date).toISOString().slice(0, 10))
    .sort()
    .reverse();

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

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
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Nav />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p
              className="text-xs uppercase mb-3"
              style={{
                fontFamily: FONT,
                color: "var(--accent)",
                letterSpacing: "0.2em",
                fontWeight: 600,
              }}
            >
              Overview
            </p>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: FONT, color: "var(--foreground)", letterSpacing: "-0.01em" }}
            >
              Biological Age Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", fontFamily: FONT, fontSize: "13px", fontWeight: 400 }}>
              Longitudinal tracking · PhenoAge protocol
            </p>
          </div>

          {/* Streak badge */}
          {streak > 0 && (
            <div
              className="flex items-center gap-2.5 px-4 py-2.5"
              style={{
                background: "var(--accent-bg)",
                border: "1px solid var(--accent)",
                opacity: 0.85,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "var(--accent)" }}
              />
              <div>
                <p
                  className="text-lg font-bold leading-none"
                  style={{ color: "var(--accent)", fontFamily: FONT }}
                >
                  {streak}
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "9px",
                    fontFamily: FONT,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
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
            <p style={{ color: "var(--text-muted)", fontFamily: FONT, fontSize: "12px", letterSpacing: "0.1em" }}>
              LOADING...
            </p>
          </div>
        ) : (
          <>
            {/* Latest score or CTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {latest ? (
                <>
                  {/* Bio age hero */}
                  <div
                    className="col-span-1 p-7"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p
                      className="text-xs uppercase mb-5"
                      style={{ color: "var(--accent)", fontFamily: FONT, letterSpacing: "0.18em", fontWeight: 600 }}
                    >
                      Latest Score
                    </p>
                    <p
                      className="text-6xl font-bold mb-1"
                      style={{ fontFamily: FONT, color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1 }}
                    >
                      {latest.phenoAge.toFixed(1)}
                    </p>
                    <p
                      className="text-xs mb-4 mt-1"
                      style={{ color: "var(--text-muted)", fontFamily: FONT, letterSpacing: "0.1em" }}
                    >
                      BIO AGE
                    </p>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: FONT }}>
                        Chrono {latest.chronoAge.toFixed(0)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5"
                        style={{
                          background: latest.delta < 0 ? "var(--accent-bg)" : "var(--worse-bg)",
                          color: latest.delta < 0 ? "var(--accent)" : "var(--worse)",
                          fontFamily: FONT,
                          border: `1px solid ${latest.delta < 0 ? "var(--accent)" : "var(--worse)"}`,
                          opacity: 0.9,
                          fontWeight: 600,
                        }}
                      >
                        {latest.delta < 0 ? "" : "+"}
                        {latest.delta.toFixed(1)} yrs
                      </span>
                    </div>
                    <p
                      className="text-xs mt-4"
                      style={{ color: "var(--text-muted)", fontFamily: FONT }}
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
                    className="col-span-1 md:col-span-2 p-7"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <p
                      className="text-xs uppercase mb-6"
                      style={{ color: "var(--accent)", fontFamily: FONT, letterSpacing: "0.18em", fontWeight: 600 }}
                    >
                      Organ Sub-Scores
                    </p>
                    <div className="grid grid-cols-2 gap-5">
                      {[
                        { label: "Metabolic", value: latest.metabolicAge, color: "var(--accent-2)" },
                        { label: "Immune", value: latest.immuneAge, color: "var(--accent)" },
                        { label: "Inflammatory", value: latest.inflammatoryAge, color: "#7a6a9a" },
                        { label: "Hematological", value: latest.hematologicalAge, color: "var(--accent-2)" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="w-1.5 h-4 flex-shrink-0" style={{ background: color, opacity: 0.7 }} />
                          <div>
                            <p style={{ color: "var(--text-muted)", fontSize: "9px", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
                              {label}
                            </p>
                            <p style={{ color: "var(--foreground)", fontSize: "20px", fontFamily: FONT, fontWeight: "700", letterSpacing: "-0.02em" }}>
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
                  className="col-span-3 p-10 text-center"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <p
                    className="text-xs uppercase mb-4"
                    style={{ color: "var(--text-muted)", fontFamily: FONT, letterSpacing: "0.2em", fontWeight: 600 }}
                  >
                    No data
                  </p>
                  <p
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: FONT, color: "var(--foreground)" }}
                  >
                    Begin your assessment
                  </p>
                  <p
                    className="text-sm mb-7"
                    style={{ color: "var(--text-secondary)", fontFamily: FONT, fontWeight: 400 }}
                  >
                    Calculate your first biological age score from standard bloodwork values.
                  </p>
                  <Link
                    href="/calculate"
                    className="inline-block px-6 py-3 text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{
                      background: "var(--accent)",
                      color: "#ffffff",
                      fontFamily: FONT,
                      letterSpacing: "0.12em",
                    }}
                  >
                    CALCULATE NOW
                  </Link>
                </div>
              )}
            </div>

            {/* Trend chart */}
            <div
              className="p-7 mb-6"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex justify-between items-center mb-6">
                <p
                  className="text-xs uppercase"
                  style={{ color: "var(--accent)", fontFamily: FONT, letterSpacing: "0.18em", fontWeight: 600 }}
                >
                  Longitudinal Trend
                </p>
                <Link
                  href="/calculate"
                  className="text-xs px-3 py-1.5 transition-opacity hover:opacity-70"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                    fontFamily: FONT,
                    border: "1px solid var(--accent)",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                  }}
                >
                  + NEW SCORE
                </Link>
              </div>
              <TrendChart data={trendData} />
            </div>

            {/* Active protocols */}
            <div
              className="p-7 mb-8"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex justify-between items-center mb-5">
                <p
                  className="text-xs uppercase"
                  style={{ color: "var(--accent)", fontFamily: FONT, letterSpacing: "0.18em", fontWeight: 600 }}
                >
                  Active Protocols ({activeProtocols.length})
                </p>
                <Link
                  href="/protocol"
                  className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)", fontFamily: FONT, letterSpacing: "0.06em" }}
                >
                  Manage →
                </Link>
              </div>

              {activeProtocols.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: FONT }}>
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
                className="px-6 py-3 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
                  fontFamily: FONT,
                  letterSpacing: "0.1em",
                }}
              >
                CALCULATE NEW SCORE
              </Link>
              <Link
                href="/card"
                className="px-6 py-3 text-xs font-medium transition-opacity hover:opacity-80"
                style={{
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontFamily: FONT,
                  border: "1px solid var(--border)",
                  letterSpacing: "0.1em",
                }}
              >
                GENERATE CARD
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
