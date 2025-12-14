import { connect } from '@/lib/db';
import Fixture from '@/models/Fixture';
import Result from '@/models/Result';

/* GET all fixtures */
export async function GET() {
  await connect();
  const fixtures = await Fixture.find({});
  return new Response(JSON.stringify(fixtures), { status: 200 });
}

/* POST normal fixtures */
export async function POST(req: Request) {
  await connect();
  const data = await req.json();

  if (!Array.isArray(data)) {
    return new Response(
      JSON.stringify({ error: 'Expected an array of fixtures' }),
      { status: 400 }
    );
  }

  const created = await Fixture.insertMany(data);
  return new Response(JSON.stringify(created), { status: 201 });
}

/* DELETE single fixture */
export async function DELETE(req: Request) {
  await connect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      status: 400,
    });
  }

  await Fixture.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: 'Fixture deleted' }), {
    status: 200,
  });
}

/* PUT — Generate Final + Third Place */
export async function PUT() {
  await connect();

  // 1. Build table from results
  const results = await Result.find({});

  const table: Record<string, any> = {};

  for (const match of results) {
    const { homeTeam, awayTeam, homeGoals, awayGoals } = match;

    for (const team of [homeTeam, awayTeam]) {
      if (!table[team]) {
        table[team] = {
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      }
    }

    table[homeTeam].played++;
    table[awayTeam].played++;

    table[homeTeam].goalsFor += homeGoals;
    table[homeTeam].goalsAgainst += awayGoals;

    table[awayTeam].goalsFor += awayGoals;
    table[awayTeam].goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      table[homeTeam].wins++;
      table[homeTeam].points += 3;
      table[awayTeam].losses++;
    } else if (awayGoals > homeGoals) {
      table[awayTeam].wins++;
      table[awayTeam].points += 3;
      table[homeTeam].losses++;
    } else {
      table[homeTeam].draws++;
      table[awayTeam].draws++;
      table[homeTeam].points++;
      table[awayTeam].points++;
    }

    table[homeTeam].goalDifference =
      table[homeTeam].goalsFor - table[homeTeam].goalsAgainst;

    table[awayTeam].goalDifference =
      table[awayTeam].goalsFor - table[awayTeam].goalsAgainst;
  }

  const sorted = Object.values(table).sort(
    (a: any, b: any) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor
  );

  if (sorted.length < 4) {
    return new Response(
      JSON.stringify({ error: 'Not enough teams for finals' }),
      { status: 400 }
    );
  }

  // 2. Delete existing fixtures
  await Fixture.deleteMany({});

  // 3. Create final fixtures
  const newFixtures = [
    {
      round: 4,
      home: sorted[0].team,
      away: sorted[1].team,
    },
    {
      round: 4,
      home: sorted[2].team,
      away: sorted[3].team,
    },
  ];

  const created = await Fixture.insertMany(newFixtures);

  return new Response(
    JSON.stringify({
      message: 'Final fixtures generated',
      fixtures: created,
    }),
    { status: 200 }
  );
}
