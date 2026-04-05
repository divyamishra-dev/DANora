import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotification } from '../context/NotificationContext';

export const RoomServicePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isRequested, setIsRequested] = useState(false);
  const [eta, setEta] = useState<number | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleRequest = () => {
    setIsRequested(true);
    const randomEta = Math.floor(Math.random() * 15) + 10; // 10-25 mins
    setEta(randomEta);
    showNotification(`Room help requested for Room ${user?.roomNumber}`, 'success');
  };

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Room Service</h2>
      </div>

      <div className="card sky-gradient text-white p-8 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
          <Home size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Room {user?.roomNumber}</h3>
          <p className="text-xs opacity-90">Need cleaning or maintenance help? We're here for you.</p>
        </div>
        
        {!isRequested ? (
          <button
            onClick={handleRequest}
            className="w-full h-14 bg-white text-lavender rounded-2xl font-bold text-lg soft-shadow active:scale-95 transition-all"
          >
            Request Room Help
          </button>
        ) : (
          <div className="w-full h-14 bg-white/20 border-2 border-white rounded-2xl flex items-center justify-center gap-2 font-bold">
            <CheckCircle2 size={20} />
            <span>Help is on the way!</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isRequested && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lavender/10 flex items-center justify-center text-lavender">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Estimated Arrival</h4>
                  <p className="text-[10px] text-secondary-text">Staff is being assigned</p>
                </div>
              </div>
              <span className="text-xl font-black text-lavender">{eta}m</span>
            </div>
            <div className="p-4 bg-warm-bg rounded-2xl flex items-start gap-3">
              <Sparkles size={18} className="text-blush shrink-0" />
              <p className="text-[11px] text-secondary-text leading-relaxed">
                A room service professional will arrive at <span className="font-bold text-primary-text">Room {user?.roomNumber}</span> within {eta} minutes. Please ensure someone is present.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-4">
        <h3 className="text-lg font-bold ml-1">Service Guidelines</h3>
        <div className="space-y-3">
          <div className="card bg-white p-4 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-lavender mt-1.5 shrink-0"></div>
            <p className="text-xs text-secondary-text">Daily cleaning is available between 9:00 AM and 5:00 PM.</p>
          </div>
          <div className="card bg-white p-4 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blush mt-1.5 shrink-0"></div>
            <p className="text-xs text-secondary-text">For urgent maintenance (leaks, electrical), help is sent within 15-30 minutes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
