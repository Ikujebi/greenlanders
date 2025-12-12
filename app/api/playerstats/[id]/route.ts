import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  await connect();

  const { id } = await context.params; // <-- unwrap params
  const { stat } = await req.json();

  const increments: Record<string, number> = {
    goals: stat === "goals" ? 1 : 0,
    assists: stat === "assists" ? 1 : 0,
    yellowCards: stat === "yellow" ? 1 : 0,
    redCards: stat === "red" ? 1 : 0,
  };

  try {
    const updated = await PlayerStat.findByIdAndUpdate(
      id,
      { $inc: increments },
      { new: true }
    ).populate("teamId");

    if (!updated) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}
