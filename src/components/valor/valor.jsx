import React, { useState, useEffect, useContext } from 'react';
import './valor.css';
import api from './api';
import { MyContext } from '../../Context';

function Valor({ symbol }) {
    const [preco, setPreco] = useState(null);
    const { value } = useContext(MyContext);

    useEffect(() => {
        const fetchPreco = async () => {
            try {
                const response = await api.get(`/api/v3/ticker/price?symbol=${symbol}${value}`);
                const precoFloat = parseFloat(response.data.price);
                setPreco(precoFloat);
            } catch (error) {
                console.error('Ops! Ocorreu um erro: ' + error);
            }
        };

        fetchPreco();
        const interval = setInterval(() => {
            fetchPreco();
        }, 5000);

        return () => clearInterval(interval);
    }, [symbol, value]);

    const moeda = value === 'BRL' ? 'R$' : value === 'EUR' ? '€' : '$';

    const formatarPreco = (preco) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(preco);
    };

    return (
        <div className="valor_box">
            {preco ? (
                <span>
                    {moeda}
                    {formatarPreco(preco)}
                </span>
            ) : (
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem' }}></i>
            )}
        </div>
    );
}

export default Valor;
