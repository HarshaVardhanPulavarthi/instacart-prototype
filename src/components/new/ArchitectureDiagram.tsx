import { useState } from 'react';
import { ArrowRight, ArrowDown, ArrowUp, Activity, ShieldCheck, HelpCircle, AlertOctagon, Layers } from 'lucide-react';

type FlowMode = 'all' | 'act' | 'ask' | 'stop';

export default function ArchitectureDiagram() {
  const [activeFlow, setActiveFlow] = useState<FlowMode>('all');

  const isStepHighlighted = (step: string) => {
    if (activeFlow === 'all') return true;
    if (activeFlow === 'act') return ['agent', 'gateway', 'intent', 'authority', 'execution', 'evidence'].includes(step);
    if (activeFlow === 'ask') return ['agent', 'gateway', 'intent', 'user_confirms', 'pref_store', 'authority'].includes(step);
    if (activeFlow === 'stop') return ['agent', 'gateway', 'intent', 'authority', 'execution', 'stop_halt'].includes(step);
    return true;
  };

  return (
    <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E8E2D9] shadow-sm mb-14 text-gray-900 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 pb-6 mb-8 border-b border-[#E8E2D9]">
        <div>
          <div className="text-[11px] font-bold text-[#C2410C] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Layers size={13} />
            <span>System Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#143D30] tracking-tight m-0">
            How an agent request becomes a safe order
          </h2>
          <div className="text-[11px] font-semibold text-[#9A3412] uppercase tracking-wider mt-2">
            Proposed Design · No Existing Instacart Systems or Endpoints are Assumed
          </div>
        </div>

        {/* Interactive Mode Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs self-start lg:self-auto">
          <button
            onClick={() => setActiveFlow('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFlow === 'all' ? 'bg-[#143D30] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Full Architecture
          </button>
          <button
            onClick={() => setActiveFlow('act')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeFlow === 'act' ? 'bg-green-700 text-white shadow-xs' : 'text-green-800 hover:bg-green-50'
            }`}
          >
            <ShieldCheck size={12} />
            <span>ACT Path</span>
          </button>
          <button
            onClick={() => setActiveFlow('ask')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeFlow === 'ask' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            <HelpCircle size={12} />
            <span>ASK Loop</span>
          </button>
          <button
            onClick={() => setActiveFlow('stop')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeFlow === 'stop' ? 'bg-red-700 text-white shadow-xs' : 'text-red-800 hover:bg-red-50'
            }`}
          >
            <AlertOctagon size={12} />
            <span>STOP Halt</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="space-y-6 overflow-x-auto pb-2 custom-scrollbar">
        
        {/* ROW 1: 6-Step Main Execution Pipeline */}
        <div className="min-w-[900px]">
          <div className="grid grid-cols-6 gap-3 items-stretch relative">
            
            {/* Step 1: AGENT */}
            <div className={`transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border ${
              isStepHighlighted('agent') 
                ? 'bg-white border-gray-300 shadow-xs' 
                : 'bg-white/40 border-gray-200/50 opacity-40'
            }`}>
              <div>
                <div className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider mb-1.5">1 · Agent</div>
                <div className="font-bold text-gray-900 text-sm leading-snug">User's external AI agent</div>
              </div>
              <div className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
                Sends a structured request
              </div>
            </div>

            {/* Step 2: GATEWAY */}
            <div className={`transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border relative ${
              isStepHighlighted('gateway') 
                ? 'bg-white border-gray-300 shadow-xs' 
                : 'bg-white/40 border-gray-200/50 opacity-40'
            }`}>
              {/* Left Connector Arrow */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                <ArrowRight size={14} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider mb-1.5">2 · Gateway</div>
                <div className="font-bold text-gray-900 text-sm leading-snug">API / MCP gateway</div>
              </div>
              <div className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
                Access, permissions, format
              </div>
            </div>

            {/* Step 3: INTENT */}
            <div className={`transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border relative ${
              isStepHighlighted('intent') 
                ? 'bg-[#EAF3EE] border-[#B2D8C7] shadow-xs' 
                : 'bg-green-50/20 border-green-200/40 opacity-40'
            }`}>
              {/* Left Connector Arrow */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                <ArrowRight size={14} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider mb-1.5">3 · Intent</div>
                <div className="font-bold text-gray-900 text-sm leading-snug">Intent and quantity validator</div>
              </div>
              <div className="text-[11px] text-gray-600 mt-3 pt-2 border-t border-green-200/60">
                Variants, units, pack sizes
              </div>
            </div>

            {/* Step 4: AUTHORITY */}
            <div className={`transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border relative ${
              isStepHighlighted('authority') 
                ? 'bg-[#EAF3EE] border-[#B2D8C7] shadow-xs' 
                : 'bg-green-50/20 border-green-200/40 opacity-40'
            }`}>
              {/* Left Connector Arrow */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                <ArrowRight size={14} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider mb-1.5">4 · Authority</div>
                <div className="font-bold text-gray-900 text-sm leading-snug">Preference and policy</div>
              </div>
              <div className="text-[11px] text-gray-600 mt-3 pt-2 border-t border-green-200/60">
                Limits, rules, hard constraints
              </div>
            </div>

            {/* Step 5: EXECUTION */}
            <div className={`transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border relative ${
              isStepHighlighted('execution') 
                ? 'bg-white border-gray-300 shadow-xs' 
                : 'bg-white/40 border-gray-200/50 opacity-40'
            }`}>
              {/* Left Connector Arrow */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                <ArrowRight size={14} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider mb-1.5">5 · Execution</div>
                <div className="font-bold text-gray-900 text-sm leading-snug">Catalog and execution</div>
              </div>
              <div className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
                Availability, price, order
              </div>
            </div>

            {/* Step 6: EVIDENCE */}
            <div className={`transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border relative ${
              isStepHighlighted('evidence') 
                ? 'bg-white border-gray-300 shadow-xs' 
                : 'bg-white/40 border-gray-200/50 opacity-40'
            }`}>
              {/* Left Connector Arrow */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                <ArrowRight size={14} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider mb-1.5">6 · Evidence</div>
                <div className="font-bold text-gray-900 text-sm leading-snug">Receipt and audit log</div>
              </div>
              <div className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
                Asked, happened, why, recovery
              </div>
            </div>

          </div>

          {/* Connectors Between Row 1 and Row 2 */}
          <div className="grid grid-cols-6 gap-3 my-2 text-center">
            <div className="col-span-2 relative flex items-center justify-end pr-8">
              {/* Updated request loop line returning to Step 1 */}
              <div className={`text-[10px] font-bold text-[#143D30] flex items-center gap-1 transition-opacity ${
                activeFlow === 'ask' || activeFlow === 'all' ? 'opacity-100' : 'opacity-20'
              }`}>
                <ArrowUp size={13} className="text-[#143D30]" />
                <span>updated request</span>
              </div>
            </div>

            {/* ASK Branch under Step 3 */}
            <div className="flex justify-center items-center">
              <div className={`flex flex-col items-center transition-opacity ${
                activeFlow === 'ask' || activeFlow === 'all' ? 'opacity-100' : 'opacity-20'
              }`}>
                <span className="text-[10px] font-black text-[#C2410C] uppercase tracking-wider mb-0.5">ASK</span>
                <ArrowDown size={15} className="text-[#C2410C] stroke-[2.5]" />
              </div>
            </div>

            {/* Reads Branch under Step 4 */}
            <div className="flex justify-center items-center">
              <div className={`flex flex-col items-center transition-opacity ${
                activeFlow === 'ask' || activeFlow === 'all' ? 'opacity-100' : 'opacity-20'
              }`}>
                <ArrowUp size={15} className="text-green-700 stroke-[2.5]" />
                <span className="text-[10px] font-bold text-green-800 mt-0.5">reads</span>
              </div>
            </div>

            {/* STOP Branch under Step 5 */}
            <div className="flex justify-center items-center col-span-2 justify-start pl-12">
              <div className={`flex flex-col items-center transition-opacity ${
                activeFlow === 'stop' || activeFlow === 'all' ? 'opacity-100' : 'opacity-20'
              }`}>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-wider mb-0.5">STOP</span>
                <ArrowDown size={15} className="text-red-600 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* ROW 2: Feedback & Safety Branching */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            
            {/* Blank Spacer under Steps 1 & 2 */}
            <div className="col-span-2"></div>

            {/* User Confirms (Spans under Step 3 and into Step 2) */}
            <div className={`col-span-3 transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border-2 ${
              isStepHighlighted('user_confirms') 
                ? 'bg-white border-[#143D30] shadow-sm' 
                : 'bg-white/40 border-gray-200/50 opacity-40'
            }`}>
              <div>
                <div className="font-black text-gray-900 text-sm">User confirms</div>
                <div className="text-[11px] text-gray-500 mt-1">Proposed: WhatsApp or in-app</div>
              </div>
              <div className="text-[10px] font-bold text-primary flex items-center gap-1 mt-2">
                <span>Resolves doubt</span>
              </div>
            </div>

            {/* Save arrow connector */}
            <div className="col-span-1 flex items-center justify-center">
              <div className={`flex flex-col items-center text-center transition-opacity ${
                activeFlow === 'ask' || activeFlow === 'all' ? 'opacity-100' : 'opacity-20'
              }`}>
                <span className="text-[10px] font-bold text-gray-500">save</span>
                <ArrowRight size={14} className="text-gray-400 stroke-[2.5]" />
              </div>
            </div>

            {/* User Preference Store (Under Step 4) */}
            <div className={`col-span-3 transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border ${
              isStepHighlighted('pref_store') 
                ? 'bg-[#EAF3EE] border-[#B2D8C7] shadow-xs' 
                : 'bg-green-50/20 border-green-200/40 opacity-40'
            }`}>
              <div>
                <div className="font-bold text-gray-900 text-sm">User preference store</div>
                <div className="text-[11px] text-gray-600 mt-1">Private to the user</div>
              </div>
              <div className="text-[10px] font-bold text-green-800 flex items-center gap-1 mt-2">
                <span>Personal constitution</span>
              </div>
            </div>

            {/* STOP Halt Box (Under Step 5) */}
            <div className={`col-span-3 transition-all duration-300 rounded-xl p-4 flex flex-col justify-between border-2 ${
              isStepHighlighted('stop_halt') 
                ? 'bg-[#FDF2F2] border-[#B91C1C] shadow-sm' 
                : 'bg-red-50/20 border-red-200/40 opacity-40'
            }`}>
              <div>
                <div className="font-black text-[#B91C1C] text-sm">STOP</div>
                <div className="text-[11px] text-red-900 mt-1 leading-snug">
                  Hard rule broken or action cannot be verified: that action halts
                </div>
              </div>
              <div className="text-[10px] font-bold text-red-700 flex items-center gap-1 mt-2">
                <span>Non-overridable boundary</span>
              </div>
            </div>

          </div>

        </div>

        {/* Global Monitoring & Logging Bar */}
        <div className="p-3 bg-white/80 border border-gray-200/80 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 text-center shadow-2xs">
          <Activity size={15} className="text-[#143D30] animate-pulse" />
          <span>Logging and monitoring across every step: request ID, decision, reason</span>
        </div>

        {/* Product Thesis Legend */}
        <div className="pt-2 text-center text-xs sm:text-sm text-gray-600 leading-relaxed">
          <span className="font-bold text-green-800 bg-green-50 px-2 py-0.5 rounded border border-green-200">ACT</span> when intent is clear and inside the mandate.{' '}
          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 ml-1">ASK</span> when the user can resolve it.{' '}
          <span className="font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200 ml-1">STOP</span> when a hard rule fails or the result cannot be verified.
        </div>

      </div>

      {/* Footer Meta */}
      <div className="pt-4 mt-6 border-t border-[#E8E2D9] flex justify-between items-center text-[10px] text-gray-400 font-medium">
        <span>Instacart, Ready to Act · Agent-readiness case study</span>
        <span className="font-mono">Reference Spec · Slide 3</span>
      </div>
    </div>
  );
}
