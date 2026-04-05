import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ComplaintsPage = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [complaints, setComplaints] = useState<any[]>([]);
  const navigate = useNavigate();

  const categories = [
    'AC Issue',
    'Water Issue',
    'Electrical Issue',
    'Furniture/Cupboard Issue'
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const res = await fetch('/api/complaints');
    const data = await res.json();
    setComplaints(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: category,
        description,
        priority,
        userId: user.regNumber
      })
    });
    setStep(3);
    fetchComplaints();
  };

  return (
    <div className="pb-24 pt-20 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')} className="p-2 bg-white rounded-full soft-shadow">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Complaints</h2>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold ml-1">Select Category</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setStep(2); }}
                  className="card w-full text-left flex items-center justify-between hover:bg-lavender/5 transition-colors"
                >
                  <span className="font-medium">{cat}</span>
                  <Plus size={18} className="text-lavender" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="card bg-lavender/10 border-lavender/20">
              <p className="text-xs font-bold text-lavender">Selected Category</p>
              <p className="text-lg font-bold">{category}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us more about the issue..."
                  className="w-full h-32 p-4 rounded-2xl bg-white soft-shadow border-none focus:ring-2 focus:ring-lavender outline-none resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${
                        priority === p ? 'bg-lavender text-white soft-shadow' : 'bg-white text-secondary-text'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full h-14 bg-white rounded-2xl flex items-center justify-center gap-2 text-secondary-text font-bold soft-shadow">
                <ImageIcon size={20} />
                <span>Upload Image (Optional)</span>
              </button>

              <button
                type="submit"
                className="w-full h-14 bg-lavender text-white rounded-2xl font-bold text-lg soft-shadow active:scale-95 transition-all"
              >
                Submit Complaint
              </button>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">Submitted!</h3>
              <p className="text-secondary-text">We'll get this fixed for you soon 💖</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-lavender text-white rounded-full font-bold soft-shadow"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-4 pt-4">
        <h3 className="text-lg font-bold ml-1">Recent Complaints</h3>
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">{c.type}</h4>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                  c.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                  c.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-secondary-text line-clamp-2 mb-2">{c.description}</p>
              <div className="flex justify-between items-center text-[10px] font-bold text-secondary-text">
                <span>Priority: {c.priority}</span>
                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
