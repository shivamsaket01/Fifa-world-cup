import type { Match } from '../../types';

interface ScoreBoardProps {
  match: Match;
}

const ScoreBoard = ({ match }: ScoreBoardProps) => {
  const isLive = match.status === 'LIVE';

  return (
    <div className="bg-card text-card-foreground border rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-destructive to-primary" />
      
      <div className="text-center mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-4 py-1 rounded-full">
          {match.group} - {isLive ? 'Live' : (match.status === 'NS' ? 'Upcoming' : 'Finished')}
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-muted overflow-hidden mb-4 shadow-md">
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">{match.homeTeam.name}</h2>
          <span className="text-muted-foreground font-medium">{match.homeTeam.code}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="text-6xl md:text-8xl font-black tabular-nums flex gap-4">
            <span>{match.homeScore}</span>
            <span className="text-muted-foreground font-normal">-</span>
            <span>{match.awayScore}</span>
          </div>
          <div className="mt-4">
            {isLive && (
              <span className="bg-destructive text-destructive-foreground px-4 py-1 rounded-full font-bold animate-pulse text-lg">
                {match.time}
              </span>
            )}
            {match.status === 'FT' && (
              <span className="bg-muted text-muted-foreground px-4 py-1 rounded-full font-bold text-lg">
                Full Time
              </span>
            )}
            {match.status === 'NS' && (
              <span className="text-muted-foreground font-medium text-lg">
                {new Date(match.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-muted overflow-hidden mb-4 shadow-md">
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">{match.awayTeam.name}</h2>
          <span className="text-muted-foreground font-medium">{match.awayTeam.code}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
