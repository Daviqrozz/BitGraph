import { useState, useEffect, useRef } from 'react';
import api, { connectCombinedStream, getExchange, getQuoteAsset } from '../components/valor/api';

/**
 * Hook para buscar preços e variação 24h de múltiplas criptomoedas usando um único WebSocket combinado.
 * Substitui N conexões independentes por 1 conexão eficiente via Combined Streams da Binance.
 *
 * @param {string[]} symbols - Ex: ['BTC', 'ETH', 'BNB', 'ADA']
 * @param {string} currency - Ex: 'USD', 'BRL', 'EUR'
 * @returns {{ prices: Record<string, number>, changes24h: Record<string, number>, erro: string | null, carregando: boolean }}
 */
export function useCombinedCryptoPrices(symbols, currency) {
  const [prices, setPrices] = useState({});
  const [changes24h, setChanges24h] = useState({});
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Throttle por símbolo (evita re-renders excessivos)
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
    setChanges24h({});
    setCarregando(true);
    setErro(null);

    const controller = new AbortController();

    // Busca preços e variações 24h iniciais em lote via REST (/ticker/24hr)
    const fetchAll = async () => {
      try {
        const symbolsList = parsedSymbols.map((s) => `"${s}${quoteAsset}"`).join(',');
        const response = await api.get(
          `/api/v3/ticker/24hr?symbols=[${symbolsList}]`,
          { signal: controller.signal }
        );

        const initialPrices = {};
        const initialChanges = {};
        if (Array.isArray(response.data)) {
          response.data.forEach(({ symbol: pair, lastPrice, priceChangePercent }) => {
            const sym = pair.replace(quoteAsset, '');
            if (!wsReceivedRef.current[sym]) {
              initialPrices[sym] = parseFloat(lastPrice);
            }
            initialChanges[sym] = parseFloat(priceChangePercent);
          });
        }

        setPrices((prev) => ({ ...prev, ...initialPrices }));
        setChanges24h((prev) => ({ ...prev, ...initialChanges }));
        setErro(null);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;
        console.error('[Combined API] Erro ao buscar dados 24h iniciais:', error);
        setErro('Falha ao carregar dados via REST. Aguardando WebSocket...');
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
          : stream.replace(`${exchange}@ticker`, '').replace(`${exchange}@trade`, '').toUpperCase();

        wsReceivedRef.current[sym] = true;
        setCarregando(false);
        setErro(null);

        // Preço atual (c no ticker, p no trade)
        const priceVal = data?.c != null ? parseFloat(data.c) : (data?.p != null ? parseFloat(data.p) : null);
        // Variação 24h percentual (P no ticker)
        const changeVal = data?.P != null ? parseFloat(data.P) : null;

        // Throttle por símbolo para atualizações suaves
        if (!throttleRefs.current[sym]) {
          if (priceVal !== null && !isNaN(priceVal)) {
            setPrices((prev) => ({ ...prev, [sym]: priceVal }));
          }
          if (changeVal !== null && !isNaN(changeVal)) {
            setChanges24h((prev) => ({ ...prev, [sym]: changeVal }));
          }
          throttleRefs.current[sym] = setTimeout(() => {
            delete throttleRefs.current[sym];
          }, 400);
        }
      },
      () => {
        // Erro tratado com reconexão automática
      },
      'ticker'
    );

    return () => {
      controller.abort();
      Object.values(throttleRefs.current).forEach(clearTimeout);
      throttleRefs.current = {};
      ws.close();
    };
  }, [symbolsKey, currency]);

  return { prices, changes24h, erro, carregando };
}
