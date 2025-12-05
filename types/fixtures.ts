export interface Fixture {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  date?: string;
  status: 'pending' | 'played';
}