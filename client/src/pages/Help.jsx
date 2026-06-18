import React from 'react';
import { Mail, MessageSquare, FileText, ChevronRight } from 'lucide-react';

const Help = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col">
      <header className="h-20 border-b border-dark-border flex items-center px-8 bg-dark-bg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Help Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">Get support and learn how to use AutoMark.</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-8">
        
        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => alert("The AutoMark documentation portal is currently under construction. Check back soon!")} className="bg-dark-surface border border-dark-border rounded-2xl p-6 hover:border-primary-500/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-dark-border flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Documentation</h3>
            <p className="text-sm text-slate-400">Read our detailed guides on how to generate the perfect campaigns.</p>
          </div>

          <div onClick={() => alert("Redirecting to Discord... (Placeholder)")} className="bg-dark-surface border border-dark-border rounded-2xl p-6 hover:border-accent-500/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-dark-border flex items-center justify-center text-accent-500 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Community Discord</h3>
            <p className="text-sm text-slate-400">Join other marketers and share your best prompts and strategies.</p>
          </div>

          <div onClick={() => alert("Our support desk software is currently being integrated.")} className="bg-dark-surface border border-dark-border rounded-2xl p-6 hover:border-[#e879f9]/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-dark-border flex items-center justify-center text-[#e879f9] mb-4 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Contact Support</h3>
            <p className="text-sm text-slate-400">Can't find what you need? Open a ticket with our support team.</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              { q: "How does the AI Engine work?", a: "AutoMark uses Groq's high-speed Llama 3 models to synthesize your product descriptions into platform-specific marketing copy instantly." },
              { q: "Does the Scheduler automatically post for me?", a: "Currently, the Scheduler acts as a planning calendar. Direct API integrations for auto-posting to LinkedIn and Twitter are coming soon in our Pro tier." },
              { q: "How is my quota calculated?", a: "On the Free Tier, each piece of content generated (e.g., one LinkedIn post) counts as one generation against your monthly limit." },
              { q: "Can I change my account email?", a: "Account emails are permanently tied to your registration. To use a different email, you must create a new account." }
            ].map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-dark-border bg-[#0B0F19] hover:bg-slate-800 transition-colors cursor-pointer flex items-start justify-between gap-4">
                 <div>
                   <h4 className="font-bold text-sm text-slate-200 mb-1">{faq.q}</h4>
                   <p className="text-sm text-slate-500">{faq.a}</p>
                 </div>
                 <ChevronRight className="text-slate-600 mt-1 shrink-0" size={18} />
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Help;
