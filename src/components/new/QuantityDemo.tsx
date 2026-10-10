import { useState } from 'react';
import { catalog } from '../../mockData';
import { ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function QuantityDemo() {
  const [view, setView] = useState<'ambiguous' | 'explicit'>('ambiguous');

  // Find the specific items in the catalog
  const singleFlour = catalog.find(p => p.id === 'q2')!;
  const twinFlour = catalog.find(p => p.id === 'q3')!;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="mb-10 text-center">
        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>The "Quantity: 2" Problem</h2>
        <p className="text-light text-lg max-w-3xl mx-auto">
          If a user asks for "2 packs of flour", what does an agent actually order? Ambiguous semantics lead to catastrophic pricing errors. Watch how a structured API contract solves this.
        </p>
      </div>

      <div className="flex justify-center mb-8 bg-white p-2 rounded-full shadow-sm max-w-sm mx-auto border border-gray-200">
        <button 
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-colors ${view === 'ambiguous' ? 'bg-amber-100 text-amber-900' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setView('ambiguous')}
        >
          Ambiguous Request
        </button>
        <button 
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-colors ${view === 'explicit' ? 'bg-green-100 text-green-900' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setView('explicit')}
        >
          Explicit Contract
        </button>
      </div>

      {view === 'ambiguous' ? (
        <div className="animate-fade-in">
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <h3 className="text-amber-900 flex items-center gap-2 m-0 mb-2"><AlertTriangle /> Ambiguous API Call</h3>
            <pre className="text-sm bg-white p-4 rounded border border-amber-100 overflow-x-auto text-gray-800">
{`{
  "product_id": "flour_generic",
  "quantity": 2
}`}
            </pre>
            <p className="text-amber-800 text-sm mt-3 m-0">The agent interprets "quantity: 2" as requesting two generic packs. But how big is a pack?</p>
          </div>

          <div className="two-col-grid">
            <div className="card border-red-200 shadow-md">
              <h4 className="text-red-800 border-b border-red-100 pb-2 mb-4">Retailer Interpretation A</h4>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2 border border-gray-200">
                <div>
                  <div className="font-bold">{singleFlour.name}</div>
                  <div className="text-xs text-gray-500">Retailer maps "pack" to 1 kg bag.</div>
                </div>
                <div className="font-bold">₹{singleFlour.price.toFixed(2)} / ea</div>
              </div>
              <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-500">Total (Qty: 2):</span>
                <span className="font-bold text-gray-900">₹{(singleFlour.price * 2).toFixed(2)} (2 kg)</span>
              </div>
            </div>

            <div className="card border-red-200 shadow-md">
              <h4 className="text-red-800 border-b border-red-100 pb-2 mb-4">Retailer Interpretation B</h4>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2 border border-gray-200">
                <div>
                  <div className="font-bold">{twinFlour.name}</div>
                  <div className="text-xs text-gray-500">Retailer maps "pack" to wholesale Twin Pack.</div>
                </div>
                <div className="font-bold">₹{twinFlour.price.toFixed(2)} / ea</div>
              </div>
              <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-500">Total (Qty: 2):</span>
                <span className="font-bold text-red-700">₹{(twinFlour.price * 2).toFixed(2)} (4 kg)</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 text-gray-600 text-sm">
             Result: A 100% variance in price and volume for the same natural language request.
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl mb-6">
            <h3 className="text-green-900 flex items-center gap-2 m-0 mb-2"><CheckCircle2 /> Explicit API Contract</h3>
            <pre className="text-sm bg-white p-4 rounded border border-green-100 overflow-x-auto text-gray-800">
{`{
  "product_id": "flour_single_1kg",
  "quantity": 2,
  "unit": "kg",
  "units_per_pack": 1,
  "total_base_units": 2
}`}
            </pre>
            <p className="text-green-800 text-sm mt-3 m-0">The API schema mathematically enforces the relationship between requested volume and physical items.</p>
          </div>

          <div className="card border-green-200 shadow-md max-w-2xl mx-auto">
            <h4 className="text-green-900 border-b border-green-100 pb-2 mb-4">Deterministic Resolution</h4>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-400 border border-gray-200">1</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Check base volume target</div>
                  <div className="text-xs text-gray-500">Agent must fulfill exactly 2 base units (kg).</div>
                </div>
              </div>
              
              <div className="flex justify-center text-gray-300">
                <ArrowRight className="rotate-90" />
              </div>
              
              <div className="flex gap-4 items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-400 border border-gray-200">2</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Validate against physical pack</div>
                  <div className="text-xs text-gray-500">Single Flour (1 kg) × Qty 2 = 2 kg. Validation passes.</div>
                </div>
              </div>
              
              <div className="flex justify-center text-gray-300">
                <ArrowRight className="rotate-90" />
              </div>

              <div className="flex gap-4 items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold border border-green-700"><CheckCircle2 size={20}/></div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-green-900">Guaranteed Correct Cart</div>
                    <div className="text-xs text-green-700">2 × Single Flour (₹5.00)</div>
                  </div>
                  <div className="font-bold text-green-900 text-xl">₹10.00</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600 italic text-center">
              If the Twin Pack (2 kg) was returned by search, the agent logic mathematically validates it requires Qty: 1 to fulfill the 2 base-unit target. The ambiguity is eliminated.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
