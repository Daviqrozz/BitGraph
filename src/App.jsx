import { useState } from 'react'
import Header from './components/cabeçalho/header'
import Valor from './components/valor/valor'
import Buttons from './components/botoes/index'


function App() {
  return (
    <div>
            <Header/>
            <Valor/>
            <Buttons/>

    </div>
  )
}

export default App
