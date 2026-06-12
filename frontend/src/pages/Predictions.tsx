import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bot, Swords, Loader2, Trophy } from 'lucide-react';
import api from '../services/api';
import type { Team, Match } from '../types';
import { useAuth } from '../context/AuthContext';

interface PredictionResult {
  teamA: string;
  teamB: string;
  prediction: {
    homeWinProbability: number;
    awayWinProbability: number;
    drawProbability: number;
    predictedScore: string;
    analysis: string;
  };
}

const Predictions = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'ai' | 'play'>('play');
  const [teamAId, setTeamAId] = useState<string>('');
  const [teamBId, setTeamBId] = useState<string>('');
  const [userPredictions, setUserPredictions] = useState<Record<string, { home: number, away: number }>>({});

  const { data: teams, isLoading: isLoadingTeams } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data;
    },
  });

  const { data: matches } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const response = await api.get('/matches');
      return response.data;
    },
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const response = await api.get('/predictions/leaderboard');
      return response.data;
    },
  });

  const { data: myPredictions } = useQuery({
    queryKey: ['my-predictions'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await api.get('/predictions/me');
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const predictionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/predictions', { teamAId, teamBId });
      return response.data as PredictionResult;
    },
  });

  const submitUserPredictionMutation = useMutation({
    mutationFn: async ({ matchId, homeScore, awayScore }: { matchId: string, homeScore: number, awayScore: number }) => {
      await api.post('/predictions/submit', { matchId, homeScore, awayScore });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-predictions'] });
      alert('Prediction saved successfully!');
    }
  });

  const handlePredict = () => {
    if (teamAId && teamBId && teamAId !== teamBId) {
      predictionMutation.mutate();
    }
  };

  const submitMyPrediction = (matchId: string) => {
    const pred = userPredictions[matchId];
    if (pred && pred.home !== undefined && pred.away !== undefined) {
      submitUserPredictionMutation.mutate({
        matchId,
        homeScore: pred.home,
        awayScore: pred.away
      });
    }
  };

  const getTeamById = (id: string) => teams?.find(t => t._id === id);

  const upcomingMatches = matches?.filter(m => m.status === 'NS') || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Match Predictions</h1>
        
        <div className="inline-flex bg-muted p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('play')}
            className={`px-8 py-3 rounded-lg font-bold transition-colors ${activeTab === 'play' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Play & Predict
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-8 py-3 rounded-lg font-bold transition-colors ${activeTab === 'ai' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            AI Insights
          </button>
        </div>
      </div>

      {activeTab === 'play' && (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Play Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2 mb-4">
              <Swords className="h-6 w-6 text-primary" /> Upcoming Matches
            </h2>
            
            {!isAuthenticated && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                <p className="font-bold text-primary mb-2">Login to play the prediction game!</p>
                <p className="text-sm text-muted-foreground">Guess the scores to earn points and climb the global leaderboard.</p>
              </div>
            )}

            {upcomingMatches.length === 0 ? (
              <p className="text-muted-foreground">No upcoming matches available to predict.</p>
            ) : (
              upcomingMatches.map(match => {
                const existingPred = myPredictions?.find((p: any) => p.match._id === match._id);
                return (
                  <div key={match._id} className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="text-center text-sm font-bold text-muted-foreground mb-4">
                      {new Date(match.date).toLocaleDateString()} • Group {match.group}
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 flex flex-col items-center">
                        <img src={match.homeTeam.logo} alt="" className="w-16 h-16 object-contain mb-2" />
                        <span className="font-bold text-center">{match.homeTeam.name}</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        {isAuthenticated ? (
                          <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border">
                            <input 
                              type="number" 
                              min="0"
                              defaultValue={existingPred?.homeScore}
                              onChange={(e) => setUserPredictions(prev => ({...prev, [match._id]: { ...prev[match._id], home: parseInt(e.target.value) }}))}
                              className="w-12 h-12 text-center text-xl font-black bg-background border rounded"
                            />
                            <span className="font-bold text-muted-foreground">-</span>
                            <input 
                              type="number" 
                              min="0"
                              defaultValue={existingPred?.awayScore}
                              onChange={(e) => setUserPredictions(prev => ({...prev, [match._id]: { ...prev[match._id], away: parseInt(e.target.value) }}))}
                              className="w-12 h-12 text-center text-xl font-black bg-background border rounded"
                            />
                          </div>
                        ) : (
                          <span className="text-2xl font-black text-muted-foreground">VS</span>
                        )}
                        
                        {isAuthenticated && (
                          <button 
                            onClick={() => submitMyPrediction(match._id)}
                            className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded font-bold hover:bg-primary/90 mt-2"
                          >
                            {existingPred ? 'Update' : 'Save'}
                          </button>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col items-center">
                        <img src={match.awayTeam.logo} alt="" className="w-16 h-16 object-contain mb-2" />
                        <span className="font-bold text-center">{match.awayTeam.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Leaderboard Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-black flex items-center gap-2 mb-6">
                <Trophy className="h-6 w-6 text-yellow-500" /> Global Leaderboard
              </h2>
              
              <div className="space-y-4">
                {leaderboard?.map((u: any, index: number) => (
                  <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-amber-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm">{u.name}</p>
                      {u.favoriteTeam && (
                        <p className="text-xs text-muted-foreground truncate">{u.favoriteTeam.name} Fan</p>
                      )}
                    </div>
                    <div className="font-black text-primary">
                      {u.points} <span className="text-xs text-muted-foreground font-normal">pts</span>
                    </div>
                  </div>
                ))}

                {leaderboard?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No points awarded yet.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'ai' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
              
              {/* Team A Selection */}
              <div className="space-y-3 text-center md:text-left">
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider">Home Team</label>
                <select 
                  className="w-full bg-background border-2 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-primary appearance-none"
                  value={teamAId}
                  onChange={(e) => setTeamAId(e.target.value)}
                  disabled={isLoadingTeams}
                >
                  <option value="">Select a team...</option>
                  {teams?.map(team => (
                    <option key={team._id} value={team._id} disabled={team._id === teamBId}>{team.name}</option>
                  ))}
                </select>
                {teamAId && getTeamById(teamAId) && (
                  <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl mt-4">
                    <img src={getTeamById(teamAId)?.logo} alt="" className="w-20 h-20 object-contain mb-3" />
                    <span className="font-bold text-lg">{getTeamById(teamAId)?.name}</span>
                  </div>
                )}
              </div>

              {/* VS Divider */}
              <div className="flex justify-center items-center py-4 md:py-0">
                <div className="bg-muted rounded-full p-4">
                  <Swords className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>

              {/* Team B Selection */}
              <div className="space-y-3 text-center md:text-right">
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider">Away Team</label>
                <select 
                  className="w-full bg-background border-2 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-primary appearance-none text-right"
                  value={teamBId}
                  onChange={(e) => setTeamBId(e.target.value)}
                  disabled={isLoadingTeams}
                >
                  <option value="">Select a team...</option>
                  {teams?.map(team => (
                    <option key={team._id} value={team._id} disabled={team._id === teamAId}>{team.name}</option>
                  ))}
                </select>
                {teamBId && getTeamById(teamBId) && (
                  <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl mt-4">
                    <img src={getTeamById(teamBId)?.logo} alt="" className="w-20 h-20 object-contain mb-3" />
                    <span className="font-bold text-lg">{getTeamById(teamBId)?.name}</span>
                  </div>
                )}
              </div>

            </div>

            <div className="mt-10 flex justify-center">
              <button 
                onClick={handlePredict}
                disabled={!teamAId || !teamBId || predictionMutation.isPending}
                className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                {predictionMutation.isPending ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing data...</>
                ) : (
                  <><Bot className="h-5 w-5" /> Generate Prediction</>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {predictionMutation.isError && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-6 rounded-xl text-center">
              <p className="font-bold">Failed to generate prediction.</p>
              <p className="text-sm mt-1">Please make sure the Gemini API key is configured on the backend.</p>
            </div>
          )}

          {predictionMutation.isSuccess && predictionMutation.data && (
            <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 md:p-10 shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-2xl font-black mb-8 text-center">Prediction Results</h2>
              
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
                {/* Probability Bars */}
                <div className="flex-1 w-full space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>{predictionMutation.data.teamA} Win</span>
                      <span>{predictionMutation.data.prediction.homeWinProbability}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${predictionMutation.data.prediction.homeWinProbability}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>Draw</span>
                      <span>{predictionMutation.data.prediction.drawProbability}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-muted-foreground" style={{ width: `${predictionMutation.data.prediction.drawProbability}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>{predictionMutation.data.teamB} Win</span>
                      <span>{predictionMutation.data.prediction.awayWinProbability}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: `${predictionMutation.data.prediction.awayWinProbability}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Predicted Score */}
                <div className="w-full md:w-64 bg-muted/50 rounded-2xl p-6 text-center border">
                  <span className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Predicted Score</span>
                  <div className="text-5xl font-black">{predictionMutation.data.prediction.predictedScore}</div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Analysis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {predictionMutation.data.prediction.analysis}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Predictions;
