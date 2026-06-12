import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import api from '../services/api';
import type { Match } from '../types';
import MatchCard from '../components/ui/MatchCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import { mockMatches } from '../data/mockWorldCupData';

const TodayMatches = () => {
  const { data: matches, isLoading, error, refetch } = useQuery<Match[]>({
    queryKey: ['todayMatches'],
    queryFn: async () => {
      try {
        const response = await api.get('/matches/today');
        if (response.data && response.data.length > 0) return response.data;
        return mockMatches;
      } catch (err) {
        return mockMatches;
      }
    },
    refetchInterval: 60000, // Refetch every minute to keep statuses updated
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Today's Matches</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
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
        <div className="text-center p-12 glass-card rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No matches scheduled for today</h3>
          <p className="text-muted-foreground">The teams are resting. Check back tomorrow!</p>
        </div>
      )}
    </div>
  );
};

export default TodayMatches;
