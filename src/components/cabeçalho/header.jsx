import React from 'react';
import './header.css';

function Header() {
    return (
        <div className="header_box">
            <div>
                <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="35" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg></a>
            </div>
            <div>
                <h1>BitGraph</h1>
                <span>Valor das criptomoedas em tempo real</span>
            </div>
            <div>
                <label class="theme-selector-label">
                    Moeda:
                    <select class="theme-selector" oninput="activateTheme(this.value)">
                        <option value="auto" selected="">Auto</option>
                        <option value="light">Dolar</option>
                        <option value="dark">Reak</option>
                    </select>
                </label>
            </div>
        </div>

    )
}
export default Header
