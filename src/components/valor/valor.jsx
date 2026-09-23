import React, { useContext } from 'react';
import './valor.css';
import { MyContext } from '../../hooks/Context';
import { useCryptoPrice, formatarPreco } from '../../hooks/useCryptoPrice';

function Valor({ symbol }) {
  const { value } = useContext(MyContext);
  const { preco, erro } = useCryptoPrice(symbol, value);

  const moeda = value === 'BRL' ? 'R$' : value === 'EUR' ? '€' : '$';

  return (
    <div className="valor_box">
      {preco !== null ? (
        <span>
          {moeda}
          {formatarPreco(preco)}
        </span>
      ) : erro ? (
        <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }} title={erro}>
          N/D
        </span>
      ) : (
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem' }} />
      )}
    </div>
  );
}

export default Valor;