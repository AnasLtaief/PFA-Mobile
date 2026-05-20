import React from 'react';
import { User, Bell, Search, Shield } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{"fullName": "Admin", "email": "admin@campuscovoiturage.dz"}');

  return (
    <header className="glass-panel border-b border-white/5 py-4 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
        <p className="text-xs text-textSecondary mt-0.5">Campus Covoiturage Control Center</p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-6">
        {/* Search bar */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-textSecondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all duration-200">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-white/5"></div>

        {/* User profile */}
        <div className="flex items-center space-x-3.5">
          <div className="bg-gradient-to-tr from-primary to-accent p-0.5 rounded-full">
            <div className="bg-surface p-1.5 rounded-full">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold text-white">{adminUser.fullName}</span>
              <Shield className="h-3.5 w-3.5 text-accent" />
            </div>
            <p className="text-xs text-textSecondary">{adminUser.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
