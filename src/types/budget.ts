import type { TransactionCategory } from './transaction';

export interface BudgetCategory {
  category: TransactionCategory;
  icon: string;
  spent: number;
  limit: number;
  /** CSS color value for the progress bar */
  color: string;
}
