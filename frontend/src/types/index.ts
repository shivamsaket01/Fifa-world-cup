export interface Team {
  _id: string;
  name: string;
  code: string;
  logo: string;
  group: string;
  coach: string;
}

export interface Player {
  _id: string;
  name: string;
  team: Team | string;
  position: string;
  number: number;
  goals: number;
}

export interface Match {
  _id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'NS' | 'LIVE' | 'HT' | 'FT';
  time: string;
  date: string;
  group: string;
}

export interface Standing {
  _id: string;
  team: Team;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
}
