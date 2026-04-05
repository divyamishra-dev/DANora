import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export const LoginPage = () => {
  const [regNumber, setRegNumber] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNumber })
      });
      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen sky-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-[32px] p-8 soft-shadow"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-lavender">DAN</span>
            <span className="text-secondary-text font-medium">ora</span>
          </h1>
          <p className="text-secondary-text">Your safe haven in the hostel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2 ml-1">
              Registration Number
            </label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="e.g. 21BCE0001"
              className="w-full h-14 px-6 rounded-2xl bg-warm-bg border-none focus:ring-2 focus:ring-lavender transition-all outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full h-14 bg-lavender text-white rounded-2xl font-bold text-lg soft-shadow hover:opacity-90 transition-all"
          >
            Enter DANora
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-secondary-text">
          By entering, you agree to our safety guidelines 💖
        </div>
      </motion.div>
    </div>
  );
};
