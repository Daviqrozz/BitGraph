import CryptoList from '../components/cryptolist/cryptolist';
import Header from '../components/cabeçalho/header';

function Coin() {
  return (
    <div className="page-wrapper">
      <Header />
      <div className="coins-page">
        <CryptoList />
      </div>
    </div>
  );
}

export default Coin;