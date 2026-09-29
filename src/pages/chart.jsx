import React, { useContext } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import TradingViewWidget from '../components/graph/graph';
import Header from '../components/cabeçalho/header';
import { MyContext } from '../hooks/Context';

const CRYPTO_METADATA = {
  BTC:  { name: 'Bitcoin',   icon: '₿', color: '#f7931a', bg: 'rgba(247, 147, 26, 0.15)', border: 'rgba(247, 147, 26, 0.35)' },
  ETH:  { name: 'Ethereum',  icon: '♦', color: '#627eea', bg: 'rgba(98, 126, 234, 0.15)', border: 'rgba(98, 126, 234, 0.35)' },
  BNB:  { name: 'BNB',       icon: '⬡', color: '#f3ba2f', bg: 'rgba(243, 186, 47, 0.15)', border: 'rgba(243, 186, 47, 0.35)' },
  SOL:  { name: 'Solana',    icon: '◎', color: '#14f195', bg: 'rgba(20, 241, 149, 0.15)', border: 'rgba(20, 241, 149, 0.35)' },
  ADA:  { name: 'Cardano',   icon: '₳', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.35)' },
  XRP:  { name: 'Ripple',    icon: '✕', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.12)', border: 'rgba(203, 213, 225, 0.30)' },
  AVAX: { name: 'Avalanche', icon: '▲', color: '#e84142', bg: 'rgba(232, 65, 66, 0.15)', border: 'rgba(232, 65, 66, 0.35)' },
  LINK: { name: 'Chainlink', icon: '⬡', color: '#375bd2', bg: 'rgba(55, 91, 210, 0.15)', border: 'rgba(55, 91, 210, 0.35)' },
  DOT:  { name: 'Polkadot',  icon: '●', color: '#e6007a', bg: 'rgba(230, 0, 122, 0.15)', border: 'rgba(230, 0, 122, 0.35)' },
  POL:  { name: 'Polygon',   icon: '⬡', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.35)' },
};

const TOP_SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'AVAX', 'LINK', 'DOT', 'POL'];

function Chart() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { value } = useContext(MyContext);
  const upperSymbol = symbol?.toUpperCase();

  const meta = CRYPTO_METADATA[upperSymbol] || {
    name: upperSymbol,
    icon: '₿',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.15)',
    border: 'rgba(52, 211, 153, 0.35)',
  };

  const validExtra = ['MATIC', 'LTC', 'UNI', 'DOGE', 'ATOM', 'TRX', 'NEAR', 'ICP', 'SHIB'];
  if (!upperSymbol || (!CRYPTO_METADATA[upperSymbol] && !validExtra.includes(upperSymbol))) {
    return <Navigate to="/moedas" replace />;
  }

  return (
    <div className="page-wrapper">
      <Header />

      <main className="chart-view-layout">

        {/* Top bar: Voltar + Live indicator */}
        <div className="chart-top-bar">
          <Link to="/moedas" className="chart-back-btn">
            <span className="chart-back-arrow">←</span>
            <span>Voltar para o Mercado</span>
          </Link>

          <div className="chart-live-badge">
            <span className="chart-live-dot" />
            <span>Binance Spot • Tempo Real</span>
          </div>
        </div>

        {/* Crypto Quick Switcher (Pills) */}
        <div className="chart-switcher-container">
          <div className="chart-switcher-scroll">
            {TOP_SYMBOLS.map((s) => {
              const item = CRYPTO_METADATA[s];
              const isActive = s === upperSymbol;
              return (
                <button
                  key={s}
                  type="button"
                  className={`chart-switcher-pill${isActive ? ' chart-switcher-pill--active' : ''}`}
                  onClick={() => navigate(`/chart/${s}`)}
                >
                  <span
                    className="chart-switcher-icon"
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <span className="chart-switcher-label">{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="chart-card-container">
          {/* Header do Card */}
          <div className="chart-card-header">
            <div className="chart-card-title-group">
              <div
                className="coins-asset-icon"
                style={{
                  backgroundColor: meta.bg,
                  borderColor: meta.border,
                  color: meta.color,
                }}
              >
                {meta.icon}
              </div>
              <div className="chart-card-names">
                <div className="chart-card-name-row">
                  <h1 className="chart-card-name">{meta.name}</h1>
                  <span className="chart-card-symbol">{upperSymbol}</span>
                </div>
                <span className="chart-card-pair">
                  Par de negociação: {upperSymbol}/{value}
                </span>
              </div>
            </div>
          </div>

          {/* Widget TradingView */}
          <div className="chart-card-body">
            <TradingViewWidget symbol={upperSymbol} />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>₿itGraph</strong>
            <span>—</span>
            <span>Valores em tempo real</span>
          </div>
          <div className="footer-links">
            <Link to="/moedas">Moedas</Link>
            <Link to="/sobre">Sobre</Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Chart;