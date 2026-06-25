import { useState } from 'react';
import { WorkflowNode } from '../types';

export default function WorkflowsView() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: '1', name: 'Slack Sync Trigger', type: 'trigger', status: 'active', description: 'Triggers on incoming files in #product-roadmap' },
    { id: '2', name: 'Compliance PII Filter', type: 'condition', status: 'running', description: 'Checks files for PII, emails, or password text' },
    { id: '3', name: 'Atlas Index Generator', type: 'action', status: 'active', description: 'Sends segments to Atlas-4 vector embeddings' },
    { id: '4', name: 'Notify Team via Slack', type: 'action', status: 'inactive', description: 'Sends interactive message summary to team channel' },
  ]);

  const [activeLogs, setActiveLogs] = useState<string[]>([
    'KOS Workflow Daemon operational...',
    '[09:42:01] Slack Sync initialized on #product-roadmap',
    '[10:28:14] Evaluated "Quarterly_Report_Draft_v4.pdf" - extracted 42 entities',
    '[11:12:05] Schema update - synchronized 124 message segments'
  ]);

  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunWorkflow = () => {
    setIsExecuting(true);
    setActiveLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Manual execution triggered...`]);

    setTimeout(() => {
      setActiveLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Step 1: Slack Sync Trigger - SUCCESS (Captured 3 new segments)`]);
      
      setTimeout(() => {
        setActiveLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Step 2: Compliance PII Filter - PASS (No leaks detected)`]);
        
        setTimeout(() => {
          setActiveLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Step 3: Atlas Vector Index - completed successfully`]);
          setIsExecuting(false);
          alert('Workflow Execution Completed! Indexes are fully updated.');
        }, 1000);
      }, 800);
    }, 600);
  };

  const toggleNodeStatus = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newStatus = n.status === 'active' ? 'inactive' : 'active';
          return { ...n, status: newStatus };
        }
        return n;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Workflow View Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Automation Workflows</h2>
          <p className="text-sm text-slate-500">Configure and execute event-driven intelligence models.</p>
        </div>
        <button
          onClick={handleRunWorkflow}
          disabled={isExecuting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs px-5 py-3 rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-indigo-100 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          {isExecuting ? 'Running Step Logic...' : 'Run Global Workflow'}
        </button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Nodes Step Sequence */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card rounded-2xl p-6 space-y-6 border border-slate-200 bg-white shadow-sm">
            <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest font-bold">Execution Node Sequence</h3>
            
            <div className="space-y-6 relative">
              {/* Vertical connector line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-200" />

              {nodes.map((node, index) => (
                <div key={node.id} className="flex gap-6 items-start relative z-10">
                  {/* Step index counter */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 font-mono text-sm font-semibold ${
                    node.status === 'active' 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-600' 
                      : node.status === 'running'
                      ? 'bg-amber-50 border-amber-500 text-amber-500 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center hover:border-indigo-300 transition-all">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-800">{node.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                          node.type === 'trigger' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50' 
                            : node.type === 'condition'
                            ? 'bg-amber-50 text-amber-600 border-amber-200/50'
                            : 'bg-indigo-50 text-indigo-600 border-indigo-200/50'
                        }`}>
                          {node.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">{node.description}</p>
                    </div>

                    {/* Status switch toggle */}
                    <button 
                      onClick={() => toggleNodeStatus(node.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        node.status !== 'inactive' ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${
                        node.status !== 'inactive' ? 'left-5.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live execution logs panel */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col border border-slate-200 min-h-[380px] bg-white shadow-sm">
            <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
              Live Daemon Logs
            </h3>
            
            <div className="flex-1 p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 leading-relaxed space-y-2.5 overflow-y-auto max-h-[360px] custom-scrollbar border border-slate-800">
              {activeLogs.map((log, index) => (
                <p key={index} className="whitespace-pre-wrap">{log}</p>
              ))}
              {isExecuting && (
                <p className="text-indigo-400 animate-pulse">Running vector embed operations...</p>
              )}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
