import Cryptolist from '../components/cryptolist/cryptolist';
import Header from '../components/cabeçalho/header';
import 'bootstrap/dist/css/bootstrap.min.css';


function Btc() {
  return (
    <div className='bg-black text-white'>
            <Header/>
            <Cryptolist/>
    </div>
  )
}
export default Btc