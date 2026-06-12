import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Team } from '../types';
import TeamCard from '../components/ui/TeamCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const Teams = () => {
  const { data: teams, isLoading, error, refetch } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Participating Teams</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState retry={refetch} />
      ) : teams && teams.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-xl bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No teams available</h3>
        </div>
      )}
    </div>
  );
};

export default Teams;
