import React, { useState, useEffect, useContext } from 'react';
import './valor.css'
import api from './api'
import { MyContext } from '../../Context';
function Valor(){

  const [preco, setPreco] = useState(null);
  const {value} = useContext(MyContext);
  console.log(value)

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
    }, 1000);
 
    return () => clearInterval(interval);
  }, [value]);
  
    const moeda = value === 'BRL' ? 'R$' : '$'

  return (
    <div className='valor_box'>
      {preco ? (
        <h3>Preço do BTC: {preco}{moeda}</h3>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
  }
export default Valor