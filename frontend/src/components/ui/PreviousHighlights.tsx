import { PlayCircle, Clock } from 'lucide-react';

const highlights = [
  {
    id: 1,
    title: 'Epic Comeback in the Final Minutes',
    description: 'Relive the breathtaking moments as the team fought back from a 2-goal deficit to win the match in stoppage time.',
    image: '/highlight-1.png',
    date: 'Yesterday',
    category: 'Match Recap',
  },
  {
    id: 2,
    title: 'The Save of the Century',
    description: 'An unbelievable diving save that kept the dreams alive. A true heroic performance under immense pressure.',
    image: '/highlight-2.png',
    date: '2 days ago',
    category: 'Top Moments',
  },
  {
    id: 3,
    title: 'Fans Paint the Stadium in Colors',
    description: 'The atmosphere was electric as thousands of passionate fans cheered for their favorite teams.',
    image: '/highlight-3.png',
    date: '3 days ago',
    category: 'Behind the Scenes',
  }
];

const PreviousHighlights = () => {
  return (
    <section className="container mx-auto px-4 pt-8 pb-12">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <PlayCircle className="text-primary h-8 w-8" /> 
            Tournament Highlights
          </h2>
          <p className="text-muted-foreground mt-2">Catch up on the most iconic moments and recent matches.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highlights.map((item) => (
          <div key={item.id} className="group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full">
            <div className="relative overflow-hidden aspect-video">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md bg-opacity-80">
                {item.category}
              </div>
              <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-14 w-14 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Clock className="h-4 w-4" />
                <span>{item.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                {item.description}
              </p>
              <button className="mt-auto text-primary font-semibold text-sm hover:underline flex items-center gap-1">
                Watch Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviousHighlights;
