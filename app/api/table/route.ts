import { connect } from '@/lib/db';
import Result from '@/models/Result';

export async function GET() {
  await connect();

  const results = await Result.find({});

  const table: Record<string, {
    team: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }> = {};

  for (const match of results) {
    const { homeTeam, awayTeam, homeGoals, awayGoals } = match;

    if (!table[homeTeam]) {
      table[homeTeam] = {
        team: homeTeam,
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

    if (!table[awayTeam]) {
      table[awayTeam] = {
        team: awayTeam,
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

    // Played
    table[homeTeam].played += 1;
    table[awayTeam].played += 1;

    // Goals
    table[homeTeam].goalsFor += homeGoals;
    table[homeTeam].goalsAgainst += awayGoals;

    table[awayTeam].goalsFor += awayGoals;
    table[awayTeam].goalsAgainst += homeGoals;

    // Result
    if (homeGoals > awayGoals) {
      table[homeTeam].wins += 1;
      table[homeTeam].points += 3;
      table[awayTeam].losses += 1;
    } else if (awayGoals > homeGoals) {
      table[awayTeam].wins += 1;
      table[awayTeam].points += 3;
      table[homeTeam].losses += 1;
    } else {
      table[homeTeam].draws += 1;
      table[awayTeam].draws += 1;
      table[homeTeam].points += 1;
      table[awayTeam].points += 1;
    }

    // Goal Difference
    table[homeTeam].goalDifference =
      table[homeTeam].goalsFor - table[homeTeam].goalsAgainst;

    table[awayTeam].goalDifference =
      table[awayTeam].goalsFor - table[awayTeam].goalsAgainst;
  }

  const sortedTable = Object.values(table).sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor
  );

  return new Response(JSON.stringify(sortedTable), { status: 200 });
}
