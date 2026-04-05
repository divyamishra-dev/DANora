import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none space-y-2">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl soft-shadow border backdrop-blur-md ${
                n.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                n.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
                n.type === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
                'bg-white border-gray-100 text-primary-text'
              }`}
            >
              <div className="shrink-0">
                {n.type === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
                {n.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                {n.type === 'warning' && <AlertCircle size={20} className="text-yellow-500" />}
                {n.type === 'info' && <Info size={20} className="text-lavender" />}
              </div>
              <p className="text-xs font-bold flex-1">{n.message}</p>
              <button onClick={() => removeNotification(n.id)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
