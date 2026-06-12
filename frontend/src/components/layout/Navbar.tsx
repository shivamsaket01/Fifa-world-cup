import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="glass-nav">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <img src="/logo.png" alt="Fifa World Cup 3.0" className="h-8 w-8 object-contain" />
          <span>Fifa World Cup 3.0</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/live-scores" className="hover:text-primary transition-colors">Live Scores</Link>
          <Link to="/schedule" className="hover:text-primary transition-colors">Schedule</Link>
          <Link to="/standings" className="hover:text-primary transition-colors">Standings</Link>
          <Link to="/predictions" className="hover:text-primary transition-colors">Predictions</Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <Link to="/dashboard" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
              <div className="flex items-center gap-3">
                <Link to="/profile" className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/30 hover:bg-primary/30 transition-colors" title="My Profile">
                  {user?.name.charAt(0)}
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
              <Link to="/signup" className="text-sm font-medium glass-button px-4 py-2 rounded-md">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
