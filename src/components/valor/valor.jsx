import React, { useState, useEffect } from 'react';
import './valor.css'
import api from './api'

function Valor(){

  const [preco, setPreco] = useState(null);

  useEffect(() => {
    const fetchPreco = async () => {
      try {
        const response = await api.get('/api/v3/ticker/price?symbol=BTCUSDT');
        const precoFLoat= parseFloat(response.data.price)
        setPreco(precoFLoat);
      } catch (error) {
        console.error("Ops! Ocorreu um erro: " + error);
      }
    };

    // Atualiza os dados a cada 5 segundos
    const interval = setInterval(() => {
      fetchPreco();
    }, 2500);

    // Limpa o intervalo ao desmontar o componente  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='valor_box'>
      {preco ? (
        <h3>Preço do BTC: {preco}$</h3>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
  
  }
export default Valor