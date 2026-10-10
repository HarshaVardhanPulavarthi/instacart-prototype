import { X, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { DecisionLog } from '../../decisionEngine';

export default function DecisionExplanation({ log, onClose }: { log: DecisionLog, onClose: () => void }) {
  const renderIcon = (passed: boolean | string) => {
    if (passed === true) return <CheckCircle2 size={16} className="text-green-600" />;
    if (passed === false) return <XCircle size={16} className="text-red-600" />;
    return <AlertTriangle size={16} className="text-amber-500" />;
  };

  const badgeClass = log.decision === 'ACT' ? 'badge-act' : log.decision === 'ASK' ? 'badge-ask' : 'badge-stop';

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full m-4" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="m-0 text-lg">Decision Explanation</h3>
          <button className="text-gray-400 hover:text-gray-900" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Agent Action</div>
          <div className="font-semibold text-gray-900 mb-3">{log.action}</div>
          
          <div className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Calculated Outcome</div>
          <div className="flex items-center gap-3">
             <span className={`badge ${badgeClass} text-sm px-3 py-1`}>{log.decision}</span>
             <span className="text-sm font-medium text-gray-700">{log.reason}</span>
          </div>
        </div>

        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Rule Evaluation</h4>
        <div className="flex flex-col gap-3 mb-6">
          {log.checks.map((check, idx) => (
            <div key={idx} className="flex gap-3 items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="mt-0.5">{renderIcon(check.passed)}</div>
              <div>
                <div className="font-semibold text-sm text-gray-900">{check.name}</div>
                <div className="text-xs text-gray-600">{check.details}</div>
              </div>
            </div>
          ))}
        </div>

        {log.requiredAction && (
          <div className={`p-4 rounded-lg text-sm font-medium border ${log.decision === 'ASK' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
             <div className="font-bold mb-1">Next Step</div>
             {log.requiredAction}
          </div>
        )}
      </div>
    </div>
  );
}
