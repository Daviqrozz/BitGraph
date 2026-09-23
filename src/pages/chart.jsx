import React from 'react';
import TradingViewWidget from '../components/graph/graph';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/cabeçalho/header';

/**
 * Whitelist de símbolos válidos com par disponível na Binance.
 * Nota: pares EUR (ex: BTCEUR) foram descontinuados pela Binance em 2023.
 * A seleção de moeda EUR no header pode resultar em par indisponível,
 * sendo exibido "N/D" nos componentes de preço.
 */
const VALID_SYMBOLS = [
  'BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'XRP', 'DOT', 'AVAX',
  'MATIC', 'LINK', 'LTC', 'UNI', 'ATOM', 'DOGE', 'SHIB',
  'TRX', 'NEAR', 'ICP', 'FIL', 'ETC',
];

function Chart() {
  const { symbol } = useParams();
  const upperSymbol = symbol?.toUpperCase();

  // Redireciona para home se o símbolo for inválido ou não reconhecido
  if (!upperSymbol || !VALID_SYMBOLS.includes(upperSymbol)) {
    console.warn(`[Chart] Símbolo inválido ou não suportado: "${symbol}". Redirecionando.`);
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="chart-page">
        <TradingViewWidget symbol={upperSymbol} />
        <p className="chart-subtitle">Gráfico em tempo real de {upperSymbol}</p>
      </div>
    </div>
  );
}

export default Chart;