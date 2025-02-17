import { MyContext } from '../../Context';



export const connectWebSocket = (symbol, onMessage) => {  
    //Configurar filtro de moeda e cambio do web socket
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}brl@trade`);
    //const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}${value}@trade`)
    //Logs do WebSocket
    ws.onopen = () => {
      console.log('Conexão WebSocket aberta!');
      console.log('Moeda:', symbol)
      //console.log('Câmbio:', value)
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
  
    ws.onclose = () => {
      console.log('Conexão WebSocket fechada.');
    };
  
    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };
  
    return ws; 
  };

