import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import type { Team } from '../types';
import ErrorState from '../components/ui/ErrorState';

const TeamDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: team, isLoading, error, refetch } = useQuery<Team>({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await api.get(`/teams/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorState retry={refetch} /></div>;
  if (!team) return <div className="container mx-auto px-4 py-8"><ErrorState message="Team not found" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/teams" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to teams
      </Link>

      <div className="bg-card border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-muted overflow-hidden shrink-0">
          <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl md:text-5xl font-black mb-2">{team.name}</h1>
          <p className="text-xl text-muted-foreground font-medium mb-6">Group {team.group} &bull; {team.code}</p>
          
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-muted px-4 py-3 rounded-lg">
              <span className="block text-sm text-muted-foreground">Coach</span>
              <span className="font-bold">{team.coach}</span>
            </div>
            {/* Squad and Matches stats placeholders */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
