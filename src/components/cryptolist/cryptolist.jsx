import { useState } from 'react';

export default function CryptoList() {
    const [cryptos] = useState([
        { id: 0, name: 'Bitcoin', image: 'bitcoin.png', value: '$27,000' },
        { id: 1, name: 'Ethereum', image: 'ethereum.png', value: '$1,800' },
        { id: 2, name: 'Ripple', image: 'ripple.png', value: '$0.52' },
        { id: 3, name: 'Cardano', image: 'cardano.png', value: '$0.28' }
    ]);

    return (
        <div className="card flex md:justify-content-center">
            <ul className="bg-dark text-white m-0 p-0 list-unstyled border-1 surface-border border-round p-3 flex flex-column gap-3 w-full md:w-60rem">
                {cryptos.map((crypto) => (
                    <li
                        key={crypto.id}
                        className="p-3 hover:surface-hover border-round border-1 border-transparent transition-all transition-duration-200 flex align-items-center justify-content-between w-full"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                       
                        <div className="flex align-items-center gap-2" style={{ justifyContent: 'flex-start' }}>
                            <img
                                alt={crypto.name}
                                src={`https://primefaces.org/cdn/primereact/images/avatar/${crypto.image}`}
                                style={{ width: '32px', height: '32px' }}
                            />
                            <span className="font-bold">{crypto.name}</span>
                        </div>


                        <span className="font-bold" style={{ justifySelf: 'flex-end' }}>
                            {crypto.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
