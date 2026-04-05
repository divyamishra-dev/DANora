import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Shield, MapPin, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export const NightCarePage = () => {
  const [isActive, setIsActive] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const canActivate = () => {
    const hours = new Date().getHours();
    return hours >= 1; // After 1 AM
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      // Safety check every 30 mins (1800000ms)
      interval = setInterval(() => {
        setShowCheck(true);
      }, 1800000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleMonitoring = () => {
    if (!canActivate()) {
      showNotification('Monitoring can only be activated after 1:00 AM', 'warning');
      return;
    }

    if (!isActive) {
      setIsActive(true);
      setShowCheck(true); // Show check immediately upon activation
      showNotification('Night monitoring activated', 'success');
    } else {
      setIsActive(false);
      setShowCheck(false);
      showNotification('Night monitoring deactivated', 'info');
    }
  };

  const handleResponse = async (safe: boolean) => {
    setShowCheck(false);
    if (!safe) {
      // Trigger SOS
      if (navigator.geolocation) {
        // Ask for location sharing explicitly as requested
        const confirmLocation = window.confirm("Would you like to share your live location with the warden for immediate help?");
        if (confirmLocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            await fetch('/api/sos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude, type: 'NightCare_Alert' })
            });
            showNotification('Emergency alert and live location sent to warden!', 'error');
          });
        } else {
          await fetch('/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'NightCare_Alert_No_Location' })
          });
          showNotification('Emergency alert sent to warden (Location not shared).', 'error');
        }
      }
    } else {
      await fetch('/api/night-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Safe' })
      });
      showNotification('Safety status updated. Stay safe!', 'success');
    }
  };

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Night Care</h2>
      </div>

      <div className={`card p-8 flex flex-col items-center text-center space-y-6 transition-all duration-500 ${
        isActive ? 'bg-lavender/10 border-lavender/30' : 'bg-white'
      }`}>
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive ? 'bg-lavender text-white scale-110' : 'bg-gray-100 text-gray-400'
        }`}>
          <Shield size={48} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{isActive ? 'Monitoring Active' : 'Night Monitoring'}</h3>
          <p className="text-xs text-secondary-text max-w-[200px] mx-auto">
            {isActive 
              ? 'We will check on you every 30 minutes to ensure you are safe.' 
              : 'Activate monitoring after 1 AM for automated safety checks.'}
          </p>
        </div>

        <button
          onClick={toggleMonitoring}
          className={`w-full h-14 rounded-2xl font-bold text-lg transition-all ${
            isActive ? 'bg-white text-lavender border-2 border-lavender' : 'bg-lavender text-white soft-shadow'
          }`}
        >
          {isActive ? 'Deactivate' : 'Activate Now'}
        </button>

        {!canActivate() && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-sos">
            <AlertCircle size={12} />
            <span>Available after 1:00 AM</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold ml-1">Features</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-pastel-blue/10 flex items-center justify-center text-pastel-blue">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold">Automated Checks</h4>
              <p className="text-[10px] text-secondary-text">Periodic "Are you safe?" prompts</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blush/10 flex items-center justify-center text-blush">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold">Live Location Sharing</h4>
              <p className="text-[10px] text-secondary-text">Shared with warden in case of emergency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Check Overlay */}
      <AnimatePresence>
        {showCheck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-lavender/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-white rounded-[32px] p-8 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-lavender/10 text-lavender rounded-full flex items-center justify-center mx-auto">
                <Shield size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Safety Check</h3>
                <p className="text-secondary-text">Are you safe, Divya? ✨</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleResponse(true)}
                  className="h-14 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  <span>Yes, I'm Safe</span>
                </button>
                <button
                  onClick={() => handleResponse(false)}
                  className="h-14 bg-sos text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <AlertCircle size={20} />
                  <span>No, Send SOS</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
