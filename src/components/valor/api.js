// api.js
export const connectWebSocket = (symbol, onMessage) => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
  
    ws.onopen = () => {
      console.log('Conexão WebSocket aberta!');
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data); // Chama a função de callback com os dados recebidos
    };
  
    ws.onclose = () => {
      console.log('Conexão WebSocket fechada.');
    };
  
    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };
  
    return ws; // Retorna a instância do WebSocket
  };

