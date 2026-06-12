import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import api from '../services/api';
import type { Match } from '../types';
import MatchCard from '../components/ui/MatchCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import { socketService } from '../sockets/socketClient';

const LiveScores = () => {
  const queryClient = useQueryClient();

  const { data: matches, isLoading, error, refetch } = useQuery<Match[]>({
    queryKey: ['liveMatches'],
    queryFn: async () => {
      const response = await api.get('/matches/live');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  useEffect(() => {
    const socket = socketService.connect();

    // Join all live match rooms
    if (matches) {
      matches.forEach(match => socketService.joinMatch(match._id));
    }

    const handleMatchUpdate = (updateData: any) => {
      queryClient.setQueryData(['liveMatches'], (oldData: Match[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(match => 
          match._id === updateData.matchId 
            ? { ...match, homeScore: updateData.homeScore, awayScore: updateData.awayScore, time: updateData.time }
            : match
        );
      });
    };

    const handleGoalScored = (data: any) => {
      // Could show a toast notification here
      console.log('GOAL SCORED!', data);
    };

    socket.on('match_updated', handleMatchUpdate);
    socket.on('goal_scored', handleGoalScored);

    return () => {
      socket.off('match_updated', handleMatchUpdate);
      socket.off('goal_scored', handleGoalScored);
      if (matches) {
        matches.forEach(match => socketService.leaveMatch(match._id));
      }
      socketService.disconnect();
    };
  }, [matches, queryClient]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-8 w-8 text-destructive animate-pulse" />
        <h1 className="text-4xl font-bold">Live Scores</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState retry={refetch} />
      ) : matches && matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-xl bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No live matches at the moment</h3>
          <p className="text-muted-foreground">Check back later or view the schedule.</p>
        </div>
      )}
    </div>
  );
};

export default LiveScores;
