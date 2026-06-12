import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import api from '../services/api';
import type { Match } from '../types';
import MatchCard from '../components/ui/MatchCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const Schedule = () => {
  const { data: matches, isLoading, error, refetch } = useQuery<Match[]>({
    queryKey: ['upcomingMatches'],
    queryFn: async () => {
      // Assuming the backend has this endpoint for schedule
      const response = await api.get('/matches/upcoming');
      return response.data;
    },
  });

  // Group matches by date
  const groupedMatches = matches?.reduce((acc, match) => {
    const dateStr = new Date(match.date).toLocaleDateString(undefined, { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const dates = groupedMatches ? Object.keys(groupedMatches).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-full">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Match Schedule</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState retry={refetch} />
      ) : dates.length > 0 ? (
        <div className="space-y-12">
          {dates.map((date) => (
            <div key={date}>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{date}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedMatches![date].map((match) => (
                  <MatchCard key={match._id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-xl bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No upcoming matches</h3>
          <p className="text-muted-foreground">The schedule has not been published yet.</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;
