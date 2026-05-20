import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CreditCard,
  Users2,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MoreDrawer: React.FC<MoreDrawerProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  const extraItems = [
    { name: 'Stripe Payments Ledger', path: '/payments', icon: CreditCard, color: 'text-info bg-blue-500/10' },
    { name: 'State Pools (1-58)', path: '/groups', icon: Users2, color: 'text-accent bg-accent/10' },
    { name: 'Control Center Rules', path: '/settings', icon: Settings, color: 'text-primary bg-primary/10' },
  ];

  return (
    <div className="absolute inset-0 z-50 overflow-hidden select-none">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 rounded-[38px]"
      />

      {/* Slide up sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#13131A] border-t border-white/10 rounded-t-3xl p-6 pb-8 animate-slide-up z-10 shadow-2xl">
        {/* Bezel drag handle pill */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

        {/* Drawer header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-white text-base">Control Console</h3>
            <p className="text-xs text-textSecondary mt-0.5">Additional management subpages</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/5 border border-white/5 rounded-full text-textSecondary hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Content - Links */}
        <div className="space-y-3">
          {extraItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 border-primary/20 text-white'
                      : 'bg-white/[0.02] border-white/5 text-textSecondary hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border border-white/5 ${item.color}`}>
                    <Icon className="h-4.5 w-4.5 text-inherit" />
                  </div>
                  <span className="font-semibold text-sm text-white">{item.name}</span>
                </div>
              </NavLink>
            );
          })}

          {/* Divider */}
          <div className="h-px bg-white/5 my-4" />

          {/* Logout Action */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center justify-between w-full p-3.5 bg-emergency/10 border border-emergency/20 text-emergency hover:bg-emergency/15 transition-all duration-200 rounded-2xl"
          >
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-emergency/10">
                <LogOut className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-sm">Sign Out Securely</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreDrawer;
