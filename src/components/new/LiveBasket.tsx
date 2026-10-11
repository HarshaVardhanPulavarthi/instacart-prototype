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
        
        const simulateTimeout = mandate.budget === 100;
        
        setTimeout(() => {
          if (simulateTimeout && checkoutResult?.status !== 'confirmed') {
            setTransactionStatus('PENDING_VERIFICATION');
            setCheckoutResult({ status: 'unknown', reason: 'Network timeout during submission. Verifying state...' });
          } else {
            setTransactionStatus('CONFIRMED');
            setCheckoutResult({ status: 'confirmed', reason: 'Order placed with idempotency key. Zero duplicate risk.' });
          }
        }, 1200);
      }, 800);
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
          details: `New total ₹${(basketTotal + increment).toFixed(2)} vs cap ₹${mandate.budget.toFixed(2)}.` 
        }
      ],
      reason: basketTotal + increment > mandate.budget 
        ? `Surge price pushes basket over the ₹${mandate.budget.toFixed(2)} limit.` 
        : `Surge absorbed within existing cap.`,
      timestamp: Date.now()
    });
  };

  const verifyTransaction = () => {
    setTransactionStatus('VALIDATING');
    setTimeout(() => {
      setTransactionStatus('CONFIRMED');
      setCheckoutResult({ status: 'confirmed', reason: 'Idempotency verified: Order processed exactly once.' });
    }, 1200);
  };

  const renderBadge = (status: string) => {
    if (status === 'act' || status === 'approved') return <span className="badge badge-act text-[9px]">ACT</span>;
    if (status === 'ask') return <span className="badge badge-ask text-[9px]">ASK</span>;
    if (status === 'stop' || status === 'rejected') return <span className="badge badge-stop text-[9px]">STOP</span>;
    return <span className="badge badge-neutral text-[9px]">PENDING</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingCart size={17} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 m-0">Live Basket</h3>
            <span className="text-[11px] text-gray-400 font-medium">Deterministic budget enforcement</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Running Total</div>
          <div className="text-xl font-black font-mono text-gray-900">₹{basketTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Modern Spending Cap Status Bar */}
      <div className={`px-5 py-3 text-xs transition-colors flex items-center justify-between border-b ${
        isOverBudget ? 'bg-red-50/70 border-red-100 text-red-900' : 'bg-green-50/50 border-green-100 text-green-900'
      }`}>
        <div className="flex items-center gap-2">
          <span>{isOverBudget ? '🚫' : '✓'}</span>
          <span className="font-semibold text-xs">
            {isOverBudget ? (
              <>Budget Exceeded by <strong className="font-bold text-red-700">₹{budgetDelta.toFixed(2)}</strong></>
            ) : (
              <>Within Cap (₹{basketTotal.toFixed(2)} of ₹{mandate.budget.toFixed(2)})</>
            )}
          </span>
        </div>

        <span className={`badge ${isOverBudget ? 'badge-stop' : 'badge-act'} text-[9px] px-2 py-0.5`}>
          {isOverBudget ? 'STOP (BLOCKED)' : 'ACT (AUTHORIZED)'}
        </span>
      </div>

      {/* Items List */}
      <div className="p-5 space-y-3 max-h-[480px] overflow-y-auto">
        {basket.map(item => {
          const productToDisplay = item.replacement && item.status !== 'ask' && item.status !== 'rejected' && item.status !== 'stop' ? item.replacement : item.product;
          const currentPrice = productToDisplay.price * item.quantity;
          const isBlocked = item.status === 'stop' || item.status === 'rejected';

          return (
            <div 
              key={item.id} 
              className={`p-3.5 rounded-xl border transition-all ${
                isBlocked ? 'opacity-50 border-red-100 bg-red-50/20' : 'border-gray-100 bg-white hover:border-gray-200 shadow-2xs'
              }`}
            >
              {/* Unavailable / Substituted Notice */}
              {item.isUnavailable && (
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-gray-100 text-xs">
                  <span className="font-bold text-[11px] text-gray-600">
                    {item.status === 'act' || item.status === 'approved' ? '✓ Auto-Substituted' : item.status === 'stop' || item.status === 'rejected' ? '🚫 Sub Blocked' : '⚠️ Approval Required'}
                  </span>
                  {item.decisionLog && (
                    <div onClick={() => setExplainingLog(item.decisionLog)} className="cursor-pointer">
                      {renderBadge(item.status)}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs font-bold ${isBlocked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {productToDisplay.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-900 ml-2">
                      ₹{currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    ₹{productToDisplay.price.toFixed(2)} / {productToDisplay.size} • {productToDisplay.brand}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {!item.isUnavailable ? (
                <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-0.5">
                    <button className="text-gray-400 hover:text-gray-900 text-xs font-bold" onClick={() => changeQuantity(item.id, item.quantity - 1)}>-</button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button className="text-gray-400 hover:text-gray-900 text-xs font-bold" onClick={() => changeQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      className="text-[10px] text-purple-700 hover:bg-purple-50 px-2 py-1 rounded font-semibold flex items-center gap-1 transition-colors"
                      onClick={() => handleSimulatePriceIncrease(item.id, 100)}
                      title="Add ₹100 surge price to test spending cap"
                    >
                      <TrendingUp size={11} /> +₹100 Surge
                    </button>

                    <button 
                      className="text-[10px] text-amber-700 hover:bg-amber-50 px-2 py-1 rounded font-semibold flex items-center gap-1 transition-colors"
                      onClick={() => markUnavailable(item.id)}
                    >
                      <AlertTriangle size={11}/> Stockout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  {item.status === 'ask' && item.replacement && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button className="flex-1 btn btn-ask text-xs py-1.5 rounded-lg" onClick={() => resolveAsk(item.id, true)}>
                        <CheckCircle2 size={13}/> Approve
                      </button>
                      <button className="flex-1 btn btn-outline text-xs py-1.5 rounded-lg" onClick={() => resolveAsk(item.id, false)}>
                        <XCircle size={13}/> Reject
                      </button>
                    </div>
                  )}

                  {item.status === 'pending' && !item.replacement && (
                    <div className="mt-1">
                      {resolvingId === item.id ? (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-bold text-gray-500 uppercase">Select Alternative:</div>
                          {catalog.filter(p => p.id !== item.product.id && p.category === item.product.category).slice(0, 3).map(candidate => (
                            <button 
                              key={candidate.id} 
                              className="w-full text-left flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors text-xs"
                              onClick={() => { markUnavailable(item.id, candidate); setResolvingId(null); }}
                            >
                              <span className="font-medium text-gray-800">{candidate.name}</span>
                              <span className="font-mono text-[11px] text-gray-500">₹{candidate.price.toFixed(2)}</span>
                            </button>
                          ))}
                          <button className="text-[10px] text-gray-400 hover:underline block mx-auto pt-1" onClick={() => setResolvingId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="btn btn-outline text-xs w-full py-1.5 rounded-lg" onClick={() => setResolvingId(item.id)}>
                          <Search size={13} /> Find Alternative
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Add Shelf */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Add Catalog Items</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {catalog.filter(p => !p.isAmbiguousSize).slice(0, 7).map(product => (
            <button 
              key={product.id}
              onClick={() => addItem(product)}
              className="flex-shrink-0 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors shadow-2xs"
            >
              <div className="font-semibold text-gray-900 truncate max-w-[100px]">{product.name}</div>
              <div className="text-[10px] text-gray-400 font-mono">₹{product.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="p-5 border-t border-gray-100 bg-white space-y-3">
        {transactionStatus !== 'DRAFT' && checkoutResult && (
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
            transactionStatus === 'CONFIRMED' ? 'bg-green-50 text-green-900 border border-green-100' :
            transactionStatus === 'PENDING_VERIFICATION' ? 'bg-blue-50 text-blue-900 border border-blue-100' :
            transactionStatus === 'BLOCKED' ? 'bg-red-50 text-red-900 border border-red-100' :
            transactionStatus === 'AWAITING_APPROVAL' ? 'bg-amber-50 text-amber-900 border border-amber-100' :
            'bg-gray-50 text-gray-900'
          }`}>
            <div className="mt-0.5 flex-shrink-0">
              {transactionStatus === 'VALIDATING' || transactionStatus === 'SUBMITTED' ? <Loader2 size={15} className="animate-spin" /> : 
               transactionStatus === 'CONFIRMED' ? <CheckCircle2 size={15} className="text-green-600" /> :
               transactionStatus === 'PENDING_VERIFICATION' ? <RefreshCw size={15} className="animate-spin text-blue-600" /> :
               <ShieldCheck size={15} />
              }
            </div>
            <div>
              <div className="font-bold text-xs">{checkoutResult.reason}</div>
              {transactionStatus === 'PENDING_VERIFICATION' && (
                <button className="btn btn-primary text-xs py-1 px-3 mt-2 rounded" onClick={verifyTransaction}>
                  Verify Idempotency Key
                </button>
              )}
            </div>
          </div>
        )}

        <button 
          className={`btn w-full text-sm font-bold py-3 rounded-xl transition-all ${
            isOverBudget || mandate.isPaused || !mandate.permissionValid 
              ? 'bg-red-700 hover:bg-red-800 text-white shadow-xs' 
              : transactionStatus === 'PENDING_VERIFICATION' 
              ? 'btn-outline' 
              : 'btn-primary'
          }`}
          onClick={handleSimulateCheckout}
          disabled={transactionStatus === 'VALIDATING' || transactionStatus === 'SUBMITTED' || transactionStatus === 'PENDING_VERIFICATION' || basket.length === 0}
        >
          {transactionStatus === 'PENDING_VERIFICATION' ? 'Verifying Transaction...' : 
           mandate.isPaused ? 'Agent Paused (Cannot Checkout)' :
           !mandate.permissionValid ? 'Authority Revoked (Cannot Checkout)' :
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
