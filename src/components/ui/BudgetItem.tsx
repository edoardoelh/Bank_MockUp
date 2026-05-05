import React from 'react';
import { useTranslation } from 'react-i18next';
import type { BudgetCategory } from '../../types/budget';

interface BudgetItemProps {
  budget: BudgetCategory;
  /** When true, the percentage label is intentionally omitted — BUG marker */
  omitPercentage?: boolean;
}

/**
 * Budget category row with icon, progress bar, and remaining amount.
 */
export function BudgetItem({
  budget,
  omitPercentage = false,
}: BudgetItemProps): React.ReactElement {
  const { t } = useTranslation();
  const { category, icon, spent, limit, color } = budget;

  const pct = Math.min((spent / limit) * 100, 100);
  const isOverLimit = pct >= 95;
  const barColor = isOverLimit ? 'oklch(55% 0.20 24)' : color;
  const remaining = limit - spent;

  return (
    <div className={`budget-item${isOverLimit ? ' over-limit' : ''}`}>
      <div className="budget-icon">{icon}</div>

      <div>
        <div className="budget-info-row">
          <span className="budget-cat-name">{t(`categories.${category}`)}</span>
          <span className="budget-amounts">
            {spent.toFixed(0)} €{' '}
            <span style={{ color: 'var(--color-text-muted)' }}>/ {limit} €</span>
            {/* BUG: omitPercentage causes the percentage to not render for 'leisure' category */}
            {!omitPercentage && (
              <span style={{ marginLeft: 8, color: 'var(--color-text-muted)' }}>
                ({Math.round(pct)}%)
              </span>
            )}
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
      </div>

      <div className="budget-right">
        {isOverLimit ? (
          <span style={{ color: 'oklch(45% 0.18 24)', fontWeight: 600 }}>
            {t('budget.limit')}
          </span>
        ) : (
          <span style={{ color: 'var(--color-text-muted)' }}>
            {remaining.toFixed(0)} € {t('budget.left')}
          </span>
        )}
      </div>
    </div>
  );
}
