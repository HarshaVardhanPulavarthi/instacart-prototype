import TrustControlCenter from './new/TrustControlCenter';
import LiveBasket from './new/LiveBasket';
import { useShopping } from '../context/ShoppingContext';

import { catalog } from '../mockData';

export default function Workspace() {
  const { logs, setupScenario } = useShopping();

  const loadScenario = (type: 'safe' | 'price' | 'allergy') => {
    const baseBasket = [
      { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p1')!, quantity: 1, isUnavailable: false, status: 'pending' as const },
      { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p11')!, quantity: 1, isUnavailable: false, status: 'pending' as const },
      { id: `b_${Date.now()}_3`, product: catalog.find(p => p.id === 'p10')!, quantity: 1, isUnavailable: false, status: 'pending' as const }
    ];

    if (type === 'safe') {
      setupScenario(
        { budget: 1000, maxAbsolutePriceIncrease: 50, dietaryRestrictions: [] }, 
        [...baseBasket]
      );
    } else if (type === 'price') {
      setupScenario(
        { budget: 350, maxAbsolutePriceIncrease: 5, maxPercentagePriceIncrease: 10, doubtResolutionChannel: 'whatsapp' }, 
        [...baseBasket]
      );
    } else if (type === 'allergy') {
      setupScenario(
        { budget: 1000, maxAbsolutePriceIncrease: 150, dietaryRestrictions: ['Peanut'], doubtResolutionChannel: 'whatsapp' }, 
        [
          { id: `b_${Date.now()}_1`, product: catalog.find(p => p.id === 'p7')!, quantity: 1, isUnavailable: false, status: 'pending' as const }, // Peanut Butter Bread (WILL FAIL)
          { id: `b_${Date.now()}_2`, product: catalog.find(p => p.id === 'p13')!, quantity: 1, isUnavailable: false, status: 'pending' as const }, // Potato Chips
          { id: `b_${Date.now()}_3`, product: catalog.find(p => p.id === 'p1')!, quantity: 1, isUnavailable: false, status: 'pending' as const }  // Milk
        ]
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>Interactive Simulator</h2>
          <p className="text-light text-sm m-0 mt-2 max-w-2xl">
            Test the live rule engine. Change the Decision Budget on the left, then simulate stockouts in the basket. Observe whether the agent responds with <span className="badge badge-act text-[10px]" style={{ padding: '0 6px', verticalAlign: 'middle', margin: '0 4px' }}>ACT</span>, <span className="badge badge-ask text-[10px]" style={{ padding: '0 6px', verticalAlign: 'middle', margin: '0 4px' }}>ASK</span>, or <span className="badge badge-stop text-[10px]" style={{ padding: '0 6px', verticalAlign: 'middle', margin: '0 4px' }}>STOP</span>.
          </p>
        </div>
        
        <div className="flex flex-col md:items-end gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <span>🧪</span> Load Test Case
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-outline bg-white text-[11px] py-1 px-2 border-green-200 text-green-800 hover:bg-green-50" onClick={() => loadScenario('safe')}>
              Safe Sub (ACT)
            </button>
            <button className="btn btn-outline bg-white text-[11px] py-1 px-2 border-red-200 text-red-800 hover:bg-red-50" onClick={() => loadScenario('price')}>
              Price Spike (STOP)
            </button>
            <button className="btn btn-outline bg-white text-[11px] py-1 px-2 border-red-200 text-red-800 hover:bg-red-50" onClick={() => loadScenario('allergy')}>
              Allergy Risk (STOP)
            </button>
          </div>
        </div>
      </div>

      <div className="workspace-grid mb-16 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1">
            <TrustControlCenter />
          </div>
          {/* Event Log Sidebar */}
          <div className="workspace-panel flex-1 flex flex-col p-0 overflow-hidden" style={{ minHeight: '400px' }}>
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg m-0">Event Audit Log</h3>
              <p className="text-xs text-light m-0 mt-1">Append-only record of all agent activity.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {logs.length === 0 ? (
                <div className="text-sm text-gray-400 italic text-center mt-10">No events yet. Simulate a stockout to see the engine evaluate alternatives.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {logs.map((log, i) => (
                    <div key={i} className="text-sm border-l-2 pl-3 py-1 relative" style={{ borderColor: log.decision === 'ACT' ? 'var(--color-act)' : log.decision === 'ASK' ? 'var(--color-ask)' : 'var(--color-stop)' }}>
                      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full" style={{ backgroundColor: log.decision === 'ACT' ? 'var(--color-act)' : log.decision === 'ASK' ? 'var(--color-ask)' : 'var(--color-stop)' }} />
                      <div className="flex justify-between items-start mb-1">
                        <span className={`badge ${log.decision === 'ACT' ? 'badge-act' : log.decision === 'ASK' ? 'badge-ask' : 'badge-stop'} text-[10px] px-2 py-0.5`}>{log.decision}</span>
                        <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="font-semibold text-gray-800 mb-1 leading-tight">{log.action}</div>
                      <div className="text-xs text-gray-500 leading-tight">{log.reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="h-full" style={{ minHeight: '800px' }}>
          <LiveBasket />
        </div>
      </div>
    </div>
  );
}
