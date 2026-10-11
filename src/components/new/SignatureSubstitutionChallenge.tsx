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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-t-3xl flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert size={13} /> Signature Challenge
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white m-0">
              Unsafe Substitution Challenge
            </h2>
            <p className="text-xs text-red-100 m-0 mt-1 max-w-lg">
              Observe how the Instacart Safety Gateway prevents LLM convenience shortcuts when a hard dietary constraint is at stake.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* 1. Context: Stockout Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Out of Stock Original */}
            <div className="p-4 rounded-2xl bg-gray-50 relative">
              <span className="absolute top-3 right-3 text-[9px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full uppercase">
                Stockout ❌
              </span>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Requested Product</div>
              <div className="font-bold text-gray-900 text-sm">{originalProduct.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 font-mono">₹{originalProduct.price.toFixed(2)} • {originalProduct.size}</div>
              <div className="mt-2 text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded inline-block">
                ✓ Verified Nut-Free Recipe
              </div>
            </div>

            {/* Agent's Proposed Substitute */}
            <div className="p-4 rounded-2xl bg-amber-50/60 relative">
              <span className="absolute top-3 right-3 text-[9px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">
                LLM Proposed
              </span>
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Standard Recommendation</div>
              <div className="font-bold text-gray-900 text-sm">{unsafeCandidate.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 font-mono">₹{unsafeCandidate.price.toFixed(2)} • {unsafeCandidate.size} (+₹20.00)</div>
              <div className="mt-2 text-[10px] text-amber-800 italic">
                "Semantic similarity: Granola for Granola"
              </div>
            </div>
          </div>

          {/* 2. The Conflict & Ingredient Evidence */}
          <div className="p-4 rounded-2xl bg-red-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🚫</span>
                <div>
                  <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Mandate Conflict</div>
                  <div className="text-xs font-bold text-red-900">
                    Hard Constraint: No Tree-Nuts / Peanuts
                  </div>
                </div>
              </div>
              <span className="badge badge-stop text-[9px] px-2 py-0.5">STOP</span>
            </div>

            <div className="p-3 bg-white rounded-xl text-xs">
              <div className="font-bold text-gray-500 text-[10px] uppercase mb-1">
                Evidence from Ingredient List:
              </div>
              <div className="font-mono text-gray-800 text-[11px] bg-gray-50 p-2 rounded-lg leading-relaxed">
                Rolled Oats, <span className="bg-red-200 text-red-900 font-bold px-1.5 py-0.5 rounded">Almonds (Tree Nuts) ⚠️ VIOLATION</span>, Honey, Cinnamon
              </div>
            </div>

            <p className="text-[11px] text-red-800 m-0 leading-snug">
              <strong>Core Thesis:</strong> A hard constraint cannot be overridden by convenience. The gateway strictly halts this substitution.
            </p>
          </div>

          {/* 3. Outcome & Safe Next Actions */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Safe Recovery Options
              </span>
              {resolutionState !== 'initial' && (
                <button 
                  onClick={handleResetChallenge}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>

            {resolutionState === 'initial' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Option 1 */}
                <button 
                  onClick={handleChooseSafeAlt}
                  className="p-3.5 rounded-2xl bg-green-50/70 hover:bg-green-100 text-left transition-all hover:shadow-2xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[9px] font-bold text-green-700 uppercase tracking-wider mb-1">Option 1</div>
                    <div className="font-bold text-green-950 text-xs group-hover:text-green-800">
                      Verified Alternative
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Swap with {safeAlternative.name} (Nut-free verified).
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-green-800">
                    <span>Approve (ACT)</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option 2 */}
                <button 
                  onClick={handleSkipItem}
                  className="p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-left transition-all hover:shadow-2xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Option 2</div>
                    <div className="font-bold text-gray-900 text-xs">
                      Skip Item
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Omit granola entirely; proceed with rest of the basket safely.
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Drop Item</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option 3 */}
                <button 
                  onClick={handleAskUser}
                  className="p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100 text-left transition-all hover:shadow-2xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[9px] font-bold text-blue-700 uppercase tracking-wider mb-1">Option 3</div>
                    <div className="font-bold text-blue-950 text-xs group-hover:text-blue-800">
                      Ask on WhatsApp
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Pause execution and ping user device for clarification.
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-blue-800">
                    <span>Escalate (ASK)</span>
                    <MessageCircle size={12} />
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gray-50">
                {resolutionState === 'safe_alt' && (
                  <div className="flex items-start gap-2.5 text-green-900 text-xs">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Safely Substituted with {safeAlternative.name}!</div>
                      <p className="text-[11px] text-gray-500 mt-0.5 m-0">
                        The gateway validated the verified nut-free manifest and authorized the swap (Outcome: ACT).
                      </p>
                    </div>
                  </div>
                )}
                {resolutionState === 'skipped' && (
                  <div className="flex items-start gap-2.5 text-gray-900 text-xs">
                    <XCircle size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Item Safely Skipped</div>
                      <p className="text-[11px] text-gray-500 mt-0.5 m-0">
                        Granola was removed from the order. The rest of the basket remains intact, preserving hard allergy boundaries.
                      </p>
                    </div>
                  </div>
                )}
                {resolutionState === 'asked' && (
                  <div className="flex items-start gap-2.5 text-blue-900 text-xs">
                    <MessageCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">WhatsApp Clarification Prompt Dispatched!</div>
                      <p className="text-[11px] text-gray-500 mt-0.5 m-0">
                        Message sent: "Your usual Nut-Free Granola is out of stock. Would you prefer Safe Berry Granola (+₹10) or skip?"
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-3 flex justify-end gap-2">
                  <button className="btn btn-outline text-xs py-1 px-3 rounded-lg" onClick={handleResetChallenge}>
                    Try Another
                  </button>
                  <button className="btn btn-primary text-xs py-1 px-4 rounded-lg" onClick={onClose}>
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
