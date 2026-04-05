import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Send, Shield, AlertCircle, Bot, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotification } from '../context/NotificationContext';

export const HealthSOS = () => {
  const [issue, setIssue] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'advice'>('input');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleEmergency = async () => {
    if (!issue.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/health/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue })
      });
      const data = await res.json();
      setAdvice(data.advice);
      setStep('advice');
      
      // Simulate notifying authorities
      setTimeout(() => {
        showNotification("Authorities and nearest hospital have been notified. Help is on the way! 🚑", 'error');
      }, 1000);
    } catch (error) {
      console.error('Emergency request failed', error);
      showNotification('Failed to send emergency alert. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Health SOS</h2>
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="card sky-gradient text-white p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <HeartPulse size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Medical Emergency?</h3>
                <p className="text-xs opacity-90">Describe your issue below. We'll notify the warden and provide immediate AI first-aid advice.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card space-y-4">
                <label className="text-[10px] font-bold text-secondary-text uppercase ml-1">What is your emergency?</label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g. I have a severe headache and dizziness..."
                  className="w-full h-32 p-4 bg-warm-bg rounded-2xl border-none focus:ring-2 focus:ring-sos/20 outline-none text-sm font-medium resize-none"
                />
                <button
                  onClick={handleEmergency}
                  disabled={loading || !issue.trim()}
                  className="w-full h-14 bg-sos text-white rounded-2xl font-bold text-lg soft-shadow active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Notify Authorities</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="card flex items-start gap-4 bg-yellow-50 border-l-4 border-yellow-400">
              <AlertCircle size={20} className="text-yellow-600 shrink-0" />
              <p className="text-[11px] text-yellow-700 leading-relaxed">
                By clicking "Notify Authorities", your live location and room number will be shared with the hostel warden and medical team.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="advice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card bg-green-50 border-l-4 border-green-500 flex items-center gap-4">
              <Shield size={24} className="text-green-600" />
              <div>
                <h3 className="text-sm font-bold text-green-800">Authorities Notified</h3>
                <p className="text-[10px] text-green-700">Medical team is on the way to Room 302.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 ml-1">
                <Bot size={20} className="text-lavender" />
                <h3 className="text-lg font-bold">AI First-Aid Advice</h3>
              </div>
              <div className="card bg-white p-6 space-y-4 leading-relaxed text-sm text-secondary-text">
                {advice?.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('input')}
              className="w-full h-14 bg-white text-secondary-text border-2 border-gray-100 rounded-2xl font-bold text-lg active:scale-95 transition-all"
            >
              Back to SOS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
