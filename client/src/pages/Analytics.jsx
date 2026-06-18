import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Analytics = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/content/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Compute metrics
  const totalGenerations = history.length;
  const wordsGenerated = history.length * 450; // estimate based on average output

  // Platform Distribution
  const allPlatforms = history.flatMap(h => h.platforms);
  const platformCounts = allPlatforms.reduce((acc, platform) => {
    const p = platform.toLowerCase();
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const getPlatformPercentage = (count) => {
    if (allPlatforms.length === 0) return 0;
    return Math.round((count / allPlatforms.length) * 100);
  };

  // Tone Distribution
  const toneCounts = history.reduce((acc, h) => {
    acc[h.tone] = (acc[h.tone] || 0) + 1;
    return acc;
  }, {});

  const getTonePercentage = (count) => {
    if (history.length === 0) return 0;
    return Math.round((count / history.length) * 100);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col">
      <header className="h-20 border-b border-dark-border flex items-center px-8 bg-dark-bg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">Measure your content engine performance.</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <div className="text-slate-400 font-medium text-xs tracking-wider uppercase mb-2">Total Outputs</div>
            <div className="text-4xl font-bold">{loading ? '-' : totalGenerations}</div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <div className="text-slate-400 font-medium text-xs tracking-wider uppercase mb-2">Words Synthesized</div>
            <div className="text-4xl font-bold">{loading ? '-' : `${(wordsGenerated / 1000).toFixed(1)}k`}</div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <div className="text-slate-400 font-medium text-xs tracking-wider uppercase mb-2">Avg. Cost / Post</div>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-bold">₹0.00</div>
              <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded mb-1">Free API</div>
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 relative overflow-hidden">
             <div className="text-slate-400 font-medium text-xs tracking-wider uppercase mb-2">System Status</div>
             <div className="text-2xl font-bold text-accent-500 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500 animate-pulse"></div>
                OPTIMAL
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Platform Distribution Bar Chart */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6">Distribution by Platform</h3>
            
            <div className="space-y-6">
              {[
                { name: 'LinkedIn', key: 'linkedin', color: 'bg-accent-500', text: 'text-accent-400' },
                { name: 'Twitter / X', key: 'twitter', color: 'bg-primary-500', text: 'text-primary-400' },
                { name: 'Instagram', key: 'instagram', color: 'bg-[#e879f9]', text: 'text-[#e879f9]' },
                { name: 'Email', key: 'email', color: 'bg-emerald-500', text: 'text-emerald-400' }
              ].map((platform) => {
                const count = platformCounts[platform.key] || 0;
                const percentage = getPlatformPercentage(count);
                
                return (
                  <div key={platform.key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-200">{platform.name}</span>
                      <span className={`font-bold ${platform.text}`}>{percentage}% <span className="text-slate-500 text-xs font-normal ml-1">({count})</span></span>
                    </div>
                    <div className="h-3 w-full bg-[#0B0F19] rounded-full overflow-hidden border border-dark-border">
                      <div className={`h-full ${platform.color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            {allPlatforms.length === 0 && !loading && (
               <div className="mt-6 text-center text-sm text-slate-500 bg-[#0B0F19] border border-dark-border py-4 rounded-xl">
                 No platform data available yet.
               </div>
            )}
          </div>

          {/* Tone Breakdown */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6">Brand Voice Consistency</h3>
            
            <div className="space-y-5">
              {['Professional', 'Casual', 'Humorous', 'Inspirational', 'Aggressive'].map((tone) => {
                const count = toneCounts[tone] || 0;
                const percentage = getTonePercentage(count);
                
                if (percentage === 0 && history.length > 0) return null; // Hide unused tones if there's data

                return (
                  <div key={tone} className="flex items-center gap-4">
                    <div className="w-28 text-sm font-medium text-slate-300">{tone}</div>
                    <div className="flex-1 h-8 bg-[#0B0F19] border border-dark-border rounded-lg overflow-hidden flex">
                      <div className="h-full bg-slate-700 transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="w-12 text-right text-sm font-bold text-slate-400">{percentage}%</div>
                  </div>
                );
              })}
            </div>

            {history.length === 0 && !loading && (
               <div className="mt-6 text-center text-sm text-slate-500 bg-[#0B0F19] border border-dark-border py-4 rounded-xl">
                 No tone data available yet.
               </div>
            )}
          </div>

        </div>

        {/* Growth Chart Placeholder */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Content Velocity</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 py-1 bg-[#0B0F19] rounded-md border border-dark-border">Last 30 Days</span>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 border-b border-dark-border pb-4 relative">
            {/* Y-axis lines */}
            <div className="absolute w-full border-t border-slate-800/50 top-0"></div>
            <div className="absolute w-full border-t border-slate-800/50 top-[33%]"></div>
            <div className="absolute w-full border-t border-slate-800/50 top-[66%]"></div>

            {/* Real Data Bars */}
            {Array.from({length: 30}).map((_, i) => {
              // Calculate the date for this specific bar (i=0 is 29 days ago, i=29 is today)
              const daysAgo = 29 - i;
              const dateForBar = new Date();
              dateForBar.setDate(dateForBar.getDate() - daysAgo);
              
              // Count how many history items match this date
              const countForDay = history.filter(h => {
                const hDate = new Date(h.createdAt);
                return hDate.getDate() === dateForBar.getDate() && 
                       hDate.getMonth() === dateForBar.getMonth() && 
                       hDate.getFullYear() === dateForBar.getFullYear();
              }).length;

              // Find max items in a single day to normalize the height (min height 5% so it's visible, max 100%)
              const maxCount = Math.max(...Array.from({length: 30}).map((_, j) => {
                  const d = new Date(); d.setDate(d.getDate() - (29 - j));
                  return history.filter(h => new Date(h.createdAt).toDateString() === d.toDateString()).length;
              }), 1);

              const heightPercentage = countForDay === 0 ? 5 : Math.max(10, (countForDay / maxCount) * 100);

              return (
                <div key={i} className="h-full w-full flex justify-center items-end group relative z-10">
                   {/* Hover Tooltip */}
                   <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-50">
                     {countForDay} Posts
                     <div className="text-slate-500 font-normal">{dateForBar.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                   </div>
                   <div 
                    className={`w-full max-w-[16px] rounded-t-sm transition-all duration-500 ${countForDay > 0 ? 'bg-primary-500 border-t border-l border-r border-primary-400 group-hover:bg-primary-400' : 'bg-primary-900/20 group-hover:bg-primary-800/50'}`} 
                    style={{ height: `${heightPercentage}%` }}
                   ></div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-4 px-2 font-medium">
             <span>Start of Month</span>
             <span>Today</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Analytics;
