"use client";

import { useEffect, useRef, useState } from "react";

interface OrganBarProps {
  label: string;
  organAge: number;
  chronoAge: number;
  color: string;
}

const MAX_AGE = 100;

export default function OrganBar({ label, organAge, chronoAge, color }: OrganBarProps) {
  const [mounted, setMounted] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger animation after mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const organPct = Math.min((organAge / MAX_AGE) * 100, 100);
  const chronoPct = Math.min((chronoAge / MAX_AGE) * 100, 100);
  const delta = organAge - chronoAge;
  const isOlder = delta > 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "var(--font-inter)", color }}
          >
            {organAge.toFixed(1)}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded`}
            style={{
              fontFamily: "var(--font-inter)",
              background: isOlder ? "#1a1525" : "var(--accent-bg)",
              color: isOlder ? "#4a3aff" : "var(--accent)",
            }}
          >
            {isOlder ? "+" : ""}
            {delta.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Bar track */}
      <div
        className="relative h-2 rounded-sm overflow-hidden"
        style={{ background: "var(--border)" }}
      >
        {/* Organ age bar */}
        <div
          ref={barRef}
          className="absolute top-0 left-0 h-full rounded-sm transition-all duration-1200 ease-out"
          style={{
            width: mounted ? `${organPct}%` : "0%",
            background: color,
            transition: "width 1.2s ease",
          }}
        />

        {/* Chronological age marker */}
        <div
          className="absolute top-0 h-full w-0.5"
          style={{
            left: `${chronoPct}%`,
            background: "#ffffff33",
          }}
        />
      </div>

      {/* Age scale labels */}
      <div
        className="flex justify-between mt-0.5 text-xs"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
      >
        <span>0</span>
        <span style={{ color: "var(--text-muted)" }}>chrono: {chronoAge}</span>
        <span>{MAX_AGE}</span>
      </div>
    </div>
  );
}
