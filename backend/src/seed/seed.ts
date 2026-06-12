import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from '../models/Team';
import Player from '../models/Player';
import Match from '../models/Match';
import Standing from '../models/Standing';
import News from '../models/News';
import connectDB from '../config/db';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Team.deleteMany();
    await Player.deleteMany();
    await Match.deleteMany();
    await Standing.deleteMany();
    await News.deleteMany();

    console.log('Cleared existing data.');

    // 1. Create Teams
    const teamsData = [
      { name: 'Brazil', code: 'BRA', logo: 'https://flagcdn.com/w320/br.png', group: 'G', coach: 'Dorival Júnior' },
      { name: 'Argentina', code: 'ARG', logo: 'https://flagcdn.com/w320/ar.png', group: 'C', coach: 'Lionel Scaloni' },
      { name: 'France', code: 'FRA', logo: 'https://flagcdn.com/w320/fr.png', group: 'D', coach: 'Didier Deschamps' },
      { name: 'Germany', code: 'GER', logo: 'https://flagcdn.com/w320/de.png', group: 'E', coach: 'Julian Nagelsmann' },
      { name: 'Spain', code: 'ESP', logo: 'https://flagcdn.com/w320/es.png', group: 'E', coach: 'Luis de la Fuente' },
      { name: 'Portugal', code: 'POR', logo: 'https://flagcdn.com/w320/pt.png', group: 'H', coach: 'Roberto Martínez' },
      { name: 'England', code: 'ENG', logo: 'https://flagcdn.com/w320/gb-eng.png', group: 'B', coach: 'Gareth Southgate' },
      { name: 'Netherlands', code: 'NED', logo: 'https://flagcdn.com/w320/nl.png', group: 'A', coach: 'Ronald Koeman' },
      // Adding a few more for group standings
      { name: 'Senegal', code: 'SEN', logo: 'https://flagcdn.com/w320/sn.png', group: 'A', coach: 'Aliou Cissé' },
      { name: 'Ecuador', code: 'ECU', logo: 'https://flagcdn.com/w320/ec.png', group: 'A', coach: 'Félix Sánchez' },
      { name: 'Qatar', code: 'QAT', logo: 'https://flagcdn.com/w320/qa.png', group: 'A', coach: 'Tintín Márquez' },
    ];

    const createdTeams = await Team.insertMany(teamsData);
    console.log('Teams seeded.');

    // Helper to get team ID
    const getTeamId = (code: string) => createdTeams.find(t => t.code === code)?._id;

    // 2. Create Players (Top Scorers mock)
    const playersData = [
      { name: 'Lionel Messi', team: getTeamId('ARG'), position: 'Forward', number: 10, goals: 5 },
      { name: 'Kylian Mbappé', team: getTeamId('FRA'), position: 'Forward', number: 10, goals: 6 },
      { name: 'Vinícius Júnior', team: getTeamId('BRA'), position: 'Forward', number: 7, goals: 3 },
      { name: 'Jude Bellingham', team: getTeamId('ENG'), position: 'Midfielder', number: 10, goals: 4 },
      { name: 'Cristiano Ronaldo', team: getTeamId('POR'), position: 'Forward', number: 7, goals: 3 },
    ];
    await Player.insertMany(playersData);
    console.log('Players seeded.');

    // 3. Create Matches
    const matchesData = [
      // LIVE MATCH
      {
        homeTeam: getTeamId('BRA'),
        awayTeam: getTeamId('ARG'),
        homeScore: 2,
        awayScore: 1,
        status: 'LIVE',
        time: '65\'',
        date: new Date(),
        group: 'Knockout',
      },
      // UPCOMING MATCH
      {
        homeTeam: getTeamId('FRA'),
        awayTeam: getTeamId('GER'),
        homeScore: 0,
        awayScore: 0,
        status: 'NS',
        time: '',
        date: new Date(Date.now() + 86400000), // Tomorrow
        group: 'Knockout',
      },
      // FINISHED MATCH
      {
        homeTeam: getTeamId('ESP'),
        awayTeam: getTeamId('POR'),
        homeScore: 3,
        awayScore: 2,
        status: 'FT',
        time: 'FT',
        date: new Date(Date.now() - 86400000), // Yesterday
        group: 'Knockout',
      },
    ];
    await Match.insertMany(matchesData);
    console.log('Matches seeded.');

    // 4. Create Standings (Group A mock)
    const standingsData = [
      { team: getTeamId('NED'), group: 'A', played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 1, points: 7 },
      { team: getTeamId('SEN'), group: 'A', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, points: 6 },
      { team: getTeamId('ECU'), group: 'A', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, points: 4 },
      { team: getTeamId('QAT'), group: 'A', played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 6, points: 0 },
    ];
    await Standing.insertMany(standingsData);
    console.log('Standings seeded.');

    // 5. Create News
    const newsData = [
      {
        title: 'World Cup 2026 Kicks Off!',
        summary: 'The biggest tournament in the world begins with a spectacular opening ceremony.',
        content: 'Full details of the opening ceremony...',
        imageUrl: 'https://images.unsplash.com/photo-1518605368461-1ee71161dbce?w=800',
        author: 'GoalZone Admin',
      },
      {
        title: 'Mbappé shines in opening match',
        summary: 'France secured a comfortable victory with two goals from their star forward.',
        content: 'Match analysis and reactions...',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        author: 'Football Expert',
      }
    ];
    await News.insertMany(newsData);
    console.log('News seeded.');

    console.log('Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
