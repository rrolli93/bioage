"use client";

const FONT = "'Montserrat', system-ui, sans-serif";

interface ProtocolPillProps {
  compound: string;
  dose?: string;
  category?: string;
  active?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
}

// Map category to clinical accent colors (within our palette)
const CATEGORY_COLORS: Record<string, string> = {
  "Stem Cell Therapies": "#ada03e",
  "Peptide Bioregulators (Khavinson)": "#887759",
  "Tissue Repair Peptides": "#ada03e",
  "Immune Modulators": "#7a6a9a",
  Senolytics: "#6a7a9a",
  "NAD+ Pathway": "#887759",
  "GLP-1 / Metabolic": "#ada03e",
  "mTOR / Autophagy": "#7a8a6a",
  "Other Longevity": "#606088",
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
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs"
      style={{
        background: active ? "var(--card)" : "transparent",
        border: `1px solid ${active ? color + "44" : "var(--border)"}`,
        opacity: active ? 1 : 0.45,
        fontFamily: FONT,
      }}
    >
      {/* Color marker */}
      <span
        className="w-1 h-3 flex-shrink-0"
        style={{ background: active ? color : "var(--text-muted)", opacity: 0.8 }}
      />

      {/* Compound name */}
      <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{compound}</span>

      {/* Dose */}
      {dose && (
        <span style={{ color: "var(--text-muted)" }}>
          {dose}
        </span>
      )}

      {/* Toggle active */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="ml-1 transition-opacity hover:opacity-70"
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
          className="ml-0.5 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}
