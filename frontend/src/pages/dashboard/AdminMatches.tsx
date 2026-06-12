import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Swords, X, Activity } from 'lucide-react';
import api from '../../services/api';
import type { Match } from '../../types';
import ErrorState from '../../components/ui/ErrorState';

const AdminMatches = () => {
  const queryClient = useQueryClient();
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [activeLiveMatch, setActiveLiveMatch] = useState<Match | null>(null);

  const { data: matches, isLoading, error, refetch } = useQuery<Match[]>({
    queryKey: ['admin-matches'],
    queryFn: async () => {
      const response = await api.get('/matches');
      return response.data;
    },
  });

  const liveUpdateMutation = useMutation({
    mutationFn: async (data: { homeScore: number; awayScore: number; time: string; status: string }) => {
      if (activeLiveMatch) {
        return api.put(`/admin/matches/${activeLiveMatch._id}/live`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      time: '',
      status: 'LIVE'
    }
  });

  const openLiveModal = (match: Match) => {
    setActiveLiveMatch(match);
    reset({
      time: match.time,
      status: match.status
    });
    setIsLiveModalOpen(true);
  };

  const handleScoreChange = (team: 'home' | 'away', increment: boolean) => {
    if (!activeLiveMatch) return;
    const currentScore = team === 'home' ? activeLiveMatch.homeScore : activeLiveMatch.awayScore;
    const newScore = increment ? currentScore + 1 : Math.max(0, currentScore - 1);
    
    liveUpdateMutation.mutate({
      homeScore: team === 'home' ? newScore : activeLiveMatch.homeScore,
      awayScore: team === 'away' ? newScore : activeLiveMatch.awayScore,
      time: activeLiveMatch.time,
      status: activeLiveMatch.status
    });

    // Optimistically update local state for snappy UI
    setActiveLiveMatch({
      ...activeLiveMatch,
      homeScore: team === 'home' ? newScore : activeLiveMatch.homeScore,
      awayScore: team === 'away' ? newScore : activeLiveMatch.awayScore,
    });
  };

  const onLiveUpdateSubmit = (data: any) => {
    if (!activeLiveMatch) return;
    liveUpdateMutation.mutate({
      homeScore: activeLiveMatch.homeScore,
      awayScore: activeLiveMatch.awayScore,
      time: data.time,
      status: data.status
    });
    if (data.status === 'FT') {
      setIsLiveModalOpen(false);
      setActiveLiveMatch(null);
    }
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-muted rounded-xl"></div>;
  if (error) return <ErrorState retry={refetch} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Swords className="h-8 w-8 text-primary" />
            Manage Matches
          </h1>
          <p className="text-muted-foreground mt-1">Control live scores and manage match fixtures.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4">Match</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches?.map((match) => (
                <tr key={match._id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 font-bold">
                      <div className="flex items-center gap-2 w-32 justify-end">
                        {match.homeTeam.name}
                        <img src={match.homeTeam.logo} alt="" className="w-6 h-6 object-contain" />
                      </div>
                      <span className="text-muted-foreground font-normal">vs</span>
                      <div className="flex items-center gap-2 w-32">
                        <img src={match.awayTeam.logo} alt="" className="w-6 h-6 object-contain" />
                        {match.awayTeam.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-lg font-black">
                    {match.status !== 'NS' ? `${match.homeScore} - ${match.awayScore}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      match.status === 'LIVE' ? 'bg-destructive/10 text-destructive animate-pulse' :
                      match.status === 'FT' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      {match.status} {match.time && `(${match.time})`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openLiveModal(match)} 
                        className={`p-2 rounded transition-colors flex items-center gap-1 font-bold text-xs ${
                          match.status === 'LIVE' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                      >
                        <Activity className="h-4 w-4" />
                        {match.status === 'LIVE' ? 'Live Control' : 'Update'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Match Control Modal */}
      {isLiveModalOpen && activeLiveMatch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold flex items-center gap-2 text-destructive">
                <Activity className="h-5 w-5 animate-pulse" />
                Live Match Controller
              </h2>
              <button onClick={() => setIsLiveModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-12">
                {/* Home Team Control */}
                <div className="text-center space-y-4">
                  <img src={activeLiveMatch.homeTeam.logo} alt="" className="w-24 h-24 mx-auto object-contain" />
                  <h3 className="text-2xl font-black">{activeLiveMatch.homeTeam.name}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => handleScoreChange('home', false)} className="w-12 h-12 rounded-full border-2 border-muted-foreground text-2xl font-bold hover:bg-muted transition-colors">-</button>
                    <span className="text-6xl font-black w-16">{activeLiveMatch.homeScore}</span>
                    <button onClick={() => handleScoreChange('home', true)} className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-2xl font-bold hover:bg-primary/90 transition-colors">+</button>
                  </div>
                </div>

                <div className="text-4xl font-black text-muted-foreground">VS</div>

                {/* Away Team Control */}
                <div className="text-center space-y-4">
                  <img src={activeLiveMatch.awayTeam.logo} alt="" className="w-24 h-24 mx-auto object-contain" />
                  <h3 className="text-2xl font-black">{activeLiveMatch.awayTeam.name}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => handleScoreChange('away', false)} className="w-12 h-12 rounded-full border-2 border-muted-foreground text-2xl font-bold hover:bg-muted transition-colors">-</button>
                    <span className="text-6xl font-black w-16">{activeLiveMatch.awayScore}</span>
                    <button onClick={() => handleScoreChange('away', true)} className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-2xl font-bold hover:bg-primary/90 transition-colors">+</button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onLiveUpdateSubmit)} className="bg-muted/30 p-6 rounded-xl border flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">Match Minute / Time</label>
                  <input {...register('time')} placeholder="e.g. 45', HT, 90+2'" className="w-full bg-background border rounded-lg px-4 py-2 font-bold" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">Status</label>
                  <select {...register('status')} className="w-full bg-background border rounded-lg px-4 py-2 font-bold">
                    <option value="NS">Not Started</option>
                    <option value="LIVE">Live</option>
                    <option value="HT">Half Time</option>
                    <option value="FT">Full Time</option>
                  </select>
                </div>
                <button type="submit" className="bg-primary text-primary-foreground px-8 py-2 rounded-lg font-bold hover:bg-primary/90">
                  Update Time & Status
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatches;
