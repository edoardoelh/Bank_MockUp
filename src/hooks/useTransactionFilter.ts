import { useState, useMemo } from 'react';
import type { Transaction } from '../types/transaction';

export type FilterType = 'all' | 'expense' | 'income';

interface UseTransactionFilterReturn {
  query: string;
  setQuery: (q: string) => void;
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  filtered: Transaction[];
}

/**
 * Filters a transaction list by type (all/expense/income) and a text query
 * matched case-insensitively against concept and category.
 */
export function useTransactionFilter(
  transactions: Transaction[]
): UseTransactionFilterReturn {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return transactions.filter((t) => {
      if (filter === 'expense' && t.amount >= 0) return false;
      if (filter === 'income' && t.amount < 0) return false;
      if (q && !t.concept.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [transactions, query, filter]);

  return { query, setQuery, filter, setFilter, filtered };
}
