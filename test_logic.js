import { evaluateSubstitutionLogic } from './src/decisionEngine.js';
import { catalog, defaultMandate } from './src/mockData.js';

const testMandate = { ...defaultMandate, preferredBrands: ['Amul'] };
const original = catalog.find(p => p.id === 'p2')!; // Amul Milk
const candidate = catalog.find(p => p.id === 'p1')!; // Local Dairy Milk

console.log(original);
console.log(candidate);

// evaluateSubstitutionLogic does not work in pure JS because it's TypeScript.
