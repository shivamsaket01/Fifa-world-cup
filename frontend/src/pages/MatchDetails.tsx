import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import type { Match } from '../types';
import ScoreBoard from '../components/ui/ScoreBoard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import FootballPitch from '../components/ui/FootballPitch';
import AdBanner from '../components/ui/AdBanner';
import AffiliateShop from '../components/ui/AffiliateShop';
import { mockMatches, mockHomeLineup, mockAwayLineup } from '../data/mockWorldCupData';

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTeam, setActiveTeam] = useState<'home' | 'away'>('home');

  const { data: match, isLoading, error, refetch } = useQuery<Match>({
    queryKey: ['match', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/matches/${id}`);
        if (response.data) return response.data;
        return mockMatches.find(m => m._id === id);
      } catch (err) {
        return mockMatches.find(m => m._id === id);
      }
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="container mx-auto px-4 py-8"><CardSkeleton /></div>;
  if (error && !match) return <div className="container mx-auto px-4 py-8"><ErrorState retry={refetch} /></div>;
  if (!match) return <div className="container mx-auto px-4 py-8"><ErrorState message="Match not found" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/live-scores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to matches
      </Link>
      
      <ScoreBoard match={match} />
      
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Match Info & Timeline */}
        <div className="space-y-8">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Match Info</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex justify-between border-b pb-2"><span>Date</span> <span className="font-medium text-foreground">{new Date(match.date).toLocaleDateString()}</span></li>
              <li className="flex justify-between border-b pb-2"><span>Status</span> <span className="font-medium text-foreground">{match.status}</span></li>
              <li className="flex justify-between border-b pb-2"><span>Stage</span> <span className="font-medium text-foreground">{match.group}</span></li>
            </ul>
          </div>
          
          <AffiliateShop teamName={match.homeTeam.name} />
          
          <div className="hidden lg:block">
            <AdBanner format="rectangle" />
          </div>
        </div>

        {/* Right Column: Lineups & Pitch */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Line-ups (Confirmed)</h3>
          </div>
          
          <div className="flex border-b mb-4">
            <button 
              className={`flex-1 pb-2 font-bold transition-colors ${activeTeam === 'home' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTeam('home')}
            >
              {match.homeTeam.name}
            </button>
            <button 
              className={`flex-1 pb-2 font-bold transition-colors ${activeTeam === 'away' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTeam('away')}
            >
              {match.awayTeam.name}
            </button>
          </div>

          <FootballPitch 
            homeTeamName={match.homeTeam.name}
            awayTeamName={match.awayTeam.name}
            homeLineup={mockHomeLineup}
            awayLineup={mockAwayLineup}
            activeTeam={activeTeam}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
