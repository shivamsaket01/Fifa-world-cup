import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Match } from '../types';
import MatchCard from '../components/ui/MatchCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { mockMatches } from '../data/mockWorldCupData';
import AdBanner from '../components/ui/AdBanner';
import PreviousHighlights from '../components/ui/PreviousHighlights';


const Home = () => {
  const { data: todayMatches, isLoading } = useQuery<Match[]>({
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
  });

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-30 pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
            The Ultimate <br className="md:hidden" /> Football Experience
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-150">
            Live scores, expert predictions, and real-time updates for the ultimate FIFA World Cup fan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in slide-in-from-bottom-6 fade-in duration-700 delay-300">
            <Link to="/live-scores" className="bg-background text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-lg">
              <Activity className="h-5 w-5 text-destructive" />
              Live Scores
            </Link>
            <Link to="/predictions" className="bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-foreground/20 transition-all flex items-center gap-2">
              Make Predictions
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>


      {/* Categories/Features */}
      <div className="container mx-auto px-4 mt-8 relative z-20">
        <AdBanner format="horizontal" />
      </div>

      {/* Today's Matches Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Today's Matches</h2>
          <Link to="/today" className="text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : todayMatches && todayMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayMatches.slice(0, 3).map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 glass-card rounded-xl">
            <h3 className="text-xl font-semibold mb-2">No matches scheduled for today</h3>
            <p className="text-muted-foreground">Check out the upcoming matches or play predictions!</p>
          </div>
        )}
      </section>

      {/* Previous Match Highlights */}
      <PreviousHighlights />
    </div>
  );
};

export default Home;
