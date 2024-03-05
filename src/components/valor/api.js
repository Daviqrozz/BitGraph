import axios from "axios"

const api = axios.create({
    baseURL:'https://api.binance.com/'
})
export default api