import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.binance.com/'
})
export default api


export const connectWebSocket = (symbol, value, onMessage) => {
  const exchange = value === 'BRL' ? 'brl' : value === 'EUR' ? 'eur' : 'usdt';
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}${exchange}@trade`)
  //Logs do WebSocket
  ws.onopen = () => {
    console.log('Conexão WebSocket aberta!');
    //console.log('Moeda:', symbol.toLowerCase())
    //console.log('Câmbio:', exchange)
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onclose = () => {
    console.log('Conexão WebSocket fechada.');
  };

  ws.onerror = (error) => {
    //console.error('Erro no WebSocket:', error);
  };

  return ws;
};

