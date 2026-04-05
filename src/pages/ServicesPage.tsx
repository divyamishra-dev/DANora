import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Utensils, Shirt, MapPin, Moon, HeartPulse } from 'lucide-react';

export const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    { id: 'mess', icon: Utensils, label: 'Mess Service', path: '/mess', color: 'bg-lavender/10 text-lavender', description: 'Check daily menu and night mess availability' },
    { id: 'laundry', icon: Shirt, label: 'Laundry Service', path: '/laundry', color: 'bg-blush/10 text-blush', description: 'Track your laundry status and queue' },
    { id: 'outing', icon: MapPin, label: 'Outing Service', path: '/outing', color: 'bg-pastel-blue/10 text-pastel-blue', description: 'Manage your campus leave and deadlines' },
    { id: 'night-care', icon: Moon, label: 'Night Care', path: '/night-care', color: 'bg-lavender/10 text-lavender', description: 'Activate automated safety monitoring' },
    { id: 'health-sos', icon: HeartPulse, label: 'Health SOS', path: '/health-sos', color: 'bg-sos/10 text-sos', description: 'Immediate AI medical advice and emergency help' },
  ];

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <h2 className="text-2xl font-bold ml-1">Our Services</h2>
      <p className="text-xs text-secondary-text ml-1">Everything you need for a comfortable stay 💖</p>

      <div className="space-y-4">
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(service.path)}
            className="card w-full flex items-center gap-4 text-left active:scale-[0.98] transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${service.color}`}>
              <service.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">{service.label}</h3>
              <p className="text-[10px] text-secondary-text">{service.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
