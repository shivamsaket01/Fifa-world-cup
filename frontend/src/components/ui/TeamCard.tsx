import type {} from '';
import { Link } from 'react-router-dom';

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <Link to={`/teams/${team._id}`} className="block">
      <div className="bg-card border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-primary/50 group">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-muted group-hover:border-primary transition-colors">
          <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-bold mb-1">{team.name}</h3>
        <p className="text-muted-foreground text-sm font-medium">Group {team.group}</p>
      </div>
    </Link>
  );
};

export default TeamCard;
