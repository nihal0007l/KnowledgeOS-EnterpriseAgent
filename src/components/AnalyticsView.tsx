import { useState } from 'react';

export default function AnalyticsView() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeRange, setActiveRange] = useState<'24h' | '7d' | '30d'>('24h');

  const queries = [
    { intent: 'Summarize recent earnings calls', cluster: 'Finance-GPT-4o', latency: '420ms', volume: '12,482', rate: 98, status: 'STABLE', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/50' },
    { intent: 'Retrieve technical specs for Project Phoenix', cluster: 'Engineering-RAG', latency: '610ms', volume: '8,103', rate: 82, status: 'MONITOR', statusColor: 'bg-amber-50 text-amber-600 border-amber-200/50' },
    { intent: 'Compare Q3 marketing spend vs budget', cluster: 'Marketing-Analyst', latency: '380ms', volume: '5,291', rate: 95, status: 'STABLE', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/50' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Analytics view header */}
      <section className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Overview</h2>
          <p className="text-sm text-slate-500">Monitoring enterprise intelligence performance across all clusters.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setActiveRange(range);
                  alert(`Filtering analytics metrics for past ${range}`);
                }}
                className={`px-4 py-1.5 rounded font-sans font-bold text-xs cursor-pointer transition-all ${
                  activeRange === range
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => alert("Downloading CSV of performance analytics metrics...")}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg font-sans font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export
          </button>
        </div>
      </section>

      {/* Bento Grid layout */}
      <section className="grid grid-cols-12 gap-6">
        
        {/* Main Retrieval Accuracy line graph - Span 8 */}
        <div className="bento-card col-span-12 lg:col-span-8 rounded-xl p-6 flex flex-col border border-slate-200 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-indigo-600">Retrieval Accuracy</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Semantic Precision Over Time</p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600">
              <span className="text-xl font-bold text-slate-800">98.4%</span>
              <span className="material-symbols-outlined text-[20px] text-emerald-500 font-bold">trending_up</span>
            </div>
          </div>

          {/* Interactive Line Chart using SVG */}
          <div className="flex-1 min-h-[240px] relative flex items-end">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="w-full h-[1px] bg-slate-300" />
              <div className="w-full h-[1px] bg-slate-300" />
              <div className="w-full h-[1px] bg-slate-300" />
              <div className="w-full h-[1px] bg-slate-300" />
            </div>

            <svg className="w-full h-[200px]" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path 
                d="M0,35 Q10,32 20,28 T40,25 T60,18 T80,12 T100,5" 
                fill="none" 
                stroke="#4f46e5" 
                strokeWidth="1.2" 
              />
              <path 
                d="M0,35 Q10,32 20,28 T40,25 T60,18 T80,12 T100,5 V40 H0 Z" 
                fill="url(#grad1)" 
                opacity="0.1" 
              />
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hover tooltip trigger node point */}
            <div 
              onMouseEnter={() => setHoveredPoint(1)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="absolute top-1/4 left-[60%] group cursor-pointer"
            >
              <div className="w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-md shadow-indigo-200 transition-transform hover:scale-125" />
              {hoveredPoint === 1 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs whitespace-nowrap z-10 text-slate-100 font-mono shadow-2xl">
                  <p className="font-bold text-indigo-400">98.4% Accuracy</p>
                  <p className="opacity-60 text-[9px] mt-0.5">12:45 PM Today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Groundedness Gauge - Span 4 */}
        <div className="bento-card col-span-12 lg:col-span-4 rounded-xl p-6 flex flex-col items-center justify-between border border-slate-200 bg-white shadow-sm">
          <div className="w-full">
            <h3 className="text-xl font-bold text-amber-500">Groundedness Score</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Citation Integrity</p>
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center mt-4">
            <svg className="w-full h-full -rotate-90">
              <circle cx="88" cy="88" fill="transparent" r="72" stroke="#f1f5f9" strokeWidth="10" />
              <circle 
                cx="88" 
                cy="88" 
                fill="transparent" 
                r="72" 
                stroke="#f59e0b" 
                strokeWidth="10" 
                strokeDasharray="452" 
                strokeDashoffset="45" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-amber-600">0.92</span>
              <span className="text-[9px] font-mono font-bold text-slate-500 tracking-widest mt-1">OPTIMAL</span>
            </div>
          </div>

          <div className="w-full space-y-2 mt-4 text-left">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Verifiable facts</span>
              <span className="font-bold text-slate-850">94%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
              <div className="h-full bg-amber-500 w-[94%]" />
            </div>
          </div>
        </div>

        {/* Hallucination Risk Bar Chart - Span 4 */}
        <div className="bento-card col-span-12 md:col-span-6 lg:col-span-4 rounded-xl p-6 flex flex-col border border-slate-200 bg-white shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-rose-600">Hallucination Risk</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Probability Metrics</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-3 mt-8 min-h-[140px]">
            <div className="w-full bg-rose-50 border border-rose-100 rounded-t-lg h-[40%] hover:h-[48%] hover:bg-rose-100/50 transition-all duration-300 cursor-pointer" />
            <div className="w-full bg-rose-50 border border-rose-100 rounded-t-lg h-[65%] hover:h-[72%] hover:bg-rose-100/50 transition-all duration-300 cursor-pointer" />
            <div className="w-full bg-rose-100 border border-rose-200 rounded-t-lg h-[85%] hover:h-[92%] hover:bg-rose-200 transition-all duration-300 cursor-pointer" />
            <div className="w-full bg-rose-50 border border-rose-100 rounded-t-lg h-[30%] hover:h-[38%] hover:bg-rose-100/50 transition-all duration-300 cursor-pointer" />
            <div className="w-full bg-rose-50/50 border border-rose-100/50 rounded-t-lg h-[20%] hover:h-[28%] hover:bg-rose-100/30 transition-all duration-300 cursor-pointer" />
          </div>
          <div className="flex justify-between mt-3 text-[10px] font-mono text-slate-400 uppercase font-semibold">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
          </div>
        </div>

        {/* Query Volume - Span 8 */}
        <div className="bento-card col-span-12 md:col-span-6 lg:col-span-8 rounded-xl p-6 border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-violet-600">Query Volume</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Request Density</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-violet-700">2.4M</span>
              <p className="text-[10px] text-slate-500 font-medium">+12% vs last period</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 h-28 items-end">
            <div className="col-span-1 bg-violet-50 hover:bg-violet-100 border border-violet-100 h-[30%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-50 hover:bg-violet-100 border border-violet-100 h-[45%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-100 hover:bg-violet-200 h-[60%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-200 hover:bg-violet-300 h-[75%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-100 hover:bg-violet-200 h-[50%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-50 hover:bg-violet-100 border border-violet-100 h-[40%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-100 hover:bg-violet-200 h-[65%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-300 hover:bg-violet-400 h-[80%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-400 hover:bg-violet-500 h-[90%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-200 hover:bg-violet-300 h-[70%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-100 hover:bg-violet-200 h-[55%] rounded hover:scale-y-105 transition-all cursor-pointer" />
            <div className="col-span-1 bg-violet-50 hover:bg-violet-100 border border-violet-100 h-[35%] rounded hover:scale-y-105 transition-all cursor-pointer" />
          </div>
        </div>

        {/* Top Queries Table success rates - Span 12 */}
        <div className="bento-card col-span-12 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Top Queries &amp; Success Rates</h3>
            <button onClick={() => alert("Showing all top queries...")} className="text-indigo-600 font-sans font-semibold text-sm hover:underline cursor-pointer">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Query Intent</th>
                  <th className="px-6 py-3 text-center">Avg. Latency</th>
                  <th className="px-6 py-3 text-center">Volume</th>
                  <th className="px-6 py-3">Success Rate</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold text-sm">{q.intent}</span>
                        <span className="text-xs text-slate-400 mt-1 font-medium">{q.cluster}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-slate-500">{q.latency}</td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-slate-500">{q.volume}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[120px] border border-slate-200/40">
                          <div 
                            className={`h-full ${q.rate > 90 ? 'bg-indigo-600' : 'bg-amber-500'}`} 
                            style={{ width: `${q.rate}%` }} 
                          />
                        </div>
                        <span className={`text-xs font-mono font-bold ${q.rate > 90 ? 'text-indigo-600' : 'text-amber-650'}`}>{q.rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-mono border ${q.statusColor} font-bold`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

    </div>
  );
}
