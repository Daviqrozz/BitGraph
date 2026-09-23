import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../hooks/Context';
import { useCombinedCryptoPrices } from '../../hooks/useCombinedCryptoPrices';
import { formatarPreco } from '../../hooks/useCryptoPrice';

// Lista estática de criptomoedas da home — definida fora do componente para referência estável
const CRYPTOS = [
  {
    id: 0,
    name: 'Bitcoin',
    symbol: 'BTC',
    href: '/chart/BTC',
    image: 'criptomoeda.png',
    iconColor: '#f7931a',
  },
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    href: '/chart/ETH',
    image: 'ethereum.png',
    iconColor: '#3b82f6',
  },
  {
    id: 2,
    name: 'BNB',
    symbol: 'BNB',
    href: '/chart/BNB',
    image: 'bnb.png',
    iconColor: '#f3ba2f',
  },
  {
    id: 3,
    name: 'Cardano',
    symbol: 'ADA',
    href: '/chart/ADA',
    image: 'cardano.png',
    iconColor: '#3b5998',
  },
];

// Array de símbolos estável
const SYMBOLS = CRYPTOS.map((c) => c.symbol);

export default function TopCryptoList() {
  const { value } = useContext(MyContext);

  // 1 único WebSocket combinado para todos os símbolos
  const { prices, erro, carregando } = useCombinedCryptoPrices(SYMBOLS, value);

  const moeda = value === 'BRL' ? 'R$' : value === 'EUR' ? '€' : '$';

  return (
    <div className="crypto-card">
      <ul className="crypto-list">
        {CRYPTOS.map((crypto) => {
          const preco = prices[crypto.symbol];

          return (
            <Link
              to={crypto.href}
              key={crypto.id}
              className="crypto-item"
              aria-label={`Ver gráfico de ${crypto.name}`}
            >
              {/* Left: icon + name */}
              <div className="crypto-item-left">
                <div
                  className="crypto-icon"
                  style={{ backgroundColor: crypto.iconColor }}
                >
                  <img
                    alt={crypto.name}
                    src={`/CryptoIcons/${crypto.image}`}
                  />
                </div>
                <span className="crypto-name">{crypto.name}</span>
              </div>

              {/* Right: price */}
              <div className="crypto-price">
                {preco !== undefined ? (
                  <span>
                    {moeda}
                    {formatarPreco(preco)}
                  </span>
                ) : erro ? (
                  <span className="crypto-price-error" title={erro}>
                    N/D
                  </span>
                ) : (
                  <span className="crypto-spinner" aria-label="Carregando preço" />
                )}
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}