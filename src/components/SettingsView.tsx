import React, { useState, Dispatch, SetStateAction } from 'react';
import { User } from '../types';
import { playUiClick, playUiChime, toggleAudioSystem, getAudioSystemStatus } from '../utils/audio';

interface SettingsViewProps {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export default function SettingsView({ user, setUser }: SettingsViewProps) {
  const [modelType, setModelType] = useState('Atlas-4 Advanced');
  const [temperature, setModelTemp] = useState(0.3);
  const [vectorMemory, setVectorMemory] = useState(12.4);
  const [audioEnabled, setAudioEnabled] = useState(getAudioSystemStatus());

  const handleUserChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleAudioToggle = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    toggleAudioSystem(nextState);
    if (nextState) {
      setTimeout(() => playUiChime(), 50);
    }
  };

  // Triggers immediate download of current workspace settings configuration as a .json file
  const handleDownloadSettingsConfig = () => {
    playUiClick();
    const configData = {
      user: {
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role
      },
      model: {
        selected: modelType,
        temperature: temperature,
        cacheMemoryAllocationGb: vectorMemory,
        acousticFeedback: audioEnabled
      },
      exportedAt: new Date().toISOString(),
      platform: "KnowledgeOS v4.0 (Enterprise Premium Edition)"
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kos-workspace-config-${user.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Settings View Header */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-sm text-slate-500">Manage platform models, workspace specifications, and user profile parameters.</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column Settings Form - Span 8 */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Settings Block */}
          <div className="glass-card rounded-2xl p-6 space-y-5 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest border-b border-slate-100 pb-2 font-bold">User Profile Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleUserChange('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-850 py-2 px-3 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Work Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => handleUserChange('email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-850 py-2 px-3 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Workspace Company</label>
                <input
                  type="text"
                  value={user.company}
                  onChange={(e) => handleUserChange('company', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-850 py-2 px-3 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Operational Role</label>
                <input
                  type="text"
                  value={user.role}
                  onChange={(e) => handleUserChange('role', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-850 py-2 px-3 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Model AI Parameters Block */}
          <div className="glass-card rounded-2xl p-6 space-y-5 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest border-b border-slate-100 pb-2 font-bold">AI Execution Model Parameters</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Active Large Language Model</label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-850 py-2 px-3 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                >
                  <option value="Atlas-4 Advanced">Atlas-4 Advanced (Recommended)</option>
                  <option value="Gemini-1.5 Pro">Gemini-1.5 Pro (Workspace Grounded)</option>
                  <option value="Finch-Mini-Light">Finch-Mini-Light (High Speed/Low Latency)</option>
                </select>
              </div>

              {/* Slider for temp */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Model Temperature (Creativity vs. Grounded Facts)</span>
                  <span className="font-mono text-indigo-600 font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setModelTemp(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Grounded (0.1)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* Slider for cache memory */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Vector Cache Memory allocation</span>
                  <span className="font-mono text-indigo-600 font-bold">{vectorMemory} GB</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="20.0"
                  step="0.5"
                  value={vectorMemory}
                  onChange={(e) => setVectorMemory(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Min (5.0 GB)</span>
                  <span>Max (20.0 GB)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acoustic Haptic Feedback Settings Block */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">High-Fidelity Audio Interface</h3>
                <p className="text-xs text-slate-400 leading-normal mt-1">
                  Plays low-frequency clicking signals and ambient acoustic handshakes on component hover and click events.
                </p>
              </div>
              <button
                onClick={handleAudioToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  audioEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    audioEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column Health Stats & Info - Span 4 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Engine Status panel */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest border-b border-slate-100 pb-2 font-bold">Intelligence Engine</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Atlas-4 Core Handshake</span>
              <span className="flex items-center gap-1 font-mono text-xs uppercase font-bold text-indigo-600">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-normal pt-1">
              KnowledgeOS is integrated directly with modern server-side LLM layers. Advanced models are calibrated automatically for high-performance and zero exposure of internal configurations.
            </p>
          </div>

          {/* EXPORT WORKSPACE ARCHIVE PANEL */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-indigo-200 bg-indigo-50/20 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl pointer-events-none" />
            <h3 className="font-mono text-xs text-indigo-700 uppercase tracking-widest border-b border-indigo-100 pb-2 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">download</span>
              Workspace Export &amp; ZIP
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Export your active profile settings, cache configurations, and environment parameters immediately.
            </p>

            <button
              onClick={handleDownloadSettingsConfig}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">file_download</span>
              Download Config (JSON)
            </button>

            <div className="border-t border-indigo-100 pt-3 mt-1.5 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Full Project ZIP Export</span>
              <div className="p-2.5 bg-white border border-indigo-100 rounded-lg text-[11px] text-slate-500 leading-relaxed space-y-1.5">
                <p>
                  To download the complete **KnowledgeOS source code** bundle as a high-performance production ZIP archive:
                </p>
                <ol className="list-decimal list-inside space-y-1 font-sans pl-0.5 text-slate-600">
                  <li>Locate the <strong>Settings (gear icon)</strong> in the top right-hand control panel of the AI Studio.</li>
                  <li>Select the <strong>Export as ZIP</strong> button.</li>
                  <li>Your workspace container compiles the entire project into a standard zip folder instantly.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* System Health Indicators */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-mono text-xs text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2 font-bold">System Cluster Health</h3>
            
            <div className="space-y-3.5 text-xs text-slate-500 font-medium">
              <div className="flex justify-between">
                <span>Relay Cluster Precision</span>
                <span className="font-mono text-slate-800 font-bold">128-bit Entanglement</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Daemon status</span>
                <span className="font-mono text-emerald-600 font-bold">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Vector Cache state</span>
                <span className="font-mono text-indigo-600 font-bold">98.4% Accuracy</span>
              </div>
              <div className="flex justify-between">
                <span>Internal Latency ping</span>
                <span className="font-mono text-slate-800 font-bold">0.38 ms</span>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}

