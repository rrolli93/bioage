"use client";

import { Inter } from "next/font/google";
import { createContext, useContext, useEffect, useState } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Theme context
type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}
export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bioage-theme") as Theme | null;
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    }
  }, []);

  // Apply class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("bioage-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
