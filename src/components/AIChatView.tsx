import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { playUiClick, playUiChime, playModelSwap, playEngineSuccess } from '../utils/audio';
import { ChatMessage, DocumentItem, DocType } from '../types';

interface AIChatViewProps {
  documents: DocumentItem[];
  chatHistory: ChatMessage[];
  setChatHistory: Dispatch<SetStateAction<ChatMessage[]>>;
  onActivityAdded: (activity: string, icon: string) => void;
}

export default function AIChatView({
  documents,
  chatHistory,
  setChatHistory,
  onActivityAdded
}: AIChatViewProps) {
  const [input, setInput] = useState('');
  const [deepSearch, setDeepSearch] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingDetail, setThinkingDetail] = useState('Analyzing additional vectors...');
  const [selectedModel, setSelectedModel] = useState<'atlas-4' | 'quantum-x' | 'gemini-pro' | 'gemini-flash'>('atlas-4');
  const [copiedBlockIdx, setCopiedBlockIdx] = useState<number | null>(null);
  
  // Track open/collapsed state of thinking logs for each message ID
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBlockIdx(index);
    setTimeout(() => {
      setCopiedBlockIdx(null);
    }, 2000);
  };

  const parseInlineMarkdown = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs text-indigo-600 font-bold">$1</code>');
  };

  const renderMarkdown = (text: string) => {
    const blocks = text.split(/\n\n+/);
    return (
      <div className="space-y-4">
        {blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Check for headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={bIdx} className="text-sm font-bold text-slate-800 mt-4 mb-1 font-sans border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full" />
                {trimmed.substring(4)}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={bIdx} className="text-base font-bold text-slate-900 mt-5 mb-1.5 font-sans flex items-center gap-2">
                <span className="w-2 h-4 bg-indigo-600 rounded-sm" />
                {trimmed.substring(3)}
              </h3>
            );
          }

          // Check if list
          const lines = trimmed.split('\n');
          const isList = lines.every(line => {
            const l = line.trim();
            return l.startsWith('* ') || l.startsWith('- ') || /^\d+\.\s/.test(l);
          });

          if (isList) {
            return (
              <ul key={bIdx} className="space-y-2 pl-4 border-l-2 border-indigo-100 py-1 bg-slate-50/40 rounded-r-xl pr-3">
                {lines.map((line, lIdx) => {
                  const cleanLine = line.trim().replace(/^[\*\-\d\.]+\s+/, '');
                  return (
                    <li key={lIdx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cleanLine) }} />
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Check for code block
          if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
            const lines = trimmed.split('\n');
            const language = lines[0].replace('```', '') || 'code';
            const content = trimmed.slice(3, -3).replace(/^[a-zA-Z]+\n/, '');
            
            return (
              <div key={bIdx} className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md my-3 max-w-full">
                {/* Code Block Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-1 uppercase tracking-wider font-bold text-slate-500">{language}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(content, bIdx)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-slate-800/50 hover:bg-slate-800 px-2 py-1 rounded border border-slate-700/60"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedBlockIdx === bIdx ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedBlockIdx === bIdx ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                {/* Code Content */}
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed custom-scrollbar bg-slate-950">
                  <code>{content}</code>
                </pre>
              </div>
            );
          }

          return (
            <p 
              key={bIdx} 
              className="text-slate-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }}
            />
          );
        })}
      </div>
    );
  };

  const handleSend = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    
    const queryToSend = customQuery || input;
    if (!queryToSend.trim() || isThinking) return;

    playUiClick();

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      message: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!customQuery) setInput('');
    setIsThinking(true);
    
    // Progress messages during thinking simulation
    const thinkingDetails = [
      'Scanning active index files...',
      'Synthesizing memory vectors...',
      'Executing cognitive reasoning chain...',
      'Assembling logical schema summary...'
    ];
    let stepIdx = 0;
    setThinkingDetail(thinkingDetails[0]);

    const progressInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < thinkingDetails.length) {
        setThinkingDetail(thinkingDetails[stepIdx]);
      } else {
        clearInterval(progressInterval);
      }
    }, 400);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: queryToSend,
        history: chatHistory,
        documents: documents,
        model: selectedModel
      })
    })
    .then(res => {
      clearInterval(progressInterval);
      if (!res.ok) {
        throw new Error('Intelligence Node returned an error');
      }
      return res.json();
    })
    .then(data => {
      playUiChime();
      const aiMsgId = Math.random().toString(36).substr(2, 9);
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        message: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources && data.sources.length > 0 ? data.sources : undefined,
        modelName: data.modelName || 'Atlas-4 Reasoner',
        thinkingSteps: data.thinkingSteps || []
      };

      // By default, expand the thinking logs for reasoning model to let users see how it solves their request!
      if (data.thinkingSteps && data.thinkingSteps.length > 0) {
        setExpandedThinking(prev => ({ ...prev, [aiMsgId]: true }));
      }

      setChatHistory((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      onActivityAdded(`Queried model [${data.modelName || 'Atlas-4'}]: "${queryToSend.substring(0, 30)}..."`, 'auto_awesome');
    })
    .catch(err => {
      clearInterval(progressInterval);
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        message: `⚠️ **System Interface Interruption:** I encountered an issue establishing a secure uplink to the Atlas-4 modeling engine.\n\n*Error details: ${err.message || 'Node network handshake failed'}.*\n\nPlease verify that the local intelligence dev server is active and accessible.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, errorMsg]);
      setIsThinking(false);
    });
  };

  const loadSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const getIconForType = (type: DocType) => {
    switch (type) {
      case 'pdf': return 'picture_as_pdf';
      case 'csv': return 'table_chart';
      case 'md': return 'description';
      default: return 'feed';
    }
  };

  const toggleThinking = (msgId: string) => {
    setExpandedThinking(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const triggerActionChip = (chipType: string) => {
    if (isThinking) return;
    let query = "";
    if (chipType === "swot") {
      query = "Perform a high-level SWOT analysis based on our current indexed documents. Focus on strategic findings.";
    } else if (chipType === "summary") {
      query = "Summarize the primary strategic goals, metrics, and files currently active in our document memory.";
    } else if (chipType === "audit") {
      query = "Analyze the active document workspace files for key technical debt, vulnerabilities, or action items.";
    } else if (chipType === "code") {
      query = "Draft a robust, highly optimized TypeScript architectural plan or code solution for our criteria.";
    }
    
    handleSend(undefined, query);
  };

  const handleSelectModel = (model: 'atlas-4' | 'quantum-x' | 'gemini-pro' | 'gemini-flash') => {
    playModelSwap();
    setSelectedModel(model);
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-100px)] animate-in fade-in duration-300">
      
      {/* Center Chat Feed Area */}
      <div className="flex-1 flex flex-col relative bg-white border border-slate-200 rounded-2xl overflow-hidden xl:mr-6 shadow-sm">
        
        {/* Model Selection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/80 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">Active Modeling Hub</span>
          </div>
 
          {/* Selector Tabs */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl overflow-x-auto max-w-full custom-scrollbar shrink-0">
            <button
              onClick={() => handleSelectModel('atlas-4')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer ${
                selectedModel === 'atlas-4'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              Atlas-4 Reasoner
              <span className="bg-indigo-100 text-indigo-700 font-mono text-[9px] px-1 rounded font-bold">Pro</span>
            </button>
            <button
              onClick={() => handleSelectModel('quantum-x')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer ${
                selectedModel === 'quantum-x'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Quantum-X
            </button>
            <button
              onClick={() => handleSelectModel('gemini-pro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer ${
                selectedModel === 'gemini-pro'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Pro 3.5
            </button>
            <button
              onClick={() => handleSelectModel('gemini-flash')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer ${
                selectedModel === 'gemini-flash'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">speed</span>
              Flash
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`max-w-3xl mx-auto w-full flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-2`}>
              
              {/* Header for AI response */}
              {msg.sender === 'ai' && (
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                      <span className="material-symbols-outlined text-[14px] font-bold">bolt</span>
                    </div>
                    <span className="font-mono text-[10px] text-indigo-600 uppercase tracking-widest font-bold">
                      {msg.modelName || 'KOS INTELLIGENCE'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content Bubble */}
              <div 
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-100 text-slate-800 rounded-tr-none max-w-[85%] border border-slate-200/40 shadow-sm'
                    : 'bg-transparent text-slate-800 max-w-[95%]'
                }`}
              >
                {/* Expandable Thinking Process block */}
                {msg.sender === 'ai' && msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                  <div className="mb-4 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-sm max-w-2xl">
                    <button
                      type="button"
                      onClick={() => toggleThinking(msg.id)}
                      className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100/80 hover:bg-slate-100 transition-colors text-left text-[11px] font-mono text-indigo-600 font-bold cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] animate-spin">schema</span>
                        <span>Reasoning Chain ({msg.thinkingSteps.length} stages)</span>
                      </div>
                      <span className="material-symbols-outlined text-sm">
                        {expandedThinking[msg.id] ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    
                    {expandedThinking[msg.id] && (
                      <div className="p-3 bg-slate-50/50 border-t border-slate-200 text-[11px] font-mono text-slate-500 space-y-1.5 leading-relaxed">
                        {msg.thinkingSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2">
                            <span className="text-emerald-500">✔</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Text Content */}
                {msg.sender === 'ai' ? (
                  renderMarkdown(msg.message)
                ) : (
                  <p>{msg.message}</p>
                )}

                {/* Sources attachment rendering */}
                {msg.sources && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Indexed Citations ({msg.sources.length})</p>
                    {msg.sources.map((src, sIdx) => (
                      <div key={sIdx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs shadow-sm hover:border-indigo-300 transition-colors">
                        <div className="flex items-center gap-1.5 text-indigo-600 font-mono font-semibold mb-1">
                          <span className="material-symbols-outlined text-[16px]">description</span>
                          {src.name}
                        </div>
                        <p className="text-slate-500 italic">"{src.excerpt}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <span className="text-[9px] font-mono text-slate-400 px-2">{msg.timestamp}</span>
              )}
            </div>
          ))}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="max-w-3xl mx-auto w-full flex flex-col items-start gap-2.5 py-4 border-l-2 border-indigo-200 pl-4 bg-indigo-50/30 rounded-r-2xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-indigo-600 animate-spin">schema</span>
                </div>
                <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider">Reasoning Process:</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
                <span className="text-xs font-mono text-slate-500 italic">{thinkingDetail}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick-action AI prompts */}
        <div className="px-6 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto custom-scrollbar bg-slate-50/40">
          <button
            onClick={() => triggerActionChip('swot')}
            disabled={isThinking}
            className="flex items-center gap-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm text-left shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xs">analytics</span>
            🧠 Strategic SWOT Matrix
          </button>
          <button
            onClick={() => triggerActionChip('summary')}
            disabled={isThinking}
            className="flex items-center gap-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm text-left shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xs">summarize</span>
            📊 Executive Summary Memo
          </button>
          <button
            onClick={() => triggerActionChip('audit')}
            disabled={isThinking}
            className="flex items-center gap-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm text-left shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xs">security</span>
            ⚡ Tech Debt & Vulnerability Audit
          </button>
          <button
            onClick={() => triggerActionChip('code')}
            disabled={isThinking}
            className="flex items-center gap-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm text-left shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xs">terminal</span>
            🔬 Architecture Architect
          </button>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <form onSubmit={(e) => handleSend(e)} className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-lg shadow-indigo-100/10 relative flex flex-col gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Ask anything with ${selectedModel === 'atlas-4' ? 'Atlas-4 Reasoner' : 'active model'}...`}
              rows={1}
              className="w-full bg-transparent border-none resize-none px-3 py-1 text-sm text-slate-800 focus:ring-0 focus:outline-none custom-scrollbar max-h-32 placeholder-slate-400"
            />
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 pb-1 px-3">
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => alert("File attachment simulated! Drag-and-drop file here or use the Knowledge Base to index permanently.")}
                  className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  attach_file
                </button>
                <button 
                  type="button"
                  onClick={() => alert("Mock image capture simulated.")}
                  className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  image
                </button>
                <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                
                {/* Deep Search Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setDeepSearch(!deepSearch);
                    alert(`Deep Search indexing mode: ${!deepSearch ? 'ON' : 'OFF'}`);
                  }}
                  className={`flex items-center gap-1.5 text-[10px] font-mono px-3 py-1 rounded border transition-all cursor-pointer ${
                    deepSearch
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-semibold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Deep Search
                </button>
              </div>

              <button 
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_upward</span>
              </button>
            </div>
          </form>
          <p className="text-center text-[9px] text-slate-400 mt-3 font-mono uppercase tracking-widest">
            KnowledgeOS may generate speculative intelligence. Verify critical citations.
          </p>
        </div>

      </div>

      {/* Right Sidebar: Document Memory & Suggested Prompts */}
      <aside className="w-80 border-l border-slate-200 bg-transparent flex flex-col hidden xl:flex shrink-0">
        <div className="pl-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Document Memory */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold">Document Memory</h3>
              <button className="material-symbols-outlined text-sm text-slate-400 hover:text-slate-600 cursor-pointer">more_horiz</button>
            </div>
            
            <div className="space-y-2">
              {documents.slice(0, 3).map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => loadSuggestedPrompt(`Can you analyze ${doc.name} for any strategic findings?`)}
                  className="glass-card p-3 rounded-xl flex items-center gap-3 group border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <span className="material-symbols-outlined">{getIconForType(doc.type)}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-slate-800 truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">{doc.type} • {doc.size}</p>
                  </div>
                  <span className="material-symbols-outlined text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">push_pin</span>
                </div>
              ))}
            </div>
          </section>

          {/* Next Steps / Suggested Prompts */}
          <section className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-indigo-600 text-sm">lightbulb</span>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold">Next Steps</h3>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => loadSuggestedPrompt("Can you explain the current status of the Quantum Ledger Project and cite the most recent technical specifications?")}
                className="w-full text-left p-3 text-xs border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-600 leading-relaxed cursor-pointer"
              >
                "Summarize the Quantum Ledger Project specifications..."
              </button>
              <button 
                onClick={() => loadSuggestedPrompt("Compare the Rydberg arrays of the legacy auth module with v3.8 hardware architecture.")}
                className="w-full text-left p-3 text-xs border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-600 leading-relaxed cursor-pointer"
              >
                "Compare Rydberg arrays with v3.8 architecture..."
              </button>
              <button 
                onClick={() => loadSuggestedPrompt("Export technical specifications and Project Aurora Slack debt to markdown format.")}
                className="w-full text-left p-3 text-xs border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-600 leading-relaxed cursor-pointer"
              >
                "Export technical specifications to Markdown..."
              </button>
            </div>
          </section>

          {/* Intelligence Token Usage gauge */}
          <section className="pt-6 border-t border-slate-100 mt-auto">
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-600">Intelligence Token Usage</span>
                <span className="text-xs font-mono text-slate-400 font-bold">84%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: '84%' }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-2.5 font-mono leading-tight">
                Advanced model 'Atlas-4' active. Reset in 4.2h.
              </p>
            </div>
          </section>

        </div>
      </aside>

    </div>
  );
}
