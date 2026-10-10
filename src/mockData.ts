import type { Mandate, Product, BasketItem } from './decisionEngine';

export const defaultMandate: Mandate = {
  budget: 500, // ₹500
  substitutionsAllowed: true,
  maxAbsolutePriceIncrease: 50.00, // ₹50 max absolute
  maxPercentagePriceIncrease: 15, 
  requireSamePackageSize: true,
  requireCategoryEquivalence: true,
  dietaryRestrictions: ['Peanut', 'Gluten', 'Palm Oil'],
  permissionValid: true,
  orderAllowance: 4,
  ordersUsed: 2,
  preferredBrands: ['Amul', 'Britannia'],
  doubtResolutionChannel: 'whatsapp'
};

export const catalog: Product[] = [
  { id: 'p1', name: 'Toned Milk', brand: 'Local Dairy', price: 54.00, size: '1 Litre', category: 'Dairy', ingredients: ['Milk'], imageUrl: '', unit: 'Litre', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'p2', name: 'Full Cream Milk', brand: 'Amul', price: 66.00, size: '1 Litre', category: 'Dairy', ingredients: ['Milk'], imageUrl: '', unit: 'Litre', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'p3', name: 'Cow Milk', brand: 'Nandini', price: 50.00, size: '1 Litre', category: 'Dairy', ingredients: ['Milk'], imageUrl: '', unit: 'Litre', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'p4', name: 'Toned Milk (Half)', brand: 'Local Dairy', price: 27.00, size: '500 ml', category: 'Dairy', ingredients: ['Milk'], imageUrl: '', unit: 'Litre', unitsPerPack: 1, totalBaseUnits: 0.5 },
  
  { id: 'p5', name: '100% Whole Wheat Bread', brand: 'Britannia', price: 50.00, size: '400g', category: 'Bakery', ingredients: ['Whole Wheat', 'Water'], imageUrl: '', unit: 'g', unitsPerPack: 1, totalBaseUnits: 400 },
  { id: 'p6', name: 'White Bread', brand: 'Local Bakery', price: 35.00, size: '400g', category: 'Bakery', ingredients: ['Refined Flour'], imageUrl: '', unit: 'g', unitsPerPack: 1, totalBaseUnits: 400 },
  { id: 'p7', name: 'Peanut Butter Bread', brand: 'Nutty Loaf', price: 80.00, size: '400g', category: 'Bakery', ingredients: ['Whole Wheat', 'Peanut Butter'], imageUrl: '', unit: 'g', unitsPerPack: 1, totalBaseUnits: 400 },

  { id: 'p10', name: 'Basmati Rice', brand: 'Daawat', price: 180.00, size: '1 kg', category: 'Pantry', ingredients: ['Rice'], imageUrl: '', unit: 'kg', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'p11', name: 'Apples (Kashmiri)', brand: 'Local Market', price: 150.00, size: '1 kg', category: 'Produce', ingredients: ['Apples'], imageUrl: '', unit: 'kg', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'p12', name: 'Bananas (Robusta)', brand: 'Local Market', price: 60.00, size: '1 kg', category: 'Produce', ingredients: ['Bananas'], imageUrl: '', unit: 'kg', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'p13', name: 'Potato Chips (Classic Salted)', brand: 'Lay\'s', price: 20.00, size: '50g', category: 'Snacks', ingredients: ['Potatoes', 'Salt', 'Palm Oil'], imageUrl: '', unit: 'g', unitsPerPack: 1, totalBaseUnits: 50 },
  { id: 'p14', name: 'Potato Chips (Cream & Onion)', brand: 'Lay\'s', price: 20.00, size: '50g', category: 'Snacks', ingredients: ['Potatoes', 'Onion Powder', 'Milk Solids', 'Palm Oil'], imageUrl: '', unit: 'g', unitsPerPack: 1, totalBaseUnits: 50 },
  { id: 'p15', name: 'Orange Juice', brand: 'Tropicana', price: 110.00, size: '1 Litre', category: 'Beverages', ingredients: ['Orange Juice'], imageUrl: '', unit: 'Litre', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'p16', name: 'Diet Cola', brand: 'Coke', price: 40.00, size: '300 ml', category: 'Beverages', ingredients: ['Carbonated Water', 'Aspartame'], imageUrl: '', unit: 'Litre', unitsPerPack: 1, totalBaseUnits: 0.3 },

  
  // Specific items for Quantity Semantics Demo
  { id: 'q1', name: 'Maida (Ambiguous)', brand: 'Fortune', price: 50.00, size: 'Pack', category: 'Baking', ingredients: ['Refined Flour'], imageUrl: '', isAmbiguousSize: true },
  { id: 'q2', name: 'Maida (Single)', brand: 'Fortune', price: 50.00, size: '1 kg', category: 'Baking', ingredients: ['Refined Flour'], imageUrl: '', unit: 'kg', unitsPerPack: 1, totalBaseUnits: 1 },
  { id: 'q3', name: 'Maida (Twin Pack)', brand: 'Fortune', price: 95.00, size: '2x1 kg', category: 'Baking', ingredients: ['Refined Flour'], imageUrl: '', unit: 'kg', unitsPerPack: 2, totalBaseUnits: 2 },
];

export const defaultBasket: BasketItem[] = [
  { id: 'b1', product: catalog[0], quantity: 1, isUnavailable: false, status: 'pending' }, // Milk (54)
  { id: 'b2', product: catalog[4], quantity: 1, isUnavailable: false, status: 'pending' }, // Bread (50)
  { id: 'b3', product: catalog[8], quantity: 1, isUnavailable: false, status: 'pending' }, // Apples (150)
];
// Default basket total = 54 + 50 + 150 = ₹254
