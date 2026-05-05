export type TransactionStatus = 'paid' | 'received' | 'pending' | null;

export type TransactionCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'software'
  | 'income'
  | 'leisure';

export interface Transaction {
  id: string;
  icon: string;
  concept: string;
  category: TransactionCategory;
  date: string;
  /** Amount in euros — negative for expenses, positive for income */
  amount: number;
  status: TransactionStatus;
}
