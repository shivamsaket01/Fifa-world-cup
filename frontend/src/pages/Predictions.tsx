import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Bot, Swords, Loader2 } from 'lucide-react';
import api from '../services/api';
import type { Team } from '../types';

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
  const [teamAId, setTeamAId] = useState<string>('');
  const [teamBId, setTeamBId] = useState<string>('');

  const { data: teams, isLoading: isLoadingTeams } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data;
    },
  });

  const predictionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/predictions', { teamAId, teamBId });
      return response.data as PredictionResult;
    },
  });

  const handlePredict = () => {
    if (teamAId && teamBId && teamAId !== teamBId) {
      predictionMutation.mutate();
    }
  };

  const getTeamById = (id: string) => teams?.find(t => t._id === id);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
          <Bot className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">AI Match Predictor</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select any two teams and our Gemini-powered AI engine will analyze their form, history, and stats to predict the outcome.
        </p>
      </div>

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
  );
};

export default Predictions;
