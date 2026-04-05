import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shirt, MapPin, MessageSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const ActivityPage = () => {
  const navigate = useNavigate();
  const [outing, setOuting] = useState<any>(null);

  useEffect(() => {
    fetch('/api/outing').then(res => res.json()).then(setOuting);
  }, []);

  const activities = [
    { id: 1, icon: MessageSquare, title: 'Complaint #1234', desc: 'Status updated to "In Progress"', time: '2h ago', color: 'bg-lavender/10 text-lavender' },
    { id: 2, icon: Shirt, title: 'Laundry Pickup', desc: 'Requested for Token #452', time: '4h ago', color: 'bg-blush/10 text-blush' },
    { id: 3, icon: MapPin, title: 'Outing Started', desc: 'Left campus at 5:30 PM', time: 'Yesterday', color: 'bg-pastel-blue/10 text-pastel-blue' },
    { id: 4, icon: Shirt, title: 'Laundry Delivered', desc: 'Token #410 is ready', time: '3 days ago', color: 'bg-lavender/10 text-lavender' },
  ];

  const formatMs = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">My Activity</h2>
      </div>

      <div className="card sky-gradient text-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Outing Used Today</p>
          <Clock size={16} className="opacity-80" />
        </div>
        <h3 className="text-4xl font-black">{formatMs(outing?.timeUsedTodayMs || 0)}</h3>
        <p className="text-[10px] opacity-80">Total duration across all outings today</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold ml-1">Recent History</h3>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${activity.color}`}>
                <activity.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">{activity.title}</h4>
                  <span className="text-[10px] text-secondary-text">{activity.time}</span>
                </div>
                <p className="text-[11px] text-secondary-text mt-0.5">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
