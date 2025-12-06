import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";

export async function PATCH(req: Request, { params }: any) {
  await connect();
  const { id } = params;
  const { stat } = await req.json();

  const increments: any = {
    goals: stat === "goals" ? 1 : 0,
    assists: stat === "assists" ? 1 : 0,
    yellowCards: stat === "yellow" ? 1 : 0,
    redCards: stat === "red" ? 1 : 0,
  };

  const updated = await PlayerStat.findByIdAndUpdate(
    id,
    { $inc: increments },
    { new: true }
  ).populate("teamId");

  return Response.json(updated);
}
