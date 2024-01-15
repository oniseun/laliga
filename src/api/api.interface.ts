export interface StandingsApi {
  rank: number;
  teamId: number;
  teamName: string;
  win: number;
  draw: number;
  goalFor: number;
  goalAgainst: number;
  goalDifference: number;
  points: number;
}

export interface NewsApi {
  url: string;
  title: string;
  newsImage: string;
  shortDesc: string;
}
