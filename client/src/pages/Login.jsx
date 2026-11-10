import { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, loginWithGoogle, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (isForgotPassword) {
      // Simulate sending a reset link for presentation purposes
      setTimeout(() => {
        setIsLoading(false);
        setResetSent(true);
      }, 1200);
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = useCallback(async (credential) => {
    setError('');
    await loginWithGoogle(credential);
    navigate('/dashboard');
  }, [loginWithGoogle, navigate]);

  const handleGoogleError = useCallback((err) => {
    setError(err.response?.data?.message || 'Google sign-in failed');
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col md:flex-row p-4 md:p-8 gap-8 font-sans">
      
      {/* Left Pane - Visual/Marketing */}
      <div className="hidden md:flex flex-1 flex-col justify-between bg-dark-surface rounded-3xl p-10 border border-dark-border relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 space-y-6 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[#0B0F19] border border-accent-500/30 px-3 py-1.5 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-accent-500 tracking-wider">AI ENGINE v4.2 ACTIVE</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Master your marketing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-[#e879f9]">precision with AI.</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Access the world's most advanced growth engine. Securely authenticate to manage your autonomous campaigns and real-time data insights.
          </p>
        </div>

        {/* Feature badges at bottom */}
        <div className="relative z-10 flex gap-4 mt-12">
          <div className="flex items-center gap-3 bg-[#0B0F19] border border-dark-border rounded-xl p-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-slate-300" size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SECURITY</p>
              <p className="text-sm font-semibold text-white">AES-256 Verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#0B0F19] border border-dark-border rounded-xl p-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <Zap className="text-accent-400" size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">LATENCY</p>
              <p className="text-sm font-semibold text-white">42ms Global Sync</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-dark-bg p-6">
        <div className="w-full max-w-md bg-dark-surface/50 border border-dark-border p-10 rounded-2xl backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isForgotPassword ? 'Recover Access' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isForgotPassword ? 'Enter your email to receive recovery instructions.' : 'Enter your credentials to access your dashboard.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-start mb-6">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {resetSent && (
            <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-xl flex items-start mb-6">
              <ShieldCheck className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
              <p className="text-sm text-green-200">If an account exists for {email}, recovery instructions have been sent.</p>
            </div>
          )}

          {!resetSent && !isForgotPassword && (
            <div className="mb-6 space-y-5">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-dark-border"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">or</span>
                <div className="h-px flex-1 bg-dark-border"></div>
              </div>
            </div>
          )}

          {!resetSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider" htmlFor="email">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500">@</span>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full bg-[#0B0F19] border border-dark-border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">Password</label>
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Forgot Access?</button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      className="w-full bg-[#0B0F19] border border-dark-border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm tracking-widest"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-900 bg-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] focus:ring-slate-200 transition-all disabled:opacity-70 mt-6"
              >
                {isLoading ? 'Processing...' : (isForgotPassword ? 'Send Recovery Link' : 'Sign in to Dashboard')}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>
          ) : (
            <button
              onClick={() => { setIsForgotPassword(false); setResetSent(false); setPassword(''); }}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-900 bg-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] focus:ring-slate-200 transition-all mt-6"
            >
              Return to Login
            </button>
          )}

          <p className="mt-8 text-center text-sm text-slate-400 border-t border-dark-border pt-6">
            {isForgotPassword ? (
              <>
                Remembered your credentials?{' '}
                <button onClick={() => { setIsForgotPassword(false); setResetSent(false); }} className="font-semibold text-accent-400 hover:text-accent-500 transition-colors">
                  Return to Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-accent-400 hover:text-accent-500 transition-colors">
                  Request Access
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
