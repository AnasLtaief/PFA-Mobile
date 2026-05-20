import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MoreDrawer from './components/MoreDrawer';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Rides from './pages/Rides';
import Reports from './pages/Reports';
import Payments from './pages/Payments';
import Groups from './pages/Groups';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Wifi, Battery } from 'lucide-react';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [time, setTime] = useState('');

  // Clock Update Effect for Phone Status Bar
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const strHours = hours < 10 ? `0${hours}` : hours;
      const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setTime(`${strHours}:${strMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string, user: any) => {
    setToken(newToken);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setCurrentUser(null);
  };

  // If not authenticated, render Login inside the simulated phone format
  const renderContent = () => {
    if (!token) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
      <div className="flex-1 flex flex-col min-w-0 h-full relative pb-16 bg-background">
        {/* Compact Header Bar */}
        <Routes>
          <Route path="/" element={<Header title="Operations Dashboard" />} />
          <Route path="/users" element={<Header title="Student Roster Manager" />} />
          <Route path="/rides" element={<Header title="Active Commuters Routing" />} />
          <Route path="/reports" element={<Header title="SOS & Disputes Security" />} />
          <Route path="/payments" element={<Header title="Stripe Escrow Ledger" />} />
          <Route path="/groups" element={<Header title="State Pools (1-58)" />} />
          <Route path="/settings" element={<Header title="Control Center Rules" />} />
          <Route path="*" element={<Header title="Campus Covoiturage Admin" />} />
        </Routes>

        {/* Subpages Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 w-full safe-scroll">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Bottom Tab Navigation Bar */}
        <BottomNav onMoreClick={() => setIsMoreOpen(true)} />

        {/* Slide up Drawer Overlay for secondary routes */}
        <MoreDrawer
          isOpen={isMoreOpen}
          onClose={() => setIsMoreOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    );
  };

  return (
    <BrowserRouter>
      {/* Outer Workspace Layout with Ambient Radial Glows */}
      <div className="min-h-screen bg-[#06060A] text-[#F0F0F5] flex items-center justify-center p-0 sm:p-6 overflow-hidden relative font-sans">
        {/* Glow ambient spots */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none hidden sm:block"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none hidden sm:block"></div>

        {/* Simulated Smartphone Container */}
        {/* On mobile screens (<640px) the outer bezel disappears and is 100% full screen */}
        <div className="relative w-full h-screen sm:w-[412px] sm:h-[892px] sm:rounded-[44px] sm:border-[12px] sm:border-[#1E1E28] bg-background phone-glow flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Top Physical Dynamic Island (Notch) & Physical Buttons - Visible only on Desktop */}
          <div className="hidden sm:block">
            {/* Bezel Buttons */}
            <div className="absolute left-[-15px] top-[140px] w-[3px] h-[50px] bezel-button rounded-l-md pointer-events-none"></div>
            <div className="absolute left-[-15px] top-[200px] w-[3px] h-[50px] bezel-button rounded-l-md pointer-events-none"></div>
            <div className="absolute right-[-15px] top-[180px] w-[3px] h-[75px] bezel-button rounded-r-md pointer-events-none"></div>
            
            {/* Top Speaker Ear-piece */}
            <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-28 h-1 bg-black/60 rounded-full z-50"></div>
          </div>

          {/* Simulated iOS/Android Status Bar */}
          <div className="w-full h-11 px-6 bg-[#13131A] text-white flex items-center justify-between text-xs font-semibold select-none z-40 shrink-0 border-b border-white/[0.02]">
            {/* Time Display */}
            <div className="font-mono tracking-tighter text-white">{time || '12:00'}</div>
            
            {/* Top Notch Pill (Dynamic Island) */}
            <div className="hidden sm:block w-[110px] h-[28px] bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-[8px] z-50 shadow-inner flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#0f0f18] rounded-full absolute right-3"></div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center space-x-2 text-textSecondary">
              <div className="flex space-x-0.5 items-end">
                <span className="w-0.5 h-1.5 bg-white rounded-sm"></span>
                <span className="w-0.5 h-2.5 bg-white rounded-sm"></span>
                <span className="w-0.5 h-3 bg-white rounded-sm"></span>
                <span className="w-0.5 h-3.5 bg-white rounded-sm"></span>
              </div>
              <Wifi className="h-3.5 w-3.5 text-white" />
              <div className="flex items-center space-x-1 text-white">
                <span className="text-[10px] font-bold">98%</span>
                <Battery className="h-4 w-4 fill-white text-white" />
              </div>
            </div>
          </div>

          {/* Dynamic Content Viewport */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {renderContent()}
          </div>

          {/* Bottom Native Home Indicator swipe bar (iOS/Android Style) - Visible only on Desktop */}
          <div className="hidden sm:block w-full h-5 bg-background flex items-center justify-center select-none z-40 shrink-0">
            <div className="w-32 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
