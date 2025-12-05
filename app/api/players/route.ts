import { connect } from '@/lib/db';
import PlayerStat from '@/models/Player';

export async function GET() {
  await connect();
  const players = await PlayerStat.find({});
  return new Response(JSON.stringify(players), { status: 200 });
}

export async function POST(req: Request) {
  await connect();
  const data = await req.json();
  const player = await PlayerStat.create(data);
  return new Response(JSON.stringify(player), { status: 201 });
}
