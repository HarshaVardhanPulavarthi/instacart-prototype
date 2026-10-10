import { ShieldCheck, MessageCircle, BrainCircuit, Rocket, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';

export default function FeaturesShowcase() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent blur-3xl opacity-50 h-full"></div>
        <div className="inline-flex items-center justify-center p-4 bg-white shadow-xl shadow-primary/10 rounded-2xl mb-6 border border-gray-100">
          <Zap size={32} className="text-primary fill-primary/20" />
        </div>
        <h2 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
          Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Architecture</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          A technical breakdown of the trust frameworks, safety rails, and semantic engines powering the Agent-Readiness prototype.
        </p>
      </div>

      <div className="space-y-12">
        {/* Category 1 */}
        <div className="group bg-white rounded-3xl p-1 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200 hover:border-red-200">
          <div className="bg-gradient-to-br from-white to-red-50/30 rounded-[22px] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-red-100 text-red-600 rounded-2xl shadow-inner"><ShieldCheck size={32} /></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 m-0">Trust & Safety Engine</h3>
                <p className="text-gray-500 text-sm mt-1">Hard boundaries and execution guardrails.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard icon="💰" title="Max Order Spend (Budget Enforcer)" desc="Blocks the final checkout if the total basket cost exceeds the authorized budget limit." color="red" />
              <FeatureCard icon="📈" title="Price Spike Protection" desc="Evaluates alternative products against absolute (e.g. ₹50) and percentage (e.g. 20%) price limits." color="red" />
              <FeatureCard icon="🥜" title="Allergy & Dietary Blockers" desc="Deep-scans ingredients and titles at the basket level to immediately halt execution if a restricted item is found." color="red" />
              <FeatureCard icon="🛒" title="Anti-Hoarding Checks" desc="Protects against LLM hallucinations by automatically blocking checkout if any item quantity exceeds realistic bounds." color="red" />
            </div>
          </div>
        </div>

        {/* Category 2 */}
        <div className="group bg-white rounded-3xl p-1 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200 hover:border-green-200">
          <div className="bg-gradient-to-br from-white to-green-50/30 rounded-[22px] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-green-100 text-green-600 rounded-2xl shadow-inner"><MessageCircle size={32} /></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 m-0">Human-in-the-Loop</h3>
                <p className="text-gray-500 text-sm mt-1">Seamless agent-to-user escalation pathways.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard icon="💬" title="WhatsApp Resolution" desc="Agent execution pauses when ambiguity is detected, sending an async notification to the user's preferred channel." color="green" />
              <FeatureCard icon="⏳" title="Asynchronous Approvals" desc="The checkout queue waits indefinitely for human approval on 'ASK' items before finalizing the order." color="green" />
              <FeatureCard icon="🛑" title="Revocable Agent Authority" desc="The user can instantly revoke checkout permissions, acting as a hard kill-switch for autonomous actions." color="green" />
            </div>
          </div>
        </div>

        {/* Category 3 */}
        <div className="group bg-white rounded-3xl p-1 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200 hover:border-blue-200">
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-[22px] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl shadow-inner"><BrainCircuit size={32} /></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 m-0">Semantic Understanding</h3>
                <p className="text-gray-500 text-sm mt-1">AI-driven context and grocery-specific reasoning.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard icon="⚖️" title="Package Size Mapping" desc="Allows the engine to understand that a 'Twin Pack' equals 2 individual units, solving ambiguous cart queries." color="blue" />
              <FeatureCard icon="🍞" title="Category Equivalence" desc="Ensures substitutes belong to the same logical taxonomy (e.g., Bread for Bread, not Bread for Flour)." color="blue" />
              <FeatureCard icon="🏷️" title="Brand Loyalty Scoring" desc="Flags when a substitute is from an unapproved or unpreferred brand, triggering user verification." color="blue" />
            </div>
          </div>
        </div>

        {/* Category 4 */}
        <div className="relative group rounded-3xl p-1 shadow-md hover:shadow-2xl transition-all duration-500 bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="bg-white/95 backdrop-blur-md rounded-[22px] p-8 md:p-10 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl shadow-inner"><Rocket size={32} /></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 m-0">Future Horizons</h3>
                  <p className="text-purple-600 font-medium text-sm mt-1">Proposed Next-Gen Capabilities</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-purple-600 font-semibold text-sm bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
                Roadmap <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FutureCard title="Memory-Based Training" desc="Using historical WhatsApp replies to fine-tune the user's personal agent model for zero-shot decision making." />
              <FutureCard title="Conversational Commerce" desc="Allowing users to modify their cart directly through the WhatsApp chat ('Actually, get 2 milks instead')." />
              <FutureCard title="Visual Receipts" desc="Generating a pre-checkout snapshot image of the cart for users to approve at a single glance." />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: string, title: string, desc: string, color: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4 group/card">
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-${color}-50 text-xl border border-${color}-100 group-hover/card:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-base mb-1">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FutureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100/50 hover:bg-purple-100/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 size={16} className="text-purple-500" />
        <h4 className="font-bold text-purple-900 text-sm">{title}</h4>
      </div>
      <p className="text-xs text-purple-700/80 leading-relaxed pl-6">{desc}</p>
    </div>
  );
}
