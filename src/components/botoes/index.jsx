import './style.css'


function Buttons(){
    return(
        <div className='button_box'>
          <a className='buy' href="https://www.binance.com/pt/crypto/buy/USD/BTC" target="_blank"><button  className='buy'>Comprar</button></a>
          <a className='sell' href="https://www.binance.com/pt/crypto/sell/USD/BTC" target="_blank"><button className='sell' >Vender</button></a>
        </div>
    )
}
export default Buttons