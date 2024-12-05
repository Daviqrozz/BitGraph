import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Header from './components/cabeçalho/header'
import Valor from './components/valor/valor'
import Buttons from './components/botoes/index'
import TradingViewWidget from './components/graph/graph'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header />
    <TradingViewWidget />
  </React.StrictMode>,
)

ReactDOM.createRoot(document.getElementById('footer')).render(
  <React.StrictMode>
    <Valor />
    <Buttons />
  </React.StrictMode>,
)
