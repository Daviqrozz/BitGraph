import React from 'react';
import Home from './pages/home';
import Btc from './pages/btc';
import Coins from './pages/coins';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/principal" element={<Coins />} />
      </Routes>
    </Router>
  )
}

export default App
