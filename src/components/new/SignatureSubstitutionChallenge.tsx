import { useState } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { catalog } from '../../mockData';
import { ShieldAlert, CheckCircle2, ArrowRight, MessageCircle, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignatureSubstitutionChallenge({ isOpen, onClose }: Props) {
  const { addLog, addItem } = useShopping();
  const [resolutionState, setResolutionState] = useState<'initial' | 'safe_alt' | 'skipped' | 'asked'>('initial');

  if (!isOpen) return null;

  const originalProduct = catalog.find(p => p.id === 'p20') || {
    id: 'p20',
    name: 'Nut-Free Honey Oat Granola',
    brand: 'Nature Valley',
    price: 220,
    size: '400g',
    category: 'Cereals',
    ingredients: ['Rolled Oats', 'Honey', 'Sunflower Seeds'],
    imageUrl: ''
  };

  const unsafeCandidate = catalog.find(p => p.id === 'p21') || {
    id: 'p21',
    name: 'Crunchy Almond Granola',
    brand: 'Nutty Crunch',
    price: 240,
    size: '400g',
    category: 'Cereals',
    ingredients: ['Rolled Oats', 'Almonds (Tree Nuts)', 'Honey'],
    imageUrl: ''
  };

  const safeAlternative = catalog.find(p => p.id === 'p22') || {
    id: 'p22',
    name: 'Safe Berry Granola',
    brand: 'True Elements',
    price: 230,
    size: '400g',
    category: 'Cereals',
    ingredients: ['Rolled Oats', 'Dried Cranberries', 'Chia Seeds', 'Honey'],
    imageUrl: ''
  };

  const handleChooseSafeAlt = () => {
    // Add safe item and log ACT
    addItem(safeAlternative);
    addLog({
      action: `Resolved: Selected safe verified substitute '${safeAlternative.name}'`,
      decision: 'ACT',
      checks: [
        { name: "Dietary Verification", passed: true, details: "100% nut-free recipe verified from verified ingredient manifest." },
        { name: "Price Boundary", passed: true, details: `₹${safeAlternative.price} is within spending tolerance.` }
      ],
      reason: "Safe alternative passes all dietary and price checks.",
      timestamp: Date.now()
    });
    setResolutionState('safe_alt');
  };

  const handleSkipItem = () => {
    addLog({
      action: `Skipped unavailable item: '${originalProduct.name}'`,
      decision: 'ACT',
      checks: [
        { name: "Safety Policy", passed: true, details: "Item dropped to prevent dietary violation." }
      ],
      reason: "Item omitted from basket safely without compromising dietary restriction.",
      timestamp: Date.now()
    });
    setResolutionState('skipped');
  };

  const handleAskUser = () => {
    addLog({
      action: `Escalated to WhatsApp: Clarification for '${originalProduct.name}' substitution`,
      decision: 'ASK',
      checks: [
        { name: "Doubt Channel", passed: "AMBIGUOUS", details: "Sent WhatsApp message: 'Granola out of stock. Would you prefer safe Berry Granola or skip?'" }
      ],
      reason: "Agent paused execution to solicit explicit human instruction.",
      requiredAction: "Awaiting WhatsApp response from user.",
      timestamp: Date.now()
    });
    setResolutionState('asked');
  };

  const handleResetChallenge = () => {
    setResolutionState('initial');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-t-2xl flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert size={14} /> Signature Safety Challenge
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white m-0">
              Unsafe Substitution Challenge
            </h2>
            <p className="text-xs text-red-100 m-0 mt-1 max-w-lg">
              Watch how the Instacart Safety Gateway prevents LLM hallucination and convenience shortcuts when a hard dietary constraint is at stake.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* 1. Context: Stockout Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Out of Stock Original */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 relative">
              <span className="absolute top-2 right-2 text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                Out of Stock ❌
              </span>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Requested Product</div>
              <div className="font-bold text-gray-900 text-base">{originalProduct.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">₹{originalProduct.price.toFixed(2)} • {originalProduct.size}</div>
              <div className="mt-2 text-[11px] text-green-700 font-medium bg-green-50 px-2 py-1 rounded inline-block">
                ✓ Verified Nut-Free Recipe
              </div>
            </div>

            {/* Agent's Proposed Substitute */}
            <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 relative">
              <span className="absolute top-2 right-2 text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                Agent Proposed
              </span>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Standard LLM Recommendation</div>
              <div className="font-bold text-gray-900 text-base">{unsafeCandidate.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">₹{unsafeCandidate.price.toFixed(2)} • {unsafeCandidate.size} (+₹20.00)</div>
              <div className="mt-2 text-[11px] text-amber-800 italic">
                "Similar taste profile and size match"
              </div>
            </div>
          </div>

          {/* 2. The Conflict & Ingredient Evidence */}
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚫</span>
                <div>
                  <div className="text-xs font-bold text-red-900 uppercase tracking-wider">Conflicting Dietary Mandate</div>
                  <div className="text-sm font-bold text-red-800">
                    Hard Constraint: No Peanuts / Tree-Nuts Active
                  </div>
                </div>
              </div>
              <span className="badge badge-stop text-xs px-2.5 py-1">STOP</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-red-200 text-xs">
              <div className="font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>Evidence from Ingredient List:</span>
                <span className="text-[10px] text-red-600 font-mono">Gateway Regex Scan</span>
              </div>
              <div className="font-mono text-gray-800 leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">
                Rolled Oats, <span className="bg-red-200 text-red-900 font-black px-1.5 py-0.5 rounded border border-red-400">Almonds (Tree Nuts) ⚠️ VIOLATION</span>, Honey, Cinnamon
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-red-800 bg-red-100/50 p-2.5 rounded-lg border border-red-200">
              <span className="font-bold flex-shrink-0">Core Thesis:</span>
              <span>A hard constraint cannot be overridden by convenience or LLM semantic similarity. The gateway strictly halts this substitution.</span>
            </div>
          </div>

          {/* 3. Outcome & Safe Next Actions */}
          <div className="border-t border-gray-200 pt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900 m-0 uppercase tracking-wider">
                Safe Next Actions
              </h3>
              {resolutionState !== 'initial' && (
                <button 
                  onClick={handleResetChallenge}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw size={12} /> Reset Challenge
                </button>
              )}
            </div>

            {resolutionState === 'initial' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Action 1: Verified Safe Alternative */}
                <button 
                  onClick={handleChooseSafeAlt}
                  className="p-3.5 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-left transition-all hover:shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Option 1</div>
                    <div className="font-bold text-green-950 text-sm group-hover:text-green-800">
                      Choose Verified Alternative
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Swap with {safeAlternative.name} (Nut-free verified recipe).
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-green-800">
                    <span>Approve (ACT)</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Action 2: Skip Item */}
                <button 
                  onClick={handleSkipItem}
                  className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left transition-all hover:shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Option 2</div>
                    <div className="font-bold text-gray-900 text-sm">
                      Skip This Item
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Omit granola entirely; proceed with rest of the basket safely.
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Drop Item</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Action 3: Ask User via WhatsApp */}
                <button 
                  onClick={handleAskUser}
                  className="p-3.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-left transition-all hover:shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Option 3</div>
                    <div className="font-bold text-blue-950 text-sm group-hover:text-blue-800">
                      Ask User on WhatsApp
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Pause execution and ping user's mobile device for instructions.
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-blue-800">
                    <span>Escalate (ASK)</span>
                    <MessageCircle size={14} />
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl border bg-white shadow-sm">
                {resolutionState === 'safe_alt' && (
                  <div className="flex items-start gap-3 text-green-900">
                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-base">Safely Substituted with {safeAlternative.name}!</div>
                      <div className="text-xs text-gray-600 mt-1">
                        The gateway validated the verified nut-free manifest and authorized the swap under Decision Budget rules (Outcome: ACT). Item added to basket.
                      </div>
                    </div>
                  </div>
                )}
                {resolutionState === 'skipped' && (
                  <div className="flex items-start gap-3 text-gray-900">
                    <XCircle size={24} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-base">Item Safely Skipped</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Granola was removed from the order. The rest of the basket remains intact, preserving hard allergy boundaries.
                      </div>
                    </div>
                  </div>
                )}
                {resolutionState === 'asked' && (
                  <div className="flex items-start gap-3 text-blue-900">
                    <MessageCircle size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-base">WhatsApp Clarification Prompt Dispatched!</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Message sent: "Your usual Nut-Free Granola is out of stock. Would you prefer Safe Berry Granola (+₹10) or skip?" Transaction paused awaiting reply.
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <button className="btn btn-outline text-xs py-1.5 px-3" onClick={handleResetChallenge}>
                    Try Another Action
                  </button>
                  <button className="btn btn-primary text-xs py-1.5 px-4" onClick={onClose}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
