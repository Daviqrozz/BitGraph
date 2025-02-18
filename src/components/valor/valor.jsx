import React, { useState, useEffect, useContext } from 'react';
import './valor.css';
import { MyContext } from '../../hooks/Context';
import api from './api'
import { connectWebSocket } from './api';

function Valor({ symbol }) {
    const [preco, setPreco] = useState(null);
    const { value } = useContext(MyContext);

    //Função para buscar o preço inicial da moeda via api response
    const fetchPreco = async () => {
        try {
            const response = await api.get(`/api/v3/ticker/price?symbol=${symbol}${value}`);
            const precoFloat = parseFloat(response.data.price);
            setPreco(precoFloat);
        } catch (error) {
            console.error('Ops! Ocorreu um erro: ' + error);
        }
    };
    //Função para atualizar preço da moeda via WebSocket
    useEffect(() => {

        fetchPreco();

        const ws = connectWebSocket(symbol, value, (data) => {
            const precoAtual = parseFloat(data.p);
            setPreco(precoAtual);
        });
        return () => {
            ws.close();
        };
    }, [symbol, value]);


    const moeda = value === 'BRL' ? 'R$' : value === 'EUR' ? '€' : '$';

    const formatarPreco = (preco) => {
        return new Intl.NumberFormat('pt-BR', {
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