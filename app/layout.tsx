import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BioAge — Biological Age Tracker",
  description:
    "Track your biological age with the PhenoAge formula (Levine et al. 2018). Log longevity protocols and monitor trends over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
    >
      <body className="min-h-full bg-[#121e2b] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
