import React from 'react';
import { useTranslation } from 'react-i18next';
import logoBlack from '../../assets/logo-black.png';

export type ViewId = 'dashboard' | 'transactions' | 'budget' | 'reports' | 'products';

interface SidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

interface NavLink {
  id: ViewId;
  labelKey: string;
  section: 'main' | 'analysis';
}

const NAV_LINKS: NavLink[] = [
  { id: 'dashboard',    labelKey: 'nav.dashboard',    section: 'main' },
  { id: 'transactions', labelKey: 'nav.transactions', section: 'main' },
  { id: 'budget',       labelKey: 'nav.budget',       section: 'main' },
  { id: 'products',     labelKey: 'nav.products',     section: 'main' },
  { id: 'reports',      labelKey: 'nav.reports',      section: 'analysis' },
];

/**
 * Fixed left sidebar with logo, navigation links, and footer branding.
 * Active link shows yellow indicator dot and filled background.
 */
export function Sidebar({ activeView, onNavigate }: SidebarProps): React.ReactElement {
  const { t } = useTranslation();

  const mainLinks = NAV_LINKS.filter((l) => l.section === 'main');
  const analysisLinks = NAV_LINKS.filter((l) => l.section === 'analysis');

  const renderLink = (link: NavLink) => (
    <button
      key={link.id}
      className={`sidebar-link${activeView === link.id ? ' active' : ''}`}
      onClick={() => onNavigate(link.id)}
    >
      <span className="link-indicator" />
      {t(link.labelKey)}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logoBlack} alt="M DE MAKER" />
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Principal</div>
        {mainLinks.map(renderLink)}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Análisis</div>
        {analysisLinks.map(renderLink)}
      </div>

      <div className="sidebar-bottom">mdemaker.es</div>
    </aside>
  );
}
