import { NavLink } from 'react-router-dom';
import { useApp } from '../../Context/AppContext';
import {
  LayoutDashboard,
  Receipt,
  Sun,
  Moon,
  Shield,
  Eye,
  X,
} from 'lucide-react';
import BrandIcon from './BrandIcon';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-slate-900 dark:bg-slate-950 text-white
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Logo ────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <BrandIcon className="text-base" />
            </div>
            <span className="font-bold text-lg tracking-tight">FinTrack</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Navigation ──────────────────────── */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-4 mb-3">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-600/90 text-white shadow-lg shadow-violet-600/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom section ──────────────────── */}
        <div className="p-4 border-t border-slate-700/60 space-y-4">
          {/* Role Switcher */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">
              Role
            </p>
            <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
              {[
                { value: 'viewer', label: 'Viewer', Icon: Eye },
                { value: 'admin', label: 'Admin', Icon: Shield },
              ].map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => dispatch({ type: 'SET_ROLE', payload: value })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    state.role === value
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800/80 hover:text-white transition-all duration-200"
          >
            {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
