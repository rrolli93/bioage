import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all protocol entries (active first, then by startDate desc)
export async function GET() {
  try {
    const entries = await prisma.protocolEntry.findMany({
      orderBy: [{ active: "desc" }, { startDate: "desc" }],
    });
    return NextResponse.json(entries);
  } catch (err) {
    console.error("[/api/protocol GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new protocol entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, category, compound, dose, route, source, notes, active } = body;

    if (!startDate || !category || !compound || !dose || !route) {
      return NextResponse.json(
        { error: "Missing required fields: startDate, category, compound, dose, route" },
        { status: 400 }
      );
    }

    const entry = await prisma.protocolEntry.create({
      data: {
        startDate: new Date(startDate),
        category,
        compound,
        dose,
        route,
        source: source || null,
        notes: notes || null,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error("[/api/protocol POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update active status or fields
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updated = await prisma.protocolEntry.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[/api/protocol PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a protocol entry
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.protocolEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/protocol DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
