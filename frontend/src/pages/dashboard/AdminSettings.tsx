import { Settings } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Platform Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure application settings and preferences.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="bg-card border rounded-xl p-12 text-center shadow-sm">
        <h3 className="text-xl font-bold mb-2">Settings Configuration Coming Soon</h3>
        <p className="text-muted-foreground">The administrative settings panel is currently under development.</p>
      </div>
    </div>
  );
};

export default AdminSettings;
