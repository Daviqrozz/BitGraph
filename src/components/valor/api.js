import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.binance.com/',
});

export default api;

/**
 * Retorna o sufixo de câmbio minúsculo para streams de WebSocket na Binance.
 * Ex: USD -> 'usdt', BRL -> 'brl', EUR -> 'eur'
 */
export const getExchange = (currency) => {
  if (currency === 'BRL') return 'brl';
  if (currency === 'EUR') return 'eur';
  return 'usdt';
};

/**
 * Retorna o símbolo de cotação maiúsculo para requisições REST na Binance.
 * Ex: USD -> 'USDT' (pois a Binance não possui pares com USD fiat no spot), BRL -> 'BRL', EUR -> 'EUR'
 */
export const getQuoteAsset = (currency) => {
  if (currency === 'BRL') return 'BRL';
  if (currency === 'EUR') return 'EUR';
  return 'USDT';
};

/**
 * Conecta a um WebSocket de símbolo único com reconexão automática por backoff exponencial.
 * @param {string} symbol - Ex: 'BTC'
 * @param {string} currency - Ex: 'USD', 'BRL', 'EUR'
 * @param {(data: object) => void} onMessage - Callback com os dados do trade
 * @param {(error: Event) => void} [onError] - Callback opcional para erros
 * @returns {{ close: () => void }} Objeto com método close()
 */
export const connectWebSocket = (symbol, currency, onMessage, onError) => {
  const exchange = getExchange(currency);
  let ws = null;
  let delay = 1000; // ms — backoff inicial
  let isManuallyClosed = false;

  const connect = () => {
    if (isManuallyClosed) return;

    const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}${exchange}@trade`;
    ws = new WebSocket(url);

    ws.onopen = () => {
      delay = 1000; // Reset do backoff após conexão bem-sucedida
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error(`[WS] Erro ao parsear mensagem (${symbol}):`, err);
      }
    };

    ws.onclose = () => {
      if (!isManuallyClosed) {
        console.warn(`[WS] Conexão fechada (${symbol}${exchange}). Reconectando em ${delay}ms...`);
        setTimeout(connect, delay);
        delay = Math.min(delay * 2, 30000); // Backoff exponencial, máximo 30s
      }
    };

    ws.onerror = (error) => {
      if (isManuallyClosed) return;
      console.error(`[WS] Erro na conexão (${symbol}${exchange}):`, error);
      if (onError) onError(error);
    };
  };

  connect();

  return {
    close: () => {
      isManuallyClosed = true;
      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
          // Se ainda estiver conectando, fecha assim que abrir para evitar warning do navegador
          ws.onopen = () => ws.close();
        }
      }
    },
  };
};

/**
 * Conecta a um stream combinado da Binance para múltiplos símbolos em uma única conexão.
 *
 * @param {string[]} symbols - Ex: ['BTC', 'ETH', 'BNB']
 * @param {string} currency - Ex: 'USD', 'BRL', 'EUR'
 * @param {(stream: string, data: object) => void} onMessage - Callback com nome do stream e dados
 * @param {(error: Event) => void} [onError]
 * @returns {{ close: () => void }}
 */
export const connectCombinedStream = (symbols, currency, onMessage, onError) => {
  const exchange = getExchange(currency);
  const streams = symbols
    .map((s) => `${s.toLowerCase()}${exchange}@trade`)
    .join('/');

  let ws = null;
  let delay = 1000;
  let isManuallyClosed = false;

  const connect = () => {
    if (isManuallyClosed) return;

    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    ws = new WebSocket(url);

    ws.onopen = () => {
      delay = 1000;
    };

    ws.onmessage = (event) => {
      try {
        const { stream, data } = JSON.parse(event.data);
        onMessage(stream, data);
      } catch (err) {
        console.error('[WS Combined] Erro ao parsear mensagem:', err);
      }
    };

    ws.onclose = () => {
      if (!isManuallyClosed) {
        console.warn(`[WS Combined] Conexão fechada. Reconectando em ${delay}ms...`);
        setTimeout(connect, delay);
        delay = Math.min(delay * 2, 30000);
      }
    };

    ws.onerror = (error) => {
      if (isManuallyClosed) return;
      console.error('[WS Combined] Erro na conexão:', error);
      if (onError) onError(error);
    };
  };

  connect();

  return {
    close: () => {
      isManuallyClosed = true;
      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
          ws.onopen = () => ws.close();
        }
      }
    },
  };
};
