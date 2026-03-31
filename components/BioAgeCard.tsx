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
  immune: "var(--accent)",
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
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "28px",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "var(--font-inter)",
              marginBottom: "2px",
            }}
          >
            BioAge Report · {monthYear}
          </p>
          <p
            style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-inter)",
              letterSpacing: "0.1em",
            }}
          >
            Model: PhenoAge v2.1
          </p>
        </div>

        {/* Delta badge */}
        <div
          style={{
            background: isYounger ? "var(--accent-bg)" : "#1a1525",
            border: `1px solid ${isYounger ? "var(--accent-glow)" : "#4a3aff44"}`,
            borderRadius: "6px",
            padding: "6px 10px",
            boxShadow: isYounger ? "0 0 10px var(--accent-glow)" : "0 0 10px #4a3aff44",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: isYounger ? "var(--accent)" : "#4a3aff",
              fontFamily: "var(--font-inter)",
              lineHeight: 1,
            }}
          >
            {isYounger ? "−" : "+"}
            {absDelta}
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-inter)",
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
            fontFamily: "var(--font-inter)",
            letterSpacing: "-0.03em",
            color: "var(--foreground)",
          }}
        >
          {phenoAge.toFixed(1)}
        </p>
        <div className="mb-3">
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}>
            BIO AGE
          </p>
          <p style={{ fontSize: "20px", color: "var(--text-secondary)", fontFamily: "var(--font-inter)", fontWeight: "600" }}>
            {chronoAge.toFixed(0)}
          </p>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}>
            CHRONO
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-2 mb-6 px-3 py-2 rounded-sm"
        style={{ background: isYounger ? "var(--accent-bg)" : "#1a0a0a" }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: isYounger ? "var(--accent)" : "#4a3aff" }}
        />
        <p
          style={{
            fontSize: "12px",
            color: isYounger ? "var(--accent)" : "#4a3aff",
            fontFamily: "var(--font-inter)",
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
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "var(--font-inter)",
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
              color: "var(--text-muted)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "var(--font-inter)",
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
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          style={{
            fontSize: "9px",
            color: "var(--text-muted)",
            letterSpacing: "0.2em",
            fontFamily: "var(--font-inter)",
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
