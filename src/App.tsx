import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetPage } from './pages/BudgetPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProductsPage } from './pages/ProductsPage';
import { useAuth } from './hooks/useAuth';
import type { ViewId } from './components/layout/Sidebar';

const VIEW_TITLE_KEYS: Record<ViewId, string> = {
  dashboard:    'dashboard.title',
  transactions: 'transactions.title',
  budget:       'budget.title',
  reports:      'reports.title',
  products:     'products.title',
};

/**
 * Root component. Manages auth state, active view, and language selection.
 */
export default function App(): React.ReactElement {
  const { t } = useTranslation();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewId>('dashboard');

  const pageMap: Record<ViewId, React.ReactElement> = {
    dashboard:    <DashboardPage />,
    transactions: <TransactionsPage />,
    budget:       <BudgetPage />,
    reports:      <ReportsPage />,
    products:     <ProductsPage />,
  };

  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      fallback={<LoginPage onLogin={login} />}
    >
      <AppLayout
        activeView={activeView}
        onNavigate={setActiveView}
        title={t(VIEW_TITLE_KEYS[activeView])}
        user={user!}
        onLogout={logout}
      >
        {pageMap[activeView]}
      </AppLayout>
    </ProtectedRoute>
  );
}
