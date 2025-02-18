import React, { useState, useEffect } from 'react';
import Header from '../components/cabeçalho/header';
import TopCryptoList from '../components/cryptolist/topcryptolist';
import { Link } from 'react-router-dom';

function Home() {
  const frases = ['Esteja por dentro das novas tendencias', 'Acompanhe o mercado'];
  const [indexFrase, setIndexFrase] = useState(0);
  const [visivel, setVisivel] = useState(true); 

  useEffect(() => {
    const intervalo = setInterval(() => {
      setVisivel(false);
      setTimeout(() => {
        setIndexFrase((prevIndex) => (prevIndex + 1) % frases.length);
        setVisivel(true);
      }, 800);
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div>
      <Header />
      <div className="bg-black text-white vh-100 d-flex flex-column justify-content-center align-items-center"> 
        <h1 className={`text text-center ${visivel ? 'fade-in' : 'fade-out'}`}>
          {frases[indexFrase]}
        </h1>
        <TopCryptoList />
        <Link to="/principal" className="btn btn-primary mt-3">
          Acompanhe o mercado
        </Link>
      </div>

      {/* Estilos CSS para animação */}
      <style>
        {`
          .fade-in {
            opacity: 1;
            transition: opacity 0.5s ease-in;
          }
          .fade-out {
            opacity: 0;
            transition: opacity 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
