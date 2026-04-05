import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SOSButton = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const startHold = () => {
    setIsHolding(true);
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          triggerSOS();
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  const stopHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const triggerSOS = async () => {
    stopHold();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await fetch('/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString()
            })
          });
          alert('SOS Alert Sent! Help is on the way.');
        } catch (error) {
          console.error('SOS failed', error);
        }
      });
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <motion.button
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={startHold}
        onTouchEnd={stopHold}
        whileTap={{ scale: 0.9 }}
        className="relative w-16 h-16 bg-sos rounded-full flex items-center justify-center text-white soft-shadow overflow-hidden"
      >
        <AnimatePresence>
          {isHolding && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${progress}%` }}
              className="absolute bottom-0 left-0 w-full bg-red-700/30 pointer-events-none"
            />
          )}
        </AnimatePresence>
        <AlertCircle size={32} />
      </motion.button>
      {isHolding && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-sos text-white text-xs px-2 py-1 rounded-full">
          Hold to Alert
        </div>
      )}
    </div>
  );
};
