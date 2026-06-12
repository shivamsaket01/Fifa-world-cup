import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import type {} from '';
import ScoreBoard from '../components/ui/ScoreBoard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: match, isLoading, error, refetch } = useQuery<Match>({
    queryKey: ['match', id],
    queryFn: async () => {
      const response = await api.get(`/matches/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="container mx-auto px-4 py-8"><CardSkeleton /></div>;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorState retry={refetch} /></div>;
  if (!match) return <div className="container mx-auto px-4 py-8"><ErrorState message="Match not found" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/live-scores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to matches
      </Link>
      
      <ScoreBoard match={match} />
      
      {/* Additional Match Details (Timeline, Lineups, Stats) would go here */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Match Info</h3>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex justify-between border-b pb-2"><span>Date</span> <span className="font-medium text-foreground">{new Date(match.date).toLocaleDateString()}</span></li>
            <li className="flex justify-between border-b pb-2"><span>Status</span> <span className="font-medium text-foreground">{match.status}</span></li>
            <li className="flex justify-between border-b pb-2"><span>Stage</span> <span className="font-medium text-foreground">{match.group}</span></li>
          </ul>
        </div>
        <div className="bg-card border rounded-xl p-6 text-center flex flex-col items-center justify-center text-muted-foreground">
          <p className="mb-2">Lineups & Stats coming soon</p>
          <div className="w-16 h-1 bg-muted rounded-full mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
