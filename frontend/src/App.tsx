import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import LiveScores from './pages/LiveScores';
import MatchDetails from './pages/MatchDetails';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import Standings from './pages/Standings';
import News from './pages/News';
import Schedule from './pages/Schedule';
import Predictions from './pages/Predictions';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { GlobalNotificationHandler } from './components/GlobalNotificationHandler';

// Admin imports
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/dashboard/Dashboard';
import AdminNews from './pages/dashboard/AdminNews';
import AdminMatches from './pages/dashboard/AdminMatches';
import AdminTeams from './pages/dashboard/AdminTeams';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminSettings from './pages/dashboard/AdminSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalNotificationHandler />
        <Router>
          <Routes>
            {/* Public/User Routes */}
            <Route element={
              <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
                <Navbar />
                <main className="flex-1">
                  <Outlet />
                </main>
              </div>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/live-scores" element={<LiveScores />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/matches/:id" element={<MatchDetails />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetails />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/news" element={<News />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>

            {/* Admin Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="matches" element={<AdminMatches />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
