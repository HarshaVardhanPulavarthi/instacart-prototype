import { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, 
  ShieldCheck, HelpCircle, AlertOctagon, Activity, 
  CheckCircle2, ArrowRight, Layers, Sparkles,
  Smartphone, Key, Scale, Ban, Receipt, Zap
} from 'lucide-react';

export type StageId = 
  | 'none'
  | 'agent' 
  | 'gateway' 
  | 'intent' 
  | 'ask' 
  | 'authority' 
  | 'execution' 
  | 'stop' 
  | 'evidence';

type FlowMode = 'none' | 'act' | 'ask' | 'stop';

interface StageMeta {
  id: StageId;
  number?: string;
  name: string;
  subtitle: string;
  badge: 'PIPELINE' | 'ASK' | 'STOP' | 'EVIDENCE';
  badgeColor: string;
  summary: string;
  role: string;
  input: string;
  output: string;
  prototypeExample: string;
  thesisAlignment: string;
  specialAction1: {
    label: string;
    icon: string;
    description: string;
    resultTitle: string;
    resultPayload: string;
    statusBadge: string;
    statusColor: string;
  };
  specialAction2: {
    label: string;
    icon: string;
    description: string;
    resultTitle: string;
    resultPayload: string;
    statusBadge: string;
    statusColor: string;
  };
}

const STAGES_DATA: Record<StageId, StageMeta> = {
  none: {
    id: 'none',
    name: 'Overview',
    subtitle: 'End-to-End Governance Architecture',
    badge: 'PIPELINE',
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-200',
    summary: 'Click any stage button above or click directly on the diagram boxes to inspect internal mechanics, inputs, outputs, and live prototype scenarios.',
    role: 'Separates generative intent interpretation from deterministic transaction execution.',
    input: 'Customer natural language intent & live catalog inventory.',
    output: 'Idempotent, audit-verified order with zero financial or dietary overstepping.',
    prototypeExample: 'Select a stage above to view its live implementation details.',
    thesisAlignment: 'ACT autonomously within mandate. ASK when user clarification is required. STOP unconditionally on hard violations.',
    specialAction1: {
      label: 'Run Safe ACT Simulation',
      icon: '▶',
      description: 'Simulates autonomous execution when intent is clear and rules are satisfied.',
      resultTitle: 'Autonomous Flow Verdict',
      resultPayload: 'Stage 1 → 2 → 3 → 4 → 5 → 6 verified. Total: ₹465. Budget: ₹500 cap. Status: 200 APPROVED.',
      statusBadge: 'ACT (VERIFIED)',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    specialAction2: {
      label: 'Inspect Architecture Guardrails',
      icon: '🛡️',
      description: 'Checks perimeter validation across all 6 sequential governance gates.',
      resultTitle: 'Perimeter Integrity',
      resultPayload: '6 deterministic guardrails active. LLMs cannot execute financial transactions directly.',
      statusBadge: 'GUARDRAILS ACTIVE',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300'
    }
  },
  agent: {
    id: 'agent',
    number: '1',
    name: 'User\'s External AI Agent',
    subtitle: 'Sends a structured request',
    badge: 'PIPELINE',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    summary: 'The client-side agent plans grocery orders from natural language prompts, producing a structured request schema rather than invoking payment APIs directly.',
    role: 'Agentic intent planning & prompt interpretation.',
    input: 'User voice/text: "Restock breakfast staples under ₹500, no tree-nuts, usual brands."',
    output: 'Structured JSON order request containing candidate SKU targets and quantities.',
    prototypeExample: 'In our Simulator, this is the order manifest loaded from predefined test cases or user basket interactions.',
    thesisAlignment: 'External agents are treated as untrusted intent originators. They cannot bypass the downstream Decision Gateway.',
    specialAction1: {
      label: 'Generate Agent Intent Payload',
      icon: '✨',
      description: 'Synthesizes a structured JSON shopping order from user prompt.',
      resultTitle: 'Generated Agent Payload',
      resultPayload: JSON.stringify({
        agent_id: "agent_gpt4_shopper",
        intent: "RESTOCK_BREAKFAST",
        mandate_token: "tok_usr_88321",
        proposed_items: [
          { sku: "amul_butter_500g", qty: 1, max_price: 285 },
          { sku: "modern_bread_white", qty: 2, max_price: 90 }
        ],
        declared_budget_limit: 500
      }, null, 2),
      statusBadge: 'PAYLOAD_COMPILED',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    specialAction2: {
      label: 'Simulate Prompt Injection Attempt',
      icon: '⚠️',
      description: 'Simulates agent attempting to bypass user budget via prompt trickery.',
      resultTitle: 'Prompt Sanitization Filter',
      resultPayload: 'Agent payload contained "OVERRIDE_BUDGET=true". Gateway discards untrusted instructions. Schema strictly stripped to customer-signed mandate.',
      statusBadge: 'TAMPER_SANITIZED',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300'
    }
  },
  gateway: {
    id: 'gateway',
    number: '2',
    name: 'API / MCP Gateway',
    subtitle: 'Access, permissions, format',
    badge: 'PIPELINE',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    summary: 'Terminates MCP tool calls, validates API session auth tokens, enforces rate limits, and inspects request payload schema compliance.',
    role: 'Perimeter authorization & schema sanitization.',
    input: 'Raw incoming MCP protocol request from agent runtime.',
    output: 'Cryptographically validated session bound to customer tenant and active cart.',
    prototypeExample: 'In our codebase, this checks that the agent holds a valid mandate and that authority has not been revoked via the kill-switch.',
    thesisAlignment: 'Guarantees that agents communicate via formal schemas, preventing unauthorized API calls or raw credential access.',
    specialAction1: {
      label: 'Verify MCP Protocol Handshake',
      icon: '🔑',
      description: 'Validates cryptographic session signature and tenant permissions.',
      resultTitle: 'MCP Gateway Handshake',
      resultPayload: JSON.stringify({
        protocol: "Model-Context-Protocol / 2024-11",
        client_auth: "HMAC-SHA256: VALID",
        rate_limit: "4 req/min (12% consumed)",
        tenant_context: "user_harsha_prime",
        status: "200 OK - PERMITTED_TOOL_CALL"
      }, null, 2),
      statusBadge: 'AUTHENTICATED',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    specialAction2: {
      label: 'Test Revocable Authority (Kill-Switch)',
      icon: '🛡️',
      description: 'Simulates user pulling the emergency kill-switch mid-flight.',
      resultTitle: 'Emergency Revocation',
      resultPayload: 'Kill-switch triggered! Token tok_usr_88321 immediately invalidated across distributed gateway cache. Response: 403 AGENT_REVOKED.',
      statusBadge: 'ACCESS_REVOKED',
      statusColor: 'bg-rose-100 text-rose-800 border-rose-300'
    }
  },
  intent: {
    id: 'intent',
    number: '3',
    name: 'Intent & Quantity Validator',
    subtitle: 'Variants, units, pack sizes',
    badge: 'PIPELINE',
    badgeColor: 'bg-green-50 text-green-800 border-green-200',
    summary: 'Normalizes messy human volume expressions into explicit base-unit semantics to prevent catastrophic pack-size multiplier errors.',
    role: 'Semantic volume & package normalization.',
    input: 'Natural language volume request (e.g., "2 packs of flour" or "2 eggs").',
    output: 'Validated target base-units (e.g. 2 kg base units matched against 1x 2kg twin pack or 2x 1kg packs).',
    prototypeExample: 'Tested in the Package Semantics view: eliminates the 100% price discrepancy between single 1kg flour and wholesale twin packs.',
    thesisAlignment: 'If quantity or product identity cannot be resolved with certainty, execution automatically branches into the ASK loop.',
    specialAction1: {
      label: 'Resolve 2-Pack Semantics (Twin Pack vs Units)',
      icon: '📦',
      description: 'Normalizes package expressions to eliminate 2x quantity pricing errors.',
      resultTitle: 'Semantic Package Resolution',
      resultPayload: JSON.stringify({
        raw_prompt: "Get 2 packs of Aashirvaad Atta",
        detected_ambiguity: "Twin pack (2x1kg) vs 2 individual 1kg packs",
        normalized_target_units: "2000g net weight",
        best_match: "1x Twin Pack (₹110) instead of 2x Singles (₹130)",
        savings_detected: "₹20 saved via package bundling"
      }, null, 2),
      statusBadge: 'NORMALIZED_UNITS',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    specialAction2: {
      label: 'Trigger Brand Ambiguity Check',
      icon: '❓',
      description: 'Simulates requested brand being unavailable, routing to the ASK branch.',
      resultTitle: 'Brand Ambiguity Detected',
      resultPayload: 'Target brand "Amul Salted Butter" out of stock. Alternative "Nandini Butter" (+₹4) identified. Uncertainty > 0.05 threshold. Branching to ASK.',
      statusBadge: 'ROUTED_TO_ASK',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300'
    }
  },
  ask: {
    id: 'ask',
    name: 'Human-in-the-Loop (ASK Loop)',
    subtitle: 'User confirms & Preference store',
    badge: 'ASK',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    summary: 'When ambiguity is detected or an unfamiliar brand is requested, the engine halts checkout and dispatches an asynchronous ping to the user\'s chosen doubt channel.',
    role: 'Interactive tie-breaker & preference persistence.',
    input: 'Flagged ambiguous substitution or brand mismatch candidate.',
    output: 'User confirmation via WhatsApp/In-App, written back to the user\'s private preference store.',
    prototypeExample: 'Simulated in our Brand Mismatch test case: when Amul is out of stock, the agent pings user WhatsApp for confirmation rather than guessing.',
    thesisAlignment: 'Preserves user authority. The resolved choice saves to preferences, turning future ambiguous cases into autonomous ACTs.',
    specialAction1: {
      label: 'Dispatch WhatsApp Confirmation Ping',
      icon: '💬',
      description: 'Sends an asynchronous confirmation request to the customer WhatsApp.',
      resultTitle: 'Simulated WhatsApp Message',
      resultPayload: '📱 WhatsApp Dispatch: "Hi Harsha! Amul Butter (₹50) is out of stock. Nandini Table Butter is available for ₹54. Shall we substitute this for your breakfast restock? Reply YES or NO."',
      statusBadge: 'AWAITING_REPLY',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    specialAction2: {
      label: 'Simulate User Approval & Store Preference',
      icon: '💾',
      description: 'User replies "YES". Preference is saved to private store for future autonomy.',
      resultTitle: 'Preference Store Updated',
      resultPayload: JSON.stringify({
        event: "USER_APPROVED_SUBSTITUTION",
        source: "WhatsApp (+91 98***)",
        persisted_rule: "IF amul_butter OOS THEN substitute nandini_butter UP_TO +₹10",
        future_action: "ACT autonomously on subsequent orders",
        preference_store_id: "pref_rec_7719"
      }, null, 2),
      statusBadge: 'PREFERENCE_SAVED',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  },
  authority: {
    id: 'authority',
    number: '4',
    name: 'Preference & Policy Gatekeeper',
    subtitle: 'Limits, rules, hard constraints',
    badge: 'PIPELINE',
    badgeColor: 'bg-green-50 text-green-800 border-green-200',
    summary: 'The deterministic rule engine evaluates the order against the user\'s live Constitution: spending caps, approved staples, autonomy tiers, and dietary rules.',
    role: 'Policy evaluation & boundary enforcement.',
    input: 'Proposed items list vs. live Mandate constraints in ShoppingContext.',
    output: 'Deterministic policy verdict: ACT (clear), ASK (needs confirmation), or STOP (hard violation).',
    prototypeExample: 'Trust Control Center: user sets budget ₹500, max surge ₹50, and checks "Tree-Nut" restriction. Rules take effect immediately.',
    thesisAlignment: 'Policies are pure deterministic TypeScript code, never delegated to probabilistic LLM judgment.',
    specialAction1: {
      label: 'Evaluate Spending Cap Rule (₹500 Max)',
      icon: '💰',
      description: 'Checks candidate cart total against the user\'s hard financial limit.',
      resultTitle: 'Budget Policy Evaluation',
      resultPayload: JSON.stringify({
        hard_limit: 500,
        candidate_total: 465,
        buffer_remaining: 35,
        rule_check: "candidate_total <= hard_limit",
        verdict: "PASSED (No financial breach)"
      }, null, 2),
      statusBadge: 'BUDGET_VERIFIED',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    specialAction2: {
      label: 'Scan Dietary Allergen Policy',
      icon: '🥜',
      description: 'Scans all ingredients for tree-nut allergens under zero-tolerance policy.',
      resultTitle: 'Dietary Safety Audit',
      resultPayload: 'Checking ingredients of 3 items... Tree-Nut restriction active. Item #2 "Almond Granola" contains "Roasted Almonds (14%)". HARD_STOP_TRIGGERED.',
      statusBadge: 'ALLERGEN_FLAGGED',
      statusColor: 'bg-rose-100 text-rose-800 border-rose-300'
    }
  },
  execution: {
    id: 'execution',
    number: '5',
    name: 'Catalog & Execution',
    subtitle: 'Availability, price, order',
    badge: 'PIPELINE',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    summary: 'Evaluates live merchant catalog availability, stockouts, surge pricing, and candidate alternative products in real time.',
    role: 'Catalog inventory matching & cart compilation.',
    input: 'Current merchant stock levels and substitute candidate items.',
    output: 'Final order compilation or rerouting to STOP if alternatives violate safety rules.',
    prototypeExample: 'Live Basket: clicking "+₹100 Surge" or "Stockout" causes this layer to re-evaluate alternative items against mandate caps.',
    thesisAlignment: 'Substitutions are evaluated against category equivalence and price increase thresholds before order creation.',
    specialAction1: {
      label: 'Query Live Merchant Inventory',
      icon: '🛒',
      description: 'Simulates store stock check across live catalog endpoints.',
      resultTitle: 'Inventory Real-Time Status',
      resultPayload: JSON.stringify({
        merchant_store: "Instacart / Koramangala Store #402",
        items_checked: 3,
        in_stock: ["Modern Bread (2)", "Nandini Butter (1)", "Organic Eggs (6)"],
        stockout_count: 0,
        fulfillment_window: "Today 11:30 AM - 12:15 PM"
      }, null, 2),
      statusBadge: 'STOCK_RESERVED',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    specialAction2: {
      label: 'Inject +₹100 Surge Surcharge',
      icon: '📈',
      description: 'Tests price spike protection when merchant applies sudden surge pricing.',
      resultTitle: 'Surge Spike Evaluation',
      resultPayload: 'Surge +₹100 added. New total: ₹565. Hard cap is ₹500. Surcharge ceiling (₹50) exceeded by ₹50. Order cannot proceed autonomously.',
      statusBadge: 'SURGE_BLOCKED',
      statusColor: 'bg-rose-100 text-rose-800 border-rose-300'
    }
  },
  stop: {
    id: 'stop',
    name: 'Safety Gateway (STOP Halt)',
    subtitle: 'Non-overridable boundary enforcer',
    badge: 'STOP',
    badgeColor: 'bg-red-50 text-red-900 border-red-300 font-bold',
    summary: 'Hard circuit-breaker. When an ingredient violates a severe dietary restriction (e.g. tree nuts) or breaches a hard financial cap, action halts completely.',
    role: 'Hard safety invariant enforcer.',
    input: 'Ingredient manifest with detected allergen or order total exceeding hard budget limit.',
    output: 'Immediate STOP decision; checkout is blocked and user is notified of the violation.',
    prototypeExample: 'Signature Substitution Challenge: agent proposes Crunchy Almond Granola, gateway halts checkout immediately because Almonds violate nut restriction.',
    thesisAlignment: 'Hard rules cannot be overridden by convenience. A life-safety violation produces an unconditional STOP.',
    specialAction1: {
      label: 'Trip Hard Circuit-Breaker (Halt Checkout)',
      icon: '🛑',
      description: 'Simulates emergency halt with non-overridable safety lock.',
      resultTitle: 'Emergency Halt Activated',
      resultPayload: JSON.stringify({
        circuit_breaker: "TRIPPED",
        reason: "SEVERE_DIETARY_VIOLATION (Tree-Nuts in Almond Granola)",
        financial_hold: "RELEASED (₹0 charged)",
        cart_state: "FROZEN",
        audit_incident_id: "inc_safety_9921",
        user_alert: "Dispatched immediate push notification"
      }, null, 2),
      statusBadge: 'HARD_STOP_ENGAGED',
      statusColor: 'bg-rose-100 text-rose-900 border-rose-400'
    },
    specialAction2: {
      label: 'Verify Zero-Leakage Guarantee',
      icon: '🛡️',
      description: 'Confirms that payment gateway was never contacted and no money was moved.',
      resultTitle: 'Financial Invariant Check',
      resultPayload: 'Zero payment authorization issued. Idempotency ledger confirms: No API calls to Stripe/Instacart Checkout. Safety guaranteed.',
      statusBadge: '₹0 CHARGED',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  },
  evidence: {
    id: 'evidence',
    number: '6',
    name: 'Receipt & Audit Log',
    subtitle: 'Asked, happened, why, recovery',
    badge: 'EVIDENCE',
    badgeColor: 'bg-purple-50 text-purple-900 border-purple-200',
    summary: 'Generates an immutable, cryptographic audit receipt that separates authorized intent from executed basket, preventing double charges via idempotency keys.',
    role: 'Auditable compliance record & idempotency verification.',
    input: 'Completed transaction record, rule checks log, and cryptographic idempotency key.',
    output: 'Tamper-evident Intent Receipt with Decision Replay timeline.',
    prototypeExample: 'Intent Receipt component: displays recorded evidence (HASH, IDEMP_KEY), verified quantities, and step-by-step decision replay.',
    thesisAlignment: 'Trust requires verification. The user can replay every micro-decision made by the agent.',
    specialAction1: {
      label: 'Mint Cryptographic Intent Receipt',
      icon: '🧾',
      description: 'Generates immutable SHA-256 evidence record and idempotency key.',
      resultTitle: 'Cryptographic Audit Receipt',
      resultPayload: JSON.stringify({
        receipt_id: "rcpt_ord_88201",
        idempotency_key: "idemp_4f89b-9c2a-4311",
        sha256_intent_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        authorized_by_user: true,
        rules_verified_count: 5,
        total_paid: "₹465.00"
      }, null, 2),
      statusBadge: 'IMMUTABLE_HASH_ISSUED',
      statusColor: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    specialAction2: {
      label: 'Replay Decision Replay Timeline',
      icon: '⏪',
      description: 'Shows chronological micro-decision trace from prompt to receipt.',
      resultTitle: 'Step-by-Step Decision Trace',
      resultPayload: `[10:14:02.100] Agent dispatched candidate cart (₹465)
[10:14:02.140] MCP Gateway validated signature & permissions (OK)
[10:14:02.185] Intent validator resolved twin-pack semantics (OK)
[10:14:02.210] Authority verified ₹500 budget & 0 allergens (PASS)
[10:14:02.290] Execution confirmed merchant stock (CONFIRMED)
[10:14:02.320] Receipt minted with idempotency key idemp_4f89b`,
      statusBadge: 'TRACE_VERIFIED',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  }
};

const STAGE_ORDER: StageId[] = ['agent', 'gateway', 'intent', 'ask', 'authority', 'execution', 'stop', 'evidence'];

export default function ArchitectureDiagram() {
  const [selectedStage, setSelectedStage] = useState<StageId>('none');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeFlow, setActiveFlow] = useState<FlowMode>('none');
  const [flowStep, setFlowStep] = useState<number>(0);
  
  // Interactive action state
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);
  const [actionSimulating, setActionSimulating] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<{
    title: string;
    payload: string;
    badge: string;
    badgeColor: string;
  } | null>(null);

  // Auto-play walkthrough
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying) {
      timer = setTimeout(() => {
        setSelectedStage(current => {
          const currentIndex = STAGE_ORDER.indexOf(current);
          if (currentIndex === -1 || currentIndex === STAGE_ORDER.length - 1) {
            return STAGE_ORDER[0];
          }
          return STAGE_ORDER[currentIndex + 1];
        });
      }, 2400);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, selectedStage]);

  // Flow simulation player (ACT, ASK, STOP paths)
  useEffect(() => {
    let timer: any;
    if (activeFlow !== 'none') {
      const actSteps: StageId[] = ['agent', 'gateway', 'intent', 'authority', 'execution', 'evidence'];
      const askSteps: StageId[] = ['agent', 'gateway', 'intent', 'ask', 'authority', 'execution', 'evidence'];
      const stopSteps: StageId[] = ['agent', 'gateway', 'intent', 'authority', 'execution', 'stop'];

      const currentPath = activeFlow === 'act' ? actSteps : activeFlow === 'ask' ? askSteps : stopSteps;

      if (flowStep < currentPath.length) {
        setSelectedStage(currentPath[flowStep]);
        timer = setTimeout(() => {
          setFlowStep(prev => prev + 1);
        }, 1600);
      } else {
        // Flow finished
        timer = setTimeout(() => {
          setActiveFlow('none');
          setFlowStep(0);
        }, 2500);
      }
    }
    return () => clearTimeout(timer);
  }, [activeFlow, flowStep]);

  const handleNextStage = () => {
    const currentIndex = STAGE_ORDER.indexOf(selectedStage);
    if (currentIndex === -1 || currentIndex === STAGE_ORDER.length - 1) {
      setSelectedStage(STAGE_ORDER[0]);
    } else {
      setSelectedStage(STAGE_ORDER[currentIndex + 1]);
    }
    setSimulatedResult(null);
    setActiveActionIndex(null);
  };

  const handlePrevStage = () => {
    const currentIndex = STAGE_ORDER.indexOf(selectedStage);
    if (currentIndex <= 0) {
      setSelectedStage(STAGE_ORDER[STAGE_ORDER.length - 1]);
    } else {
      setSelectedStage(STAGE_ORDER[currentIndex - 1]);
    }
    setSimulatedResult(null);
    setActiveActionIndex(null);
  };

  const startFlow = (mode: FlowMode) => {
    setIsAutoPlaying(false);
    setActiveFlow(mode);
    setFlowStep(0);
    setSimulatedResult(null);
    setActiveActionIndex(null);
  };

  const handleExecuteSpecialAction = (actionNum: 1 | 2) => {
    const stage = STAGES_DATA[selectedStage];
    const action = actionNum === 1 ? stage.specialAction1 : stage.specialAction2;
    
    setActiveActionIndex(actionNum);
    setActionSimulating(true);
    setSimulatedResult(null);

    setTimeout(() => {
      setActionSimulating(false);
      setSimulatedResult({
        title: action.resultTitle,
        payload: action.resultPayload,
        badge: action.statusBadge,
        badgeColor: action.statusColor
      });
    }, 450);
  };

  const isHighlighted = (stage: StageId) => {
    if (selectedStage === 'none') return false;
    return selectedStage === stage;
  };

  const activeMeta = STAGES_DATA[selectedStage];

  return (
    <div className="w-full max-w-6xl mx-auto my-8 space-y-6">
      
      {/* ================= FLOW PATH SIMULATORS & INTERACTIVE TOOLBAR ================= */}
      <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-3xl border border-[#E8E2D9] shadow-sm">
        
        {/* Top Header: Path Simulators */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-[#E8E2D9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8382A] flex items-center gap-1.5">
                <Zap size={13} className="text-[#A8382A]" />
                <span>Stage-Wise Interactive Controls</span>
              </span>
              <span className="text-[10px] bg-white text-gray-500 px-2 py-0.5 rounded-full border border-gray-200 font-medium">
                Click any stage or test flow paths
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 m-0">
              Select a stage below to trigger its special interactive actions, or run full simulated pipeline paths.
            </p>
          </div>

          {/* Special Flow Simulation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
              Simulate Path:
            </span>

            {/* ACT Flow Button */}
            <button
              onClick={() => startFlow('act')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                activeFlow === 'act'
                  ? 'bg-[#1C4233] text-white ring-2 ring-[#1C4233]/30 scale-105'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              <CheckCircle2 size={13} className={activeFlow === 'act' ? 'animate-pulse' : ''} />
              <span>▶ Run Safe Flow (ACT)</span>
            </button>

            {/* ASK Flow Button */}
            <button
              onClick={() => startFlow('ask')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                activeFlow === 'ask'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-500/30 scale-105'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              <HelpCircle size={13} className={activeFlow === 'ask' ? 'animate-pulse' : ''} />
              <span>💬 Run Ambiguity Flow (ASK)</span>
            </button>

            {/* STOP Flow Button */}
            <button
              onClick={() => startFlow('stop')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                activeFlow === 'stop'
                  ? 'bg-[#A8382A] text-white ring-2 ring-[#A8382A]/30 scale-105'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
              }`}
            >
              <AlertOctagon size={13} className={activeFlow === 'stop' ? 'animate-pulse' : ''} />
              <span>🛑 Run Violation Flow (STOP)</span>
            </button>

            {/* Walkthrough Controls */}
            <div className="flex items-center gap-1 pl-2 border-l border-gray-300">
              <button
                onClick={() => { setIsAutoPlaying(!isAutoPlaying); setActiveFlow('none'); }}
                className={`p-1.5 text-xs font-medium rounded-lg transition-all ${
                  isAutoPlaying 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
                title={isAutoPlaying ? 'Pause Walkthrough' : 'Auto-Step All Stages'}
              >
                {isAutoPlaying ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
              </button>

              {selectedStage !== 'none' && (
                <button
                  onClick={() => { setSelectedStage('none'); setIsAutoPlaying(false); setActiveFlow('none'); }}
                  className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 text-xs flex items-center gap-1"
                  title="Reset Selection"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Flow Notification Banner */}
        {activeFlow !== 'none' && (
          <div className={`mt-3 p-2.5 rounded-xl text-xs font-medium flex items-center justify-between animate-fade-in ${
            activeFlow === 'act' ? 'bg-emerald-100/80 text-emerald-950 border border-emerald-300' :
            activeFlow === 'ask' ? 'bg-amber-100/80 text-amber-950 border border-amber-300' :
            'bg-rose-100/80 text-rose-950 border border-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md bg-white">
                {activeFlow.toUpperCase()} SIMULATION
              </span>
              <span>
                {activeFlow === 'act' && 'Demonstrating autonomous order approval: all rules satisfied within ₹500 budget.'}
                {activeFlow === 'ask' && 'Demonstrating brand ambiguity: Amul out of stock, routing to user WhatsApp.'}
                {activeFlow === 'stop' && 'Demonstrating hard safety halt: Almond Granola violates tree-nut allergy rule.'}
              </span>
            </div>
            <span className="font-mono text-[11px] opacity-75">
              Highlighting Stage: {selectedStage.toUpperCase()}
            </span>
          </div>
        )}

        {/* ================= STAGE-WISE SPECIAL INTERACTIVE BUTTONS BAR ================= */}
        <div className="mt-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Layers size={11} />
            <span>Select Stage to Test:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            
            <button
              onClick={() => { setSelectedStage('agent'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'agent'
                  ? 'bg-white border-[#1C4233] shadow-md ring-2 ring-[#1C4233]/20 font-bold text-[#1C4233] -translate-y-0.5'
                  : 'bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-[#A8382A]">1 · AGENT</div>
              <div className="font-bold text-xs truncate mt-0.5">External AI</div>
              <div className="text-[9px] text-gray-400 mt-1 flex items-center gap-0.5">
                <Sparkles size={8} /> 2 actions
              </div>
            </button>

            <button
              onClick={() => { setSelectedStage('gateway'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'gateway'
                  ? 'bg-white border-[#1C4233] shadow-md ring-2 ring-[#1C4233]/20 font-bold text-[#1C4233] -translate-y-0.5'
                  : 'bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-[#A8382A]">2 · GATEWAY</div>
              <div className="font-bold text-xs truncate mt-0.5">API / MCP</div>
              <div className="text-[9px] text-gray-400 mt-1 flex items-center gap-0.5">
                <Key size={8} /> 2 actions
              </div>
            </button>

            <button
              onClick={() => { setSelectedStage('intent'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'intent'
                  ? 'bg-[#DFEAE2] border-[#1C4233] shadow-md ring-2 ring-[#1C4233]/20 font-bold text-[#1C4233] -translate-y-0.5'
                  : 'bg-[#DFEAE2]/60 hover:bg-[#DFEAE2] border-[#BDD4C5] text-[#1C4233] hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-[#A8382A]">3 · INTENT</div>
              <div className="font-bold text-xs truncate mt-0.5">Validator</div>
              <div className="text-[9px] text-[#1C4233]/70 mt-1 flex items-center gap-0.5">
                <Scale size={8} /> 2 actions
              </div>
            </button>

            <button
              onClick={() => { setSelectedStage('ask'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'ask'
                  ? 'bg-amber-50 border-amber-600 shadow-md ring-2 ring-amber-500/20 font-bold text-amber-950 -translate-y-0.5'
                  : 'bg-white hover:bg-amber-50/60 border-amber-200 text-amber-900 hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-amber-700">BRANCH · ASK</div>
              <div className="font-bold text-xs truncate mt-0.5">User Confirm</div>
              <div className="text-[9px] text-amber-700/70 mt-1 flex items-center gap-0.5">
                <Smartphone size={8} /> WhatsApp
              </div>
            </button>

            <button
              onClick={() => { setSelectedStage('authority'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'authority'
                  ? 'bg-[#DFEAE2] border-[#1C4233] shadow-md ring-2 ring-[#1C4233]/20 font-bold text-[#1C4233] -translate-y-0.5'
                  : 'bg-[#DFEAE2]/60 hover:bg-[#DFEAE2] border-[#BDD4C5] text-[#1C4233] hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-[#A8382A]">4 · AUTHORITY</div>
              <div className="font-bold text-xs truncate mt-0.5">Policy Rules</div>
              <div className="text-[9px] text-[#1C4233]/70 mt-1 flex items-center gap-0.5">
                <ShieldCheck size={8} /> 2 actions
              </div>
            </button>

            <button
              onClick={() => { setSelectedStage('execution'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'execution'
                  ? 'bg-white border-[#1C4233] shadow-md ring-2 ring-[#1C4233]/20 font-bold text-[#1C4233] -translate-y-0.5'
                  : 'bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-[#A8382A]">5 · EXECUTION</div>
              <div className="font-bold text-xs truncate mt-0.5">Catalog Match</div>
              <div className="text-[9px] text-gray-400 mt-1 flex items-center gap-0.5">
                <Activity size={8} /> 2 actions
              </div>
            </button>

            <button
              onClick={() => { setSelectedStage('stop'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'stop'
                  ? 'bg-red-50 border-red-700 shadow-md ring-2 ring-red-600/20 font-bold text-red-950 -translate-y-0.5'
                  : 'bg-red-50/50 hover:bg-red-50 border-red-200 text-red-900 hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-red-700">BRANCH · STOP</div>
              <div className="font-bold text-xs truncate mt-0.5">Safety Halt</div>
              <div className="text-[9px] text-red-700/70 mt-1 flex items-center gap-0.5">
                <Ban size={8} /> Circuit-breaker
              </div>
            </button>

            <button
              onClick={() => { setSelectedStage('evidence'); setIsAutoPlaying(false); setActiveFlow('none'); }}
              className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                selectedStage === 'evidence'
                  ? 'bg-white border-[#1C4233] shadow-md ring-2 ring-[#1C4233]/20 font-bold text-[#1C4233] -translate-y-0.5'
                  : 'bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:shadow-2xs'
              }`}
            >
              <div className="text-[9px] font-bold text-[#A8382A]">6 · EVIDENCE</div>
              <div className="font-bold text-xs truncate mt-0.5">Audit Receipt</div>
              <div className="text-[9px] text-gray-400 mt-1 flex items-center gap-0.5">
                <Receipt size={8} /> Cryptographic
              </div>
            </button>

          </div>
        </div>

      </div>

      {/* ================= THE EXACT 1:1 SLIDE ARCHITECTURE DIAGRAM (SVG) ================= */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden p-4 sm:p-6 lg:p-8 relative">
        
        {/* Subtle SVG Highlight overlay info */}
        {selectedStage !== 'none' && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-gray-200 text-xs shadow-2xs hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-medium text-gray-700">
              Active Focus: <strong className="text-[#1C4233]">{activeMeta.name}</strong>
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 1160 620"
          className="w-full h-auto block select-none"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          <defs>
            {/* Arrowhead marker - dark grey */}
            <marker
              id="arrow-grey"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2B3630" />
            </marker>

            {/* Arrowhead marker - red/terracotta for ASK and STOP */}
            <marker
              id="arrow-red"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#A8382A" />
            </marker>

            {/* Arrowhead marker - dark green for updated request */}
            <marker
              id="arrow-green"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1C4233" />
            </marker>
          </defs>

          {/* ===================== HEADER ===================== */}
          <text
            x="50"
            y="42"
            fontSize="11"
            fontWeight="700"
            fill="#A8382A"
            letterSpacing="0.14em"
          >
            SYSTEM ARCHITECTURE
          </text>

          <text
            x="50"
            y="82"
            fontSize="33"
            fontWeight="700"
            fill="#1C4233"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            How an agent request becomes a safe order
          </text>

          <text
            x="50"
            y="112"
            fontSize="10.5"
            fontWeight="700"
            fill="#A8382A"
            letterSpacing="0.08em"
          >
            PROPOSED DESIGN · NO EXISTING INSTACART SYSTEMS OR ENDPOINTS ARE ASSUMED
          </text>

          {/* ===================== ROW 1: 6 PIPELINE BOXES ===================== */}

          {/* Box 1: 1 · AGENT */}
          <g 
            id="box-1" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('agent'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="50"
              y="145"
              width="154"
              height="112"
              fill={isHighlighted('agent') ? '#F4F9F5' : '#FFFFFF'}
              stroke={isHighlighted('agent') ? '#1C4233' : '#DCD7CE'}
              strokeWidth={isHighlighted('agent') ? '3.5' : '1.2'}
              filter={isHighlighted('agent') ? 'drop-shadow(0 6px 12px rgba(28,66,51,0.2))' : 'none'}
            />
            <text x="64" y="166" fontSize="10" fontWeight="700" fill="#A8382A" letterSpacing="0.04em">
              1 · AGENT
            </text>
            <text x="64" y="186" fontSize="12.5" fontWeight="700" fill="#1C4233">
              User's external AI
            </text>
            <text x="64" y="202" fontSize="12.5" fontWeight="700" fill="#1C4233">
              agent
            </text>
            <text x="64" y="235" fontSize="10.5" fill="#4B5563">
              Sends a structured
            </text>
            <text x="64" y="248" fontSize="10.5" fill="#4B5563">
              request
            </text>
            {isHighlighted('agent') && (
              <circle cx="190" cy="162" r="5" fill="#1C4233" />
            )}
          </g>

          {/* Arrow 1 -> 2 */}
          <line
            x1="204"
            y1="201"
            x2="228"
            y2="201"
            stroke="#2B3630"
            strokeWidth="1.4"
            markerEnd="url(#arrow-grey)"
          />

          {/* Box 2: 2 · GATEWAY */}
          <g 
            id="box-2" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('gateway'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="230"
              y="145"
              width="154"
              height="112"
              fill={isHighlighted('gateway') ? '#F4F9F5' : '#FFFFFF'}
              stroke={isHighlighted('gateway') ? '#1C4233' : '#DCD7CE'}
              strokeWidth={isHighlighted('gateway') ? '3.5' : '1.2'}
              filter={isHighlighted('gateway') ? 'drop-shadow(0 6px 12px rgba(28,66,51,0.2))' : 'none'}
            />
            <text x="244" y="166" fontSize="10" fontWeight="700" fill="#A8382A" letterSpacing="0.04em">
              2 · GATEWAY
            </text>
            <text x="244" y="186" fontSize="12.5" fontWeight="700" fill="#1C4233">
              API / MCP gateway
            </text>
            <text x="244" y="235" fontSize="10.5" fill="#4B5563">
              Access, permissions,
            </text>
            <text x="244" y="248" fontSize="10.5" fill="#4B5563">
              format
            </text>
            {isHighlighted('gateway') && (
              <circle cx="370" cy="162" r="5" fill="#1C4233" />
            )}
          </g>

          {/* Arrow 2 -> 3 */}
          <line
            x1="384"
            y1="201"
            x2="408"
            y2="201"
            stroke="#2B3630"
            strokeWidth="1.4"
            markerEnd="url(#arrow-grey)"
          />

          {/* Box 3: 3 · INTENT (Sage Green) */}
          <g 
            id="box-3" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('intent'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="410"
              y="145"
              width="154"
              height="112"
              fill="#DFEAE2"
              stroke={isHighlighted('intent') ? '#1C4233' : '#BDD4C5'}
              strokeWidth={isHighlighted('intent') ? '3.5' : '1.2'}
              filter={isHighlighted('intent') ? 'drop-shadow(0 6px 12px rgba(28,66,51,0.2))' : 'none'}
            />
            <text x="424" y="166" fontSize="10" fontWeight="700" fill="#A8382A" letterSpacing="0.04em">
              3 · INTENT
            </text>
            <text x="424" y="186" fontSize="12.5" fontWeight="700" fill="#1C4233">
              Intent and
            </text>
            <text x="424" y="202" fontSize="12.5" fontWeight="700" fill="#1C4233">
              quantity validator
            </text>
            <text x="424" y="235" fontSize="10.5" fill="#3A4D43">
              Variants, units, pack
            </text>
            <text x="424" y="248" fontSize="10.5" fill="#3A4D43">
              sizes
            </text>
            {isHighlighted('intent') && (
              <circle cx="550" cy="162" r="5" fill="#1C4233" />
            )}
          </g>

          {/* Arrow 3 -> 4 */}
          <line
            x1="564"
            y1="201"
            x2="588"
            y2="201"
            stroke="#2B3630"
            strokeWidth="1.4"
            markerEnd="url(#arrow-grey)"
          />

          {/* Box 4: 4 · AUTHORITY (Sage Green) */}
          <g 
            id="box-4" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('authority'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="590"
              y="145"
              width="154"
              height="112"
              fill="#DFEAE2"
              stroke={isHighlighted('authority') ? '#1C4233' : '#BDD4C5'}
              strokeWidth={isHighlighted('authority') ? '3.5' : '1.2'}
              filter={isHighlighted('authority') ? 'drop-shadow(0 6px 12px rgba(28,66,51,0.2))' : 'none'}
            />
            <text x="604" y="166" fontSize="10" fontWeight="700" fill="#A8382A" letterSpacing="0.04em">
              4 · AUTHORITY
            </text>
            <text x="604" y="186" fontSize="12.5" fontWeight="700" fill="#1C4233">
              Preference and
            </text>
            <text x="604" y="202" fontSize="12.5" fontWeight="700" fill="#1C4233">
              policy
            </text>
            <text x="604" y="235" fontSize="10.5" fill="#3A4D43">
              Limits, rules, hard
            </text>
            <text x="604" y="248" fontSize="10.5" fill="#3A4D43">
              constraints
            </text>
            {isHighlighted('authority') && (
              <circle cx="730" cy="162" r="5" fill="#1C4233" />
            )}
          </g>

          {/* Arrow 4 -> 5 */}
          <line
            x1="744"
            y1="201"
            x2="768"
            y2="201"
            stroke="#2B3630"
            strokeWidth="1.4"
            markerEnd="url(#arrow-grey)"
          />

          {/* Box 5: 5 · EXECUTION */}
          <g 
            id="box-5" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('execution'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="770"
              y="145"
              width="154"
              height="112"
              fill={isHighlighted('execution') ? '#F4F9F5' : '#FFFFFF'}
              stroke={isHighlighted('execution') ? '#1C4233' : '#DCD7CE'}
              strokeWidth={isHighlighted('execution') ? '3.5' : '1.2'}
              filter={isHighlighted('execution') ? 'drop-shadow(0 6px 12px rgba(28,66,51,0.2))' : 'none'}
            />
            <text x="784" y="166" fontSize="10" fontWeight="700" fill="#A8382A" letterSpacing="0.04em">
              5 · EXECUTION
            </text>
            <text x="784" y="186" fontSize="12.5" fontWeight="700" fill="#1C4233">
              Catalog and
            </text>
            <text x="784" y="202" fontSize="12.5" fontWeight="700" fill="#1C4233">
              execution
            </text>
            <text x="784" y="235" fontSize="10.5" fill="#4B5563">
              Availability, price,
            </text>
            <text x="784" y="248" fontSize="10.5" fill="#4B5563">
              order
            </text>
            {isHighlighted('execution') && (
              <circle cx="910" cy="162" r="5" fill="#1C4233" />
            )}
          </g>

          {/* Arrow 5 -> 6 */}
          <line
            x1="924"
            y1="201"
            x2="948"
            y2="201"
            stroke="#2B3630"
            strokeWidth="1.4"
            markerEnd="url(#arrow-grey)"
          />

          {/* Box 6: 6 · EVIDENCE */}
          <g 
            id="box-6" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('evidence'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="950"
              y="145"
              width="154"
              height="112"
              fill={isHighlighted('evidence') ? '#F4F9F5' : '#FFFFFF'}
              stroke={isHighlighted('evidence') ? '#1C4233' : '#DCD7CE'}
              strokeWidth={isHighlighted('evidence') ? '3.5' : '1.2'}
              filter={isHighlighted('evidence') ? 'drop-shadow(0 6px 12px rgba(28,66,51,0.2))' : 'none'}
            />
            <text x="964" y="166" fontSize="10" fontWeight="700" fill="#A8382A" letterSpacing="0.04em">
              6 · EVIDENCE
            </text>
            <text x="964" y="186" fontSize="12.5" fontWeight="700" fill="#1C4233">
              Receipt and audit
            </text>
            <text x="964" y="202" fontSize="12.5" fontWeight="700" fill="#1C4233">
              log
            </text>
            <text x="964" y="235" fontSize="10.5" fill="#4B5563">
              Asked, happened, why,
            </text>
            <text x="964" y="248" fontSize="10.5" fill="#4B5563">
              recovery
            </text>
            {isHighlighted('evidence') && (
              <circle cx="1090" cy="162" r="5" fill="#1C4233" />
            )}
          </g>

          {/* ===================== ROW 2: BRANCHING & FEEDBACK ===================== */}

          {/* 1. Downward Arrow: Box 3 (INTENT) -> User Confirms (ASK) */}
          <line
            x1="450"
            y1="257"
            x2="450"
            y2="307"
            stroke="#A8382A"
            strokeWidth={isHighlighted('ask') ? '3' : '1.4'}
            markerEnd="url(#arrow-red)"
          />
          <text x="458" y="287" fontSize="11" fontWeight="700" fill="#A8382A">
            ASK
          </text>

          {/* User confirms box (Dark Green Border) */}
          <g 
            id="box-user-confirms" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('ask'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="295"
              y="310"
              width="275"
              height="90"
              fill={isHighlighted('ask') ? '#FFFDF5' : '#FFFFFF'}
              stroke={isHighlighted('ask') ? '#A8382A' : '#1C4233'}
              strokeWidth={isHighlighted('ask') ? '3.5' : '2'}
              filter={isHighlighted('ask') ? 'drop-shadow(0 6px 12px rgba(168,56,42,0.25))' : 'none'}
            />
            <text x="312" y="342" fontSize="15" fontWeight="700" fill="#1C4233">
              User confirms
            </text>
            <text x="312" y="370" fontSize="11.5" fill="#555555">
              Proposed: WhatsApp or in-app
            </text>
            {isHighlighted('ask') && (
              <circle cx="555" cy="325" r="5" fill="#A8382A" />
            )}
          </g>

          {/* 2. Feedback loop: User confirms -> Box 1 (updated request) */}
          <polyline
            points="295,355 127,355 127,260"
            fill="none"
            stroke="#1C4233"
            strokeWidth={isHighlighted('ask') ? '2.5' : '1.4'}
            markerEnd="url(#arrow-green)"
          />
          <text x="135" y="310" fontSize="11" fontWeight="700" fill="#1C4233">
            updated request
          </text>

          {/* 3. Arrow: User confirms -> User preference store (save) */}
          <line
            x1="570"
            y1="355"
            x2="618"
            y2="355"
            stroke="#2B3630"
            strokeWidth="1.4"
            markerEnd="url(#arrow-grey)"
          />
          <text x="575" y="347" fontSize="11" fontWeight="600" fill="#2B3630">
            save
          </text>

          {/* User preference store box (Sage Green) */}
          <g 
            id="box-pref-store" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('ask'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="620"
              y="310"
              width="168"
              height="90"
              fill="#DFEAE2"
              stroke={isHighlighted('ask') ? '#1C4233' : '#BDD4C5'}
              strokeWidth={isHighlighted('ask') ? '3' : '1.2'}
            />
            <text x="632" y="340" fontSize="13.5" fontWeight="700" fill="#1C4233">
              User preference
            </text>
            <text x="632" y="356" fontSize="13.5" fontWeight="700" fill="#1C4233">
              store
            </text>
            <text x="632" y="380" fontSize="11" fill="#4B5563">
              Private to the user
            </text>
          </g>

          {/* 4. Upward Arrow: User preference store -> Box 4 (reads) */}
          <line
            x1="680"
            y1="310"
            x2="680"
            y2="260"
            stroke="#2B3630"
            strokeWidth="1.4"
            markerEnd="url(#arrow-grey)"
          />
          <text x="688" y="287" fontSize="11" fontWeight="600" fill="#2B3630">
            reads
          </text>

          {/* 5. Downward Arrow: Box 5 (EXECUTION) -> STOP */}
          <line
            x1="855"
            y1="257"
            x2="855"
            y2="307"
            stroke="#A8382A"
            strokeWidth={isHighlighted('stop') ? '3' : '1.4'}
            markerEnd="url(#arrow-red)"
          />
          <text x="864" y="287" fontSize="11" fontWeight="700" fill="#A8382A">
            STOP
          </text>

          {/* STOP box (Light Pink / Coral with dark red border) */}
          <g 
            id="box-stop" 
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => { setSelectedStage('stop'); setIsAutoPlaying(false); setActiveFlow('none'); }}
          >
            <rect
              x="815"
              y="310"
              width="250"
              height="90"
              fill="#F6E7E4"
              stroke={isHighlighted('stop') ? '#7F1D1D' : '#A8382A'}
              strokeWidth={isHighlighted('stop') ? '3.5' : '1.5'}
              filter={isHighlighted('stop') ? 'drop-shadow(0 6px 12px rgba(168,56,42,0.3))' : 'none'}
            />
            <text x="830" y="342" fontSize="15" fontWeight="700" fill="#A8382A">
              STOP
            </text>
            <text x="830" y="367" fontSize="11" fill="#555555">
              Hard rule broken or action cannot be
            </text>
            <text x="830" y="382" fontSize="11" fill="#555555">
              verified: that action halts
            </text>
            {isHighlighted('stop') && (
              <circle cx="1045" cy="325" r="5" fill="#7F1D1D" />
            )}
          </g>

          {/* ===================== LOGGING & MONITORING BAR ===================== */}
          <rect
            x="50"
            y="435"
            width="1054"
            height="38"
            fill="#ECE7DE"
          />
          <text
            x="577"
            y="459"
            fontSize="12.5"
            fontWeight="600"
            fill="#1C4233"
            textAnchor="middle"
          >
            Logging and monitoring across every step: request ID, decision, reason
          </text>

          {/* ===================== SUMMARY STATEMENT ===================== */}
          <text x="50" y="522" fontSize="13.5" fill="#2B3630">
            <tspan fontWeight="700" fill="#1C4233">ACT</tspan>
            <tspan fill="#2B3630"> when intent is clear and inside the mandate. </tspan>
            <tspan fontWeight="700" fill="#A8382A">ASK</tspan>
            <tspan fill="#2B3630"> when the user can resolve it. </tspan>
            <tspan fontWeight="700" fill="#A8382A">STOP</tspan>
            <tspan fill="#2B3630"> when a hard rule fails or the result cannot be verified.</tspan>
          </text>

          {/* ===================== FOOTER ===================== */}
          <line
            x1="50"
            y1="575"
            x2="1104"
            y2="575"
            stroke="#DCD7CE"
            strokeWidth="1"
          />

          <text x="50" y="598" fontSize="10" fill="#78716C">
            Instacart, Ready to Act · Agent-readiness case study
          </text>

          <text x="1104" y="598" fontSize="10" fill="#78716C" textAnchor="end">
            3
          </text>
        </svg>
      </div>

      {/* ================= STAGE INSPECTOR DEEP-DIVE & SPECIAL ACTION RUNNER ================= */}
      {selectedStage !== 'none' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-md animate-fade-in text-gray-900">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-gray-100 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeMeta.badgeColor}`}>
                  {activeMeta.badge}
                </span>
                {activeMeta.number && (
                  <span className="text-[11px] font-mono text-gray-400">
                    Pipeline Stage {activeMeta.number} of 6
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">
                {activeMeta.name}
              </h3>
              <p className="text-xs text-gray-500 m-0 mt-0.5">{activeMeta.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedStage('none')}
                className="text-xs text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium"
              >
                Close Inspector ✕
              </button>
            </div>
          </div>

          {/* STAGE-WISE SPECIAL INTERACTIVE SIMULATION BUTTONS */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#A8382A] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Stage-Specific Interactive Actions</span>
              </span>
              <span className="text-[10px] text-gray-500">
                Click a button to test live inputs, outputs, and safety verdicts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Special Action 1 */}
              <button
                onClick={() => handleExecuteSpecialAction(1)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  activeActionIndex === 1
                    ? 'bg-white border-[#1C4233] ring-2 ring-[#1C4233]/20 shadow-xs'
                    : 'bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{activeMeta.specialAction1.icon}</span>
                  <span className="font-bold text-xs text-gray-900">
                    {activeMeta.specialAction1.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 m-0 leading-snug">
                  {activeMeta.specialAction1.description}
                </p>
                <div className="mt-2 text-[10px] text-[#1C4233] font-bold flex items-center gap-1">
                  <span>Run Live Test</span>
                  <ArrowRight size={10} />
                </div>
              </button>

              {/* Special Action 2 */}
              <button
                onClick={() => handleExecuteSpecialAction(2)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  activeActionIndex === 2
                    ? 'bg-white border-[#1C4233] ring-2 ring-[#1C4233]/20 shadow-xs'
                    : 'bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{activeMeta.specialAction2.icon}</span>
                  <span className="font-bold text-xs text-gray-900">
                    {activeMeta.specialAction2.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 m-0 leading-snug">
                  {activeMeta.specialAction2.description}
                </p>
                <div className="mt-2 text-[10px] text-[#A8382A] font-bold flex items-center gap-1">
                  <span>Run Live Test</span>
                  <ArrowRight size={10} />
                </div>
              </button>
            </div>

            {/* Special Action Live Simulation Output Box */}
            {(actionSimulating || simulatedResult) && (
              <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200 animate-fade-in shadow-2xs">
                {actionSimulating ? (
                  <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Executing stage verification harness...</span>
                  </div>
                ) : simulatedResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>{simulatedResult.title}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${simulatedResult.badgeColor}`}>
                        {simulatedResult.badge}
                      </span>
                    </div>
                    <pre className="text-[11px] font-mono bg-gray-50 text-gray-800 p-3 rounded-lg overflow-x-auto border border-gray-100 m-0 leading-relaxed whitespace-pre-wrap">
                      {simulatedResult.payload}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deep Dive Metadata Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left Column: Responsibilities & Inputs/Outputs */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Architectural Role
                </span>
                <p className="text-sm font-semibold text-gray-900 leading-snug m-0">
                  {activeMeta.role}
                </p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed m-0">
                  {activeMeta.summary}
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-0.5">
                    Data Input
                  </span>
                  <div className="text-xs text-blue-950 font-mono leading-snug">
                    {activeMeta.input}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-green-50/40 border border-green-100/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-900 block mb-0.5">
                    Verified Output
                  </span>
                  <div className="text-xs text-green-950 font-mono leading-snug">
                    {activeMeta.output}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Prototype Manifestation & Core Thesis */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8382A] flex items-center gap-1 mb-1.5">
                  <Sparkles size={12} />
                  <span>Live Prototype Demonstration</span>
                </span>
                <p className="text-xs text-gray-700 leading-relaxed m-0">
                  {activeMeta.prototypeExample}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900 text-white space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Product Thesis Mandate</span>
                </span>
                <p className="text-xs text-gray-200 leading-relaxed m-0 italic">
                  "{activeMeta.thesisAlignment}"
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handlePrevStage}
                  className="btn btn-outline text-xs py-1.5 px-3 rounded-xl border-gray-200 text-gray-600 flex items-center gap-1"
                >
                  <ChevronLeft size={13} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextStage}
                  className="btn btn-primary text-xs py-1.5 px-4 rounded-xl font-bold flex items-center gap-1"
                >
                  <span>Next Stage</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
