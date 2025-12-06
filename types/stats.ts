export interface Player {
  id: string;
  name: string;
  picture?: string;
  teamId: {
    id: string;
    name: string;
  };
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}
