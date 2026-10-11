export default function ArchitectureDiagram() {
  return (
    <div className="w-full max-w-6xl mx-auto my-8 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden p-3 sm:p-6 lg:p-8">
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
        <g id="box-1">
          <rect
            x="50"
            y="145"
            width="154"
            height="112"
            fill="#FFFFFF"
            stroke="#DCD7CE"
            strokeWidth="1.2"
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
        <g id="box-2">
          <rect
            x="230"
            y="145"
            width="154"
            height="112"
            fill="#FFFFFF"
            stroke="#DCD7CE"
            strokeWidth="1.2"
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
        <g id="box-3">
          <rect
            x="410"
            y="145"
            width="154"
            height="112"
            fill="#DFEAE2"
            stroke="#BDD4C5"
            strokeWidth="1.2"
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
        <g id="box-4">
          <rect
            x="590"
            y="145"
            width="154"
            height="112"
            fill="#DFEAE2"
            stroke="#BDD4C5"
            strokeWidth="1.2"
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
        <g id="box-5">
          <rect
            x="770"
            y="145"
            width="154"
            height="112"
            fill="#FFFFFF"
            stroke="#DCD7CE"
            strokeWidth="1.2"
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
        <g id="box-6">
          <rect
            x="950"
            y="145"
            width="154"
            height="112"
            fill="#FFFFFF"
            stroke="#DCD7CE"
            strokeWidth="1.2"
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
        </g>

        {/* ===================== ROW 2: BRANCHING & FEEDBACK ===================== */}

        {/* 1. Downward Arrow: Box 3 (INTENT) -> User Confirms (ASK) */}
        <line
          x1="450"
          y1="257"
          x2="450"
          y2="307"
          stroke="#A8382A"
          strokeWidth="1.4"
          markerEnd="url(#arrow-red)"
        />
        <text x="458" y="287" fontSize="11" fontWeight="700" fill="#A8382A">
          ASK
        </text>

        {/* User confirms box (Dark Green Border) */}
        <g id="box-user-confirms">
          <rect
            x="295"
            y="310"
            width="275"
            height="90"
            fill="#FFFFFF"
            stroke="#1C4233"
            strokeWidth="2"
          />
          <text x="312" y="342" fontSize="15" fontWeight="700" fill="#1C4233">
            User confirms
          </text>
          <text x="312" y="370" fontSize="11.5" fill="#555555">
            Proposed: WhatsApp or in-app
          </text>
        </g>

        {/* 2. Feedback loop: User confirms -> Box 1 (updated request) */}
        {/* Right-angled line: starts at left edge of User Confirms, goes left, then up to bottom of Box 1 */}
        <polyline
          points="295,355 127,355 127,260"
          fill="none"
          stroke="#1C4233"
          strokeWidth="1.4"
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
        <g id="box-pref-store">
          <rect
            x="620"
            y="310"
            width="168"
            height="90"
            fill="#DFEAE2"
            stroke="#BDD4C5"
            strokeWidth="1.2"
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
          strokeWidth="1.4"
          markerEnd="url(#arrow-red)"
        />
        <text x="864" y="287" fontSize="11" fontWeight="700" fill="#A8382A">
          STOP
        </text>

        {/* STOP box (Light Pink / Coral with dark red border) */}
        <g id="box-stop">
          <rect
            x="815"
            y="310"
            width="250"
            height="90"
            fill="#F6E7E4"
            stroke="#A8382A"
            strokeWidth="1.5"
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
  );
}
