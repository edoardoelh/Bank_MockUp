import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Transaction, TransactionStatus } from '../../types/transaction';
import { Badge } from './Badge';

interface TransactionRowProps {
  transaction: Transaction;
  /** Absolute maximum amount in the visible set, used to scale the magnitude bar */
  maxAbs: number;
}

/**
 * Single row in a transactions table.
 * Renders icon, concept/category, magnitude bar + amount, date, and status badge.
 */
export function TransactionRow({
  transaction,
  maxAbs,
}: TransactionRowProps): React.ReactElement {
  const { t } = useTranslation();
  const { icon, concept, category, date, amount, status } = transaction;

  const pct = maxAbs > 0 ? Math.round((Math.abs(amount) / maxAbs) * 100) : 0;
  const isPositive = amount > 0;
  const barColor = isPositive ? 'oklch(62% 0.16 148)' : 'oklch(13% 0.008 80)';

  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const statusLabels: Record<NonNullable<TransactionStatus>, string> = {
    paid: t('transactions.statusPaid'),
    received: t('transactions.statusReceived'),
    pending: t('transactions.statusPending'),
  };

  return (
    <div className="tx-row">
      <div className="tx-icon">{icon}</div>

      <div>
        <div className="tx-concept">{concept}</div>
        <div className="tx-cat">{t(`categories.${category}`)}</div>
      </div>

      <div className="tx-amount-wrap">
        <div className="mag-bar-wrap">
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: barColor,
              borderRadius: '2px',
            }}
          />
        </div>
        <div className={`tx-amount ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}
          {amount.toFixed(2).replace('.', ',')} €
        </div>
      </div>

      <div className="tx-date">{formattedDate}</div>

      <div>
        <Badge status={status} labels={statusLabels} />
      </div>
    </div>
  );
}
