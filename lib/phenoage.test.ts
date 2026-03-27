/**
 * Quick sanity-check for the PhenoAge formula.
 * Run with: npx tsx lib/phenoage.test.ts
 *
 * Expected: a healthy 45-year-old with optimal markers should score
 * roughly 36–42 years (bio age younger than chrono age).
 */

import { computePhenoAge } from "./phenoage";

const cases = [
  {
    label: "Healthy 45-yr-old (optimal markers)",
    inputs: {
      albumin: 4.5,
      creatinine: 0.85,
      glucose: 88,
      crp: 0.4,
      lymphocytePct: 33,
      mcv: 88,
      rdw: 12.5,
      alp: 60,
      wbc: 5.0,
      chronologicalAge: 45,
    },
    expectDeltaNegative: true,
  },
  {
    label: "Average 45-yr-old (population norm values)",
    inputs: {
      albumin: 4.15,
      creatinine: 0.95,
      glucose: 97.5,
      crp: 1.5,
      lymphocytePct: 28,
      mcv: 89,
      rdw: 13.0,
      alp: 72,
      wbc: 6.5,
      chronologicalAge: 45,
    },
    expectDeltaNegative: false, // should be close to 0
  },
  {
    label: "Poor markers 60-yr-old",
    inputs: {
      albumin: 3.6,
      creatinine: 1.15,
      glucose: 118,
      crp: 4.5,
      lymphocytePct: 18,
      mcv: 95,
      rdw: 14.8,
      alp: 130,
      wbc: 9.5,
      chronologicalAge: 60,
    },
    expectDeltaNegative: false, // should be older than chrono
  },
];

let allPassed = true;

for (const tc of cases) {
  const result = computePhenoAge(tc.inputs);
  const pass = tc.expectDeltaNegative
    ? result.delta < 0
    : true; // just display for average case

  console.log(`\n${tc.label}`);
  console.log(`  PhenoAge:   ${result.phenoAge.toFixed(2)}`);
  console.log(`  ChronoAge:  ${tc.inputs.chronologicalAge}`);
  console.log(`  Delta:      ${result.delta >= 0 ? "+" : ""}${result.delta.toFixed(2)}`);
  console.log(`  Mortality:  ${(result.mortalityScore * 100).toFixed(2)}%`);
  if (tc.expectDeltaNegative) {
    console.log(`  Check delta < 0: ${pass ? "PASS ✓" : "FAIL ✗"}`);
    if (!pass) allPassed = false;
  }
}

console.log(`\n${allPassed ? "All checks passed ✓" : "Some checks FAILED ✗"}`);
