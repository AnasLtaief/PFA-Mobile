import React from 'react';
import { User, Bell, Shield } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const adminUser = JSON.parse(
    localStorage.getItem('admin_user') || 
    '{"fullName": "Admin", "email": "admin@campuscovoiturage.dz"}'
  );

  const initialName = adminUser.fullName.split(' ')[0] || 'Admin';

  return (
    <header className="bg-[#13131A]/85 backdrop-blur-md border-b border-white/5 py-3.5 px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Title */}
      <div className="min-w-0">
        <h1 className="text-sm font-bold text-white tracking-wide truncate">{title}</h1>
        <p className="text-[10px] text-textSecondary truncate">Campus Covoiturage Console</p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-3.5">
        {/* Notifications */}
        <button className="relative p-2 text-textSecondary hover:text-white bg-white/5 border border-white/5 rounded-xl transition-all duration-200">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-accent rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-white/5"></div>

        {/* User profile */}
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-tr from-primary to-accent p-0.5 rounded-full shadow-md shadow-primary/10">
            <div className="bg-surface p-1 rounded-full">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div className="text-left max-w-[70px]">
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-bold text-white truncate max-w-[50px]">{initialName}</span>
              <Shield className="h-3 w-3 text-accent shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
