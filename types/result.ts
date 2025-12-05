export interface Result {
  id?: string;          // mapped from MongoDB _id
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  date: string;        // ISO date string
}