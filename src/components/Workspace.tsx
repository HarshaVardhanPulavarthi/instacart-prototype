import { useState } from 'react';
import TrustControlCenter from './new/TrustControlCenter';
import LiveBasket from './new/LiveBasket';
import SignatureSubstitutionChallenge from './new/SignatureSubstitutionChallenge';
import DecisionExplanation from './new/DecisionExplanation';
import { useShopping } from '../context/ShoppingContext';
import { catalog } from '../mockData';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import type { DecisionLog } from '../decisionEngine';

export default function Workspace() {
  const { logs, setupScenario, addLog } = useShopping();
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<DecisionLog | null>(null);

  const loadScenario = (type: 'act' | 'ask' | 'stop' | 'price' | 'brand') => {
    if (type === 'act') {
      // 1. ACT: Approved staple, within budget, valid quantity
      const stapleBasket = [
        { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p1')!, quantity: 1, isUnavailable: false, status: 'pending' as const }, // Toned Milk ₹54
        { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p5')!, quantity: 1, isUnavailable: false, status: 'pending' as const }  // Whole Wheat Bread ₹50
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
    } else if (type === 'ask') {
      // 2. ASK: Unfamiliar product or ambiguous quantity
      const dragonfruit = catalog.find(p => p.id === 'p23') || catalog[0];
      const ambiguousBasket = [
        { id: `b_${Date.now()}_1`, product: dragonfruit, quantity: 1, isUnavailable: false, status: 'pending' as const }, // Dragonfruit (Unfamiliar)
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
    } else if (type === 'stop') {
      // 3. STOP: Tree-nut ingredient violates a hard restriction
      const almondGranola = catalog.find(p => p.id === 'p21') || catalog.find(p => p.id === 'p7')!;
      const allergyBasket = [
        { id: `b_${Date.now()}_1`, product: almondGranola, quantity: 1, isUnavailable: false, status: 'pending' as const }, // Almond Granola
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
    } else if (type === 'price') {
      // Price Spike
      setupScenario(
        { budget: 150, maxAbsolutePriceIncrease: 10, maxPercentagePriceIncrease: 15 },
        [
          { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p10')!, quantity: 1, isUnavailable: false, status: 'pending' as const }, // Rice ₹180 (Over ₹150 budget)
        ]
      );
    } else if (type === 'brand') {
      // Brand Mismatch
      setupScenario(
        { budget: 1000, preferredBrands: ['Amul'], doubtResolutionChannel: 'in-app' },
        [
          { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p1')!, quantity: 1, isUnavailable: false, status: 'pending' as const }, // Local Dairy Milk (Not Amul)
        ]
      );
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Top Banner: Scenario Simulator & Signature Challenge */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-gray-900 m-0">ACT / ASK / STOP Simulator</h2>
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
              Rule Engine
            </span>
          </div>
          <p className="text-xs text-gray-500 m-0 max-w-xl">
            Click any realistic scenario below to observe how the Instacart Gateway evaluates spending limits, approved staples, and dietary constraints in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Canonical Scenario 1: ACT */}
          <button 
            className="btn btn-outline bg-white hover:bg-green-50 text-xs py-2 px-3 border-green-300 text-green-900 flex items-center gap-1.5 shadow-2xs font-semibold"
            onClick={() => loadScenario('act')}
            title="Approved staple within budget"
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Approved Staple</span>
            <span className="badge badge-act text-[9px] px-1 py-0 ml-1">ACT</span>
          </button>

          {/* Canonical Scenario 2: ASK */}
          <button 
            className="btn btn-outline bg-white hover:bg-amber-50 text-xs py-2 px-3 border-amber-300 text-amber-900 flex items-center gap-1.5 shadow-2xs font-semibold"
            onClick={() => loadScenario('ask')}
            title="Unfamiliar product or ambiguous quantity"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Unfamiliar Item</span>
            <span className="badge badge-ask text-[9px] px-1 py-0 ml-1">ASK</span>
          </button>

          {/* Canonical Scenario 3: STOP */}
          <button 
            className="btn btn-outline bg-white hover:bg-red-50 text-xs py-2 px-3 border-red-300 text-red-900 flex items-center gap-1.5 shadow-2xs font-semibold"
            onClick={() => loadScenario('stop')}
            title="Tree-nut ingredient violates hard restriction"
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Nut Restriction</span>
            <span className="badge badge-stop text-[9px] px-1 py-0 ml-1">STOP</span>
          </button>

          {/* Feature 4: Signature Interaction Trigger */}
          <button 
            className="btn btn-primary text-xs py-2 px-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white flex items-center gap-1.5 shadow-sm font-bold border-0 ml-auto lg:ml-2"
            onClick={() => setShowChallengeModal(true)}
          >
            <ShieldAlert size={14} className="animate-pulse" />
            <span>Unsafe Substitution Challenge</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="workspace-grid mb-16 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1">
            <TrustControlCenter />
          </div>

          {/* Event Audit Log */}
          <div className="workspace-panel flex-1 flex flex-col p-0 overflow-hidden" style={{ minHeight: '400px' }}>
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-900 m-0">Event Audit Log</h3>
                <p className="text-[11px] text-gray-500 m-0">Append-only record of gateway decisions.</p>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Immutable</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {logs.length === 0 ? (
                <div className="text-xs text-gray-400 italic text-center mt-10 p-4">
                  No gateway events recorded yet. Click one of the test scenarios above or simulate a stockout in the basket to inspect rules.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {logs.map((log, i) => (
                    <div 
                      key={i} 
                      className="text-xs border-l-3 pl-3 py-1 relative cursor-pointer hover:bg-gray-50 rounded-r transition-colors"
                      style={{ borderColor: log.decision === 'ACT' ? 'var(--color-act)' : log.decision === 'ASK' ? 'var(--color-ask)' : 'var(--color-stop)' }}
                      onClick={() => setSelectedLogForDetail(log)}
                      title="Click to view rule checks"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`badge ${log.decision === 'ACT' ? 'badge-act' : log.decision === 'ASK' ? 'badge-ask' : 'badge-stop'} text-[9px] px-2 py-0.5`}>
                          {log.decision}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-900 leading-snug">{log.action}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{log.reason}</div>
                      <div className="text-[10px] text-primary mt-1 font-semibold flex items-center gap-1">
                        <span>Inspect Rule Checks</span>
                        <ArrowRight size={10} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="h-full" style={{ minHeight: '800px' }}>
          <LiveBasket />
        </div>
      </div>

      {/* Signature Unsafe Substitution Challenge Modal (Feature 4) */}
      <SignatureSubstitutionChallenge 
        isOpen={showChallengeModal} 
        onClose={() => setShowChallengeModal(false)} 
      />

      {/* Decision Explanation Detail Modal */}
      {selectedLogForDetail && (
        <DecisionExplanation 
          log={selectedLogForDetail} 
          onClose={() => setSelectedLogForDetail(null)} 
        />
      )}
    </div>
  );
}
