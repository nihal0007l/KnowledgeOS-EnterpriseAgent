import { User } from '../types';
import { playUiClick } from '../utils/audio';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  onRequestClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, onRequestClick }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'knowledge', label: 'Knowledge Base', icon: 'folder_open' },
    { id: 'chat', label: 'AI Chat', icon: 'forum' },
    { id: 'workflows', label: 'Workflows', icon: 'account_tree' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleTabClick = (tabId: string) => {
    playUiClick();
    setActiveTab(tabId);
  };

  const handleNewRequestClick = () => {
    playUiClick();
    onRequestClick();
  };

  const handleLogoutClick = () => {
    playUiClick();
    onLogout();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-200 bg-white flex flex-col py-6 z-[60]">
      {/* Branding */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-xl font-extrabold text-slate-900 tracking-tight">KnowledgeOS</h1>
          <p className="font-mono text-[9px] text-indigo-600/80 uppercase tracking-widest mt-0.5">Enterprise Intelligence</p>
        </div>
        <div className="lg:flex items-center justify-center p-1.5 border border-indigo-100 bg-indigo-50 rounded-lg">
          <span className="material-symbols-outlined text-indigo-600 text-xs font-bold">hub</span>
        </div>
      </div>

      {/* New Request Button */}
      <div className="px-4 mb-6">
        <button 
          onClick={handleNewRequestClick}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-sans font-bold text-sm py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Request
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 border border-indigo-700/10 scale-[0.98] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="text-sm font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="px-3 pt-6 border-t border-slate-100 space-y-1">
        <button
          onClick={() => handleTabClick('support')}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'support'
              ? 'bg-slate-50 text-slate-900 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span className="text-sm font-sans">Support</span>
        </button>

        <button
          onClick={() => handleTabClick('notifications')}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer relative ${
            activeTab === 'notifications'
              ? 'bg-slate-50 text-slate-900 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="text-sm font-sans">Notifications</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>

        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-left text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer mt-2"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="text-sm font-sans">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
