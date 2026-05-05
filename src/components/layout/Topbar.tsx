import React from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../types/auth';
import { LanguageSelector } from '../ui/LanguageSelector';

interface TopbarProps {
  title: string;
  user: User;
  onLogout: () => void;
}

/**
 * Sticky top bar showing current view title, language toggle,
 * demo badge, and user avatar with logout action.
 */
export function Topbar({ title, user, onLogout }: TopbarProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>

      <div className="topbar-actions">
        <LanguageSelector className="lang-inline" />

        <span
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-ink-900)',
            border: '1px solid var(--color-primary-hover)',
            fontFamily: 'var(--font-ui)',
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          {t('common.demo')}
        </span>

        <button
          onClick={onLogout}
          title="Sign out"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--color-ink-900)',
            color: 'var(--color-white)',
            border: 'none',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
        >
          {user.avatarInitial}
        </button>
      </div>
    </header>
  );
}
