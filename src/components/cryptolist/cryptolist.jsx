import { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../hooks/Context';
import { useCombinedCryptoPrices } from '../../hooks/useCombinedCryptoPrices';
import { formatarPreco } from '../../hooks/useCryptoPrice';

// Lista completa de criptomoedas monitoradas
const CRYPTOS = [
  { rank: 1,  name: 'Bitcoin',   symbol: 'BTC',  icon: '₿',  iconColor: '#f7931a', sparkPath: 'M0 24 Q 25 20, 45 10 T 75 14 T 100 4',  positive: true  },
  { rank: 2,  name: 'Ethereum',  symbol: 'ETH',  icon: '♦',  iconColor: '#3b82f6', sparkPath: 'M0 18 Q 20 22, 50 14 T 80 8 T 100 6',   positive: true  },
  { rank: 3,  name: 'BNB',       symbol: 'BNB',  icon: '⬡',  iconColor: '#f3ba2f', sparkPath: 'M0 8 Q 30 10, 55 18 T 80 20 T 100 24',  positive: false },
  { rank: 4,  name: 'Solana',    symbol: 'SOL',  icon: '◎',  iconColor: '#9945ff', sparkPath: 'M0 26 Q 30 18, 50 15 T 80 8 T 100 3',   positive: true  },
  { rank: 5,  name: 'Cardano',   symbol: 'ADA',  icon: '₳',  iconColor: '#3b5998', sparkPath: 'M0 16 Q 25 14, 50 18 T 80 12 T 100 10',  positive: true  },
  { rank: 6,  name: 'Ripple',    symbol: 'XRP',  icon: '✕',  iconColor: '#00aae4', sparkPath: 'M0 10 Q 30 14, 55 12 T 80 22 T 100 24',  positive: false },
  { rank: 7,  name: 'Dogecoin',  symbol: 'DOGE', icon: 'Ð',  iconColor: '#c3a634', sparkPath: 'M0 25 Q 35 20, 60 14 T 80 8 T 100 5',   positive: true  },
];

const SYMBOLS = CRYPTOS.map((c) => c.symbol);

export default function CryptoList() {
  const { value } = useContext(MyContext);
  const { prices, erro, carregando } = useCombinedCryptoPrices(SYMBOLS, value);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todas');

  const moeda = value === 'BRL' ? 'R$' : value === 'EUR' ? '€' : '$';

  // Filtragem local
  const filtered = useMemo(() => {
    let list = CRYPTOS;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }

    if (filter === 'alta') {
      list = list.filter((c) => c.positive);
    }

    return list;
  }, [search, filter]);

  return (
    <div className="coins-page-layout">
      {/* Page Header */}
      <section className="coins-page-header">
        <div className="coins-page-header-left">
          <h1 className="coins-page-title">Mercado</h1>
          <p className="coins-page-subtitle">
            Cotações consolidadas em tempo real em {value === 'BRL' ? 'Reais (BRL)' : value === 'EUR' ? 'Euros (EUR)' : 'Dólares (USD)'}
          </p>
        </div>
        <div className="coins-page-count">
          {CRYPTOS.length} principais ativos monitorados
        </div>
      </section>

      {/* Toolbar: Search + Filters */}
      <section className="coins-toolbar">
        <div className="coins-search-wrapper">
          <svg className="coins-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
          <input
            id="coins-search-input"
            className="coins-search-input"
            type="text"
            placeholder="Buscar por moeda ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="coins-search-clear"
              onClick={() => setSearch('')}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        <div className="coins-filter-tabs" role="tablist" aria-label="Filtro de moedas">
          {[
            { id: 'todas', label: 'Todas'   },
            { id: 'alta',  label: 'Em Alta' },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              className={`coins-filter-tab${filter === tab.id ? ' coins-filter-tab--active' : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Table */}
      <section className="coins-table-container">
        <div className="coins-table-scroll">
          <table className="coins-table" aria-label="Lista de criptomoedas">
            <thead>
              <tr className="coins-table-head-row">
                <th className="coins-th coins-th--rank" scope="col">#</th>
                <th className="coins-th coins-th--asset" scope="col">Ativo</th>
                <th className="coins-th coins-th--price" scope="col">Preço</th>
                <th className="coins-th coins-th--change" scope="col">Var. 24h</th>
                <th className="coins-th coins-th--spark" scope="col">7 Dias</th>
                <th className="coins-th coins-th--action" scope="col" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="coins-empty">
                    Nenhuma moeda encontrada para &ldquo;{search}&rdquo;
                  </td>
                </tr>
              ) : (
                filtered.map((crypto) => {
                  const preco = prices[crypto.symbol];

                  return (
                    <tr key={crypto.symbol} className="coins-row">
                      <td className="coins-td coins-td--rank">{crypto.rank}</td>

                      <td className="coins-td coins-td--asset">
                        <Link
                          to={`/chart/${crypto.symbol}`}
                          className="coins-asset-link"
                          aria-label={`Ver gráfico de ${crypto.name}`}
                        >
                          <div
                            className="coins-asset-icon"
                            style={{ color: crypto.iconColor, borderColor: `${crypto.iconColor}40` }}
                          >
                            {crypto.icon}
                          </div>
                          <div className="coins-asset-names">
                            <span className="coins-asset-name">{crypto.name}</span>
                            <span className="coins-asset-symbol">{crypto.symbol}</span>
                          </div>
                        </Link>
                      </td>

                      <td className="coins-td coins-td--price">
                        {carregando && preco === undefined ? (
                          <span className="coins-spinner" aria-label="Carregando" />
                        ) : preco !== undefined ? (
                          <span className="coins-price-value">
                            {moeda} {formatarPreco(preco)}
                          </span>
                        ) : erro ? (
                          <span className="coins-price-error" title={erro}>N/D</span>
                        ) : (
                          <span className="coins-spinner" aria-label="Carregando" />
                        )}
                      </td>

                      <td className="coins-td coins-td--change">
                        <span className={`coins-change${crypto.positive ? ' coins-change--up' : ' coins-change--down'}`}>
                          {crypto.positive ? '▲' : '▼'}
                        </span>
                      </td>

                      <td className="coins-td coins-td--spark">
                        <svg
                          className={`coins-spark${crypto.positive ? ' coins-spark--up' : ' coins-spark--down'}`}
                          viewBox="0 0 100 30"
                          fill="none"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path d={crypto.sparkPath} />
                        </svg>
                      </td>

                      <td className="coins-td coins-td--action">
                        <Link
                          to={`/chart/${crypto.symbol}`}
                          className="coins-action-arrow"
                          aria-label={`Abrir gráfico de ${crypto.name}`}
                        >
                          →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="coins-table-footer">
          <span className="coins-table-count">
            {filtered.length} de {CRYPTOS.length} ativos
          </span>
          {erro && (
            <span className="coins-table-error">⚠ {erro}</span>
          )}
        </div>
      </section>
    </div>
  );
}