import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type {} from '';
import StandingTable from '../components/ui/StandingTable';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const Standings = () => {
  const { data: standings, isLoading, error, refetch } = useQuery<Standing[]>({
    queryKey: ['standings'],
    queryFn: async () => {
      const response = await api.get('/standings');
      return response.data;
    },
  });

  // Group standings by their 'group' property
  const groupedStandings = standings?.reduce((acc, curr) => {
    if (!acc[curr.group]) {
      acc[curr.group] = [];
    }
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, Standing[]>);

  // Sort groups alphabetically
  const groups = groupedStandings ? Object.keys(groupedStandings).sort() : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Group Standings</h1>

      {isLoading ? (
        <div className="space-y-8">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      ) : error ? (
        <ErrorState retry={refetch} />
      ) : groups.length > 0 ? (
        <div className="space-y-12">
          {groups.map((group) => {
            // Sort teams within group by points, then goal difference
            const groupStandings = groupedStandings![group].sort((a, b) => {
              if (b.points !== a.points) return b.points - a.points;
              const gdA = a.goalsFor - a.goalsAgainst;
              const gdB = b.goalsFor - b.goalsAgainst;
              return gdB - gdA;
            });
            return <StandingTable key={group} group={group} standings={groupStandings} />;
          })}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-xl bg-muted/30">
          <h3 className="text-xl font-semibold mb-2">No standings available</h3>
        </div>
      )}
    </div>
  );
};

export default Standings;
