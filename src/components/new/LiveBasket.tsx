import { useState } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { catalog } from '../../mockData';
import { evaluateCheckout } from '../../decisionEngine';
import { AlertTriangle, Search, ShoppingCart, Loader2, CheckCircle2, XCircle, ShieldCheck, RefreshCw, TrendingUp } from 'lucide-react';
import DecisionExplanation from './DecisionExplanation';

export default function LiveBasket() {
  const { 
    basket, mandate, basketTotal, changeQuantity, markUnavailable, 
    addLog, transactionStatus, setTransactionStatus, resolveAsk, addItem, updateBasket
  } = useShopping();
  
  const [checkoutResult, setCheckoutResult] = useState<{status: string, reason: string} | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [explainingLog, setExplainingLog] = useState<any>(null);

  const isOverBudget = basketTotal > mandate.budget;
  const budgetDelta = Math.abs(basketTotal - mandate.budget);

  const handleSimulateCheckout = () => {
    if (transactionStatus === 'PENDING_VERIFICATION') return;
    
    const decisionLog = evaluateCheckout(mandate, basket, basketTotal);
    addLog(decisionLog);

    if (decisionLog.decision === 'ACT') {
      setTransactionStatus('VALIDATING');
      setTimeout(() => {
        setTransactionStatus('SUBMITTED');
        
        // Deterministic timeout for demo if budget is exactly ₹100
        const simulateTimeout = mandate.budget === 100;
        
        setTimeout(() => {
          if (simulateTimeout && checkoutResult?.status !== 'confirmed') {
            setTransactionStatus('PENDING_VERIFICATION');
            setCheckoutResult({ status: 'unknown', reason: 'Network timeout during submission. Did it succeed?' });
          } else {
            setTransactionStatus('CONFIRMED');
            setCheckoutResult({ status: 'confirmed', reason: 'Order successfully placed and confirmed with idempotency key.' });
          }
        }, 1500);
      }, 1000);
    } else if (decisionLog.decision === 'STOP') {
      setTransactionStatus('BLOCKED');
      setCheckoutResult({ status: 'blocked', reason: decisionLog.reason });
    } else {
      setTransactionStatus('AWAITING_APPROVAL');
      setCheckoutResult({ status: 'ask', reason: decisionLog.reason });
    }
  };

  const handleSimulatePriceIncrease = (itemId: string, increment: number) => {
    updateBasket(basket.map(item => {
      if (item.id === itemId) {
        const newProduct = { ...item.product, price: item.product.price + increment };
        return { ...item, product: newProduct };
      }
      return item;
    }));
    addLog({
      action: `Simulated price increase (+₹${increment.toFixed(2)})`,
      decision: basketTotal + increment > mandate.budget ? 'STOP' : 'ACT',
      checks: [
        { 
          name: "Spending Cap", 
          passed: basketTotal + increment <= mandate.budget, 
          details: `New basket total ₹${(basketTotal + increment).toFixed(2)} vs spending cap ₹${mandate.budget.toFixed(2)}.` 
        }
      ],
      reason: basketTotal + increment > mandate.budget 
        ? `Price surge pushes total over the ₹${mandate.budget.toFixed(2)} budget limit.` 
        : `Price surge absorbed within existing spending cap.`,
      timestamp: Date.now()
    });
  };

  const verifyTransaction = () => {
    setTransactionStatus('VALIDATING');
    setTimeout(() => {
      setTransactionStatus('CONFIRMED');
      setCheckoutResult({ status: 'confirmed', reason: 'Idempotency key check verified: Transaction recorded exactly once.' });
    }, 1500);
  };

  const renderBadge = (status: string) => {
    if (status === 'act' || status === 'approved') return <span className="badge badge-act" style={{ cursor: 'pointer' }}>ACT</span>;
    if (status === 'ask') return <span className="badge badge-ask" style={{ cursor: 'pointer' }}>ASK</span>;
    if (status === 'stop' || status === 'rejected') return <span className="badge badge-stop" style={{ cursor: 'pointer' }}>STOP</span>;
    return <span className="badge badge-neutral">PENDING</span>;
  };

  return (
    <div className="workspace-panel h-full flex flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div>
          <h2 className="text-xl m-0 flex items-center gap-2 text-white font-bold">
            <ShoppingCart size={20} />
            Live Basket
          </h2>
          <span className="text-[11px] text-[#D0E2D6] font-medium">Real-time budget enforcement</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#E3E9E5] uppercase tracking-wider font-semibold">Running Total</div>
          <div className="text-2xl font-bold font-mono">₹{basketTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Feature 3: Live Budget Enforcement Gauge */}
      <div className={`p-3.5 border-b text-xs flex flex-col gap-1.5 transition-colors ${isOverBudget ? 'bg-red-50 border-red-200 text-red-900' : 'bg-green-50 border-green-200 text-green-900'}`}>
        <div className="flex justify-between items-center font-semibold">
          <div className="flex items-center gap-2">
            <span>{isOverBudget ? '🚫' : '🛡️'}</span>
            <span>
              {isOverBudget ? (
                <>Budget Exceeded by <strong className="font-bold text-red-700">₹{budgetDelta.toFixed(2)}</strong></>
              ) : (
                <>Within Spending Cap (₹{basketTotal.toFixed(2)} of ₹{mandate.budget.toFixed(2)})</>
              )}
            </span>
          </div>
          <span className={`badge ${isOverBudget ? 'badge-stop' : 'badge-act'} text-[10px] px-2 py-0.5`}>
            {isOverBudget ? 'CHECKOUT BLOCKED (STOP)' : 'AUTHORIZED (ACT)'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${isOverBudget ? 'bg-red-600' : 'bg-green-600'}`}
            style={{ width: `${Math.min(100, (basketTotal / Math.max(1, mandate.budget)) * 100)}%` }}
          />
        </div>

        <div className="text-[10px] text-gray-600 flex justify-between items-center">
          <span>
            {isOverBudget 
              ? 'Changing the budget in the Constitution Editor on the left instantly unblocks this checkout.' 
              : 'Rules actually affect checkout execution, not just visual indicators.'}
          </span>
          <span className="font-mono font-semibold">Cap: ₹{mandate.budget.toFixed(2)}</span>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {basket.map(item => {
          const productToDisplay = item.replacement && item.status !== 'ask' && item.status !== 'rejected' && item.status !== 'stop' ? item.replacement : item.product;
          const originalPrice = item.product.price * item.quantity;
          const currentPrice = productToDisplay.price * item.quantity;
          const isBlocked = item.status === 'stop' || item.status === 'rejected';

          return (
            <div key={item.id} className={`mb-4 rounded-xl border bg-white overflow-hidden shadow-2xs transition-all ${isBlocked ? 'opacity-60 border-red-200' : 'border-gray-200'}`}>
              
              {/* Item Header */}
              {item.isUnavailable && (
                 <div className={`px-4 py-2 text-xs font-semibold flex justify-between items-center ${item.status === 'act' || item.status === 'approved' ? 'bg-green-50 text-green-800 border-b border-green-100' : item.status === 'stop' || item.status === 'rejected' ? 'bg-red-50 text-red-800 border-b border-red-100' : 'bg-amber-50 text-amber-800 border-b border-amber-100'}`}>
                   <span>
                     {item.status === 'act' || item.status === 'approved' ? '✓ Auto-Substituted' : item.status === 'stop' || item.status === 'rejected' ? '🚫 Blocked / Rejected' : '⚠️ Approval Required'}
                   </span>
                   {item.decisionLog && (
                     <div onClick={() => setExplainingLog(item.decisionLog)}>
                       {renderBadge(item.status)}
                     </div>
                   )}
                 </div>
              )}

              <div className="p-4 flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center text-2xl">
                  🛒
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className={isBlocked ? 'line-through text-gray-400 font-semibold' : 'font-bold text-gray-900'}>
                      {productToDisplay.name}
                    </div>
                    <div className="font-bold font-mono">₹{currentPrice.toFixed(2)}</div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    ₹{productToDisplay.price.toFixed(2)} / {productToDisplay.size} • {productToDisplay.brand}
                  </div>
                  
                  {item.isUnavailable && item.replacement && (
                    <div className="text-xs text-gray-500 italic mb-2">
                      Original: {item.product.name} (₹{originalPrice.toFixed(2)})
                    </div>
                  )}

                  {!item.isUnavailable ? (
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-3 border border-gray-200 rounded-full px-2 py-0.5 bg-gray-50">
                        <button className="text-gray-400 hover:text-gray-900 w-5 h-5 flex items-center justify-center text-sm" onClick={() => changeQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button className="text-gray-400 hover:text-gray-900 w-5 h-5 flex items-center justify-center text-sm" onClick={() => changeQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Simulate Price Increase Button */}
                        <button 
                          className="text-[10px] text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded font-semibold flex items-center gap-1 transition-colors"
                          onClick={() => handleSimulatePriceIncrease(item.id, 100)}
                          title="Simulate a sudden price increase of ₹100"
                        >
                          <TrendingUp size={11} /> Price Surge (+₹100)
                        </button>

                        {/* Simulate Stockout Button */}
                        <button 
                          className="text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded font-semibold flex items-center gap-1 transition-colors" 
                          onClick={() => markUnavailable(item.id)}
                        >
                          <AlertTriangle size={11}/> Stockout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {item.status === 'ask' && item.replacement && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-amber-100">
                          <button className="flex-1 btn btn-ask text-xs py-2" onClick={() => resolveAsk(item.id, true)}><CheckCircle2 size={16}/> Approve</button>
                          <button className="flex-1 btn btn-outline text-xs py-2" onClick={() => resolveAsk(item.id, false)}><XCircle size={16}/> Reject</button>
                        </div>
                      )}
                      {item.status === 'pending' && !item.replacement && (
                         <div className="mt-2">
                           {resolvingId === item.id ? (
                             <div className="flex flex-col gap-2 mt-3">
                               <div className="text-xs font-semibold mb-1 text-gray-600">Select Alternative to Evaluate:</div>
                               {catalog.filter(p => p.id !== item.product.id && p.category === item.product.category).slice(0, 3).map(candidate => (
                                 <button key={candidate.id} className="text-left flex justify-between items-center p-2 rounded border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors" onClick={() => { markUnavailable(item.id, candidate); setResolvingId(null); }}>
                                   <div>
                                     <div className="text-xs font-semibold">{candidate.name}</div>
                                     <div className="text-[10px] text-gray-500">₹{candidate.price.toFixed(2)} • {candidate.size}</div>
                                   </div>
                                   <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">→</div>
                                 </button>
                               ))}
                               <button className="text-xs text-gray-500 text-center mt-1" onClick={() => setResolvingId(null)}>Cancel</button>
                             </div>
                           ) : (
                             <button className="btn btn-outline text-xs w-full py-2 bg-white" onClick={() => setResolvingId(item.id)}>
                               <Search size={14} /> Find Alternative
                             </button>
                           )}
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Shelf */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Add Catalog Items</div>
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {catalog.filter(p => !p.isAmbiguousSize).slice(0, 8).map(product => (
            <button 
              key={product.id}
              onClick={() => addItem(product)}
              className="flex-shrink-0 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left w-32 transition-colors"
            >
              <div className="font-semibold text-xs text-gray-900 truncate">{product.name}</div>
              <div className="text-[10px] text-gray-500 mt-1 font-mono">₹{product.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Checkout Section */}
      <div className="p-5 border-t border-gray-200 bg-white">
        {/* Transaction Feedback */}
        {transactionStatus !== 'DRAFT' && checkoutResult && (
          <div className={`mb-4 p-4 rounded-xl border flex gap-3 ${
            transactionStatus === 'CONFIRMED' ? 'bg-green-50 border-green-200 text-green-900' :
            transactionStatus === 'PENDING_VERIFICATION' ? 'bg-blue-50 border-blue-200 text-blue-900' :
            transactionStatus === 'BLOCKED' ? 'bg-red-50 border-red-200 text-red-900' :
            transactionStatus === 'AWAITING_APPROVAL' ? 'bg-amber-50 border-amber-200 text-amber-900' :
            'bg-gray-50 border-gray-200 text-gray-900'
          }`}>
            <div className="mt-1 flex-shrink-0">
               {transactionStatus === 'VALIDATING' || transactionStatus === 'SUBMITTED' ? <Loader2 size={18} className="animate-spin" /> : 
                transactionStatus === 'CONFIRMED' ? <CheckCircle2 size={18} /> :
                transactionStatus === 'PENDING_VERIFICATION' ? <RefreshCw size={18} className="animate-spin" /> :
                <ShieldCheck size={18} />
               }
            </div>
            <div>
              <h4 className="text-sm font-bold mb-1 m-0">
                {transactionStatus === 'PENDING_VERIFICATION' ? 'Uncertain Transaction State' : 
                 transactionStatus === 'CONFIRMED' ? 'Verified Success' : 
                 transactionStatus === 'BLOCKED' ? 'Checkout Blocked by Gateway' : 
                 transactionStatus === 'AWAITING_APPROVAL' ? 'Exceptions Require Approval' :
                 transactionStatus}
              </h4>
              <p className="text-xs m-0">{checkoutResult.reason}</p>
              
              {transactionStatus === 'PENDING_VERIFICATION' && (
                <div className="mt-3 flex gap-2">
                  <button className="btn btn-primary text-xs py-1.5" onClick={verifyTransaction}>Verify Idempotency</button>
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          className={`btn w-full text-base font-bold py-3.5 ${
            isOverBudget || mandate.isPaused || !mandate.permissionValid ? 'bg-red-700 hover:bg-red-800 text-white' : 
            transactionStatus === 'PENDING_VERIFICATION' ? 'btn-outline bg-gray-50' : 'btn-primary'
          }`}
          onClick={handleSimulateCheckout}
          disabled={transactionStatus === 'VALIDATING' || transactionStatus === 'SUBMITTED' || transactionStatus === 'PENDING_VERIFICATION' || basket.length === 0}
        >
          {transactionStatus === 'PENDING_VERIFICATION' ? 'Checking Status...' : 
           mandate.isPaused ? 'Agent Paused (Cannot Checkout)' :
           !mandate.permissionValid ? 'Permission Revoked (Cannot Checkout)' :
           isOverBudget ? `Blocked: Over Budget (₹${basketTotal.toFixed(2)} > ₹${mandate.budget.toFixed(2)})` : 
           'Simulate Checkout'}
        </button>
      </div>

      {explainingLog && (
        <DecisionExplanation log={explainingLog} onClose={() => setExplainingLog(null)} />
      )}
    </div>
  );
}
