import { ShieldCheck, Trophy, Sparkles, Activity, Star, Zap } from 'lucide-react';

const sponsors = [
  { name: 'Emirates', icon: <Trophy className="h-6 w-6" /> },
  { name: 'Adidas', icon: <Activity className="h-6 w-6" /> },
  { name: 'Coca-Cola', icon: <Sparkles className="h-6 w-6" /> },
  { name: 'Visa', icon: <Star className="h-6 w-6" /> },
  { name: 'Qatar Airways', icon: <Zap className="h-6 w-6" /> },
  { name: 'Hyundai', icon: <ShieldCheck className="h-6 w-6" /> },
];

const SponsorsMarquee = () => {
  return (
    <div className="w-full bg-muted/30 border-y py-8 overflow-hidden relative flex flex-col items-center">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Official Global Partners</h3>
      
      {/* Scrollable container */}
      <div className="w-full relative px-4 max-w-7xl mx-auto">
        <div className="flex overflow-x-auto pb-4 pt-2 gap-12 sm:gap-24 items-center snap-x whitespace-nowrap custom-scrollbar">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer snap-center shrink-0">
              {sponsor.icon}
              <span className="text-xl font-black font-sans tracking-tight">{sponsor.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsMarquee;
