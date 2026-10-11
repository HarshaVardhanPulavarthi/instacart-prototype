import { useState } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { Settings2, ShieldCheck, PowerOff, PauseCircle, PlayCircle, Lock, CheckCircle2, AlertTriangle, Plus, X } from 'lucide-react';

export default function TrustControlCenter() {
  const { mandate, updateMandate, resetSimulation } = useShopping();
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [newStapleInput, setNewStapleInput] = useState('');
  const [showAddStaple, setShowAddStaple] = useState(false);

  const triggerSaveNotification = (updates: Partial<typeof mandate>) => {
    updateMandate(updates);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const availableStapleSuggestions = [
    'Toned Milk',
    '100% Whole Wheat Bread',
    'Apples (Kashmiri)',
    'Basmati Rice',
    'Bananas (Robusta)',
    'Nut-Free Honey Oat Granola'
  ];

  const handleAddStaple = (item: string) => {
    if (!item.trim()) return;
    const current = mandate.approvedStaples || [];
    if (!current.includes(item.trim())) {
      triggerSaveNotification({ approvedStaples: [...current, item.trim()] });
    }
    setNewStapleInput('');
    setShowAddStaple(false);
  };

  const handleRemoveStaple = (item: string) => {
    const current = mandate.approvedStaples || [];
    triggerSaveNotification({ approvedStaples: current.filter(s => s !== item) });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 flex flex-col h-full relative">
      {/* Live Sync Toast */}
      {showSavedToast && (
        <div className="absolute top-4 right-6 z-20 bg-gray-900 text-white text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-fade-in border border-gray-700">
          <CheckCircle2 size={12} className="text-green-400" />
          <span>Rules updated live</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Settings2 size={17} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 m-0">Agent Constitution</h2>
            <div className="text-[11px] text-gray-400">Explicit authority boundaries</div>
          </div>
        </div>
        <button 
          className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          onClick={resetSimulation} 
          title="Reset to default mandate"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-1">

        {/* 1. Autonomy Level Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Autonomy Level
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Governance Tier</span>
          </div>

          <div className="space-y-1.5">
            {/* Tier 1: Prepare and Confirm */}
            <label className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
              mandate.autonomyLevel === 'prepare-and-confirm'
                ? 'bg-amber-50/80 text-amber-950 font-medium shadow-2xs'
                : 'hover:bg-gray-50 text-gray-600'
            }`}>
              <input
                type="radio"
                name="autonomyLevel"
                className="mt-0.5 accent-amber-600"
                checked={mandate.autonomyLevel === 'prepare-and-confirm'}
                onChange={() => triggerSaveNotification({ autonomyLevel: 'prepare-and-confirm' })}
                disabled={!mandate.permissionValid}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900">Prepare & Confirm</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-bold uppercase">Supervised</span>
                </div>
                <p className="text-[11px] text-gray-500 m-0 mt-0.5 leading-snug">
                  Agent plans cart, but requests user confirmation for substitutions & checkout.
                </p>
              </div>
            </label>

            {/* Tier 2: Settled-Staples Autonomy */}
            <label className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
              mandate.autonomyLevel === 'settled-staples'
                ? 'bg-green-50/80 text-green-950 font-medium shadow-2xs'
                : 'hover:bg-gray-50 text-gray-600'
            }`}>
              <input
                type="radio"
                name="autonomyLevel"
                className="mt-0.5 accent-green-600"
                checked={mandate.autonomyLevel === 'settled-staples'}
                onChange={() => triggerSaveNotification({ autonomyLevel: 'settled-staples' })}
                disabled={!mandate.permissionValid}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900">Settled-Staples Autonomy</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-green-100 text-green-800 rounded font-bold uppercase">Recommended</span>
                </div>
                <p className="text-[11px] text-gray-500 m-0 mt-0.5 leading-snug">
                  Autonomous ordering and safe substitution for approved recurring staples.
                </p>
              </div>
            </label>

            {/* Tier 3: Broader Autonomy */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl opacity-60 text-gray-400 cursor-not-allowed">
              <Lock size={14} className="mt-0.5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Broader Autonomy</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-500 rounded font-semibold uppercase">Locked in Pilot</span>
                </div>
                <p className="text-[11px] text-gray-400 m-0 mt-0.5 leading-snug">
                  Unrestricted catalog purchasing without human-in-the-loop.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Spending Authority */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Spending Limit
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50/80 p-3 rounded-xl">
              <div className="text-[11px] font-medium text-gray-500 mb-1">Max Order Spend</div>
              <div className="relative flex items-center">
                <span className="text-sm font-bold text-gray-400 mr-1">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary" 
                  value={mandate.budget}
                  onChange={(e) => triggerSaveNotification({ budget: Math.max(0, Number(e.target.value)) })}
                  disabled={!mandate.permissionValid}
                />
              </div>
            </div>

            <div className="bg-gray-50/80 p-3 rounded-xl">
              <div className="text-[11px] font-medium text-gray-500 mb-1">Order Frequency Cap</div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold text-gray-900 text-center focus:outline-none focus:border-primary" 
                  value={mandate.orderAllowance}
                  onChange={(e) => triggerSaveNotification({ orderAllowance: Number(e.target.value) })}
                  disabled={!mandate.permissionValid}
                />
                <span className="text-[11px] text-gray-400">
                  ({mandate.ordersUsed} used)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Approved Staples */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Approved Staples
            </span>
            <button 
              className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
              onClick={() => setShowAddStaple(!showAddStaple)}
              disabled={!mandate.permissionValid}
            >
              <Plus size={11} /> Add Staple
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50/60 rounded-xl">
            {(mandate.approvedStaples || []).map(staple => (
              <span key={staple} className="inline-flex items-center gap-1.5 text-xs bg-white text-gray-800 px-2.5 py-1 rounded-full shadow-2xs font-medium border border-gray-100">
                <span>🥛</span> {staple}
                <button 
                  className="text-gray-300 hover:text-red-500 transition-colors" 
                  onClick={() => handleRemoveStaple(staple)}
                  title="Remove staple"
                  disabled={!mandate.permissionValid}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>

          {showAddStaple && (
            <div className="mt-2 p-3 bg-white border border-gray-200 rounded-xl shadow-sm animate-fade-in">
              <div className="text-[11px] text-gray-500 font-medium mb-1.5">Suggestions:</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {availableStapleSuggestions.filter(s => !(mandate.approvedStaples || []).includes(s)).slice(0, 3).map(s => (
                  <button 
                    key={s} 
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded transition-colors"
                    onClick={() => handleAddStaple(s)}
                  >
                    + {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="input-field text-xs py-1 flex-1" 
                  placeholder="Custom staple name..."
                  value={newStapleInput}
                  onChange={(e) => setNewStapleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStaple(newStapleInput)}
                />
                <button className="btn btn-primary text-xs py-1 px-3" onClick={() => handleAddStaple(newStapleInput)}>
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Substitution Policies */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Substitution Bounds
            </span>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input 
                type="checkbox" 
                className="accent-primary"
                checked={mandate.substitutionsAllowed}
                onChange={(e) => triggerSaveNotification({ substitutionsAllowed: e.target.checked })}
                disabled={!mandate.permissionValid}
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className={`p-3 rounded-xl transition-all ${
            mandate.substitutionsAllowed ? 'bg-gray-50/80 space-y-2' : 'bg-gray-50/40 opacity-50 space-y-2'
          }`}>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-medium">Max Absolute Increase</span>
              <div className="flex items-center gap-1 font-mono font-bold">
                <span>₹</span>
                <input 
                  type="number" 
                  step="5"
                  className="w-16 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-right text-xs" 
                  value={mandate.maxAbsolutePriceIncrease}
                  onChange={(e) => triggerSaveNotification({ maxAbsolutePriceIncrease: Number(e.target.value) })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-medium">Max Percentage Increase</span>
              <div className="flex items-center gap-1 font-mono font-bold">
                <input 
                  type="number" 
                  className="w-16 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-right text-xs" 
                  value={mandate.maxPercentagePriceIncrease}
                  onChange={(e) => triggerSaveNotification({ maxPercentagePriceIncrease: Number(e.target.value) })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
                <span>%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200/60 space-y-1.5 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input 
                  type="checkbox" 
                  checked={mandate.requireSamePackageSize}
                  onChange={(e) => triggerSaveNotification({ requireSamePackageSize: e.target.checked })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
                <span>Require identical unit semantics (1L matches 1L)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input 
                  type="checkbox" 
                  checked={mandate.requireCategoryEquivalence}
                  onChange={(e) => triggerSaveNotification({ requireCategoryEquivalence: e.target.checked })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
                <span>Strict category match (Bakery for Bakery)</span>
              </label>
            </div>
          </div>
        </div>

        {/* 5. Dietary Hard Constraints */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Dietary Restrictions
            </span>
            <span className="text-[10px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full">
              Hard Prohibitions
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['Tree-Nut', 'Peanut', 'Gluten', 'Palm Oil', 'Dairy', 'Meat'].map(diet => {
              const isSelected = mandate.dietaryRestrictions.includes(diet);
              return (
                <button
                  key={diet}
                  type="button"
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                    isSelected 
                      ? 'bg-red-50 text-red-900 border border-red-200 font-bold shadow-2xs' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    const diets = isSelected
                      ? mandate.dietaryRestrictions.filter(d => d !== diet)
                      : [...mandate.dietaryRestrictions, diet];
                    triggerSaveNotification({ dietaryRestrictions: diets });
                  }}
                  disabled={!mandate.permissionValid}
                >
                  {isSelected ? `🚫 No ${diet}` : `+ ${diet}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Doubt Resolution Channel */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Doubt Resolution Channel
          </span>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {(['whatsapp', 'in-app', 'auto-reject'] as const).map(channel => (
              <button 
                key={channel}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mandate.doubtResolutionChannel === channel 
                    ? 'bg-white shadow-xs text-primary font-bold' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() => triggerSaveNotification({ doubtResolutionChannel: channel })}
                disabled={!mandate.permissionValid}
              >
                {channel === 'whatsapp' ? 'WhatsApp' : channel === 'in-app' ? 'In-App' : 'Auto-Reject'}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Feature 6: Permission & Standby Controls */}
      <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
        {mandate.isPaused && (
          <div className="bg-amber-50 text-amber-900 text-xs p-2 rounded-lg flex items-center gap-1.5 font-medium">
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
            <span>Agent Paused. Actions are temporarily on hold.</span>
          </div>
        )}

        {!mandate.permissionValid && (
          <div className="bg-red-50 text-red-900 text-xs p-2 rounded-lg flex items-center gap-1.5 font-medium">
            <PowerOff size={14} className="text-red-600 flex-shrink-0" />
            <span>Authority Revoked. All actions blocked (STOP).</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            className={`btn text-xs flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 rounded-xl ${
              mandate.isPaused 
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => triggerSaveNotification({ isPaused: !mandate.isPaused })}
            disabled={!mandate.permissionValid}
          >
            {mandate.isPaused ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
            <span>{mandate.isPaused ? 'Resume Agent' : 'Pause Agent'}</span>
          </button>

          <button 
            className={`btn text-xs flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 rounded-xl ${
              mandate.permissionValid 
                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                : 'bg-green-700 text-white hover:bg-green-800'
            }`}
            onClick={() => triggerSaveNotification({ permissionValid: !mandate.permissionValid })}
          >
            {mandate.permissionValid ? <PowerOff size={14} /> : <ShieldCheck size={14} />}
            <span>{mandate.permissionValid ? 'Revoke Authority' : 'Restore Authority'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
