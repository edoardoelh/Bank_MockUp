import React from 'react';
import { Sidebar, type ViewId } from './Sidebar';
import { Topbar } from './Topbar';
import type { User } from '../../types/auth';

interface AppLayoutProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  title: string;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

/**
 * Root app shell: sidebar (fixed left) + main area (topbar + page content).
 */
export function AppLayout({
  activeView,
  onNavigate,
  title,
  user,
  onLogout,
  children,
}: AppLayoutProps): React.ReactElement {
  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={onNavigate} />
      <div className="main-area">
        <Topbar
          title={title}
          user={user}
          onLogout={onLogout}
        />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
