import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Credentials } from '../types/auth';
import { MOCK_CREDENTIALS } from '../data/profile';
import logoBlack from '../assets/logo-black.png';
import { LanguageSelector } from '../components/ui/LanguageSelector';

interface LoginPageProps {
  onLogin: (credentials: Credentials) => boolean;
}

/**
 * Login page. Validates against mock credentials and navigates to Dashboard on success.
 * Shows inline demo hint with pre-filled credentials for the evaluator.
 */
export function LoginPage({ onLogin }: LoginPageProps): React.ReactElement {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin({ email, password });
    if (!ok) setError(true);
  };

  const handleDemoFill = () => {
    setEmail(MOCK_CREDENTIALS.email);
    setPassword(MOCK_CREDENTIALS.password);
    setError(false);
  };

  return (
    <div className="login-page">
      <LanguageSelector />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <img src={logoBlack} alt="M DE MAKER" />
        </div>

        {/* Eyebrow */}
        <p className="login-eyebrow">{t('auth.eyebrow')}</p>

        {/* Title */}
        <h1 className="login-title">{t('auth.title')}</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="input-label" htmlFor="login-email">
              {t('auth.email')}
            </label>
            <input
              id="login-email"
              className={`input${error ? ' input-error' : ''}`}
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(false); }}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-2)' }}>
            <label className="input-label" htmlFor="login-password">
              {t('auth.password')}
            </label>
            <input
              id="login-password"
              className={`input${error ? ' input-error' : ''}`}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="input-error-msg" style={{ marginBottom: 'var(--space-3)' }}>
              {t('auth.error')}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-5)', justifyContent: 'center' }}
          >
            {t('auth.submit')}
          </button>
        </form>

        {/* Demo hint */}
        <div className="login-demo-hint">
          <span className="login-demo-label">{t('auth.demoHint')}</span>
          <button type="button" className="login-demo-fill" onClick={handleDemoFill}>
            {t('auth.demoFill')}
          </button>
        </div>
      </div>

      {/* Footer */}
      <a
        href="https://mdemaker.es"
        target="_blank"
        rel="noopener noreferrer"
        className="login-footer"
      >
        mdemaker.es
      </a>
    </div>
  );
}
