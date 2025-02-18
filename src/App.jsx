import React from 'react';
import Home from './pages/home';
import Chart from './pages/chart';
import Coins from './pages/coins';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/principal" element={<Coins />} />
        <Route path="/chart/:symbol" element={<Chart />} />
      </Routes>
    </Router>
  )
}

export default App
