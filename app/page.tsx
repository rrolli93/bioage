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

  const trendData = [...entries]
    .reverse()
    .map((e) => ({
      date: e.date,
      phenoAge: e.phenoAge,
      chronoAge: e.chronoAge,
      delta: e.delta,
    }));

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <Nav />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Dashboard
          </h1>
          <p style={{ color: "#666", fontFamily: "var(--font-playfair)", fontSize: "13px" }}>
            Biological age tracking &amp; protocol management
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p style={{ color: "#444", fontFamily: "var(--font-playfair)", fontSize: "13px" }}>
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
                    style={{ background: "#111111", borderColor: "#1e1e1e" }}
                  >
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: "#555", fontFamily: "var(--font-playfair)" }}
                    >
                      Latest Bio Age
                    </p>
                    <p
                      className="text-5xl font-bold mb-1"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {latest.phenoAge.toFixed(1)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span style={{ color: "#555", fontSize: "13px", fontFamily: "var(--font-playfair)" }}>
                        chrono {latest.chronoAge.toFixed(0)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-sm"
                        style={{
                          background: latest.delta < 0 ? "#0d2b1f" : "#2d1010",
                          color: latest.delta < 0 ? "#52b788" : "#ff4d6d",
                          fontFamily: "var(--font-playfair)",
                          boxShadow: latest.delta < 0 ? "0 0 10px #52b78866" : "none",
                        }}
                      >
                        {latest.delta < 0 ? "" : "+"}
                        {latest.delta.toFixed(1)} yrs
                      </span>
                    </div>
                    <p
                      className="text-xs mt-2"
                      style={{ color: "#444", fontFamily: "var(--font-playfair)" }}
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
                    style={{ background: "#111111", borderColor: "#1e1e1e" }}
                  >
                    <p
                      className="text-xs uppercase tracking-widest mb-4"
                      style={{ color: "#555", fontFamily: "var(--font-playfair)" }}
                    >
                      Organ Sub-Scores
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Metabolic", value: latest.metabolicAge, color: "#f4a261" },
                        { label: "Immune", value: latest.immuneAge, color: "#52b788" },
                        { label: "Inflammatory", value: latest.inflammatoryAge, color: "#7b5ea7" },
                        { label: "Hematological", value: latest.hematologicalAge, color: "#4cc9f0" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <div>
                            <p style={{ color: "#555", fontSize: "10px", fontFamily: "var(--font-playfair)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                              {label}
                            </p>
                            <p style={{ color, fontSize: "18px", fontFamily: "var(--font-playfair)", fontWeight: "600" }}>
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
                  style={{ background: "#111111", borderColor: "#1e1e1e" }}
                >
                  <p
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    No scores yet
                  </p>
                  <p
                    className="text-sm mb-5"
                    style={{ color: "#666", fontFamily: "var(--font-playfair)" }}
                  >
                    Calculate your first biological age score from your bloodwork.
                  </p>
                  <Link
                    href="/calculate"
                    className="inline-block px-5 py-2.5 rounded-sm text-sm font-medium transition-opacity hover:opacity-80"
                    style={{
                      background: "#52b788",
                      color: "#000",
                      fontFamily: "var(--font-playfair)",
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
              style={{ background: "#111111", borderColor: "#1e1e1e" }}
            >
              <div className="flex justify-between items-center mb-4">
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "#555", fontFamily: "var(--font-playfair)" }}
                >
                  Bio Age Trend
                </p>
                <Link
                  href="/calculate"
                  className="text-xs px-3 py-1 rounded-sm transition-colors hover:opacity-80"
                  style={{
                    background: "#0d2b1f",
                    color: "#52b788",
                    fontFamily: "var(--font-playfair)",
                    border: "1px solid #52b78822",
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
              style={{ background: "#111111", borderColor: "#1e1e1e" }}
            >
              <div className="flex justify-between items-center mb-4">
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "#555", fontFamily: "var(--font-playfair)" }}
                >
                  Active Protocols ({activeProtocols.length})
                </p>
                <Link
                  href="/protocol"
                  className="text-xs"
                  style={{ color: "#52b788", fontFamily: "var(--font-playfair)" }}
                >
                  Manage →
                </Link>
              </div>

              {activeProtocols.length === 0 ? (
                <p style={{ color: "#444", fontSize: "13px", fontFamily: "var(--font-playfair)" }}>
                  No active protocols.{" "}
                  <Link href="/protocol" style={{ color: "#52b788" }}>
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
                  background: "#52b788",
                  color: "#000",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                Calculate New Score
              </Link>
              <Link
                href="/card"
                className="px-5 py-2.5 rounded-sm text-sm border transition-colors"
                style={{
                  background: "transparent",
                  color: "#aaa",
                  borderColor: "#2a2a2a",
                  fontFamily: "var(--font-playfair)",
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
