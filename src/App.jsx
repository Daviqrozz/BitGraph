import React from 'react';
import Home from './pages/home';
import Btc from './pages/btc';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/principal" element={<Btc />} />
      </Routes>
    </Router>
  )
}

export default App
