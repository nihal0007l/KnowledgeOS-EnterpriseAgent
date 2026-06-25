import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { User, ActivityItem, DocumentItem } from '../types';
import { playUiClick, playUiChime, playModelSwap, playEngineSuccess } from '../utils/audio';

interface DashboardViewProps {
  user: User;
  documents: DocumentItem[];
  activities: ActivityItem[];
  setActivities: Dispatch<SetStateAction<ActivityItem[]>>;
  setActiveTab: (tab: string) => void;
  onRunAudit: () => void;
  onViewLogs: () => void;
}

export default function DashboardView({
  user,
  documents,
  activities,
  setActivities,
  setActiveTab,
  onRunAudit,
  onViewLogs
}: DashboardViewProps) {
  const [directQuery, setDirectQuery] = useState('');
  const [directChatHistory, setDirectChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'user', text: "Summarize the recent technical debt discussions from the 'Project Aurora' Slack channel." },
    { sender: 'ai', text: "Based on the last 48 hours, technical debt is concentrated in the legacy auth module. Recommend refactoring before Q3." }
  ]);
  const [researchProgress, setResearchProgress] = useState(85);
  const [isSending, setIsSending] = useState(false);

  // Fully interactive agent execution states
  const [researchActive, setResearchActive] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [reportActive, setReportActive] = useState(false);

  // Auto increment research progress simulation (only if active)
  useEffect(() => {
    if (!researchActive) return;
    const timer = setInterval(() => {
      setResearchProgress((prev) => {
        if (prev >= 100) {
          playUiChime();
          return 30;
        }
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [researchActive]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directQuery.trim() || isSending) return;

    playUiClick();
    const newQuery = directQuery;
    setDirectChatHistory((prev) => [...prev, { sender: 'user', text: newQuery }]);
    setDirectQuery('');
    setIsSending(true);

    setTimeout(() => {
      playUiChime();
      let responseText = "Analyzing KnowledgeOS database... ";
      if (newQuery.toLowerCase().includes('audit') || newQuery.toLowerCase().includes('status')) {
        responseText = "All systems operational. Entanglement cluster is stable at 128-bit precision. Performance latency is optimal at 0.38ms.";
      } else if (newQuery.toLowerCase().includes('doc') || newQuery.toLowerCase().includes('index')) {
        responseText = `Currently indexing ${documents.length} high-density document segments. Department directories: Finance, Marketing, and Engineering are in sync.`;
      } else if (newQuery.toLowerCase().includes('agent')) {
        responseText = "Research Agent is running at high priority (85% corpus analyzed). Search Agent is idle, awaiting command vectors. Report Agent in standby.";
      } else {
        responseText = `Lumina AI response: Based on your workspace files, we detected references to similar requirements. Consider initiating a 'Global Audit' for deep system indices.`;
      }

      setDirectChatHistory((prev) => [...prev, { sender: 'ai', text: responseText }]);
      setIsSending(false);
    }, 1200);
  };

  const toggleAgent = (agent: 'research' | 'search' | 'report') => {
    playModelSwap();
    if (agent === 'research') {
      const next = !researchActive;
      setResearchActive(next);
      const logDetail = next ? "Resumed Research Agent corpus indexing task" : "Paused Research Agent background index scanning";
      handleAddLocalActivity(logDetail, "science");
    } else if (agent === 'search') {
      const next = !searchActive;
      setSearchActive(next);
      const logDetail = next ? "Activated Search Agent real-time web grounding" : "Deactivated Search Agent web grounding";
      handleAddLocalActivity(logDetail, "search_check");
    } else if (agent === 'report') {
      const next = !reportActive;
      setReportActive(next);
      const logDetail = next ? "Initialized Report Agent documentation generator" : "Returned Report Agent to standby";
      handleAddLocalActivity(logDetail, "description");
    }
  };

  const handleAddLocalActivity = (detail: string, icon: string) => {
    const newAct: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Agent Status Update',
      time: 'Just now',
      detail: detail,
      icon: icon
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleAuditClick = () => {
    playEngineSuccess();
    onRunAudit();
  };

  const handleViewLogsClick = () => {
    playUiClick();
    onViewLogs();
  };

  // Allows quick download of indexed activity logs as Markdown format
  const handleDownloadActivityLogs = () => {
    playUiClick();
    const logContent = `# KnowledgeOS Activity Audit Logs\n\nGenerated: ${new Date().toLocaleString()}\nUser: ${user.name} (${user.email})\nCompany: ${user.company}\n\n## Indexed Activity Timelines\n\n` + 
      activities.map((act, index) => `${index + 1}. [${act.time}] **${act.title}**\n   Detail: ${act.detail}`).join('\n\n');

    const blob = new Blob([logContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kos-activity-audit-log.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Section Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 shadow-xl border border-indigo-500/10">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-semibold text-white tracking-tight leading-none">
              Welcome back, {user.name.split(' ')[0]}
            </h2>
            <p className="text-indigo-100/90 text-lg max-w-lg leading-relaxed">
              Your intelligence cluster is synchronized. 12 new insights discovered from today's document sync.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <button 
                onClick={handleAuditClick}
                className="bg-indigo-600 text-white px-5 sm:px-6 py-3 rounded-xl font-sans font-bold text-xs sm:text-sm hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-indigo-600/20 whitespace-nowrap"
              >
                Run Global Audit
              </button>
              <button 
                onClick={handleViewLogsClick}
                className="bg-white/5 text-white border border-white/15 px-5 sm:px-6 py-3 rounded-xl font-sans font-bold text-xs sm:text-sm hover:bg-white/10 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                View Live Logs
              </button>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/10 blur-[80px] pointer-events-none" />
        </div>

        {/* Dynamic Metric Cards */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-indigo-300 transition-colors bg-white">
            <div>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-1">Docs Indexed</p>
              <h3 className="text-2xl font-bold text-indigo-600 tracking-tight">{documents.length * 1024 + 842}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <span className="material-symbols-outlined text-indigo-600">description</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-violet-300 transition-colors bg-white">
            <div>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-1">Queries/Week</p>
              <h3 className="text-2xl font-bold text-violet-600 tracking-tight">4,291</h3>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <span className="material-symbols-outlined text-violet-600">query_stats</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-amber-300 transition-colors bg-white">
            <div>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-1">Active Agents</p>
              <h3 className="text-2xl font-bold text-amber-600 tracking-tight">
                {Number(researchActive) + Number(searchActive) + Number(reportActive)} / 3
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <span className="material-symbols-outlined text-amber-600 animate-pulse">bolt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Recent Activity & Agent Status / Chat */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity Card */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="glass-card rounded-2xl flex-1 flex flex-col bg-white">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-800">Recent Workspace Activity</h4>
                <p className="text-xs text-slate-400 mt-1">Timeline logs of background workers and secure indexing runs.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  onClick={handleDownloadActivityLogs}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-sans font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  title="Download logs immediately as markdown"
                >
                  <span className="material-symbols-outlined text-xs">download</span>
                  Export Audit Log
                </button>
                <button 
                  onClick={() => setActiveTab('knowledge')}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-2 rounded-lg font-sans font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  Manage Corpus
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500">{act.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h5 className="font-sans font-semibold text-sm text-slate-800 truncate">{act.title}</h5>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">{act.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1.5 leading-normal">
                      {act.detail} {act.agentName && <span>by <span className="text-indigo-600 font-medium">{act.agentName}</span></span>}
                    </p>
                  </div>
                </div>
              ))}

              {/* Skeleton loading preview line */}
              <div className="flex items-start gap-4 p-4 opacity-50 border border-transparent">
                <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-150 animate-pulse w-1/3 rounded-md" />
                  <div className="h-3 bg-slate-150 animate-pulse w-2/3 rounded-md opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Agent Status & Quick AI chat */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Agent Deployment Status panel */}
          <div className="glass-card rounded-2xl p-6 space-y-6 bg-white">
            <div>
              <h4 className="font-mono text-xs text-slate-500 uppercase tracking-wider">Agent Deployment</h4>
              <p className="text-[10px] text-slate-400 mt-1">Fully interactive control layers. Click any card to toggle agent operational status.</p>
            </div>
            <div className="space-y-4">
              
              {/* Agent 1 */}
              <div 
                onClick={() => toggleAgent('research')}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  researchActive 
                    ? 'bg-indigo-50/40 border-indigo-200/80 hover:bg-indigo-50' 
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${researchActive ? 'text-indigo-600' : 'text-slate-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                    <span className="text-sm font-bold text-slate-800">Research Agent</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${researchActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden relative z-10 mb-2">
                  <div className={`h-full transition-all duration-300 ${researchActive ? 'bg-indigo-600' : 'bg-slate-400'}`} style={{ width: `${researchProgress}%` }} />
                </div>
                <div className="flex justify-between relative z-10 text-[10px] font-mono">
                  <span className="text-slate-500">{researchActive ? 'Processing Corpus' : 'Worker Stopped'}</span>
                  <span className={`${researchActive ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>{researchProgress}%</span>
                </div>
              </div>

              {/* Agent 2 */}
              <div 
                onClick={() => toggleAgent('search')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  searchActive 
                    ? 'bg-violet-50/40 border-violet-200/80 hover:bg-violet-50' 
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${searchActive ? 'text-violet-600' : 'text-slate-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>search_check</span>
                    <span className="text-sm font-bold text-slate-800">Search Agent</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${searchActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                </div>
                <p className="text-[11px] font-mono text-slate-500">
                  {searchActive ? 'Deep-Search network crawler active.' : 'Idle. Awaiting request vectors.'}
                </p>
              </div>

              {/* Agent 3 */}
              <div 
                onClick={() => toggleAgent('report')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  reportActive 
                    ? 'bg-amber-50/40 border-amber-200/80 hover:bg-amber-50' 
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${reportActive ? 'text-amber-600' : 'text-slate-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    <span className="text-sm font-bold text-slate-800">Report Agent</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                    reportActive ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-50 text-amber-600 border-amber-200/40'
                  }`}>
                    {reportActive ? 'ACTIVE' : 'STDBY'}
                  </div>
                </div>
                <p className="text-[11px] font-mono text-slate-500">
                  {reportActive ? 'Synthesizing final executive summaries.' : 'Syncing with workspace...'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI chat widget */}
          <div className="glass-card rounded-2xl flex flex-col h-[380px] overflow-hidden bg-white">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-lg">auto_awesome</span>
                <span className="text-sm font-bold text-slate-800">Direct Intelligence</span>
              </div>
              <button 
                onClick={() => setActiveTab('chat')}
                className="material-symbols-outlined text-xs text-slate-400 hover:text-indigo-600 cursor-pointer"
                title="Open full AI Chat workspace"
              >
                open_in_full
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {directChatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-100 text-slate-800 rounded-tr-none rounded-2xl border border-slate-200/40'
                      : 'bg-indigo-50 border border-indigo-100 text-indigo-800 ml-auto rounded-tl-none rounded-2xl'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
              {isSending && (
                <div className="bg-indigo-50/40 border border-indigo-100/40 text-xs text-indigo-800 ml-auto rounded-tl-none rounded-2xl p-3 max-w-[85%] flex items-center gap-2 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span>Analyzing corpus...</span>
                </div>
              )}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendQuery} className="p-4 border-t border-slate-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={directQuery}
                  onChange={(e) => setDirectQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent border-none text-xs text-slate-800 focus:ring-0 focus:outline-none pr-10 pl-1 py-1"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </section>

    </div>
  );
}
