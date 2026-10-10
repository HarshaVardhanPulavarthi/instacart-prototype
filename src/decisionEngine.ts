export type DecisionResult = "ACT" | "ASK" | "STOP" | "PENDING_VERIFICATION";

export interface Mandate {
  budget: number;
  substitutionsAllowed: boolean;
  maxAbsolutePriceIncrease: number;
  maxPercentagePriceIncrease: number;
  requireSamePackageSize: boolean;
  requireCategoryEquivalence: boolean;
  dietaryRestrictions: string[]; // Hard constraints
  permissionValid: boolean;
  orderAllowance: number;
  ordersUsed: number;
  preferredBrands: string[];
  doubtResolutionChannel?: 'whatsapp' | 'in-app' | 'auto-reject';
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  size: string;
  category: string;
  ingredients: string[];
  imageUrl: string;
  isAmbiguousSize?: boolean;
  // Explicit unit semantics fields for demo
  unit?: string;
  unitsPerPack?: number;
  totalBaseUnits?: number;
}

export interface BasketItem {
  id: string;
  product: Product;
  quantity: number;
  isUnavailable: boolean;
  replacement?: Product;
  status: 'pending' | 'act' | 'ask' | 'stop' | 'approved' | 'rejected';
  decisionLog?: DecisionLog;
}

export interface RuleCheck {
  name: string;
  passed: boolean | "NA" | "AMBIGUOUS";
  details: string;
}

export interface DecisionLog {
  action: string;
  decision: DecisionResult;
  checks: RuleCheck[];
  reason: string;
  requiredAction?: string;
  timestamp: number;
  originalPrice?: number;
  newPrice?: number;
}

export function evaluateSubstitution(
  mandate: Mandate,
  original: Product,
  candidate: Product
): DecisionLog {
  const checks: RuleCheck[] = [];
  let isBlocked = false;
  let isAsk = false;

  // 1. Mandate Permission (Hard Constraint)
  if (!mandate.permissionValid) {
    checks.push({
      name: "Agent Permission",
      passed: false,
      details: "Agent authority has been revoked.",
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Agent Permission",
      passed: true,
      details: "Agent is authorized to act.",
    });
  }

  // 2. Dietary Restrictions (Hard Constraint)
  const violatedRestrictions = mandate.dietaryRestrictions.filter((restriction) =>
    candidate.ingredients.map(i => i.toLowerCase()).includes(restriction.toLowerCase())
  );
  
  if (violatedRestrictions.length > 0) {
    checks.push({
      name: "Dietary Restrictions",
      passed: false,
      details: `Violates hard constraint: contains ${violatedRestrictions.join(", ")}`,
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Dietary Restrictions",
      passed: true,
      details: "No hard constraints violated.",
    });
  }

  // 3. Substitutions Allowed
  if (!mandate.substitutionsAllowed) {
    checks.push({
      name: "Substitutions Allowed",
      passed: false,
      details: "Substitutions are currently disabled in the Decision Budget.",
    });
    isAsk = true;
  } else {
    checks.push({
      name: "Substitutions Allowed",
      passed: true,
      details: "Substitutions are enabled.",
    });
  }

  // 4. Package Size & Explicit Units
  if (mandate.requireSamePackageSize) {
    if (candidate.isAmbiguousSize || original.isAmbiguousSize) {
      checks.push({
        name: "Package Semantics",
        passed: "AMBIGUOUS",
        details: "Package size semantics are ambiguous or unknown.",
      });
      isAsk = true;
    } else if (
      (original.totalBaseUnits && candidate.totalBaseUnits && original.totalBaseUnits !== candidate.totalBaseUnits) ||
      (!original.totalBaseUnits && original.size !== candidate.size)
    ) {
      checks.push({
        name: "Package Size Equivalence",
        passed: false,
        details: `Size mismatch: requested ${original.size}, found ${candidate.size}.`,
      });
      if(!isBlocked) isAsk = true;
    } else {
      checks.push({
        name: "Package Size Equivalence",
        passed: true,
        details: "Explicit unit semantics match.",
      });
    }
  }

  // 5. Category Equivalence
  if (mandate.requireCategoryEquivalence) {
    if (original.category !== candidate.category) {
      checks.push({
        name: "Category Equivalence",
        passed: false,
        details: `Category mismatch: requested ${original.category}, found ${candidate.category}.`,
      });
      if(!isBlocked) isAsk = true;
    } else {
      checks.push({
        name: "Category Equivalence",
        passed: true,
        details: "Categories are equivalent.",
      });
    }
  }

  // 6. Absolute Price Increase
  const priceDiff = candidate.price - original.price;
  if (priceDiff > mandate.maxAbsolutePriceIncrease) {
    checks.push({
      name: "Absolute Price Limit",
      passed: false,
      details: `Increase of ₹${priceDiff.toFixed(2)} exceeds ₹${mandate.maxAbsolutePriceIncrease.toFixed(2)} limit.`,
    });
    if(!isBlocked) isAsk = true;
  } else {
    checks.push({
      name: "Absolute Price Limit",
      passed: true,
      details: `Within absolute price limit (increase ≤ ₹${mandate.maxAbsolutePriceIncrease}).`,
    });
  }

  // 7. Percentage Price Increase
  if (original.price > 0) {
    const pctDiff = (priceDiff / original.price) * 100;
    if (pctDiff > mandate.maxPercentagePriceIncrease) {
      checks.push({
        name: "Percentage Price Limit",
        passed: false,
        details: `Increase of ${pctDiff.toFixed(1)}% exceeds ${mandate.maxPercentagePriceIncrease}% limit.`,
      });
      if(!isBlocked) isAsk = true;
    } else {
      checks.push({
        name: "Percentage Price Limit",
        passed: true,
        details: `Within percentage limit (increase ≤ ${mandate.maxPercentagePriceIncrease}%).`,
      });
    }
  }

  // 8. Brand Preference
  if (candidate.brand && mandate.preferredBrands.length > 0) {
    if (!mandate.preferredBrands.includes(candidate.brand)) {
       checks.push({
         name: "Brand Preference",
         passed: false,
         details: `Brand '${candidate.brand}' is not in preferred list.`,
       });
       // Just a warning, maybe ask
       if(!isBlocked) isAsk = true;
    } else {
       checks.push({
         name: "Brand Preference",
         passed: true,
         details: `Brand '${candidate.brand}' is preferred.`,
       });
    }
  }

  let decision: DecisionResult;
  let reason: string;
  let requiredAction: string | undefined;

  let finalAction = `Substitute ${original.name} with ${candidate.name}`;
  const channelText = mandate.doubtResolutionChannel === 'whatsapp' ? 'via WhatsApp' : mandate.doubtResolutionChannel === 'in-app' ? 'via In-App Notification' : 'and auto-rejected';
  
  if (isBlocked) {
    decision = "STOP";
    reason = "A hard constraint or revoked permission blocked this action.";
    requiredAction = "The item is blocked and will not be added to the order.";
    finalAction = `Halted execution ${channelText}: Blocked substitution of ${original.name}`;
  } else if (isAsk) {
    decision = "ASK";
    reason = "An ambiguity or rule violation requires your approval.";
    requiredAction = "Approve or reject this substitution.";
    finalAction = `Paused execution ${channelText}: Seeking approval for ${candidate.name}`;
  } else {
    decision = "ACT";
    reason = "All Decision Budget checks passed. Agent can act autonomously.";
  }

  return {
    action: finalAction,
    decision,
    checks,
    reason,
    requiredAction,
    timestamp: Date.now(),
    originalPrice: original.price,
    newPrice: candidate.price
  };
}

export function evaluateCheckout(
  mandate: Mandate,
  basket: BasketItem[],
  basketTotal: number
): DecisionLog {
  const checks: RuleCheck[] = [];
  let isBlocked = false;
  let isAsk = false;

  // 1. Permission Valid
  if (!mandate.permissionValid) {
    checks.push({
      name: "Agent Authority",
      passed: false,
      details: "Permission has been explicitly revoked.",
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Agent Authority",
      passed: true,
      details: "Agent has active permission.",
    });
  }

  // 2. Budget
  if (basketTotal > mandate.budget) {
    checks.push({
      name: "Spending Cap",
      passed: false,
      details: `Total ₹${basketTotal.toFixed(2)} exceeds budget of ₹${mandate.budget.toFixed(2)}.`,
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Spending Cap",
      passed: true,
      details: `Total ₹${basketTotal.toFixed(2)} is safely within budget.`,
    });
  }

  // 3. Order Allowance
  if (mandate.ordersUsed >= mandate.orderAllowance) {
    checks.push({
      name: "Order Allowance",
      passed: false,
      details: `Order limit reached (${mandate.ordersUsed}/${mandate.orderAllowance}).`,
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Order Allowance",
      passed: true,
      details: `Within allowed order frequency.`,
    });
  }
  
  // 4. Unresolved Items / ASK Queue
  const unresolved = basket.filter(i => i.status === 'ask' || (i.isUnavailable && i.status === 'pending'));
  if (unresolved.length > 0) {
    checks.push({
      name: "Unresolved Exceptions",
      passed: false,
      details: `${unresolved.length} item(s) require user approval before checkout.`,
    });
    isAsk = true;
  } else {
    checks.push({
      name: "Unresolved Exceptions",
      passed: true,
      details: "All basket items are resolved or autonomously approved.",
    });
  }
  
  // 5. Blocked Items explicitly excluded? (We assume they are just dropped, so this is okay)
  const blocked = basket.filter(i => i.status === 'stop');
  if(blocked.length > 0) {
    checks.push({
      name: "Blocked Items Check",
      passed: true,
      details: `${blocked.length} blocked item(s) will be excluded from the final order.`,
    });
  }

  // 6. Basket-level Dietary Check
  const basketViolations = basket.flatMap(item => {
    const productToCheck = item.replacement && item.status !== 'stop' && item.status !== 'rejected' ? item.replacement : item.product;
    return mandate.dietaryRestrictions.filter(r => 
      productToCheck.ingredients.some(ing => ing.toLowerCase().includes(r.toLowerCase())) ||
      productToCheck.name.toLowerCase().includes(r.toLowerCase())
    );
  });
  
  if (basketViolations.length > 0) {
    checks.push({
      name: "Dietary Restrictions (Basket Level)",
      passed: false,
      details: `Basket contains violations: ${[...new Set(basketViolations)].join(", ")}`,
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Dietary Restrictions",
      passed: true,
      details: "No dietary violations found in basket.",
    });
  }

  // 7. Empty Cart Check
  const validItems = basket.filter(i => i.status !== 'stop' && i.status !== 'rejected');
  if (validItems.length === 0) {
    checks.push({
      name: "Valid Cart Size",
      passed: false,
      details: "Cart is empty after applying blocks and rejections.",
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Valid Cart Size",
      passed: true,
      details: `Cart contains ${validItems.length} valid item(s).`,
    });
  }

  // 8. Hallucination / Anomalous Quantity Check
  const anomalousItems = basket.filter(i => i.quantity > 10);
  if (anomalousItems.length > 0) {
    checks.push({
      name: "Anomalous Quantity Check",
      passed: false,
      details: `Flagged unusually high quantity for: ${anomalousItems.map(i => i.product.name).join(', ')} (Qty > 10).`,
    });
    isBlocked = true;
  } else {
    checks.push({
      name: "Anomalous Quantity Check",
      passed: true,
      details: "All item quantities are within normal bounds (≤ 10).",
    });
  }

  let decision: DecisionResult;
  let reason: string;
  let requiredAction: string | undefined;
  
  const channelText = mandate.doubtResolutionChannel === 'whatsapp' ? 'via WhatsApp' : mandate.doubtResolutionChannel === 'in-app' ? 'via In-App Notification' : 'and auto-rejected';
  let finalAction = "Finalize and Submit Order";

  if (isBlocked) {
    decision = "STOP";
    reason = "Checkout blocked by a hard constraint (budget, limits, diet, or revoked permission).";
    requiredAction = "Adjust the budget, remove items, or restore permissions to proceed.";
    finalAction = `Halted checkout ${channelText}`;
  } else if (isAsk) {
    decision = "ASK";
    reason = "Approval is required for pending substitutions before checkout.";
    requiredAction = "Review and approve/reject pending items.";
    finalAction = `Paused checkout ${channelText}: Pending items`;
  } else {
    decision = "ACT";
    reason = "All checks passed. Order is valid and authorized.";
  }

  return {
    action: finalAction,
    decision,
    checks,
    reason,
    requiredAction,
    timestamp: Date.now(),
  };
}
