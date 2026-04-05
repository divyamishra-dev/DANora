import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopBar = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-40 px-4 flex items-center justify-between soft-shadow">
      <button className="p-2 text-secondary-text">
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold tracking-tight">
        <span className="text-lavender">DAN</span>
        <span className="text-secondary-text font-medium">ora</span>
      </h1>
      <div className="flex items-center gap-2">
        <button className="p-2 text-secondary-text relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-sos rounded-full border-2 border-white"></span>
        </button>
        <button onClick={() => navigate('/profile')} className="p-2 text-secondary-text">
          <User size={24} />
        </button>
      </div>
    </div>
  );
};
