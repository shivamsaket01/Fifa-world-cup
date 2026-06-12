import axios from 'axios';
import Match from '../models/Match';
import Team from '../models/Team';

const API_KEY = process.env.API_FOOTBALL_KEY || '';
const BASE_URL = 'https://v3.football.api-sports.io';

export const syncLiveMatches = async () => {
  if (!API_KEY) {
    console.log('API_FOOTBALL_KEY is missing. Skipping live sync.');
    return;
  }

  try {
    // Fetch live matches (status: in play)
    const response = await axios.get(`${BASE_URL}/fixtures?live=all`, {
      headers: {
        'x-apisports-key': API_KEY
      }
    });

    const liveFixtures = response.data.response || [];
    
    if (liveFixtures.length === 0) {
      console.log('No live matches currently playing on API-Football.');
      return;
    }

    // Try to match API-Football matches to our database matches
    const allMatches = await Match.find({ status: { $ne: 'FT' } }).populate('homeTeam').populate('awayTeam');

    for (const apiMatch of liveFixtures) {
      const apiHomeTeam = apiMatch.teams.home.name;
      const apiAwayTeam = apiMatch.teams.away.name;

      // Find a match in our DB where team names roughly match
      const dbMatch = allMatches.find(m => {
        // @ts-ignore
        const homeMatch = m.homeTeam?.name.toLowerCase().includes(apiHomeTeam.toLowerCase()) || apiHomeTeam.toLowerCase().includes(m.homeTeam?.name.toLowerCase());
        // @ts-ignore
        const awayMatch = m.awayTeam?.name.toLowerCase().includes(apiAwayTeam.toLowerCase()) || apiAwayTeam.toLowerCase().includes(m.awayTeam?.name.toLowerCase());
        
        return homeMatch && awayMatch;
      });

      if (dbMatch) {
        // Update our DB match
        const newHomeScore = apiMatch.goals.home ?? 0;
        const newAwayScore = apiMatch.goals.away ?? 0;
        
        // Map API status to our status ('NS', 'LIVE', 'HT', 'FT')
        const apiStatus = apiMatch.fixture.status.short;
        let newStatus = dbMatch.status;
        
        if (['1H', '2H', 'ET', 'P'].includes(apiStatus)) newStatus = 'LIVE';
        else if (apiStatus === 'HT') newStatus = 'HT';
        else if (apiStatus === 'FT' || apiStatus === 'AET' || apiStatus === 'PEN') newStatus = 'FT';

        let hasChanged = false;
        
        if (dbMatch.homeScore !== newHomeScore || dbMatch.awayScore !== newAwayScore || dbMatch.status !== newStatus) {
          dbMatch.homeScore = newHomeScore;
          dbMatch.awayScore = newAwayScore;
          dbMatch.status = newStatus as any;
          hasChanged = true;
          
          await dbMatch.save();

          // Broadcast the change!
          import('../sockets/socketServer').then(({ getIO }) => {
            try {
              const io = getIO();
              io.emit('match_update', dbMatch);
              console.log(`[Socket] Broadcasted automated update for ${apiHomeTeam} vs ${apiAwayTeam} (${newHomeScore}-${newAwayScore})`);
            } catch (e) {
              console.error('Socket not initialized');
            }
          });

          // Trigger point calculations if match just finished
          if (newStatus === 'FT') {
            await calculatePointsForMatch(dbMatch._id.toString(), newHomeScore, newAwayScore);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to sync live matches from internet:', error);
  }
};

// Helper to calculate points (extracted from adminController)
async function calculatePointsForMatch(matchId: string, homeScore: number, awayScore: number) {
  const Prediction = require('../models/Prediction').default;
  const User = require('../models/User').default;
  
  const predictions = await Prediction.find({ match: matchId, pointsAwarded: null });
  
  for (const pred of predictions) {
    let points = 0;
    
    if (pred.homeScore === homeScore && pred.awayScore === awayScore) {
      points = 3;
    } else {
      const actualDiff = homeScore - awayScore;
      const predictedDiff = pred.homeScore - pred.awayScore;
      
      if ((actualDiff > 0 && predictedDiff > 0) || 
          (actualDiff < 0 && predictedDiff < 0) || 
          (actualDiff === 0 && predictedDiff === 0)) {
        points = 1;
      }
    }

    pred.pointsAwarded = points;
    await pred.save();
    
    if (points > 0) {
      await User.findByIdAndUpdate(pred.user, { $inc: { points: points } });
    }
  }
}

export const syncDailyMatches = async () => {
  if (!API_KEY) {
    console.log('API_FOOTBALL_KEY is missing. Skipping daily sync.');
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const response = await axios.get(`${BASE_URL}/fixtures?date=${today}`, {
      headers: { 'x-apisports-key': API_KEY }
    });

    const fixtures = response.data.response || [];
    const ALLOWED_LEAGUES = [39, 140, 135, 78, 61, 2, 3, 1]; // Top leagues + WC
    
    const filteredFixtures = fixtures.filter((f: any) => ALLOWED_LEAGUES.includes(f.league.id));
    console.log(`Found ${filteredFixtures.length} matches for today in top leagues.`);

    for (const apiMatch of filteredFixtures) {
      // Upsert Home Team
      let homeTeam = await Team.findOne({ name: apiMatch.teams.home.name });
      if (!homeTeam) {
        homeTeam = await Team.create({
          name: apiMatch.teams.home.name,
          logo: apiMatch.teams.home.logo,
          group: apiMatch.league.name.substring(0, 3).toUpperCase()
        });
      }

      // Upsert Away Team
      let awayTeam = await Team.findOne({ name: apiMatch.teams.away.name });
      if (!awayTeam) {
        awayTeam = await Team.create({
          name: apiMatch.teams.away.name,
          logo: apiMatch.teams.away.logo,
          group: apiMatch.league.name.substring(0, 3).toUpperCase()
        });
      }

      // Check if match already exists for today
      const matchDate = new Date(apiMatch.fixture.date);
      // Start of day and end of day to match the date
      const startOfDay = new Date(matchDate);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(matchDate);
      endOfDay.setHours(23,59,59,999);

      let match = await Match.findOne({
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      const apiStatus = apiMatch.fixture.status.short;
      let newStatus = 'NS';
      if (['1H', '2H', 'ET', 'P'].includes(apiStatus)) newStatus = 'LIVE';
      else if (apiStatus === 'HT') newStatus = 'HT';
      else if (apiStatus === 'FT' || apiStatus === 'AET' || apiStatus === 'PEN') newStatus = 'FT';

      if (!match) {
        await Match.create({
          homeTeam: homeTeam._id,
          awayTeam: awayTeam._id,
          date: matchDate,
          time: apiMatch.fixture.status.elapsed ? `${apiMatch.fixture.status.elapsed}'` : '00:00',
          group: apiMatch.league.name,
          homeScore: apiMatch.goals.home ?? 0,
          awayScore: apiMatch.goals.away ?? 0,
          status: newStatus
        });
        console.log(`Created new match: ${homeTeam.name} vs ${awayTeam.name}`);
      } else {
        // Just update status and scores if it exists
        match.homeScore = apiMatch.goals.home ?? 0;
        match.awayScore = apiMatch.goals.away ?? 0;
        match.status = newStatus as any;
        match.time = apiMatch.fixture.status.elapsed ? `${apiMatch.fixture.status.elapsed}'` : match.time;
        await match.save();
      }
    }
  } catch (error) {
    console.error('Failed to sync daily matches:', error);
  }
};
