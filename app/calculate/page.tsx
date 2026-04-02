"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import OrganBar from "@/components/OrganBar";

const FONT = "'Montserrat', system-ui, sans-serif";

interface FormValues {
  albumin: string;
  creatinine: string;
  glucose: string;
  crp: string;
  lymphocytePct: string;
  mcv: string;
  rdw: string;
  alp: string;
  wbc: string;
  chronologicalAge: string;
}

interface CalculateResult {
  id: string;
  phenoAge: number;
  delta: number;
  chronologicalAge: number;
  mortalityScore: number;
  organScores: {
    metabolicAge: number;
    immuneAge: number;
    inflammatoryAge: number;
    hematologicalAge: number;
  };
}

const FIELDS: Array<{
  key: keyof FormValues;
  label: string;
  unit: string;
  placeholder: string;
  normal: string;
}> = [
  { key: "chronologicalAge", label: "Chronological Age", unit: "years", placeholder: "e.g. 42", normal: "—" },
  { key: "albumin",          label: "Albumin",           unit: "g/dL",  placeholder: "e.g. 4.2",  normal: "3.5–5.0" },
  { key: "creatinine",       label: "Creatinine",        unit: "mg/dL", placeholder: "e.g. 0.9",  normal: "0.6–1.2" },
  { key: "glucose",          label: "Glucose (fasting)", unit: "mg/dL", placeholder: "e.g. 88",   normal: "70–99" },
  { key: "crp",              label: "CRP",               unit: "mg/L",  placeholder: "e.g. 0.8",  normal: "<3.0" },
  { key: "lymphocytePct",    label: "Lymphocyte %",      unit: "%",     placeholder: "e.g. 28",   normal: "20–40" },
  { key: "mcv",              label: "MCV",               unit: "fL",    placeholder: "e.g. 89",   normal: "80–100" },
  { key: "rdw",              label: "RDW",               unit: "%",     placeholder: "e.g. 13.2", normal: "11.5–14.5" },
  { key: "alp",              label: "Alkaline Phosphatase", unit: "U/L", placeholder: "e.g. 68",  normal: "44–147" },
  { key: "wbc",              label: "WBC",               unit: "10³/µL", placeholder: "e.g. 5.8", normal: "4.5–11.0" },
];

const EXAMPLE_VALUES: FormValues = {
  chronologicalAge: "45",
  albumin: "4.3",
  creatinine: "0.85",
  glucose: "92",
  crp: "0.6",
  lymphocytePct: "30",
  mcv: "88",
  rdw: "12.8",
  alp: "65",
  wbc: "5.5",
};

const ORGAN_COLORS = {
  metabolicAge:     { label: "Metabolic",     color: "#ada03e" },
  immuneAge:        { label: "Immune",         color: "#887759" },
  inflammatoryAge:  { label: "Inflammatory",   color: "#7a6a9a" },
  hematologicalAge: { label: "Hematological",  color: "#ada03e" },
};

export default function CalculatePage() {
  const [values, setValues] = useState<FormValues>({
    albumin: "", creatinine: "", glucose: "", crp: "",
    lymphocytePct: "", mcv: "", rdw: "", alp: "", wbc: "",
    chronologicalAge: "",
  });
  const [result, setResult] = useState<CalculateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(key: keyof FormValues, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
    setError(null);
  }

  function loadExample() {
    setValues(EXAMPLE_VALUES);
    setResult(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: Record<string, number> = {};
      for (const { key } of FIELDS) {
        const n = parseFloat(values[key]);
        if (isNaN(n)) {
          setError(`Invalid value for "${key}". Please enter a number.`);
          setLoading(false);
          return;
        }
        body[key] = n;
      }

      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Calculation failed.");
        return;
      }

      setResult(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "var(--background)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
    fontFamily: FONT,
    fontSize: "13px",
    outline: "none",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Nav />

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs uppercase mb-3"
            style={{ fontFamily: FONT, color: "var(--accent)", letterSpacing: "0.2em", fontWeight: 600 }}
          >
            Assessment
          </p>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: FONT, letterSpacing: "-0.01em" }}
          >
            PhenoAge Calculator
          </h1>
          <p style={{ color: "var(--text-muted)", fontFamily: FONT, fontSize: "13px", fontWeight: 400 }}>
            Enter standard bloodwork values to compute your biological age.
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="p-4 mb-8"
          style={{
            background: "rgba(136,119,89,0.05)",
            border: "1px solid rgba(136,119,89,0.15)",
            color: "var(--text-muted)",
            fontFamily: FONT,
            fontSize: "11px",
            lineHeight: "1.7",
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>Note: </span>
          For informational purposes only. Not medical advice. Based on{" "}
          Levine ME et al. &ldquo;An epigenetic biomarker of aging for lifespan and healthspan.&rdquo;
          Aging (Albany NY). 2018. doi:10.18632/aging.101414
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="p-7 mb-6"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex justify-between items-center mb-7">
              <p
                className="text-xs uppercase"
                style={{ color: "var(--accent)", fontFamily: FONT, letterSpacing: "0.18em", fontWeight: 600 }}
              >
                Bloodwork Inputs
              </p>
              <button
                type="button"
                onClick={loadExample}
                className="text-xs px-3 py-1.5 transition-opacity hover:opacity-70"
                style={{
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontFamily: FONT,
                  border: "1px solid var(--border)",
                  letterSpacing: "0.08em",
                }}
              >
                Load example
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FIELDS.map(({ key, label, unit, placeholder, normal }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-xs mb-2"
                    style={{ color: "var(--text-secondary)", fontFamily: FONT, fontWeight: 500, letterSpacing: "0.06em" }}
                  >
                    {label}
                    <span style={{ color: "var(--text-muted)", marginLeft: "6px", fontWeight: 400 }}>{unit}</span>
                    {normal !== "—" && (
                      <span style={{ color: "var(--text-muted)", marginLeft: "6px", fontSize: "9px", letterSpacing: "0.06em" }}>
                        ref: {normal}
                      </span>
                    )}
                  </label>
                  <input
                    id={key}
                    type="number"
                    step="any"
                    placeholder={placeholder}
                    value={values[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border transition-colors"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div
              className="mb-5 p-4 text-xs"
              style={{
                background: "var(--worse-bg)",
                border: "1px solid var(--worse)",
                color: "#c07070",
                fontFamily: FONT,
                letterSpacing: "0.04em",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{
              background: "var(--accent)",
              color: "#ffffff",
              fontFamily: FONT,
              letterSpacing: "0.15em",
            }}
          >
            {loading ? "COMPUTING..." : "CALCULATE BIOLOGICAL AGE"}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div id="results" className="mt-12">
            {/* Hero result */}
            <div
              className="p-8 mb-6"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <p
                className="text-xs uppercase mb-6"
                style={{ color: "var(--accent)", fontFamily: FONT, letterSpacing: "0.2em", fontWeight: 600 }}
              >
                Your Biological Age
              </p>

              <div className="flex items-end gap-6 mb-5">
                {/* Big bio age number */}
                <div>
                  <p
                    style={{
                      fontSize: "88px",
                      fontWeight: "800",
                      lineHeight: 1,
                      fontFamily: FONT,
                      letterSpacing: "-0.04em",
                      color: "var(--foreground)",
                    }}
                  >
                    {result.phenoAge.toFixed(1)}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "9px", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, marginTop: "4px" }}>
                    Bio Age
                  </p>
                </div>

                <div className="mb-4">
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "30px", fontFamily: FONT, fontWeight: "700", lineHeight: 1, letterSpacing: "-0.02em" }}>
                    {result.chronologicalAge}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "9px", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, marginTop: "4px" }}>
                    Chrono
                  </p>
                </div>

                {/* Delta badge */}
                <div
                  className="mb-5 px-4 py-2"
                  style={{
                    background: result.delta < 0 ? "var(--accent-bg)" : "var(--worse-bg)",
                    border: `1px solid ${result.delta < 0 ? "var(--accent)" : "var(--worse)"}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: result.delta < 0 ? "var(--accent)" : "#8a5555",
                      fontFamily: FONT,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {result.delta < 0 ? "" : "+"}
                    {result.delta.toFixed(1)}
                  </p>
                  <p style={{ fontSize: "8px", color: "var(--text-muted)", fontFamily: FONT, textAlign: "center", marginTop: "3px", letterSpacing: "0.1em", fontWeight: 600 }}>
                    YRS DELTA
                  </p>
                </div>
              </div>

              {/* Status line */}
              <div
                className="flex items-center gap-2.5 px-4 py-3"
                style={{ background: result.delta < 0 ? "rgba(136,119,89,0.06)" : "rgba(120,60,60,0.06)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: result.delta < 0 ? "var(--accent)" : "#8a5555" }}
                />
                <p
                  style={{
                    color: result.delta < 0 ? "var(--accent)" : "#8a5555",
                    fontSize: "12px",
                    fontFamily: FONT,
                    fontWeight: 500,
                  }}
                >
                  Aging{" "}
                  <strong>{Math.abs(result.delta).toFixed(1)} years</strong>{" "}
                  {result.delta < 0 ? "slower" : "faster"} than chronological age
                </p>
              </div>
            </div>

            {/* Organ breakdown */}
            <div
              className="p-7 mb-6"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <p
                className="text-xs uppercase mb-7"
                style={{ color: "var(--accent)", fontFamily: FONT, letterSpacing: "0.18em", fontWeight: 600 }}
              >
                Organ System Breakdown
              </p>

              {(Object.keys(ORGAN_COLORS) as Array<keyof typeof ORGAN_COLORS>).map((key) => (
                <OrganBar
                  key={key}
                  label={ORGAN_COLORS[key].label}
                  organAge={result.organScores[key]}
                  chronoAge={result.chronologicalAge}
                  color={ORGAN_COLORS[key].color}
                />
              ))}

              <p
                className="mt-5 text-xs"
                style={{ color: "var(--text-muted)", fontFamily: FONT, lineHeight: "1.6", fontSize: "11px" }}
              >
                Sub-scores derived from z-scores vs. age-adjusted population norms (NHANES).
                The vertical marker on each bar represents your chronological age.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/card"
                className="px-6 py-3 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#ffffff", fontFamily: FONT, letterSpacing: "0.12em" }}
              >
                GENERATE SHARE CARD
              </Link>
              <button
                onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="px-6 py-3 text-xs border transition-opacity hover:opacity-70"
                style={{ background: "transparent", color: "var(--text-muted)", borderColor: "var(--border)", fontFamily: FONT, letterSpacing: "0.1em" }}
              >
                RECALCULATE
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
