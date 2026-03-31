"use client";

interface ProtocolPillProps {
  compound: string;
  dose?: string;
  category?: string;
  active?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
}

// Map category to a subtle accent color
const CATEGORY_COLORS: Record<string, string> = {
  "Stem Cell Therapies": "#4cc9f0",
  "Peptide Bioregulators (Khavinson)": "var(--accent)",
  "Tissue Repair Peptides": "#f4a261",
  "Immune Modulators": "#7b5ea7",
  Senolytics: "#4a3aff",
  "NAD+ Pathway": "#ffd166",
  "GLP-1 / Metabolic": "#06d6a0",
  "mTOR / Autophagy": "#a8dadc",
  "Other Longevity": "var(--text-muted)",
};

export default function ProtocolPill({
  compound,
  dose,
  category,
  active = true,
  onToggle,
  onDelete,
}: ProtocolPillProps) {
  const color = category ? (CATEGORY_COLORS[category] ?? "var(--accent)") : "var(--accent)";

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm"
      style={{
        background: active ? "var(--card)" : "var(--background)",
        borderColor: active ? color + "44" : "var(--border)",
        opacity: active ? 1 : 0.5,
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Color dot */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: active ? color : "var(--text-muted)" }}
      />

      {/* Compound name */}
      <span className="text-white font-medium">{compound}</span>

      {/* Dose */}
      {dose && (
        <span style={{ color: "var(--text-secondary)" }} className="text-xs">
          {dose}
        </span>
      )}

      {/* Toggle active */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="ml-1 text-xs hover:opacity-80 transition-opacity"
          style={{ color: active ? color : "var(--text-muted)" }}
          title={active ? "Mark inactive" : "Mark active"}
        >
          {active ? "●" : "○"}
        </button>
      )}

      {/* Delete */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-0.5 text-xs hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-muted)" }}
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}
