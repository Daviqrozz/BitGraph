import React, { useContext } from 'react';
import './header.css';
import { MyContext } from '../../Context';
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css';

const options = [
  { value: 'BRL', label: 'Real / R$' },
  { value: 'USDT', label: 'Dolar / $' },
  { value: 'EUR', label: 'Euro / €' }
]

const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#000', // Cor de fundo preta
      borderColor: '#333', // Cor da borda
      color: '#000', // Cor do texto
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#555', // Borda ao passar o mouse
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff', // Cor do texto selecionado
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#000', // Cor de fundo do menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#333' : '#000', // Destaque nas opções ao focar
      color: '#fff', // Cor do texto das opções
      '&:active': {
        backgroundColor: '#F2A900', // Fundo ao clicar
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#aaa', // Cor do placeholder
    }),
  };

function Header() {

    const {setValue} = useContext(MyContext)
    
    return (

        <div className="header bg-grey d-flex justify-content-between text-white text-center ">
            <div className='center d-flex justify-content-center align-items-center'>
                <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="45" fill="white" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg></a>
            </div>

            <div>
                <h1>₿itGraph</h1>
                <span>Valor das criptomoedas em tempo real</span>
            </div>

            <div className='text-center'>
                <p>Moeda:</p>
                <Select
                options={options}
                styles={customStyles}
                onChange={(selectedOption) => setValue(selectedOption.value)}
                placeholder="Selecione..."
                defaultValue={options[0]}
                />
            </div>

        </div>
    )
}
export default Header
