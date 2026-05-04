export const DEPARTMENTS = [
  { id: 'fuel', name: 'Fuel', type: 'revenue', taxRate: 0.07, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'beer', name: 'Beer', type: 'revenue', taxRate: 0.10, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'hard_liquor', name: 'Hard Liquor', type: 'revenue', taxRate: 0.15, color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: 'wine', name: 'Wine', type: 'revenue', taxRate: 0.15, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 'cigarettes_packs', name: 'Cigarettes Packs', type: 'revenue', taxRate: 0.15, color: 'bg-slate-200 text-slate-700 border-slate-300' },
  { id: 'cigarettes_cartons', name: 'Cigarettes Cartons', type: 'revenue', taxRate: 0.15, color: 'bg-slate-300 text-slate-800 border-slate-400' },
  { id: 'vapes', name: 'Vapes', type: 'revenue', taxRate: 0.07, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'grocery', name: 'Grocery (Pop/Beverages)', type: 'revenue', taxRate: 0.07, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'hot_food', name: 'Hot Food', type: 'revenue', taxRate: 0.07, color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'automotive', name: 'Automotive', type: 'revenue', taxRate: 0.07, color: 'bg-zinc-200 text-zinc-700 border-zinc-300' },
  { id: 'lottery_sales', name: 'Lottery Sales', type: 'lottery_revenue', taxRate: 0.0, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'lottery_payout', name: 'Lottery Payout', type: 'expense', taxRate: 0.0, color: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'lotto', name: 'Lotto', type: 'lottery_revenue', taxRate: 0.0, color: 'bg-emerald-200 text-emerald-800 border-emerald-300' },
  { id: 'nontaxable', name: 'Non-Taxable', type: 'revenue', taxRate: 0.0, color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

export const getDepartmentConfig = (name) => {
  if (!name) return DEPARTMENTS[7]; // Default Grocery
  const found = DEPARTMENTS.find(d => d.name === name || d.id === name);
  return found || { name: name, type: 'revenue', color: 'bg-slate-100 text-slate-700 border-slate-200' };
};

export const autoSuggestDepartment = (productName) => {
  if (!productName) return '';
  const lower = productName.toLowerCase();
  
  const keywordMap = {
    'beer': ['bud', 'coors', 'miller', 'corona', 'heineken', 'beer', 'ale', 'ipa', 'stout', 'lager'],
    'cigarettes_packs': ['marlboro', 'camel', 'newport', 'winston', 'kool', 'benson'],
    'cigarettes_cartons': ['carton'], // Should probably match cigarette brand + carton, but keep simple
    'grocery': ['red bull', 'monster', 'coke', 'pepsi', 'sprite', 'water', 'soda', 'coffee', 'tea', 'chips', 'doritos', 'cheetos', 'candy', 'snickers'],
    'hot_food': ['pizza', 'hot dog', 'burger', 'sandwich', 'nachos', 'burrito', 'taquito'],
    'vapes': ['juul', 'vuse', 'puff', 'vape', 'elf bar', 'breeze'],
    'hard_liquor': ['vodka', 'whiskey', 'rum', 'tequila', 'gin', 'jack daniels', 'smirnoff', 'tito', 'hennessy'],
    'wine': ['wine', 'cabernet', 'chardonnay', 'merlot', 'pinot', 'moscato'],
    'automotive': ['oil', 'wiper', 'fluid', 'antifreeze', 'tire', 'brake']
  };

  for (const [deptId, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(kw => lower.includes(kw))) {
      const dept = DEPARTMENTS.find(d => d.id === deptId);
      return dept ? dept.name : '';
    }
  }

  return ''; // No suggestion found
};
