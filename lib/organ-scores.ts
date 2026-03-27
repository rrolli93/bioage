/**
 * Organ sub-score calculations for BioAge.
 *
 * Each organ system's age is derived from a weighted average of z-score
 * deltas for the relevant markers, then converted to an implied biological
 * age for that system.
 *
 * Math:
 *   1. Compute z-score for each marker vs age-adjusted population norm
 *   2. Take weighted average of z-scores for the organ system
 *   3. Convert composite z-score to age delta (years vs chronological)
 *   4. Organ age = chronologicalAge + ageDelta
 */

import { PhenoAgeInputs } from "./phenoage";
import { markerZScore, zScoreToAgeDelta } from "./population-norms";

export interface OrganScores {
  /** Metabolic system age (glucose, albumin, creatinine) */
  metabolicAge: number;
  /** Immune system age (lymphocyte %, WBC) */
  immuneAge: number;
  /** Inflammatory age (CRP, RDW) */
  inflammatoryAge: number;
  /** Hematological age (MCV, RDW) */
  hematologicalAge: number;
}

/**
 * Compute organ sub-scores from blood panel inputs.
 *
 * @param inputs - Full PhenoAge blood panel
 * @returns OrganScores with implied age for each system
 */
export function computeOrganScores(inputs: PhenoAgeInputs): OrganScores {
  const age = inputs.chronologicalAge;

  // ─── Metabolic age ────────────────────────────────────────────────────
  // Markers: albumin (weight 0.4), creatinine (weight 0.3), glucose (weight 0.3)
  // Lower albumin, higher creatinine/glucose → metabolically older
  const zAlbumin = markerZScore("albumin", inputs.albumin, age);
  const zCreatinine = markerZScore("creatinine", inputs.creatinine, age);
  const zGlucose = markerZScore("glucose", inputs.glucose, age);

  const metabolicZComposite =
    0.4 * zAlbumin * -1 + // albumin: low → older, invert
    0.3 * zCreatinine +
    0.3 * zGlucose;

  // Convert composite z to age delta: 1 SD composite ≈ 6 years (calibrated)
  const metabolicDelta = metabolicZComposite * 6;
  const metabolicAge = clampAge(age + metabolicDelta);

  // ─── Immune age ───────────────────────────────────────────────────────
  // Markers: lymphocyte % (weight 0.6), WBC (weight 0.4)
  const zLymphocyte = markerZScore("lymphocytePct", inputs.lymphocytePct, age);
  const zWbc = markerZScore("wbc", inputs.wbc, age);

  // Low lymphocytes → older; high WBC → older
  const immuneZComposite = 0.6 * zLymphocyte * -1 + 0.4 * zWbc;
  const immuneDelta = immuneZComposite * 6;
  const immuneAge = clampAge(age + immuneDelta);

  // ─── Inflammatory age ─────────────────────────────────────────────────
  // Markers: CRP (weight 0.6), RDW (weight 0.4)
  // Both: higher → older
  const zCrp = markerZScore("crp", inputs.crp, age);
  const zRdwInflam = markerZScore("rdw", inputs.rdw, age);

  const inflammatoryZComposite = 0.6 * zCrp + 0.4 * zRdwInflam;
  const inflammatoryDelta = inflammatoryZComposite * 6;
  const inflammatoryAge = clampAge(age + inflammatoryDelta);

  // ─── Hematological age ────────────────────────────────────────────────
  // Markers: MCV (weight 0.5), RDW (weight 0.5)
  const zMcv = markerZScore("mcv", inputs.mcv, age);
  const zRdwHemat = markerZScore("rdw", inputs.rdw, age);

  const hematologicalZComposite = 0.5 * zMcv + 0.5 * zRdwHemat;
  const hematologicalDelta = hematologicalZComposite * 6;
  const hematologicalAge = clampAge(age + hematologicalDelta);

  return {
    metabolicAge,
    immuneAge,
    inflammatoryAge,
    hematologicalAge,
  };
}

/** Clamp age to a reasonable physiological range */
function clampAge(age: number): number {
  return Math.max(10, Math.min(120, age));
}
