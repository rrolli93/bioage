/**
 * PhenoAge Biological Age Calculator
 *
 * Implements the Levine et al. 2018 PhenoAge formula exactly.
 *
 * Reference:
 *   Levine ME, Lu AT, Quach A, et al.
 *   "An epigenetic biomarker of aging for lifespan and healthspan."
 *   Aging (Albany NY). 2018;10(4):573-591.
 *   doi:10.18632/aging.101414
 *
 * This is a pure function with zero runtime dependencies.
 * It is the core open-source contribution of the BioAge project.
 */

export interface PhenoAgeInputs {
  /** Albumin in g/dL (normal: 3.5–5.0) */
  albumin: number;
  /** Creatinine in mg/dL (normal: 0.6–1.2) */
  creatinine: number;
  /** Glucose in mg/dL (normal: 70–99 fasting) */
  glucose: number;
  /** C-reactive protein in mg/L (normal: <3.0) */
  crp: number;
  /** Lymphocyte percentage (normal: 20–40%) */
  lymphocytePct: number;
  /** Mean corpuscular volume in fL (normal: 80–100) */
  mcv: number;
  /** Red cell distribution width in % (normal: 11.5–14.5) */
  rdw: number;
  /** Alkaline phosphatase in U/L (normal: 44–147) */
  alp: number;
  /** White blood cell count in 10^3/uL (normal: 4.5–11.0) */
  wbc: number;
  /** Chronological age in years */
  chronologicalAge: number;
}

export interface PhenoAgeResult {
  /** Computed PhenoAge biological age in years */
  phenoAge: number;
  /** Delta: biological age minus chronological age (negative = younger) */
  delta: number;
  /** Intermediate: linear combination xb */
  xb: number;
  /** Intermediate: mortality score */
  mortalityScore: number;
}

/**
 * Compute PhenoAge from standard blood panel markers.
 *
 * The three-step formula:
 *   1. Linear combination (xb) of all markers
 *   2. Mortality score from xb via a Gompertz-like survival function
 *   3. PhenoAge back-calculated from mortality score
 *
 * @param inputs - The 9 blood markers + chronological age
 * @returns PhenoAgeResult with biological age and intermediates
 */
export function computePhenoAge(inputs: PhenoAgeInputs): PhenoAgeResult {
  const {
    albumin,
    creatinine,
    glucose,
    crp,
    lymphocytePct,
    mcv,
    rdw,
    alp,
    wbc,
    chronologicalAge,
  } = inputs;

  // ─── Step 1: Linear combination ──────────────────────────────────────────
  // Coefficients from Table 2 of Levine et al. 2018
  // Note: glucose coefficient applies to log-transformed glucose (mg/dL)
  // Note: CRP coefficient applies to log(CRP + 0.001) to handle zero values
  const xb =
    -19.9067 +
    -0.0336 * albumin +
    0.0095 * creatinine +
    0.1953 * Math.log(glucose) + // log-transformed glucose (mg/dL)
    0.0954 * Math.log(crp + 0.001) + // CRP in mg/L, offset to avoid log(0)
    -0.012 * lymphocytePct +
    0.0268 * mcv +
    0.3306 * rdw +
    0.00188 * alp +
    0.0554 * wbc +
    0.0804 * chronologicalAge;

  // ─── Step 2: Mortality score ──────────────────────────────────────────────
  // Derived from a Gompertz proportional hazards model
  // γ = 0.0076927 (Gompertz shape parameter from the paper)
  const gamma = 0.0076927;
  const mortalityScore =
    1 - Math.exp((-Math.exp(xb) * (Math.exp(120 * gamma) - 1)) / gamma);

  // ─── Step 3: PhenoAge ────────────────────────────────────────────────────
  // Back-calculated from mortality score using inverse of survival function
  // Constants 141.50225 and 0.090165 are from the paper's calibration
  const phenoAge =
    141.50225 + Math.log(-0.00553 * Math.log(1 - mortalityScore)) / 0.090165;

  const delta = phenoAge - chronologicalAge;

  return {
    phenoAge,
    delta,
    xb,
    mortalityScore,
  };
}
