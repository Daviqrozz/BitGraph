import { useState } from 'react';
import Valor from '../valor/valor';
import { Link } from 'react-router-dom';

export default function TopCryptoList() {
    const [cryptos] = useState([
        { id: 0, name: 'Bitcoin', image: 'criptomoeda.png', symbol: 'BTC', href: '/chart/BTC' },
        { id: 1, name: 'Ethereum', image: 'ethereum.png', symbol: 'ETH', href: '/chart/ETH' },
        { id: 2, name: 'BNB', image: 'bnb.png', symbol: 'BNB', href: '/chart/BNB' },
        { id: 3, name: 'Cardano', image: 'cardano.png', symbol: 'ADA', href: '/chart/ADA' },
    ]);

    return (
        <div className="card flex md:justify-content-center " style={{ width: '100%', maxWidth: '30%' }}>
            <ul
                className="bg-dark text-white m-0 p-0 list-unstyled border-1 surface-border border-round p-3 flex flex-column gap-3 w-full"
                style={{ width: '100%', maxWidth: '1000px' }}
            >
                {cryptos.map((crypto) => (
                    <Link to={crypto.href} key={crypto.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <li
                            className="p-3 hover:surface-hover border-round border-1 border-transparent transition-all transition-duration-200 flex align-items-center justify-content-between w-full"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <div className="flex align-items-center gap-3" style={{ justifyContent: 'flex-start' }}>
                                <img
                                    alt={crypto.name}
                                    src={`/CryptoIcons/${crypto.image}`}
                                    style={{ width: '32px', height: '32px' }}
                                />
                                <span className="font-bold">{crypto.name}</span>
                            </div>
                            <span className="font-bold" style={{ justifySelf: 'flex-end' }}>
                                <Valor symbol={crypto.symbol} />
                            </span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}