import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { TransactionRow } from '../components/ui/TransactionRow';
import { Modal } from '../components/ui/Modal';
import { useTransactionFilter, type FilterType } from '../hooks/useTransactionFilter';
import { TRANSACTIONS } from '../data/transactions';

/**
 * Transactions page: KPI summary, search + type filter, full table, add modal.
 */
export function TransactionsPage(): React.ReactElement {
  const { t } = useTranslation();
  const { query, setQuery, filter, setFilter, filtered } = useTransactionFilter(TRANSACTIONS);
  const [showModal, setShowModal] = useState(false);

  const maxAbs = Math.max(...filtered.map((tx) => Math.abs(tx.amount)), 1);

  const totalIncome = TRANSACTIONS.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
  const totalExpense = TRANSACTIONS.filter((tx) => tx.amount < 0).reduce((s, tx) => s + tx.amount, 0);
  const balance = totalIncome + totalExpense;

  const incomeCount = TRANSACTIONS.filter((tx) => tx.amount > 0).length;
  const expenseCount = TRANSACTIONS.filter((tx) => tx.amount < 0).length;

  const FILTER_OPTIONS: { id: FilterType; labelKey: string }[] = [
    { id: 'all',     labelKey: 'transactions.filterAll' },
    { id: 'expense', labelKey: 'transactions.filterExpenses' },
    { id: 'income',  labelKey: 'transactions.filterIncome' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-header-meta">Abril 2026</div>
          <h2 className="page-header-title">{t('transactions.title')}</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          {t('transactions.addTransaction')}
        </button>
      </div>

      <div className="stats-row-3">
        <StatCard
          label={t('transactions.monthlyIncome')}
          value={`+${totalIncome.toLocaleString('es', { minimumFractionDigits: 2 })} €`}
          delta={`${incomeCount} transacciones`}
          deltaType="positive"
        />
        <StatCard
          label={t('transactions.monthlyExpenses')}
          value={`${totalExpense.toLocaleString('es', { minimumFractionDigits: 2 })} €`}
          delta={`${expenseCount} transacciones`}
          deltaType="negative"
        />
        <StatCard
          label={t('transactions.monthBalance')}
          value={`${balance >= 0 ? '+' : ''}${balance.toLocaleString('es', { minimumFractionDigits: 2 })} €`}
          delta={`${TRANSACTIONS.length} movimientos totales`}
          deltaType={balance >= 0 ? 'positive' : 'negative'}
          accent
        />
      </div>

      <div className="filter-bar">
        <div className="filter-search-wrap">
          <span className="filter-search-icon">
            <Search size={14} />
          </span>
          <input
            className="input"
            type="text"
            placeholder={t('transactions.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 36, borderRadius: 'var(--radius-base)', fontSize: 'var(--text-sm)' }}
          />
        </div>

        <div className="filter-toggle">
          {FILTER_OPTIONS.map(({ id, labelKey }) => (
            <button
              key={id}
              className={`filter-toggle-btn${filter === id ? ' active' : ''}`}
              onClick={() => setFilter(id)}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="transactions-card">
        <div className="tx-table-header">
          <div />
          <div className="tx-table-col">{t('transactions.columnConcept')}</div>
          <div className="tx-table-col">{t('transactions.columnAmount')}</div>
          <div className="tx-table-col">{t('transactions.columnDate')}</div>
          <div className="tx-table-col">{t('transactions.columnStatus')}</div>
        </div>

        {filtered.length > 0 ? (
          filtered.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} maxAbs={maxAbs} />
          ))
        ) : (
          <div className="empty-state">{t('transactions.empty')}</div>
        )}
      </div>

      {showModal && (
        <Modal
          title={t('transactions.modal.title')}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                {t('transactions.modal.cancel')}
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                {t('transactions.modal.save')}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label">{t('transactions.modal.concept')}</label>
              <input className="input" type="text" placeholder={t('transactions.modal.conceptPlaceholder')} />
            </div>
            <div className="input-group">
              <label className="input-label">{t('transactions.modal.amount')}</label>
              <input className="input" type="number" placeholder={t('transactions.modal.amountPlaceholder')} />
            </div>
            <div className="input-group">
              <label className="input-label">{t('transactions.modal.category')}</label>
              <select className="input">
                <option value="housing">Housing</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="software">Software</option>
                <option value="income">Income</option>
                <option value="leisure">Leisure</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
