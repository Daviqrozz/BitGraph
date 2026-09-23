import { useState, useEffect, useRef } from 'react';
import api, { connectCombinedStream, getExchange, getQuoteAsset } from '../components/valor/api';

/**
 * Hook para buscar preços de múltiplas criptomoedas usando um único WebSocket combinado.
 * Substitui N conexões independentes por 1 conexão eficiente via Combined Streams da Binance.
 *
 * @param {string[]} symbols - Ex: ['BTC', 'ETH', 'BNB', 'ADA']
 * @param {string} currency - Ex: 'USD', 'BRL', 'EUR'
 * @returns {{ prices: Record<string, number>, erro: string | null, carregando: boolean }}
 */
export function useCombinedCryptoPrices(symbols, currency) {
  const [prices, setPrices] = useState({});
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Throttle por símbolo (evita re-renders excessivos para cada trade)
  const throttleRefs = useRef({});
  // Controla race condition: WS tem prioridade sobre dados do REST
  const wsReceivedRef = useRef({});

  // Serializa o array para estabilidade no useEffect
  const symbolsKey = symbols ? JSON.stringify([...symbols].sort()) : '';

  useEffect(() => {
    if (!symbolsKey || !currency) return;

    const parsedSymbols = JSON.parse(symbolsKey);
    const quoteAsset = getQuoteAsset(currency);
    const exchange = getExchange(currency);

    // Reset ao trocar moeda
    wsReceivedRef.current = {};
    setPrices({});
    setCarregando(true);
    setErro(null);

    const controller = new AbortController();

    // Busca preços iniciais de todos os símbolos em lote via REST
    const fetchAll = async () => {
      try {
        const symbolsList = parsedSymbols.map((s) => `"${s}${quoteAsset}"`).join(',');
        const response = await api.get(
          `/api/v3/ticker/price?symbols=[${symbolsList}]`,
          { signal: controller.signal }
        );

        const initialPrices = {};
        if (Array.isArray(response.data)) {
          response.data.forEach(({ symbol: pair, price }) => {
            const sym = pair.replace(quoteAsset, '');
            if (!wsReceivedRef.current[sym]) {
              initialPrices[sym] = parseFloat(price);
            }
          });
        }

        setPrices((prev) => ({ ...prev, ...initialPrices }));
        setErro(null);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;
        console.error('[Combined API] Erro ao buscar preços iniciais:', error);
        setErro('Falha ao carregar preços via REST. Aguardando WebSocket...');
      } finally {
        setCarregando(false);
      }
    };

    fetchAll();

    const ws = connectCombinedStream(
      parsedSymbols,
      currency,
      (stream, data) => {
        // data.s ex: "BTCUSDT" ou "BTCBRL"
        const sym = data?.s
          ? data.s.replace(quoteAsset, '')
          : stream.replace(`${exchange}@trade`, '').toUpperCase();

        wsReceivedRef.current[sym] = true;
        setCarregando(false);
        setErro(null); // Limpa qualquer erro prévio pois os dados em tempo real estão chegando

        // Throttle por símbolo: atualiza imediatamente, ignora trades repetidos nos próximos 500ms
        if (!throttleRefs.current[sym]) {
          setPrices((prev) => ({ ...prev, [sym]: parseFloat(data.p) }));
          throttleRefs.current[sym] = setTimeout(() => {
            delete throttleRefs.current[sym];
          }, 500);
        }
      },
      () => {
        // Erro de conexão tratado pelo backoff automático em api.js
      }
    );

    return () => {
      controller.abort();
      Object.values(throttleRefs.current).forEach(clearTimeout);
      throttleRefs.current = {};
      ws.close();
    };
  }, [symbolsKey, currency]);

  return { prices, erro, carregando };
}
