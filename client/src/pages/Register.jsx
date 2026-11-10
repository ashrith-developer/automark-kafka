import { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, loginWithGoogle, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setIsLoading(true);
    
    try {
      await register(name, email, password); // Note: we could pass company here if backend supported it
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
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
      
      {/* Left Pane - Setup/Marketing */}
      <div className="hidden md:flex flex-1 flex-col justify-between pt-10 px-10 relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-primary-600/20 text-primary-400 border border-primary-500/30 px-3 py-1.5 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-primary-400"></div>
            <span className="text-xs font-semibold uppercase tracking-wider">SECURE ONBOARDING</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight tracking-tight mt-6">
            Complete your engine <br />
            <span className="text-accent-500">setup.</span>
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed mt-4">
            Join 1,200+ growth engineers leveraging precision AI to automate enterprise marketing workflows.
          </p>
        </div>

        {/* System Status Visual */}
        <div className="relative z-10 mt-12 bg-dark-surface border border-dark-border rounded-2xl p-6 flex-1 max-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">SYSTEM STATUS</p>
              <h3 className="text-lg font-semibold text-white">Active Deployment</h3>
            </div>
            <CheckCircle2 className="text-accent-500" size={24} />
          </div>
          
          {/* Fake Grid Map Area */}
          <div className="flex-1 bg-[#080B14] rounded-xl border border-dark-border relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
            {/* Abstract node visualization */}
            <div className="w-full h-full relative opacity-50">
              <div className="absolute top-1/4 left-1/4 w-12 h-6 bg-slate-800 rounded border border-slate-700 flex items-center px-2 text-[8px]">Core Node</div>
              <div className="absolute top-1/2 left-1/3 w-16 h-6 bg-primary-900 rounded border border-primary-800 flex items-center px-2 text-[8px]">Auth</div>
              <div className="absolute bottom-1/3 right-1/4 w-14 h-6 bg-slate-800 rounded border border-slate-700 flex items-center px-2 text-[8px]">DB Sync</div>
              {/* Connecting lines */}
              <div className="absolute top-[28%] left-[28%] w-[10%] h-[24%] border-l border-b border-primary-500/30"></div>
              <div className="absolute top-[55%] left-[38%] w-[35%] h-[15%] border-r border-t border-slate-600/50"></div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
             <div className="flex-1 bg-[#080B14] border border-dark-border rounded-lg p-4">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">LATENCY</p>
               <p className="text-xl font-medium text-accent-400">24ms</p>
             </div>
             <div className="flex-1 bg-[#080B14] border border-dark-border rounded-lg p-4">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ACCURACY</p>
               <p className="text-xl font-medium text-slate-300">99.9%</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-dark-bg p-6">
        <div className="w-full max-w-[520px] bg-dark-surface border border-dark-border p-10 rounded-3xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Final Details</h2>
              <p className="text-slate-400 text-sm">Set up your workspace credentials.</p>
            </div>
            <span className="text-xs font-bold text-slate-500 tracking-widest">STEP 02/02</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-start mb-6">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="mb-6 space-y-5">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
            />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-dark-border"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">or</span>
              <div className="h-px flex-1 bg-dark-border"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                required
                className="w-full bg-[#0B0F19] border border-dark-border rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                  placeholder="john@company.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full bg-[#0B0F19] border border-dark-border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm tracking-widest"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {/* Password Strength Indicator */}
              <div className="mt-3">
                <div className="flex gap-1 mb-1">
                  <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? 'bg-primary-500' : 'bg-slate-800'}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 6 ? 'bg-primary-500' : 'bg-slate-800'}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-primary-600' : 'bg-slate-800'}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 10 ? 'bg-[#312e81]' : 'bg-slate-800'}`}></div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {password.length === 0 ? 'ENTER PASSWORD' : password.length < 6 ? 'STRENGTH: WEAK' : password.length < 8 ? 'STRENGTH: MEDIUM' : 'STRENGTH: STRONG'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-primary-500 transition-all disabled:opacity-70 mt-4 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
            >
              {isLoading ? 'Initializing...' : 'Initialize My Engine'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            By clicking Initialize, you agree to our <Link to="#" className="text-slate-300 hover:text-white">Terms of Service</Link> and <Link to="#" className="text-slate-300 hover:text-white">Privacy Policy</Link>. Data is encrypted via SOC2 Type II standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
