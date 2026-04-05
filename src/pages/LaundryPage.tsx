import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Shirt, Clock, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export const LaundryPage = () => {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetch('/api/laundry').then(res => res.json()).then(setData);
  }, []);

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Laundry Service</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-pastel-blue/10 flex flex-col items-center justify-center p-6 gap-2">
          <Users size={32} className="text-pastel-blue" />
          <p className="text-2xl font-bold">{data?.queueCount}</p>
          <p className="text-[10px] font-bold text-secondary-text uppercase tracking-wider">People Ahead</p>
        </div>
        <div className="card bg-lavender/10 flex flex-col items-center justify-center p-6 gap-2">
          <Clock size={32} className="text-lavender" />
          <p className="text-lg font-bold text-center leading-tight">{data?.estimatedReturn}</p>
          <p className="text-[10px] font-bold text-secondary-text uppercase tracking-wider">Est. Return</p>
        </div>
      </div>

      <div className="card bg-white border-2 border-dashed border-lavender/30 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-lavender/10 flex items-center justify-center text-lavender shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1">Smart Suggestion</h3>
          <p className="text-xs text-secondary-text leading-relaxed">
            {data?.suggestion}. The queue is currently long, and processing might take more than 3 hours.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-bold ml-1">My Laundry Status</h3>
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Token #452</p>
              <p className="text-[10px] text-secondary-text">Given: Yesterday, 4:00 PM</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">Ready for Pickup</span>
          </div>
          <div className="h-px bg-gray-50"></div>
          <div className="flex items-center justify-between opacity-50">
            <div>
              <p className="text-sm font-bold">Token #410</p>
              <p className="text-[10px] text-secondary-text">Given: 3 days ago</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">Collected</span>
          </div>
        </div>
      </section>

      <button 
        onClick={() => showNotification("Laundry pickup has been requested! Our team will collect it from your room soon. 🧺✨", 'success')}
        className="w-full h-14 bg-lavender text-white rounded-2xl font-bold text-lg soft-shadow active:scale-95 transition-all"
      >
        Request Pickup
      </button>
    </div>
  );
};
