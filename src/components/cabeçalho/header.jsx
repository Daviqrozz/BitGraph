import React, { useContext, useState, useRef, useEffect } from 'react';
import Side from './sidebar';
import { MyContext } from '../../hooks/Context';
import { Link } from 'react-router-dom';

const CURRENCIES = [
  { value: 'BRL', label: 'BRL', symbol: 'R$' },
  { value: 'USD', label: 'USD', symbol:  '$' },
  { value: 'EUR', label: 'EUR', symbol:  '€' },
];

function Header() {
  const { value, setValue } = useContext(MyContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selected = CURRENCIES.find((c) => c.value === value) || CURRENCIES[0];

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-header">
      <div className="header-inner">

        {/* ---- Logo ---- */}
        <Link to="/" className="logo-link">
          <div className="logo-wordmark">
            <span className="logo-name">
              <span className="logo-symbol">₿</span>itGraph
            </span>
          </div>
        </Link>

        {/* ---- Actions ---- */}
        <div className="header-actions">

          {/* Currency selector */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              id="currency-toggle-btn"
              className="currency-btn"
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span className="curr-symbol">{selected.symbol}</span>
              <span style={{ fontWeight: 500, color: '#d4d4d4' }}>{selected.label}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  marginLeft: 2,
                  color: '#737373',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="currency-dropdown" role="listbox">
                {CURRENCIES.map((cur) => (
                  <button
                    key={cur.value}
                    className={`currency-dropdown-item${value === cur.value ? ' active' : ''}`}
                    role="option"
                    aria-selected={value === cur.value}
                    onClick={() => {
                      setValue(cur.value);
                      setDropdownOpen(false);
                    }}
                  >
                    <span style={{ color: '#737373', minWidth: 20 }}>{cur.symbol}</span>
                    <span>{cur.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu button */}
          <Side />
        </div>
      </div>
    </header>
  );
}

export default Header;
