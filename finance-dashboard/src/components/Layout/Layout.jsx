import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useApp } from '../../Context/AppContext';
import BrandIcon from './BrandIcon';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-30 backdrop-blur-sm bg-white/90 dark:bg-slate-800/90">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BrandIcon className="text-sm" />
            </div>
            <span className="font-bold text-slate-800 dark:text-white">FinTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 capitalize">
              {state.role}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
