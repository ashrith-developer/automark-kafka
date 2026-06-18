import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const Scheduler = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/content/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Create an array for the calendar grid (starting Monday)
  const days = [];
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getHistoryForDay = (day) => {
    if (!day) return [];
    return history.filter(h => {
      const d = new Date(h.scheduledFor || h.createdAt);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-dark-border flex items-center justify-between px-8 bg-dark-bg">
        <div>
          <p className="text-[10px] font-bold text-accent-500 uppercase tracking-widest mb-0.5">CONTENT CALENDAR</p>
          <h1 className="text-2xl font-bold tracking-tight">Campaign Scheduler</h1>
        </div>
        <div className="flex bg-[#0B0F19] border border-dark-border rounded-lg p-1">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-slate-800 text-white">Month</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"><ChevronRight size={20} /></button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent-500"></div> Generated Content</span>
            </div>
          </div>

          <div className="grid grid-cols-7 border-t border-l border-dark-border rounded-lg overflow-hidden">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <div key={day} className="p-3 border-r border-b border-dark-border bg-[#0B0F19] text-center text-xs font-bold text-slate-500 tracking-widest">{day}</div>
            ))}
            
            {/* Calendar Grid */}
            {days.map((day, i) => {
              const dayHistory = getHistoryForDay(day);
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div key={i} className={`min-h-[120px] p-2 border-r border-b border-dark-border ${isToday ? 'bg-primary-900/10 border-primary-500/30' : 'bg-dark-surface hover:bg-white/5 transition-colors'} ${!day ? 'opacity-50' : ''}`}>
                  {day && (
                    <span className={`text-sm font-medium ${isToday ? 'text-primary-400' : 'text-slate-400'}`}>{day}</span>
                  )}
                  
                  {/* Generated Content for this day */}
                  <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
                    {dayHistory.map((item, idx) => (
                      <div key={idx} className="text-[10px] p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium truncate" title={item.productDescription}>
                        <span className="font-bold text-accent-400 mr-1">{item.platforms[0]?.charAt(0)}:</span> 
                        {item.productDescription.substring(0, 20)}...
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scheduler;
