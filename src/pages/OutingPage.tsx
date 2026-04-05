import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isWeekend } from 'date-fns';
import { useNotification } from '../context/NotificationContext';

export const OutingPage = () => {
  const [outing, setOuting] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const isWknd = isWeekend(new Date());
  const allowedHours = isWknd ? 4 : 2;
  const allowedMs = allowedHours * 3600000;

  const fetchStatus = async () => {
    const res = await fetch('/api/outing');
    const data = await res.json();
    setOuting(data);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (!outing?.isOut || !outing?.leaveTime) {
      setElapsedTime('0h 0m 0s');
      setPercent(0);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const leave = new Date(outing.leaveTime);
      const diff = now.getTime() - leave.getTime();

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${h}h ${m}m ${s}s`);
      
      const p = Math.min((diff / allowedMs) * 100, 100);
      setPercent(p);
    }, 1000);

    return () => clearInterval(timer);
  }, [outing, allowedMs]);

  const startOuting = async () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours < 7) {
      showNotification("Outing is not allowed before 7:00 AM. Please wait until then.", 'warning');
      return;
    }
    if (hours >= 19) {
      showNotification("Outing is not allowed after 7:00 PM. Please stay safe inside.", 'warning');
      return;
    }

    const res = await fetch('/api/outing/start', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setOuting(data);
      showNotification('Outing started successfully', 'success');
    } else {
      const err = await res.json();
      showNotification(err.error, 'error');
    }
  };

  const endOuting = async () => {
    const res = await fetch('/api/outing/end', { method: 'POST' });
    const data = await res.json();
    setOuting(data);
    showNotification('Outing ended. Welcome back!', 'info');
  };

  const holidays: Record<number, string> = {
    2: 'Mahavir Jayanti',
    3: 'Good Friday',
    10: 'Eid-ul-Fitr',
  };

  const isHoliday = (day: number) => !!holidays[day];
  const isWeekendDay = (day: number) => {
    const date = new Date(2026, 3, day); // April 2026
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const getAllowedHours = (day: number) => (isHoliday(day) || isWeekendDay(day)) ? 4 : 2;

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentDay = new Date().getDate();

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
        <h2 className="text-xl font-bold">Outing Service</h2>
      </div>

      {/* Outing Control */}
      {!outing?.isOut ? (
        <div className="card sky-gradient text-white p-8 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <MapPin size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Ready to leave?</h3>
            <p className="text-xs opacity-90">Your timer will start once you leave the campus.</p>
          </div>
          <button
            onClick={startOuting}
            className="w-full h-14 bg-white text-lavender rounded-2xl font-bold text-lg soft-shadow active:scale-95 transition-all"
          >
            Start Outing
          </button>
        </div>
      ) : (
        <div className="card sky-gradient text-white p-8 flex flex-col items-center text-center space-y-6">
          <p className="text-sm font-medium opacity-90">Time Elapsed</p>
          <h3 className="text-5xl font-black tracking-tighter">{elapsedTime}</h3>
          
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className={`h-full ${percent > 90 ? 'bg-sos' : 'bg-white'}`}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <Clock size={14} />
            <span>Left at {format(new Date(outing.leaveTime), 'hh:mm a')}</span>
          </div>

          <button
            onClick={endOuting}
            className="w-full h-14 bg-white/20 border-2 border-white text-white rounded-2xl font-bold text-lg active:scale-95 transition-all"
          >
            End Outing
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-white space-y-2">
          <p className="text-[10px] font-bold text-secondary-text uppercase">Time Used Today</p>
          <p className="text-xl font-bold text-lavender">{formatMs(outing?.timeUsedTodayMs || 0)}</p>
          <p className="text-[10px] text-secondary-text">Total Outing Time</p>
        </div>
        <div className="card bg-white space-y-2">
          <p className="text-[10px] font-bold text-secondary-text uppercase">Allowed Duration</p>
          <p className="text-xl font-bold text-blush">{getAllowedHours(currentDay)} Hours</p>
          <p className="text-[10px] text-secondary-text">Today's Limit</p>
        </div>
      </div>

      {/* Academic Calendar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between ml-1">
          <h3 className="text-lg font-bold">Academic Calendar</h3>
          <span className="text-xs font-bold text-lavender">{format(new Date(), 'MMMM yyyy')}</span>
        </div>
        <div className="card p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-[10px] font-bold text-secondary-text text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const isToday = day === currentDay;
              const isHoli = isHoliday(day);
              const isWknd = isWeekendDay(day);
              return (
                <div 
                  key={day} 
                  onClick={() => isHoli && showNotification(`${holidays[day]}: 4 hours outing allowed!`, 'info')}
                  className={`aspect-square flex items-center justify-center text-[10px] rounded-lg font-bold transition-all ${
                    isToday ? 'bg-lavender text-white soft-shadow scale-110' : 
                    isHoli ? 'bg-yellow-100 text-yellow-600' :
                    isWknd ? 'bg-blush/20 text-blush' : 'text-secondary-text'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-bold text-secondary-text">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-lavender"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blush/20"></div>
              <span>Weekend (4h)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-100"></div>
              <span>Holiday (4h)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold ml-1">Strict Rules</h3>
        <div className="space-y-3">
          <div className="card flex items-start gap-3 border-l-4 border-sos">
            <AlertCircle size={20} className="text-sos shrink-0" />
            <p className="text-xs text-secondary-text leading-relaxed">
              Must enter <span className="font-bold text-primary-text">Hostel Campus</span> before <span className="font-bold text-primary-text">7:00 PM</span> regardless of leave time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
