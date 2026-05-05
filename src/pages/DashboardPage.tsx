import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { TransactionRow } from '../components/ui/TransactionRow';
import { TRANSACTIONS } from '../data/transactions';
import { MONTHLY_DATA } from '../data/chartData';

type ChartRange = '6M' | '12M';

/**
 * Main dashboard: stat cards, income/expense bar chart, recent transactions.
 */
export function DashboardPage(): React.ReactElement {
  const { t } = useTranslation();
  const [range, setRange] = useState<ChartRange>('12M');

  const chartData = range === '6M' ? MONTHLY_DATA.slice(0, 6) : MONTHLY_DATA;

  const previewTransactions = TRANSACTIONS.slice(0, 4);
  const maxAbs = Math.max(...previewTransactions.map((tx) => Math.abs(tx.amount)));

  return (
    <>
      <div className="stats-row">
        <StatCard
          label={t('dashboard.totalBalance')}
          value="8.420 €"
          delta="+3,2% este mes"
          deltaType="positive"
          accent
        />
        <StatCard
          label={t('dashboard.monthlyExpenses')}
          value="1.340 €"
          delta="–12% vs media"
          deltaType="negative"
        />
        <StatCard
          label={t('dashboard.savings')}
          value="680 €"
          delta="Meta: 700 €"
          deltaType="neutral"
        />
        <StatCard
          label={t('dashboard.investments')}
          value="12.050 €"
          delta="+8,1% YTD"
          deltaType="positive"
        />
      </div>

      <div className="chart-area">
        <div className="chart-header">
          <h3 className="chart-title">{t('dashboard.incomeVsExpenses')}</h3>
          <div style={{ display: 'flex', gap: 4, background: 'var(--color-ink-100)', border: 'var(--border)', borderRadius: 'var(--radius-base)', padding: 3 }}>
            {(['6M', '12M'] as ChartRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  padding: '3px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  background: range === r ? 'var(--color-primary)' : 'transparent',
                  color: range === r ? 'var(--color-ink-900)' : 'var(--color-text-muted)',
                  fontWeight: range === r ? 600 : 500,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={chartData} barSize={10} barGap={3}>
            <XAxis
              dataKey="month"
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--color-text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toLocaleString('es', { maximumFractionDigits: 1 })}k`}
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--color-text-secondary)' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                background: 'var(--color-background)',
                border: '1px solid var(--color-ink-200)',
                borderRadius: 8,
              }}
              formatter={(value) => [`${Number(value).toLocaleString('es')} €`]}
            />
            <Bar dataKey="income" name={t('dashboard.income')} fill="oklch(13% 0.008 80)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expense" name={t('dashboard.expenses')} fill="oklch(87% 0.19 92)" radius={[2, 2, 0, 0]} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                color: 'var(--color-text-secondary)',
                paddingTop: 8,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="transactions-card">
        <div className="transactions-header">
          <span style={{ fontWeight: 500, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
            {t('dashboard.recentTransactions')}
          </span>
        </div>
        {previewTransactions.map((tx) => (
          <TransactionRow key={tx.id} transaction={tx} maxAbs={maxAbs} />
        ))}
      </div>
    </>
  );
}
