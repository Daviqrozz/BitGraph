import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Header from './components/cabeçalho/header'
import Valor from './components/valor/valor'
import Buttons from './components/botoes/index'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header />
  </React.StrictMode>,
)
ReactDOM.createRoot(document.getElementById('footer')).render(
  <React.StrictMode>
    <Valor />
    <Buttons />
  </React.StrictMode>,
)
