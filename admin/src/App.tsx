import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Rides from './pages/Rides';
import Reports from './pages/Reports';
import Payments from './pages/Payments';
import Groups from './pages/Groups';
import Settings from './pages/Settings';
import Login from './pages/Login';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [currentUser, setCurrentUser] = useState<any>(null);

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

  // If not authenticated, force render Login page
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <div className="flex bg-background min-h-screen text-[#F0F0F5]">
        {/* Responsive Sidebar */}
        <Sidebar onLogout={handleLogout} />

        {/* Control Center Core Layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar */}
          <Routes>
            <Route path="/" element={<Header title="Operations Dashboard" />} />
            <Route path="/users" element={<Header title="Student Roster Manager" />} />
            <Route path="/rides" element={<Header title="Active Commuters Routing" />} />
            <Route path="/reports" element={<Header title="SOS & Disputes Security" />} />
            <Route path="/payments" element={<Header title="Stripe Escrow Ledger" />} />
            <Route path="/groups" element={<Header title="State pools (1-58)" />} />
            <Route path="/settings" element={<Header title="Control Center Rules" />} />
            <Route path="*" element={<Header title="Campus Covoiturage Admin" />} />
          </Routes>

          {/* Subpages Viewport */}
          <main className="flex-1 p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
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
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
