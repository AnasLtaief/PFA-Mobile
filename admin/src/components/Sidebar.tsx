import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  AlertTriangle,
  CreditCard,
  Users2,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Rides', path: '/rides', icon: Car },
    { name: 'Reports', path: '/reports', icon: AlertTriangle },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Groups', path: '/groups', icon: Users2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-white/5 flex items-center space-x-3">
        <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/30">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-white tracking-wide text-lg">Covoiturage</h2>
          <span className="text-xs text-accent font-semibold tracking-wider uppercase">Admin Portal</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-textSecondary hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3.5 w-full px-4 py-3 rounded-xl text-emergency/80 hover:text-emergency hover:bg-emergency/10 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
