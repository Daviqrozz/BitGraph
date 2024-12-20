import React from 'react';
import Header from '../components/cabeçalho/header'

import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
        <Header />
    <div className="bg-black text-white vh-100 d-flex flex-column justify-content-center align-items-center"> 
      <h1>Bem-vindo à Home</h1>
      <Link to="/principal" className="btn btn-primary mt-3">
        Acessar Página Principal
      </Link>
        </div>
    </div>
  );
}

export default Home;
