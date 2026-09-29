import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/cabeçalho/header';

export default function About() {
  return (
    <div className="page-wrapper">
      <Header />

      <main className="about-page">
        <div className="about-container">

          {/* Badge de cabeçalho */}
          <div className="about-badge">
            <span className="about-badge-dot" />
            <span>Sobre o BitGraph</span>
          </div>

          {/* Título */}
          <h1 className="about-title">
            Cotações puras, <br />
            <span className="about-title-highlight">sem ruído visual.</span>
          </h1>

          {/* Manifesto & Conceito */}
          <div className="about-manifesto">
            <p className="about-lead">
              A ideia do <strong>BitGraph</strong> é ser um sistema simples e minimalista para amantes de criptomoedas.
            </p>

            <p className="about-text">
              Em um mercado saturado de dashboards complexos, gráficos poluídos e anúncios invasivos, o BitGraph nasce com o propósito de devolver o essencial: cotações em tempo real, tendências de mercado e visualização cristalina dos ativos que você mais acompanha.
            </p>

            <p className="about-text">
              Conectado diretamente aos fluxos públicos de negociação da Binance via WebSockets de alta velocidade, o BitGraph processa variações de preço tick a tick, oferecendo transparência total e conversão instantânea entre Real (BRL), Dólar (USD) e Euro (EUR).
            </p>
          </div>

          {/* Cards de Pilares */}
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">⚡</div>
              <h2 className="about-card-title">Tempo Real Genuíno</h2>
              <p className="about-card-desc">
                Cotações ao vivo via stream combinado da Binance, com atualização contínua e sem necessidade de recarregar a página.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-icon">✦</div>
              <h2 className="about-card-title">Minimalismo Funcional</h2>
              <p className="about-card-desc">
                Interface com modo escuro profundo, tipografia lapidada e foco exclusivo nas informações que realmente importam.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-icon">📈</div>
              <h2 className="about-card-title">Tendências Semanais</h2>
              <p className="about-card-desc">
                Mini-gráficos dinâmicos (sparklines) com curvas de Bézier cúbicas geradas a partir do histórico real de 7 dias.
              </p>
            </div>
          </div>

          {/* Ações / Navegação */}
          <div className="about-actions">
            <Link to="/moedas" className="btn-primary">
              Explorar Mercado →
            </Link>
            <Link to="/" className="about-btn-secondary">
              Ir para o Início
            </Link>
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
