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

  const loadScenario = (type: 'act' | 'brand' | 'price' | 'stop') => {
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
        action: "Scenario: Approved Staple Order",
        decision: "ACT",
        checks: [
          { name: "Approved Staples Scope", passed: true, details: "All items match approved staple manifest." },
          { name: "Spending Cap", passed: true, details: "₹104.00 is well within ₹500 budget." },
          { name: "Dietary Restrictions", passed: true, details: "Zero allergens detected." }
        ],
        reason: "Approved staple, within budget, valid quantity. Agent clears autonomous execution.",
        timestamp: Date.now()
      });
    } else if (type === 'brand') {
      setupScenario(
        { 
          budget: 1000, 
          maxAbsolutePriceIncrease: 150, 
          preferredBrands: ['Amul'], 
          doubtResolutionChannel: 'whatsapp' 
        }, 
        [
          { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p2')!, quantity: 1, isUnavailable: false, status: 'pending' as const },
          { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p5')!, quantity: 1, isUnavailable: false, status: 'pending' as const }
        ]
      );
      addLog({
        action: "Scenario: Brand Preference Check",
        decision: "ASK",
        checks: [
          { name: "Brand Match", passed: false, details: "Preferred brand is Amul. Non-Amul substitutions require confirmation." },
          { name: "Doubt Channel", passed: "AMBIGUOUS", details: "Paging user via WhatsApp." }
        ],
        reason: "Preferred brand requires confirmation if substitution occurs.",
        requiredAction: "Confirm brand switch if out of stock.",
        timestamp: Date.now()
      });
    } else if (type === 'price') {
      const baseBasket = [
        { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p10')!, quantity: 2, isUnavailable: false, status: 'pending' as const },
        { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p11')!, quantity: 1, isUnavailable: false, status: 'pending' as const }
      ];
      setupScenario(
        { budget: 300, maxAbsolutePriceIncrease: 10, maxPercentagePriceIncrease: 10, doubtResolutionChannel: 'whatsapp' },
        baseBasket
      );
      addLog({
        action: "Scenario: Price Spike / Budget Exceeded",
        decision: "STOP",
        checks: [
          { name: "Spending Cap", passed: false, details: "Total ₹440 exceeds ₹300 limit." }
        ],
        reason: "Basket total exceeds hard budget constraint.",
        requiredAction: "Increase budget or remove items.",
        timestamp: Date.now()
      });
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
          { name: "Dietary Restrictions (Hard Constraint)", passed: false, details: `Contains Almonds (Tree Nuts), strictly prohibited.` },
          { name: "Agent Authority", passed: true, details: "Agent active, but hard constraint supersedes authority." }
        ],
        reason: "Tree-nut ingredient violates hard dietary restriction.",
        requiredAction: "Remove restricted item to proceed.",
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Banner: Scenario Simulator & Signature Challenge */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0">Interactive Simulator</h2>
            <span className="badge badge-act text-[10px] py-0.5">Live Gateway</span>
          </div>
          <p className="text-xs text-gray-500 m-0">
            Configure the Constitution on the left, then simulate stockouts or price changes in the basket on the right.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* ACT Pill */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 hover:bg-green-100 transition-colors border border-green-200/60"
            onClick={() => loadScenario('act')}
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Safe Sub</span>
            <span className="text-[10px] font-bold text-green-700 bg-green-200/60 px-1.5 rounded">ACT</span>
          </button>

          {/* ASK Pill */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors border border-amber-200/60"
            onClick={() => loadScenario('brand')}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Brand Mismatch</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-1.5 rounded">ASK</span>
          </button>

          {/* STOP Pill 1 */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 hover:bg-red-100 transition-colors border border-red-200/60"
            onClick={() => loadScenario('price')}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Price Spike</span>
            <span className="text-[10px] font-bold text-red-700 bg-red-200/60 px-1.5 rounded">STOP</span>
          </button>

          {/* STOP Pill 2 */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 hover:bg-red-100 transition-colors border border-red-200/60"
            onClick={() => loadScenario('stop')}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Allergy Risk</span>
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

      {/* Main Workspace Layout: Side-by-Side (Left-Right) */}
      <div className="workspace-grid mb-16 max-w-7xl mx-auto">
        {/* Left Sidebar: Constitution Controls + Event Audit Log */}
        <div className="flex flex-col gap-6">
          <TrustControlCenter />

          {/* Event Audit Log */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-900 m-0">Event Audit Log</h3>
                <p className="text-[11px] text-gray-400 m-0 mt-0.5">Append-only record of gateway decisions</p>
              </div>
              <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                Immutable Trail
              </span>
            </div>

            <div className="p-4 overflow-y-auto max-h-[460px] space-y-3 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="text-xs text-gray-400 italic text-center py-8">
                  No gateway events recorded yet. Click one of the test scenarios above or simulate a stockout in the basket to inspect rules.
                </div>
              ) : (
                logs.map((log, i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-xl bg-gray-50/70 hover:bg-gray-100/80 transition-colors cursor-pointer border border-transparent hover:border-gray-200/80"
                    onClick={() => setSelectedLogForDetail(log)}
                    title="Click to inspect rule checks"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`badge ${log.decision === 'ACT' ? 'badge-act' : log.decision === 'ASK' ? 'badge-ask' : 'badge-stop'} text-[9px] px-2 py-0.5`}>
                        {log.decision}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-900 mt-1 leading-snug">{log.action}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{log.reason}</div>
                    <div className="text-[10px] text-primary font-bold mt-1.5 flex items-center gap-1">
                      <span>Inspect Rule Checks</span>
                      <ArrowRight size={10} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column: Live Basket & Execution */}
        <div className="flex flex-col gap-6">
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
