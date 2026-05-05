import type { Transaction } from '../types/transaction';

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    icon: 'AL',
    concept: 'Rent',
    category: 'housing',
    date: '2026-04-01',
    amount: -850,
    status: 'paid',
  },
  {
    id: 'tx-002',
    icon: 'NÓ',
    concept: 'Salary',
    category: 'income',
    date: '2026-04-05',
    amount: 2400,
    status: 'received',
  },
  {
    id: 'tx-003',
    icon: 'SM',
    concept: 'Supermarket',
    category: 'food',
    date: '2026-04-12',
    // BUG: amount should be -134.50 but is shown as positive (incorrect sign)
    amount: 134.5,
    status: null,
  },
  {
    id: 'tx-004',
    icon: 'SS',
    concept: 'SaaS Subscription',
    category: 'software',
    date: '2026-04-15',
    amount: -29,
    status: 'pending',
  },
  {
    id: 'tx-005',
    icon: 'GA',
    concept: 'Fuel',
    category: 'transport',
    date: '2026-04-17',
    amount: -62,
    status: null,
  },
  {
    id: 'tx-006',
    icon: 'FR',
    concept: 'Freelance',
    category: 'income',
    date: '2026-04-20',
    amount: 600,
    status: 'received',
  },
];
