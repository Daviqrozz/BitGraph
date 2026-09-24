import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/moedas',
    label: 'Moedas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16 3.95 6.06M14.31 16H2.83M16.62 12 10.88 21.94" />
      </svg>
    ),
  },
  {
    path: '/contact',
    label: 'Em breve',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    disabled: true,
  },
];

export default function Side() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    setVisible(false);
    navigate(path);
  };

  return (
    <>
      {/* Hamburger trigger */}
      <button
        className="menu-btn"
        aria-label="Abrir menu"
        onClick={() => setVisible(true)}
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="7"  x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* Sidebar overlay */}
      {visible && (
        <div className="bg-sidebar" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          {/* Click outside to close */}
          <div className="sidebar-overlay" onClick={() => setVisible(false)} />

          {/* Panel */}
          <div className="sidebar-panel">
            {/* Header */}
            <div className="sidebar-header">
              <span className="sidebar-title">Navegação</span>
              <button
                className="sidebar-close"
                aria-label="Fechar menu"
                onClick={() => setVisible(false)}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6"  y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav */}
            <ul className="sidebar-nav" role="navigation">
              {NAV_ITEMS.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <React.Fragment key={item.path}>
                    {i > 0 && <div className="sidebar-divider" />}
                    <li className={`sidebar-nav-item${isActive ? ' active' : ''}`}>
                      <button
                        onClick={() => !item.disabled && navigateTo(item.path)}
                        style={item.disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                        disabled={item.disabled}
                        type="button"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>

            {/* Footer branding */}
            <div style={{ marginTop: 'auto', paddingTop: 24 }}>
              <span style={{ fontSize: '0.7rem', color: '#404040', fontFamily: 'var(--font-mono)' }}>
                ₿itGraph · v1.0
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
