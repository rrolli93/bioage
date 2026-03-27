import { NextRequest, NextResponse } from "next/server";
import { computePhenoAge, PhenoAgeInputs } from "@/lib/phenoage";
import { computeOrganScores } from "@/lib/organ-scores";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const required: (keyof PhenoAgeInputs)[] = [
      "albumin",
      "creatinine",
      "glucose",
      "crp",
      "lymphocytePct",
      "mcv",
      "rdw",
      "alp",
      "wbc",
      "chronologicalAge",
    ];

    for (const field of required) {
      if (body[field] === undefined || body[field] === null || isNaN(Number(body[field]))) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    const inputs: PhenoAgeInputs = {
      albumin: Number(body.albumin),
      creatinine: Number(body.creatinine),
      glucose: Number(body.glucose),
      crp: Number(body.crp),
      lymphocytePct: Number(body.lymphocytePct),
      mcv: Number(body.mcv),
      rdw: Number(body.rdw),
      alp: Number(body.alp),
      wbc: Number(body.wbc),
      chronologicalAge: Number(body.chronologicalAge),
    };

    const result = computePhenoAge(inputs);
    const organScores = computeOrganScores(inputs);

    // Persist to database
    const entry = await prisma.bioAgeEntry.create({
      data: {
        date: new Date(),
        chronoAge: inputs.chronologicalAge,
        phenoAge: result.phenoAge,
        delta: result.delta,
        metabolicAge: organScores.metabolicAge,
        immuneAge: organScores.immuneAge,
        inflammatoryAge: organScores.inflammatoryAge,
        hematologicalAge: organScores.hematologicalAge,
        rawInputs: inputs as unknown as Record<string, number>,
      },
    });

    return NextResponse.json({
      id: entry.id,
      phenoAge: result.phenoAge,
      delta: result.delta,
      chronologicalAge: inputs.chronologicalAge,
      organScores,
      mortalityScore: result.mortalityScore,
    });
  } catch (err) {
    console.error("[/api/calculate]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
