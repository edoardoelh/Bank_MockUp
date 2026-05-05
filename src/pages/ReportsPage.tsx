import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MONTHLY_DATA } from '../data/chartData';
import { BUDGETS } from '../data/budgets';

const CURRENT_MONTH_INDEX = 3; // April

/**
 * Reports page: monthly balance mini-bars, category breakdown, annual trend table.
 * BUG: month filter select does not filter the trend table (handler is a no-op).
 */
export function ReportsPage(): React.ReactElement {
  const { t } = useTranslation();
  // BUG: selectedMonth state is set but never used to filter the trend table
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const maxVal = Math.max(...MONTHLY_DATA.map((d) => Math.max(d.income, d.expense)));
  const totalCategorySpend = BUDGETS.reduce((s, b) => s + b.spent, 0);

  const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  return (
    <>
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <div className="page-header-meta">2026</div>
          <h2 className="page-header-title">{t('reports.title')}</h2>
        </div>

        {/* BUG: filter by month — onChange updates state but table always renders all months */}
        <div className="input-group" style={{ minWidth: 160 }}>
          <select
            className="input"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ fontSize: 'var(--text-sm)' }}
          >
            <option value="all">{t('reports.filterMonth')}</option>
            {MONTH_NAMES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="reports-top-grid">
        {/* Monthly balance mini-bars */}
        <div className="report-card">
          <div className="report-card-label">{t('reports.monthlyBalance')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MONTHLY_DATA.slice(0, 6).map((d) => {
              const saving = d.income - d.expense;
              return (
                <div key={d.month} className="mini-bar-row">
                  <span className="mini-bar-month">{d.month}</span>
                  <div className="mini-bar-track">
                    <div
                      className="mini-bar-fill"
                      style={{
                        width: `${Math.round((d.income / maxVal) * 100)}%`,
                        background: 'oklch(13% 0.008 80)',
                      }}
                    />
                  </div>
                  <div className="mini-bar-track">
                    <div
                      className="mini-bar-fill"
                      style={{
                        width: `${Math.round((d.expense / maxVal) * 100)}%`,
                        background: 'oklch(87% 0.19 92)',
                      }}
                    />
                  </div>
                  <span
                    className="mini-bar-saving"
                    style={{ color: saving > 0 ? 'oklch(38% 0.14 148)' : 'oklch(55% 0.20 24)' }}
                  >
                    {saving > 0 ? '+' : ''}{(saving / 1000).toFixed(1)}k
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="report-card">
          <div className="report-card-label">{t('reports.categoryBreakdown')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {BUDGETS.map((b) => {
              const pct = Math.round((b.spent / totalCategorySpend) * 100);
              return (
                <div key={b.category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      width: 96,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t(`categories.${b.category}`)}
                  </span>
                  <div style={{ flex: 1, height: 7, background: 'var(--color-ink-100)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: b.color, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', width: 36, textAlign: 'right' }}>
                    {pct}%
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', width: 60, textAlign: 'right' }}>
                    {b.spent.toFixed(0)} €
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Annual trend table — BUG: selectedMonth filter has no effect here */}
      <div style={{ background: 'var(--color-background)', border: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: 'var(--border)' }}>
          <div className="report-card-label">{t('reports.annualTrend')}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: 'var(--border)' }}>
                {[t('reports.month'), t('reports.income'), t('reports.expenses'), t('reports.savings')].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: col === t('reports.month') ? 'left' : 'right',
                      padding: `10px var(--space-6)`,
                      fontSize: 9,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHLY_DATA.map((d, i) => {
                const saving = d.income - d.expense;
                const isCurrent = i === CURRENT_MONTH_INDEX;
                return (
                  <tr
                    key={d.month}
                    style={{
                      borderBottom: '1px solid var(--color-ink-100)',
                      background: isCurrent ? 'oklch(97% 0.008 92)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: `10px var(--space-6)`, fontWeight: isCurrent ? 600 : 400, color: 'var(--color-text-primary)' }}>
                      {MONTH_NAMES[i]}{isCurrent ? ' ←' : ''}
                    </td>
                    <td style={{ padding: `10px var(--space-6)`, fontFamily: 'var(--font-mono)', color: 'oklch(38% 0.14 148)', textAlign: 'right' }}>
                      +{d.income.toLocaleString('es')} €
                    </td>
                    <td style={{ padding: `10px var(--space-6)`, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', textAlign: 'right' }}>
                      –{d.expense.toLocaleString('es')} €
                    </td>
                    <td style={{
                      padding: `10px var(--space-6)`,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 500,
                      textAlign: 'right',
                      color: saving > 0 ? 'oklch(38% 0.14 148)' : 'oklch(55% 0.20 24)',
                    }}>
                      {saving > 0 ? '+' : ''}{saving.toLocaleString('es')} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
