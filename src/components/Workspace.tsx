import { useState } from 'react';
import TrustControlCenter from './new/TrustControlCenter';
import LiveBasket from './new/LiveBasket';
import SignatureSubstitutionChallenge from './new/SignatureSubstitutionChallenge';
import DecisionExplanation from './new/DecisionExplanation';
import { useShopping } from '../context/ShoppingContext';
import { catalog } from '../mockData';
import { ShieldAlert, ArrowRight, ShoppingCart, ListFilter } from 'lucide-react';
import type { DecisionLog } from '../decisionEngine';

export default function Workspace() {
  const { logs, setupScenario, addLog } = useShopping();
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<DecisionLog | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'basket' | 'audit'>('basket');

  const loadScenario = (type: 'act' | 'ask' | 'stop') => {
    if (type === 'act') {
      const stapleBasket = [
        { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p1')!, quantity: 1, isUnavailable: false, status: 'pending' as const },
        { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p5')!, quantity: 1, isUnavailable: false, status: 'pending' as const }
      ];
      setupScenario(
        { 
          budget: 500, 
          maxAbsolutePriceIncrease: 50, 
          dietaryRestrictions: ['Peanut', 'Tree-Nut'],
          autonomyLevel: 'settled-staples',
          approvedStaples: ['Toned Milk', '100% Whole Wheat Bread']
        }, 
        stapleBasket
      );
      addLog({
        action: "Scenario Loaded: Approved Staple Order",
        decision: "ACT",
        checks: [
          { name: "Approved Staples Scope", passed: true, details: "All items match approved staple manifest." },
          { name: "Spending Cap", passed: true, details: "₹104.00 is well within ₹500 budget." },
          { name: "Dietary Restrictions", passed: true, details: "Zero allergens detected." }
        ],
        reason: "Approved staple, within budget, valid quantity. Agent clears autonomous execution.",
        timestamp: Date.now()
      });
      setRightPanelTab('basket');
    } else if (type === 'ask') {
      const dragonfruit = catalog.find(p => p.id === 'p23') || catalog[0];
      const ambiguousBasket = [
        { id: `b_${Date.now()}_1`, product: dragonfruit, quantity: 1, isUnavailable: false, status: 'pending' as const },
        { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p1')!, quantity: 1, isUnavailable: false, status: 'pending' as const }
      ];
      setupScenario(
        { 
          budget: 500, 
          autonomyLevel: 'settled-staples',
          approvedStaples: ['Toned Milk', '100% Whole Wheat Bread'],
          doubtResolutionChannel: 'whatsapp'
        }, 
        ambiguousBasket
      );
      addLog({
        action: `Unfamiliar product detected: '${dragonfruit.name}'`,
        decision: "ASK",
        checks: [
          { name: "Approved Staples Scope", passed: false, details: `'${dragonfruit.name}' is outside approved staples and autonomy level is settled-staples.` },
          { name: "Doubt Channel", passed: "AMBIGUOUS", details: "Paging user via WhatsApp for explicit purchase confirmation." }
        ],
        reason: "Unfamiliar product not in approved staples list. Gateway halts to ask for user approval.",
        requiredAction: "Approve or decline unfamiliar item.",
        timestamp: Date.now()
      });
      setRightPanelTab('basket');
    } else if (type === 'stop') {
      const almondGranola = catalog.find(p => p.id === 'p21') || catalog.find(p => p.id === 'p7')!;
      const allergyBasket = [
        { id: `b_${Date.now()}_1`, product: almondGranola, quantity: 1, isUnavailable: false, status: 'pending' as const },
        { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p1')!, quantity: 1, isUnavailable: false, status: 'pending' as const }
      ];
      setupScenario(
        { 
          budget: 500, 
          dietaryRestrictions: ['Tree-Nut', 'Peanut'],
          doubtResolutionChannel: 'whatsapp'
        }, 
        allergyBasket
      );
      addLog({
        action: `Attempted checkout with allergen: '${almondGranola.name}'`,
        decision: "STOP",
        checks: [
          { name: "Dietary Restrictions (Hard Constraint)", passed: false, details: `Contains Almonds (Tree Nuts), strictly prohibited by mandate.` },
          { name: "Agent Authority", passed: true, details: "Agent active, but hard constraint supersedes authority." }
        ],
        reason: "Tree-nut ingredient violates hard dietary restriction. Hard constraints cannot be overridden.",
        requiredAction: "Remove restricted item to proceed.",
        timestamp: Date.now()
      });
      setRightPanelTab('basket');
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Bar: Clean Simulator Controls */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0">Decision Simulator</h2>
            <span className="badge badge-act text-[10px] py-0.5">Live Gateway</span>
          </div>
          <p className="text-xs text-gray-500 m-0">
            Select a test scenario to evaluate real-time policy rules, or tweak the Constitution on the left.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* ACT Pill */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 hover:bg-green-100 transition-colors"
            onClick={() => loadScenario('act')}
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Staple</span>
            <span className="text-[10px] font-bold text-green-700 bg-green-200/60 px-1.5 rounded">ACT</span>
          </button>

          {/* ASK Pill */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
            onClick={() => loadScenario('ask')}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Unfamiliar</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-1.5 rounded">ASK</span>
          </button>

          {/* STOP Pill */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 hover:bg-red-100 transition-colors"
            onClick={() => loadScenario('stop')}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Nut Risk</span>
            <span className="text-[10px] font-bold text-red-700 bg-red-200/60 px-1.5 rounded">STOP</span>
          </button>

          {/* Signature Challenge CTA */}
          <button 
            className="btn btn-primary text-xs py-2 px-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white flex items-center gap-1.5 rounded-full font-bold shadow-xs border-0 ml-auto lg:ml-2"
            onClick={() => setShowChallengeModal(true)}
          >
            <ShieldAlert size={14} className="animate-pulse" />
            <span>Unsafe Substitution Challenge</span>
          </button>
        </div>
      </div>

      {/* Balanced 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Constitution Controls (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <TrustControlCenter />
        </div>

        {/* Right Column: Execution & Audit Stream (7 cols) */}
        <div className="lg:col-span-7 h-full flex flex-col gap-4">
          
          {/* Sub-nav Tab Toggle */}
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-2xs self-start gap-1">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                rightPanelTab === 'basket'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => setRightPanelTab('basket')}
            >
              <ShoppingCart size={14} />
              <span>Live Basket & Execution</span>
            </button>

            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                rightPanelTab === 'audit'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => setRightPanelTab('audit')}
            >
              <ListFilter size={14} />
              <span>Event Audit Log ({logs.length})</span>
            </button>
          </div>

          {/* Tab 1: Live Basket */}
          {rightPanelTab === 'basket' && (
            <div className="space-y-4">
              <LiveBasket />

              {/* Compact Event Peek at the bottom of Basket */}
              {logs.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Latest Gateway Decision
                    </span>
                    <button 
                      className="text-[11px] text-primary font-bold hover:underline"
                      onClick={() => setRightPanelTab('audit')}
                    >
                      View all ({logs.length}) →
                    </button>
                  </div>

                  <div 
                    className="flex justify-between items-center p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedLogForDetail(logs[0])}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`badge ${logs[0].decision === 'ACT' ? 'badge-act' : logs[0].decision === 'ASK' ? 'badge-ask' : 'badge-stop'} text-[9px] px-2 py-0.5`}>
                        {logs[0].decision}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{logs[0].action}</div>
                        <div className="text-[11px] text-gray-500 leading-tight">{logs[0].reason}</div>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Full Event Audit Log */}
          {rightPanelTab === 'audit' && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900 m-0">Event Audit Log</h3>
                  <p className="text-xs text-gray-400 m-0 mt-0.5">Append-only record of all autonomous evaluations</p>
                </div>
                <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  Immutable Trail
                </span>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs italic">
                  No gateway events recorded yet. Click one of the test scenarios or simulate an action in the basket.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, i) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                      onClick={() => setSelectedLogForDetail(log)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`badge ${log.decision === 'ACT' ? 'badge-act' : log.decision === 'ASK' ? 'badge-ask' : 'badge-stop'} text-[9px] px-2 py-0.5`}>
                          {log.decision}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 mt-1">{log.action}</div>
                      <div className="text-[11px] text-gray-600 mt-0.5">{log.reason}</div>
                      <div className="text-[10px] text-primary font-bold mt-2 flex items-center gap-1">
                        <span>Inspect Checks</span> →
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Signature Modal */}
      <SignatureSubstitutionChallenge 
        isOpen={showChallengeModal} 
        onClose={() => setShowChallengeModal(false)} 
      />

      {/* Decision Detail Modal */}
      {selectedLogForDetail && (
        <DecisionExplanation 
          log={selectedLogForDetail} 
          onClose={() => setSelectedLogForDetail(null)} 
        />
      )}
    </div>
  );
}
