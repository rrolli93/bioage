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
  "Peptide Bioregulators (Khavinson)": "#52b788",
  "Tissue Repair Peptides": "#f4a261",
  "Immune Modulators": "#7b5ea7",
  Senolytics: "#ff4d6d",
  "NAD+ Pathway": "#ffd166",
  "GLP-1 / Metabolic": "#06d6a0",
  "mTOR / Autophagy": "#a8dadc",
  "Other Longevity": "#aaaaaa",
};

export default function ProtocolPill({
  compound,
  dose,
  category,
  active = true,
  onToggle,
  onDelete,
}: ProtocolPillProps) {
  const color = category ? (CATEGORY_COLORS[category] ?? "#52b788") : "#52b788";

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm"
      style={{
        background: active ? "#111111" : "#0a0a0a",
        borderColor: active ? color + "44" : "#1e1e1e",
        opacity: active ? 1 : 0.5,
        fontFamily: "var(--font-playfair)",
      }}
    >
      {/* Color dot */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: active ? color : "#444" }}
      />

      {/* Compound name */}
      <span className="text-white font-medium">{compound}</span>

      {/* Dose */}
      {dose && (
        <span style={{ color: "#666" }} className="text-xs">
          {dose}
        </span>
      )}

      {/* Toggle active */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="ml-1 text-xs hover:opacity-80 transition-opacity"
          style={{ color: active ? color : "#555" }}
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
          style={{ color: "#555" }}
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}
