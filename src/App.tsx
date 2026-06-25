import { useState, useEffect, useRef } from 'react';
import { User, DocumentItem, ActivityItem, ChatMessage } from './types';
import AuthFlow from './components/AuthFlow';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import AIChatView from './components/AIChatView';
import WorkflowsView from './components/WorkflowsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import { playUiClick, playUiChime, playEngineSuccess } from './utils/audio';

export default function App() {
  // Global States
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLogsConsole, setShowLogsConsole] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Theme & Run Audit State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<Array<{ time: string; text: string; type: 'info' | 'success' | 'warn' | 'error' | 'accent' }>>([]);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal logs as they stream in
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [auditLogs]);

  // Initial Documents Dataset
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Q3_Financial_Projections.pdf',
      type: 'pdf',
      size: '4.2 MB',
      uploadedAt: 'Uploaded Oct 12, 2023',
      status: 'indexed',
      department: 'Finance'
    },
    {
      id: 'doc-2',
      name: 'Brand_Identity_Guidelines_v2.md',
      type: 'md',
      size: '156 KB',
      uploadedAt: 'Processing AI insights...',
      status: 'processing',
      department: 'Marketing',
      progress: 60
    },
    {
      id: 'doc-3',
      name: 'User_Engagement_Data_2023.csv',
      type: 'csv',
      size: '1.8 MB',
      uploadedAt: 'Uploaded Sep 30, 2023',
      status: 'indexed',
      department: 'Engineering'
    },
    {
      id: 'doc-4',
      name: 'Privacy_Policy_Update_Draft.pdf',
      type: 'pdf',
      size: '890 KB',
      uploadedAt: 'Uploaded Sep 28, 2023',
      status: 'indexed',
      department: 'Legal'
    }
  ]);

  // Initial Recent Activities logs
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act-1',
      title: 'Quarterly_Report_Draft_v4.pdf',
      time: '2m ago',
      detail: 'Processed by Research Agent. 42 entities extracted.',
      icon: 'history_edu'
    },
    {
      id: 'act-2',
      title: 'Slack Knowledge Sync',
      time: '14m ago',
      detail: 'Ingested 124 messages from #product-roadmap.',
      icon: 'sync'
    },
    {
      id: 'act-3',
      title: 'Schema Update',
      time: '1h ago',
      detail: 'Knowledge base structure optimized for high-density retrieval.',
      icon: 'verified_user'
    }
  ]);

  // Initial Conversation thread list for AI Chat panel
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      message: 'Can you explain the current status of the Quantum Ledger Project and cite the most recent technical specifications?',
      timestamp: '10:42 AM'
    },
    {
      id: 'msg-2',
      sender: 'ai',
      message: `The **Quantum Ledger Project (QLP)** is currently in Phase 3: Hardware Integration. According to the internal technical documentation updated as of 48 hours ago, the system has achieved stable 128-bit entanglement across the distributed node network.

Recent specifications indicate a 14% improvement in error correction overhead, primarily due to the implementation of the new Rydberg atom array configuration. Performance metrics show:

* **Latency:** < 0.4ms across inter-node relays
* **Throughput:** 1.2M transactions/sec per cluster`,
      timestamp: '10:43 AM',
      sources: [
        {
          name: 'QLP_Specs_v4.2.pdf',
          excerpt: 'The integration of the Rydberg gate architecture has effectively bypassed the decoherence limit previously noted in the v3.8 hardware iteration...'
        },
        {
          name: 'Internal_Dashboard',
          excerpt: 'Live status indicators show telemetry clusters are synced at 128-bit precision.'
        }
      ]
    }
  ]);

  // Activity Log helper
  const handleAddActivity = (detail: string, icon: string = 'info') => {
    const newAct: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'User Event Sync',
      time: 'Just now',
      detail: detail,
      icon: icon
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Search filter callback
  const handleGlobalSearch = (query: string) => {
    if (!query) return;
    console.log(`Global search triggered: ${query}`);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    playUiClick();
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleRunGlobalAudit = () => {
    playUiClick();
    setShowLogsConsole(true);
    setAuditStatus('running');
    setAuditProgress(0);
    setAuditLogs([]);

    const timestamp = () => `[${new Date().toLocaleTimeString()}]`;

    // Immediately trigger first log
    setAuditLogs([{
      time: timestamp(),
      text: 'Booting KOS-Audit Daemon v4.1.0 on decentralized secure node...',
      type: 'accent'
    }]);

    const auditSteps = [
      { text: 'Establishing secure communication tunnel with memory clusters...', type: 'info', delay: 500, progress: 12 },
      { text: 'Scanning department corpus matrices [Finance, Marketing, Engineering, Legal]...', type: 'info', delay: 1200, progress: 28 },
      { text: `Checking document segment integrity parities for ${documents.length} verified indices...`, type: 'info', delay: 2000, progress: 45 },
      { text: 'Evaluating active logical models: Atlas-4 and Quantum-X query nodes...', type: 'info', delay: 2800, progress: 60 },
      { text: 'Performing phase noise telemetry inside Rydberg atom gateway arrays...', type: 'info', delay: 3600, progress: 75 },
      { text: 'Latency stabilized at 0.32ms across all geographic cluster relays.', type: 'accent', delay: 4200, progress: 85 },
      { text: 'Running SHA-256 validation on file-system metadata and secure keys...', type: 'info', delay: 4800, progress: 92 },
      { text: `[SUCCESS] Verified ${documents.length * 1024 + 842} segments. No memory parity drift detected!`, type: 'success', delay: 5400, progress: 100 },
      { text: 'System status: OPTIMAL. Zero vulnerabilities flagged in current index corpus.', type: 'success', delay: 5800, progress: 100 }
    ];

    auditSteps.forEach((step) => {
      setTimeout(() => {
        setAuditLogs((prev) => [
          ...prev,
          { time: timestamp(), text: step.text, type: step.type as any }
        ]);
        setAuditProgress(step.progress);

        if (step.progress === 100 && step.text.includes('System status: OPTIMAL')) {
          setAuditStatus('completed');
          playEngineSuccess();
          handleAddActivity('Executed system-wide integrity audit successfully', 'verified_user');
        } else {
          playUiClick();
        }
      }, step.delay);
    });
  };

  useEffect(() => {
    if (showLogsConsole && auditStatus === 'idle') {
      handleRunGlobalAudit();
    }
  }, [showLogsConsole]);

  // Switch tabs & pages selector
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            user={user!}
            documents={documents}
            activities={activities}
            setActivities={setActivities}
            setActiveTab={setActiveTab}
            onRunAudit={handleRunGlobalAudit}
            onViewLogs={() => setShowLogsConsole(true)}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeBaseView
            documents={documents}
            setDocuments={setDocuments}
            onActivityAdded={handleAddActivity}
          />
        );
      case 'chat':
        return (
          <AIChatView
            documents={documents}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            onActivityAdded={handleAddActivity}
          />
        );
      case 'workflows':
        return <WorkflowsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView user={user!} setUser={setUser} />;
      case 'support':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Support &amp; Help Center</h2>
              <p className="text-sm text-slate-500">Access documentation, submit troubleshooting tickets, or check system operational status.</p>
            </section>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                  <h3 className="font-sans font-bold text-lg text-slate-800">Frequently Asked Questions</h3>
                  <div className="divide-y divide-slate-100">
                    <div className="py-3.5 space-y-1">
                      <h4 className="text-sm font-semibold text-slate-800">How do I integrate my own custom Google Drive documents?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Go to the Knowledge Base view, click on "Connect Drive", and follow the OAuth verification process. Documents will sync in real-time.
                      </p>
                    </div>
                    <div className="py-3.5 space-y-1">
                      <h4 className="text-sm font-semibold text-slate-800">Is my workspace data private and secure?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Yes, KnowledgeOS uses a local-first secure memory cache. All synchronized and indexed documents are processed client-side or via secure, proxy-shielded endpoints. No workspace telemetry is persisted externally.
                      </p>
                    </div>
                    <div className="py-3.5 space-y-1">
                      <h4 className="text-sm font-semibold text-slate-800">What are Rydberg Atom Array decoherence limits?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        This refers to the phase noise limits in simulated quantum cluster models. Maintain active JWT authentication to synchronize these models properly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                  <h3 className="font-sans font-bold text-lg text-slate-800">Submit an Engineering Ticket</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert("Support ticket submitted! Our engineering team will review it shortly.");
                    handleAddActivity("Submitted support ticket to Engineering Team", "contact_support");
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Issue Category</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 py-2 px-3 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all">
                          <option>Vector Indexing Issue</option>
                          <option>API &amp; Webhook Failure</option>
                          <option>Model Accuracy &amp; Citations</option>
                          <option>Billing &amp; Workspace Account</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Severity Level</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 py-2 px-3 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all">
                          <option>Low - Question/Tweak</option>
                          <option>Medium - Performance lag</option>
                          <option>High - Feature broken</option>
                          <option>Critical - Cluster offline</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Detailed Description</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Please describe the issue, steps to reproduce, and any error message you received..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-850 py-2 px-3 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer">
                      Submit Ticket
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                  <h3 className="font-mono text-xs text-indigo-600 uppercase tracking-widest font-bold">Cluster Status Indicators</h3>
                  <div className="space-y-3.5 text-xs text-slate-500 font-medium">
                    <div className="flex justify-between items-center">
                      <span>Lumina Indexing Daemon</span>
                      <span className="font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Atlas-4 Query Model</span>
                      <span className="font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Delivery Nodes</span>
                      <span className="font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vector Cache Cluster</span>
                      <span className="font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-3">
                  <h3 className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold">Direct Support Email</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Have an urgent production workspace outage? Reach out directly via priority enterprise support email.
                  </p>
                  <a href="mailto:support@knowledgeos.ai" className="text-sm font-semibold text-indigo-600 hover:underline block font-mono">support@knowledgeos.ai</a>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <section className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Notifications</h2>
                <p className="text-sm text-slate-500">View real-time alerts, system logs, and data security updates.</p>
              </div>
              <button 
                onClick={() => {
                  alert("All notifications marked as read!");
                  handleAddActivity("Cleared system notifications", "notifications_off");
                }}
                className="text-xs font-sans font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            </section>
            
            <div className="glass-card rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                <div className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                    <span className="material-symbols-outlined">sync</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-800">Real-Time Sync Succeeded</h4>
                      <span className="text-[10px] font-mono text-slate-400">10 minutes ago</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Successfully ingested 124 messages from #product-roadmap. Rydberg Atom array modeling completed with 98.4% precision accuracy.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-800">Compliance Isolation Alert</h4>
                      <span className="text-[10px] font-mono text-slate-400">2 hours ago</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Two newly uploaded files contain sensitive business metrics. Cleared draft reviews are pending human-in-the-loop authorization.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-800">Document Segment Indexed Successfully</h4>
                      <span className="text-[10px] font-mono text-slate-400">Yesterday</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      "Q3_Financial_Projections.pdf" has been indexed, segmented into 42 high-density vector slices, and cached successfully inside your active workspace.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-800">New Login session detected</h4>
                      <span className="text-[10px] font-mono text-slate-400">June 25, 2026</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      A new session was authenticated for {user.email}. Cluster authentication token updated successfully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-20 text-slate-400 text-sm">
            This module is being optimized for high-density retrieval. Check back shortly.
          </div>
        );
    }
  };

  // Show Auth Flow if not logged in
  if (!user) {
    return <AuthFlow onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-x-hidden select-none">
      
      {/* Sidebar Layout */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={() => setUser(null)}
        onRequestClick={handleRunGlobalAudit}
      />

      {/* Top Header Layout */}
      <Header
        user={user}
        onSearch={handleGlobalSearch}
        onUpgradeClick={() => setShowUpgradeModal(true)}
        onDocsClick={() => setShowDocsModal(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Frame container */}
      <main className="ml-64 pt-20 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto pb-10">
          {renderActiveView()}
        </div>
      </main>

      {/* Global Upgrade Pricing Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-2xl relative text-center space-y-6 bg-white">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Upgrade to Enterprise Premium</h3>
              <p className="text-sm text-slate-500">Unlock advanced LLM modeling and expand document indices constraints.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-xs font-mono uppercase text-indigo-600 font-bold">Standard Tier</p>
                <h4 className="text-lg font-bold text-slate-900">Free / 14-day Trial</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  20 GB Vector index cache limits, Atlas-4 standard reasoning model, 3 automated execution workflows.
                </p>
              </div>

              <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2 relative overflow-hidden">
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-mono rounded font-bold uppercase tracking-wider">POPULAR</span>
                <p className="text-xs font-mono uppercase text-indigo-700 font-bold">Enterprise Pro</p>
                <h4 className="text-lg font-bold text-slate-900">$49/mo</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Unlimited high-density vector space, Atlas-4 reasoning pro limits, custom API integrations and SSO.
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-sans font-bold py-3 rounded-xl cursor-pointer transition-all"
              >
                Back to Workspace
              </button>
              <button 
                onClick={() => {
                  setShowUpgradeModal(false);
                  handleAddActivity('Workspace upgraded successfully to Enterprise Pro', 'workspace_premium');
                  alert('Workspace upgraded to Enterprise Pro! Limits are now lifted.');
                }}
                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-sans font-bold py-3 rounded-xl cursor-pointer shadow-lg shadow-indigo-100 transition-all"
              >
                Activate Pro License
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated System Execution Console Logs Modal */}
      {showLogsConsole && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-800 shadow-2xl relative flex flex-col max-h-[80vh] bg-slate-950 text-slate-100">
            <button 
              onClick={() => setShowLogsConsole(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${auditStatus === 'running' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 animate-ping'}`} />
                <h3 className="text-xs font-mono text-slate-300">System Daemon Log Auditer (KOS-Term v4.1.0)</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Secure Cluster Connection</span>
            </div>

            {/* Telemetry Dashboard Stats */}
            <div className="grid grid-cols-4 gap-2.5 mb-3 text-left">
              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Audit State</span>
                <span className={`text-xs font-mono font-bold uppercase ${auditStatus === 'running' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {auditStatus}
                </span>
              </div>
              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Progress</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{auditProgress}%</span>
              </div>
              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">CPU / Memory</span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {auditStatus === 'running' ? '28.4%' : '11.2%'} / 12.4 GB
                </span>
              </div>
              <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Coherence</span>
                <span className="text-xs font-mono font-bold text-slate-300">128-bit</span>
              </div>
            </div>

            {/* Interactive Scrolling Terminal Console */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 border border-slate-850 rounded-xl font-mono text-[11px] text-slate-300 space-y-2 leading-relaxed custom-scrollbar min-h-[220px]">
              {auditLogs.map((log, index) => {
                let colorClass = 'text-slate-300';
                if (log.type === 'accent') colorClass = 'text-amber-400 font-bold';
                if (log.type === 'success') colorClass = 'text-emerald-400 font-bold';
                if (log.type === 'warn') colorClass = 'text-yellow-500';
                if (log.type === 'error') colorClass = 'text-rose-500 font-bold';

                return (
                  <p key={index} className="animate-in fade-in slide-in-from-bottom-1 duration-150">
                    <span className="text-slate-600 mr-2 shrink-0 select-none">{log.time}</span>
                    <span className={colorClass}>{log.text}</span>
                  </p>
                );
              })}
              {auditStatus === 'running' && (
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 animate-pulse mt-3 font-bold">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <span>Scanning cluster vectors and performing parity checks...</span>
                </div>
              )}
              <div ref={consoleEndRef} />
            </div>

            {/* Audit Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Sector Integrity Ratio</span>
                <span>{auditProgress}% Done</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300 relative"
                  style={{ width: `${auditProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-900 mt-4">
              <div className="text-[10px] text-slate-500 font-mono">
                {auditStatus === 'running' ? '✓ Operation Authoritative' : '✓ Audit Completed Successfully'}
              </div>
              <div className="flex gap-2">
                {auditStatus === 'completed' && (
                  <>
                    <button 
                      onClick={() => {
                        const logContent = auditLogs.map(log => `${log.time} ${log.text}`).join('\n');
                        const content = `==================================================\nKNOWLEDGEOS SECURITY AUDIT REPORT\nRun Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\nStatus: PASS / OPTIMAL\n==================================================\n\n${logContent}\n\n==================================================\nGenerated by KOS-Audit Daemon v4.1.0\nSecure Cryptographic Handshake Signature Verified.`;
                        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `KOS_Security_Audit_${new Date().toISOString().slice(0,10)}.txt`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        handleAddActivity('Exported complete security audit system logs', 'download_done');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-sans font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 border border-slate-800"
                    >
                      <span className="material-symbols-outlined text-xs">download</span> Export Report
                    </button>
                    <button 
                      onClick={handleRunGlobalAudit}
                      className="bg-slate-900 hover:bg-slate-800 text-indigo-400 font-sans font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 border border-slate-800"
                    >
                      <span className="material-symbols-outlined text-xs">refresh</span> Run Again
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setShowLogsConsole(false)}
                  className="bg-indigo-600 text-white font-sans font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer shadow-lg shadow-indigo-100 transition-all flex items-center gap-1"
                >
                  {auditStatus === 'running' ? 'Background Thread' : 'Close Terminal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Docs / API Setup Guide Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-200 shadow-2xl relative flex flex-col max-h-[85vh] bg-white">
            <button 
              onClick={() => setShowDocsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-150">
              <span className="material-symbols-outlined text-indigo-600 text-xl font-bold">menu_book</span>
              <h3 className="text-base font-bold text-slate-900">KnowledgeOS User Guide &amp; API Setup</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed pr-2 custom-scrollbar">
              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 text-base">1. Grounded Knowledge Retrieval</h4>
                <p>
                  KnowledgeOS integrates with vector databases to perform semantic and keyword indexation of complex documents. Uploaded CSVs, PDFs, and Markdown files are segmented and vectorized inside the browser memory model to answer user questions securely and dynamically.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 text-base">2. Active Modeling Selection</h4>
                <p>
                  You can seamlessly hot-swap between multiple advanced modeling layers directly in the Chat interface. Select **Atlas-4** for multi-step logical reasoning, **Quantum-X** for sub-millisecond high-speed replies, or standard Flash/Pro weights based on your compute preference.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 text-base">3. Developer API Call Integrations</h4>
                <p>
                  Automate workflow executions using standard JSON payloads sent to standard cluster ports. KnowledgeOS supports event triggers on Slack syncs, newly indexed files, or scheduled cron routines.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-indigo-600 leading-normal">
                  <p>// POST /api/v1/trigger-sync</p>
                  <p>{`{ "clusterId": "alpha-1", "maskPii": true }`}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

