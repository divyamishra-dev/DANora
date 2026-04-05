import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Bell, Info, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NoticesPage = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/notices').then(res => res.json()).then(setNotices);
  }, []);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Urgent': return 'bg-sos/10 text-sos border-sos/20';
      case 'Maintenance': return 'bg-pastel-blue/10 text-pastel-blue border-pastel-blue/20';
      default: return 'bg-lavender/10 text-lavender border-lavender/20';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Urgent': return ShieldAlert;
      case 'Maintenance': return Info;
      default: return Bell;
    }
  };

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Notices</h2>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => {
          const Icon = getCategoryIcon(notice.category);
          return (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-l-4 border-l-lavender"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getCategoryColor(notice.category)}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-secondary-text">{notice.date}</span>
                  </div>
                  <h4 className="text-sm font-bold leading-tight">{notice.title}</h4>
                  <p className="text-[11px] text-secondary-text leading-relaxed">
                    This is a detailed description of the notice. Please read carefully and follow instructions.
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
