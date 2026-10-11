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
    setTimeout(() => setShowSavedToast(false), 2200);
  };

  const availableStapleSuggestions = [
    'Toned Milk',
    '100% Whole Wheat Bread',
    'Apples (Kashmiri)',
    'Basmati Rice',
    'Bananas (Robusta)',
    'Nut-Free Honey Oat Granola',
    'Eggs (Pack of 6)',
    'Olive Oil'
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
    <div className="workspace-panel h-full flex flex-col p-6 overflow-y-auto relative">
      {/* Live Sync Toast */}
      {showSavedToast && (
        <div className="absolute top-4 right-6 z-20 bg-green-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-fade-in border border-green-700">
          <CheckCircle2 size={13} className="text-green-300" />
          <span>Constitution updated & live</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 size={20} className="text-primary" />
            <h2 className="text-lg m-0 font-bold text-gray-900">Agent's Constitution</h2>
          </div>
          <p className="text-[11px] text-gray-500 m-0 mt-0.5">
            Explicit constraints and permissions governing autonomous execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200 font-semibold">
            Active Mandate
          </span>
          <button className="text-xs font-semibold text-gray-500 hover:text-gray-900 ml-1" onClick={resetSimulation} title="Reset to defaults">
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6">

        {/* 1. Autonomy Level Selection */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-3.5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 m-0 flex items-center gap-1.5">
              <span>🛡️</span> Autonomy Level
            </h3>
            <span className="text-[10px] text-gray-400">Governance Tier</span>
          </div>
          <div className="flex flex-col gap-2">
            {/* Tier 1: Prepare and Confirm */}
            <label className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${mandate.autonomyLevel === 'prepare-and-confirm' ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-medium shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="autonomyLevel"
                className="mt-0.5 accent-amber-600"
                checked={mandate.autonomyLevel === 'prepare-and-confirm'}
                onChange={() => triggerSaveNotification({ autonomyLevel: 'prepare-and-confirm' })}
                disabled={!mandate.permissionValid}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Prepare & Confirm</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-normal">Supervised</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Agent builds cart, but requires explicit human sign-off for substitutions and checkout.
                </div>
              </div>
            </label>

            {/* Tier 2: Settled-Staples Autonomy */}
            <label className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${mandate.autonomyLevel === 'settled-staples' ? 'bg-green-50/70 border-green-300 text-green-950 font-medium shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="autonomyLevel"
                className="mt-0.5 accent-green-600"
                checked={mandate.autonomyLevel === 'settled-staples'}
                onChange={() => triggerSaveNotification({ autonomyLevel: 'settled-staples' })}
                disabled={!mandate.permissionValid}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Settled-Staples Autonomy</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-green-100 text-green-800 rounded font-normal">Recommended</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Autonomous ordering and safe substitution only for approved recurring staples within budget. Asks for new items.
                </div>
              </div>
            </label>

            {/* Tier 3: Broader Autonomy (Locked in Pilot) */}
            <div className="flex items-start gap-3 p-2.5 rounded-lg border border-gray-200 bg-gray-100/70 text-gray-400 text-xs cursor-not-allowed">
              <Lock size={15} className="mt-0.5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Broader Autonomy</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-gray-200 text-gray-600 rounded font-medium">Locked in Pilot</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Unrestricted catalog purchasing without human-in-the-loop. Gated behind verification driving test.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Spending Limit & Order Cap */}
        <div>
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2">Spending Authority</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Order Spending Limit</span>
                <span className="text-[10px] text-red-600 font-bold">Hard cap</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 font-bold">₹</span>
                <input 
                  type="number" 
                  className="input-field pl-7 py-1.5 font-bold text-gray-900 text-sm" 
                  value={mandate.budget}
                  onChange={(e) => triggerSaveNotification({ budget: Math.max(0, Number(e.target.value)) })}
                  disabled={!mandate.permissionValid}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Order Frequency</span>
                <span className="text-[10px] text-gray-400">Quota</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="input-field py-1.5 text-center font-bold text-sm" 
                  value={mandate.orderAllowance}
                  onChange={(e) => triggerSaveNotification({ orderAllowance: Number(e.target.value) })}
                  disabled={!mandate.permissionValid}
                />
                <span className="text-[11px] text-gray-500 whitespace-nowrap">
                  ({mandate.ordersUsed} used)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Approved Staples */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-500 m-0">Approved Staples</h3>
            <span className="text-[10px] text-gray-400">Pre-cleared for autonomous reorder</span>
          </div>

          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-gray-200 bg-gray-50/50 min-h-[50px] items-center">
            {(mandate.approvedStaples || []).map(staple => (
              <span key={staple} className="inline-flex items-center gap-1 text-xs bg-white border border-gray-300 text-gray-800 px-2 py-1 rounded-full shadow-2xs font-medium">
                <span>🥛</span> {staple}
                <button 
                  className="text-gray-400 hover:text-red-600 ml-0.5" 
                  onClick={() => handleRemoveStaple(staple)}
                  title="Remove from approved staples"
                  disabled={!mandate.permissionValid}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            
            <button 
              className="inline-flex items-center gap-1 text-xs text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-2 py-1 rounded-full font-semibold transition-colors"
              onClick={() => setShowAddStaple(!showAddStaple)}
              disabled={!mandate.permissionValid}
            >
              <Plus size={12} /> Add Staple
            </button>
          </div>

          {showAddStaple && (
            <div className="mt-2 p-2.5 bg-white border border-primary/30 rounded-lg shadow-sm">
              <div className="text-[11px] font-medium text-gray-600 mb-1.5">Quick Suggestions:</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {availableStapleSuggestions.filter(s => !(mandate.approvedStaples || []).includes(s)).slice(0, 4).map(s => (
                  <button 
                    key={s} 
                    className="text-[10px] bg-gray-100 hover:bg-green-50 hover:text-green-800 border border-gray-200 px-2 py-0.5 rounded transition-colors"
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
              <h3 className="text-xs uppercase font-bold tracking-wider text-gray-500 m-0">Allowed Substitutions</h3>
              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                <input 
                  type="checkbox" 
                  className="accent-primary"
                  checked={mandate.substitutionsAllowed}
                  onChange={(e) => triggerSaveNotification({ substitutionsAllowed: e.target.checked })}
                  disabled={!mandate.permissionValid}
                />
                Auto-Substitutions
              </label>
           </div>
           
           <div className={`flex flex-col gap-2.5 p-3 rounded-lg border ${mandate.substitutionsAllowed ? 'bg-white border-gray-200 shadow-2xs' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Max Absolute Increase (₹)</span>
                <input 
                  type="number" 
                  step="5"
                  className="input-field w-20 py-1 text-center text-xs font-semibold" 
                  value={mandate.maxAbsolutePriceIncrease}
                  onChange={(e) => triggerSaveNotification({ maxAbsolutePriceIncrease: Number(e.target.value) })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Max Percentage Increase (%)</span>
                <input 
                  type="number" 
                  className="input-field w-20 py-1 text-center text-xs font-semibold" 
                  value={mandate.maxPercentagePriceIncrease}
                  onChange={(e) => triggerSaveNotification({ maxPercentagePriceIncrease: Number(e.target.value) })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
              </div>
              
              <hr className="border-gray-100 my-0.5" />
              
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={mandate.requireSamePackageSize}
                  onChange={(e) => triggerSaveNotification({ requireSamePackageSize: e.target.checked })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
                Require explicit unit equivalence (e.g. 1L matches 1L)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={mandate.requireCategoryEquivalence}
                  onChange={(e) => triggerSaveNotification({ requireCategoryEquivalence: e.target.checked })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
                Require same product category (Bakery for Bakery)
              </label>
           </div>
        </div>

        {/* 5. Dietary Restrictions (Hard Constraints) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-500 m-0">Dietary Restrictions</h3>
            <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 font-bold">
              Hard constraint (never overridden)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Tree-Nut', 'Peanut', 'Gluten', 'Palm Oil', 'Dairy', 'Meat'].map(diet => {
              const isSelected = mandate.dietaryRestrictions.includes(diet);
              return (
                <label key={diet} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border cursor-pointer transition-all ${isSelected ? 'bg-red-50 border-red-300 text-red-900 font-bold shadow-2xs' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={isSelected}
                    onChange={(e) => {
                      const diets = e.target.checked 
                        ? [...mandate.dietaryRestrictions, diet]
                        : mandate.dietaryRestrictions.filter(d => d !== diet);
                      triggerSaveNotification({ dietaryRestrictions: diets });
                    }}
                    disabled={!mandate.permissionValid}
                  />
                  <span>{isSelected ? '🚫' : '○'}</span>
                  No {diet}
                </label>
              );
            })}
          </div>
        </div>

        {/* 6. Doubt Resolution Channel */}
        <div>
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-1.5">Doubt Resolution Channel</h3>
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            {(['whatsapp', 'in-app', 'auto-reject'] as const).map(channel => (
              <button 
                key={channel}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${mandate.doubtResolutionChannel === channel ? 'bg-white shadow-sm text-primary font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => triggerSaveNotification({ doubtResolutionChannel: channel })}
                disabled={!mandate.permissionValid}
              >
                {channel === 'whatsapp' ? 'WhatsApp' : channel === 'in-app' ? 'In-App' : 'Auto-Reject'}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Feature 6: Pause, Revoke & Permission Controls */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-2.5">
        
        {/* Standby / Pause Status Banner */}
        {mandate.isPaused && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-2.5 rounded-lg flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Agent Paused:</span> Autonomous execution is on hold. Resuming will restore mandate actions.
            </div>
          </div>
        )}

        {/* Revoked Status Banner */}
        {!mandate.permissionValid && (
          <div className="bg-red-50 border border-red-200 text-red-900 text-xs p-2.5 rounded-lg flex items-center gap-2">
            <PowerOff size={16} className="text-red-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Authority Revoked:</span> Kill-switch engaged. All actions immediately blocked (STOP).
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Pause Button */}
          <button
            className={`btn text-xs flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 ${mandate.isPaused ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'}`}
            onClick={() => triggerSaveNotification({ isPaused: !mandate.isPaused })}
            disabled={!mandate.permissionValid}
          >
            {mandate.isPaused ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
            {mandate.isPaused ? 'Resume Agent' : 'Pause Agent'}
          </button>

          {/* Hard Revoke Button */}
          <button 
            className={`btn text-xs flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 ${mandate.permissionValid ? 'btn-outline text-red-700 bg-red-50/50 border-red-300 hover:bg-red-100' : 'btn-primary bg-green-700 hover:bg-green-800 text-white'}`}
            onClick={() => triggerSaveNotification({ permissionValid: !mandate.permissionValid })}
          >
            {mandate.permissionValid ? <PowerOff size={15} /> : <ShieldCheck size={15} />}
            {mandate.permissionValid ? 'Revoke Authority' : 'Restore Authority'}
          </button>
        </div>
      </div>

    </div>
  );
}
