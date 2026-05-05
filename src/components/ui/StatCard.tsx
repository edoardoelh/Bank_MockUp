import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  accent?: boolean;
}

/**
 * KPI card used in dashboard and page headers.
 * Pass `accent` to render with yellow primary background (4th card style).
 */
export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  accent = false,
}: StatCardProps): React.ReactElement {
  return (
    <div className={`stat-card${accent ? ' accent' : ''}`}>
      <div className="stat">
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>
          {value}
        </div>
        {delta && (
          <div className={`stat-delta${deltaType !== 'neutral' ? ` ${deltaType}` : ''}`}>
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
