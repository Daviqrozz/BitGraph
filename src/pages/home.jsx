import React from 'react';
import Header from '../components/cabeçalho/header'
import TopCryptoList from '../components/cryptolist/cryptolist'


import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
        <Header />
    <div className="bg-black text-white vh-100 d-flex flex-column justify-content-center align-items-center"> 
      <h1 className='text-center'>Acompanhe suas criptomoedas</h1>
      <TopCryptoList />
      <Link to="/principal" className="btn btn-primary mt-3">
        Acesse outras moedas
      </Link>
        </div>
    </div>
  );
}

export default Home;
