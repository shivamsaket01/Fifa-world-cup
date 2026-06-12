import { Users } from 'lucide-react';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Manage Users
          </h1>
          <p className="text-muted-foreground mt-1">View registered users and manage roles.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-xl font-bold mb-2">User Management Coming Soon</h3>
        <p className="text-muted-foreground">The interface to manage users and roles is under development.</p>
      </div>
    </div>
  );
};

export default AdminUsers;
