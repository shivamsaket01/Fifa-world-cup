import { Flag } from 'lucide-react';

const AdminTeams = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flag className="h-8 w-8 text-primary" />
            Manage Teams
          </h1>
          <p className="text-muted-foreground mt-1">Add, update, or remove football teams.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          + Add Team
        </button>
      </div>

      <div className="bg-card border rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-xl font-bold mb-2">Team Management Coming Soon</h3>
        <p className="text-muted-foreground">The full CRUD interface for teams is under development.</p>
      </div>
    </div>
  );
};

export default AdminTeams;
