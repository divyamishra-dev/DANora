import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, LogOut, Settings, Shield, Bell, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setEditName(userData.name);
    setEditBlock(userData.hostelBlock);
    setEditRoom(userData.roomNumber || '');
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, hostelBlock: editBlock, roomNumber: editRoom })
      });
      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      showNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Update failed', error);
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const menuItems = [
    { icon: Bell, label: 'Notifications', color: 'text-lavender' },
    { icon: Shield, label: 'Privacy & Safety', color: 'text-blush' },
    { icon: Settings, label: 'Account Settings', color: 'text-pastel-blue', onClick: () => setIsEditing(true) },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-lavender' },
  ];

  return (
    <div className="pb-24 pt-20 px-4 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Profile</h2>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-full sky-gradient p-1">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-lavender">
            {user.name.charAt(0)}
          </div>
        </div>
        
        {isEditing ? (
          <div className="w-full space-y-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white soft-shadow border-none focus:ring-2 focus:ring-lavender outline-none text-center font-bold"
              placeholder="Your Name"
            />
            <input
              type="text"
              value={editBlock}
              onChange={(e) => setEditBlock(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white soft-shadow border-none focus:ring-2 focus:ring-lavender outline-none text-center font-bold"
              placeholder="Hostel Block"
            />
            <input
              type="text"
              value={editRoom}
              onChange={(e) => setEditRoom(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white soft-shadow border-none focus:ring-2 focus:ring-lavender outline-none text-center font-bold"
              placeholder="Room Number"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 h-12 bg-lavender text-white rounded-xl font-bold soft-shadow"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 h-12 bg-white text-secondary-text rounded-xl font-bold soft-shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-secondary-text">{user.regNumber}</p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-lavender/10 text-lavender rounded-full text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-lavender animate-pulse"></span>
              {user.hostelBlock} • Room {user.roomNumber}
            </div>
          </div>
        )}
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <button 
            key={item.label} 
            onClick={item.onClick}
            className="card w-full flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold">{item.label}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full h-14 bg-sos/10 text-sos rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </button>

      <div className="text-center text-[10px] text-secondary-text">
        DANora v1.0.0 • Made with 💖 for students
      </div>
    </div>
  );
};
