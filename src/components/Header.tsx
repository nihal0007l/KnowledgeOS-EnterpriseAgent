import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onSearch: (query: string) => void;
  onUpgradeClick: () => void;
  onDocsClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ user, onSearch, onUpgradeClick, onDocsClick, theme, onToggleTheme }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  const mockHistory = [
    { title: 'Ran Global Audit on Cluster Alpha', time: '10m ago' },
    { title: 'Uploaded Q3_Financial_Projections.pdf', time: '2h ago' },
    { title: 'Chat query: "Summarize Project Aurora Slack channels"', time: '4h ago' },
    { title: 'Updated Schema node indices', time: 'Yesterday' },
  ];

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-256px)] h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex justify-between items-center px-6 z-40">
      {/* Search Input & Top Navigation */}
      <div className="flex items-center gap-10 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-10 pr-12 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all placeholder-slate-400"
            placeholder="Global search (⌘K)"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-mono text-slate-400">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-mono text-slate-400">K</kbd>
          </div>
        </div>

        <nav className="hidden md:flex gap-6">
          <button onClick={onDocsClick} className="text-sm font-sans text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 cursor-pointer">Docs</button>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("KnowledgeOS Developer API details are available in the Docs panel."); }} className="text-sm font-sans text-slate-600 hover:text-indigo-600 transition-all pb-1">API</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Access our developer community forums for KnowledgeOS support."); }} className="text-sm font-sans text-slate-600 hover:text-indigo-600 transition-all pb-1">Community</a>
        </nav>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 relative">
        {/* History Toggle */}
        <div className="relative">
          <button 
            onClick={() => { setShowHistory(!showHistory); setShowProfileMenu(false); }}
            className={`p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer ${showHistory ? 'bg-slate-100 text-indigo-600' : ''}`}
            title="Activity History"
          >
            <span className="material-symbols-outlined text-lg">history</span>
          </button>
          {showHistory && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl p-4 shadow-2xl z-50 text-left border border-slate-200">
              <h4 className="text-xs font-mono uppercase text-indigo-600 tracking-wider mb-3">System Execution History</h4>
              <div className="space-y-3">
                {mockHistory.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-800 font-medium">{item.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Mode Theme Indicator */}
        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-lg">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

        {/* Upgrade Button */}
        <button 
          onClick={onUpgradeClick}
          className="bg-indigo-50 text-indigo-600 border border-indigo-100 font-sans font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-100 hover:scale-[1.02] transition-all cursor-pointer"
        >
          Upgrade
        </button>

        {/* User profile dropdown trigger */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowHistory(false); }}
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-600 transition-all"
          >
            <img className="w-full h-full object-cover font-sans" alt={user.name} src={user.avatar} />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl p-4 shadow-2xl z-50 text-left border border-slate-200">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                <img className="w-10 h-10 rounded-full object-cover" alt={user.name} src={user.avatar} />
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{user.role}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Workspace:</strong> {user.company}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
