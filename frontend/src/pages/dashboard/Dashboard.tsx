import { useQuery } from '@tanstack/react-query';
import { Users, Trophy, Flag, FileText, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const Dashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics');
      return response.data;
    },
  });

  // Mock chart data
  const trafficData = [
    { name: 'Mon', visitors: 4000 },
    { name: 'Tue', visitors: 3000 },
    { name: 'Wed', visitors: 5000 },
    { name: 'Thu', visitors: 2780 },
    { name: 'Fri', visitors: 8900 },
    { name: 'Sat', visitors: 13900 },
    { name: 'Sun', visitors: 14900 },
  ];

  if (isLoading) return <div className="animate-pulse flex gap-4"><div className="h-32 w-full bg-muted rounded-xl"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor the latest stats and real-time updates.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow transition-shadow">
          <div className="p-4 bg-primary/10 rounded-full text-primary"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold">{analytics?.totalUsers || 0}</h3>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow transition-shadow">
          <div className="p-4 bg-destructive/10 rounded-full text-destructive"><Activity className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Live Matches</p>
            <h3 className="text-2xl font-bold">{analytics?.liveMatches || 0}</h3>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow transition-shadow">
          <div className="p-4 bg-blue-500/10 rounded-full text-blue-500"><Flag className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Teams</p>
            <h3 className="text-2xl font-bold">{analytics?.totalTeams || 0}</h3>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow transition-shadow">
          <div className="p-4 bg-green-500/10 rounded-full text-green-500"><FileText className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">News Articles</p>
            <h3 className="text-2xl font-bold">{analytics?.totalNews || 0}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm min-w-0" style={{ minHeight: 400 }}>
          <h3 className="text-lg font-bold mb-6">Traffic Analytics (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">New match result added</span>
                  <span className="text-xs text-muted-foreground">Brazil 2 - 1 Argentina</span>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">{i * 2}h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
