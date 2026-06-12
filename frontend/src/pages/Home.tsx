import { ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee71161dbce?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
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

      {/* Today's Matches Placeholder */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Today's Matches</h2>
          <Link to="/live-scores" className="text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Match Cards */}
          {[1, 2, 3].map((match) => (
            <div key={match} className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold bg-muted px-2 py-1 rounded text-muted-foreground">Group Stage</span>
                <span className="text-xs font-bold text-destructive animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-destructive inline-block"></span>
                  LIVE 65'
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg">BRA</div>
                  <span className="font-semibold">Brazil</span>
                </div>
                <div className="text-3xl font-black px-4 flex gap-3">
                  <span>2</span>
                  <span className="text-muted-foreground font-normal">-</span>
                  <span>1</span>
                </div>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg">ARG</div>
                  <span className="font-semibold">Argentina</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
