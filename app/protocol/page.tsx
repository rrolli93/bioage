"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ProtocolPill from "@/components/ProtocolPill";

interface ProtocolEntry {
  id: string;
  createdAt: string;
  startDate: string;
  category: string;
  compound: string;
  dose: string;
  route: string;
  source?: string;
  notes?: string;
  active: boolean;
}


const FONT = "'Montserrat', system-ui, sans-serif";
const PROTOCOL_CATEGORIES: Record<string, string[]> = {
  "Stem Cell Therapies": [
    "MSC-derived exosomes / stem cell lysate",
    "Umbilical cord blood plasma",
    "Custom",
  ],
  "Peptide Bioregulators (Khavinson)": [
    "Epitalon (Epithalamin)",
    "Pinealon",
    "Thymalin",
    "Cortagen",
    "Cartalax",
    "Vilon",
    "Custom",
  ],
  "Tissue Repair Peptides": [
    "BPC-157",
    "TB-500 (Thymosin β4)",
    "GHK-Cu",
    "LL-37",
    "Custom",
  ],
  "Immune Modulators": ["Thymosin α1", "Thymosin β4", "Custom"],
  Senolytics: ["Dasatinib + Quercetin (D+Q)", "Fisetin", "Navitoclax", "Custom"],
  "NAD+ Pathway": ["NMN", "NR", "NAD+ IV", "Custom"],
  "GLP-1 / Metabolic": ["Semaglutide", "Tirzepatide", "Custom"],
  "mTOR / Autophagy": ["Rapamycin", "Metformin", "Spermidine", "Custom"],
  "Other Longevity": ["Custom"],
};

const ROUTES = ["oral", "subcutaneous", "IV", "topical", "intranasal", "other"];

const EMPTY_FORM = {
  category: Object.keys(PROTOCOL_CATEGORIES)[0],
  compound: "",
  dose: "",
  route: "oral",
  startDate: new Date().toISOString().split("T")[0],
  source: "",
  notes: "",
  active: true,
};

export default function ProtocolPage() {
  const [entries, setEntries] = useState<ProtocolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [customCompound, setCustomCompound] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadEntries() {
    const res = await fetch("/api/protocol");
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { loadEntries(); }, []);

  // When category changes, reset compound selection
  function handleCategoryChange(cat: string) {
    setForm((f) => ({ ...f, category: cat, compound: "" }));
    setCustomCompound("");
  }

  function handleCompoundChange(val: string) {
    setForm((f) => ({ ...f, compound: val }));
    if (val !== "Custom") setCustomCompound("");
  }

  const effectiveCompound =
    form.compound === "Custom" ? customCompound : form.compound;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!effectiveCompound.trim()) {
      setFormError("Please specify a compound name.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/protocol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          compound: effectiveCompound.trim(),
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setFormError(d.error || "Failed to save.");
        return;
      }

      setForm(EMPTY_FORM);
      setCustomCompound("");
      setShowForm(false);
      await loadEntries();
    } catch {
      setFormError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(entry: ProtocolEntry) {
    await fetch("/api/protocol", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, active: !entry.active }),
    });
    await loadEntries();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this protocol entry?")) return;
    await fetch(`/api/protocol?id=${id}`, { method: "DELETE" });
    await loadEntries();
  }

  const active = entries.filter((e) => e.active);
  const inactive = entries.filter((e) => !e.active);
  const compounds = PROTOCOL_CATEGORIES[form.category] ?? [];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}>
              Protocol Logger
            </h1>
            <p style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif", fontSize: "13px" }}>
              Log and track your active longevity interventions.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 rounded-sm text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "#ffffff", fontFamily: "'Montserrat', system-ui, sans-serif" }}
          >
            {showForm ? "Cancel" : "+ Add Protocol"}
          </button>
        </div>

        {/* Add protocol form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-sm border mb-8"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-6"
              style={{ color: "var(--text-muted)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
            >
              New Protocol Entry
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="sm:col-span-2">
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                >
                  {Object.keys(PROTOCOL_CATEGORIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Compound */}
              <div className={form.compound === "Custom" ? "" : "sm:col-span-2"}>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  Compound
                </label>
                <select
                  value={form.compound}
                  onChange={(e) => handleCompoundChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: form.compound ? "var(--foreground)" : "var(--text-muted)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                >
                  <option value="">— Select compound —</option>
                  {compounds.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Custom compound name */}
              {form.compound === "Custom" && (
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                    Custom Name
                  </label>
                  <input
                    type="text"
                    value={customCompound}
                    onChange={(e) => setCustomCompound(e.target.value)}
                    placeholder="Enter compound name"
                    className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                    style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                  />
                </div>
              )}

              {/* Dose */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  Dose
                </label>
                <input
                  type="text"
                  value={form.dose}
                  onChange={(e) => setForm((f) => ({ ...f, dose: e.target.value }))}
                  placeholder="e.g. 10mg/day, 250mcg EOD"
                  required
                  className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                />
              </div>

              {/* Route */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  Route
                </label>
                <select
                  value={form.route}
                  onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))}
                  className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                >
                  {ROUTES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Start date */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  Source / Vendor{" "}
                  <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                  placeholder="e.g. Peptide Sciences, batch #42"
                  className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                />
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-secondary)", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  Notes{" "}
                  <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Protocol notes, observations, cycle info..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-sm border text-sm outline-none resize-none"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                />
              </div>
            </div>

            {formError && (
              <p className="mt-3 text-sm" style={{ color: "#c07070", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                {formError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-sm text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ background: "var(--accent)", color: "#ffffff", fontFamily: "'Montserrat', system-ui, sans-serif" }}
              >
                {submitting ? "Saving..." : "Save Protocol"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="px-5 py-2.5 rounded-sm text-sm border"
                style={{ background: "transparent", color: "var(--text-secondary)", borderColor: "var(--border)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p style={{ color: "var(--text-muted)", fontFamily: "'Montserrat', system-ui, sans-serif", fontSize: "13px" }}>
            Loading...
          </p>
        ) : (
          <>
            {/* Active protocols */}
            <div
              className="p-6 rounded-sm border mb-6"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-5"
                style={{ color: "var(--text-muted)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
              >
                Active ({active.length})
              </p>

              {active.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  No active protocols.
                </p>
              ) : (
                <div className="space-y-3">
                  {active.map((entry) => (
                    <ProtocolRow
                      key={entry.id}
                      entry={entry}
                      onToggle={() => handleToggleActive(entry)}
                      onDelete={() => handleDelete(entry.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Inactive / history */}
            {inactive.length > 0 && (
              <div
                className="p-6 rounded-sm border"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--card)" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-5"
                  style={{ color: "var(--text-muted)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
                >
                  History ({inactive.length})
                </p>
                <div className="space-y-3">
                  {inactive.map((entry) => (
                    <ProtocolRow
                      key={entry.id}
                      entry={entry}
                      onToggle={() => handleToggleActive(entry)}
                      onDelete={() => handleDelete(entry.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function ProtocolRow({
  entry,
  onToggle,
  onDelete,
}: {
  entry: ProtocolEntry;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0"
      style={{ borderColor: "var(--card)", opacity: entry.active ? 1 : 0.5 }}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <ProtocolPill
          compound={entry.compound}
          dose={entry.dose}
          category={entry.category}
          active={entry.active}
        />
        <div className="min-w-0">
          <p style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
            {entry.category} · {entry.route} · started{" "}
            {new Date(entry.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {entry.source && (
            <p style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
              {entry.source}
            </p>
          )}
          {entry.notes && (
            <p
              className="mt-1 text-xs truncate max-w-xs"
              style={{ color: "var(--text-muted)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
            >
              {entry.notes}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggle}
          className="text-xs px-2 py-1 rounded-sm transition-opacity hover:opacity-70"
          style={{
            background: entry.active ? "var(--accent-bg)" : "var(--border)",
            color: entry.active ? "var(--accent)" : "var(--text-muted)",
            fontFamily: "'Montserrat', system-ui, sans-serif",
          }}
        >
          {entry.active ? "Active" : "Inactive"}
        </button>
        <button
          onClick={onDelete}
          className="text-xs px-2 py-1 rounded-sm transition-opacity hover:opacity-70"
          style={{ background: "var(--worse-bg)", color: "var(--text-muted)", fontFamily: "'Montserrat', system-ui, sans-serif" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
