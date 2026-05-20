import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  AlertTriangle,
  Menu
} from 'lucide-react';

interface BottomNavProps {
  onMoreClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onMoreClick }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Rides', path: '/rides', icon: Car },
    { name: 'Reports', path: '/reports', icon: AlertTriangle },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#13131A]/90 backdrop-blur-lg border-t border-white/5 flex items-center justify-around px-4 z-40 rounded-b-[38px] overflow-hidden select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-primary scale-110'
                : 'text-textSecondary hover:text-white'
            }`}
          >
            <Icon className="h-5.5 w-5.5" />
            <span className="text-[10px] font-semibold mt-1 tracking-wide">{item.name}</span>
          </NavLink>
        );
      })}

      {/* "More" Drawer Trigger */}
      <button
        onClick={onMoreClick}
        className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-textSecondary hover:text-white transition-all duration-200"
      >
        <Menu className="h-5.5 w-5.5" />
        <span className="text-[10px] font-semibold mt-1 tracking-wide">More</span>
      </button>
    </div>
  );
};

export default BottomNav;
