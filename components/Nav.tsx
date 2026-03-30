"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/calculate", label: "Calculate" },
  { href: "/protocol", label: "Protocol" },
  { href: "/card", label: "Card" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-50"
      style={{ background: "#121e2b", borderColor: "#223e6b" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-inter)", color: "#00b8ac" }}
        >
          BIO
        </span>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-inter)", color: "#ffffff" }}
        >
          AGE
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-sm ml-1"
          style={{
            background: "#00b8ac1a",
            color: "#00b8ac",
            fontFamily: "var(--font-inter)",
            fontSize: "9px",
            letterSpacing: "0.1em",
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
              className="px-3 py-1.5 text-sm rounded-sm transition-colors"
              style={{
                fontFamily: "var(--font-inter)",
                background: active ? "#223e6b" : "transparent",
                color: active ? "#ffffff" : "#626d86",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
