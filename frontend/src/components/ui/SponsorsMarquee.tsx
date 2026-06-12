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
      
      {/* Marquee container */}
      <div className="w-full relative flex overflow-x-hidden">
        {/* Gradient overlays for smooth edge fading */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10"></div>

        {/* Scrolling content */}
        <div className="flex animate-marquee whitespace-nowrap">
          {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
            <div key={index} className="flex items-center gap-3 mx-8 sm:mx-12 opacity-60 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0">
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
