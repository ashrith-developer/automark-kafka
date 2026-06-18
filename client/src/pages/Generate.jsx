import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const Generate = () => {

  const [formData, setFormData] = useState({
    productDescription: '',
    targetAudience: '',
    tone: 'Professional',
    platforms: [],
    scheduledFor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handlePlatformChange = (platform) => {
    setFormData(prev => {
      const isSelected = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: isSelected
          ? prev.platforms.filter(p => p !== platform)
          : [...prev.platforms, platform]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.platforms.length === 0) {
      setError('Please select at least one platform.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/content/generate', formData);
      navigate('/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate content. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center bg-primary-600/20 text-primary-400 border border-primary-500/30 px-3 py-1.5 rounded-full w-fit mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider">Content Engine</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Generate Campaign
        </h1>
        <p className="mt-2 text-slate-400 text-lg">Deploy autonomous agents to craft your perfect marketing copy.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-surface rounded-2xl border border-dark-border p-8 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/10 rounded-full blur-[80px] pointer-events-none"></div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
             <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <div className="space-y-8 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Product or Service Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-[#0B0F19] px-4 py-3 rounded-xl border border-dark-border text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
              placeholder="E.g., An enterprise-grade AI marketing platform designed to automate content creation and distribution..."
              value={formData.productDescription}
              onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Target Audience
              </label>
              <input
                type="text"
                required
                className="w-full bg-[#0B0F19] px-4 py-3.5 rounded-xl border border-dark-border text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                placeholder="E.g., Growth engineers and CMOs"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Marketing Tone
              </label>
              <div className="relative">
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full bg-[#0B0F19] px-4 py-3.5 rounded-xl border border-dark-border text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none"
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Humorous">Humorous</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Aggressive">Aggressive Growth</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Select Distribution Nodes
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['linkedin', 'twitter', 'instagram', 'email'].map((platform) => (
                <label 
                  key={platform} 
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border cursor-pointer transition-all ${
                    formData.platforms.includes(platform) 
                      ? 'border-primary-500 bg-primary-600/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                      : 'border-dark-border bg-[#0B0F19] hover:bg-slate-800 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.platforms.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                  />
                  <div className={`w-3 h-3 rounded-full mb-2 ${formData.platforms.includes(platform) ? 'bg-primary-400' : 'bg-slate-600'}`}></div>
                  <span className="font-bold tracking-wide uppercase text-xs">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Schedule For (Optional)
            </label>
            <input
              type="date"
              className="w-full md:w-1/2 bg-[#0B0F19] px-4 py-3.5 rounded-xl border border-dark-border text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all [color-scheme:dark]"
              value={formData.scheduledFor || ''}
              onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-dark-border flex justify-between items-center relative z-10">
          <p className="text-xs text-slate-500 tracking-widest uppercase font-bold">Estimated Cost: <span className="text-primary-400">~250 Tokens</span></p>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-white transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Compiling Logic...
              </>
            ) : (
              <>
                Execute Generation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Generate;
