import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  History, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  HelpCircle 
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Workspace', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scheduler', path: '/scheduler', icon: CalendarDays },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-[#080B14] border-r border-dark-border h-screen flex flex-col fixed left-0 top-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center shrink-0">
          <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight tracking-wide">AutoMark</h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">AI Marketing Engine</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#1e1b4b]/50 text-primary-400 border-l-2 border-primary-500' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary-400' : 'text-slate-500'} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-4">
        <button 
          onClick={() => navigate('/generate')}
          className="w-full bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} />
          New Campaign
        </button>
        
        <div className="space-y-1 pt-4 border-t border-dark-border">
          <button 
            onClick={() => navigate('/help')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <HelpCircle size={18} />
            Help
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Settings size={18} />
            Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
