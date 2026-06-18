import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Key, CreditCard, Bell, Lock, QrCode, X } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const { user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      return setPasswordError('New passwords do not match');
    }

    try {
      setIsChangingPassword(true);
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      setPasswordMessage(res.data.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col">
      <header className="h-20 border-b border-dark-border flex items-center px-8 bg-dark-bg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Account Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage your profile, billing, and system preferences.</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-8">
        
        {/* Profile Section */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 relative overflow-hidden">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-3xl font-bold border-4 border-dark-border shadow-lg z-10">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="z-10">
              <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
              <p className="text-slate-400">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-2 bg-[#0B0F19] border border-dark-border px-3 py-1 rounded-md text-xs font-bold text-accent-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-500"></div> Free Tier
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 relative z-10">
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
               <input type="text" disabled value={user?.name || ''} className="w-full bg-[#0B0F19] px-4 py-3 rounded-xl border border-dark-border text-slate-400 opacity-70 cursor-not-allowed" />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
               <input type="email" disabled value={user?.email || ''} className="w-full bg-[#0B0F19] px-4 py-3 rounded-xl border border-dark-border text-slate-400 opacity-70 cursor-not-allowed" />
             </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#0B0F19] border border-dark-border flex items-center justify-center text-primary-400">
                   <Key size={20} />
                </div>
                <h3 className="text-lg font-bold">API Integrations</h3>
             </div>
             <p className="text-sm text-slate-400 mb-6">Connect your social accounts to enable auto-posting directly from the Scheduler.</p>
             
             <div className="space-y-3">
               <button onClick={() => alert("LinkedIn OAuth integration will be available in the next release.")} className="w-full flex items-center justify-between p-4 rounded-xl border border-dark-border bg-[#0B0F19] hover:bg-slate-800 transition-colors">
                 <span className="font-bold text-sm">LinkedIn OAuth</span>
                 <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">Connect</span>
               </button>
               <button onClick={() => alert("Twitter/X API integration requires a Developer Account. Coming soon.")} className="w-full flex items-center justify-between p-4 rounded-xl border border-dark-border bg-[#0B0F19] hover:bg-slate-800 transition-colors">
                 <span className="font-bold text-sm">X / Twitter API</span>
                 <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">Connect</span>
               </button>
             </div>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#0B0F19] border border-dark-border flex items-center justify-center text-accent-500">
                   <CreditCard size={20} />
                </div>
                <h3 className="text-lg font-bold">Billing & Usage</h3>
             </div>
             
             <div className="mb-6">
               <div className="flex justify-between text-sm mb-2">
                 <span className="font-medium text-slate-300">Generations (This Month)</span>
                 <span className="font-bold">42 / 100</span>
               </div>
               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-accent-500 w-[42%]"></div>
               </div>
             </div>

             <button onClick={() => setShowQrModal(true)} className="w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
               <QrCode size={18} />
               Upgrade to Pro
             </button>
          </div>

          {/* Password & Security */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#0B0F19] border border-dark-border flex items-center justify-center text-rose-400">
                   <Lock size={20} />
                </div>
                <h3 className="text-lg font-bold">Password & Security</h3>
             </div>
             <form onSubmit={handleChangePassword} className="space-y-4">
               <div>
                 <input 
                   type="password" 
                   placeholder="Current Password" 
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                   required
                   className="w-full bg-[#0B0F19] px-4 py-3 rounded-xl border border-dark-border text-white text-sm focus:outline-none focus:border-primary-500" 
                 />
               </div>
               <div>
                 <input 
                   type="password" 
                   placeholder="New Password" 
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   required
                   className="w-full bg-[#0B0F19] px-4 py-3 rounded-xl border border-dark-border text-white text-sm focus:outline-none focus:border-primary-500" 
                 />
               </div>
               <div>
                 <input 
                   type="password" 
                   placeholder="Confirm New Password" 
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   required
                   className="w-full bg-[#0B0F19] px-4 py-3 rounded-xl border border-dark-border text-white text-sm focus:outline-none focus:border-primary-500" 
                 />
               </div>
               {passwordError && <p className="text-rose-500 text-xs font-bold">{passwordError}</p>}
               {passwordMessage && <p className="text-emerald-500 text-xs font-bold">{passwordMessage}</p>}
               <button 
                 type="submit" 
                 disabled={isChangingPassword}
                 className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold shadow-lg transition-colors disabled:opacity-50"
               >
                 {isChangingPassword ? 'Updating...' : 'Update Password'}
               </button>
             </form>
          </div>

        </div>

      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border p-8 rounded-2xl max-w-sm w-full relative flex flex-col items-center shadow-2xl">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-16 h-16 rounded-full bg-accent-500/20 text-accent-500 flex items-center justify-center mb-4">
              <QrCode size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Upgrade to Pro</h3>
            <p className="text-slate-400 text-center text-sm mb-6">Scan the QR code to proceed with the payment and unlock premium features.</p>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 w-48 h-48 flex items-center justify-center mb-2">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/upgrade-pro" alt="Upgrade to Pro QR Code" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-slate-500 text-center mt-4">For demonstration purposes only</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
