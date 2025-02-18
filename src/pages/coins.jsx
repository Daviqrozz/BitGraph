import Cryptolist from '../components/cryptolist/cryptolist';
import Header from '../components/cabeçalho/header';
import 'bootstrap/dist/css/bootstrap.min.css';


function Coin() {
  return (
    <div className='bg-black text-white vh-100'>
            <Header/>
            <Cryptolist/>
    </div>
  )
}
export default Coin