import { useState, useEffect, useCallback, useRef } from 'react';
import api, { connectWebSocket, getQuoteAsset } from '../components/valor/api';

/**
 * Formata um preço com casas decimais dinâmicas baseadas no valor.
 * - >= 10.000  → 2 casas  (ex: BTC, ETH)
 * - >= 1       → 4 casas  (ex: BNB, SOL)
 * - < 1        → 6 casas  (ex: ADA, DOGE)
 */
export const formatarPreco = (preco) => {
  if (preco === null || preco === undefined) return '-';
  let decimals;
  if (preco >= 10000) decimals = 2;
  else if (preco >= 1) decimals = 2;
  else decimals = 6;

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(preco);
};

/**
 * Hook para buscar e manter o preço de uma criptomoeda atualizado em tempo real.
 *
 * @param {string} symbol - Ex: 'BTC'
 * @param {string} currency - Ex: 'USD', 'BRL', 'EUR'
 * @returns {{ preco: number | null, erro: string | null, carregando: boolean }}
 */
export function useCryptoPrice(symbol, currency) {
  const [preco, setPreco] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Evita race condition: o dado do WS (mais recente) tem prioridade sobre o REST
  const wsReceivedRef = useRef(false);
  // Throttle das atualizações do WebSocket (leading-edge, 500ms)
  const throttleRef = useRef(null);

  const updatePrecoThrottled = useCallback((novoPreco) => {
    if (!throttleRef.current) {
      setPreco(novoPreco);
      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;
      }, 500);
    }
  }, []);

  const fetchPreco = useCallback(
    async (signal, onSuccess) => {
      try {
        const quoteAsset = getQuoteAsset(currency);
        const response = await api.get(
          `/api/v3/ticker/price?symbol=${symbol}${quoteAsset}`,
          { signal }
        );
        const precoAtual = parseFloat(response.data.price);
        setErro(null);
        if (onSuccess) {
          onSuccess(precoAtual);
        } else {
          setPreco(precoAtual);
        }
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;
        console.error(`[API] Erro ao buscar preço de ${symbol}/${currency}:`, error);
        setErro(`Par ${symbol}/${currency} indisponível`);
      } finally {
        setCarregando(false);
      }
    },
    [symbol, currency]
  );

  useEffect(() => {
    if (!symbol || !currency) return;

    wsReceivedRef.current = false;
    setCarregando(true);
    setErro(null);
    setPreco(null);

    const controller = new AbortController();

    fetchPreco(controller.signal, (precoREST) => {
      if (!wsReceivedRef.current) {
        setPreco(precoREST);
      }
    });

    const ws = connectWebSocket(
      symbol,
      currency,
      (data) => {
        wsReceivedRef.current = true;
        setCarregando(false);
        setErro(null);
        updatePrecoThrottled(parseFloat(data.p));
      },
      () => {
        // Erro já logado em api.js
      }
    );

    return () => {
      controller.abort();
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
      ws.close();
    };
  }, [symbol, currency, fetchPreco, updatePrecoThrottled]);

  return { preco, erro, carregando };
}
