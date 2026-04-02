"use client";

import { useEffect, useRef, useState } from "react";

interface OrganBarProps {
  label: string;
  organAge: number;
  chronoAge: number;
  color: string;
}

const MAX_AGE = 100;
const FONT = "'Montserrat', system-ui, sans-serif";

export default function OrganBar({ label, organAge, chronoAge, color }: OrganBarProps) {
  const [mounted, setMounted] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const organPct = Math.min((organAge / MAX_AGE) * 100, 100);
  const chronoPct = Math.min((chronoAge / MAX_AGE) * 100, 100);
  const delta = organAge - chronoAge;
  const isOlder = delta > 0;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-xs uppercase"
          style={{ color: "var(--text-secondary)", fontFamily: FONT, letterSpacing: "0.14em", fontWeight: 600, fontSize: "10px" }}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: FONT, color: "var(--foreground)" }}
          >
            {organAge.toFixed(1)}
          </span>
          <span
            className="text-xs px-1.5 py-0.5"
            style={{
              fontFamily: FONT,
              background: isOlder ? "var(--worse-bg)" : "var(--accent-bg)",
              color: isOlder ? "var(--worse)" : "var(--accent)",
              border: `1px solid ${isOlder ? "var(--worse)" : "var(--accent)"}`,
              opacity: 0.85,
              fontWeight: 600,
            }}
          >
            {isOlder ? "+" : ""}{delta.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Bar track */}
      <div
        className="relative h-1"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {/* Organ age bar */}
        <div
          ref={barRef}
          className="absolute top-0 left-0 h-full"
          style={{
            width: mounted ? `${organPct}%` : "0%",
            background: color,
            transition: "width 1.2s ease",
            opacity: 0.7,
          }}
        />

        {/* Chronological age marker */}
        <div
          className="absolute top-0 h-full w-px"
          style={{
            left: `${chronoPct}%`,
            background: "rgba(255,255,255,0.3)",
          }}
        />
      </div>

      {/* Labels */}
      <div
        className="flex justify-between mt-1 text-xs"
        style={{ color: "var(--text-muted)", fontFamily: FONT, fontSize: "9px", letterSpacing: "0.05em" }}
      >
        <span>0</span>
        <span>chrono: {chronoAge}</span>
        <span>{MAX_AGE}</span>
      </div>
    </div>
  );
}
