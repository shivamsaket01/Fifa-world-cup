import type { Match } from '../../types';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const isLive = match.status === 'LIVE';

  return (
    <Link to={`/matches/${match._id}`} className="block">
      <div className="glass-card rounded-xl p-6 group">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold bg-muted px-2 py-1 rounded text-muted-foreground">{match.group}</span>
          <span className={`text-xs font-bold flex items-center gap-1 ${isLive ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
            {isLive && <span className="w-2 h-2 rounded-full bg-destructive inline-block"></span>}
            {isLive ? `LIVE ${match.time}` : (match.status === 'NS' ? new Date(match.date).toLocaleDateString() : 'FT')}
          </span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1 transition-transform group-hover:-translate-y-1">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg overflow-hidden border">
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-sm md:text-base">{match.homeTeam.name}</span>
          </div>
          <div className="text-3xl font-black px-4 flex gap-3">
            <span>{match.homeScore}</span>
            <span className="text-muted-foreground font-normal">-</span>
            <span>{match.awayScore}</span>
          </div>
          <div className="text-center flex-1 transition-transform group-hover:-translate-y-1">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg overflow-hidden border">
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-sm md:text-base">{match.awayTeam.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
