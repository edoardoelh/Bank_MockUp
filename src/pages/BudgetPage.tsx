import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '../components/ui/StatCard';
import { BudgetItem } from '../components/ui/BudgetItem';
import { Modal } from '../components/ui/Modal';
import { BUDGETS } from '../data/budgets';

/**
 * Budget page: KPI cards, category list with progress bars, edit-limits modal.
 */
export function BudgetPage(): React.ReactElement {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const totalBudgeted = BUDGETS.reduce((s, b) => s + b.limit, 0);
  const totalSpent = BUDGETS.reduce((s, b) => s + b.spent, 0);
  const available = totalBudgeted - totalSpent;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-header-meta">Abril 2026</div>
          <h2 className="page-header-title">{t('budget.title')}</h2>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
          {t('budget.editLimits')}
        </button>
      </div>

      <div className="stats-row-3">
        <StatCard
          label={t('budget.budgeted')}
          value={`${totalBudgeted.toLocaleString('es', { minimumFractionDigits: 2 })} €`}
          delta={`${BUDGETS.length} ${t('budget.categories')}`}
          deltaType="neutral"
        />
        <StatCard
          label={t('budget.spent')}
          value={`${totalSpent.toLocaleString('es', { minimumFractionDigits: 2 })} €`}
          delta={`${Math.round((totalSpent / totalBudgeted) * 100)}% del total`}
          deltaType="neutral"
        />
        <StatCard
          label={t('budget.available')}
          value={`${available.toLocaleString('es', { minimumFractionDigits: 2 })} €`}
          delta={`quedan 13 ${t('budget.daysLeft')}`}
          deltaType="neutral"
          accent
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {BUDGETS.map((budget) => (
          <BudgetItem
            key={budget.category}
            budget={budget}
            // BUG: leisure category omits percentage — omitPercentage is true only for 'leisure'
            omitPercentage={budget.category === 'leisure'}
          />
        ))}
      </div>

      {showModal && (
        <Modal
          title={t('budget.modal.title')}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                {t('budget.modal.cancel')}
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                {t('budget.modal.save')}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {BUDGETS.map((b) => (
              <div key={b.category} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, flex: 1 }}>
                  {t(`categories.${b.category}`)}
                </span>
                <input
                  type="number"
                  defaultValue={b.limit}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    padding: '6px 10px',
                    border: 'var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    width: 100,
                    textAlign: 'right',
                    background: 'var(--color-background)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>€</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
