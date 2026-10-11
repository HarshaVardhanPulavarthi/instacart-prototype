import { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle2, ArrowRight, ShieldCheck, Search, ShoppingCart, Receipt } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { catalog } from '../../mockData';
import IntentReceipt from './IntentReceipt';

const steps = [
  { id: 'intent', title: 'Interpret user intent', icon: Search, desc: '"Get my usual breakfast items, milk, fruit, and ingredients for three dinners. Keep it under ₹100, use my preferred brands, no peanuts."' },
  { id: 'auth', title: 'Load authority boundaries', icon: ShieldCheck, desc: 'Budget: ₹100. Substitutions: Permitted (≤ ₹2 or 15%). Prohibitions: Peanuts.' },
  { id: 'build', title: 'Build proposed basket', icon: ShoppingCart, desc: 'Selected: Whole Milk, Whole Wheat Bread, Apples.' },
  { id: 'check', title: 'Check inventory & alternatives', icon: Search, desc: 'Whole Wheat Bread is out of stock. Evaluating Peanut Butter Bread & White Bread.' },
  { id: 'eval', title: 'Evaluate constraints (ACT / ASK / STOP)', icon: ShieldCheck, desc: 'Applying explicit decision rules to alternatives.' },
  { id: 'checkout', title: 'Checkout & Verify', icon: ShoppingCart, desc: 'Submitting transaction and explicitly validating idempotency state.' },
  { id: 'receipt', title: 'Generate Intent Receipt', icon: Receipt, desc: 'Producing auditable record of all autonomous decisions.' }
];

export default function HeroScenario({ onSwitchToWorkspace }: { onSwitchToWorkspace: () => void }) {
  const { activeScenarioStep, setActiveScenarioStep } = useShopping();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying && activeScenarioStep < steps.length - 1) {
      timer = setTimeout(() => {
        setActiveScenarioStep(activeScenarioStep + 1);
      }, 2500); // 2.5s per step
    } else if (activeScenarioStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeScenarioStep, setActiveScenarioStep]);

  const handlePlay = () => {
    if (activeScenarioStep === steps.length - 1) setActiveScenarioStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="text-center mb-12">
        <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>You set the boundaries.<br/>Your agent does the shopping.</h1>
        <p className="text-light" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
          An AI assistant shouldn't guess what it's allowed to do. Watch how explicit mandates, safe substitutions, and verified checkouts create a trusted autonomous experience.
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-6)', borderBottom: 'var(--border-light)', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="mb-1">Autonomous Shopping Run</h3>
            <p className="text-sm text-light m-0">Simulating end-to-end execution with ACT, ASK, and STOP states.</p>
          </div>
          <button className="btn btn-primary" onClick={handlePlay} disabled={isPlaying}>
            <PlayCircle size={20} />
            {activeScenarioStep > 0 && activeScenarioStep < steps.length - 1 ? 'Resume' : 'Start Scenario'}
          </button>
        </div>

        <div className="two-col-grid" style={{ padding: 'var(--space-6)' }}>
          {/* Timeline */}
          <div className="flex flex-col gap-0" style={{ position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', left: '19px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--color-secondary)', zIndex: 0 }} />
            
            {steps.map((step, idx) => {
              const isActive = idx === activeScenarioStep;
              const isPast = idx < activeScenarioStep;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex gap-4" style={{ position: 'relative', zIndex: 1, opacity: isActive || isPast ? 1 : 0.4, paddingBottom: idx === steps.length -1 ? 0 : 'var(--space-6)', transition: 'opacity 0.3s' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isActive ? 'var(--color-primary)' : isPast ? 'var(--color-act-bg)' : 'var(--color-surface)',
                    color: isActive ? 'white' : isPast ? 'var(--color-primary)' : 'var(--color-text-light)',
                    border: `2px solid ${isActive || isPast ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                    transition: 'all 0.3s'
                  }}>
                    {isPast ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </div>
                  <div style={{ paddingTop: '6px' }}>
                    <div className="font-semibold">{step.title}</div>
                    {(isActive || isPast) && <div className="text-sm text-light mt-1 animate-fade-in">{step.desc}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic visual panel based on active step */}
          <div style={{ backgroundColor: '#FAFAFA', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', border: 'var(--border-light)' }}>
            {activeScenarioStep === 0 && (
              <div className="animate-fade-in">
                <div className="text-sm font-semibold mb-2 uppercase tracking-wide text-light">User Request</div>
                <div className="p-4 bg-white rounded border border-gray-200 text-lg shadow-sm">
                  "I'm restocking groceries for the week. Get my usual breakfast items, milk, fruit, and ingredients for three dinners. Keep the basket under ₹100, prefer my usual brands, and don't substitute anything that violates my dietary restrictions. You can check out without asking me if everything stays within my rules."
                </div>
              </div>
            )}
            
            {activeScenarioStep === 1 && (
              <div className="animate-fade-in flex flex-col gap-3">
                <div className="text-sm font-semibold mb-2 uppercase tracking-wide text-light">Agent Authority Loaded</div>
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded">
                  <span className="font-medium">Spending Cap</span>
                  <span className="font-bold">₹100.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded">
                  <span className="font-medium">Dietary Restrictions</span>
                  <span className="badge badge-stop">Peanuts</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded">
                  <span className="font-medium">Price Limit (Sub)</span>
                  <span className="font-bold">+₹2.00 or 15%</span>
                </div>
              </div>
            )}

            {(activeScenarioStep === 2 || activeScenarioStep === 3) && (
              <div className="animate-fade-in flex flex-col gap-3">
                <div className="text-sm font-semibold mb-2 uppercase tracking-wide text-light">Current Basket</div>
                {[catalog[0], catalog[4], catalog[8]].map((item, i) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded shadow-sm">
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-light">₹{item.price.toFixed(2)} • {item.size}</div>
                    </div>
                    {activeScenarioStep === 3 && i === 1 ? (
                      <span className="badge badge-ask" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>OUT OF STOCK</span>
                    ) : (
                      <span className="badge badge-act">IN STOCK</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeScenarioStep === 4 && (
              <div className="animate-fade-in flex flex-col gap-4">
                 <div className="text-sm font-semibold mb-2 uppercase tracking-wide text-light">Substitution Evaluation</div>
                 
                 <div className="p-4 border rounded bg-white" style={{ borderColor: 'var(--color-stop)' }}>
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <div className="font-bold text-sm">Peanut Butter Bread</div>
                       <div className="text-xs text-light">₹6.50 (+ ₹0.50)</div>
                     </div>
                     <span className="badge badge-stop">STOP</span>
                   </div>
                   <div className="text-xs" style={{ color: 'var(--color-stop)' }}>✗ Violates hard dietary constraint (Peanuts). Agent MUST block this.</div>
                 </div>

                 <div className="p-4 border rounded bg-white" style={{ borderColor: 'var(--color-act)' }}>
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <div className="font-bold text-sm">White Bread (Store Brand)</div>
                       <div className="text-xs text-light">₹3.50 (- ₹2.50)</div>
                     </div>
                     <span className="badge badge-act">ACT</span>
                   </div>
                   <div className="text-xs text-green-800">✓ Safe substitution. Under price limit, matches size/category. Agent acts autonomously.</div>
                 </div>
              </div>
            )}

            {activeScenarioStep === 5 && (
              <div className="animate-fade-in flex flex-col gap-4 h-full justify-center text-center">
                 <ShieldCheck size={48} className="mx-auto" style={{ color: 'var(--color-act)' }} />
                 <h4 className="m-0">Validating & Submitting</h4>
                 <p className="text-sm text-light">All constraints passed. Total is ₹16.00 (Limit: ₹100.00). Submitting via idempotency key <code>req_8923a1</code>...</p>
                 <div className="badge badge-act mx-auto mt-2">TRANSACTION CONFIRMED</div>
              </div>
            )}

            {activeScenarioStep === 6 && (
              <div className="animate-fade-in w-full">
                <IntentReceipt />
              </div>
            )}

          </div>
        </div>
      </div>

      {activeScenarioStep === 6 && (
        <div className="mt-8 text-center animate-fade-in">
          <h3 className="mb-4">Ready to test the rules yourself?</h3>
          <button className="btn btn-primary" onClick={onSwitchToWorkspace} style={{ padding: 'var(--space-3) var(--space-6)', fontSize: '1.1rem' }}>
            Open the Simulator <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
