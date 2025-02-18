import React, { useContext } from 'react';
import Side from './sidebar'
import { MyContext } from '../../hooks/Context';
import Select from 'react-select'

import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';

const options = [
  { value: 'BRL', label: 'R$' },
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' }
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
      backgroundColor: '#0288d1', // Fundo ao clicar
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#aaa', // Cor do placeholder
  }),
};

function Header() {

  const { setValue } = useContext(MyContext)

  return (

    <div className="header bg-grey d-flex justify-content-between text-white text-center">

      <div className=' d-flex justify-content-center align-items-center'>
        <Side />
      </div>

      <div>
        <h1>₿itGraph</h1>
        <span>Valores das criptomoedas em tempo real</span>
      </div>

      <div className=' d-flex justify-content-center align-items-center text-center'>
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
