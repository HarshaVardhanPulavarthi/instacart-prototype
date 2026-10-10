import { useShopping } from '../../context/ShoppingContext';
import { Settings2, ShieldCheck, PowerOff } from 'lucide-react';

export default function TrustControlCenter() {
  const { mandate, updateMandate, resetSimulation } = useShopping();

  return (
    <div className="workspace-panel h-full flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg m-0 flex items-center gap-2">
          <Settings2 size={20} className="text-primary" />
          Decision Budget
        </h2>
        <button className="text-xs font-semibold text-gray-500 hover:text-gray-900" onClick={resetSimulation}>
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6">
        
        {/* Core Constraints */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-light mb-3">Core Authority</h3>
          
          <div className="flex flex-col gap-3">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="label m-0">Maximum Order Spend</span>
                <span className="text-xs text-gray-400 font-normal">Hard limit</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                <input 
                  type="number" 
                  className="input-field pl-8 font-semibold" 
                  value={mandate.budget}
                  onChange={(e) => updateMandate({ budget: Math.max(0, Number(e.target.value)) })}
                  disabled={!mandate.permissionValid}
                />
              </div>
            </div>

            <div>
              <label className="label">Order Frequency Limit</label>
              <div className="flex items-center gap-6">
                <input 
                  type="number" 
                  className="input-field w-20" 
                  value={mandate.orderAllowance}
                  onChange={(e) => updateMandate({ orderAllowance: Number(e.target.value) })}
                  disabled={!mandate.permissionValid}
                />
                <div className="text-xs text-light">
                  <span className={mandate.ordersUsed >= mandate.orderAllowance ? 'text-red-600 font-bold' : ''}>
                    Used: {mandate.ordersUsed}
                  </span>
                  <button 
                    className="ml-2 text-primary hover:underline" 
                    onClick={() => updateMandate({ ordersUsed: (mandate.ordersUsed + 1) })}
                    disabled={!mandate.permissionValid}
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Substitution Policies */}
        <div>
           <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm uppercase tracking-wider text-light m-0">Substitution Rules</h3>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input 
                  type="checkbox" 
                  className="accent-primary"
                  checked={mandate.substitutionsAllowed}
                  onChange={(e) => updateMandate({ substitutionsAllowed: e.target.checked })}
                  disabled={!mandate.permissionValid}
                />
                Allow Auto-Substitutions
              </label>
           </div>
           
           <div className={`flex flex-col gap-3 p-3 rounded-lg border ${mandate.substitutionsAllowed ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Max Absolute Increase (₹)</span>
                <input 
                  type="number" 
                  step="0.5"
                  className="input-field w-20 p-1 text-center text-sm" 
                  value={mandate.maxAbsolutePriceIncrease}
                  onChange={(e) => updateMandate({ maxAbsolutePriceIncrease: Number(e.target.value) })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Max Percentage Increase (%)</span>
                <input 
                  type="number" 
                  className="input-field w-20 p-1 text-center text-sm" 
                  value={mandate.maxPercentagePriceIncrease}
                  onChange={(e) => updateMandate({ maxPercentagePriceIncrease: Number(e.target.value) })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
              </div>
              
              <hr className="border-gray-100 my-1" />
              
              <label className="flex items-center gap-2 text-xs font-medium">
                <input 
                  type="checkbox" 
                  checked={mandate.requireSamePackageSize}
                  onChange={(e) => updateMandate({ requireSamePackageSize: e.target.checked })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
                Require explicit unit equivalence (size matches exactly)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium">
                <input 
                  type="checkbox" 
                  checked={mandate.requireCategoryEquivalence}
                  onChange={(e) => updateMandate({ requireCategoryEquivalence: e.target.checked })}
                  disabled={!mandate.substitutionsAllowed || !mandate.permissionValid}
                />
                Require same product category
              </label>
           </div>
        </div>

        {/* Dietary Hard Constraints */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-light mb-3 flex justify-between">
            Hard Constraints
            <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Never overridden</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Peanut', 'Gluten', 'Palm Oil', 'Dairy', 'Meat'].map(diet => {
              const isSelected = mandate.dietaryRestrictions.includes(diet);
              return (
                <label key={diet} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border cursor-pointer transition-colors ${isSelected ? 'bg-red-50 border-red-200 text-red-800 font-semibold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={isSelected}
                    onChange={(e) => {
                      const diets = e.target.checked 
                        ? [...mandate.dietaryRestrictions, diet]
                        : mandate.dietaryRestrictions.filter(d => d !== diet);
                      updateMandate({ dietaryRestrictions: diets });
                    }}
                    disabled={!mandate.permissionValid}
                  />
                  {isSelected && <span className="text-[10px]">🚫</span>}
                  No {diet}
                </label>
              );
            })}
          </div>
        </div>
        {/* Doubt Resolution */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <h3 className="text-sm uppercase tracking-wider text-light mb-3">Doubt Resolution Channel</h3>
          <p className="text-[10px] text-gray-500 mb-2">When the agent encounters ambiguity (e.g. "did you mean 2 units or 2 packs?"), how should it ask you?</p>
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
            {(['whatsapp', 'in-app', 'auto-reject'] as const).map(channel => (
              <button 
                key={channel}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${mandate.doubtResolutionChannel === channel ? 'bg-white shadow-sm text-primary border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => updateMandate({ doubtResolutionChannel: channel })}
                disabled={!mandate.permissionValid}
              >
                {channel === 'whatsapp' ? 'WhatsApp' : channel === 'in-app' ? 'In-App' : 'Auto-Reject'}
              </button>
            ))}
          </div>
          {mandate.doubtResolutionChannel === 'whatsapp' && (
            <div className="mt-2 text-[10px] text-green-700 bg-green-50 p-2 rounded border border-green-100 flex items-start gap-2">
              <span className="flex-shrink-0">💬</span>
              <span>The agent will pause execution, message you on WhatsApp for clarification, and store your answer in memory for future runs.</span>
            </div>
          )}
        </div>

      </div>

      {/* Permission Toggle */}
      <div className={`mt-6 pt-4 border-t border-gray-100 flex items-center justify-between p-3 rounded-lg ${mandate.permissionValid ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
         <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mandate.permissionValid ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
             {mandate.permissionValid ? <ShieldCheck size={20} /> : <PowerOff size={20} />}
           </div>
           <div>
             <div className={`text-sm font-bold ${mandate.permissionValid ? 'text-green-900' : 'text-red-900'}`}>
               {mandate.permissionValid ? 'Agent Authorized' : 'Permission Revoked'}
             </div>
             <div className="text-[10px] text-gray-600">
               {mandate.permissionValid ? 'Agent can act within rules above.' : 'All autonomous actions blocked.'}
             </div>
           </div>
         </div>
         <button 
           className={`btn text-xs px-3 py-1.5 ${mandate.permissionValid ? 'btn-outline text-red-700 bg-white border-red-200 hover:bg-red-50' : 'btn-primary bg-green-700 hover:bg-green-800'}`}
           onClick={() => updateMandate({ permissionValid: !mandate.permissionValid })}
         >
           {mandate.permissionValid ? 'Revoke' : 'Restore'}
         </button>
      </div>

    </div>
  );
}
