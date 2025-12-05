import { connect } from '@/lib/db';
import Result from '@/models/Result';

// ✅ GET ALL RESULTS
export async function GET() {
  await connect();

  const results = await Result.find().lean();

  const cleanedResults = results.map((r) => ({
    id: r._id.toString(),
    homeTeam: r.homeTeam,
    awayTeam: r.awayTeam,
    homeGoals: r.homeGoals,
    awayGoals: r.awayGoals,
    date: r.date,
  }));

  return new Response(JSON.stringify(cleanedResults), { status: 200 });
}

// ✅ CREATE RESULT (✅ NO create(), ✅ NO array, ✅ NO toObject)
export async function POST(req: Request) {
  await connect();
  const data = await req.json();

  const doc = new Result(data);   // ✅ always ONE document
  const saved = await doc.save(); // ✅ always ONE document

  const cleanedResult = {
    id: saved._id.toString(),
    homeTeam: saved.homeTeam,
    awayTeam: saved.awayTeam,
    homeGoals: saved.homeGoals,
    awayGoals: saved.awayGoals,
    date: saved.date,
  };

  return new Response(JSON.stringify(cleanedResult), { status: 201 });
}
