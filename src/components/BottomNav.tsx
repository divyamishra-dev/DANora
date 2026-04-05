import React from 'react';
import { Home, Grid, Shield, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Grid, label: 'Services', path: '/services' },
    { icon: Shield, label: 'Safety', path: '/night-care' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 px-6 flex items-center justify-between z-40">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1"
          >
            <item.icon
              size={24}
              className={cn(
                isActive ? 'text-lavender' : 'text-secondary-text'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-medium',
                isActive ? 'text-lavender' : 'text-secondary-text'
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
