import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10 text-center">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#0B0F19] border border-dark-border px-4 py-2 rounded-full text-xs font-bold tracking-widest text-slate-300 mx-auto">
            <span className="text-slate-300">MEET AUTOMARK</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Create a month of marketing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-[#e879f9] to-accent-400">seconds.</span>
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Stop staring at a blank page. AutoMark turns a single product description into highly-converting, platform-perfect content for LinkedIn, Twitter, Instagram, and Email.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
            <Link to="/register" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center w-full sm:w-auto">
              Register for Free
            </Link>
            <Link to="/login" className="bg-[#0B0F19] hover:bg-dark-surface border border-dark-border text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-all w-full sm:w-auto justify-center flex">
              Sign In
            </Link>
          </div>
          
          <p className="text-xs text-slate-500 mt-4">No credit card required. Free tier included.</p>
        </div>

        {/* Value Proposition / Features */}
        <div className="mt-32 text-left">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why marketers choose AutoMark</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to scale your online presence without increasing your headcount.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-dark-surface border border-dark-border p-8 rounded-2xl transition-colors group">
              <h3 className="text-xl font-bold text-white mb-3">One Prompt, Every Platform</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Describe your product once. Our engine automatically adapts the tone, length, and format to perfectly match the native style of Twitter, LinkedIn, Instagram, and Email.
              </p>
            </div>

            <div className="bg-dark-surface border border-dark-border p-8 rounded-2xl transition-colors group">
              <h3 className="text-xl font-bold text-white mb-3">Hyper-Targeted Copy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Specify your exact target audience and desired tone (from Professional to Humorous). The engine crafts psychological hooks designed specifically to convert your demographic.
              </p>
            </div>

            <div className="bg-dark-surface border border-dark-border p-8 rounded-2xl transition-colors group">
              <h3 className="text-xl font-bold text-white mb-3">Zero Writer's Block</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate high-quality campaigns in less than 5 seconds. Save your history, quickly copy to your clipboard, and keep your content calendar full effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 mb-10 bg-gradient-to-br from-primary-900/40 to-dark-surface border border-primary-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 blur-3xl rounded-full"></div>
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Ready to put your marketing on autopilot?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10">Join thousands of creators and marketers who use AutoMark to scale their brand presence daily.</p>
          
          <Link to="/register" className="inline-flex bg-white hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] relative z-10">
            Create Your Free Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Landing;
