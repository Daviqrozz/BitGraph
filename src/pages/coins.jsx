import Cryptolist from '../components/cryptolist/cryptolist';
import Header from '../components/cabeçalho/header';

function Coin() {
  return (
    <div className="page-wrapper">
      <Header />
      <div className="coins-page">
        <Cryptolist />
      </div>
    </div>
  );
}

export default Coin;