import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ThumbsUp, ThumbsDown, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export const MessPage = () => {
  const [activeTab, setActiveTab] = useState('Veg');
  const [messData, setMessData] = useState<any>(null);
  const [userVotes, setUserVotes] = useState<Record<string, string | null>>({});
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetch('/api/mess').then(res => res.json()).then(data => {
      setMessData(data.messData);
      setUserVotes(data.userVotes);
    });
  }, []);

  const tabs = ['Veg', 'Non-Veg', 'Special', 'Night Mess'];

  const handleVote = async (itemId: string, type: 'like' | 'dislike') => {
    try {
      const res = await fetch('/api/mess/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: activeTab.toLowerCase().replace('-', ''), itemId, type })
      });
      const data = await res.json();
      setMessData(data.messData);
      setUserVotes(data.userVotes);
      
      const item = [...messData.veg, ...messData.nonVeg, ...messData.special].find(i => i.id === itemId);
      if (item) {
        const voteText = data.userVotes[itemId] === type ? `Voted ${type} for ${item.name}` : `Removed ${type} from ${item.name}`;
        showNotification(voteText, 'info');
      }
    } catch (error) {
      console.error('Vote failed', error);
      showNotification('Failed to record vote', 'error');
    }
  };

  const isNightMessTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    const startTime = 22 * 60 + 30; // 10:30 PM
    const endTime = 24 * 60; // 12:00 AM
    return currentTime >= startTime && currentTime < endTime;
  };

  const getItems = () => {
    if (!messData) return [];
    const cat = activeTab.toLowerCase().replace('-', '') as keyof typeof messData;
    return messData[cat] || [];
  };

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Mess Menu</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-lavender text-white soft-shadow' : 'bg-white text-secondary-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab !== 'Night Mess' ? (
          <motion.div
            key="regular"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold">Today's Menu</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-lavender">
                <Clock size={14} />
                <span>Lunch • 12:30 PM</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {getItems().map((item: any) => (
                <div key={item.id} className="card space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <span className="text-[10px] bg-lavender/10 text-lavender px-2 py-0.5 rounded-full font-bold">Main Item</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleVote(item.id, 'like')}
                      className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 font-bold text-xs active:scale-95 transition-all ${
                        userVotes[item.id] === 'like' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600'
                      }`}
                    >
                      <ThumbsUp size={14} />
                      <span>{item.likes}</span>
                    </button>
                    <button 
                      onClick={() => handleVote(item.id, 'dislike')}
                      className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 font-bold text-xs active:scale-95 transition-all ${
                        userVotes[item.id] === 'dislike' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <ThumbsDown size={14} />
                      <span>{item.dislikes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="night"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className={`card ${isNightMessTime() ? 'bg-lavender/10 border-lavender/20' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-lavender" />
                <h3 className="font-bold">Night Mess Timing</h3>
              </div>
              <p className="text-xs text-secondary-text">10:30 PM - 12:00 AM</p>
              {!isNightMessTime() && (
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-sos">
                  <AlertCircle size={14} />
                  <span>Currently Closed</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold ml-1">Available Items</h3>
              <div className="grid grid-cols-1 gap-3">
                {messData?.nightMess?.map((item: any) => (
                  <div key={item.id} className="card flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                      <p className={`text-[10px] font-bold ${
                        item.status === 'Available' ? 'text-green-500' :
                        item.status === 'Running Low' ? 'text-yellow-500' : 'text-sos'
                      }`}>
                        {item.quantity}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'Available' ? 'bg-green-500' :
                      item.status === 'Running Low' ? 'bg-yellow-500' : 'bg-sos'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
