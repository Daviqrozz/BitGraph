import React, { useContext } from 'react';
import './header.css';
import { MyContext } from '../../Context';
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css';

const options = [
  { value: 'BRL', label: 'Real' },
  { value: 'USDT', label: 'Dolar' },
  { value: 'EUR', label: 'Euro' }
]

function Header() {

    const {setValue} = useContext(MyContext)
    
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
                <p>Moeda:</p>
                <Select
                options={options}
                onChange={(selectedOption) => setValue(selectedOption.value)}
                placeholder="Selecione..."
                defaultValue={options[0]}
                />
            </div>

        </div>
    )
}
export default Header
