

export const mockStandings: any[] = [
  // Group A
  {
    _id: 'm1',
    group: 'A',
    team: { _id: 't1', name: 'Mexico', code: 'MEX', logo: 'https://media.api-sports.io/football/teams/16.png', group: 'A' },
    played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, points: 3
  },
  {
    _id: 'm2',
    group: 'A',
    team: { _id: 't2', name: 'South Korea', code: 'KOR', logo: 'https://media.api-sports.io/football/teams/17.png', group: 'A' },
    played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, points: 3
  },
  {
    _id: 'm3',
    group: 'A',
    team: { _id: 't3', name: 'Czechia', code: 'CZE', logo: 'https://media.api-sports.io/football/teams/1091.png', group: 'A' },
    played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 2, points: 0
  },
  {
    _id: 'm4',
    group: 'A',
    team: { _id: 't4', name: 'South Africa', code: 'RSA', logo: 'https://media.api-sports.io/football/teams/18.png', group: 'A' },
    played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 0, goalsAgainst: 2, points: 0
  },
  // Group B
  {
    _id: 'm5',
    group: 'B',
    team: { _id: 't5', name: 'Canada', code: 'CAN', logo: 'https://media.api-sports.io/football/teams/5529.png', group: 'B' },
    played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0
  },
  {
    _id: 'm6',
    group: 'B',
    team: { _id: 't6', name: 'Bosnia-Herzegovina', code: 'BIH', logo: 'https://media.api-sports.io/football/teams/11.png', group: 'B' },
    played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0
  },
  {
    _id: 'm7',
    group: 'B',
    team: { _id: 't7', name: 'Qatar', code: 'QAT', logo: 'https://media.api-sports.io/football/teams/15.png', group: 'B' },
    played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0
  },
  {
    _id: 'm8',
    group: 'B',
    team: { _id: 't8', name: 'Switzerland', code: 'SUI', logo: 'https://media.api-sports.io/football/teams/1500.png', group: 'B' },
    played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0
  }
];

export const mockMatches: any[] = [
  {
    _id: 'match1',
    homeTeam: { _id: 't1', name: 'Mexico', code: 'MEX', logo: 'https://media.api-sports.io/football/teams/16.png', group: 'A' },
    awayTeam: { _id: 't4', name: 'South Africa', code: 'RSA', logo: 'https://media.api-sports.io/football/teams/18.png', group: 'A' },
    date: new Date().toISOString(),
    time: '65\'',
    group: 'FIFA World Cup - Group A',
    homeScore: 2,
    awayScore: 0,
    status: 'LIVE'
  },
  {
    _id: 'match2',
    homeTeam: { _id: 't2', name: 'Korea Republic', code: 'KOR', logo: 'https://media.api-sports.io/football/teams/17.png', group: 'A' },
    awayTeam: { _id: 't3', name: 'Czechia', code: 'CZE', logo: 'https://media.api-sports.io/football/teams/1091.png', group: 'A' },
    date: new Date().toISOString(),
    time: 'FT',
    group: 'FIFA World Cup - Group A',
    homeScore: 2,
    awayScore: 1,
    status: 'FT'
  }
];

export const mockHomeLineup = [
  { id: 'p1', name: 'Rangel', number: 1, position: 'GK', gridArea: '50%,88%' },
  { id: 'p2', name: 'Gallardo', number: 23, position: 'DEF', gridArea: '20%,70%' },
  { id: 'p3', name: 'Vásquez', number: 5, position: 'DEF', gridArea: '40%,70%' },
  { id: 'p4', name: 'Montes', number: 3, position: 'DEF', gridArea: '60%,70%' },
  { id: 'p5', name: 'Reyes', number: 15, position: 'DEF', gridArea: '80%,70%' },
  { id: 'p6', name: 'Lira', number: 6, position: 'MID', gridArea: '50%,55%' },
  { id: 'p7', name: 'Quinones', number: 16, position: 'MID', gridArea: '25%,40%' },
  { id: 'p8', name: 'Fidalgo', number: 8, position: 'MID', gridArea: '42%,40%' },
  { id: 'p9', name: 'Gutierrez', number: 26, position: 'MID', gridArea: '58%,40%' },
  { id: 'p10', name: 'Alvarado', number: 25, position: 'MID', gridArea: '75%,40%' },
  { id: 'p11', name: 'Jiménez', number: 9, position: 'FWD', gridArea: '50%,22%' },
] as any;

export const mockAwayLineup = [
  { id: 'p1', name: 'Williams', number: 1, position: 'GK', gridArea: '50%,88%' },
  { id: 'p2', name: 'Modiba', number: 6, position: 'DEF', gridArea: '20%,70%' },
  { id: 'p3', name: 'Mvala', number: 14, position: 'DEF', gridArea: '40%,70%' },
  { id: 'p4', name: 'Xulu', number: 5, position: 'DEF', gridArea: '60%,70%' },
  { id: 'p5', name: 'Mudau', number: 20, position: 'DEF', gridArea: '80%,70%' },
  { id: 'p6', name: 'Sithole', number: 4, position: 'MID', gridArea: '40%,55%' },
  { id: 'p7', name: 'Mokoena', number: 13, position: 'MID', gridArea: '60%,55%' },
  { id: 'p8', name: 'Tau', number: 10, position: 'FWD', gridArea: '25%,35%' },
  { id: 'p9', name: 'Zwane', number: 11, position: 'FWD', gridArea: '50%,35%' },
  { id: 'p10', name: 'Mayambela', number: 21, position: 'FWD', gridArea: '75%,35%' },
  { id: 'p11', name: 'Makgopa', number: 9, position: 'FWD', gridArea: '50%,20%' },
] as any;
