# Agent Readiness Lab

**Agent Readiness Lab** is an interactive product prototype designed for the Instacart Agent-Readiness Case Study. It demonstrates the product thesis that AI agents should be able to complete grocery-shopping tasks on behalf of users, provided their authority is explicit, bounded, enforceable, and verifiable.

This is a **concept prototype**. All products, prices, transactions, and outcomes are simulated locally. No real APIs, purchases, or LLMs are used.

## What it demonstrates

1. **Permission boundaries**: Agents operate strictly within user mandates (budgets, dietary constraints, order limits).
2. **Deterministic substitution**: Rules (e.g., price increase limits, package size requirements) are evaluated without relying on opaque LLM text generation.
3. **Transaction verification**: An uncertain checkout (timeout) is safely managed by checking the idempotency key rather than blindly retrying.
4. **Transparent decisions**: Every agent decision is logged and explicitly explained.

## Reviewer Quick Start

1. **Open the app.**
2. **Run the guided walkthrough** to see how the agent navigates constraints.
3. **Open the simulator** (Workspace).
4. **Change the substitution price cap** in the Mandate editor and try to substitute Milk.
5. **Try a dietary-prohibition scenario**: Notice how peanut constraints block certain breads.
6. **Expire the mandate** (set Mandate Validity to Expired) and attempt checkout.
7. **Simulate a checkout timeout**: Ensure the budget is exactly ₹3,000 and run checkout, or use the deterministic scenarios tab.
8. **Run all scenario tests** in the "Scenario Tests" tab to verify the policy engine.

## Installation and Running Locally

Prerequisites: Node.js (v18+) and npm.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the provided local URL in your browser (usually `http://localhost:5173`).

## Building for Production

To create a static production build:

```bash
npm run build
```
The optimized files will be output to the `dist/` directory, ready to be hosted on Vercel, Netlify, or any static file host.

## Architecture

- **`src/decisionEngine.ts`**: The core, pure-TypeScript logic for evaluating rules deterministically. (No React or UI code).
- **`src/mockData.ts`**: The simulated product catalog and default mandate.
- **`src/context/ShoppingContext.tsx`**: State management for the basket, mandate, and event logs.
- **`src/components/`**: UI modules including `MandateEditor`, `Basket`, `DecisionInspector`, `Scenarios`, `Walkthrough`, and `Intro`.

## Known Limitations
- The simulated network timeout triggers deterministically if the budget is exactly 3000 during manual checkout simulation, or via the scenario runner.
- Product catalog is small and hardcoded.
- "Verify Success" and "Verify Failure" buttons after a timeout are manual overrides to demonstrate the UI states of verification.

*(Not an official Instacart application)*
