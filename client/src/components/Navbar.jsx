import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Settings, Bell, Search } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-dark-bg border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Area */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center shrink-0">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="font-bold text-xl tracking-wide text-white uppercase">AutoMark</span>
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="#" onClick={(e) => { e.preventDefault(); alert("Platform details page is under construction."); }} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Platform</Link>
            <Link to="#" onClick={(e) => { e.preventDefault(); alert("Solutions page is under construction."); }} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Solutions</Link>
            <Link to="#" onClick={(e) => { e.preventDefault(); alert("Pricing page is under construction."); }} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Pricing</Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search insights..."
                onClick={() => alert("Global search will be enabled post-launch.")}
                className="bg-dark-surface border border-dark-border rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary-500 w-48 transition-all group-hover:w-64"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-bold transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                  Register
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
