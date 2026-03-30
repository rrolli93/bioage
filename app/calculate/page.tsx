"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import OrganBar from "@/components/OrganBar";

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
  metabolicAge:     { label: "Metabolic",     color: "#f4a261" },
  immuneAge:        { label: "Immune",         color: "#00b8ac" },
  inflammatoryAge:  { label: "Inflammatory",   color: "#7b5ea7" },
  hematologicalAge: { label: "Hematological",  color: "#4cc9f0" },
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
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#121e2b" }}>
      <Nav />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            PhenoAge Calculator
          </h1>
          <p style={{ color: "#626d86", fontFamily: "var(--font-inter)", fontSize: "13px" }}>
            Enter your standard bloodwork values to compute your biological age.
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="p-4 rounded-sm border mb-8 text-sm"
          style={{
            background: "#0d1a10",
            borderColor: "#1a3a22",
            color: "#626d86",
            fontFamily: "var(--font-inter)",
            fontSize: "12px",
            lineHeight: "1.6",
          }}
        >
          <span style={{ color: "#00b8ac", fontWeight: 600 }}>Note: </span>
          For informational purposes only. Not medical advice. PhenoAge is a research tool based on{" "}
          <span style={{ color: "#8895a7" }}>
            Levine ME et al. &ldquo;An epigenetic biomarker of aging for lifespan and healthspan.&rdquo;
            Aging (Albany NY). 2018. doi:10.18632/aging.101414
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="p-6 rounded-sm border mb-6"
            style={{ background: "#1a2c3f", borderColor: "#223e6b" }}
          >
            <div className="flex justify-between items-center mb-6">
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: "#8895a7", fontFamily: "var(--font-inter)" }}
              >
                Bloodwork Inputs
              </p>
              <button
                type="button"
                onClick={loadExample}
                className="text-xs px-3 py-1 rounded-sm transition-opacity hover:opacity-70"
                style={{
                  background: "#223e6b",
                  color: "#626d86",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Load example values
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map(({ key, label, unit, placeholder, normal }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-xs mb-1.5"
                    style={{ color: "#626d86", fontFamily: "var(--font-inter)" }}
                  >
                    {label}
                    <span style={{ color: "#a0aec0", marginLeft: "6px" }}>{unit}</span>
                    {normal !== "—" && (
                      <span style={{ color: "#b0bdd0", marginLeft: "6px", fontSize: "10px" }}>
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
                    className="w-full px-3 py-2 rounded-sm border text-sm outline-none transition-colors focus:border-[#00b8ac55]"
                    style={{
                      background: "#121e2b",
                      borderColor: "#223e6b",
                      color: "#ffffff",
                      fontFamily: "var(--font-inter)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div
              className="mb-4 p-3 rounded-sm border text-sm"
              style={{
                background: "#1a1525",
                borderColor: "#3a1010",
                color: "#4a3aff",
                fontFamily: "var(--font-inter)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-sm text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{
              background: "#00b8ac",
              color: "#000",
              fontFamily: "var(--font-inter)",
            }}
          >
            {loading ? "Computing..." : "Calculate Biological Age →"}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div id="results" className="mt-10">
            {/* Hero result */}
            <div
              className="p-8 rounded-sm border mb-6 relative overflow-hidden"
              style={{ background: "#1a2c3f", borderColor: "#223e6b" }}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    result.delta < 0
                      ? "radial-gradient(ellipse at 50% 0%, #00b8ac11 0%, transparent 70%)"
                      : "radial-gradient(ellipse at 50% 0%, #4a3aff11 0%, transparent 70%)",
                }}
              />

              <div className="relative">
                <p
                  className="text-xs uppercase tracking-widest mb-4"
                  style={{ color: "#8895a7", fontFamily: "var(--font-inter)" }}
                >
                  Your Biological Age
                </p>

                <div className="flex items-end gap-5 mb-4">
                  {/* Big bio age number */}
                  <p
                    style={{
                      fontSize: "80px",
                      fontWeight: "800",
                      lineHeight: 1,
                      fontFamily: "var(--font-inter)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {result.phenoAge.toFixed(1)}
                  </p>

                  <div className="mb-2">
                    <p style={{ color: "#8895a7", fontSize: "11px", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Bio Age
                    </p>
                    <p style={{ color: "#626d86", fontSize: "28px", fontFamily: "var(--font-inter)", fontWeight: "600", lineHeight: 1 }}>
                      {result.chronologicalAge}
                    </p>
                    <p style={{ color: "#a0aec0", fontSize: "10px", fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Chrono
                    </p>
                  </div>

                  {/* Delta badge */}
                  <div
                    className="mb-3 px-4 py-2 rounded-sm"
                    style={{
                      background: result.delta < 0 ? "#00b8ac1a" : "#1a1525",
                      border: `1px solid ${result.delta < 0 ? "#00b8ac44" : "#4a3aff44"}`,
                      boxShadow: result.delta < 0 ? "0 0 10px #00b8ac66" : "0 0 10px #4a3aff44",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: result.delta < 0 ? "#00b8ac" : "#4a3aff",
                        fontFamily: "var(--font-inter)",
                        lineHeight: 1,
                      }}
                    >
                      {result.delta < 0 ? "" : "+"}
                      {result.delta.toFixed(1)}
                    </p>
                    <p style={{ fontSize: "9px", color: "#626d86", fontFamily: "var(--font-inter)", textAlign: "center", marginTop: "2px" }}>
                      yrs delta
                    </p>
                  </div>
                </div>

                {/* Status line */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-sm"
                  style={{ background: result.delta < 0 ? "#00b8ac1a" : "#1a1525" }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: result.delta < 0 ? "#00b8ac" : "#4a3aff" }}
                  />
                  <p
                    style={{
                      color: result.delta < 0 ? "#00b8ac" : "#4a3aff",
                      fontSize: "13px",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    Aging{" "}
                    <strong>{Math.abs(result.delta).toFixed(1)} years</strong>{" "}
                    {result.delta < 0 ? "slower" : "faster"} than chronological age
                  </p>
                </div>
              </div>
            </div>

            {/* Organ breakdown */}
            <div
              className="p-6 rounded-sm border mb-6"
              style={{ background: "#1a2c3f", borderColor: "#223e6b" }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-6"
                style={{ color: "#8895a7", fontFamily: "var(--font-inter)" }}
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
                className="mt-4 text-xs"
                style={{ color: "#a0aec0", fontFamily: "var(--font-inter)" }}
              >
                Sub-scores are derived from z-scores vs age-adjusted population norms (NHANES).
                The white marker on each bar represents your chronological age.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/card"
                className="px-5 py-2.5 rounded-sm text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: "#00b8ac", color: "#000", fontFamily: "var(--font-inter)" }}
              >
                Generate Share Card →
              </Link>
              <button
                onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="px-5 py-2.5 rounded-sm text-sm border transition-colors"
                style={{ background: "transparent", color: "#8895a7", borderColor: "#223e6b", fontFamily: "var(--font-inter)" }}
              >
                Recalculate
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
