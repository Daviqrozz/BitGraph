import React, { useState, useEffect } from 'react';
import Header from '../components/cabeçalho/header';
import TopCryptoList from '../components/cryptolist/topcryptolist';
import { Link } from 'react-router-dom';

const FRASES = [
  'Esteja por dentro das novas tendências',
  'Acompanhe o mercado em tempo real',
];

function Home() {
  const [indexFrase, setIndexFrase] = useState(0);
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setVisivel(false);
      setTimeout(() => {
        setIndexFrase((prev) => (prev + 1) % FRASES.length);
        setVisivel(true);
      }, 500);
    }, 4000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="page-wrapper">
      <Header />

      {/* Hero */}
      <main className="hero-section">
        {/* Headline */}
        <div className="hero-headline">
          <h1 className={visivel ? 'fade-in' : 'fade-out'}>
            {FRASES[indexFrase]}
          </h1>
        </div>

        {/* Crypto price card */}
        <TopCryptoList />

        {/* CTA */}
        <Link to="/principal" className="btn-primary">
          Acompanhe o mercado
        </Link>
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
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
