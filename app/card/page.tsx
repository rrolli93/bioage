"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import BioAgeCard, { CardData } from "@/components/BioAgeCard";
import Link from "next/link";

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
  active: boolean;
}

export default function CardPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<BioAgeEntry[]>([]);
  const [protocols, setProtocols] = useState<ProtocolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/entries").then((r) => r.json()),
      fetch("/api/protocol").then((r) => r.json()),
    ])
      .then(([e, p]) => {
        const validEntries = Array.isArray(e) ? e : [];
        setEntries(validEntries);
        setProtocols(Array.isArray(p) ? p : []);
        if (validEntries.length > 0) {
          setSelectedId(validEntries[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selected = entries.find((e) => e.id === selectedId) ?? entries[0];
  const activeProtocols = protocols.filter((p) => p.active);

  const cardData: CardData | null = selected
    ? {
        phenoAge: selected.phenoAge,
        chronoAge: selected.chronoAge,
        delta: selected.delta,
        date: selected.date,
        organScores: {
          metabolicAge: selected.metabolicAge ?? selected.chronoAge,
          immuneAge: selected.immuneAge ?? selected.chronoAge,
          inflammatoryAge: selected.inflammatoryAge ?? selected.chronoAge,
          hematologicalAge: selected.hematologicalAge ?? selected.chronoAge,
        },
        protocols: activeProtocols.map((p) => ({
          compound: p.compound,
          dose: p.dose,
          category: p.category,
        })),
      }
    : null;

  async function handleDownload() {
    if (!cardRef.current || !cardData) return;
    setDownloading(true);

    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1a2c3f",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `bioage-card-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (!cardRef.current || !cardData) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1a2c3f",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.share({
            title: "My BioAge Report",
            text: `My biological age: ${cardData.phenoAge.toFixed(1)} (chrono: ${cardData.chronoAge})`,
            files: [new File([blob], "bioage-card.png", { type: "image/png" })],
          });
        } catch {
          // Fallback: just download
          handleDownload();
        }
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#121e2b" }}>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-inter)" }}>
            Shareable Card
          </h1>
          <p style={{ color: "#626d86", fontFamily: "var(--font-inter)", fontSize: "13px" }}>
            Generate a shareable BioAge report card from your latest score.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#a0aec0", fontFamily: "var(--font-inter)", fontSize: "13px" }}>
            Loading...
          </p>
        ) : !cardData ? (
          /* No data */
          <div
            className="p-8 rounded-sm border text-center"
            style={{ background: "#1a2c3f", borderColor: "#223e6b" }}
          >
            <p className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              No scores yet
            </p>
            <p className="text-sm mb-5" style={{ color: "#626d86", fontFamily: "var(--font-inter)" }}>
              You need at least one biological age calculation to generate a card.
            </p>
            <Link
              href="/calculate"
              className="inline-block px-5 py-2.5 rounded-sm text-sm font-medium"
              style={{ background: "#00b8ac", color: "#000", fontFamily: "var(--font-inter)" }}
            >
              Calculate Bio Age →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Card preview */}
            <div>
              {/* Entry selector */}
              {entries.length > 1 && (
                <div className="mb-4">
                  <label
                    className="block text-xs mb-1.5"
                    style={{ color: "#626d86", fontFamily: "var(--font-inter)" }}
                  >
                    Select score
                  </label>
                  <select
                    value={selectedId ?? ""}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="px-3 py-2 rounded-sm border text-sm outline-none"
                    style={{
                      background: "#1a2c3f",
                      borderColor: "#223e6b",
                      color: "#fff",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {entries.map((e) => (
                      <option key={e.id} value={e.id}>
                        {new Date(e.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        — Bio Age {e.phenoAge.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* The card itself */}
              <BioAgeCard ref={cardRef} data={cardData} />
            </div>

            {/* Controls sidebar */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              <div
                className="p-5 rounded-sm border"
                style={{ background: "#1a2c3f", borderColor: "#223e6b" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-4"
                  style={{ color: "#8895a7", fontFamily: "var(--font-inter)" }}
                >
                  Export
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full py-2.5 px-4 rounded-sm text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ background: "#00b8ac", color: "#000", fontFamily: "var(--font-inter)" }}
                  >
                    {downloading ? "Rendering..." : "Download PNG"}
                  </button>

                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <button
                      onClick={handleShare}
                      className="w-full py-2.5 px-4 rounded-sm text-sm border transition-colors"
                      style={{
                        background: "transparent",
                        color: "#8895a7",
                        borderColor: "#223e6b",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      Share
                    </button>
                  )}
                </div>
              </div>

              {/* Summary stats */}
              <div
                className="p-5 rounded-sm border"
                style={{ background: "#1a2c3f", borderColor: "#223e6b" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: "#8895a7", fontFamily: "var(--font-inter)" }}
                >
                  Summary
                </p>
                {[
                  { label: "Bio Age", value: cardData.phenoAge.toFixed(1) },
                  { label: "Chrono Age", value: cardData.chronoAge.toFixed(0) },
                  {
                    label: "Delta",
                    value: `${cardData.delta < 0 ? "" : "+"}${cardData.delta.toFixed(1)} yrs`,
                    color: cardData.delta < 0 ? "#00b8ac" : "#4a3aff",
                  },
                  { label: "Protocols", value: String(activeProtocols.length) },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between mb-2">
                    <span
                      style={{ color: "#8895a7", fontSize: "12px", fontFamily: "var(--font-inter)" }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        color: color ?? "#fff",
                        fontSize: "12px",
                        fontFamily: "var(--font-inter)",
                        fontWeight: "600",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
