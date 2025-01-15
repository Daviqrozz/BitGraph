import Header from '../components/cabeçalho/header'
import Valor from '../components/valor/valor'
import Buttons from '../components/botoes/index'
import TradingViewWidget from '../components/graph/graph'

import 'bootstrap/dist/css/bootstrap.min.css';


function Btc() {
  return (
    <div className='bg-black text-white'>
            <Header/>
              <TradingViewWidget />
              <Buttons/>
    </div>
  )
}
export default Btc