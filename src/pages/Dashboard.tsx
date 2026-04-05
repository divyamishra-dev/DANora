import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Utensils,
  Shirt,
  ClipboardList,
  MapPin,
  Moon,
  ChevronRight,
  Clock,
  Users,
  CloudSun,
  HeartPulse,
  Home
} from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(savedUser));

    // Mock insights
    setInsights([
      { id: 0, icon: CloudSun, title: 'Weather Update', text: '28°C, Partly Cloudy. Good for outing!', color: 'bg-pastel-blue/10' },
      { id: 1, icon: Shirt, title: 'Laundry Insight', text: '15 people ahead (~3 hrs wait)', color: 'bg-pastel-blue/20' },
      { id: 2, icon: Clock, title: 'Outing Insight', text: '2 hrs left before 7 PM deadline', color: 'bg-blush/20' },
      { id: 3, icon: Users, title: 'Crowd Insight', text: 'Mess is crowded right now', color: 'bg-lavender/20' },
    ]);
  }, [navigate]);

  if (!user) return null;

  const quickAccess = [
    { icon: MessageSquare, label: 'Complaints', path: '/complaints', color: 'text-lavender' },
    { icon: Utensils, label: 'Mess', path: '/mess', color: 'text-blush' },
    { icon: Shirt, label: 'Laundry', path: '/laundry', color: 'text-pastel-blue' },
    { icon: ClipboardList, label: 'Notices', path: '/notices', color: 'text-lavender' },
    { icon: MapPin, label: 'Outing', path: '/outing', color: 'text-blush' },
    { icon: Moon, label: 'Night Care', path: '/night-care', color: 'text-pastel-blue' },
    { icon: HeartPulse, label: 'Health SOS', path: '/health-sos', color: 'text-sos' },
    { icon: Home, label: 'Room Service', path: '/room-service', color: 'text-lavender' },
  ];

  return (
    <div className="pb-24 pt-20 px-4 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-1"
      >
        <h2 className="text-2xl font-bold">Hi, {user.name}</h2>
        <p className="text-secondary-text">Welcome back, we’ve got you 💖</p>
        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-secondary-text">
          <span className="bg-white px-3 py-1 rounded-full soft-shadow">
            {format(new Date(), 'EEEE, do MMMM')}
          </span>
          <span className="bg-white px-3 py-1 rounded-full soft-shadow">
            {user.hostelBlock} • Room {user.roomNumber}
          </span>
        </div>
      </motion.div>

      {/* Quick Access Grid */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold ml-1">Quick Access</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickAccess.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="card flex flex-col items-center justify-center gap-2 aspect-square active:scale-95 transition-all p-2"
            >
              <item.icon size={24} className={item.color} />
              <span className="text-[9px] font-bold text-secondary-text text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Smart Insights */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold ml-1">Smart Insights</h3>
        <div className="space-y-3">
          {insights?.map((insight: any) => (
            <div key={insight.id} className={`card flex items-center gap-4 ${insight.color}`}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lavender">
                <insight.icon size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold">{insight.title}</h4>
                <p className="text-[11px] text-secondary-text">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between ml-1">
          <h3 className="text-lg font-bold">My Activity</h3>
          <button 
            onClick={() => navigate('/activity')}
            className="text-xs text-lavender font-bold"
          >
            View All
          </button>
        </div>
        <div className="card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="flex-1">
              <p className="text-xs font-bold">Complaint #1234 Status Update</p>
              <p className="text-[10px] text-secondary-text">Status changed to "In Progress"</p>
            </div>
            <span className="text-[10px] text-secondary-text">2h ago</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div className="flex-1">
              <p className="text-xs font-bold">Room Cleaning</p>
              <p className="text-[10px] text-secondary-text">Cleaned today at 11:30 AM</p>
            </div>
            <span className="text-[10px] text-secondary-text">4h ago</span>
          </div>
        </div>
      </section>
    </div>
  );
};
