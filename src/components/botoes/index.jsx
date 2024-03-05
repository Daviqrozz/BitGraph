import './style.css'
function Buttons(){
    return(
        <div className='button_box'>
          <a className='buy' href="https://www.binance.com/pt/crypto/buy/USD/BTC"><button  className='buy'>Comprar</button></a>
          <a className='sell' href="https://www.binance.com/pt/crypto/sell/USD/BTC"><button className='sell' >Vender</button></a>
        </div>
    )
}
export default Buttons