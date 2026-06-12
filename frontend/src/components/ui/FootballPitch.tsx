

interface Player {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photo?: string;
  gridArea: string; // CSS Grid Area for absolute positioning or grid
}

interface FootballPitchProps {
  homeTeamName: string;
  awayTeamName: string;
  homeLineup: Player[];
  awayLineup: Player[];
  activeTeam: 'home' | 'away';
}

const PlayerNode = ({ player }: { player: Player }) => (
  <div 
    className="flex flex-col items-center justify-center absolute transform -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform cursor-pointer"
    style={{ 
      left: player.gridArea.split(',')[0], 
      top: player.gridArea.split(',')[1] 
    }}
  >
    <div className="w-12 h-12 bg-white rounded-full border-2 border-primary overflow-hidden mb-1 flex items-center justify-center shadow-lg">
      {player.photo ? (
        <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-gray-800">{player.number}</span>
      )}
    </div>
    <div className="bg-black/80 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded backdrop-blur-sm whitespace-nowrap">
      {player.number}. {player.name}
    </div>
  </div>
);

const FootballPitch = ({ homeLineup, awayLineup, activeTeam }: FootballPitchProps) => {
  const currentLineup = activeTeam === 'home' ? homeLineup : awayLineup;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-green-600 rounded-lg p-2 sm:p-4 shadow-2xl relative overflow-hidden" 
           style={{ aspectRatio: '3/4', backgroundImage: 'linear-gradient(to bottom, #16a34a 50%, #15803d 50%)', backgroundSize: '100% 10%' }}>
        
        {/* Pitch Lines */}
        <div className="absolute inset-4 border-2 border-white/60"></div>
        {/* Center Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/60 transform -translate-y-1/2"></div>
        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Penalty Areas */}
        <div className="absolute top-4 left-1/2 w-1/2 sm:w-2/5 h-1/6 border-2 border-t-0 border-white/60 transform -translate-x-1/2"></div>
        <div className="absolute bottom-4 left-1/2 w-1/2 sm:w-2/5 h-1/6 border-2 border-b-0 border-white/60 transform -translate-x-1/2"></div>

        {/* Goal Areas */}
        <div className="absolute top-4 left-1/2 w-1/4 h-8 border-2 border-t-0 border-white/60 transform -translate-x-1/2"></div>
        <div className="absolute bottom-4 left-1/2 w-1/4 h-8 border-2 border-b-0 border-white/60 transform -translate-x-1/2"></div>

        {/* Players */}
        {currentLineup.map((player) => (
          <PlayerNode key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default FootballPitch;
