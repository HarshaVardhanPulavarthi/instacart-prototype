

export default function IntentReceipt() {
  // In the real app, we'd use the actual verified transaction state.
  // For the Hero demo, we just use static layout to represent what happened.
  
  return (
    <div className="receipt-paper text-sm">
      <div className="text-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl mb-1 text-gray-900">Intent Receipt</h2>
        <div className="text-xs text-gray-500">Transaction ID: req_8923a1_verified</div>
        <div className="text-xs text-gray-500">{new Date().toLocaleString()}</div>
      </div>

      <div className="mb-4">
        <div className="font-semibold text-gray-800 border-b border-gray-100 pb-1 mb-2 uppercase text-xs tracking-wider">User Mandate</div>
        <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Spending Cap:</span> <span className="font-medium">₹100.00</span></div>
        <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Substitutions:</span> <span className="font-medium">Auto if ≤ ₹2.00</span></div>
        <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Prohibitions:</span> <span className="font-medium text-red-700">Peanuts</span></div>
      </div>

      <div className="mb-4">
        <div className="font-semibold text-gray-800 border-b border-gray-100 pb-1 mb-2 uppercase text-xs tracking-wider">Executed Basket</div>
        
        {/* Item 1 */}
        <div className="flex justify-between mb-1">
          <div>
            <div className="font-medium text-gray-900">Whole Milk</div>
            <div className="text-[10px] text-gray-500">Requested & Fulfilled</div>
          </div>
          <div>₹4.50</div>
        </div>
        
        {/* Item 2 */}
        <div className="flex justify-between mb-1 mt-3">
          <div>
            <div className="font-medium text-gray-900">White Bread (Store Brand)</div>
            <div className="text-[10px] text-green-700 font-medium">ACT: Autonomous Substitution</div>
            <div className="text-[10px] text-gray-500 italic">Replaced Whole Wheat Bread (-₹2.50)</div>
          </div>
          <div>₹3.50</div>
        </div>

        {/* Item 3 */}
        <div className="flex justify-between mb-1 mt-3">
          <div>
            <div className="font-medium text-gray-900">Apples (Honeycrisp)</div>
            <div className="text-[10px] text-gray-500">Requested & Fulfilled</div>
          </div>
          <div>₹8.00</div>
        </div>
      </div>

      <div className="mb-4 mt-6 pt-4 border-t border-gray-200">
        <div className="font-semibold text-gray-800 border-b border-gray-100 pb-1 mb-2 uppercase text-xs tracking-wider">Exceptions / Blocked</div>
        <div className="text-xs text-gray-700">
          <span className="font-bold text-red-700">STOP</span>: <span className="italic">Peanut Butter Bread</span> was considered as an alternative but explicitly blocked due to dietary restrictions.
        </div>
      </div>

      <div className="border-t-2 border-gray-900 pt-3 mt-6 flex justify-between items-end">
        <div className="text-xs text-gray-500">
          <div>Budget Used: 16%</div>
          <div>Decisions: 1 ACT, 1 STOP</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">Total Authorized</div>
          <div className="text-xl font-bold text-gray-900">₹16.00</div>
        </div>
      </div>
    </div>
  );
}
