import React from 'react';
import type { TransactionStatus } from '../../types/transaction';

interface BadgeProps {
  status: TransactionStatus;
  /** Labels keyed by status value */
  labels: Record<NonNullable<TransactionStatus>, string>;
}

const STATUS_CLASS: Record<NonNullable<TransactionStatus>, string> = {
  paid: 'tx-badge-success',
  received: 'tx-badge-success',
  pending: 'tx-badge-warning',
};

/**
 * Transaction status badge. Returns null when status is null.
 */
export function Badge({ status, labels }: BadgeProps): React.ReactElement | null {
  if (!status) return null;
  return (
    <span className={`tx-badge ${STATUS_CLASS[status]}`}>{labels[status]}</span>
  );
}
