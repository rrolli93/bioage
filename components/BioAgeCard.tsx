"use client";

import { forwardRef } from "react";
import OrganBar from "./OrganBar";
import ProtocolPill from "./ProtocolPill";

export interface CardData {
  phenoAge: number;
  chronoAge: number;
  delta: number;
  date: string;
  organScores: {
    metabolicAge: number;
    immuneAge: number;
    inflammatoryAge: number;
    hematologicalAge: number;
  };
  protocols: Array<{ compound: string; dose?: string; category?: string }>;
}

interface BioAgeCardProps {
  data: CardData;
}

const ORGAN_COLORS = {
  metabolic: "#f4a261",
  immune: "#52b788",
  inflammatory: "#7b5ea7",
  hematological: "#4cc9f0",
};

const BioAgeCard = forwardRef<HTMLDivElement, BioAgeCardProps>(function BioAgeCard(
  { data },
  ref
) {
  const { phenoAge, chronoAge, delta, date, organScores, protocols } = data;
  const isYounger = delta < 0;
  const absDelta = Math.abs(delta).toFixed(1);

  const monthYear = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      ref={ref}
      style={{
        width: "420px",
        background: "#111111",
        border: "1px solid #1e1e1e",
        borderRadius: "12px",
        padding: "28px",
        fontFamily: "var(--font-playfair), serif",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p
            style={{
              fontSize: "11px",
              color: "#888",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "var(--font-playfair)",
              marginBottom: "2px",
            }}
          >
            BioAge Report · {monthYear}
          </p>
          <p
            style={{
              fontSize: "10px",
              color: "#444",
              fontFamily: "var(--font-playfair)",
              letterSpacing: "0.1em",
            }}
          >
            Model: PhenoAge v2.1
          </p>
        </div>

        {/* Delta badge */}
        <div
          style={{
            background: isYounger ? "#0d2b1f" : "#2d1010",
            border: `1px solid ${isYounger ? "#52b78844" : "#ff4d6d44"}`,
            borderRadius: "6px",
            padding: "6px 10px",
            boxShadow: isYounger ? "0 0 10px #52b78866" : "0 0 10px #ff4d6d44",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: isYounger ? "#52b788" : "#ff4d6d",
              fontFamily: "var(--font-playfair)",
              lineHeight: 1,
            }}
          >
            {isYounger ? "−" : "+"}
            {absDelta}
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#666",
              fontFamily: "var(--font-playfair)",
              textAlign: "center",
              marginTop: "2px",
            }}
          >
            yrs
          </p>
        </div>
      </div>

      {/* Hero bio age */}
      <div className="flex items-end gap-4 mb-2">
        <p
          style={{
            fontSize: "80px",
            fontWeight: "800",
            lineHeight: 1,
            fontFamily: "var(--font-playfair)",
            letterSpacing: "-0.03em",
            color: "#ffffff",
          }}
        >
          {phenoAge.toFixed(1)}
        </p>
        <div className="mb-3">
          <p style={{ fontSize: "12px", color: "#555", fontFamily: "var(--font-playfair)" }}>
            BIO AGE
          </p>
          <p style={{ fontSize: "20px", color: "#666", fontFamily: "var(--font-playfair)", fontWeight: "600" }}>
            {chronoAge.toFixed(0)}
          </p>
          <p style={{ fontSize: "10px", color: "#444", fontFamily: "var(--font-playfair)" }}>
            CHRONO
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-2 mb-6 px-3 py-2 rounded-sm"
        style={{ background: isYounger ? "#0d2b1f" : "#1a0a0a" }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: isYounger ? "#52b788" : "#ff4d6d" }}
        />
        <p
          style={{
            fontSize: "12px",
            color: isYounger ? "#52b788" : "#ff4d6d",
            fontFamily: "var(--font-playfair)",
          }}
        >
          Aging {absDelta} years {isYounger ? "slower" : "faster"} than chronological
        </p>
      </div>

      {/* Organ breakdown */}
      <div className="mb-6">
        <p
          style={{
            fontSize: "10px",
            color: "#444",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "var(--font-playfair)",
            marginBottom: "12px",
          }}
        >
          Organ Systems
        </p>

        <OrganBar label="Metabolic" organAge={organScores.metabolicAge} chronoAge={chronoAge} color={ORGAN_COLORS.metabolic} />
        <OrganBar label="Immune" organAge={organScores.immuneAge} chronoAge={chronoAge} color={ORGAN_COLORS.immune} />
        <OrganBar label="Inflammatory" organAge={organScores.inflammatoryAge} chronoAge={chronoAge} color={ORGAN_COLORS.inflammatory} />
        <OrganBar label="Hematological" organAge={organScores.hematologicalAge} chronoAge={chronoAge} color={ORGAN_COLORS.hematological} />
      </div>

      {/* Active protocols */}
      {protocols.length > 0 && (
        <div className="mb-6">
          <p
            style={{
              fontSize: "10px",
              color: "#444",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "var(--font-playfair)",
              marginBottom: "10px",
            }}
          >
            Active Protocols
          </p>
          <div className="flex flex-wrap gap-2">
            {protocols.map((p, i) => (
              <ProtocolPill
                key={i}
                compound={p.compound}
                dose={p.dose}
                category={p.category}
              />
            ))}
          </div>
        </div>
      )}

      {/* Watermark */}
      <div
        className="pt-4"
        style={{ borderTop: "1px solid #1e1e1e" }}
      >
        <p
          style={{
            fontSize: "9px",
            color: "#333",
            letterSpacing: "0.2em",
            fontFamily: "var(--font-playfair)",
            textAlign: "center",
          }}
        >
          BIOAGE.DEV · OPEN SOURCE · PhenoAge (Levine et al. 2018)
        </p>
      </div>
    </div>
  );
});

export default BioAgeCard;
