import React from 'react';
import TradingViewWidget from '../components/graph/graph';
import { useParams } from 'react-router-dom';
import Header from '../components/cabeçalho/header';

function Chart() {
    const { symbol } = useParams();

    return (
        <div className='bg-black text-white vh-100'>
            <Header />
            <TradingViewWidget symbol={symbol} />
            <p className='text-center'>Grafico em tempo real do {symbol}</p>
        </div>
    );
}

export default Chart;