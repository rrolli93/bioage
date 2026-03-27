import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all BioAge entries (sorted newest first)
export async function GET() {
  try {
    const entries = await prisma.bioAgeEntry.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(entries);
  } catch (err) {
    console.error("[/api/entries GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a specific entry by id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.bioAgeEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/entries DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
