"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/layout";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/calculate", label: "Calculate" },
  { href: "/protocol", label: "Protocol" },
  { href: "/card", label: "Card" },
];

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-50 transition-colors"
      style={{ background: "var(--background)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-inter)", color: "var(--accent)" }}
        >
          BIO
        </span>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}
        >
          AGE
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-sm ml-1"
          style={{
            background: "var(--accent-bg)",
            color: "var(--accent)",
            fontFamily: "var(--font-inter)",
            fontSize: "9px",
            letterSpacing: "0.1em",
          }}
        >
          BETA
        </span>
      </Link>

      {/* Links + theme toggle */}
      <div className="flex items-center gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm rounded-sm transition-colors"
              style={{
                fontFamily: "var(--font-inter)",
                background: active ? "var(--accent-bg)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="ml-3 px-2 py-1.5 rounded-sm text-sm transition-colors hover:opacity-80"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-inter)",
            fontSize: "15px",
            lineHeight: 1,
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
