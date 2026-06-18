import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

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

  // Mock analytics based on history length
  const totalCampaigns = history.length;
  const wordsGenerated = history.length * 450; // estimate
  const activePlatforms = new Set(history.flatMap(h => h.platforms)).size;

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col">
      {/* Top Header */}
      <header className="h-20 border-b border-dark-border flex items-center justify-between px-8 bg-dark-bg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage your marketing campaigns.</p>
        </div>
        <button 
          onClick={() => navigate('/generate')}
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center"
        >
          New Campaign
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 relative overflow-hidden group transition-colors">
            <div className="mb-4">
              <span className="text-slate-400 font-medium text-sm tracking-wider uppercase">Total Campaigns</span>
            </div>
            <h2 className="text-5xl font-bold mb-2 tracking-tight">{loading ? '-' : totalCampaigns}</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-accent-500 mt-4">
              <span>+12% this week</span>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 relative overflow-hidden group transition-colors">
             <div className="mb-4">
              <span className="text-slate-400 font-medium text-sm tracking-wider uppercase">Words Generated</span>
            </div>
            <h2 className="text-5xl font-bold mb-2 tracking-tight">{loading ? '-' : `${(wordsGenerated / 1000).toFixed(1)}k`}</h2>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-primary-500 to-[#e879f9] w-[65%]"></div>
            </div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 relative overflow-hidden group transition-colors">
             <div className="mb-4">
              <span className="text-slate-400 font-medium text-sm tracking-wider uppercase">Active Platforms</span>
            </div>
            <h2 className="text-5xl font-bold mb-2 tracking-tight">{loading ? '-' : activePlatforms}</h2>
            <div className="flex gap-2 mt-4 flex-wrap">
               {['LinkedIn', 'Twitter', 'Instagram', 'Email'].map((p, i) => (
                 <span key={i} className="px-2.5 py-1 rounded bg-[#0B0F19] border border-dark-border text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p}</span>
               ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Content Table/List */}
          <div className="lg:col-span-2 bg-dark-surface border border-dark-border rounded-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-dark-border flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Recent Generations</h3>
                <p className="text-sm text-slate-400 mt-1">Your latest crafted marketing assets.</p>
              </div>
              <Link to="/history" className="text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                View All
              </Link>
            </div>
            
            <div className="flex-1 p-6">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium">
                  Loading...
                </div>
              ) : history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-dark-border rounded-xl bg-[#0B0F19]">
                  <h4 className="text-lg font-bold text-white mb-2">No campaigns yet</h4>
                  <p className="text-slate-400 text-sm mb-6 max-w-sm">You haven't generated any content yet. Start your first campaign to see analytics and history here.</p>
                  <button onClick={() => navigate('/generate')} className="bg-primary-600 hover:bg-primary-500 px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
                    Generate Content
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.slice(0, 4).map((item) => (
                    <div key={item._id} className="group bg-[#0B0F19] border border-dark-border rounded-xl p-5 hover:border-primary-500/50 transition-all flex items-center justify-between cursor-pointer" onClick={() => navigate('/history')}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item.tone}</span>
                          <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="font-bold text-white truncate max-w-md">{item.productDescription.substring(0, 60)}...</p>
                      </div>
                      <div className="flex gap-2">
                        {item.platforms.map(p => (
                           <div key={p} className="w-8 h-8 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-xs font-bold text-primary-400" title={p}>
                             {p.charAt(0).toUpperCase()}
                           </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action / Upgrade Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#0B0F19] border border-primary-900 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full"></div>
               <h3 className="text-xl font-bold text-white mb-3">Maximize Reach</h3>
               <p className="text-slate-300 text-sm leading-relaxed mb-6">Connect your social accounts to enable one-click publishing and automated scheduling directly from AutoMark.</p>
               <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-100 transition-colors">
                 Connect Accounts
               </button>
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
              <h3 className="font-bold mb-6">Platform Distribution</h3>
              <div className="space-y-4">
                {['LinkedIn', 'Twitter', 'Instagram', 'Email'].map(platform => {
                  const allPlatforms = history.flatMap(h => h.platforms);
                  const count = allPlatforms.filter(p => p.toLowerCase() === platform.toLowerCase()).length;
                  const percentage = allPlatforms.length === 0 ? 0 : Math.round((count / allPlatforms.length) * 100);
                  
                  let colorClass = 'bg-accent-500';
                  let textClass = 'text-accent-400';
                  if (platform === 'Twitter' || platform === 'Twitter / X') {
                    colorClass = 'bg-primary-500';
                    textClass = 'text-primary-400';
                  } else if (platform === 'Instagram') {
                    colorClass = 'bg-[#e879f9]';
                    textClass = 'text-[#e879f9]';
                  } else if (platform === 'Email') {
                    colorClass = 'bg-teal-500';
                    textClass = 'text-teal-400';
                  }

                  return (
                    <div key={platform}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">{platform}</span>
                        <span className={`${textClass} font-bold`}>{percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
