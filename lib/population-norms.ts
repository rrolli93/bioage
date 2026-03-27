/**
 * Population norms for organ sub-score calculations.
 *
 * Reference values derived from NHANES data used in the Levine 2018 paper
 * and subsequent analyses. These are approximate midpoints and standard
 * deviations for healthy adults in the 20–80 age range.
 *
 * For sub-scores we model a linear age-dependency:
 *   expected_value(age) = intercept + slope * age
 *   z_score = (observed - expected) / sd
 *   implied_age = (observed - intercept) / slope  [if slope != 0]
 */

export interface MarkerNorm {
  /** Reference mean for a typical ~50yr old */
  meanAt50: number;
  /** Standard deviation */
  sd: number;
  /**
   * Change per year of age (slope).
   * Positive = marker increases with age, negative = decreases.
   */
  slopePerYear: number;
  /**
   * Direction: if marker is higher than expected, does it imply older or younger?
   * +1 = higher value → higher implied age (e.g. glucose, CRP, RDW)
   * -1 = higher value → lower implied age (e.g. albumin, lymphocytes)
   */
  ageDirection: 1 | -1;
}

/**
 * Population norms per marker.
 * Source: NHANES III / Levine 2018 supplementary data (approximated).
 */
export const POPULATION_NORMS: Record<string, MarkerNorm> = {
  // ── Metabolic markers ──────────────────────────────────────────────────
  albumin: {
    meanAt50: 4.15,
    sd: 0.35,
    slopePerYear: -0.008, // albumin declines ~0.8g/dL per decade
    ageDirection: -1, // low albumin → older
  },
  creatinine: {
    meanAt50: 0.95,
    sd: 0.2,
    slopePerYear: 0.003,
    ageDirection: 1,
  },
  glucose: {
    meanAt50: 95,
    sd: 12,
    slopePerYear: 0.5, // fasting glucose rises ~5mg/dL per decade
    ageDirection: 1,
  },

  // ── Immune markers ─────────────────────────────────────────────────────
  lymphocytePct: {
    meanAt50: 28,
    sd: 7,
    slopePerYear: -0.15, // lymphocytes decline with age (immunosenescence)
    ageDirection: -1,
  },
  wbc: {
    meanAt50: 6.5,
    sd: 1.7,
    slopePerYear: 0.0,
    ageDirection: 1,
  },

  // ── Inflammatory markers ───────────────────────────────────────────────
  crp: {
    meanAt50: 1.5,
    sd: 1.8,
    slopePerYear: 0.05,
    ageDirection: 1,
  },
  rdw: {
    meanAt50: 13.0,
    sd: 0.9,
    slopePerYear: 0.03, // RDW slowly rises with age
    ageDirection: 1,
  },

  // ── Hematological markers ──────────────────────────────────────────────
  mcv: {
    meanAt50: 89,
    sd: 4.5,
    slopePerYear: 0.08, // MCV slightly rises with age
    ageDirection: 1,
  },
  alp: {
    meanAt50: 72,
    sd: 22,
    slopePerYear: 0.2,
    ageDirection: 1,
  },
};

/**
 * Given an observed marker value and chronological age, return a z-score
 * relative to the age-adjusted population norm.
 */
export function markerZScore(
  markerKey: string,
  observed: number,
  chronoAge: number
): number {
  const norm = POPULATION_NORMS[markerKey];
  if (!norm) return 0;

  // Age-adjusted expected value
  const expected = norm.meanAt50 + norm.slopePerYear * (chronoAge - 50);
  return (observed - expected) / norm.sd;
}

/**
 * Convert a z-score to an implied age delta (years older/younger than chrono).
 * Uses the marker's age direction and slope to back-calculate.
 */
export function zScoreToAgeDelta(markerKey: string, zScore: number): number {
  const norm = POPULATION_NORMS[markerKey];
  if (!norm || norm.slopePerYear === 0) {
    // If no slope, use heuristic: each SD unit ≈ 5 years
    return zScore * norm.ageDirection * 5;
  }
  // Δage = z * sd / slopePerYear * direction
  return (zScore * norm.sd * norm.ageDirection) / norm.slopePerYear;
}
