import React from 'react';
import Header from '../components/cabeçalho/header'

import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
        <Header />
    <div className="bg-black text-white vh-100 d-flex flex-column justify-content-center align-items-center"> 
      <h1>Acompanhe suas criptomoedas</h1>
      <Link to="/principal" className="btn btn-primary mt-3">
        Acesse suas moedas
      </Link>
        </div>
    </div>
  );
}

export default Home;
