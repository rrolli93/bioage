"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/calculate", label: "Calculate" },
  { href: "/protocol", label: "Protocol" },
  { href: "/card", label: "Card" },
];

const FONT = "'Montserrat', system-ui, sans-serif";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-50"
      style={{
        background: "var(--background)",
        borderColor: "var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5">
        <span
          className="text-base font-bold tracking-widest"
          style={{ fontFamily: FONT, color: "var(--accent)", letterSpacing: "0.18em" }}
        >
          BIO
        </span>
        <span
          className="text-base font-bold tracking-widest"
          style={{ fontFamily: FONT, color: "var(--foreground)", letterSpacing: "0.18em" }}
        >
          AGE
        </span>
        <span
          className="text-xs px-1.5 py-0.5 ml-1"
          style={{
            background: "var(--accent-bg)",
            color: "var(--accent)",
            fontFamily: FONT,
            fontSize: "8px",
            letterSpacing: "0.15em",
            border: "1px solid var(--accent)",
            opacity: 0.7,
          }}
        >
          BETA
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                fontFamily: FONT,
                letterSpacing: "0.06em",
                color: active ? "var(--foreground)" : "var(--text-muted)",
                borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
                paddingBottom: active ? "4px" : "4px",
              }}
            >
              {label.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
