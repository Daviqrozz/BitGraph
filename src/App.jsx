import { useState } from 'react'
import Header from './components/cabeçalho/header'
import Valor from './components/valor/valor'
import Buttons from './components/botoes/index'
import TradingViewWidget from './components/grafico/grafico'

function App() {
  return (
    <div>
            <Header/>
            <Valor/>
            <TradingViewWidget />
            <Buttons/>

    </div>
  )
}

export default App
