import React from 'react';
import Home from './pages/home';
import Chart from './pages/chart';
import Coins from './pages/coins';
import About from './pages/about';

import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moedas" element={<Coins />} />
        <Route path="/chart/:symbol" element={<Chart />} />
        <Route path="/sobre" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
