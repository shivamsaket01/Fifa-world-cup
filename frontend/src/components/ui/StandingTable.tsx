import type {} from '';
import { Link } from 'react-router-dom';

interface StandingTableProps {
  standings: Standing[];
  group: string;
}

const StandingTable = ({ standings, group }: StandingTableProps) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-muted px-4 py-3 border-b font-bold text-lg">
        Group {group}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-center">P</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">W</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">D</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">L</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">GF</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">GA</th>
              <th className="px-4 py-3 text-center">GD</th>
              <th className="px-4 py-3 text-center font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <tr key={standing._id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-medium">{index + 1}</td>
                <td className="px-4 py-4">
                  <Link to={`/teams/${standing.team._id}`} className="flex items-center gap-3 hover:text-primary transition-colors font-semibold">
                    <img src={standing.team.logo} alt={standing.team.name} className="w-6 h-6 object-cover rounded-full border" />
                    <span className="hidden sm:inline">{standing.team.name}</span>
                    <span className="sm:hidden">{standing.team.code}</span>
                  </Link>
                </td>
                <td className="px-4 py-4 text-center">{standing.played}</td>
                <td className="px-4 py-4 text-center hidden sm:table-cell">{standing.won}</td>
                <td className="px-4 py-4 text-center hidden sm:table-cell">{standing.drawn}</td>
                <td className="px-4 py-4 text-center hidden sm:table-cell">{standing.lost}</td>
                <td className="px-4 py-4 text-center hidden md:table-cell">{standing.goalsFor}</td>
                <td className="px-4 py-4 text-center hidden md:table-cell">{standing.goalsAgainst}</td>
                <td className="px-4 py-4 text-center">{standing.goalsFor - standing.goalsAgainst}</td>
                <td className="px-4 py-4 text-center font-bold">{standing.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingTable;
