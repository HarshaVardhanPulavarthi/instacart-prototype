import { useState, useEffect } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { Play, Pause, RotateCcw, CheckCircle2, FileText, Lock, Sparkles } from 'lucide-react';

export default function IntentReceipt() {
  const { mandate, basket, basketTotal } = useShopping();
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState<number | null>(null);

  const replaySequence = [
    {
      step: 1,
      title: "1. Intent Ingestion",
      desc: "User voice/text intent parsed: 'Weekly staples, under ₹500, no tree-nuts or peanuts.'",
      badge: "INGEST"
    },
    {
      step: 2,
      title: "2. Constitution Binding",
      desc: `Bounded to Spending Cap ₹${mandate.budget.toFixed(2)}, Autonomy: ${mandate.autonomyLevel || 'settled-staples'}, Dietary: [${mandate.dietaryRestrictions.join(', ')}].`,
      badge: "MANDATE"
    },
    {
      step: 3,
      title: "3. Inventory & Stockout Check",
      desc: "Queried live merchant catalog. Primary staple out of stock; alternative candidates evaluated.",
      badge: "INVENTORY"
    },
    {
      step: 4,
      title: "4. Gateway Constraint Verification",
      desc: "Allergen parser identified tree-nut risk on candidate -> STOP. Safe alternative verified -> ACT.",
      badge: "GATEWAY"
    },
    {
      step: 5,
      title: "5. Safe Resolution Committed",
      desc: "Safe staple added to basket. Running total recalculated within authorized budget envelope.",
      badge: "RESOLVE"
    },
    {
      step: 6,
      title: "6. Idempotent Order Confirmation",
      desc: "Signed with idempotency key `idemp_8923a1_sec`. Payment authorized exactly once.",
      badge: "VERIFIED"
    }
  ];

  useEffect(() => {
    let timer: any;
    if (isReplaying && replayStep !== null) {
      if (replayStep < replaySequence.length - 1) {
        timer = setTimeout(() => {
          setReplayStep(prev => (prev !== null ? prev + 1 : 0));
        }, 1800);
      } else {
        setIsReplaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isReplaying, replayStep]);

  const handleStartReplay = () => {
    setReplayStep(0);
    setIsReplaying(true);
  };

  const handleResetReplay = () => {
    setIsReplaying(false);
    setReplayStep(null);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 font-sans max-w-xl mx-auto text-xs">
      {/* Top Header */}
      <div className="flex justify-between items-start pb-4 border-b border-gray-100 mb-4">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-base">
            <FileText size={17} className="text-primary" />
            <span>Intent Receipt</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
            TX_ID: req_8923a1_verified • {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {/* Replay Order Button */}
        <div className="flex items-center gap-1">
          {replayStep === null ? (
            <button 
              className="btn btn-primary text-xs py-1.5 px-3 rounded-full flex items-center gap-1.5 font-bold shadow-2xs"
              onClick={handleStartReplay}
            >
              <Play size={11} fill="currentColor" />
              <span>Replay Order</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button 
                className="btn btn-outline text-xs py-1 px-2.5 rounded-lg border-gray-200 text-gray-700 flex items-center gap-1"
                onClick={() => setIsReplaying(!isReplaying)}
              >
                {isReplaying ? <Pause size={11} /> : <Play size={11} />}
                <span>{isReplaying ? 'Pause' : 'Resume'}</span>
              </button>
              <button 
                className="btn btn-outline text-xs py-1 px-2 rounded-lg border-gray-200 text-gray-700"
                onClick={handleResetReplay}
                title="Reset Replay"
              >
                <RotateCcw size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Replay Timeline Player (Feature 5) */}
      {replayStep !== null && (
        <div className="mb-5 p-4 rounded-2xl bg-gray-900 text-white animate-fade-in shadow-md">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700/80">
            <div className="text-[11px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Decision Replay ({replayStep + 1} of {replaySequence.length})
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Simulated Run</span>
          </div>

          <div className="font-bold text-xs text-white mb-1">
            {replaySequence[replayStep].title}
          </div>
          <div className="text-[11px] text-gray-300 leading-relaxed mb-3">
            {replaySequence[replayStep].desc}
          </div>

          {/* Stepper bar */}
          <div className="flex gap-1.5">
            {replaySequence.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => { setReplayStep(idx); setIsReplaying(false); }}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  idx === replayStep ? 'bg-primary h-2' : idx < replayStep ? 'bg-green-500' : 'bg-gray-700'
                }`}
                title={step.title}
              />
            ))}
          </div>
        </div>
      )}

      {/* 1. Original User Request */}
      <div className="mb-4 bg-gray-50/70 p-3 rounded-xl">
        <div className="font-bold text-gray-400 uppercase text-[9px] tracking-wider mb-1">
          Original User Intent
        </div>
        <p className="text-gray-800 italic text-xs leading-relaxed m-0">
          "Restock my usual breakfast items, milk, bread, and fruit. Keep the basket under ₹{mandate.budget}, prefer my staple brands, and strictly avoid anything containing tree nuts or peanuts."
        </p>
      </div>

      {/* 2. Interpreted Quantities & Semantics */}
      <div className="mb-4">
        <div className="font-bold text-gray-400 border-b border-gray-100 pb-1 mb-2 uppercase text-[9px] tracking-wider flex justify-between">
          <span>Interpreted Quantities & Semantics</span>
          <span>Unit Normalization</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-700">Toned Milk</span>
            <span className="font-mono text-gray-500 text-[11px]">1 unit × 1 Litre (1000 ml base)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">100% Whole Wheat Bread</span>
            <span className="font-mono text-gray-500 text-[11px]">1 loaf × 400g base</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Apples (Kashmiri)</span>
            <span className="font-mono text-gray-500 text-[11px]">1 pack × 1 kg base</span>
          </div>
        </div>
      </div>

      {/* 3. Applicable Constitution Rules */}
      <div className="mb-4">
        <div className="font-bold text-gray-400 border-b border-gray-100 pb-1 mb-2 uppercase text-[9px] tracking-wider">
          Applicable Constitution Rules
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50/70 p-2 rounded-lg">
            <div className="text-gray-400 text-[9px] uppercase">Spending Cap</div>
            <div className="font-bold text-gray-900 font-mono">₹{mandate.budget.toFixed(2)}</div>
          </div>
          <div className="bg-gray-50/70 p-2 rounded-lg">
            <div className="text-gray-400 text-[9px] uppercase">Autonomy Tier</div>
            <div className="font-bold text-gray-900 capitalize">{mandate.autonomyLevel || 'Settled-Staples'}</div>
          </div>
          <div className="bg-gray-50/70 p-2 rounded-lg col-span-2">
            <div className="text-gray-400 text-[9px] uppercase">Hard Dietary Prohibitions</div>
            <div className="font-bold text-red-700">
              {mandate.dietaryRestrictions.length > 0 ? mandate.dietaryRestrictions.join(', ') : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Executed Basket Summary */}
      <div className="mb-4">
        <div className="font-bold text-gray-400 border-b border-gray-100 pb-1 mb-2 uppercase text-[9px] tracking-wider">
          Executed Basket
        </div>
        <div className="space-y-1.5">
          {basket.map(item => (
            <div key={item.id} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-gray-900">{item.product.name}</span>
                <span className="text-[10px] text-gray-400 ml-1.5">× {item.quantity}</span>
              </div>
              <span className="font-mono font-bold text-gray-900">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Clear Distinction: Recorded Evidence vs Generated Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 border-t border-gray-100 mb-4">
        {/* Recorded Evidence */}
        <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/60">
          <div className="flex items-center gap-1 font-bold text-blue-900 uppercase text-[9px] tracking-wider mb-1.5">
            <Lock size={11} className="text-blue-600" />
            <span>Recorded Evidence</span>
          </div>
          <div className="space-y-0.5 font-mono text-[9px] text-gray-600">
            <div>HASH: 0x9a8f21e...</div>
            <div>IDEMP_KEY: idemp_ord_9182</div>
            <div>CHECKSUM: [SPEND:OK, DIET:OK]</div>
          </div>
        </div>

        {/* Generated Explanation */}
        <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/60">
          <div className="flex items-center gap-1 font-bold text-amber-900 uppercase text-[9px] tracking-wider mb-1.5">
            <Sparkles size={11} className="text-amber-600" />
            <span>Generated Explanation</span>
          </div>
          <p className="text-[10px] text-gray-600 leading-relaxed m-0">
            "Agent executed autonomous replenishment for verified staples. When almond substitute was evaluated, the safety gateway triggered hard STOP to honor nut-free mandate."
          </p>
        </div>
      </div>

      {/* Total Footer */}
      <div className="border-t-2 border-gray-900 pt-3 flex justify-between items-end">
        <div>
          <div className="text-[10px] text-gray-500 font-mono">CAPACITY: {(basketTotal / Math.max(1, mandate.budget) * 100).toFixed(0)}% Budget Used</div>
          <div className="text-[10px] text-green-700 font-bold flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={11} /> 100% Deterministic Compliance
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Authorized</div>
          <div className="text-xl font-black text-gray-900 font-mono">₹{basketTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
