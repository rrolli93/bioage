"use client";

import { forwardRef } from "react";
import OrganBar from "./OrganBar";
import ProtocolPill from "./ProtocolPill";

const FONT = "'Montserrat', system-ui, sans-serif";

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
  metabolic: "#ada03e",
  immune: "#887759",
  inflammatory: "#7a6a9a",
  hematological: "#ada03e",
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
        background: "#06064a",
        border: "1px solid rgba(136,119,89,0.2)",
        borderRadius: "2px",
        padding: "32px",
        fontFamily: FONT,
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p
            style={{
              fontSize: "9px",
              color: "#887759",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: FONT,
              marginBottom: "4px",
              fontWeight: 600,
            }}
          >
            BioAge Report · {monthYear}
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: FONT,
              letterSpacing: "0.1em",
            }}
          >
            Model: PhenoAge v2.1 (Levine 2018)
          </p>
        </div>

        {/* Delta badge */}
        <div
          style={{
            background: isYounger ? "rgba(136,119,89,0.1)" : "rgba(120,60,60,0.12)",
            border: `1px solid ${isYounger ? "#887759" : "#7a4040"}`,
            borderRadius: "2px",
            padding: "6px 12px",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: isYounger ? "#887759" : "#8a5555",
              fontFamily: FONT,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {isYounger ? "−" : "+"}
            {absDelta}
          </p>
          <p
            style={{
              fontSize: "8px",
              color: "rgba(255,255,255,0.4)",
              fontFamily: FONT,
              textAlign: "center",
              marginTop: "3px",
              letterSpacing: "0.1em",
            }}
          >
            YRS
          </p>
        </div>
      </div>

      {/* Hero bio age */}
      <div className="flex items-end gap-5 mb-2">
        <p
          style={{
            fontSize: "88px",
            fontWeight: "800",
            lineHeight: 1,
            fontFamily: FONT,
            letterSpacing: "-0.04em",
            color: "#ffffff",
          }}
        >
          {phenoAge.toFixed(1)}
        </p>
        <div className="mb-3">
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontFamily: FONT, letterSpacing: "0.15em", fontWeight: 600 }}>
            BIO AGE
          </p>
          <p style={{ fontSize: "22px", color: "rgba(255,255,255,0.5)", fontFamily: FONT, fontWeight: "700", letterSpacing: "-0.02em" }}>
            {chronoAge.toFixed(0)}
          </p>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: FONT, letterSpacing: "0.15em", fontWeight: 600 }}>
            CHRONO
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-2 mb-8 px-4 py-2.5"
        style={{ background: isYounger ? "rgba(136,119,89,0.08)" : "rgba(120,60,60,0.08)" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: isYounger ? "#887759" : "#8a5555" }}
        />
        <p
          style={{
            fontSize: "11px",
            color: isYounger ? "#887759" : "#8a5555",
            fontFamily: FONT,
            fontWeight: 500,
          }}
        >
          Aging {absDelta} years {isYounger ? "slower" : "faster"} than chronological
        </p>
      </div>

      {/* Organ breakdown */}
      <div className="mb-7">
        <p
          style={{
            fontSize: "9px",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: FONT,
            marginBottom: "14px",
            fontWeight: 600,
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
        <div className="mb-7">
          <p
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: FONT,
              marginBottom: "10px",
              fontWeight: 600,
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
        style={{ borderTop: "1px solid rgba(136,119,89,0.15)" }}
      >
        <p
          style={{
            fontSize: "8px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.2em",
            fontFamily: FONT,
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
