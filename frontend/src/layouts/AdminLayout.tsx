import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, Flag, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Matches', path: '/dashboard/matches', icon: Trophy },
    { name: 'Teams', path: '/dashboard/teams', icon: Flag },
    { name: 'News', path: '/dashboard/news', icon: FileText },
    { name: 'Users', path: '/dashboard/users', icon: Users },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <img src="/logo.png" alt="Fifa World Cup 3.0" className="h-6 w-6 object-contain" />
            <span>Fifa World Cup 3.0 Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              {user?.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Navbar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:hidden sticky top-0 z-10">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <img src="/logo.png" alt="Fifa World Cup 3.0" className="h-5 w-5 object-contain" />
            <span>Admin</span>
          </Link>
          <button className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
             <LayoutDashboard className="h-6 w-6" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
