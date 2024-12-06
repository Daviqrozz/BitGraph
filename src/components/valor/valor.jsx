import React, { useState, useEffect, useContext } from 'react';
import './valor.css'
import api from './api'

function Valor(){

  const [preco, setPreco] = useState(null);
  const {value} = useContext(MyContext);

  useEffect(() => {
    const fetchPreco = async () => {
      try {
        const response = await api.get(`/api/v3/ticker/price?symbol=BTC${value}`);
        
        const precoFLoat= parseFloat(response.data.price)
        setPreco(precoFLoat);
      } catch (error) {
        console.error("Ops! Ocorreu um erro: " + error);
      }
    };
    const interval = setInterval(() => {
      fetchPreco();
    }, 2500);
 
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