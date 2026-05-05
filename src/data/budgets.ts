import type { BudgetCategory } from '../types/budget';

// BUG: 'leisure' category has no percentage rendered in BudgetItem (missing pct prop passed)
export const BUDGETS: BudgetCategory[] = [
  {
    category: 'housing',
    icon: 'VI',
    spent: 850,
    limit: 850,
    color: 'oklch(13% 0.008 80)',
  },
  {
    category: 'food',
    icon: 'AL',
    spent: 134.5,
    limit: 300,
    color: 'oklch(60% 0.14 222)',
  },
  {
    category: 'transport',
    icon: 'TR',
    spent: 62,
    limit: 150,
    color: 'oklch(58% 0.006 80)',
  },
  {
    category: 'software',
    icon: 'SW',
    spent: 29,
    limit: 50,
    color: 'oklch(87% 0.19 92)',
  },
  {
    category: 'leisure',
    icon: 'OC',
    spent: 80,
    limit: 200,
    color: 'oklch(72% 0.13 222)',
  },
];
