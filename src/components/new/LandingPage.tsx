import { ArrowRight, PlayCircle, ShieldAlert, Settings, ShieldCheck, Box, Receipt, AlertTriangle, RefreshCw } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { catalog } from '../../mockData';

export default function LandingPage({ setView }: { setView: (v: string) => void }) {
  const { setupScenario, resetSimulation } = useShopping();

  const handleLoadScenario = (type: string) => {
    switch (type) {
      case 'safe-substitution':
        setupScenario(
          { budget: 100 },
          [{ id: 'b1', product: catalog[4], quantity: 1, isUnavailable: false, status: 'pending' }]
        );
        setView('workspace');
        break;
      case 'price-limit':
        setupScenario(
          { budget: 100, maxAbsolutePriceIncrease: 0.10 }, // Tiny limit to force ASK
          [{ id: 'b1', product: catalog[4], quantity: 1, isUnavailable: false, status: 'pending' }]
        );
        setView('workspace');
        break;
      case 'dietary-restriction':
        setupScenario(
          { budget: 100, dietaryRestrictions: ['Peanut'] },
          [{ id: 'b1', product: catalog[4], quantity: 1, isUnavailable: false, status: 'pending' }]
        );
        setView('workspace');
        break;
      case 'ambiguous-quantity':
        setView('quantityDemo');
        break;
      case 'timeout':
        setupScenario(
          { budget: 100 }, // Exactly 100 triggers deterministic timeout in LiveBasket.tsx
          [{ id: 'b1', product: catalog[0], quantity: 1, isUnavailable: false, status: 'pending' }]
        );
        setView('workspace');
        break;
      case 'revoked':
        setupScenario(
          { budget: 100, permissionValid: false },
          [{ id: 'b1', product: catalog[0], quantity: 1, isUnavailable: false, status: 'pending' }]
        );
        setView('workspace');
        break;
    }
  };

  const handleStartExperience = () => {
    resetSimulation();
    setView('hero');
  };

  const handleConfigureRules = () => {
    resetSimulation();
    setView('workspace');
  };

  return (
    <div className="animate-fade-in pb-16">
      {/* A. Above the fold (Hero) */}
      <section className="text-center py-16 px-4 mb-8 bg-white border-b border-gray-200 rounded-2xl shadow-sm">
        {/* Case Study Submission Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 text-gray-800 rounded-2xl border border-emerald-200/80 mb-6 shadow-2xs max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#1C4233]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Inmobi Glance Product Associate Case Study
          </span>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="font-semibold text-gray-900">Ramidi Chinmayee</span>
            <span className="font-mono text-[11px] bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
              CO23BTECH11019
            </span>
          </div>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Mockup
          </span>
        </div>

        <h2 className="text-xl text-primary font-semibold mb-2 m-0 tracking-wide uppercase">Instacart Agent-Readiness Lab</h2>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto" style={{ letterSpacing: '-0.03em' }}>
          Can an AI shop for you without overstepping?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Autonomous agents require explicit authority, deterministic policies, and verifiable execution—not just better natural language prompts.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto" onClick={handleStartExperience}>
            <PlayCircle size={22} />
            Experience the product
          </button>
          <button className="btn btn-outline px-8 py-4 text-lg w-full sm:w-auto bg-white" onClick={() => handleLoadScenario('dietary-restriction')}>
            <ShieldAlert size={22} />
            Stress-test the agent
          </button>
        </div>
        <div className="mt-6">
          <button className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 mx-auto" onClick={handleConfigureRules}>
            <Settings size={16} /> Configure the rules
          </button>
        </div>
      </section>

      {/* E. Product thesis */}
      <section className="mb-16 max-w-3xl mx-auto text-center px-4">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2 font-bold">The Product Bet</h3>
        <p className="text-2xl font-medium text-primary m-0 leading-tight">
          "Make agents capable of acting autonomously without making user authority ambiguous."
        </p>
        <p className="text-gray-600 mt-4 text-sm leading-relaxed">
          This prototype demonstrates an architecture that separates intent extraction from policy evaluation. By strictly bounding the agent's authority with a Decision Budget, we enable confident autonomous execution while preserving user control.
        </p>
      </section>

      {/* C. Exploration paths */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="card hover-lift cursor-pointer border-t-4 border-t-primary" onClick={handleStartExperience}>
          <PlayCircle size={32} className="text-primary mb-4" />
          <h3 className="text-lg font-bold mb-2">1. Experience Product</h3>
          <p className="text-xs text-gray-600">Guided 2-minute simulated shopping run showing intent, constraints, and verified receipt.</p>
        </div>
        <div className="card hover-lift cursor-pointer border-t-4 border-t-red-600" onClick={() => handleLoadScenario('dietary-restriction')}>
          <ShieldAlert size={32} className="text-red-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">2. Break the Agent</h3>
          <p className="text-xs text-gray-600">Jump directly into edge cases. See what happens when substitutions violate diets or prices surge.</p>
        </div>
        <div className="card hover-lift cursor-pointer border-t-4 border-t-amber-500" onClick={handleConfigureRules}>
          <Settings size={32} className="text-amber-500 mb-4" />
          <h3 className="text-lg font-bold mb-2">3. Constitution Editor</h3>
          <p className="text-xs text-gray-600">Open the Trust Control Center. Adjust Decision Budget, approved staples, and autonomy tiers.</p>
        </div>
        <div className="card hover-lift cursor-pointer border-t-4 border-t-purple-600 bg-purple-50/20" onClick={() => setView('drivingTest')}>
          <ShieldCheck size={32} className="text-purple-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">4. Driving Test</h3>
          <p className="text-xs text-gray-600">Benchmark 2 simulated agents through 5 safety tests before granting payment authority.</p>
        </div>
      </section>

      {/* D. Scenario launcher */}
      <section className="mb-16">
        <h3 className="text-2xl mb-6">Deterministic Scenario Testing</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScenarioCard 
            title="Safe substitution" 
            desc="A substitution matches category and stays within the price limit." 
            badge="ACT" badgeClass="badge-act" 
            onClick={() => handleLoadScenario('safe-substitution')} 
          />
          <ScenarioCard 
            title="Price-limit violation" 
            desc="The only available substitute exceeds the configured maximum increase." 
            badge="ASK" badgeClass="badge-ask" 
            onClick={() => handleLoadScenario('price-limit')} 
          />
          <ScenarioCard 
            title="Hard dietary restriction" 
            desc="The alternative product contains an explicitly prohibited ingredient." 
            badge="STOP" badgeClass="badge-stop" 
            onClick={() => handleLoadScenario('dietary-restriction')} 
          />
          <ScenarioCard 
            title="Ambiguous package quantity" 
            desc="Demonstrates why explicit unit contracts are required over 'quantity: 2'." 
            badge="DEMO" badgeClass="bg-blue-100 text-blue-800" 
            onClick={() => handleLoadScenario('ambiguous-quantity')} 
          />
          <ScenarioCard 
            title="Checkout timeout" 
            desc="The transaction hangs. Show idempotency and explicit verification." 
            badge="VERIFY" badgeClass="bg-purple-100 text-purple-800" 
            onClick={() => handleLoadScenario('timeout')} 
          />
          <ScenarioCard 
            title="Revoked permission" 
            desc="The user instantly revokes the agent's authority to act or checkout." 
            badge="STOP" badgeClass="badge-stop" 
            onClick={() => handleLoadScenario('revoked')} 
          />
        </div>
      </section>

      {/* B. Implemented feature directory */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-2xl mb-6 border-b border-gray-100 pb-4">What this prototype demonstrates</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureItem 
            icon={<ShieldCheck size={24} className="text-primary" />}
            title="Decision Budget"
            problem="Users don't trust agents with unbounded financial authority."
            example="Users set a max absolute increase (e.g., ₹2.00). The agent can auto-substitute anything under that limit."
            action="Configure rules"
            onAction={handleConfigureRules}
            implemented={true}
          />
          <FeatureItem 
            icon={<AlertTriangle size={24} className="text-primary" />}
            title="ACT / ASK / STOP Decisions"
            problem="Binary 'allow/deny' fails when agents need human tie-breakers."
            example="Safe items are ACT. Price bumps trigger an ASK for approval. Dietary violations hit a hard STOP."
            action="Try substitution"
            onAction={() => handleLoadScenario('price-limit')}
            implemented={true}
          />
          <FeatureItem 
            icon={<Box size={24} className="text-primary" />}
            title="Explicit Package Semantics"
            problem="LLMs misunderstand pack sizes (e.g., '2 packs of flour')."
            example="The demo proves how mapping base-units (2 kg) to pack metadata fixes catastrophic pricing errors."
            action="View demo"
            onAction={() => handleLoadScenario('ambiguous-quantity')}
            implemented={true}
          />
          <FeatureItem 
            icon={<Receipt size={24} className="text-primary" />}
            title="Intent Receipt"
            problem="Users need a verified audit trail of what the agent actually decided."
            example="Produces a final receipt separating the 'Authorized Basket' from the 'Executed Basket'."
            action="Run story mode"
            onAction={handleStartExperience}
            implemented={true}
          />
          <FeatureItem 
            icon={<RefreshCw size={24} className="text-primary" />}
            title="Idempotent Transaction Handling"
            problem="Simulated agent retries can cause duplicate real-world orders."
            example="If the checkout times out, the app enters an unresolved state requiring verification before retrying."
            action="Simulate timeout"
            onAction={() => handleLoadScenario('timeout')}
            implemented={true}
          />
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <div className="text-center sm:text-left">
            <span className="font-bold text-gray-800">Inmobi Glance Product Associate Case Study Mockup</span>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Candidate: <strong className="text-gray-800">Ramidi Chinmayee</strong> (<span className="font-mono font-semibold text-gray-700">CO23BTECH11019</span>)
            </div>
          </div>
          <div className="text-[11px] text-gray-400 text-center sm:text-right">
            Deterministic Decision Gateway & Agent Governance Prototype
          </div>
        </div>
        <div className="mt-3 text-[11px] text-gray-400 text-center">
          <span className="font-semibold text-gray-500">Note:</span> This is a static frontend prototype. Payment gateways, backend databases, and real LLM integrations are simulated via deterministic TypeScript.
        </div>
      </section>
    </div>
  );
}

function ScenarioCard({ title, desc, badge, badgeClass, onClick }: { title: string, desc: string, badge: string, badgeClass: string, onClick: () => void }) {
  return (
    <div className="card hover-lift p-5 cursor-pointer border-t-4 border-transparent hover:border-t-primary transition-all flex flex-col h-full group" onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="m-0 text-base font-bold group-hover:text-primary transition-colors">{title}</h4>
        <span className={`badge ${badgeClass} text-[10px]`}>{badge}</span>
      </div>
      <p className="text-xs text-gray-600 m-0 flex-1">{desc}</p>
      <div className="mt-4 text-xs font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Launch scenario <ArrowRight size={14} />
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, problem, example, action, onAction, implemented }: { icon: any, title: string, problem: string, example: string, action: string, onAction: () => void, implemented: boolean }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="m-0 text-base">{title}</h4>
          {implemented ? (
            <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 uppercase font-bold">Implemented</span>
          ) : (
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 uppercase font-bold">Simulated</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2"><strong>Problem:</strong> {problem}</p>
        <p className="text-sm text-gray-600 mb-3"><strong>Demo:</strong> {example}</p>
        <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline" onClick={onAction}>
          {action} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
