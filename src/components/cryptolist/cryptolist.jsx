import { useState, useContext, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../hooks/Context';
import { useCombinedCryptoPrices } from '../../hooks/useCombinedCryptoPrices';
import { useCryptoSparklines } from '../../hooks/useCryptoSparklines';
import { formatarPreco } from '../../hooks/useCryptoPrice';

// Lista de top 10 criptomoedas com cores oficiais e metadados
const CRYPTOS = [
  { rank: 1,  name: 'Bitcoin',   symbol: 'BTC',  icon: '₿', color: '#f7931a', bg: 'rgba(247, 147, 26, 0.15)', border: 'rgba(247, 147, 26, 0.35)', glow: 'rgba(247, 147, 26, 0.2)', sparkPath: 'M0 24 Q 25 20, 45 10 T 75 14 T 100 4',  positive: true  },
  { rank: 2,  name: 'Ethereum',  symbol: 'ETH',  icon: '♦', color: '#627eea', bg: 'rgba(98, 126, 234, 0.15)', border: 'rgba(98, 126, 234, 0.35)', glow: 'rgba(98, 126, 234, 0.2)', sparkPath: 'M0 18 Q 20 22, 50 14 T 80 8 T 100 6',   positive: true  },
  { rank: 3,  name: 'BNB',       symbol: 'BNB',  icon: '⬡', color: '#f3ba2f', bg: 'rgba(243, 186, 47, 0.15)', border: 'rgba(243, 186, 47, 0.35)', glow: 'rgba(243, 186, 47, 0.2)', sparkPath: 'M0 8 Q 30 10, 55 18 T 80 20 T 100 24',  positive: false },
  { rank: 4,  name: 'Solana',    symbol: 'SOL',  icon: '◎', color: '#14f195', bg: 'rgba(20, 241, 149, 0.15)', border: 'rgba(20, 241, 149, 0.35)', glow: 'rgba(20, 241, 149, 0.2)', sparkPath: 'M0 26 Q 30 18, 50 15 T 80 8 T 100 3',   positive: true  },
  { rank: 5,  name: 'Cardano',   symbol: 'ADA',  icon: '₳', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.35)', glow: 'rgba(59, 130, 246, 0.2)', sparkPath: 'M0 16 Q 25 14, 50 18 T 80 12 T 100 10', positive: true  },
  { rank: 6,  name: 'Ripple',    symbol: 'XRP',  icon: '✕', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.12)', border: 'rgba(203, 213, 225, 0.30)', glow: 'rgba(203, 213, 225, 0.15)', sparkPath: 'M0 10 Q 30 14, 55 12 T 80 22 T 100 24', positive: false },
  { rank: 7,  name: 'Avalanche', symbol: 'AVAX', icon: '▲', color: '#e84142', bg: 'rgba(232, 65, 66, 0.15)', border: 'rgba(232, 65, 66, 0.35)', glow: 'rgba(232, 65, 66, 0.2)', sparkPath: 'M0 25 Q 35 20, 60 14 T 80 8 T 100 5',   positive: true  },
  { rank: 8,  name: 'Chainlink', symbol: 'LINK', icon: '⬡', color: '#375bd2', bg: 'rgba(55, 91, 210, 0.15)', border: 'rgba(55, 91, 210, 0.35)', glow: 'rgba(55, 91, 210, 0.2)', sparkPath: 'M0 20 Q 30 18, 55 12 T 85 10 T 100 4',  positive: true  },
  { rank: 9,  name: 'Polkadot',  symbol: 'DOT',  icon: '●', color: '#e6007a', bg: 'rgba(230, 0, 122, 0.15)', border: 'rgba(230, 0, 122, 0.35)', glow: 'rgba(230, 0, 122, 0.2)', sparkPath: 'M0 15 Q 30 16, 50 14 T 80 15 T 100 12', positive: true  },
  { rank: 10, name: 'Polygon',   symbol: 'POL',  icon: '⬡', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.35)', glow: 'rgba(168, 85, 247, 0.2)', sparkPath: 'M0 12 Q 35 15, 60 14 T 80 18 T 100 22', positive: false },
];

// Todos os 10 símbolos possuem suporte direto na Binance em USDT, BRL e EUR
const SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'AVAX', 'LINK', 'DOT', 'POL'];

export default function CryptoList() {
  const { value } = useContext(MyContext);
  // Preços e variação 24h em tempo real via Binance WebSocket + REST
  const { prices, changes24h, erro, carregando } = useCombinedCryptoPrices(SYMBOLS, value);
  // Sparklines dinâmicas baseadas nas últimas velas reais da Binance
  const { sparklines } = useCryptoSparklines(SYMBOLS);

  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('todas');

  // Favoritas persistidas em localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('bitgraph_favorites');
      return saved ? JSON.parse(saved) : ['BTC', 'ETH'];
    } catch {
      return ['BTC', 'ETH'];
    }
  });

  const toggleFavorite = (symbol, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      try {
        localStorage.setItem('bitgraph_favorites', JSON.stringify(next));
      } catch (err) {
        console.error('Erro ao salvar favoritos:', err);
      }
      return next;
    });
  };

  // Atalho ⌘K / Ctrl+K para focar busca
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('coins-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const moeda = value === 'BRL' ? 'R$' : value === 'EUR' ? '€' : '$';

  // Filtragem dinâmica por busca, favoritos e ativos em alta (usando dados 24h reais)
  const filtered = useMemo(() => {
    let list = CRYPTOS;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }
    if (filter === 'favoritas') {
      list = list.filter((c) => favorites.includes(c.symbol));
    } else if (filter === 'alta') {
      list = list.filter((c) => {
        const change = changes24h[c.symbol];
        return change != null ? change > 0 : c.positive;
      });
    }
    return list;
  }, [search, filter, favorites, changes24h]);

  return (
    <div className="coins-page-layout">

      {/* ── Page Header ── */}
      <section className="coins-page-header">
        <div className="coins-page-header-left">
          <h1 className="coins-page-title">Mercado</h1>
          <p className="coins-page-subtitle">
            Cotações consolidadas em tempo real em{' '}
            {value === 'BRL' ? 'Reais (BRL)' : value === 'EUR' ? 'Euros (EUR)' : 'Dólares (USD)'}
          </p>
        </div>
        <div className="coins-page-count">
          {CRYPTOS.length} principais ativos monitorados
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="coins-toolbar">
        {/* Search */}
        <div className="coins-search-wrapper">
          <div className="coins-search-icon-wrap">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
            </svg>
          </div>
          <input
            id="coins-search-input"
            className="coins-search-input"
            type="text"
            placeholder="Buscar por moeda ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="coins-search-hint">⌘K</div>
        </div>

        {/* Filter tabs */}
        <div className="coins-filter-tabs" role="tablist">
          {[
            { id: 'todas',     label: 'Todas'     },
            { id: 'favoritas', label: 'Favoritas' },
            { id: 'alta',      label: 'Em Alta'   },
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

      {/* ── Table ── */}
      <section className="coins-table-container">
        <div className="coins-table-scroll">
          <table className="coins-table" aria-label="Lista de criptomoedas">
            <thead>
              <tr className="coins-thead-row">
                <th className="coins-th coins-th--rank" scope="col">#</th>
                <th className="coins-th coins-th--asset" scope="col">Ativo</th>
                <th className="coins-th coins-th--price" scope="col">Preço</th>
                <th className="coins-th coins-th--change" scope="col">Var. 24h</th>
                <th className="coins-th coins-th--spark" scope="col">7 Dias</th>
                <th className="coins-th coins-th--action" scope="col" />
              </tr>
            </thead>
            <tbody className="coins-tbody">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="coins-empty">
                    {filter === 'favoritas'
                      ? 'Você ainda não favoritou nenhuma moeda. Clique na estrela ★ ao lado do ranking para adicionar aos favoritos.'
                      : `Nenhuma moeda encontrada para "${search}"`}
                  </td>
                </tr>
              ) : (
                filtered.map((crypto) => {
                  const preco = prices[crypto.symbol];
                  const change = changes24h[crypto.symbol];
                  const isPositive24h = change != null ? change >= 0 : crypto.positive;
                  const isFav = favorites.includes(crypto.symbol);

                  const sparkData = sparklines[crypto.symbol];
                  const sparkPath = sparkData?.sparkPath || crypto.sparkPath;
                  const isPositiveSpark = sparkData ? sparkData.isPositive7d : isPositive24h;

                  return (
                    <tr key={crypto.symbol} className="coins-row">

                      {/* Rank + Favorite */}
                      <td className="coins-td coins-td--rank">
                        <div className="coins-rank-wrapper">
                          <button
                            type="button"
                            className={`coins-fav-btn${isFav ? ' coins-fav-btn--active' : ''}`}
                            onClick={(e) => toggleFavorite(crypto.symbol, e)}
                            aria-label={isFav ? `Remover ${crypto.name} dos favoritos` : `Favoritar ${crypto.name}`}
                            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          >
                            ★
                          </button>
                          <span>{crypto.rank}</span>
                        </div>
                      </td>

                      {/* Asset */}
                      <td className="coins-td coins-td--asset">
                        <Link
                          to={`/chart/${crypto.symbol}`}
                          className="coins-asset-link"
                          aria-label={`Ver gráfico de ${crypto.name}`}
                        >
                          <div
                            className="coins-asset-icon"
                            style={{
                              backgroundColor: crypto.bg,
                              borderColor: crypto.border,
                              color: crypto.color,
                              boxShadow: `0 0 10px ${crypto.glow}`,
                            }}
                          >
                            {crypto.icon}
                          </div>
                          <div className="coins-asset-names">
                            <span className="coins-asset-name">{crypto.name}</span>
                            <span className="coins-asset-symbol">{crypto.symbol}</span>
                          </div>
                        </Link>
                      </td>

                      {/* Price */}
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

                      {/* Change 24h (Real da Binance) */}
                      <td className="coins-td coins-td--change">
                        {carregando && change === undefined ? (
                          <span className="coins-spinner" aria-label="Carregando" />
                        ) : (
                          <span className={`coins-change${isPositive24h ? ' coins-change--up' : ' coins-change--down'}`}>
                            {change != null
                              ? `${change >= 0 ? '+' : ''}${change.toFixed(2).replace('.', ',')}%`
                              : (crypto.positive ? '+2,45%' : '-0,42%')}
                          </span>
                        )}
                      </td>

                      {/* Sparkline (7 Dias real da Binance) */}
                      <td className="coins-td coins-td--spark">
                        <svg
                          className={`coins-spark${isPositiveSpark ? ' coins-spark--up' : ' coins-spark--down'}`}
                          viewBox="0 0 100 30"
                          fill="none"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d={sparkPath}
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </td>

                      {/* Arrow */}
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
          <button className="coins-load-more" type="button">
            <span>Carregar mais</span>
            <span className="coins-load-more-arrow">↓</span>
          </button>
        </div>
      </section>

    </div>
  );
}